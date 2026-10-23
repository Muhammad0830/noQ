import { Customer } from "@/domain/customer/entities/customer.js";
import { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
import { EmailAddress } from "@/domain/shared/value-objects/EmailAddress.js";
import { UserRole } from "@/domain/shared/value-objects/UserRole.js";
import type { PrismaClient, User } from "@prisma/client";
import type { CustomerRepositoryInterface } from
    "@/domain/customer/repositories/CustomerRepositoryInterface.js";

export class PrismaCustomerRepository implements CustomerRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async findById(customerId: CustomerId): Promise<Customer> {
        const customer = await this.prisma.user.findUnique({
            where: {
                id: customerId.toString(),
            },
        })

        if (!customer) {
            throw new Error("Customer not found");
        }

        return this.toEntity(customer);
    }

    private toEntity(customerModel: User): Customer {
        const customerId = CustomerId.create(customerModel.id);
        const email = EmailAddress.from(customerModel.email);
        const customerRole = UserRole.from(customerModel.role);

        return Customer.create({
            id: customerId,
            name: customerModel.name,
            email: email,
            role: customerRole,
            ...(customerModel.avatarUrl && {
                avatarUrl: customerModel.avatarUrl
            }),
            ...(customerModel.phoneNumber && {
                phoneNumber: customerModel.phoneNumber
            }),
        });
    }
}