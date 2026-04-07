import { Router } from "express";
import prisma from "../db/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import {
  resolveRequestLanguage,
  translateCategoryName,
} from "../utils/categoryTranslations.js";
const categoryRouter = Router();

categoryRouter.get("/", async (req, res) => {
  const language = resolveRequestLanguage({
    queryLang: typeof req.query.lang === "string" ? req.query.lang : null,
    xLanguageHeader:
      typeof req.headers["x-language"] === "string"
        ? req.headers["x-language"]
        : null,
    acceptLanguageHeader:
      typeof req.headers["accept-language"] === "string"
        ? req.headers["accept-language"]
        : null,
  });

  const categories = await prisma.shopCategory.findMany({
    include: {
      _count: {
        select: { shops: true },
      },
    },
  });

  const localizedCategories = categories.map((category) => ({
    ...category,
    name: translateCategoryName(category.name, language),
  }));

  res.status(200).json(localizedCategories);
});

categoryRouter.post(
  "/",
  authMiddleware,
  adminOnly,
  async (req: any, res: any) => {
    const { name, icon } = req.body;

    const category = await prisma.shopCategory.create({
      data: { name, icon },
    });

    res.status(200).json(category);
  },
);

export default categoryRouter;
