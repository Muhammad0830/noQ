import { GetFamousServiceListUseCase } from "@/application/analytics/usecases/GetFamousServiceListUseCase.js";
import { GetPeakHourListUseCase } from "@/application/analytics/usecases/GetPeakHourListUseCase.js";
import { GetRevenueBaseInfoUseCase } from "@/application/analytics/usecases/GetRevenueBaseInfoUseCase.js";
import { GetRevenueDiagramInfoUseCase } from "@/application/analytics/usecases/GetRevenueDiagramInfoUseCase.js";
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
);

const getRevenueDiagramInfoUseCase = new GetRevenueDiagramInfoUseCase(
    shopRepository,
    getBookingDataQuery,
);

const getFamousServiceListUseCase = new GetFamousServiceListUseCase(
    shopRepository,
    getBookingDataQuery,
);

const getPeakHourListUseCase = new GetPeakHourListUseCase(
    shopRepository,
    getBookingDataQuery,
)

export const analyticsController = new AnalyticsController(
    getRevenueBaseInfoUseCase,
    getRevenueDiagramInfoUseCase,
    getFamousServiceListUseCase,
    getPeakHourListUseCase,
)