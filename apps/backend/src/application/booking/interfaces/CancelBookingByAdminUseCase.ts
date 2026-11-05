export interface CancelBookingByAdminUseCaseInterface {
    execute(input: CancelBookingByAdminUseCaseInput): Promise<void>;
}

export interface CancelBookingByAdminUseCaseInput {
    id: string;
    shopId: string;
    reason: string;
}