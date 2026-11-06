import { StaffItem } from "./GetStaffDataQueryInterface.js";

export interface GetStaffListUseCaseInterface {
    execute(shopId: string): Promise<StaffItem[]>
}