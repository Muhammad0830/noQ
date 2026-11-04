export type DiagramInterval = "day" | "month" | "year";

export interface GetRevenueDiagramInfoUseCaseInterface {
    execute(input: RevenueDiagramInput): Promise<RevenueDiagramDTO>;
}

export interface RevenueDiagramDTO {
    data: RevenueDiagramItem[];
}

export interface RevenueDiagramItem {
    date: string;
    revenue: number;
}

export interface RevenueDiagramInput {
    shopId: string;
    startTime: string;
    endTime: string;
    interval: DiagramInterval;
}