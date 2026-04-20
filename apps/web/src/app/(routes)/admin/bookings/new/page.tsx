"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MoreHorizontal,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import type { Service } from "@shared/types/general_types";

type StaffApiItem = {
  id: string;
  role: "OWNER" | "MANAGER" | "STAFF";
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

type StaffResponse = {
  owner?: StaffApiItem[];
  staffMembers?: StaffApiItem[];
};

type SlotItem = {
  id: string;
  time: string;
  available: boolean;
  duration: number;
  bufferTime: number;
};

type UserItem = {
  id: string;
  name?: string;
  email?: string;
  role?: "USER" | "ADMIN";
};

const avatarGradients = [
  "from-[#F49B33] to-[#ffd39a]",
  "from-[#f28c1b] to-[#f49b33]",
  "from-[#f4b35c] to-[#f49b33]",
] as const;

const toIsoDate = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + minutes, 0, 0);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export default function AdminNewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { t, locale, language } = useLanguage();

  const [persistedShopId, setPersistedShopId] = useState<string | null>(null);
  const [hasLoadedPersistedShop, setHasLoadedPersistedShop] = useState(false);

  const [customerSearch, setCustomerSearch] = useState("");
  const [isCustomerPickerOpen, setIsCustomerPickerOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    kind: "success" | "error";
  } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [showServices, setShowServices] = useState(true);
  const [visibleDayStart, setVisibleDayStart] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    searchParams.get("date") || toIsoDate(new Date()),
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const shopId = searchParams.get("shopId");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("selected_shop_id");
    if (saved) setPersistedShopId(saved);
    setHasLoadedPersistedShop(true);
  }, []);

  const activeShopId = useMemo(() => {
    if (!hasLoadedPersistedShop) return null;

    const userShops = user?.shops || [];

    if (shopId && userShops.some((s) => s.id === shopId)) return shopId;
    if (
      persistedShopId &&
      userShops.some((s) => s.id === persistedShopId)
    ) {
      return persistedShopId;
    }

    return userShops[0]?.id || null;
  }, [hasLoadedPersistedShop, persistedShopId, shopId, user?.shops]);

  useEffect(() => {
    if (!activeShopId || typeof window === "undefined") return;
    window.localStorage.setItem("selected_shop_id", activeShopId);
  }, [activeShopId]);

  const adminBackHref = useMemo(() => {
    if (!activeShopId) return "/admin";
    return `/admin?shopId=${encodeURIComponent(activeShopId)}`;
  }, [activeShopId]);

  const currentShopName = useMemo(() => {
    const match = user?.shops?.find((s) => s.id === activeShopId);
    return match?.name || t("booking.defaultShop");
  }, [activeShopId, t, user?.shops]);

  const { data: services = [], isLoading: servicesLoading } = useApiQuery<
    Service[]
  >(activeShopId ? API_ENDPOINTS.shopServices(activeShopId) : null, {
    key: ["admin-new-booking-services", activeShopId || "none"],
    enabled: Boolean(activeShopId && user),
    staleTime: 30_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: users = [], isLoading: usersLoading } = useApiQuery<UserItem[]>(
    user?.role === "ADMIN" ? API_ENDPOINTS.admin.users : null,
    {
      key: ["admin-new-booking-users", user?.id || "guest"],
      enabled: Boolean(user?.role === "ADMIN"),
      staleTime: 30_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const { data: staffResponse, isLoading: staffLoading } =
    useApiQuery<StaffResponse>(activeShopId ? API_ENDPOINTS.admin.staffs : null, {
      key: ["admin-new-booking-staff", activeShopId || "none"],
      enabled: Boolean(activeShopId && user),
      staleTime: 30_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      headers: activeShopId
        ? { "x-shopid": activeShopId, "x-shop-id": activeShopId }
        : undefined,
    });

  const staffOptions = useMemo(() => {
    const owner = staffResponse?.owner || [];
    const members = staffResponse?.staffMembers || [];
    const merged = [...owner, ...members];
    const map = new Map<string, StaffApiItem>();

    for (const item of merged) {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    }

    return Array.from(map.values());
  }, [staffResponse]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) || null,
    [services, selectedServiceId],
  );

  const slotsUrl = useMemo(() => {
    if (!activeShopId || !selectedDate || !selectedServiceId) return null;

    const params = new URLSearchParams({
      shopId: activeShopId,
      date: selectedDate,
      serviceId: selectedServiceId,
    });

    if (selectedStaffId) {
      params.set("staffId", selectedStaffId);
    }

    return `${API_ENDPOINTS.bookingsAvailableSlots}?${params.toString()}`;
  }, [activeShopId, selectedDate, selectedServiceId, selectedStaffId]);

  const { data: slots = [], isLoading: slotsLoading } = useApiQuery<SlotItem[]>(
    slotsUrl,
    {
      key: [
        "admin-new-booking-slots",
        activeShopId || "none",
        selectedDate,
        selectedServiceId || "none",
        selectedStaffId || "none",
      ],
      enabled: Boolean(slotsUrl),
      staleTime: 15_000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate, selectedServiceId, selectedStaffId]);

  useEffect(() => {
    setSelectedUserId(null);
    setSelectedStaffId(null);
    setSelectedTime(null);
    setIsCustomerPickerOpen(false);
    setCustomerSearch("");
  }, [selectedServiceId]);

  useEffect(() => {
    if (!selectedService || !selectedUserId) return;
    if (!selectedStaffId && staffOptions.length > 0) {
      setSelectedStaffId(staffOptions[0]!.id);
    }
  }, [selectedService, selectedUserId, selectedStaffId, staffOptions]);

  const availableSlots = useMemo(
    () => slots.filter((slot) => slot.available),
    [slots],
  );

  const filteredUsers = useMemo(() => {
    const query = customerSearch.toLowerCase().trim();

    const userOnly = users.filter((u) => u.role !== "ADMIN");

    if (!query) return userOnly.slice(0, 20);

    return userOnly
      .filter((u) => {
        const name = (u.name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        return name.includes(query) || email.includes(query);
      })
      .slice(0, 20);
  }, [customerSearch, users]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selectedCustomer = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId],
  );

  const nextDays = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 21; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  }, []);

  const selectedDateObj = useMemo(() => {
    const parsed = new Date(`${selectedDate}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [selectedDate]);

  const monthNames: Record<string, string[]> = {
    "uz-latn": [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avgust",
      "sentabr",
      "oktabr",
      "noyabr",
      "dekabr",
    ],
    "uz-cyrl": [
      "январ",
      "феврал",
      "март",
      "апрел",
      "май",
      "июн",
      "июл",
      "август",
      "сентябр",
      "октябр",
      "ноябр",
      "декабр",
    ],
    ru: [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ],
  };

  const weekdayShortFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short" }),
    [locale],
  );

  const monthYearLabel = `${selectedDateObj.getDate()} ${
    monthNames[language]?.[selectedDateObj.getMonth()] ||
    selectedDateObj.toLocaleDateString(locale || undefined, { month: "long" })
  }`;

  const visibleDays = useMemo(
    () => nextDays.slice(visibleDayStart, visibleDayStart + 5),
    [nextDays, visibleDayStart],
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const { mutateAsync: createBooking, isPending } = useApiMutation(
    API_ENDPOINTS.bookings,
    "post",
  );

  const handleCreate = async () => {
    if (!activeShopId || !selectedUserId || !selectedServiceId || !selectedTime) {
      return;
    }

    try {
      await createBooking({
        shopId: activeShopId,
        userId: selectedUserId,
        serviceId: selectedServiceId,
        staffId: selectedStaffId || undefined,
        startTime: `${selectedDate}T${selectedTime}:00`,
      });

      setToast({ message: t("booking.success"), kind: "success" });
      router.push(adminBackHref);
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        t("booking.error");
      setToast({ message: backendMessage, kind: "error" });
    }
  };

  const canSubmit = Boolean(
    activeShopId &&
      selectedUserId &&
      selectedServiceId &&
      selectedStaffId &&
      selectedDate &&
      selectedTime &&
      !isPending,
  );

  const priceLabel = useMemo(() => {
    if (selectedService?.price == null) return "—";
    return new Intl.NumberFormat(locale || undefined).format(
      Number(selectedService.price),
    );
  }, [locale, selectedService?.price]);

  const selectedDuration = selectedService?.durationMin ?? 45;
  const bookingEndTime = selectedTime
    ? addMinutes(selectedTime, selectedDuration)
    : null;

  const timelineSlots = useMemo(
    () =>
      slots.map((slot) => ({
        ...slot,
        startMin: timeToMinutes(slot.time),
      })),
    [slots],
  );

  const stepGuideMessage = !selectedService
    ? "Avval xizmatni tanlang. Keyingi qadamlar shundan keyin ochiladi."
    : !selectedUserId
      ? "Mijozni tanlang. Shundan keyin xodim, sana va vaqt tanlash ochiladi."
      : "Endi xodim, sana va vaqtni ketma-ket tanlang.";

  if (!activeShopId) {
    return (
      <div className="min-h-dvh bg-[#f7f0e7] p-4">
        <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-700">{t("admin.newBooking.selectShopFirst")}</p>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="mt-4 inline-flex items-center rounded-full bg-orange-400 px-4 py-2 text-sm font-semibold text-white"
          >
            {t("admin.newBooking.back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white text-slate-900 pb-0">
      {toast && (
        <div className="fixed left-1/2 top-4 z-80 w-[92%] max-w-sm -translate-x-1/2">
          <div
            className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm shadow-xl ${
              toast.kind === "success"
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-red-500 bg-red-500 text-white"
            }`}
          >
            <div
              className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                toast.kind === "success" ? "bg-white/15" : "bg-white/15"
              }`}
            >
              {toast.kind === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-white" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-white" />
              )}
            </div>

            <p className="flex-1 font-medium leading-5 text-white">{toast.message}</p>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="rounded-full p-1 text-white transition hover:bg-white/15"
              aria-label={t("common.close")}
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 pt-3">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => router.push(adminBackHref)}
            className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold tracking-wide">{t("admin.newBooking.title")}</p>
            <p className="text-[10px] text-[#F49B33] uppercase tracking-[0.2em]">
              {currentShopName}
            </p>
          </div>

          <button className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <div className="mb-4 text-sm font-medium text-[#F49B33]">
          {stepGuideMessage}
        </div>

        <section className="mb-3">
          <h3 className="mb-2 text-sm font-bold text-slate-900">
            1. {t("booking.service")}
          </h3>
        </section>

        {selectedService && (
          <div
            onClick={() => setShowServices((prev) => !prev)}
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4 mb-6 cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900">
                  {selectedService.name}
                </p>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span className="text-[#F49B33] font-bold">{priceLabel}</span>
                  <span className="text-orange-300">·</span>
                  <span className="text-slate-500">
                    {selectedDuration} {t("services.duration")}
                  </span>
                </div>
              </div>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setShowServices((prev) => !prev);
                }}
                className="text-xs font-semibold rounded-full px-4 py-2 border border-orange-200 bg-white text-orange-500"
              >
                {t("booking.edit")}
              </button>
            </div>
          </div>
        )}

        {(showServices || !selectedService) && (
          <div className="space-y-2 mb-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setShowServices(false);
                }}
                className={`w-full text-left rounded-xl p-3 border ${
                  selectedService?.id === service.id
                    ? "border-[#F49B33] bg-orange-50 shadow-sm"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-sm font-medium text-slate-900">{service.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {Number(service.price ?? 0)} · {service.durationMin ?? 45} {t("services.duration")}
                </p>
              </button>
            ))}

            {!servicesLoading && services.length === 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {t("admin.newBooking.noServices")}
              </div>
            )}
          </div>
        )}

        {selectedService && (
        <section className="mb-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              2. {t("admin.newBooking.selectedCustomer")}
            </h3>
            {selectedCustomer && (
              <button
                type="button"
                onClick={() => setIsCustomerPickerOpen(true)}
                className="text-[11px] font-semibold text-[#F49B33]"
              >
                {t("booking.edit")}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCustomerPickerOpen(true)}
            className="mb-3 flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-orange-300 hover:bg-orange-50"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shrink-0">
              <UserRound className="h-4 w-4 text-gray-500" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-gray-800">
                {selectedCustomer ? selectedCustomer.name || selectedCustomer.email || "—" : "Mijozni tanlang"}
              </span>
              <span className="block truncate text-xs text-gray-500">
                {selectedCustomer?.email || "Bosish orqali mijozni tanlang"}
              </span>
            </span>
          </button>

          {isCustomerPickerOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
              onClick={() => setIsCustomerPickerOpen(false)}
            >
              <div
                className="flex h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800">
                    {t("admin.newBooking.searchCustomer")}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsCustomerPickerOpen(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                    aria-label={t("common.close")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder={t("admin.newBooking.searchCustomer")}
                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {usersLoading ? (
                    <p className="text-sm text-gray-500">{t("common.loading")}</p>
                  ) : filteredUsers.length === 0 ? (
                    <p className="text-sm text-gray-500">{t("admin.newBooking.noCustomers")}</p>
                  ) : (
                    filteredUsers.map((customer) => {
                      const active = selectedUserId === customer.id;
                      return (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => {
                            setSelectedUserId(customer.id);
                            setIsCustomerPickerOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left ${
                            active
                              ? "border-orange-300 bg-orange-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <UserRound className="h-4 w-4 text-gray-500" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-gray-800">
                              {customer.name || customer.email || customer.id}
                            </span>
                            {customer.email && (
                              <span className="block truncate text-xs text-gray-500">
                                {customer.email}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
        )}

        {selectedService && selectedUserId ? (
        <>
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-bold text-slate-900">
            3. {t("booking.selectStaff")}
          </h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {staffOptions.slice(0, 3).map((member, index) => {
              const isActive = selectedStaffId === member.id;
              const gradientClass = avatarGradients[index % avatarGradients.length];
              const label = member.user?.name || member.user?.email || member.id;

              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedStaffId(member.id)}
                  className="w-full text-center flex flex-col items-center"
                >
                  <div className={`h-16 w-16 rounded-full border-2 p-0.5 ${isActive ? "border-[#F49B33] shadow-[0_0_0_2px_rgba(244,155,51,0.22)]" : "border-slate-300"}`}>
                    <div className={`h-full w-full rounded-full bg-linear-to-br ${gradientClass} flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold tracking-wide">
                        {getInitials(label)}
                      </span>
                    </div>
                  </div>
                  <p className={`mt-2 w-full px-1 text-[11px] leading-[1.2] min-h-[2.4rem] whitespace-normal wrap-break-word ${isActive ? "text-[#F49B33]" : "text-slate-500"}`}>
                    {label}
                  </p>
                </button>
              );
            })}

            {staffLoading && (
              <p className="text-xs text-slate-500 mt-6">{t("common.loading")}</p>
            )}
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">4. {monthYearLabel}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setVisibleDayStart((prev) => Math.max(0, prev - 5))}
                className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setVisibleDayStart((prev) =>
                    Math.min(Math.max(nextDays.length - 5, 0), prev + 5),
                  )
                }
                className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {visibleDays.map((day) => {
              const dateStr = day.toISOString().split("T")[0];
              const isActive = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setSelectedTime(null);
                  }}
                  className={`rounded-xl py-2 text-center border ${
                    isActive
                      ? "bg-[#F49B33] text-white border-[#F49B33] shadow-[0_8px_18px_rgba(244,155,51,0.24)]"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  <p className="text-[10px] uppercase">
                    {weekdayShortFormatter.format(day)}
                  </p>
                  <p className="text-lg font-semibold leading-5 mt-1">
                    {day.getDate()}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">
              5. {t("booking.timeline")}
            </h3>
            <p className="text-[10px] tracking-[0.16em] text-[#F49B33] uppercase">
              {t("booking.liveSelection")}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
            <div className="max-h-72 overflow-y-auto pr-1">
              {slotsLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`slot-skeleton-${index}`}
                      className="rounded-3xl min-h-18 border border-slate-200 bg-slate-50 px-3 py-3"
                    >
                      <div className="mx-auto h-4 w-20 animate-pulse rounded-full bg-slate-200" />
                      <div className="mx-auto mt-2 h-2.5 w-14 animate-pulse rounded-full bg-slate-200" />
                    </div>
                  ))}
                </div>
              ) : timelineSlots.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm text-slate-600">
                  {t("admin.newBooking.noSlots")}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {timelineSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    const isBooked = !slot.available;
                    const canSelect = !isBooked;
                    const endTime = addMinutes(slot.time, slot.duration || selectedDuration);
                    const status = isSelected
                      ? "selected"
                      : isBooked
                        ? "booked"
                        : "available";
                    const statusLabel =
                      status === "selected"
                        ? t("booking.selected")
                        : status === "available"
                          ? t("booking.availableSlot")
                          : t("booking.alreadyReserved");

                    return (
                      <button
                        key={slot.id}
                        onClick={() => canSelect && setSelectedTime(slot.time)}
                        disabled={!canSelect}
                        className={`rounded-3xl min-h-18 border px-3 py-2 text-center transition-all ${
                          status === "selected"
                            ? "border-[#F49B33] bg-[#F49B33] text-white shadow-[0_0_0_1px_rgba(244,155,51,0.45),0_6px_14px_rgba(244,155,51,0.22)]"
                            : status === "available"
                              ? "border-slate-200 bg-white text-slate-700 hover:border-[#F49B33] hover:text-[#F49B33]"
                              : "border-slate-200 bg-slate-100/90 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        <p className="text-[14px] leading-none font-bold tracking-tight">
                          {slot.time} - {endTime}
                        </p>
                        <p className="mt-1 text-[8px] uppercase tracking-[0.08em] font-semibold opacity-95">
                          {statusLabel}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
        </>
        ) : null}
      </div>

      {selectedService && selectedUserId && (
      <div className="mt-6 mb-4 px-3 sm:px-0">
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 mb-3">
            <div className="flex justify-between text-xs text-slate-600">
              <span className="uppercase tracking-wide">
                {t("booking.selectedWindow")}
              </span>
              <span className="uppercase tracking-wide">
                {t("booking.total")}
              </span>
            </div>
            <div className="flex justify-between items-end mt-1">
              <p className="font-semibold text-[#F49B33]">
                {selectedTime && bookingEndTime
                  ? `${selectedTime} — ${bookingEndTime}`
                  : "--:--"}
              </p>
              <p className="text-2xl font-bold text-[#F49B33]">
                {priceLabel}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-700">
              <UserRound className="h-3.5 w-3.5 text-slate-500" />
              <span className="truncate">
                {t("admin.newBooking.selectedCustomer")}: {selectedCustomer?.name || selectedCustomer?.email || "—"}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-700">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span className="truncate">
                {t("booking.staff")}: {staffOptions.find((s) => s.id === selectedStaffId)?.user?.name || "—"}
              </span>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!canSubmit}
            className="w-full py-3 rounded-full bg-[#F49B33] text-white font-bold tracking-wide shadow-[0_10px_24px_rgba(244,155,51,0.28)] disabled:opacity-50"
          >
            {isPending ? t("booking.processing") : t("booking.confirmBooking")}
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
