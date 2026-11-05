export interface StartBookingUseCaseInterface {
    execute(input: StartBookingUseCaseInput): Promise<void>
}

export interface StartBookingUseCaseInput {
    id: string;
    shopId: string;
}