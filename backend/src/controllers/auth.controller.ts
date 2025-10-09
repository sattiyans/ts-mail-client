import { Request, Response } from "express";
import { z } from "zod";
import { createUserSvc, getUserByEmailSvc, getUserByIdSvc, updateUserSvc } from "../services/users.service";
import { sendMagicLinkEmail } from "../services/magic-link.service";
import { generateToken, verifyMagicLinkToken } from "../services/jwt.service";

const RegisterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const LoginSchema = z.object({
  email: z.string().email(),
});

export async function register(req: Request, res: Response) {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "INVALID_BODY", issues: parsed.error.flatten() });
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmailSvc(parsed.data.email);
    if (existingUser) {
      return res.status(409).json({ error: "USER_EXISTS", message: "User already exists" });
    }

    // Create new user
    const user = await createUserSvc(parsed.data);
    
    // Send magic link email
    await sendMagicLinkEmail(user.email, user.firstName, true);
    
    return res.status(201).json({ 
      success: true, 
      message: "User created successfully. Please check your email for verification link.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: "REGISTRATION_FAILED", message: e?.message || "unknown" });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "INVALID_BODY", issues: parsed.error.flatten() });
  }

  try {
    const user = await getUserByEmailSvc(parsed.data.email);
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND", message: "User not found" });
    }

    // Send magic link email
    await sendMagicLinkEmail(user.email, user.firstName, false);

    return res.status(200).json({ 
      success: true, 
      message: "Please check your email for the magic link.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: "LOGIN_FAILED", message: e?.message || "unknown" });
  }
}

export async function getProfile(req: Request, res: Response) {
  // In a real app, this would get user from JWT token
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "MISSING_USER_ID" });
  }
  
  try {
    const user = await getUserByIdSvc(userId);
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    return res.json(user);
  } catch (e: any) {
    return res.status(500).json({ error: "GET_PROFILE_FAILED", message: e?.message || "unknown" });
  }
}

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export async function verifyMagicLink(req: Request, res: Response) {
  const { token } = req.query;
  
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: "MISSING_TOKEN" });
  }

  try {
    const payload = verifyMagicLinkToken(token);
    if (!payload) {
      return res.status(400).json({ error: "INVALID_TOKEN", message: "Token is invalid or expired" });
    }

    const user = await getUserByEmailSvc(payload.email);
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    // Generate JWT token for authenticated session
    const jwtToken = generateToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: "VERIFICATION_FAILED", message: e?.message || "unknown" });
  }
}

export async function updateProfile(req: Request, res: Response) {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "MISSING_USER_ID" });
  }
  
  const parsed = UpdateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "INVALID_BODY", issues: parsed.error.flatten() });
  }

  try {
    // Filter out undefined values to satisfy exactOptionalPropertyTypes
    const updates: { firstName?: string; lastName?: string; email?: string } = {};
    if (parsed.data.firstName !== undefined) updates.firstName = parsed.data.firstName;
    if (parsed.data.lastName !== undefined) updates.lastName = parsed.data.lastName;
    if (parsed.data.email !== undefined) updates.email = parsed.data.email;
    
    const user = await updateUserSvc(userId, updates);
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    return res.json(user);
  } catch (e: any) {
    return res.status(500).json({ error: "UPDATE_PROFILE_FAILED", message: e?.message || "unknown" });
  }
}
