import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  title: string;
  closeLabel: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DialogShell({
  isOpen,
  title,
  headerAction,
  children,
  description,
  setIsOpen,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] max-w-155 w-[80vw] min-w-[75] rounded-2xl p-4"
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{title}</DialogTitle>

            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </div>

          <div className="flex items-center gap-2">
            {headerAction}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}