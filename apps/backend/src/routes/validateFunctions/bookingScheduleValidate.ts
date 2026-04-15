import prisma from "@/db/prisma.js";

export const bookingScheduleValidate = async (
  shopId: string,
  start: Date,
  end: Date,
) => {
  const dayOfWeek = start.getDay(); // 0 (Sun) - 6 (Sat)

  const schedule = await prisma.shopSchedule.findFirst({
    where: {
      shopId,
      dayOfWeek,
    },
  });

  if (!schedule) {
    return {
      hasError: true,
      status: 400,
      json: { message: "No schedule for selected day" },
    };
  }

  const scheduleStart = setTimeToDate(start, schedule.startTime);
  const scheduleEnd = setTimeToDate(start, schedule.endTime);

  if (start < scheduleStart || end > scheduleEnd) {
    return {
      hasError: true,
      status: 400,
      json: { message: "Booking is outside of working hours" },
    };
  }

  return {
    hasError: false,
  };
};

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

    // ✅ sort slots to safely validate overlaps
    const sortedSlots = [...day.slots].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    for (let i = 0; i < sortedSlots.length; i++) {
      const slot = sortedSlots[i];

      // time format check
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

      // 🔴 overlap check
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

function setTimeToDate(baseDate: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const newDate = new Date(baseDate);
  newDate.setHours(hours ?? 0, minutes, 0, 0);

  return newDate;
}
