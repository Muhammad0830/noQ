import { Dispatch, SetStateAction } from "react";
import { User } from "@shared/types/general_types";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import DialogShell from "./DialogShell";
import { InfoFormState } from "@/features/profile/types";
import EditProfileDialogContent from "./EditProfileDialogContent";
import ViewProfileDialogContent from "./ViewProfileDialogContent";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditingInfo: Dispatch<SetStateAction<boolean>>;
  setInfoSaveError: Dispatch<SetStateAction<string>>;
  handleSavePersonalInfo: () => void;
  setInfoForm: Dispatch<SetStateAction<InfoFormState>>;
  isOpen: boolean;
  isSavingInfo: boolean;
  user: User;
  infoForm: InfoFormState;
  isEditingInfo: boolean;
  infoSaveError: string;
  profileFields: { label: string; value: string }[];
}

export default function InfoModal({
  setIsOpen,
  setIsEditingInfo,
  setInfoSaveError,
  handleSavePersonalInfo,
  setInfoForm,
  isOpen,
  isSavingInfo,
  user,
  infoForm,
  isEditingInfo,
  infoSaveError,
  profileFields,
}: Props) {
  const t = useTranslations();

  const handleCancel = () => {
    if (!user) return;

    setInfoForm({
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
    });

    setInfoSaveError("");
    setIsEditingInfo(false);
  }

  const handleToggleEditingInfo = () => {
    if (!isEditingInfo) {
      setInfoForm({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
      });
    }

    setIsEditingInfo((prev) => !prev);
    setInfoSaveError("");
  }

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
        isEditingInfo
          ? <EditProfileDialogContent
            infoForm={infoForm}
            infoSaveError={infoSaveError}
            isSaving={isSavingInfo}
            setInfoForm={setInfoForm}
            handleSavePersonalInfo={handleSavePersonalInfo}
            handleCancel={handleCancel} />

          : <ViewProfileDialogContent
            user={user}
            profileFields={profileFields} />
      }
    </DialogShell>
  );
}
