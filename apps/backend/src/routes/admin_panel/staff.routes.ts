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
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default staffRouter;
