import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const getImageUrl = (folderName: string, pathName?: string | null, ) => {
  if(!pathName) return null;

  if (pathName.startsWith("http://") || pathName.startsWith("https://")) {
    return pathName;
  }

  const { publicUrl } = supabase.storage
    .from(folderName)
    .getPublicUrl(`${pathName}`).data;

  if (!publicUrl) {
    console.error("Error getting public URL:", publicUrl);
  }

  return publicUrl;
};
