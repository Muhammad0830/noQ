export type ScheduleItemType = "OPEN" | "BLOCK";

export type BackendScheduleItem = {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    type: ScheduleItemType;
};

export type BackendWeeklyScheduleResponse = {
    schedule?: Record<
        string,
        { opens: BackendScheduleItem[]; blocks: BackendScheduleItem[] }
    >;
};

export type TimePickerState = {
    isOpen: boolean;
    dayId: string | null;
    mode: "add" | "edit";
    breakIndex: number | null;
    field: "startTime" | "endTime";
    time: string;
};