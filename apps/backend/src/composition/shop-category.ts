import { CreateShopCategoryUseCase } from "@/application/shop-category/usecases/CreateShopCategoryUseCase.js";
import { GetAllShopCategoryListUseCase } from "@/application/shop-category/usecases/GetAllShopCategoryListUseCase.js";
import prisma from "@/db/prisma.js";
import { ShopCategoryController } from "@/http/controllers/ShopCategoryController.js";
import { PrismaShopCategoryRepository } from "@/infrastructue/persistence/shop-category/PrismaShopCategoryRepository.js";

const shopCategoryRepository = new PrismaShopCategoryRepository(prisma);

const getAllShopCategoryListUsecase = new GetAllShopCategoryListUseCase(shopCategoryRepository);
const createShopCategoryUseCase = new CreateShopCategoryUseCase(shopCategoryRepository);

export const shopCategoryController = new ShopCategoryController(
    getAllShopCategoryListUsecase,
    createShopCategoryUseCase
);