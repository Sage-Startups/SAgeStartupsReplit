import { Router } from "express";
import { z } from "zod";
import { bots, getBotById, getBotPublicInfo } from "../bots/index.js";
import { openai } from "../openai.js";
import { storage } from "../storage.js";
import { requireAuth, getSessionUser } from "../auth.js";

// In-memory rate limit: 60 runs per user per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 60) return false;
  entry.count++;
  return true;
}

function sanitizeInput(input: string): string {
  return input.replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, 4000);
}

function generateSessionTitle(input: string): string {
  const trimmed = input.replace(/\s+/g, " ").trim();
  const title = trimmed.slice(0, 60);
  return title.charAt(0).toUpperCase() + title.slice(1) + (trimmed.length > 60 ? "…" : "");
}

// ---- /api/bots router ----

const botsRouter = Router();

// GET /api/bots
botsRouter.get("/", (_req, res) => {
  res.json(bots.map(getBotPublicInfo));
});

// GET /api/bots/:botId
botsRouter.get("/:botId", (req, res) => {
  const bot = getBotById(String(req.params.botId));
  if (!bot) {
    res.status(404).json({ message: "Bot not found" });
    return;
  }
  res.json(getBotPublicInfo(bot));
});

// POST /api/bots/:botId/run
botsRouter.post("/:botId/run", requireAuth, async (req, res) => {
  const bot = getBotById(String(req.params.botId));
  if (!bot) {
    res.status(404).json({ message: "Bot not found" });
    return;
  }

  const user = getSessionUser(req)!;

  if (!checkRateLimit(user.id)) {
    res.status(429).json({ message: "Rate limit exceeded — 60 runs per hour" });
    return;
  }

  const bodySchema = z.object({
    sessionId: z.string().uuid().optional(),
    input: z.string().min(1),
  });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    return;
  }

  const botValidation = bot.inputSchema.safeParse(parsed.data.input);
  if (!botValidation.success) {
    res.status(400).json({ message: "Input validation failed", errors: botValidation.error.flatten() });
    return;
  }

  const sanitized = sanitizeInput(parsed.data.input);

  let botSession = parsed.data.sessionId
    ? await storage.getBotSession(parsed.data.sessionId)
    : undefined;

  if (parsed.data.sessionId && !botSession) {
    res.status(404).json({ message: "Session not found" });
    return;
  }

  if (!botSession) {
    botSession = await storage.createBotSession({
      userId: user.id,
      botId: bot.id,
      title: generateSessionTitle(sanitized),
    });
  }

  await storage.createBotMessage({
    botSessionId: botSession.id,
    role: "user",
    content: sanitized,
    metadata: null,
  });

  const useJsonMode =
    bot.outputType === "colorPalette" || bot.outputType === "structuredAnalysis";

  const aiResult = await openai.runBot({
    systemPrompt: bot.systemPrompt,
    userInput: sanitized,
    jsonMode: useJsonMode,
  });

  let assistantContent = aiResult.content;
  let messageMetadata: Record<string, unknown> | null = null;

  if (bot.outputType === "logoImage" && !aiResult.error) {
    const imageResult = await openai.generateImage(aiResult.content);
    if ("url" in imageResult) {
      messageMetadata = { imageUrl: imageResult.url, prompt: aiResult.content };
      assistantContent = JSON.stringify(messageMetadata);
    } else {
      messageMetadata = { error: imageResult.error };
    }
  }

  const assistantMessage = await storage.createBotMessage({
    botSessionId: botSession.id,
    role: "assistant",
    content: assistantContent,
    metadata: messageMetadata as any,
  });

  res.json({
    sessionId: botSession.id,
    sessionTitle: botSession.title,
    message: {
      id: assistantMessage.id,
      role: assistantMessage.role,
      content: assistantMessage.content,
      metadata: assistantMessage.metadata,
      createdAt: assistantMessage.createdAt,
    },
  });
});

// ---- /api/bot-sessions router ----

const botSessionsRouter = Router();

// GET /api/bot-sessions
botSessionsRouter.get("/", requireAuth, async (req, res) => {
  const user = getSessionUser(req)!;
  const sessions = await storage.getBotSessions(user.id);
  res.json(sessions);
});

// GET /api/bot-sessions/:id
botSessionsRouter.get("/:id", requireAuth, async (req, res) => {
  const user = getSessionUser(req)!;
  const session = await storage.getBotSession(String(req.params.id));
  if (!session || session.userId !== user.id) {
    res.status(404).json({ message: "Session not found" });
    return;
  }
  const messages = await storage.getBotMessages(session.id);
  res.json({ ...session, messages });
});

// DELETE /api/bot-sessions/:id
botSessionsRouter.delete("/:id", requireAuth, async (req, res) => {
  const user = getSessionUser(req)!;
  const session = await storage.getBotSession(String(req.params.id));
  if (!session || session.userId !== user.id) {
    res.status(404).json({ message: "Session not found" });
    return;
  }
  await storage.deleteBotSession(String(req.params.id));
  res.status(204).end();
});

export { botsRouter, botSessionsRouter };
