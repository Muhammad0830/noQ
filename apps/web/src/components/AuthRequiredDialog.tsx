"use client";

import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";

type AuthRequiredDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function AuthRequiredDialog({
  open,
  onClose,
}: AuthRequiredDialogProps) {
  const t = useTranslations();

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="sm:max-w-sm gap-4">
        <DialogTitle>
          {t("user.history.authRequiredTitle")}
        </DialogTitle>

        <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
          { }
        </h3>

        <span className="text-sm leading-relaxed text-slate-600">{t("user.history.authRequiredMessage")}</span>

        <DialogClose asChild>
          <Link onClick={onClose} href="/login">
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 text-sm font-semibold text-white transition hover:brightness-105"
            >
              <LogIn className="h-4 w-4" />
              {t("user.history.authRequiredAction")}
            </button>
          </Link>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
