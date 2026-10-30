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
import { GetBlockSlotListQuery } from
    "@/infrastructue/persistence/shop-block/GetBlockSlotListQuery.js";
import { SlotAvailabilityValidator } from
    "@/application/booking/validators/SlotAvailabilityValidator.js";
import { BookingCreationPolicy } from "@/application/booking/policies/BookingCreationPolicy.js";

// infrastructure
const bookingRepository = new PrismaBookingRepository(prisma);
const userBookingListQuery = new PrismaUserBookingListQuery(prisma);
const availabilityCheckerQuery = new PrismaBookingAvailabilityCheckerQuery(prisma);
const bookedSlotListQuery = new GetBookedSlotListByDateQuery(prisma);
const blockSlotListQuery = new GetBlockSlotListQuery(prisma);

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

// http
export const bookingController = new BookingController(
    createBookingUseCase,
    getBookingListUseCase,
    cancelBookingUseCase,
    getAvailableSlotsUseCase,
)
