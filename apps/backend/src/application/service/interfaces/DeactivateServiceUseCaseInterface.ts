export interface DeactivateServiceUseCaseInterface {
    execute(serviceId: string): Promise<void>;
}