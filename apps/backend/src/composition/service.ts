import { GetServiceDetailsUseCase } from "@/application/service/usecases/GetServiceDetailsUseCase.js";
import { GetServiceReviewListUseCase } from "@/application/service/usecases/GetServiceRewiewListUseCase.js";
import { GetShopServiceListUseCase } from "@/application/service/usecases/GetShopServiceListUseCase.js";
import { GetTrendingServiceListUseCase } from "@/application/service/usecases/GetTrendingServiceListUseCase.js";
import prisma from "@/db/prisma.js";
import { ServiceController } from "@/http/controllers/ServiceController.js";
import { GetServiceDataQuery } from "@/infrastructue/persistence/service/GetServiceDataQuery.js";
import { PrismaServiceRepository } from "@/infrastructue/persistence/service/PrismaServiceRepository.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";

const serviceRepository = new PrismaServiceRepository(prisma);
const shopRepository = new PrismaShopRepository(prisma);

const getServiceDataQuery = new GetServiceDataQuery(prisma);

const getTrendingServiceListUseCase = new GetTrendingServiceListUseCase(getServiceDataQuery);
const getServiceDetailsUseCase = new GetServiceDetailsUseCase(getServiceDataQuery);
const getServiceReviewListUseCase = new GetServiceReviewListUseCase(getServiceDataQuery);

const getShopServiceListUseCase = new GetShopServiceListUseCase(
    shopRepository,
    getServiceDataQuery,
)

export const serviceController = new ServiceController(
    getTrendingServiceListUseCase,
    getServiceDetailsUseCase,
    getServiceReviewListUseCase,
    getShopServiceListUseCase,
);