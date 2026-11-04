export interface GetPeakHourListUseCaseInterface {
    execute(input: GetPeakHourListUseCaseInput): Promise<PeakHourItem[]>
}

export interface GetPeakHourListUseCaseInput {
    shopId: string;
    startTime: string;
    endTime: string;
}

export interface PeakHourItem {
    hour: string;
    count: number;
}