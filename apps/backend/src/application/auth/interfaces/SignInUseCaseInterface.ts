export interface SignInUseCaseInterface {
    execute(input: SignInUseCaseInput): Promise<SignInUseCaseOutput | null>
}

export interface SignInUseCaseInput {
    email: string;
    password: string;
}

export interface SignInUseCaseOutput {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
    };
    access_token: string;
    refresh_token: string;
}