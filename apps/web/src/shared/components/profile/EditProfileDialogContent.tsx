import { InfoFormState } from "@/features/profile/types";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";

interface EditProfileDialogContentType {
    infoForm: InfoFormState;
    infoSaveError: string;
    isSaving: boolean;
    setInfoForm: Dispatch<SetStateAction<InfoFormState>>;
    handleSavePersonalInfo: () => void;
    handleCancel: () => void;
}

const EditProfileDialogContent: FC<EditProfileDialogContentType> = ({
    infoForm,
    infoSaveError,
    isSaving,
    setInfoForm,
    handleSavePersonalInfo,
    handleCancel,
}) => {
    const t = useTranslations();

    return (
        <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    {t("profile.field.name")}
                </p>
                <input
                    type="text"
                    value={infoForm.name}
                    onChange={(event) =>
                        setInfoForm((prev) => ({
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
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-4 text-base font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                >
                    Bekor qilish
                </button>
                <button
                    type="button"
                    onClick={handleSavePersonalInfo}
                    disabled={isSaving}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-teal-600 px-4 text-base font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
                >
                    {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
            </div>
        </div>
    );
}

export default EditProfileDialogContent;