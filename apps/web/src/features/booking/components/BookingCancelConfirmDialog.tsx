import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";

interface BookingCancelConfirmDialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
}

const BookingCancelConfirmDialog: FC<BookingCancelConfirmDialogProps> = ({
    isOpen,
    setIsOpen,
    onCancel,
}) => {
    const t = useTranslations()

    const onConfirm = () => {
        onCancel();
        setIsOpen(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogContent>
                <DialogTitle>{t('user.booking.cancel_confirm.title')}</DialogTitle>

                <DialogDescription>
                    {t('user.booking.cancel_confirm.description')}
                </DialogDescription>

                <DialogFooter className="flex items-center flex-row">
                    <Button onClick={() => setIsOpen(false)} className="flex-1 rounded-md bg-transparent border-foreground text-foreground">{t('common.back')}</Button>
                    <Button onClick={onConfirm} className="flex-1 rounded-md bg-transparent border-red-600 text-red-600">{t('common.confirm')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default BookingCancelConfirmDialog;