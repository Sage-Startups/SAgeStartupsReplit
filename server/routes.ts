import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateBotResponse } from "./services/openai";
import { insertProjectSchema, insertBotSessionSchema, insertChatMessageSchema, insertGeneratedAssetSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      // For demo purposes, using userId = 1
      const projects = await storage.getProjectsByUserId(1);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId: 1 // For demo purposes
      });
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  // Bot Sessions
  app.get("/api/projects/:projectId/sessions", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const sessions = await storage.getBotSessionsByProjectId(projectId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.post("/api/projects/:projectId/sessions", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const validatedData = insertBotSessionSchema.parse({
        ...req.body,
        projectId
      });
      const session = await storage.createBotSession(validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.get("/api/sessions/:sessionId", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const session = await storage.getBotSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  // Chat Messages
  app.get("/api/sessions/:sessionId/messages", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const messages = await storage.getChatMessagesBySessionId(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.post("/api/sessions/:sessionId/messages", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const { content } = req.body;
      
      // Get session info for bot context
      const session = await storage.getBotSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Store user message
      const userMessage = await storage.createChatMessage({
        sessionId,
        role: "user",
        content,
        metadata: null
      });

      // Get conversation history
      const history = await storage.getChatMessagesBySessionId(sessionId);
      const conversationHistory = history
        .filter(msg => msg.id !== userMessage.id)
        .map(msg => ({ role: msg.role, content: msg.content }));

      // Generate bot response
      const botResponse = await generateBotResponse(
        session.botId,
        session.botName,
        session.section,
        content,
        conversationHistory
      );

      // Store bot response
      const assistantMessage = await storage.createChatMessage({
        sessionId,
        role: "assistant",
        content: botResponse.content,
        metadata: botResponse.assets ? { assets: botResponse.assets } : null
      });

      // Store any generated assets
      if (botResponse.assets) {
        for (const asset of botResponse.assets) {
          await storage.createGeneratedAsset({
            sessionId,
            assetType: asset.type,
            title: asset.title,
            content: asset.content
          });
        }
      }

      res.json({
        userMessage,
        assistantMessage,
        assets: botResponse.assets || []
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  // Generated Assets
  app.get("/api/sessions/:sessionId/assets", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const assets = await storage.getGeneratedAssetsBySessionId(sessionId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
