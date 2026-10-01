import { X } from 'lucide-react';
import React from 'react'

export default function ModalShell({
  title,
  closeLabel,
  headerAction,
  children,
  onClose,
}: {
  title: string;
  closeLabel: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[calc(100dvh-2rem)] w-full max-w-155 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <div className="flex items-center gap-2">
            {headerAction}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100"
              aria-label={closeLabel}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
