export interface UpdateUserUseCaseInterface {
    execute(input: UpdateUserUseCaseInput): Promise<void>
}

export interface UpdateUserUseCaseInput {
    id: string;
    name: string;
    phoneNumber: string | null;
}