import type { Service } from "../entities/Service.js";
import type { ServiceId } from "../value-objects/ServiceId.js";

export interface ServiceRepositoryInterface {
    save(service: Service): Promise<void>;

    findById(id: ServiceId): Promise<Service | null>;

    nextIdentity(): ServiceId;
}