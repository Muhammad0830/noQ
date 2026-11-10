import { EmailAddress } from
    "@/domain/shared/value-objects/EmailAddress.js";
import { UserRepositoryInterface } from
    "@/domain/user/repositories/UserRepositoryInterface.js";
import { CheckEmailExistsUseCaseInterface } from
    "../interfaces/CheckEmailExistsUseCaseInterface.js";

export class CheckEmailExistsUseCase implements CheckEmailExistsUseCaseInterface {
    constructor(
        private readonly userRepository: UserRepositoryInterface,
    ) { }

    async execute(email: string): Promise<boolean> {
        const emailAddress = EmailAddress.from(email);

        return await this.userRepository.checkEmailExists(emailAddress);
    }
}
