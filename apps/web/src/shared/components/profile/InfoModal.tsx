import { Dispatch, SetStateAction, useState } from "react";
import { User } from "@shared/types/general_types";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import DialogShell from "./DialogShell";
import { InfoFormState } from "@/features/profile/types";
import EditProfileDialogContent from "./EditProfileDialogContent";
import ViewProfileDialogContent from "./ViewProfileDialogContent";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  user: User;
}

export default function InfoModal({
  setIsOpen,
  isOpen,
  user,
}: Props) {
  const t = useTranslations();
  const { updateProfile, isLoading, isProfileUpdating } = useAuth();
  const [isInfoEditing, setIsInfoEditing] = useState(false);
  const [infoSaveError, setInfoSaveError] = useState<string>('');

  const [infoForm, setInfoForm] = useState<InfoFormState>({
    name: "",
    phoneNumber: "",
  });

  const handleCancel = () => {
    if (!user) return;

    setInfoForm({
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
    });

    setInfoSaveError("");
  }

  const handleToggleEditingInfo = () => {
    if (!isInfoEditing) {
      setInfoForm({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
      });
    }

    setIsInfoEditing((prev) => !prev);
    setInfoSaveError("");
  }

  const handleSavePersonalInfo = async () => {
    if (!user || isProfileUpdating || isLoading) return;

    setInfoSaveError("");

    try {
      await updateProfile({
        name: infoForm.name.trim(),
        phoneNumber: infoForm.phoneNumber.trim(),
      });
    } catch (error) {
      setInfoSaveError(
        error instanceof Error
          ? error.message
          : "Ma'lumotlarni saqlashda xatolik yuz berdi",
      );
    }
  };

  return (
    <DialogShell
      title={t("profile.personalInfoModalTitle")}
      closeLabel={t("profile.closeModal")}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      headerAction={
        <button
          type="button"
          onClick={handleToggleEditingInfo}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100"
          aria-label="Shaxsiy ma'lumotlarni tahrirlash"
          title="Tahrirlash"
        >
          <Pencil className="h-4 w-4" />
        </button>
      }
    >
      {
        isInfoEditing
          ? <EditProfileDialogContent
            infoForm={infoForm}
            infoSaveError={infoSaveError}
            isSaving={isProfileUpdating}
            setInfoForm={setInfoForm}
            handleSavePersonalInfo={handleSavePersonalInfo}
            handleCancel={handleCancel} />

          : <ViewProfileDialogContent user={user} />
      }
    </DialogShell>
  );
}
