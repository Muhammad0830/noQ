import { GetTrendingServiceListUseCase } from "@/application/service/usecases/GetTrendingServiceListUseCase.js";
import prisma from "@/db/prisma.js";
import { ServiceController } from "@/http/controllers/ServiceController.js";
import { GetServiceDataQuery } from "@/infrastructue/persistence/service/GetServiceDataQuery.js";
import { PrismaServiceRepository } from "@/infrastructue/persistence/service/PrismaServiceRepository.js";

const serviceRepository = new PrismaServiceRepository(prisma);

const getServiceDataQuery = new GetServiceDataQuery(prisma);

const getTrendingServiceListUseCae = new GetTrendingServiceListUseCase(getServiceDataQuery);

export const serviceController = new ServiceController(
    getTrendingServiceListUseCae
);