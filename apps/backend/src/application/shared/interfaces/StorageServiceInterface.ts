import { MulterFile } from "@/types.js";

export interface StorageServiceInterface {
    uploadImage(
        image: MulterFile,
        folderName: string
    ): Promise<string>;

    removeImage(
        imageNameList: string[],
        folderName: string,
    ): Promise<void>;
}