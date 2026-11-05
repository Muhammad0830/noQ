import prisma from "@/db/prisma.js";
import { CreateBookingUseCase } from
    "@/application/booking/usecases/CreateBookingUseCase.js";
import { PrismaBookingRepository } from
    "@/infrastructue/persistence/booking/PrismaBookingRepository.js";
import { PrismaServiceRepository } from
    "@/infrastructue/persistence/service/PrismaServiceRepository.js";
import { BookingController } from
    "@/http/controllers/BookingController.js";
import { GetUserBookingListUseCase } from
    "@/application/booking/usecases/GetUserBookingListUseCase.js";
import { PrismaUserBookingListQuery } from
    "@/infrastructue/persistence/booking/PrismaUserBookingListQuery.js";
import { PrismaCustomerRepository } from
    "@/infrastructue/persistence/customer/PrismaCustomerRepository.js";
import { PrismaShopScheduleRepository } from
    "@/infrastructue/persistence/shop-schedule/PrismaShopScheduleRepository.js";
import { PrismaBookingAvailabilityCheckerQuery } from
    "@/infrastructue/persistence/booking/PrismaBookingAvailabiltyCheckerQuery.js";
import { CancelBookingUseCase } from
    "@/application/booking/usecases/CancelBookingUseCase.js";
import { ScheduleValidator } from
    "@/application/booking/validators/ScheduleValidator.js";
import { GetAvailableSlotsUseCase } from
    "@/application/booking/usecases/GetAvailableSlotsUseCase.js";
import { GetBookedSlotListByDateQuery } from
    "@/infrastructue/persistence/booking/GetBookedSlotListByDateQuery.js";
import { GetEmergencyBlockDataQuery } from
    "@/infrastructue/persistence/shop-block/GetEmergencyBlockDataQuery.js";
import { SlotAvailabilityValidator } from
    "@/application/booking/validators/SlotAvailabilityValidator.js";
import { BookingCreationPolicy } from "@/application/booking/policies/BookingCreationPolicy.js";
import { CancelBookingByAdminUseCase } from "@/application/booking/usecases/CancelBookingByAdminUseCase.js";
import { CompleteBookingUseCase } from "@/application/booking/usecases/CompleteBookingUseCase.js";
import { ConfirmBookingUseCase } from "@/application/booking/usecases/ConfirmBookingUseCase.js";
import { StartBookingUseCase } from "@/application/booking/usecases/StartBookingUseCase.js";
import { GetShopHistoryBookingListUseCase } from "@/application/booking/usecases/GetShopHistoryBookingListUseCase.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";
import { GetBookingDataQuery } from "@/infrastructue/persistence/booking/GetBookingDataQuery.js";

// infrastructure
const bookingRepository = new PrismaBookingRepository(prisma);
const shopRepository = new PrismaShopRepository(prisma);

const userBookingListQuery = new PrismaUserBookingListQuery(prisma);
const availabilityCheckerQuery = new PrismaBookingAvailabilityCheckerQuery(prisma);
const bookedSlotListQuery = new GetBookedSlotListByDateQuery(prisma);
const blockSlotListQuery = new GetEmergencyBlockDataQuery(prisma);
const getBookingDataQuery = new GetBookingDataQuery(prisma);

const serviceRepository = new PrismaServiceRepository(prisma);
const customerRepository = new PrismaCustomerRepository(prisma);
const scheduleRepository = new PrismaShopScheduleRepository(prisma);

// application
const scheduleValidator = new ScheduleValidator();
const slotAvailabilityValidator = new SlotAvailabilityValidator();

const bookingCreationPolicy = new BookingCreationPolicy();

const getBookingListUseCase = new GetUserBookingListUseCase(userBookingListQuery);
const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository);
const getAvailableSlotsUseCase = new GetAvailableSlotsUseCase(
    bookedSlotListQuery,
    scheduleRepository,
    serviceRepository,
    blockSlotListQuery,
    slotAvailabilityValidator,
);
const createBookingUseCase = new CreateBookingUseCase(
    bookingRepository,
    serviceRepository,
    customerRepository,
    availabilityCheckerQuery,
    scheduleRepository,
    scheduleValidator,
    bookingCreationPolicy,
);

const cancelBookingByAdminUseCase = new CancelBookingByAdminUseCase(bookingRepository);

const completeBookingUseCase = new CompleteBookingUseCase(bookingRepository);

const confirmBookingUseCase = new ConfirmBookingUseCase(bookingRepository);

const startBookingUseCase = new StartBookingUseCase(bookingRepository);

const getShopHistoryBookingListUseCase = new GetShopHistoryBookingListUseCase(
    shopRepository,
    getBookingDataQuery,
)

// http
export const bookingController = new BookingController(
    createBookingUseCase,
    getBookingListUseCase,
    getAvailableSlotsUseCase,
    cancelBookingUseCase,
    cancelBookingByAdminUseCase,
    completeBookingUseCase,
    confirmBookingUseCase,
    startBookingUseCase,
    getShopHistoryBookingListUseCase,
)
