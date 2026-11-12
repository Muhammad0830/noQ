import { GetBookingListByDateTimeUseCase } from "@/application/booking/usecases/GetBookingListByDateTimeUseCase.js";
import { GetDashboardStatisticsUseCase } from "@/application/dashboard/usecases/GetDashboardStatisticsUseCase.js";
import prisma from "@/db/prisma.js";
import { DashboardController } from "@/http/controllers/dashboardController.js";
import { GetBookingDataQuery } from "@/infrastructue/persistence/booking/GetBookingDataQuery.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";
import { GetStaffDataQuery } from "@/infrastructue/persistence/staff/GetStaffDataQuery.js";

const getBookingDataQuery = new GetBookingDataQuery(prisma);
const getStaffDataQuery = new GetStaffDataQuery(prisma);
const shopRepository = new PrismaShopRepository(prisma);

const getDashboardStatisticsUseCase = new GetDashboardStatisticsUseCase(
    shopRepository,
    getBookingDataQuery,
    getStaffDataQuery,
)

const getBookingListByDateTimeUseCase = new GetBookingListByDateTimeUseCase(
    shopRepository,
    getBookingDataQuery,
)

export const dashboardController = new DashboardController(
    getDashboardStatisticsUseCase,
    getBookingListByDateTimeUseCase,
);