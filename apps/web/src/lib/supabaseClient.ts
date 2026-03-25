import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const getImageUrl = (fileName: string) => {
  console.log("fileName", fileName);
  const { publicUrl } = supabase.storage
    .from("shop_images")
    .getPublicUrl(`${fileName}`).data;

  if (!publicUrl) {
    console.error("Error getting public URL:", publicUrl);
  }

  console.log("Public URL:", publicUrl);

  return publicUrl;
};
