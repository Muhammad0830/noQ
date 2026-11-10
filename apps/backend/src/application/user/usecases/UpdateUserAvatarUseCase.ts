import { UserRepositoryInterface } from "@/domain/user/repositories/UserRepositoryInterface.js";
import { UpdateUserAvatarUseCaseInput, UpdateUserAvatarUseCaseInterface } from "../interfaces/UpdateUserAvatarUseCaseInterface.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { StorageServiceInterface } from "@/application/shared/interfaces/StorageServiceInterface.js";

export class UpdateUserAvatarUseCase implements UpdateUserAvatarUseCaseInterface {
    constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly storageService: StorageServiceInterface,
    ) { }

    async execute(input: UpdateUserAvatarUseCaseInput): Promise<string> {
        const userId = UserId.create(input.id);

        const user = await this.userRepository.findById(userId);

        const userAvatarUrl = user.getAvatarUrl();
        const userAvatarsPath = this.storageService.userAvatarsPath;

        if (userAvatarUrl) {
            await this.storageService.removeImage(
                [userAvatarUrl],
                userAvatarsPath,
            );
        }

        const fileName = await this.storageService.uploadImage(
            input.file,
            userAvatarsPath,
        );

        user.updateAvatarUrl(fileName);

        await this.userRepository.save(user);

        return fileName;
    }
}