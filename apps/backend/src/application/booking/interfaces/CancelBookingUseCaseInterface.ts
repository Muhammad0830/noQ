export interface CancelBookingUseCaseInput {
    id: string,
    userId: string,
    reason?: string
}

export interface CancelBookingUseCaseInterface {
    execute(input: CancelBookingUseCaseInput): Promise<void>;
}