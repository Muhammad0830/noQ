import { CreateStaffUseCaseInput, CreateStaffUseCaseInterface } from "../interfaces/CreateStaffUseCaseInterface.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { StaffRepositoryInterface } from "@/domain/staff/repositories/StaffRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { Staff } from "@/domain/staff/entities/Staff.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { UserRepositoryInterface } from "@/domain/user/repositories/UserRepositoryInterface.js";
import { UserPosition } from "@/domain/shared/value-objects/UserPosition.js";

export class CreateStaffUseCase implements CreateStaffUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly userRepository: UserRepositoryInterface,
        private readonly staffRepository: StaffRepositoryInterface,
    ) { }

    async execute(input: CreateStaffUseCaseInput): Promise<void> {
        const shopId = ShopId.create(input.shopId);

        await this.shopRepository.ensureExists(shopId);

        const userId = UserId.create(input.userId);

        await this.userRepository.ensureExists(userId);

        const staff = Staff.create({
            id: this.staffRepository.nextIdentity(),
            userId: userId,
            shopId: shopId,
            position: UserPosition.from(input.position),
        });

        await this.staffRepository.add(staff);
    }
}