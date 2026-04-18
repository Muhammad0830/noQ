import { Router } from "express";
import prisma from "../../db/prisma.js";

const staffRouter = Router();

staffRouter.get("/", async (req: any, res) => {
  try {
    const { search } = req.query;

    const staffMembers = await prisma.staff.findMany({
      where: {
        shopId: req.shop.id,
        role: "STAFF",
        OR: [
          {
            user: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        shop: true,
        user: true,
      },
    });

    const owner = await prisma.staff.findMany({
      where: {
        shopId: req.shop.id,
        role: "OWNER",
      },
      include: {
        shop: true,
        user: true,
      },
    });

    res.status(200).json({ owner, staffMembers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

staffRouter.post("/", async (req: any, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.staff.create({
      data: {
        shopId: req.shop.id,
        userId: user.id,
        role: "STAFF",
      },
    });

    res.status(200).json({ message: "Staff added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

staffRouter.get("/staffSearch", async (req: any, res) => {
  try {
    const { email } = req.query;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(200).json({ message: "User not found", result: false });
    } else {
      return res.status(200).json({ message: "Staff found", result: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default staffRouter;
