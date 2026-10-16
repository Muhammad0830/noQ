import { User } from "@shared/types/general_types";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface ViewProfileDialogContentType {
    user: User;
}

const ViewProfileDialogContent: FC<ViewProfileDialogContentType> = ({
    user,
}) => {
    const t = useTranslations();

    return (
        <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    {t("profile.field.name")}
                </p>
                <p className="mt-1 break-all text-sm text-slate-800">
                    {user.name}
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    {t("profile.field.email")}
                </p>
                <p className="mt-1 break-all text-sm text-slate-800">
                    {user.email}
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    {t("profile.field.phone")}
                </p>
                <p className="mt-1 break-all text-sm text-slate-800">
                    {user.phoneNumber}
                </p>
            </div>

            <div
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    {t("profile.field.role")}
                </p>
                <p className="mt-1 break-all text-sm text-slate-800">
                    {user.role}
                </p>
            </div>
        </div>
    );
}

export default ViewProfileDialogContent;