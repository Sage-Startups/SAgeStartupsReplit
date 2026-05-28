import OpenAI from "openai";

export interface BotResponse {
  content: string;
  error?: string;
}

interface RunBotOptions {
  systemPrompt: string;
  userInput: string;
  jsonMode?: boolean;
}

const unavailable = {
  runBot: async (_opts: RunBotOptions): Promise<BotResponse> => ({
    content: "",
    error: "AI unavailable — OPENAI_API_KEY not configured",
  }),
  generateImage: async (_prompt: string): Promise<{ url: string } | { error: string }> => ({
    error: "AI unavailable — OPENAI_API_KEY not configured",
  }),
};

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

async function runBot({ systemPrompt, userInput, jsonMode = false }: RunBotOptions): Promise<BotResponse> {
  try {
    const res = await getClient().chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
      response_format: jsonMode ? { type: "json_object" } : { type: "text" },
    });
    return { content: res.choices[0]?.message?.content ?? "" };
  } catch (err) {
    return { content: "", error: (err as Error).message };
  }
}

async function generateImage(prompt: string): Promise<{ url: string } | { error: string }> {
  try {
    const res = await getClient().images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    return { url: res.data?.[0]?.url ?? "" };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export const openai = process.env.OPENAI_API_KEY
  ? { runBot, generateImage }
  : unavailable;
