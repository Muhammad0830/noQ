import { Router } from "express";
import prisma from "../../db/prisma.js";

const staffRouter = Router();

staffRouter.get("/", async (req: any, res) => {
  try {
    const members = await prisma.staff.findMany({
      where: {
        shopId: req.shop.id,
      },
      include: {
        shop: true,
      },
    });

    const staffMembers = [];
    let owner;

    for (const staff of members) {
      if (staff.userId === staff.shop.ownerId) {
        owner = staff;
        continue;
      }

      staffMembers.push(staff);
    }

    res.status(200).json({ owner, staffMembers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default staffRouter;
