import { GetRevenueBaseInfoUseCase } from "@/application/analytics/usecases/GetRevenueBaseInfoUseCase.js";
import prisma from "@/db/prisma.js";
import { AnalyticsController } from "@/http/controllers/AnalyticsController.js";
import { GetBookingDataQuery } from "@/infrastructue/persistence/booking/GetBookingDataQuery.js";
import { GetReviewDataQuery } from "@/infrastructue/persistence/review/GetReviewDataQuery.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";

const shopRepository = new PrismaShopRepository(prisma);
const getBookingDataQuery = new GetBookingDataQuery(prisma);
const getReviewDataQuery = new GetReviewDataQuery(prisma);

const getRevenueBaseInfoUseCase = new GetRevenueBaseInfoUseCase(
    shopRepository,
    getBookingDataQuery,
    getReviewDataQuery,
)

export const analyticsController = new AnalyticsController(
    getRevenueBaseInfoUseCase,
)