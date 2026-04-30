"use client";

import { LogIn, X } from "lucide-react";

type AuthRequiredModalProps = {
  open: boolean;
  title: string;
  message: string;
  actionText: string;
  onClose: () => void;
  onAction: () => void;
};

export default function AuthRequiredModal({
  open,
  title,
  message,
  actionText,
  onClose,
  onAction,
}: AuthRequiredModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/45 p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="pr-8 text-lg font-semibold text-slate-900 sm:text-xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{message}</p>

        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 text-sm font-semibold text-white transition hover:brightness-105"
        >
          <LogIn className="h-4 w-4" />
          {actionText}
        </button>
      </div>
    </div>
  );
}
