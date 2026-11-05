export interface ConfirmBookingUseCaseInterface {
    execute(input: ConfirmBookingUseCaseInput): Promise<void>
}

export interface ConfirmBookingUseCaseInput {
    id: string;
    shopId: string;
}