export interface CheckEmailExistsUseCaseInterface {
    execute(email: string): Promise<boolean>;
}