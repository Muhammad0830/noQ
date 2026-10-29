import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { CreateShopUseCaseInput, CreateShopUseCaseInterface, ScheduleItem, ServiceItem, ShopDetails } from "../interfaces/CreateShopUseCaseInterface.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ShopCategoryRepositoryInterface } from "@/domain/shop-category/repositories/ShopCategoryRepositoryInterface.js";
import { UserRepositoryInterface } from "@/domain/user/repositories/UserRepositoryInterface.js";
import { UserRole } from "@/domain/shared/value-objects/UserRole.js";
import { Shop } from "@/domain/shop/entities/Shop.js";
import { StorageServiceInterface } from "@/application/shared/interfaces/StorageServiceInterface.js";
import { ShopCreationUnitOfWorkInterface } from "../interfaces/ShopCreationUnitOfWorkInterface.js";
import { ShopSchedule } from "@/domain/shop-schedule/entities/ShopSchedule.js";
import { ShopScheduleRepositoryInterface } from "@/domain/shop-schedule/repositories/ShopScheduleRepositoryInterface.js";
import { DayOfWeek } from "@/domain/shop-schedule/value-objects/DayOfWeek.js";
import { ShopScheduleType } from "@/domain/shop-schedule/value-objects/ShopScheduleType.js";
import { Service } from "@/domain/service/entities/Service.js";
import { ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";
import { Money } from "@/domain/shared/value-objects/Money.js";
import { User } from "@/domain/user/entities/User.js";

interface BuildEntitiesInput {
    shopId: ShopId,
    user: User,
    categoryId: ShopCategoryId,
    shopDetails: ShopDetails,
    schedule: ScheduleItem[],
    services: ServiceItem[],
    fileName: string | null,
};

interface BuildEntitiesOutput {
    shop: Shop,
    shopSchedules: ShopSchedule[];
    services: Service[];
}

interface ValidateValuesInput {
    userId: string,
    categoryId: string
}

interface ValidateValuesOutput {
    user: User,
    categoryId: ShopCategoryId;
}

export class CreateShopUseCase implements CreateShopUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly categoryRepository: ShopCategoryRepositoryInterface,
        private readonly userRepository: UserRepositoryInterface,
        private readonly shopScheduleRepository: ShopScheduleRepositoryInterface,
        private readonly serviceRepository: ServiceRepositoryInterface,
        private readonly storageService: StorageServiceInterface,
        private readonly unitOfWork: ShopCreationUnitOfWorkInterface,
    ) { }

    async execute(input: CreateShopUseCaseInput): Promise<ShopId> {
        const { user, categoryId } = await this.validateValues({
            userId: input.shop.userId,
            categoryId: input.shop.categoryId
        });

        const shopId = this.shopRepository.nextIdentity();

        let fileName: string | null = null;

        try {
            fileName = input.shop.file
                ? await this.storageService.uploadImage(input.shop.file, "shop_images")
                : null;

            const { shop, shopSchedules, services } = this.buildEntities({
                shopId: shopId,
                shopDetails: input.shop,
                categoryId: categoryId,
                user: user,
                schedule: input.schedule,
                services: input.services,
                fileName: fileName,
            });

            const createdShopId = await this.unitOfWork.execute(async ({
                userRepository,
                shopRepository,
                shopScheduleRepository,
                serviceRepository,
            }) => {
                user.updateRole(UserRole.ADMIN);
                await userRepository.save(user);
                await shopRepository.add(shop);
                await shopScheduleRepository.addMany(shopSchedules);
                await serviceRepository.addMany(services);

                return shop.getId();
            });

            return createdShopId;
        } catch (error) {
            if (fileName) {
                try {
                    await this.storageService.removeImage([fileName], "shop_images");
                } catch (cleanupError) {
                    console.error("Failed to clean up shop image", cleanupError);
                }
            }

            throw error;
        }
    }

    private async validateValues(input: ValidateValuesInput): Promise<ValidateValuesOutput> {
        const userId = UserId.create(input.userId);
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const categoryId = ShopCategoryId.create(input.categoryId);
        const categoryExists = await this.categoryRepository.exists(categoryId);

        if (!categoryExists) {
            throw new Error("Category not found");
        }

        return { user, categoryId };
    }

    private buildEntities(input: BuildEntitiesInput): BuildEntitiesOutput {
        const shop = Shop.create({
            id: input.shopId,
            categoryId: input.categoryId,
            ownerId: input.user.getId(),
            name: input.shopDetails.name,
            address: input.shopDetails.address,
            phoneNumber: input.shopDetails.phoneNumber,
            description: input.shopDetails.description,
            logoUrl: input.shopDetails.logoUrl,
            backgroundImageUrl: input.fileName,
            isOpen: true,
        });

        const shopSchedules = input.schedule.flatMap(schedule =>
            schedule.slots.map(slot =>
                ShopSchedule.create({
                    id: this.shopScheduleRepository.nextIdentity(),
                    shopId: input.shopId,
                    dayOfWeek: DayOfWeek.from(schedule.dayOfWeek),
                    type: slot.block ? ShopScheduleType.BLOCK : ShopScheduleType.OPEN,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                })
            )
        );

        const services = input.services.map(service =>
            Service.create({
                id: this.serviceRepository.nextIdentity(),
                shopId: input.shopId,
                name: service.name,
                price: Money.fromAmount(service.price, 'UZS'),
                durationMin: service.durationMin,
                isActive: true,
                bufferTime: service.bufferTime,
                description: service.description,
            })
        );

        return { shop, shopSchedules, services }
    }
}