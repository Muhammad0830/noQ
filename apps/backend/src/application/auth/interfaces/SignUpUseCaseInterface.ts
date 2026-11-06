export interface SignUpUseCaseInterface {
    execute(input: SignUpUseCaseInput): Promise<SignUpUseCaseOutput | null>
}

export interface SignUpUseCaseInput {
    name: string;
    email: string;
    password: string;
    phoneNumber: string | null;
}

export interface SignUpUseCaseOutput {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
    };
    access_token: string;
    refresh_token: string;
}
