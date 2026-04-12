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

function setTimeToDate(baseDate: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const newDate = new Date(baseDate);
  newDate.setHours(hours ?? 0, minutes, 0, 0);

  return newDate;
}
