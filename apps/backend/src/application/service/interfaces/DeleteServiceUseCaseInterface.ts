export interface DeleteServiceUseCaseInterface {
    execute(serviceId: string): Promise<void>;
}