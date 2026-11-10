export interface CreateEmergencyBlockUseCaseInterface {
    execute(input: CreateEmergencyBlockInput): Promise<void>
}

export interface CreateEmergencyBlockInput {
    shopId: string;
    blockList: {
        startTime: string;
        endTime: string;
        reason: string;
    }[];
}