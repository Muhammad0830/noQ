export interface ActivateServiceUseCaseInterface {
    execute(serviceId: string): Promise<void>;
}