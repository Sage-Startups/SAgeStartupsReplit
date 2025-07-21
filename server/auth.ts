import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import sgMail from "@sendgrid/mail";
import { storage } from "./storage";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
  subscriptionTier: "free" | "pro" | "premium";
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static async signUp(userData: SignUpData): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, message: "An account with this email already exists" };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);
      
      // Generate user ID and verification token
      const userId = uuidv4();
      const verificationToken = this.generateVerificationToken();

      // Create user
      const newUser = await storage.createUser({
        id: userId,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        company: userData.company || null,
        subscriptionTier: userData.subscriptionTier,
        emailVerificationToken: verificationToken,
        emailVerified: false,
      });

      // Send welcome email
      await this.sendWelcomeEmail(userData.email, userData.firstName, verificationToken);

      return { success: true, message: "Account created successfully", userId: newUser.id };
    } catch (error) {
      console.error("SignUp error:", error);
      return { success: false, message: "Failed to create account. Please try again." };
    }
  }

  static async signIn(credentials: SignInData): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      // Find user by email
      const user = await storage.getUserByEmail(credentials.email);
      if (!user) {
        return { success: false, message: "Invalid email or password" };
      }

      // Check password
      const isValidPassword = await this.comparePassword(credentials.password, user.password);
      if (!isValidPassword) {
        return { success: false, message: "Invalid email or password" };
      }

      // Check if email is verified
      if (!user.emailVerified) {
        return { success: false, message: "Please verify your email address before signing in" };
      }

      // Update last active
      await storage.updateUser(user.id, { lastActive: new Date() });

      // Return user without password
      const { password, emailVerificationToken, passwordResetToken, ...safeUser } = user;
      return { success: true, message: "Signed in successfully", user: safeUser };
    } catch (error) {
      console.error("SignIn error:", error);
      return { success: false, message: "Failed to sign in. Please try again." };
    }
  }

  static async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return { success: false, message: "Invalid or expired verification token" };
      }

      await storage.updateUser(user.id, {
        emailVerified: true,
        emailVerificationToken: null,
      });

      return { success: true, message: "Email verified successfully" };
    } catch (error) {
      console.error("Email verification error:", error);
      return { success: false, message: "Failed to verify email" };
    }
  }

  static async sendWelcomeEmail(email: string, firstName: string, verificationToken: string): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log("SendGrid not configured, skipping email");
      return;
    }

    const verificationUrl = `${process.env.APP_URL || 'http://localhost:5000'}/verify-email?token=${verificationToken}`;

    const msg = {
      to: email,
      from: 'noreply@sage-startups.com', // Use your verified sender
      subject: 'Welcome to Sage-Startups! Please verify your email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Sage-Startups!</h1>
          </div>
          
          <div style="padding: 40px 20px; background-color: #f8fafc;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${firstName},</h2>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining Sage-Startups! We're excited to help you build your brand with our AI-powered tools.
            </p>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 30px;">
              To get started, please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #3b82f6;">${verificationUrl}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              If you didn't create an account with us, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log("Welcome email sent successfully to:", email);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  }
}