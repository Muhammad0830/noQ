import React from "react";
import ModalShell from "./ModalShell";
import { User } from "@shared/types/general_types";
import { useLanguage } from "@/contexts/LanguageContext";
import { Pencil } from "lucide-react";

type InfoFormState = {
  name: string;
  phoneNumber: string;
};

interface Props {
  setIsInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setInfoSaveError: React.Dispatch<React.SetStateAction<string>>;
  handleSavePersonalInfo: () => void;
  setInfoForm: React.Dispatch<React.SetStateAction<InfoFormState>>;
  isSavingInfo: boolean;
  user: User | null;
  infoForm: InfoFormState;
  isEditingInfo: boolean;
  infoSaveError: string;
  profileFields: { label: string; value: string }[];
}

export default function InfoModal({
  setIsInfoModalOpen,
  setIsEditingInfo,
  setInfoSaveError,
  handleSavePersonalInfo,
  setInfoForm,
  isSavingInfo,
  user,
  infoForm,
  isEditingInfo,
  infoSaveError,
  profileFields,
}: Props) {
  const { t } = useLanguage();

  return (
    <ModalShell
      title={t("profile.personalInfoModalTitle")}
      closeLabel={t("profile.closeModal")}
      onClose={() => setIsInfoModalOpen(false)}
      headerAction={
        <button
          type="button"
          onClick={() => {
            setIsEditingInfo((prev) => !prev);
            setInfoSaveError("");
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100"
          aria-label="Shaxsiy ma'lumotlarni tahrirlash"
          title="Tahrirlash"
        >
          <Pencil className="h-4 w-4" />
        </button>
      }
    >
      {isEditingInfo ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
              {t("profile.field.name")}
            </p>
            <input
              type="text"
              value={infoForm.name}
              onChange={(event) =>
                setInfoForm((prev: InfoFormState) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
              {t("profile.field.phone")}
            </p>
            <input
              type="tel"
              value={infoForm.phoneNumber}
              onChange={(event) =>
                setInfoForm((prev) => ({
                  ...prev,
                  phoneNumber: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {infoSaveError && (
            <p className="text-sm text-red-500">{infoSaveError}</p>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (!user) return;
                setInfoForm({
                  name: user.name || "",
                  phoneNumber: user.phoneNumber || "",
                });
                setIsEditingInfo(false);
                setInfoSaveError("");
              }}
              disabled={isSavingInfo}
              className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-4 text-base font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleSavePersonalInfo}
              disabled={isSavingInfo}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-teal-600 px-4 text-base font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {isSavingInfo ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
              {t("profile.field.name")}
            </p>
            <p className="mt-1 break-all text-sm text-slate-800">
              {user?.name || "-"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
              {t("profile.field.email")}
            </p>
            <p className="mt-1 break-all text-sm text-slate-800">
              {user?.email || "-"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
              {t("profile.field.phone")}
            </p>
            <p className="mt-1 break-all text-sm text-slate-800">
              {user?.phoneNumber || "-"}
            </p>
          </div>

          {profileFields.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-1 break-all text-sm text-slate-800">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
}
