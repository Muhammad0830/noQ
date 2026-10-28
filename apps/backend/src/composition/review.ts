import { CreateReviewUseCase } from "@/application/review/usecases/CreateReviewUseCase.js";
import { FindReviewByIdUseCase } from "@/application/review/usecases/FindReviewByIdUseCase.js";
import { GetAllReviewUseCase } from "@/application/review/usecases/GetAllReviewsUseCase.js";
import { GetReviewListByShopIdUseCase } from "@/application/review/usecases/GetReviewListByShopIdUseCase.js";
import prisma from "@/db/prisma.js";
import { ReviewController } from "@/http/controllers/ReviewController.js";
import { GetReviewDataQuery } from "@/infrastructue/persistence/review/GetReviewDataQuery.js";
import { PrismaReviewRepository } from "@/infrastructue/persistence/review/PrismaReviewRepository.js";
import { PrismaServiceRepository } from "@/infrastructue/persistence/service/PrismaServiceRepository.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";

const getReviewDataQuery = new GetReviewDataQuery(prisma);

const reviewRepository = new PrismaReviewRepository(prisma);
const shopRepository = new PrismaShopRepository(prisma);
const serviceRepository = new PrismaServiceRepository(prisma);

const getReviewListByShopIdUseCase = new GetReviewListByShopIdUseCase(reviewRepository);
const getAllReviewsUseCase = new GetAllReviewUseCase(reviewRepository);
const findReviewByIdUseCase = new FindReviewByIdUseCase(getReviewDataQuery);
const createReviewUseCase = new CreateReviewUseCase(
    reviewRepository,
    shopRepository,
    serviceRepository,
);

export const reviewController = new ReviewController(
    getAllReviewsUseCase,
    getReviewListByShopIdUseCase,
    findReviewByIdUseCase,
    createReviewUseCase,
);