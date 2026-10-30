import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { EmailAddress } from "@/domain/shared/value-objects/EmailAddress.js";
import { UserRole } from "@/domain/shared/value-objects/UserRole.js";
import { User } from "@/domain/user/entities/User.js";
import { UserRepositoryInterface } from "@/domain/user/repositories/UserRepositoryInterface.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { Prisma, PrismaClient, User as UserModel } from "@prisma/client";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export class PrismaUserRepository implements UserRepositoryInterface {
    constructor(
        private readonly prisma: PrismaExecutor,
    ) { }

    async findById(userId: UserId): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId.toString() },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return this.toEntity(user);
    }

    async exists(userId: UserId): Promise<boolean> {
        const user = await this.prisma.user.findFirst({
            where: { id: userId.toString() },
        });

        return !!user;
    }

    async add(user: User): Promise<void> {
        await this.prisma.user.create({
            data: {
                id: user.getId().toString(),
                name: user.getName(),
                email: user.getEmail().toString(),
                role: user.getRole().getValue(),
                avatarUrl: user.getAvatarUrl(),
                phoneNumber: user.getPhoneNumber(),
                createdAt: user.getCreatedAt().getValue(),
                updatedAt: user.getUpdatedAt().getValue(),
            }
        })
    }

    async save(user: User): Promise<void> {
        await this.prisma.user.update({
            where: { id: user.getId().toString() },
            data: {
                id: user.getId().toString(),
                name: user.getName(),
                email: user.getEmail().toString(),
                role: user.getRole().getValue(),
                avatarUrl: user.getAvatarUrl(),
                phoneNumber: user.getPhoneNumber(),
                createdAt: user.getCreatedAt().getValue(),
                updatedAt: user.getUpdatedAt().getValue(),
            }
        })
    }

    private toEntity(model: UserModel): User {
        return User.create({
            id: UserId.create(model.id),
            name: model.name,
            email: EmailAddress.from(model.email),
            role: UserRole.from(model.role),
            avatarUrl: model.avatarUrl,
            phoneNumber: model.phoneNumber,
            createdAt: DateTime.from(model.createdAt),
            updatedAt: DateTime.from(model.updatedAt),
        })
    }
}