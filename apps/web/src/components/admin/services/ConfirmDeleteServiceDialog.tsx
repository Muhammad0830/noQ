import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";

interface ConfirmDeleteServiceDialogProps {
    isLoading: boolean;
    onDelete: () => void;
}

const ConfirmDeleteServiceDialog: FC<ConfirmDeleteServiceDialogProps> = ({
    isLoading,
    onDelete,
}) => {
    const t = useTranslations();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    disabled={isLoading}
                    className="flex h-14 w-full items-center justify-center rounded-full border border-destructive text-destructive text-[16px] font-semibold uppercase tracking-[0.08em] shadow-[0_16px_32px_rgba(244,155,51,0.28)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isLoading ? t("newShop.step3.saving") : t("newShop.step3.delete")}
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>
                    {t("admin.services.edit.confirm_delete")}
                </DialogTitle>

                <DialogDescription>
                    {t("admin.services.edit.delete_description")}
                </DialogDescription>

                <DialogFooter>
                    <div className="flex items-center gap-2">
                        <DialogClose asChild>
                            <button
                                type="button"
                                disabled={isLoading}
                                className="flex h-14 w-full items-center justify-center rounded-lg border border-slate-300 text-slate-500 text-[16px] font-semibold uppercase tracking-[0.08em] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isLoading ? t("newShop.step3.saving") : t("common.no")}
                            </button>
                        </DialogClose>

                        <DialogClose asChild>
                            <button
                                onClick={onDelete}
                                type="button"
                                disabled={isLoading}
                                className="flex h-14 w-full items-center justify-center rounded-lg border border-destructive text-destructive text-[16px] font-semibold uppercase tracking-[0.08em] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isLoading ? t("newShop.step3.saving") : t("common.yes")}
                            </button>
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmDeleteServiceDialog;