import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

// Only use WebSocket in production or when explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_WEBSOCKET) {
  neonConfig.webSocketConstructor = ws;
} else {
  // In development, disable WebSocket to use regular connection pooling
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineConnect = false;
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  maxUses: 7500,
  maxLifetimeSeconds: 600
});
export const db = drizzle({ client: pool, schema });