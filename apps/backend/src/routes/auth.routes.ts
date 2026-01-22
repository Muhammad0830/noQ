import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import prisma from "../db/prisma.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        shops: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

router.post("/signup", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  const name = req.body.name?.trim();

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
    // Create Prisma profile
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: {
        email: normalizedEmail,
      },
      create: {
        id: data.user.id,
        email: normalizedEmail,
        name: name ?? "",
      },
    });

    res.status(201).json({
      id: data.user.id,
      email: data.user.email,
    });
  } catch (error) {
    await supabase.auth.admin.deleteUser(data.user.id);
    res.status(500).json({ error: "Failed to create user profile" });
  }
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
    return res.status(401).json({ error: error.message });
  }

  if (!data.session || !data.user) {
    return res.status(500).json({ error: "Login failed" });
  }

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
});

export default router;
