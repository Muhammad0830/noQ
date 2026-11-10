import { MulterFile } from "@/types.js";

export interface UpdateUserAvatarUseCaseInterface {
    execute(input: UpdateUserAvatarUseCaseInput): Promise<string>;
}

export interface UpdateUserAvatarUseCaseInput {
    id: string;
    file: MulterFile;
}