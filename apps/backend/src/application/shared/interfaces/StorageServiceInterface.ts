import { MulterFile } from "@/types.js";

export interface StorageServiceInterface {
    readonly shopImagesPath: string;

    uploadImage(
        image: MulterFile,
        folderName: string
    ): Promise<string>;

    removeImage(
        imageNameList: string[],
        folderName: string,
    ): Promise<void>;

    getImageUrl(
        folderName: string,
        fileName: string
    ): Promise<string | null>
}