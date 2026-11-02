export const schedulePostValidate = (schedule: any) => {
  for (const day of schedule) {
    if (
      typeof day.dayOfWeek !== "number" ||
      day.dayOfWeek < 0 ||
      day.dayOfWeek > 6
    ) {
      return { status: 400, json: { message: "Invalid dayOfWeek value" } };
    }

    if (!Array.isArray(day.slots)) {
      return { status: 400, json: { message: "Slots must be an array" } };
    }

    const sortedSlots = [...day.slots].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    for (let i = 0; i < sortedSlots.length; i++) {
      const slot = sortedSlots[i];

      if (
        slot.startTime < "00:00" ||
        slot.startTime > "23:59" ||
        slot.endTime < "00:00" ||
        slot.endTime > "23:59"
      ) {
        return { status: 400, json: { message: "Invalid time format" } };
      }

      if (slot.startTime >= slot.endTime) {
        return { status: 400, json: { message: "Invalid time range" } };
      }

      if (i > 0) {
        const prev = sortedSlots[i - 1];
        if (prev.endTime > slot.startTime) {
          return {
            status: 400,
            json: { message: "Overlapping slots detected" },
          };
        }
      }
    }
  }
};