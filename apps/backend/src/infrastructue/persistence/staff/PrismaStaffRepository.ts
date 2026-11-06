import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { UserPosition } from "@/domain/shared/value-objects/UserPosition.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { Staff } from "@/domain/staff/entities/Staff.js";
import { StaffRepositoryInterface } from "@/domain/staff/repositories/StaffRepositoryInterface.js";
import { StaffId } from "@/domain/staff/value-objects/StaffId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { PrismaClient, Staff as StaffModel } from "@prisma/client";

export class PrismaStaffRepository implements StaffRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async findById(staffId: StaffId): Promise<Staff> {
        const staff = await this.prisma.staff.findUnique({
            where: { id: staffId.toString() },
        });

        if (!staff) {
            throw new Error("Staff not found");
        }

        return this.toEntity(staff);
    }

    async add(staff: Staff): Promise<void> {
        await this.prisma.staff.create({
            data: {
                id: staff.getId().toString(),
                userId: staff.getUserId().toString(),
                shopId: staff.getShopId().toString(),
                role: staff.getPosition().getValue(),
                createdAt: staff.getCreatedAt().getValue(),
                updatedAt: staff.getUpdatedAt().getValue(),
            }
        })
    }

    async save(staff: Staff): Promise<void> {
        await this.prisma.staff.update({
            where: { id: staff.getId().toString() },
            data: {
                id: staff.getId().toString(),
                userId: staff.getUserId().toString(),
                shopId: staff.getShopId().toString(),
                role: staff.getPosition().getValue(),
                updatedAt: staff.getUpdatedAt().getValue(),
            }
        });
    }

    async exists(staffId: StaffId): Promise<boolean> {
        const staff = await this.prisma.staff.findUnique({
            where: { id: staffId.toString() },
        });

        return !!staff;
    }

    async ensureExists(staffId: StaffId): Promise<void> {
        const exists = await this.exists(staffId);

        if (!exists) {
            throw new Error("Staff not found");
        }
    }

    async delete(staffId: StaffId): Promise<void> {
        await this.prisma.staff.delete({
            where: { id: staffId.toString() },
        });
    }

    nextIdentity(): StaffId {
        return StaffId.create();
    }

    private toEntity(model: StaffModel): Staff {
        return Staff.create({
            id: StaffId.create(model.id),
            userId: UserId.create(model.userId),
            shopId: ShopId.create(model.shopId),
            position: UserPosition.from(model.role),
            createdAt: DateTime.from(model.createdAt),
            updatedAt: DateTime.from(model.updatedAt),
        })
    }
}