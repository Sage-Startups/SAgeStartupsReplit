import type { Express } from 'express';
import { db } from '../db';
import { isAuthenticated } from '../replitAuth';
import { z } from 'zod';
import { botPrograms, insertBotProgramSchema } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

const createBotProgramSchema = z.object({
  botId: z.string(),
  name: z.string(),
  description: z.string(),
  trigger: z.enum(['manual', 'scheduled', 'event', 'api']),
  schedule: z.string().optional(),
  event: z.string().optional(),
  enabled: z.boolean(),
  instructions: z.string(),
  parameters: z.record(z.any()).optional()
});

export function registerBotProgramRoutes(app: Express) {
  // Get all bot programs for the user
  app.get('/api/bot-programs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const programs = await db.select()
        .from(botPrograms)
        .where(eq(botPrograms.userId, userId));
      
      res.json(programs);
    } catch (error) {
      console.error('Error fetching bot programs:', error);
      res.status(500).json({ message: 'Failed to fetch bot programs' });
    }
  });

  // Create a new bot program
  app.post('/api/bot-programs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = createBotProgramSchema.parse(req.body);
      
      const [program] = await db.insert(botPrograms)
        .values({
          ...parsed,
          userId,
          status: 'idle',
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      res.json(program);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      } else {
        console.error('Error creating bot program:', error);
        res.status(500).json({ message: 'Failed to create bot program' });
      }
    }
  });

  // Update a bot program
  app.put('/api/bot-programs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const programId = parseInt(req.params.id);
      
      const [program] = await db.update(botPrograms)
        .set({
          ...req.body,
          updatedAt: new Date()
        })
        .where(and(
          eq(botPrograms.id, programId),
          eq(botPrograms.userId, userId)
        ))
        .returning();
      
      if (!program) {
        return res.status(404).json({ message: 'Bot program not found' });
      }
      
      res.json(program);
    } catch (error) {
      console.error('Error updating bot program:', error);
      res.status(500).json({ message: 'Failed to update bot program' });
    }
  });

  // Execute a bot program
  app.post('/api/bot-programs/:id/execute', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const programId = parseInt(req.params.id);
      
      // Get the program
      const [program] = await db.select()
        .from(botPrograms)
        .where(and(
          eq(botPrograms.id, programId),
          eq(botPrograms.userId, userId)
        ));
      
      if (!program) {
        return res.status(404).json({ message: 'Bot program not found' });
      }
      
      if (!program.enabled) {
        return res.status(400).json({ message: 'Bot program is disabled' });
      }
      
      // Update status to running
      await db.update(botPrograms)
        .set({
          status: 'running',
          lastRun: new Date(),
          updatedAt: new Date()
        })
        .where(eq(botPrograms.id, programId));
      
      // TODO: Implement actual bot execution logic
      // For now, we'll simulate execution
      setTimeout(async () => {
        await db.update(botPrograms)
          .set({
            status: 'completed',
            updatedAt: new Date()
          })
          .where(eq(botPrograms.id, programId));
      }, 3000);
      
      res.json({ message: 'Bot program execution started' });
    } catch (error) {
      console.error('Error executing bot program:', error);
      res.status(500).json({ message: 'Failed to execute bot program' });
    }
  });

  // Delete a bot program
  app.delete('/api/bot-programs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const programId = parseInt(req.params.id);
      
      const result = await db.delete(botPrograms)
        .where(and(
          eq(botPrograms.id, programId),
          eq(botPrograms.userId, userId)
        ));
      
      res.json({ message: 'Bot program deleted' });
    } catch (error) {
      console.error('Error deleting bot program:', error);
      res.status(500).json({ message: 'Failed to delete bot program' });
    }
  });
}