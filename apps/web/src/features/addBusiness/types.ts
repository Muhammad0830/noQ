import { dayByName, dayMeta } from "./utils";

export interface ScheduleSlot {
    startTime: string;
    endTime: string;
    block: boolean
}

export interface StepOneForm {
    businessName: string;
    categoryId: string;
    description: string;
    address: string;
    phone: string;
};

export interface DaySchedule {
    id: string;
    day: ExpandedDay;
    dayOfWeek: number;
    openStart: string;
    openEnd: string;
    breaks: BreakRange[];
    enabled: boolean;
};

export type BreakRange = {
    startTime: string;
    endTime: string;
};

export type ExpandedDay = (typeof dayMeta)[number]["day"] | "";

export type SchedulePanelTabs = "schedule" | "exceptions";