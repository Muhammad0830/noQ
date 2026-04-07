import { supabaseServer } from "../services/supabaseServer.js";
import { v4 as uuidv4 } from "uuid";
import type { MulterFile } from "../../../../shared/types/general_types.js";

export const uploadImage = async (file: MulterFile, folderName: string) => {
  console.log("file", file);
  console.log("fileOriginal name", file.originalname);
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;

  const { error } = await supabaseServer.storage
    .from(folderName)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(error.message);
  }

  return fileName;
};
