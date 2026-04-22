import prisma from "../db/prisma.js";

export async function shopValidateMiddleware(req: any, res: any, next: any) {
  try {
    const headerShopId = req.headers["x-shopid"] ?? req.headers["x-shop-id"];
    const rawShopId = Array.isArray(headerShopId)
      ? headerShopId[0]
      : headerShopId ?? req.query?.shopId;
    const shopId = typeof rawShopId === "string" ? rawShopId.trim() : "";

    if (!shopId) {
      return res.status(400).json({ message: "No shopId" });
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

    if (req.user.id !== shop.ownerId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.shop = shop;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Auth middleware error" });
  }
}
