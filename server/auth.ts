import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import type { User } from "../shared/schema.js";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getSessionUser(req: Request): User | undefined {
  return (req.session as unknown as Record<string, unknown>).user as User | undefined;
}

export function setSessionUser(req: Request, user: User): void {
  (req.session as unknown as Record<string, unknown>).user = user;
}

export function clearSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => (err ? reject(err) : resolve()));
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!getSessionUser(req)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}

export function safeUser(user: User): Omit<User, "passwordHash"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...rest } = user;
  return rest;
}
