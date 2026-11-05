export interface CompleteBookingUseCaseInterface {
    execute(input: CompleteBookingUseCaseInput): Promise<void>;
}

export interface CompleteBookingUseCaseInput {
    id: string;
    shopId: string;
}