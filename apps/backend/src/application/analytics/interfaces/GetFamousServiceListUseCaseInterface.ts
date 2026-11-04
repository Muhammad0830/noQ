export interface GetFamousServiceListUseCaseInterface {
    execute(input: GetFamousServiceListInput): Promise<FamousServiceItem[]>
}

export interface GetFamousServiceListInput {
    shopId: string;
    startTime: string;
    endTime: string;
}

export interface FamousServiceItem {
    id: string;
    name: string;
    bookingCount: number;
}