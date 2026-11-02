import { EmergencyBlockDTO } from "@/application/shop-block/interfaces/GetEmergencyBlockListQueryInterface.js";

export interface GetEmergencyBlockListUseCaseInterface {
    execute(id: string): Promise<EmergencyBlockDTO>;
}