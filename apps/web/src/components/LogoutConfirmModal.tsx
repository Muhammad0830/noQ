"use client";

import { LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

type LogoutConfirmModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function LogoutConfirmModal({
  isOpen,
  onConfirm,
  setIsOpen,
}: LogoutConfirmModalProps) {
  const t = useTranslations()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="gap-6">
        <div className="flex items-center justify-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <LogOut className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <DialogTitle className="text-center">{t("profile.logoutConfirmTitle")}</DialogTitle>

        <p className="text-center text-sm text-slate-600">
          {t("profile.logoutConfirmMessage")}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-4 font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            {t("profile.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-red-600 px-4 font-semibold text-white transition hover:bg-red-700"
          >
            {t("profile.logout")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
