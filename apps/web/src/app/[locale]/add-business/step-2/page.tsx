"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { defaultTimePicker, getDefaultDays, getToday } from "@/features/addBusiness/utils";
import { buildNonOverlappingDaySlots } from "@/shared/utils/schedule";
import TimePickerDrawer from "@/features/addBusiness/components/TimePickerDrawer";
import { DaySchedule, ExpandedDay, SchedulePanelTabs } from "@/features/addBusiness/types";
import ScheduleTabs from "@/features/addBusiness/components/ScheduleTabs";
import SchedulePanel from "@/features/addBusiness/components/SchedulePanel";
import ExceptionsPanel from "@/features/addBusiness/components/ExceptionsPanel";
import { TimePickerState } from "@/features/scheduling/types";

export default function AddBusinessStepTwoPage() {
  const router = useRouter();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<SchedulePanelTabs>("schedule");
  const [expandedDay, setExpandedDay] = useState<ExpandedDay>(getToday());
  const [days, setDays] = useState<DaySchedule[]>(getDefaultDays());
  const [timePicker, setTimePicker] = useState<TimePickerState>(defaultTimePicker);
  const [newShopDetails] = useState(() => typeof window !== 'undefined'
    ? sessionStorage.getItem("shop_details") : null)

  useEffect(() => {
    if (!newShopDetails) {
      router.replace("/add-business");
    }
  }, [newShopDetails, router])

  const toggleDay = (day: ExpandedDay) => {
    const currentDay = days.find((item) => item.day === day);

    if (currentDay && !currentDay.enabled) {
      setExpandedDay(currentDay.day);
    }

    setDays((prev) =>
      prev.map((item) =>
        item.day === day
          ? {
            ...item,
            enabled: !item.enabled,
          }
          : item,
      ),
    );
  };

  const openTimePickerDrawerModal = (
    id: string,
    field: "startTime" | "endTime",
    mode: "add" | "edit" = "add",
    breakIndex?: number,
  ) => {
    const targetDay = days.find((item) => item.id === id);

    if (!targetDay) return;

    const targetBreak = breakIndex !== undefined ? targetDay?.breaks[breakIndex] : null;

    let currentTime;

    if (mode === "add") {
      currentTime = targetDay?.breaks.at(-1)?.[field] || "13:00";
    } else if (targetBreak) {
      currentTime = targetBreak[field] || "13:00";
    } else {
      currentTime = field === "startTime"
        ? targetDay.openStart : targetDay.openEnd;
    }

    setTimePicker({
      isOpen: true,
      dayId: id,
      mode,
      breakIndex: breakIndex ?? null,
      field,
      time: currentTime,
    });
  };

  const confirmTimePicker = () => {
    console.log('timePicker', timePicker)

    const { dayId, mode, time, breakIndex, field } = timePicker;

    if (!dayId) return;

    setDays((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;

        if (mode === "add") {
          return {
            ...day,
            breaks: [...day.breaks, { startTime: time, endTime: "" }],
          };
        }

        if (breakIndex !== null) {
          return {
            ...day,
            breaks: day.breaks.map((breakItem, index) =>
              index === breakIndex
                ? { ...breakItem, [field]: time }
                : breakItem,
            ),
          };
        }

        const dayField = field === "startTime" ? "openStart" : "openEnd";

        return {
          ...day,
          [dayField]: time,
        };
      }),
    );

    setTimePicker(defaultTimePicker);
  };

  const removeBreak = (id: string, breakIndex = 0) => {
    setDays((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            breaks: item.breaks.filter((_, index) => index !== breakIndex),
          }
          : item,
      ),
    );
  };

  const handleNext = () => {
    const payload = {
      schedule: days
        .slice()
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
        .map((day) => ({
          dayOfWeek: day.dayOfWeek,
          slots: buildNonOverlappingDaySlots(day),
        })),
    };

    window.sessionStorage.setItem('shop_schedule', JSON.stringify(payload));

    router.push("/add-business/step-3");
  }

  return (
    <main className="min-h-screen bg-[#f4f5f8] px-4 py-5 text-slate-900">
      <div className="mx-auto w-full" style={{ maxWidth: 540 }}>
        <ScheduleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "schedule" ? (
          <SchedulePanel
            days={days}
            expandedDay={expandedDay}
            toggleDay={toggleDay}
            setExpandedDay={setExpandedDay}
            removeBreak={removeBreak}
            openTimePickerDrawerModal={openTimePickerDrawerModal} />
        ) : (
          <ExceptionsPanel />
        )}

        <button
          type="button"
          onClick={handleNext}
          className="mt-7 h-12 w-full rounded-full bg-[#F49B33] text-sm font-semibold text-white transition hover:bg-[#e8891f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("newShop.step2.next")}
        </button>
      </div>

      <TimePickerDrawer
        timePicker={timePicker}
        setTimePicker={setTimePicker}
        confirmTimePicker={confirmTimePicker} />
    </main>
  );
}
