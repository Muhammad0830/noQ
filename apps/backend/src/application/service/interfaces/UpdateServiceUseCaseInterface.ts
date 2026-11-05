export interface UpdateServiceUseCaseInterface {
    execute(input: UpdateServiceUseCaseInput): Promise<void>;
}

export interface UpdateServiceUseCaseInput {
    id: string;
    name: string;
    durationMin: number;
    price: number;
    bufferTime: number | null;
    description: string | null;
}