import { Router } from "express";
import prisma from "@/db/prisma.js";
import { staffController } from "@/composition/staff.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { createStaffSchema } from "@/http/validators/staff/CreateStaffSchema.js";

const staffRouter = Router();

staffRouter.get("/", staffController.getList);

staffRouter.post(
  "/",
  validateBody(createStaffSchema),
  staffController.create
)

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
