import { StorageServiceInterface } from
    "@/application/shared/interfaces/StorageServiceInterface.js";
import { supabase } from "@/config/supabase.js";
import { supabaseServer } from "@/services/supabaseServer.js";
import { MulterFile } from "@/types.js";
import { v4 as uuidv4 } from "uuid";

export class StorageService implements StorageServiceInterface {
    readonly shopImagesPath = "shop_iamges";

    async uploadImage(image: MulterFile, folderName: string): Promise<string> {
        const fileExt = image.originalname.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;

        const { error } = await supabaseServer.storage
            .from(folderName)
            .upload(fileName, image.buffer, {
                contentType: image.mimetype,
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            throw new Error(error.message);
        }

        return fileName;
    }

    async removeImage(imageNameList: string[], folderName: string): Promise<void> {
        const { error } = await supabaseServer.storage
            .from(folderName)
            .remove(imageNameList);

        if (error) {
            console.error("Supabase removal error", error);
            throw new Error(error.message);
        }
    }

    async getImageUrl(folderName: string, fileName: string): Promise<string | null> {
        if (!fileName) return null;

        const { publicUrl } = supabase.storage
            .from(folderName)
            .getPublicUrl(`${fileName}`)
            .data;

        if (!publicUrl) {
            console.error("Error getting public URL:", publicUrl);
            return null;
        }

        return publicUrl;
    }
}