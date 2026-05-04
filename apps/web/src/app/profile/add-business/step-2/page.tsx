"use client";

import { useEffect, useMemo, useState, type TouchEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Coffee,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import useApiQuery from "@/hooks/useApiQuery";
import { useLanguage } from "@/contexts/LanguageContext";
import { API_ENDPOINTS, getStoredAuth } from "@/lib/api";
import type {
  BackendWeeklyScheduleResponse,
  DaySchedule,
  TimePickerState,
} from "@shared/types/general_types";

const dayMeta = [
  {
    dayOfWeek: 1,
    day: "Monday",
    id: "monday",
    defaultStart: "09:00",
    defaultEnd: "18:00",
  },
  {
    dayOfWeek: 2,
    day: "Tuesday",
    id: "tuesday",
    defaultStart: "09:00",
    defaultEnd: "18:00",
  },
  {
    dayOfWeek: 3,
    day: "Wednesday",
    id: "wednesday",
    defaultStart: "09:00",
    defaultEnd: "18:00",
  },
  {
    dayOfWeek: 4,
    day: "Thursday",
    id: "thursday",
    defaultStart: "09:00",
    defaultEnd: "18:00",
  },
  {
    dayOfWeek: 5,
    day: "Friday",
    id: "friday",
    defaultStart: "09:00",
    defaultEnd: "20:00",
  },
  {
    dayOfWeek: 6,
    day: "Saturday",
    id: "saturday",
    defaultStart: "10:00",
    defaultEnd: "17:00",
  },
  {
    dayOfWeek: 0,
    day: "Sunday",
    id: "sunday",
    defaultStart: "09:00",
    defaultEnd: "18:00",
  },
] as const;

type ExpandedDay = (typeof dayMeta)[number]["id"] | "";

type StepOneDraft = {
  businessName: string;
  categoryId: string;
  description: string;
  address: string;
  phone: string;
};

const getTodayDayId = () => {
  const weekdayName = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Asia/Tashkent",
  }).format(new Date());

  const dayByName: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const todayDayOfWeek = dayByName[weekdayName] ?? new Date().getDay();
  return (
    dayMeta.find((meta) => meta.dayOfWeek === todayDayOfWeek)?.id || "monday"
  );
};

const normalizeTime = (value?: string | null) =>
  value ? value.slice(0, 5) : "00:00";

const parseTime = (value?: string) => {
  const [h, m] = (value || "13:00").split(":");
  return {
    hour: Number.isFinite(Number(h)) ? Number(h) : 13,
    minute: Number.isFinite(Number(m)) ? Number(m) : 0,
  };
};

