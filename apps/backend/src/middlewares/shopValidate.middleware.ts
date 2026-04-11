import prisma from "@/db/prisma.js";

export async function shopValidateMiddleware(req: any, res: any, next: any) {
  try {
    const shopId = req.headers["x-shopid"];

    if (!shopId) {
      return res.status(401).json({ message: "No shopId" });
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        owner: true,
      },
    });

    if (!shop) {
      return res.status(401).json({ message: "Shop not found" });
    }

    req.shop = shop;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Auth middleware error" });
  }
}
