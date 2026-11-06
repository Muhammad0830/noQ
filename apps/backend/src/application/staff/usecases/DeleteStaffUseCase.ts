import { StaffRepositoryInterface } from "@/domain/staff/repositories/StaffRepositoryInterface.js";
import { DeleteStaffUseCaseInterface } from "../interfaces/DeleteStaffUseCaseInterface.js";
import { StaffId } from "@/domain/staff/value-objects/StaffId.js";

export class DeleteStaffUseCase implements DeleteStaffUseCaseInterface {
    constructor(
        private readonly staffRepository: StaffRepositoryInterface,
    ) { }

    async execute(id: string): Promise<void> {
        const staffId = StaffId.create(id);

        await this.staffRepository.ensureExists(staffId);

        await this.staffRepository.delete(staffId);
    }
}