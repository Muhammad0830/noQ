import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const getImageUrl = (pathName: string, folderName: string) => {
  const { publicUrl } = supabase.storage
    .from(folderName)
    .getPublicUrl(`${pathName}`).data;

  if (!publicUrl) {
    console.error("Error getting public URL:", publicUrl);
  }

  return publicUrl;
};
