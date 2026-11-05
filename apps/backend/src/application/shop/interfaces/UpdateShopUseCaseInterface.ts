import { MulterFile } from "@/types.js";

export interface UpdateShopUseCaseInterface {
    execute(input: UpdateShopUseCaseInput): Promise<void>;
}

export interface UpdateShopUseCaseInput {
    id: string;
    name: string;
    phoneNumber: string;
    address: string;
    logoURL: string | null;
    description: string | null;
    file: MulterFile | null;
}