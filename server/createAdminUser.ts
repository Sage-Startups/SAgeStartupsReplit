import { AuthService } from "./auth";
import { storage } from "./storage";
import { v4 as uuidv4 } from "uuid";

async function createAdminUser() {
  try {
    const adminData = {
      id: uuidv4(),
      email: "admin@sage-startups.com",
      password: await AuthService.hashPassword("admin123"),
      firstName: "Super",
      lastName: "Admin",
      role: "super_admin",
      subscriptionTier: "premium",
      emailVerified: true,
      emailVerificationToken: null,
    };

    const existingUser = await storage.getUserByEmail(adminData.email);
    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    const user = await storage.createUser(adminData);
    console.log("Admin user created successfully:", {
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Failed to create admin user:", error);
  }
}

createAdminUser();