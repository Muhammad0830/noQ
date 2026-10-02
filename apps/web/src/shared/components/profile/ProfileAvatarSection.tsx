import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/supabaseClient";
import { User } from "@shared/types/general_types";
import { Camera } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Props {
  preview: string | null;
  initials: string;
  memberSince: string;
  providerMode: boolean;
  user: User | null;
  file: File | null;
  isSavingImage: boolean;
  isLoading: boolean;
  handleSaveImage: () => void;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function ProfileAvatarSection({
  preview,
  initials,
  memberSince,
  providerMode,
  user,
  file,
  isSavingImage,
  isLoading,
  handleSaveImage,
  setPreview,
  setFile,
}: Props) {
  const t = useTranslations();
  return (
    <>
      <div className="relative mx-auto mb-4 inline-block">
        <div className="relative h-24 w-24 rounded-full p-0.5 ring-1 ring-[#F49B33]/60">
          {preview ? (
            <Image
              src={preview}
              alt="Profile preview"
              fill
              className="h-full w-full rounded-full object-cover"
            />
          ) : isLoading ? (
            <Skeleton className="h-full w-full rounded-full" />
          ) : getImageUrl("user_avatars", user?.avatarUrl) ? (
            <Image
              src={getImageUrl("user_avatars", user?.avatarUrl) ?? ""}
              alt={user?.name || "Profile image"}
              fill
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-700">
              {initials}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() =>
            document.getElementById("profile-image-input")?.click()
          }
          className="absolute bottom-0 right-0  inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F49B33] text-white shadow-lg transition hover:bg-blue-600"
          aria-label="Update profile image"
          title="Click to change profile image"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      {file && user && (
        <div className="mb-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleSaveImage}
            disabled={isSavingImage}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            {isSavingImage ? t("common.saving") : t("common.save")}
          </button>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
            disabled={isSavingImage}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            {t("common.cancel")}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="mx-auto h-9 w-52 rounded-md" />
          <Skeleton className="mx-auto h-4 w-40 rounded-md" />
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-semibold leading-tight text-slate-900">
            {user?.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {memberSince}
          </p>
          <p className="mt-1 text-sm font-medium leading-tight text-slate-600">
            {providerMode ? t("profile.adminPanel") : t("profile.personal")}
          </p>
        </>
      )}
    </>
  );
}
