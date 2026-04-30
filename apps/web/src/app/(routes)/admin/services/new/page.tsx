"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  Clock3,
  Loader2,
  DollarSign,
  EllipsisVertical,
  Info,
  User,
  Users,
  Check,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";

type AdminService = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  durationMin: number;
  isActive: boolean;
  shopId: string;
  bufferTime: number | null;
  shop?: {
    name?: string;
  };
};

type CreateServicePayload = {
  name: string;
  price: number;
  durationMin: number;
  bufferTime: number | null;
};

const staffMembers = [
  { id: "alex", name: "Alex Johnson", selected: true },
  { id: "sarah", name: "Sarah Miller", selected: false },
];

export default function AddNewService() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [persistedShopId, setPersistedShopId] = useState<string | null>(null);
  const [hasLoadedPersistedShop, setHasLoadedPersistedShop] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [durationWarnings, setDurationWarnings] = useState<{
    hours: string | null;
    minutes: string | null;
  }>({
    hours: null,
    minutes: null,
  });
  const [isBufferTimeEnabled, setIsBufferTimeEnabled] = useState(true);
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

  const { mutateAsync: createService, isPending: isSubmitting } =
    useApiMutation<AdminService, CreateServicePayload>(
      API_ENDPOINTS.admin.services,
      "post",
      activeShopId
        ? {
            headers: {
              "x-shopid": activeShopId,
              "x-shop-id": activeShopId,
            },
          }
        : undefined,
    );

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
        hours: t("admin.services.new.hoursWarning"),
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
        minutes: t("admin.services.new.minutesWarning"),
      }));
      return;
    }

    setService((current) => ({ ...current, minutes: String(parsed) }));
    setDurationWarnings((current) => ({ ...current, minutes: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeShopId || isSubmitting) {
      setSubmitError(t("admin.services.new.error.shopNotFound"));
      return;
    }

    const durationMin = Number(service.hours) * 60 + Number(service.minutes);
    const price = Number(service.price);
    const bufferTime = service.bufferTime.trim();

    if (!service.name.trim()) {
      setSubmitError(t("admin.services.new.error.nameRequired"));
      return;
    }

    if (Number.isNaN(durationMin) || durationMin <= 0) {
      setSubmitError(t("admin.services.new.error.invalidDuration"));
      return;
    }

    if (Number.isNaN(price) || price <= 0) {
      setSubmitError(t("admin.services.new.error.invalidPrice"));
      return;
    }

    try {
      setSubmitError(null);

      const createdService = await createService({
        name: service.name.trim(),
        price,
        durationMin,
        bufferTime:
          isBufferTimeEnabled && bufferTime !== "" ? Number(bufferTime) : null,
      });

      queryClient.setQueryData<AdminService[]>(
        ["admin-services", activeShopId || "none"],
        (currentServices) =>
          currentServices
            ? [...currentServices, createdService]
            : [createdService],
      );

      router.push(`/admin/services?shopId=${encodeURIComponent(activeShopId)}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : t("admin.services.new.error.createFailed"),
      );
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
            aria-label={t("admin.services.new.back")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h1 className="text-[18px] font-semibold tracking-tight text-[#111827]">
            {t("admin.services.new.title")}
          </h1>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#b2b8c3] transition-colors hover:bg-black/5"
            aria-label={t("admin.services.new.moreOptions")}
          >
            <EllipsisVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
          {submitError && (
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
            <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
              <Info className="h-4 w-4 text-[#F49B33]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                {t("admin.services.new.serviceName")}
              </span>
            </div>
            <input
              type="text"
              required
              value={service.name}
              onChange={(e) => setService({ ...service, name: e.target.value })}
              placeholder={t("admin.services.new.serviceNamePlaceholder")}
              className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
            />
          </section>

          <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
            <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
              <Clock3 className="h-4 w-4 text-[#F49B33]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                {t("admin.services.new.serviceDuration")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
                  {t("admin.services.new.hours")}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={service.hours}
                  onChange={(e) => handleHoursChange(e.target.value)}
                  placeholder={t("admin.services.new.hoursPlaceholder")}
                  className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
                />
                {durationWarnings.hours && (
                  <p className="mt-1 text-[11px] font-medium text-red-500">
                    {durationWarnings.hours}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
                  {t("admin.services.new.minutes")}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={service.minutes}
                  onChange={(e) => handleMinutesChange(e.target.value)}
                  placeholder={t("admin.services.new.minutesPlaceholder")}
                  className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
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
                    {t("admin.services.new.bufferTime")}
                  </p>
                  <p className="text-[12px] text-[#7a8493]">
                    {t("admin.services.new.bufferDescription")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBufferTimeEnabled((current) => !current)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${isBufferTimeEnabled ? "bg-[#22c55e]" : "bg-[#d7dbe3]"}`}
                  aria-label={t("admin.services.new.toggleBufferTime")}
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
                placeholder={t("admin.services.new.bufferPlaceholder")}
                disabled={!isBufferTimeEnabled}
                className={`h-12 w-full rounded-2xl border px-4 text-[15px] outline-none transition-colors placeholder:text-[#b0b7c3] ${
                  isBufferTimeEnabled
                    ? "border-[#cfd5dd] bg-white text-[#111827] focus:border-[#F49B33]"
                    : "cursor-not-allowed border-[#e4e7ec] bg-[#f3f5f8] text-[#9aa3b1]"
                }`}
              />
            </div>
          </section>

          <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
            <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
              <DollarSign className="h-4 w-4 text-[#F49B33]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                {t("admin.services.new.pricingSection")}
              </span>
            </div>

            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold text-[#111827]">
                {t("admin.services.new.servicePrice")}
              </span>
              <input
                type="number"
                required
                value={service.price}
                onChange={(e) =>
                  setService({ ...service, price: e.target.value })
                }
                placeholder={t("admin.services.new.pricePlaceholder")}
                className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 pl-8 text-[15px] text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
              />
            </label>
          </section>

          <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
            <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
              <Users className="h-4 w-4 text-[#F49B33]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                {t("admin.services.new.staffSection")}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[14px] font-semibold text-[#111827]">
                  {t("admin.services.new.assignToAllStaff")}
                </p>
                <p className="text-[12px] text-[#7a8493]">
                  {t("admin.services.new.assignToAllDescription")}
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
                aria-label={t("admin.services.new.toggleStaffAssignment")}
              >
                <span
                  className={`absolute top-0.75 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-all ${allMembersSelected ? "left-5.75" : "left-0.75"}`}
                />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9aa3b1]">
                {t("admin.services.new.specificMembers")}
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
                        selectedStaff: current.selectedStaff.includes(member.id)
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#F49B33] text-[16px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_16px_32px_rgba(244,155,51,0.28)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {isSubmitting
                  ? t("admin.services.new.saving")
                  : t("admin.services.new.save")}
              </span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
