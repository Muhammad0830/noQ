import prisma from "@/db/prisma.js";
import { PrismaServiceRepository } from "@/infrastructue/persistence/service/PrismaServiceRepository.js";

const serviceRepository = new PrismaServiceRepository(prisma);