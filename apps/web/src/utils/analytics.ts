import { addMonths, addYears } from "@noq/shared";

export const getAvailableIntervals = (
    startTime: Date,
    endTime: Date,
) => {
    const canSelectMonth = endTime >= addMonths(startTime, 1);
    const canSelectYear = endTime >= addYears(startTime, 1);

    return {
        canSelectMonth,
        canSelectYear,
    };
};
