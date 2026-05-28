import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { AuthService } from "./auth";
import { storage } from "./storage";

const router = Router();

// Sign up schema
const signUpSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  company: z.string().optional(),
  subscriptionTier: z.enum(["free", "pro", "premium"]),
});

// Sign in schema
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Sign up route
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const validatedData = signUpSchema.parse(req.body);
    const result = await AuthService.signUp(validatedData);
    
    if (result.success) {
      res.status(201).json({ 
        message: result.message,
        userId: result.userId 
      });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: "Invalid input data",
        errors: error.errors 
      });
    } else {
      console.error("Sign up error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// Sign in route
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const validatedData = signInSchema.parse(req.body);
    const result = await AuthService.signIn(validatedData);
    
    if (result.success && result.user) {
      // Set user session
      (req.session as any).userId = result.user.id;
      (req.session as any).user = result.user;
      
      res.json({ 
        message: result.message,
        user: result.user 
      });
    } else {
      res.status(401).json({ message: result.message });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: "Invalid input data",
        errors: error.errors 
      });
    } else {
      console.error("Sign in error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// Sign out route
router.post("/signout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      res.status(500).json({ message: "Failed to sign out" });
    } else {
      res.clearCookie('connect.sid');
      res.json({ message: "Signed out successfully" });
    }
  });
});

// Get current user route
router.get("/user", async (req: Request, res: Response) => {
  try {
    const session = req.session as any;
    
    if (!session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Return user without sensitive data
    const { password, emailVerificationToken, passwordResetToken, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Email verification route
router.get("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const result = await AuthService.verifyEmail(token);
    
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Resend verification email route
router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const newToken = AuthService.generateVerificationToken();
    await storage.updateUser(user.id, { emailVerificationToken: newToken });

    // Resend verification email
    await AuthService.sendWelcomeEmail(user.email, user.firstName || 'User');

    res.json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Failed to resend verification email" });
  }
});

// Test email route (temporary for debugging)
router.post("/test-email", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await AuthService.sendWelcomeEmail(email, "Test User");
    res.json({ message: "Test email sent successfully" });
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({ 
      message: "Failed to send test email", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

export default router;