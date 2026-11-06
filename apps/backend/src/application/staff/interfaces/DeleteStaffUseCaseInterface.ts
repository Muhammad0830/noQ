export interface DeleteStaffUseCaseInterface {
    execute(staffId: string): Promise<void>;
}