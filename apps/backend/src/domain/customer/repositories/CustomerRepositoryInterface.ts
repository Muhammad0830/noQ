import type { Customer } from "../entities/customer.js";
import type { CustomerId } from "../value-objects/CustomerId.js";

export interface CustomerRepositoryInterface {
    findById(customerId: CustomerId): Promise<Customer>;
}