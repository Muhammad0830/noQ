import { TimePicker } from "@/components/paragon/ui/time-picker";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";
import { defaultTimePicker } from "../utils";
import { TimePickerState } from "@/features/scheduling/types";

interface TimePickerDrawerProps {
    timePicker: TimePickerState;
    setTimePicker: Dispatch<SetStateAction<TimePickerState>>;
    confirmTimePicker: () => void;
}

const TimePickerDrawer: FC<TimePickerDrawerProps> = ({
    timePicker,
    setTimePicker,
    confirmTimePicker
}) => {
    const t = useTranslations()

    return (
        <Drawer
            open={timePicker.isOpen}
            direction="bottom"
            onOpenChange={(value) => setTimePicker(prev => ({ ...prev, isOpen: value }))}
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
                        defaultValue="13:00"
                        value={timePicker.time}
                        onValueChange={(time) => setTimePicker(prev => ({ ...prev, time }))} />
                </div>

                <DrawerFooter>
                    <div className="flex gap-2">
                        <DrawerClose onClick={() => setTimePicker(defaultTimePicker)}
                            className="flex-1 rounded-xl h-12 border border-[#d8dde5] py-2 text-[13px] font-semibold text-[#7f8794]">
                            {t("common.cancel")}
                        </DrawerClose>
                        <DrawerClose onClick={confirmTimePicker}
                            className="flex-1 rounded-xl h-12 bg-[#f09a35] py-2 text-[13px] font-semibold text-white">
                            {t("common.confirm")}
                        </DrawerClose>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export default TimePickerDrawer;