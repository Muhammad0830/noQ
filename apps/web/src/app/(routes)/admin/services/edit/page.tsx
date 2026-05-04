"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  Clock3,
  DollarSign,
  EllipsisVertical,
  Info,
  Pencil,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { API_ENDPOINTS, getStoredAuth } from "@/lib/api";
import BarbershopImage from "../../../../../../assets/Barbershop.png";

const staffMembers = [
  { id: "alex", name: "Alex Johnson", selected: true },
  { id: "sarah", name: "Sarah Miller", selected: false },
];

function EditServiceSkeleton() {
  return (
    <div className="space-y-4 pb-4 animate-pulse">
      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
        <div className="mb-3 h-4 w-28 rounded-full bg-[#eceff3]" />
        <div className="h-40 w-full rounded-[22px] bg-[#eceff3]" />
      </section>

      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
        <div className="mb-3 h-4 w-32 rounded-full bg-[#eceff3]" />
        <div className="h-12 w-full rounded-2xl bg-[#eceff3]" />
      </section>

      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
        <div className="mb-3 h-4 w-36 rounded-full bg-[#eceff3]" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 rounded-2xl bg-[#eceff3]" />
          <div className="h-12 rounded-2xl bg-[#eceff3]" />
        </div>
        <div className="mt-4 h-20 rounded-2xl bg-[#eceff3]" />
      </section>

      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
        <div className="mb-3 h-4 w-44 rounded-full bg-[#eceff3]" />
        <div className="h-12 w-full rounded-2xl bg-[#eceff3]" />
      </section>

      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
        <div className="mb-3 h-4 w-36 rounded-full bg-[#eceff3]" />
        <div className="h-12 rounded-2xl bg-[#eceff3]" />
        <div className="mt-3 h-12 rounded-2xl bg-[#eceff3]" />
      </section>

      <div className="pt-2 space-y-3">
        <div className="h-14 w-full rounded-full bg-[#eceff3]" />
        <div className="h-14 w-full rounded-full bg-[#eceff3]" />
      </div>
    </div>
  );
}

export default function EditServicePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [persistedShopId, setPersistedShopId] = useState<string | null>(null);
  const [hasLoadedPersistedShop, setHasLoadedPersistedShop] = useState(false);
  const [isLoadingService, setIsLoadingService] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isBufferTimeEnabled, setIsBufferTimeEnabled] = useState(true);
  const [durationWarnings, setDurationWarnings] = useState<{
    hours: string | null;
    minutes: string | null;
  }>({
    hours: null,
    minutes: null,
  });
  const [service, setService] = useState({
    name: "",
    hours: "0",
    minutes: "45",
    bufferTime: "15",
    price: "",
    selectedStaff: ["alex"],
  });

  const allMembersSelected =
    service.selectedStaff.length === staffMembers.length;

  const shopIdFromQuery = searchParams.get("shopId");
  const serviceId = searchParams.get("serviceId");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("selected_shop_id");
    if (saved) {
      setPersistedShopId(saved);
    }
    setHasLoadedPersistedShop(true);
  }, []);

  const activeShopId = useMemo(() => {
    if (!hasLoadedPersistedShop) return null;

    const userShops = user?.shops || [];

    if (
      shopIdFromQuery &&
      userShops.some((shop) => shop.id === shopIdFromQuery)
    ) {
      return shopIdFromQuery;
    }

    if (
      persistedShopId &&
      userShops.some((shop) => shop.id === persistedShopId)
    ) {
      return persistedShopId;
    }

    return userShops[0]?.id || null;
  }, [hasLoadedPersistedShop, persistedShopId, shopIdFromQuery, user?.shops]);

  const handleHoursChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly === "") {
      setService((current) => ({ ...current, hours: "" }));
      setDurationWarnings((current) => ({ ...current, hours: null }));
      return;
    }

    const parsed = Number(digitsOnly);
    if (parsed > 23) {
      setService((current) => ({ ...current, hours: "23" }));
      setDurationWarnings((current) => ({
        ...current,
        hours: t("admin.services.error.maxHours"),
      }));
      return;
    }

    setService((current) => ({ ...current, hours: String(parsed) }));
    setDurationWarnings((current) => ({ ...current, hours: null }));
  };

  const handleMinutesChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly === "") {
      setService((current) => ({ ...current, minutes: "" }));
      setDurationWarnings((current) => ({ ...current, minutes: null }));
      return;
    }

    const parsed = Number(digitsOnly);
    if (parsed > 60) {
      setService((current) => ({ ...current, minutes: "60" }));
      setDurationWarnings((current) => ({
        ...current,
        minutes: t("admin.services.error.maxMinutes"),
      }));
      return;
    }

    setService((current) => ({ ...current, minutes: String(parsed) }));
    setDurationWarnings((current) => ({ ...current, minutes: null }));
  };

  useEffect(() => {
    if (
      !hasLoadedPersistedShop ||
      !activeShopId ||
      !serviceId ||
      typeof window === "undefined"
    ) {
      return;
    }

    window.localStorage.setItem("selected_shop_id", activeShopId);

    const controller = new AbortController();

    const loadService = async () => {
      try {
        setIsLoadingService(true);
        setLoadError(null);

        const token = getStoredAuth()?.token;
        const response = await fetch(
          `${API_ENDPOINTS.admin.services}?shopId=${encodeURIComponent(activeShopId)}`,
          {
            method: "GET",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "x-shopid": activeShopId,
              "x-shop-id": activeShopId,
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          const message =
            body && typeof body.message === "string"
              ? body.message
              : t("admin.services.error.loadOneFailed");
          throw new Error(message);
        }

        const services = (await response.json()) as Array<{
          id: string;
          name: string;
          price: string | number;
          durationMin: number;
          bufferTime: number | null;
        }>;

        const current = services.find((item) => item.id === serviceId);

        if (!current) {
          throw new Error(t("admin.services.error.serviceNotFound"));
        }

        const durationHours = Math.floor(current.durationMin / 60);
        const durationMinutes = current.durationMin % 60;

        setService((previous) => ({
          ...previous,
          name: current.name ?? "",
          hours: String(durationHours),
          minutes: String(durationMinutes),
          bufferTime:
            current.bufferTime === null ? "" : String(current.bufferTime),
          price: String(current.price ?? ""),
        }));
        setIsBufferTimeEnabled(current.bufferTime !== null);
        setDurationWarnings({ hours: null, minutes: null });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setLoadError(
          error instanceof Error
            ? error.message
            : t("admin.services.error.loadOneFailed"),
        );
      } finally {
        setIsLoadingService(false);
      }
    };

    void loadService();

    return () => controller.abort();
  }, [activeShopId, hasLoadedPersistedShop, serviceId, t]);

  const handleSave = (e: React.FormEvent) => {
    const saveService = async () => {
      e.preventDefault();

      if (!activeShopId || !serviceId || isSubmitting) {
        setSubmitError(t("admin.services.error.missingServiceOrShop"));
        return;
      }

      const durationMin = Number(service.hours) * 60 + Number(service.minutes);
      const price = Number(service.price);
      const bufferTime = service.bufferTime.trim();

      if (!service.name.trim()) {
        setSubmitError(t("admin.services.error.nameRequired"));
        return;
      }

      if (Number.isNaN(durationMin) || durationMin <= 0) {
        setSubmitError(t("admin.services.error.invalidDuration"));
        return;
      }

      if (Number.isNaN(price) || price <= 0) {
        setSubmitError(t("admin.services.error.invalidPrice"));
        return;
      }

      try {
        setIsSubmitting(true);
        setSubmitError(null);

        const token = getStoredAuth()?.token;
        const response = await fetch(
          `${API_ENDPOINTS.admin.services}/${encodeURIComponent(serviceId)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "x-shopid": activeShopId,
              "x-shop-id": activeShopId,
            },
            body: JSON.stringify({
              name: service.name.trim(),
              price,
              durationMin,
              bufferTime:
                isBufferTimeEnabled && bufferTime !== ""
                  ? Number(bufferTime)
                  : null,
            }),
          },
        );

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          const message =
            body && typeof body.message === "string"
              ? body.message
              : t("admin.services.error.updateFailed");
          throw new Error(message);
        }

        router.push(
          `/admin/services?shopId=${encodeURIComponent(activeShopId)}`,
        );
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : t("admin.services.error.updateFailed"),
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    void saveService();
  };

  const handleDelete = async () => {
    if (!activeShopId || !serviceId || isDeleting) {
      setSubmitError(t("admin.services.error.missingServiceOrShop"));
      return;
    }

    try {
      setIsDeleting(true);
      setSubmitError(null);

      const token = getStoredAuth()?.token;
      const response = await fetch(
        `${API_ENDPOINTS.admin.services}/${encodeURIComponent(serviceId)}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "x-shopid": activeShopId,
            "x-shop-id": activeShopId,
          },
        },
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body && typeof body.message === "string"
            ? body.message
            : t("admin.services.error.deleteFailed");
        throw new Error(message);
      }

      router.push(`/admin/services?shopId=${encodeURIComponent(activeShopId)}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : t("admin.services.error.deleteFailed"),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#f5f6f8] pb-8 text-[#111827]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7dbe3] bg-white text-[#8d95a3] shadow-sm transition-transform active:scale-95"
            aria-label={t("admin.services.aria.goBack")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h1 className="text-[18px] font-semibold tracking-tight text-[#111827]">
            {t("admin.services.editTitle")}
          </h1>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#b2b8c3] transition-colors hover:bg-black/5"
            aria-label={t("admin.services.aria.moreOptions")}
          >
            <EllipsisVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-6">
        {isLoadingService ? (
          <EditServiceSkeleton />
        ) : (
          <form onSubmit={handleSave} className="space-y-4 pb-4">
            {loadError && (
              <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {loadError}
              </div>
            )}

            {submitError && (
              <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
              <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
                <Info className="h-4 w-4 text-[#F49B33]" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                  {t("admin.services.heroAsset")}
                </span>
              </div>

              <div className="relative overflow-hidden rounded-[22px]">
                <Image
                  src={BarbershopImage}
                  alt={t("admin.services.serviceHeroAlt")}
                  className="h-40 w-full object-cover"
                  priority
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#2f3640] shadow-[0_8px_16px_rgba(0,0,0,0.16)] transition-transform active:scale-95"
                  aria-label={t("admin.services.aria.editHeroImage")}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </section>

            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
              <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
                <Info className="h-4 w-4 text-[#F49B33]" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                  {t("admin.services.serviceName")}
                </span>
              </div>

              <input
                type="text"
                required
                value={service.name}
                onChange={(e) =>
                  setService({ ...service, name: e.target.value })
                }
                placeholder={t("admin.services.serviceNamePlaceholder")}
                disabled={isLoadingService}
                className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
              />
            </section>

            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
              <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
                <Clock3 className="h-4 w-4 text-[#F49B33]" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                  {t("admin.services.serviceDuration")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                    {t("admin.services.hours")}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={service.hours}
                    onChange={(e) => handleHoursChange(e.target.value)}
                    placeholder="0-23"
                    disabled={isLoadingService}
                    className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] font-medium text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
                  />
                  {durationWarnings.hours && (
                    <p className="mt-1 text-[11px] font-medium text-red-500">
                      {durationWarnings.hours}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                    {t("admin.services.minutes")}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={service.minutes}
                    onChange={(e) => handleMinutesChange(e.target.value)}
                    placeholder="0-60"
                    disabled={isLoadingService}
                    className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] font-medium text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
                  />
                  {durationWarnings.minutes && (
                    <p className="mt-1 text-[11px] font-medium text-red-500">
                      {durationWarnings.minutes}
                    </p>
                  )}
                </label>
              </div>

              <div className="mt-4 rounded-2xl border border-[#eef1f5] bg-[#f8fafc] p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">
                      {t("admin.services.bufferTime")}
                    </p>
                    <p className="text-[12px] text-[#7a8493]">
                      {t("admin.services.bufferTimeHint")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setIsBufferTimeEnabled((current) => !current)
                    }
                    className={`relative h-6 w-11 rounded-full transition-colors ${isBufferTimeEnabled ? "bg-[#22c55e]" : "bg-[#d7dbe3]"}`}
                    aria-label={t("admin.services.aria.toggleBufferTime")}
                  >
                    <span
                      className={`absolute top-0.75 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-all ${isBufferTimeEnabled ? "left-5.75" : "left-0.75"}`}
                    />
                  </button>
                </div>

                <input
                  type="number"
                  min="0"
                  value={service.bufferTime}
                  onChange={(e) => {
                    setService({ ...service, bufferTime: e.target.value });
                  }}
                  placeholder="15"
                  disabled={isLoadingService || !isBufferTimeEnabled}
                  className={`h-12 w-full rounded-2xl border px-4 text-[15px] outline-none transition-colors placeholder:text-[#b0b7c3] ${
                    isLoadingService || !isBufferTimeEnabled
                      ? "cursor-not-allowed border-[#e4e7ec] bg-[#f3f5f8] text-[#9aa3b1]"
                      : "border-[#cfd5dd] bg-white text-[#111827] focus:border-[#F49B33]"
                  }`}
                />
              </div>
            </section>

            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
              <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
                <DollarSign className="h-4 w-4 text-[#F49B33]" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                  {t("admin.services.pricingOperations")}
                </span>
              </div>

              <label className="block">
                <span className="mb-2 block text-[14px] font-semibold text-[#111827]">
                  {t("admin.services.servicePrice")}
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#8c94a1]">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    value={service.price}
                    onChange={(e) =>
                      setService({ ...service, price: e.target.value })
                    }
                    placeholder="50000"
                    disabled={isLoadingService}
                    className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 pl-8 text-[15px] text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
                  />
                </div>
              </label>
            </section>

            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
              <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
                <Users className="h-4 w-4 text-[#F49B33]" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                  {t("admin.services.staffAssignment")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[14px] font-semibold text-[#6b7280]">
                    {t("admin.services.assignAllStaff")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setService((current) => ({
                      ...current,
                      selectedStaff: allMembersSelected
                        ? []
                        : staffMembers.map((member) => member.id),
                    }))
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${allMembersSelected ? "bg-[#22c55e]" : "bg-[#d7dbe3]"}`}
                  aria-label={t("admin.services.aria.toggleStaffAssignment")}
                >
                  <span
                    className={`absolute top-0.75 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-all ${allMembersSelected ? "left-5.75" : "left-0.75"}`}
                  />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9aa3b1]">
                  {t("admin.services.specificMembers")}
                </p>
                {staffMembers.map((member) => {
                  const active = service.selectedStaff.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() =>
                        setService((current) => ({
                          ...current,
                          selectedStaff: current.selectedStaff.includes(
                            member.id,
                          )
                            ? current.selectedStaff.filter(
                                (staffId) => staffId !== member.id,
                              )
                            : [...current.selectedStaff, member.id],
                        }))
                      }
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors ${
                        active
                          ? "border-[#F49B33] bg-[#F49B33] text-white shadow-[0_10px_24px_rgba(244,155,51,0.2)]"
                          : "border-[#e2e6ec] bg-white text-[#6b7280]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-white/15 text-white" : "bg-[#f3f4f6] text-[#9aa3b1]"}`}
                        >
                          <User className="h-5 w-5" />
                        </span>
                        <span className="text-[15px] font-medium">
                          {member.name}
                        </span>
                      </div>
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${active ? "border-white bg-white text-[#F49B33]" : "border-[#d8dde5] bg-white text-transparent"}`}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || isDeleting || isLoadingService}
                className="flex h-14 w-full items-center justify-center rounded-full bg-[#F49B33] text-[16px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_16px_32px_rgba(244,155,51,0.28)] transition-transform active:scale-[0.99]"
              >
                {isSubmitting
                  ? t("admin.services.saving")
                  : t("admin.services.save")}
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting || isSubmitting || isLoadingService}
                className="flex h-14 w-full items-center justify-center rounded-full border border-[#f3b6b3] bg-white text-[14px] font-semibold uppercase tracking-[0.08em] text-[#ef4444]"
              >
                {isDeleting
                  ? t("admin.services.deleting")
                  : t("admin.services.deleteService")}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
