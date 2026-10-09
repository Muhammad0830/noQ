"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Check,
  Clock3,
  Coffee,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { API_ENDPOINTS, getStoredAuth } from "@/lib/api";
import type {
  DaySchedule,
  TimePickerState,
} from "@shared/types/general_types";
import { useTranslations } from "next-intl";
import { TimePicker } from "@/components/paragon/ui/time-picker";
import { dayMeta, defaultTimePicker, getDefaultDays, getToday } from "@/features/addBusiness/utils";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

type ExpandedDay = (typeof dayMeta)[number]["day"] | "";

type StepOneForm = {
  businessName: string;
  categoryId: string;
  description: string;
  address: string;
  phone: string;
};

const buildNonOverlappingDaySlots = (day: DaySchedule) => {
  if (!day.enabled || !(day.openStart < day.openEnd)) {
    return [] as { startTime: string; endTime: string; block: boolean }[];
  }

  const filteredBreaks = day.breaks
    .filter(
      (b) =>
        b.startTime < b.endTime &&
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

export default function AddBusinessStepTwoPage() {
  const router = useRouter();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"schedule" | "exceptions">(
    "schedule",
  );
  const [expandedDay, setExpandedDay] = useState<ExpandedDay>(getToday());
  const [days, setDays] = useState<DaySchedule[]>(getDefaultDays());
  const [shopId, setShopId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [timePicker, setTimePicker] = useState<TimePickerState>(defaultTimePicker);
  const [newShopDetails] = useState(() => typeof window !== 'undefined'
    ? sessionStorage.getItem("new_shop_details") : null)

  useEffect(() => {
    console.log('working', newShopDetails)
    if (!newShopDetails) {
      router.replace("/add-business");
    }
  }, [newShopDetails, router])

  useEffect(() => {
    if (typeof window === "undefined") return;

    return;

    const CREATION_LOCK_KEY = "new_shop_creating";

    const isShopCreating =
      window.sessionStorage.getItem(CREATION_LOCK_KEY) === "1";
    if (isShopCreating) {

      const startedAt = Date.now();
      const interval = window.setInterval(() => {
        const createdId = window.sessionStorage.getItem("new_shop_id");
        if (createdId) {
          setShopId(createdId);
          window.clearInterval(interval);
          return;
        }

        if (Date.now() - startedAt > 20_000) {
          window.sessionStorage.removeItem(CREATION_LOCK_KEY);
          window.clearInterval(interval);
        }
      }, 300);

      return () => window.clearInterval(interval);
    }

    const createShop = async () => {
      window.sessionStorage.setItem(CREATION_LOCK_KEY, "1");

      try {
        const draft = JSON.parse(window.sessionStorage.getItem("new_shop_details") || '') as StepOneForm;
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
      } finally {
        window.sessionStorage.removeItem(CREATION_LOCK_KEY);
      }
    };

    void createShop();
  }, [router, t]);

  const toggleDay = (id: string) => {
    const currentDay = days.find((item) => item.id === id);
    const willDisable = Boolean(currentDay?.enabled);

    if (willDisable) {
      setExpandedDay((prev) => (prev === id ? "Monday" : prev));
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

    setTimePicker({
      isOpen: true,
      dayId: id,
      mode: "add",
      breakIndex: null,
      field: "startTime",
      time: lastBreak?.endTime || "13:00",
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

    setTimePicker({
      isOpen: true,
      dayId: id,
      mode: "edit",
      breakIndex,
      field,
      time: currentTime,
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

    setTimePicker({
      isOpen: true,
      dayId: id,
      mode: "edit",
      breakIndex: null,
      field,
      time: currentTime,
    });
  };

  const confirmTimePicker = () => {
    if (!timePicker.dayId) return;

    if (timePicker.mode === "add") {
      setDays((prev) =>
        prev.map((item) =>
          item.id === timePicker.dayId
            ? {
              ...item,
              breaks: [...item.breaks, { startTime: timePicker.time, endTime: "" }],
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
                  ? { ...breakItem, [timePicker.field]: timePicker.time }
                  : breakItem,
              ),
            };
          }

          return {
            ...item,
            [timePicker.field === "startTime" ? "openStart" : "openEnd"]:
              timePicker.time,
          };
        }),
      );
    }

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

  const saveSchedule = async () => {
    if (!shopId) {
      return false;
    }

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
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    const ok = await saveSchedule();
    if (!ok) return;
    router.push("/add-business/step-3");
  };

  return (
    <main className="min-h-screen bg-[#f4f5f8] px-4 py-5 text-slate-900">
      <div className="mx-auto w-full" style={{ maxWidth: 540 }}>
        <section className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${activeTab === "schedule"
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
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${activeTab === "exceptions"
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
              {days.map((item) => {
                const isExpanded = expandedDay === item.id;
                const dayLabel = t(`admin.schedule.day.${item.day.toLowerCase()}`);
                const hoursText = item.enabled
                  ? `${item.openStart} - ${item.openEnd}`
                  : t("admin.schedule.closed");

                return (
                  <article
                    key={item.id}
                    className={`rounded-[14px] border bg-white px-3 py-2.5 shadow-[0_4px_14px_rgba(17,24,39,0.04)] ${isExpanded ? "border-[#f0bc89]" : "border-[#e7e8ec]"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[18px] font-semibold tracking-tight text-[#252a31]">
                            {dayLabel}
                          </p>
                          {item.id === getToday() && (
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
                          className={`relative h-6 w-11 rounded-full transition-colors ${item.enabled ? "bg-[#24b565]" : "bg-[#dbdde2]"
                            }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${item.enabled ? "left-5.5" : "left-0.5"
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
                          className={`inline-flex items-center justify-center transition-colors ${isExpanded
                            ? "h-9 w-9 rounded-2xl bg-[#f2f3f5] text-[#20b35f]"
                            : "h-9 w-9 rounded-full text-[#b8bdc8] hover:bg-[#f3f4f6]"
                            } ${!item.enabled ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""}`}
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
          disabled={isSaving || !shopId}
          className="mt-7 h-12 w-full rounded-full bg-[#F49B33] text-sm font-semibold text-white transition hover:bg-[#e8891f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? t("admin.schedule.saving") : t("newShop.step2.next")}
        </button>
      </div>

      <Drawer
        open={timePicker.isOpen}
        direction="bottom"
        onOpenChange={(value) => setTimePicker(prev => ({ ...prev, isOpen: value }))}
      >
        <DrawerContent className="rounded-lg">
          <DrawerHeader>
            <DrawerTitle>
              {t("admin.schedule.timePicker")}
            </DrawerTitle>
          </DrawerHeader>

          <div className="w-full flex justify-center">
            <TimePicker
              hourCycle={24}
              defaultValue="13:00"
              value={timePicker.time}
              onValueChange={(time) => setTimePicker(prev => ({ ...prev, time }))} />
          </div>

          <DrawerFooter>
            <div className="flex gap-2">
              <DrawerClose onClick={() => setTimePicker(defaultTimePicker)}
                className="flex-1 rounded-xl h-12 border border-[#d8dde5] py-2 text-[13px] font-semibold text-[#7f8794]">
                {t("common.cancel")}
              </DrawerClose>
              <DrawerClose onClick={confirmTimePicker}
                className="flex-1 rounded-xl h-12 bg-[#f09a35] py-2 text-[13px] font-semibold text-white">
                {t("common.confirm")}
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
