import express from "express";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import prisma from "@/db/prisma.js";
import { supabase } from "@/config/supabase.js";
import { authController } from "@/composition/auth.js";
import { validateQuery } from "@/http/middlewares/validate.middleware.js";
import { checkEmailExistsSchema } from "@/http/validators/auth/CheckEmailExistsSchema.js";

const router = express.Router();

router.get(
  "/check-email",
  validateQuery(checkEmailExistsSchema),
  authController.checkEmail
);

router.get(
  "/me",
  authMiddleware,
  authController.getUser
);

router.post("/signup", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  const name = req.body.name?.trim();
  const phoneNumber = req.body.phoneNumber?.trim();

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });

  if (error || !data.user) {
    return res.status(400).json({ error: error?.message });
  }

  try {
    // Keep local Prisma profile in sync, but do not block auth if this fails.
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: {
        email: normalizedEmail,
      },
      create: {
        id: data.user.id,
        email: normalizedEmail,
        name: name ?? normalizedEmail.split("@")[0],
        phoneNumber: phoneNumber,
      },
    });
  } catch (profileError) {
    console.error("Signup profile sync failed:", profileError);
  }

  res.status(201).json({
    user: {
      id: data.user.id,
      email: data.user.email,
      phoneNumber: phoneNumber,
      name: name ?? normalizedEmail.split("@")[0],
    },
    access_token: data.session?.access_token ?? null,
    refresh_token: data.session?.refresh_token ?? null,
  });
});

router.post("/signin", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({
      success: false,
      error: error.message,
      data: null,
    });
  }

  if (!data.session || !data.user) {
    return res.status(500).json(
      {
        success: false,
        error: "Login failed",
        data: null,
      });
  }

  const userMetadataName =
    typeof data.user.user_metadata?.name === "string"
      ? data.user.user_metadata.name.trim()
      : "";

  try {
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: {
        email: data.user.email ?? email,
        ...(userMetadataName ? { name: userMetadataName } : {}),
      },
      create: {
        id: data.user.id,
        email: data.user.email ?? email,
        name: userMetadataName || email.split("@")[0],
      },
    });
  } catch (profileError) {
    console.error("Signin profile sync failed:", profileError);
  }

  let userData = {
    id: data.user.id,
    email: data.user.email,
    name: userMetadataName || email.split("@")[0],
    phoneNumber: "" as string | undefined,
    avatarUrl: "" as string | undefined,
  };

  // Try to get phone number from Prisma
  try {
    const prismaUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { phoneNumber: true, name: true, avatarUrl: true },
    });
    if (prismaUser) {
      userData.phoneNumber = prismaUser.phoneNumber || undefined;
      userData.name = prismaUser.name;
      userData.avatarUrl = prismaUser.avatarUrl || undefined;
    }
  } catch (err) {
    // Silently fail, not critical
  }

  res.json({
    success: true,
    data: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: userData,
    }
  });
});

export default router;
