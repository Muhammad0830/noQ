import prisma from "../db/prisma.js";

export async function adminOnly(req: any, res: any, next: any) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admins only",
    });
  }

  next();
}
