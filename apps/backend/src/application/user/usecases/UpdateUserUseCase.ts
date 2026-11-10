import { UserRepositoryInterface } from "@/domain/user/repositories/UserRepositoryInterface.js";
import { UpdateUserUseCaseInput, UpdateUserUseCaseInterface } from "../interfaces/UpdateUserUseCaseInterface.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";

export class UpdateUserUseCase implements UpdateUserUseCaseInterface {
    constructor(
        private readonly userRepository: UserRepositoryInterface,
    ) { }

    async execute(input: UpdateUserUseCaseInput): Promise<void> {
        const userId = UserId.create(input.id);

        const user = await this.userRepository.findById(userId);

        user.updateName(input.name);
        user.updatePhoneNumber(input.phoneNumber);

        await this.userRepository.save(user);
    }
}