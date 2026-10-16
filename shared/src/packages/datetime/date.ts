export function getOneDayAfter(date: string | Date) {
    const newDate = new Date(date);

    return new Date(newDate.setDate(newDate.getDate() + 1));
}