const toTimeString = (hour: number, minute: number) =>
  `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

const addMinutes = (time: string, minutesToAdd: number) => {
  const { hour, minute } = parseTime(time);
  const total = hour * 60 + minute + minutesToAdd;
  const normalized = ((total % 1440) + 1440) % 1440;
  const nextHour = Math.floor(normalized / 60);
  const nextMinute = normalized % 60;
  return toTimeString(nextHour, nextMinute);
};

const isValidRange = (startTime: string, endTime: string) =>
  startTime < endTime;

const buildNonOverlappingDaySlots = (day: DaySchedule) => {
  if (!day.enabled || !isValidRange(day.openStart, day.openEnd)) {
    return [] as { startTime: string; endTime: string; block: boolean }[];
  }

  const filteredBreaks = day.breaks
    .filter(
      (b) =>
        isValidRange(b.startTime, b.endTime) &&
        b.startTime >= day.openStart &&
        b.endTime <= day.openEnd,
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const mergedBreaks: { startTime: string; endTime: string }[] = [];
  for (const current of filteredBreaks) {
    const last = mergedBreaks[mergedBreaks.length - 1];
    if (!last || last.endTime < current.startTime) {
      mergedBreaks.push({ ...current });
      continue;
    }
    if (current.endTime > last.endTime) {
      last.endTime = current.endTime;
    }
  }

  const slots: { startTime: string; endTime: string; block: boolean }[] = [];
  let cursor = day.openStart;

  for (const block of mergedBreaks) {
    if (cursor < block.startTime) {
      slots.push({ startTime: cursor, endTime: block.startTime, block: false });
    }
    slots.push({
      startTime: block.startTime,
      endTime: block.endTime,
      block: true,
    });
    cursor = block.endTime;
  }

  if (cursor < day.openEnd) {
    slots.push({ startTime: cursor, endTime: day.openEnd, block: false });
  }

  if (!slots.length) {
    slots.push({
      startTime: day.openStart,
      endTime: day.openEnd,
      block: false,
    });
  }

  return slots;
};

const getDefaultDays = (): DaySchedule[] =>
  dayMeta.map((meta) => ({
    id: meta.id,
    day: meta.day,
    dayOfWeek: meta.dayOfWeek,
    openStart: meta.defaultStart,
    openEnd: meta.defaultEnd,
    breaks: [],
    enabled: meta.id !== "sunday",
  }));

const mapBackendToDays = (
  response?: BackendWeeklyScheduleResponse,
): DaySchedule[] => {
  const incoming = response?.schedule || {};
  const weekNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return dayMeta.map((meta) => {
    const dayName = weekNames[meta.dayOfWeek];
    const dayData = incoming[dayName] || { opens: [], blocks: [] };

    const opens = [...dayData.opens].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
    const blocks = [...dayData.blocks].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    const enabled = opens.length > 0;
    const openStart = enabled
      ? normalizeTime(opens[0]?.startTime)
      : meta.defaultStart;
    const openEnd = enabled
      ? normalizeTime(opens[opens.length - 1]?.endTime)
      : meta.defaultEnd;

    return {
      id: meta.id,
      day: meta.day,
      dayOfWeek: meta.dayOfWeek,
      openStart,
      openEnd,
      breaks: blocks.map((block) => ({
        startTime: normalizeTime(block.startTime),
        endTime: normalizeTime(block.endTime),
      })),
      enabled,
    };
  });
};

export default function AddBusinessStepTwoPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"schedule" | "exceptions">(
    "schedule",
  );
  const [expandedDay, setExpandedDay] = useState<ExpandedDay>(getTodayDayId);
  const [days, setDays] = useState<DaySchedule[]>(getDefaultDays());
  const [shopId, setShopId] = useState<string | null>(null);
  const [isCreatingShop, setIsCreatingShop] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    kind: "error" | "success";
  } | null>(null);
  const [timePicker, setTimePicker] = useState<TimePickerState>({
    isOpen: false,
    dayId: null,
    mode: "add",
    breakIndex: null,
    field: "startTime",
    hour: 13,
    minute: 0,
  });
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [currentSwipeTarget, setCurrentSwipeTarget] = useState<
    "hour" | "minute" | null
  >(null);

  const { data: weeklyScheduleData, isLoading: isScheduleLoading } =
    useApiQuery<BackendWeeklyScheduleResponse>(
      shopId ? `${API_ENDPOINTS.admin.schedule}?date=all` : null,
      {
        key: ["new-shop-weekly-schedule", shopId || "none"],
        enabled: Boolean(shopId),
        staleTime: 30_000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        headers: shopId
          ? { "x-shopid": shopId, "x-shop-id": shopId }
          : undefined,
      },
    );

  useEffect(() => {
    if (timePicker.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [timePicker.isOpen]);

  useEffect(() => {
    if (!weeklyScheduleData) return;
    setDays(mapBackendToDays(weeklyScheduleData));
  }, [weeklyScheduleData]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const CREATION_LOCK_KEY = "new_shop_creating";

    const existingShopId = window.sessionStorage.getItem("new_shop_id");
    if (existingShopId) {
      setShopId(existingShopId);
      setIsCreatingShop(false);
      return;
    }

    const isShopCreating =
      window.sessionStorage.getItem(CREATION_LOCK_KEY) === "1";
    if (isShopCreating) {
      setIsCreatingShop(true);

      const startedAt = Date.now();
      const interval = window.setInterval(() => {
        const createdId = window.sessionStorage.getItem("new_shop_id");
        if (createdId) {
          setShopId(createdId);
          setIsCreatingShop(false);
          window.clearInterval(interval);
          return;
        }

        if (Date.now() - startedAt > 20_000) {
          window.sessionStorage.removeItem(CREATION_LOCK_KEY);
          setIsCreatingShop(false);
          window.clearInterval(interval);
        }
      }, 300);

      return () => window.clearInterval(interval);
    }

    const rawDraft = window.sessionStorage.getItem("new_shop_step_1");
    if (!rawDraft) {
      router.replace("/profile/add-business");
      return;
    }

    const createShop = async () => {
      setIsCreatingShop(true);
      window.sessionStorage.setItem(CREATION_LOCK_KEY, "1");

      try {
        const draft = JSON.parse(rawDraft) as StepOneDraft;
        const token = getStoredAuth()?.token;

        const response = await fetch(API_ENDPOINTS.shops, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: draft.businessName,
            address: draft.address,
            phone: draft.phone,
            categoryId: draft.categoryId,
            description: draft.description,
          }),
        });

        const json = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(
            (json && typeof json.message === "string" && json.message) ||
              t("newShop.step2.createFailed"),
          );
        }

        const createdShopId =
          (json && typeof json.course?.id === "string" && json.course.id) ||
          (json && typeof json.shop?.id === "string" && json.shop.id) ||
          (json && typeof json.data?.id === "string" && json.data.id) ||
          null;

        if (!createdShopId) {
          throw new Error(t("newShop.step2.createFailed"));
        }

        window.sessionStorage.setItem("new_shop_id", createdShopId);
        setShopId(createdShopId);
      } catch (error) {
        setToast({
          message:
            error instanceof Error
              ? error.message
              : t("newShop.step2.createFailed"),
          kind: "error",
        });
      } finally {
        window.sessionStorage.removeItem(CREATION_LOCK_KEY);
        setIsCreatingShop(false);
      }
    };

    void createShop();
  }, [router, t]);

  const toggleDay = (id: string) => {
    const currentDay = days.find((item) => item.id === id);
    const willDisable = Boolean(currentDay?.enabled);

    if (willDisable) {
      setExpandedDay((prev) => (prev === id ? "" : prev));
    }

    setDays((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled: !item.enabled,
              openStart: item.openStart || "09:00",
              openEnd: item.openEnd || "18:00",
            }
          : item,
      ),
    );
  };

  const openAddBreakModal = (id: string) => {
    const targetDay = days.find((item) => item.id === id);
    const lastBreak = targetDay?.breaks[targetDay.breaks.length - 1];
    const initial = parseTime(lastBreak?.endTime || "13:00");

    setTimePicker({
      isOpen: true,
      dayId: id,
      mode: "add",
      breakIndex: null,
      field: "startTime",
      hour: initial.hour,
      minute: Math.round(initial.minute / 5) * 5,
    });
  };

  const openEditBreakModal = (
    id: string,
    breakIndex: number,
    field: "startTime" | "endTime",
  ) => {
    const targetDay = days.find((item) => item.id === id);
    const targetBreak = targetDay?.breaks[breakIndex];
    if (!targetBreak) return;

    const currentTime =
      field === "startTime" ? targetBreak.startTime : targetBreak.endTime;
    const initial = parseTime(currentTime);

    setTimePicker({
      isOpen: true,
      dayId: id,
      mode: "edit",
      breakIndex,
      field,
      hour: initial.hour,
      minute: Math.round(initial.minute / 5) * 5,
    });
  };

  const openEditWorkingHoursModal = (
    id: string,
    field: "startTime" | "endTime",
  ) => {
    const targetDay = days.find((item) => item.id === id);
    if (!targetDay) return;

    const currentTime =
      field === "startTime" ? targetDay.openStart : targetDay.openEnd;
    const initial = parseTime(currentTime);

    setTimePicker({
      isOpen: true,
      dayId: id,
      mode: "edit",
      breakIndex: null,
      field,
      hour: initial.hour,
      minute: Math.round(initial.minute / 5) * 5,
    });
  };

  const closeTimePicker = () => {
    setTimePicker((prev) => ({
      ...prev,
      isOpen: false,
      dayId: null,
      mode: "add",
      breakIndex: null,
      field: "startTime",
    }));
  };

  const shiftHour = (delta: number) => {
    setTimePicker((prev) => ({ ...prev, hour: (prev.hour + delta + 24) % 24 }));
  };

  const shiftMinute = (delta: number) => {
    setTimePicker((prev) => {
      const next = prev.minute + delta;
      if (next >= 60) return { ...prev, minute: 0, hour: (prev.hour + 1) % 24 };
      if (next < 0) return { ...prev, minute: 55, hour: (prev.hour + 23) % 24 };
      return { ...prev, minute: next };
    });
  };

  const handleSwipeStart = (event: TouchEvent, target: "hour" | "minute") => {
    event.preventDefault();
    setTouchStartY(event.touches[0].clientY);
    setCurrentSwipeTarget(target);
  };

  const handleSwipeEnd = (event: TouchEvent) => {
    event.preventDefault();
    if (touchStartY === null || currentSwipeTarget === null) return;

    const touchEndY = event.changedTouches[0]?.clientY;
    if (touchEndY === undefined) return;

    const deltaY = touchStartY - touchEndY;
    if (Math.abs(deltaY) > 10) {
      if (currentSwipeTarget === "hour") {
        shiftHour(deltaY > 0 ? 1 : -1);
      } else {
        shiftMinute(deltaY > 0 ? 5 : -5);
      }
    }

    setTouchStartY(null);
    setCurrentSwipeTarget(null);
  };

  const confirmTimePicker = () => {
    if (!timePicker.dayId) return;

    const selectedTime = toTimeString(timePicker.hour, timePicker.minute);

    if (timePicker.mode === "add") {
      const endTime = addMinutes(selectedTime, 60);
      setDays((prev) =>
        prev.map((item) =>
          item.id === timePicker.dayId
            ? {
                ...item,
                breaks: [...item.breaks, { startTime: selectedTime, endTime }],
              }
            : item,
        ),
      );
    } else {
      setDays((prev) =>
        prev.map((item) => {
          if (item.id !== timePicker.dayId) return item;

          if (timePicker.breakIndex !== null) {
            return {
              ...item,
              breaks: item.breaks.map((breakItem, index) =>
                index === timePicker.breakIndex
                  ? { ...breakItem, [timePicker.field]: selectedTime }
                  : breakItem,
              ),
            };
          }

          return {
            ...item,
            [timePicker.field === "startTime" ? "openStart" : "openEnd"]:
              selectedTime,
          };
        }),
      );
    }

    closeTimePicker();
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

  const saveSchedule = async () => {
    if (!shopId) {
      setToast({ message: t("admin.schedule.noShopSelected"), kind: "error" });
      return false;
    }

    setToast(null);
    setIsSaving(true);

    try {
      const payload = {
        schedule: days
          .slice()
          .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
          .map((day) => ({
            dayOfWeek: day.dayOfWeek,
            slots: buildNonOverlappingDaySlots(day),
          })),
      };

      const token = getStoredAuth()?.token;
      const response = await fetch(API_ENDPOINTS.admin.schedule, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-shopid": shopId,
          "x-shop-id": shopId,
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          (json && typeof json.message === "string" && json.message) ||
            t("admin.schedule.saveFailed"),
        );
      }

      return true;
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : t("admin.schedule.saveFailed"),
        kind: "error",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    const ok = await saveSchedule();
    if (!ok) return;

    setToast({ message: t("admin.schedule.saveSuccess"), kind: "success" });
    router.push("/profile/add-business/step-3");
  };

  const getDayLabel = (dayId: string) => t(`admin.schedule.day.${dayId}`);
  const todayDayId = useMemo(() => getTodayDayId(), []);

  return (
    <main className="min-h-screen bg-[#f4f5f8] px-4 py-5 text-slate-900">
      {toast && (
        <div className="fixed left-1/2 top-4 z-60 w-[92%] max-w-sm -translate-x-1/2">
          <div
            className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${
              toast.kind === "error"
                ? "border-red-700 bg-red-600 text-white"
                : "border-emerald-700 bg-emerald-600 text-white"
            }`}
          >
            {toast.kind === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-white" />
            )}
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      <div className="mx-auto w-full" style={{ maxWidth: 540 }}>
        <header className="relative mb-6 flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label={t("common.back")}
            className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">
            {t("newShop.step2.pageTitle")}
          </h1>
        </header>

        <div className="mb-5 flex items-center justify-center gap-2">
          {[1, 2, 3].map((step) => {
            const isActive = step === 2;
            const isDone = step < 2;

            return (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    isActive || isDone
                      ? "bg-[#F49B33] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : step}
                </span>
                {step < 3 && <span className="h-px w-12 bg-slate-300" />}
              </div>
            );
          })}
        </div>

        <section className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${
              activeTab === "schedule"
                ? "border-[#f09a35] bg-[#f09a35] text-white"
                : "border-[#d9dbe0] bg-white text-[#97a0ab]"
            }`}
          >
            <CalendarClock className="h-4 w-4" />
            {t("admin.schedule.tab.schedule")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("exceptions")}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${
              activeTab === "exceptions"
                ? "border-[#f09a35] bg-[#f09a35] text-white"
                : "border-[#d9dbe0] bg-white text-[#97a0ab]"
            }`}
          >
            <CalendarClock className="h-4 w-4" />
            {t("admin.schedule.tab.exceptions")}
          </button>
        </section>

        {activeTab === "schedule" ? (
          <section>
            <h3 className="pb-2 text-[21px] font-bold tracking-tight text-[#1f1f1f]">
              {t("admin.schedule.weekly")}
            </h3>

            <div className="space-y-2.5">
              {isCreatingShop || (isScheduleLoading && !weeklyScheduleData)
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`schedule-skeleton-${index}`}
                      className="rounded-[14px] border border-[#e7e8ec] bg-white px-3 py-3 shadow-[0_4px_14px_rgba(17,24,39,0.04)]"
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="space-y-2">
                          <div className="h-5 w-28 animate-pulse rounded-md bg-[#eceff3]" />
                          <div className="h-3 w-36 animate-pulse rounded-md bg-[#f1f3f6]" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-11 animate-pulse rounded-full bg-[#eceff3]" />
                          <div className="h-9 w-9 animate-pulse rounded-full bg-[#f1f3f6]" />
                        </div>
                      </div>
                    </div>
                  ))
                : days.map((item) => {
                    const isExpanded = expandedDay === item.id;
                    const dayLabel = getDayLabel(item.id);
                    const hoursText = item.enabled
                      ? `${item.openStart} - ${item.openEnd}`
                      : t("admin.schedule.closed");

                    return (
                      <article
                        key={item.id}
                        className={`rounded-[14px] border bg-white px-3 py-2.5 shadow-[0_4px_14px_rgba(17,24,39,0.04)] ${
                          isExpanded ? "border-[#f0bc89]" : "border-[#e7e8ec]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[18px] font-semibold tracking-tight text-[#252a31]">
                                {dayLabel}
                              </p>
                              {item.id === todayDayId && (
                                <span className="rounded-full bg-[#f9b15a] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                                  {t("admin.schedule.today")}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[11px] text-[#8d94a1]">
                              <span>{hoursText}</span>
                              {item.enabled && (
                                <>
                                  <span className="mx-1 text-[#d6d9de]">•</span>
                                  <span className="text-[#f39a36]">
                                    {t("admin.schedule.breakCount", {
                                      count: item.breaks.length,
                                    })}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleDay(item.id)}
                              className={`relative h-6 w-11 rounded-full transition-colors ${
                                item.enabled ? "bg-[#24b565]" : "bg-[#dbdde2]"
                              }`}
                              aria-label={t("admin.schedule.aria.toggleDay", {
                                day: dayLabel,
                              })}
                              aria-pressed={item.enabled}
                            >
                              <span
                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                                  item.enabled ? "left-5.5" : "left-0.5"
                                }`}
                              />
                            </button>
                            <button
                              type="button"
                              disabled={!item.enabled}
                              onClick={() =>
                                setExpandedDay((prev) =>
                                  prev === item.id
                                    ? ""
                                    : (item.id as ExpandedDay),
                                )
                              }
                              className={`inline-flex items-center justify-center transition-colors ${
                                isExpanded
                                  ? "h-9 w-9 rounded-2xl bg-[#f2f3f5] text-[#20b35f]"
                                  : "h-9 w-9 rounded-full text-[#b8bdc8] hover:bg-[#f3f4f6]"
                              } ${!item.enabled ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""}`}
                              aria-label={t("admin.schedule.aria.editDay", {
                                day: dayLabel,
                              })}
                            >
                              {isExpanded ? (
                                <Check className="h-4 w-4 text-[#21b462]" />
                              ) : (
                                <Pencil className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {isExpanded && item.enabled && (
                          <div className="mt-3 border-t border-[#eceef2] pt-3">
                            <div className="space-y-3">
                              <div className="grid grid-cols-[40px_auto_1fr_auto_1fr] items-center gap-1.5">
                                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4eee9] text-[#e8a767]">
                                  <Clock3 className="h-3.5 w-3.5" />
                                </div>
                                <p className="text-[9px] font-semibold uppercase tracking-widest text-[#959daa]">
                                  {t("admin.schedule.hours")}
                                </p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditWorkingHoursModal(
                                      item.id,
                                      "startTime",
                                    )
                                  }
                                  className="inline-flex h-9 items-center justify-center rounded-xl border border-[#d9dde3] bg-[#f3f4f6] px-2.5 text-[13px] font-bold text-[#1e232b]"
                                >
                                  {item.openStart}
                                </button>
                                <span className="text-[15px] text-[#c5cbd4]">
                                  -
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditWorkingHoursModal(
                                      item.id,
                                      "endTime",
                                    )
                                  }
                                  className="inline-flex h-9 items-center justify-center rounded-xl border border-[#d9dde3] bg-[#f3f4f6] px-2.5 text-[13px] font-bold text-[#1e232b]"
                                >
                                  {item.openEnd}
                                </button>
                              </div>

                              {item.breaks.length > 0 ? (
                                item.breaks.map((breakItem, breakIndex) => (
                                  <div
                                    key={`${item.id}-break-${breakIndex}`}
                                    className="grid grid-cols-[40px_auto_1fr_auto_1fr_auto] items-center gap-1.5"
                                  >
                                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4eee9] text-[#e8a767]">
                                      <Coffee className="h-3.5 w-3.5" />
                                    </div>
                                    <p className="text-[9px] font-semibold uppercase tracking-widest text-[#959daa]">
                                      {t("admin.schedule.break")}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openEditBreakModal(
                                          item.id,
                                          breakIndex,
                                          "startTime",
                                        )
                                      }
                                      className="inline-flex h-9 items-center justify-center rounded-xl border border-[#f1dcc5] bg-[#fcf7f1] px-2.5 text-[13px] font-bold text-[#262b33]"
                                    >
                                      {breakItem.startTime}
                                    </button>
                                    <span className="text-[15px] text-[#c5cbd4]">
                                      -
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openEditBreakModal(
                                          item.id,
                                          breakIndex,
                                          "endTime",
                                        )
                                      }
                                      className="inline-flex h-9 items-center justify-center rounded-xl border border-[#f1dcc5] bg-[#fcf7f1] px-2.5 text-[13px] font-bold text-[#262b33]"
                                    >
                                      {breakItem.endTime}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeBreak(item.id, breakIndex)
                                      }
                                      className="inline-flex h-6 w-6 items-center justify-center text-[#ff6662]"
                                      aria-label={t(
                                        "admin.schedule.aria.deleteBreak",
                                      )}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div className="grid grid-cols-[40px_auto_1fr_auto_1fr_auto] items-center gap-1.5">
                                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4eee9] text-[#e8a767]">
                                    <Coffee className="h-3.5 w-3.5" />
                                  </div>
                                  <p className="text-[9px] font-semibold uppercase tracking-widest text-[#959daa]">
                                    {t("admin.schedule.break")}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => openAddBreakModal(item.id)}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-[#f1dcc5] bg-[#fcf7f1] px-2.5 text-[13px] font-bold text-[#262b33]"
                                  >
                                    -:-
                                  </button>
                                  <span className="text-[15px] text-[#c5cbd4]">
                                    -
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => openAddBreakModal(item.id)}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-[#f1dcc5] bg-[#fcf7f1] px-2.5 text-[13px] font-bold text-[#262b33]"
                                  >
                                    -:-
                                  </button>
                                  <button
                                    type="button"
                                    disabled
                                    className="inline-flex h-6 w-6 items-center justify-center text-[#ff6662]/40"
                                    aria-label={t(
                                      "admin.schedule.aria.deleteBreak",
                                    )}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => openAddBreakModal(item.id)}
                              className="mt-1 inline-flex items-center gap-2 text-[12px] font-semibold text-[#ef942b]"
                            >
                              <Plus className="h-4 w-4" />
                              {t("admin.schedule.addBreak")}
                            </button>
                          </div>
                        )}
                      </article>
                    );
                  })}
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-[#d2d6de] bg-white px-4 py-8 text-center">
            <h3 className="text-[16px] font-semibold text-[#2e3440]">
              {t("admin.schedule.exceptions.title")}
            </h3>
            <p className="mt-1 text-[13px] text-[#8f96a3]">
              {t("admin.schedule.exceptions.description")}
            </p>
          </section>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={isSaving || isCreatingShop || !shopId}
          className="mt-7 h-12 w-full rounded-full bg-[#F49B33] text-sm font-semibold text-white transition hover:bg-[#e8891f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? t("admin.schedule.saving") : t("newShop.step2.next")}
        </button>
      </div>

      {timePicker.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/30"
          onClick={closeTimePicker}
        >
          <div
            className="w-full rounded-t-[22px] bg-white p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#d8dce2]" />
            <h4 className="mb-4 text-center text-[18px] font-semibold text-[#1f2530]">
              {t("admin.schedule.timePicker.title")}
            </h4>

            <div className="mb-5 flex items-center justify-center gap-2">
              <div
                className="flex select-none flex-col items-center gap-1"
                onTouchStart={(event) => handleSwipeStart(event, "hour")}
                onTouchEnd={handleSwipeEnd}
                role="slider"
                aria-label="Hour"
              >
                <button
                  type="button"
                  className="pointer-events-none text-[15px] text-[#d0d5dd]"
                >
                  {String((timePicker.hour + 23) % 24).padStart(2, "0")}
                </button>
                <button
                  type="button"
                  className="pointer-events-none min-w-16 rounded-xl border border-[#f1dcc5] bg-[#fcf7f1] px-4 py-1.5 text-[18px] font-bold text-[#222831]"
                >
                  {String(timePicker.hour).padStart(2, "0")}
                </button>
                <button
                  type="button"
                  className="pointer-events-none text-[15px] text-[#d0d5dd]"
                >
                  {String((timePicker.hour + 1) % 24).padStart(2, "0")}
                </button>
              </div>

              <span className="px-1 text-[18px] font-semibold text-[#f09a35]">
                :
              </span>

              <div
                className="flex select-none flex-col items-center gap-1"
                onTouchStart={(event) => handleSwipeStart(event, "minute")}
                onTouchEnd={handleSwipeEnd}
                role="slider"
                aria-label="Minute"
              >
                <button
                  type="button"
                  className="pointer-events-none text-[15px] text-[#d0d5dd]"
                >
                  {String((timePicker.minute + 55) % 60).padStart(2, "0")}
                </button>
                <button
                  type="button"
                  className="pointer-events-none min-w-16 rounded-xl border border-[#f1dcc5] bg-[#fcf7f1] px-4 py-1.5 text-[18px] font-bold text-[#222831]"
                >
                  {String(timePicker.minute).padStart(2, "0")}
                </button>
                <button
                  type="button"
                  className="pointer-events-none text-[15px] text-[#d0d5dd]"
                >
                  {String((timePicker.minute + 5) % 60).padStart(2, "0")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={closeTimePicker}
                className="rounded-xl border border-[#d8dde5] py-2 text-[13px] font-semibold text-[#7f8794]"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={confirmTimePicker}
                className="rounded-xl bg-[#f09a35] py-2 text-[13px] font-semibold text-white"
              >
                {t("common.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
