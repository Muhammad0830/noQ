import { Router } from "express";
import prisma from "@/db/prisma.js";
import { staffController } from "@/composition/staff.js";

const staffRouter = Router();

staffRouter.get("/", staffController.getList);

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

staffRouter.delete("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staff.findUnique({
      where: { id, shopId: req.shop.id },
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    await prisma.staff.delete({
      where: { id, shopId: req.shop.id },
    });

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default staffRouter;
