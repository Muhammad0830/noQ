export interface CreateServiceUseCaseInterface {
    execute(input: CreateServiceUseCaseInput): Promise<void>;
}

export interface CreateServiceUseCaseInput {
    shopId: string;
    name: string;
    description: string | null;
    price: number;
    durationMin: number;
    bufferTime: number | null;
}