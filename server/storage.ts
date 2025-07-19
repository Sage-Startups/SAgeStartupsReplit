import { users, projects, botSessions, chatMessages, generatedAssets, type User, type InsertUser, type Project, type InsertProject, type BotSession, type InsertBotSession, type ChatMessage, type InsertChatMessage, type GeneratedAsset, type InsertGeneratedAsset } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  
  getBotSession(id: number): Promise<BotSession | undefined>;
  getBotSessionsByProjectId(projectId: number): Promise<BotSession[]>;
  createBotSession(session: InsertBotSession): Promise<BotSession>;
  
  getChatMessagesBySessionId(sessionId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  getGeneratedAssetsBySessionId(sessionId: number): Promise<GeneratedAsset[]>;
  createGeneratedAsset(asset: InsertGeneratedAsset): Promise<GeneratedAsset>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private botSessions: Map<number, BotSession>;
  private chatMessages: Map<number, ChatMessage>;
  private generatedAssets: Map<number, GeneratedAsset>;
  private currentUserId: number;
  private currentProjectId: number;
  private currentSessionId: number;
  private currentMessageId: number;
  private currentAssetId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.botSessions = new Map();
    this.chatMessages = new Map();
    this.generatedAssets = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentSessionId = 1;
    this.currentMessageId = 1;
    this.currentAssetId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now,
      updatedAt: now,
      description: insertProject.description || null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = {
      ...project,
      ...updates,
      updatedAt: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async getBotSession(id: number): Promise<BotSession | undefined> {
    return this.botSessions.get(id);
  }

  async getBotSessionsByProjectId(projectId: number): Promise<BotSession[]> {
    return Array.from(this.botSessions.values()).filter(
      (session) => session.projectId === projectId,
    );
  }

  async createBotSession(insertSession: InsertBotSession): Promise<BotSession> {
    const id = this.currentSessionId++;
    const session: BotSession = { 
      ...insertSession, 
      id, 
      createdAt: new Date()
    };
    this.botSessions.set(id, session);
    return session;
  }

  async getChatMessagesBySessionId(sessionId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((message) => message.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date(),
      metadata: insertMessage.metadata || null
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getGeneratedAssetsBySessionId(sessionId: number): Promise<GeneratedAsset[]> {
    return Array.from(this.generatedAssets.values())
      .filter((asset) => asset.sessionId === sessionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createGeneratedAsset(insertAsset: InsertGeneratedAsset): Promise<GeneratedAsset> {
    const id = this.currentAssetId++;
    const asset: GeneratedAsset = { 
      ...insertAsset, 
      id, 
      createdAt: new Date()
    };
    this.generatedAssets.set(id, asset);
    return asset;
  }
}

export const storage = new MemStorage();
