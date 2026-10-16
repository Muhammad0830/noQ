import { TimePicker } from "@/components/paragon/ui/time-picker";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";

interface DurationDrawerProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onValueChange: (value: string) => void;
}

const DurationDrawer: FC<DurationDrawerProps> = ({
    isOpen,
    setIsOpen,
    onValueChange,
}) => {
    const t = useTranslations()

    return (
        <Drawer
            open={isOpen}
            direction="bottom"
            onOpenChange={setIsOpen}
        >
            <DrawerContent className="rounded-lg">
                <DrawerHeader>
                    <DrawerTitle>
                        {t("admin.schedule.timePicker")}
                    </DrawerTitle>
                </DrawerHeader>

                <div className="w-full flex justify-center">
                    <TimePicker
                        hourCycle={24}
                        defaultValue="00:00"
                        minuteStep={1}
                        onValueChange={onValueChange} />
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default DurationDrawer;