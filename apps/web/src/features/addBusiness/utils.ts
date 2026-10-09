import { DaySchedule, TimePickerState } from "@shared/types/general_types";

export const parseTime = (v: string | undefined, step: number = 5): { h: number; m: number } => {
    const m = v?.match(/^(\d{1,2}):(\d{2})$/);
    const h = m ? Math.min(23, Number(m[1])) : 9;
    const raw = m ? Math.min(59, Number(m[2])) : 0;
    return { h, m: Math.min(59, Math.round(raw / step) * step) };
}

export const defaultTimePicker: TimePickerState = {
    isOpen: false,
    dayId: null,
    mode: "add",
    breakIndex: null,
    field: "startTime",
    time: "13:00",
}

export const dayMeta = [
    {
        dayOfWeek: 1,
        day: "Monday",
        defaultStart: "09:00",
        defaultEnd: "18:00",
        enabled: true,
    },
    {
        dayOfWeek: 2,
        day: "Tuesday",
        defaultStart: "09:00",
        defaultEnd: "18:00",
        enabled: true,
    },
    {
        dayOfWeek: 3,
        day: "Wednesday",
        defaultStart: "09:00",
        defaultEnd: "18:00",
        enabled: true,
    },
    {
        dayOfWeek: 4,
        day: "Thursday",
        id: "thursday",
        defaultStart: "09:00",
        defaultEnd: "18:00",
        enabled: true,
    },
    {
        dayOfWeek: 5,
        day: "Friday",
        defaultStart: "09:00",
        defaultEnd: "18:00",
        enabled: true,
    },
    {
        dayOfWeek: 6,
        day: "Saturday",
        defaultStart: "09:00",
        defaultEnd: "18:00",
        enabled: true,
    },
    {
        dayOfWeek: 0,
        day: "Sunday",
        defaultStart: "09:00",
        defaultEnd: "18:00",
        enabled: false,
    },
] as const;

export const getDefaultDays = (): DaySchedule[] =>
    dayMeta.map((meta) => ({
        id: meta.day,
        day: meta.day,
        dayOfWeek: meta.dayOfWeek,
        openStart: meta.defaultStart,
        openEnd: meta.defaultEnd,
        breaks: [],
        enabled: meta.day !== "Sunday",
    }));

export const dayByName: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

export const getToday = () => {
    const weekdayName = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        timeZone: "Asia/Tashkent",
    }).format(new Date());

    const todayDayOfWeek = dayByName[weekdayName] ?? new Date().getDay();

    return (
        dayMeta.find((meta) => meta.dayOfWeek === todayDayOfWeek)?.day || "Monday"
    );
};