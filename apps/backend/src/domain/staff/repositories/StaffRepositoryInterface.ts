import { Staff } from "../entities/Staff.js";
import { StaffId } from "../value-objects/StaffId.js";

export interface StaffRepositoryInterface {
    findById(staffId: StaffId): Promise<Staff>;

    add(staff: Staff): Promise<void>;

    save(staff: Staff): Promise<void>;

    nextIdentity(): StaffId;
}