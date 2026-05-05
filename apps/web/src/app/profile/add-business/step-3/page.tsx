"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  Clock3,
  DollarSign,
  Info,
  User,
  Users,
} from "lucide-react";
import { API_ENDPOINTS, getStoredAuth } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

const staffMembers = [
  { id: "alex", name: "Alex Johnson" },
  { id: "sarah", name: "Sarah Miller" },
];

export default function AddBusinessStepThreePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [shopId, setShopId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [service, setService] = useState({
    name: "",
    hours: "0",
    minutes: "45",
    bufferTime: "15",
    price: "",
    assignToAllStaff: false,
    selectedStaff: "alex",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const createdShopId = window.sessionStorage.getItem("new_shop_id");
    if (!createdShopId) {
      router.replace("/profile/add-business");
      return;
    }
    setShopId(createdShopId);
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!shopId || isSubmitting) {
      setSubmitError(t("newShop.step3.error.shopNotFound"));
      return;
    }

    const durationMin = Number(service.hours) * 60 + Number(service.minutes);
    const price = Number(service.price);
    const bufferTime = service.bufferTime.trim();

    if (!service.name.trim()) {
      setSubmitError(t("newShop.step3.error.serviceNameRequired"));
      return;
    }

    if (Number.isNaN(durationMin) || durationMin <= 0) {
      setSubmitError(t("newShop.step3.error.invalidDuration"));
      return;
    }

    if (Number.isNaN(price) || price <= 0) {
      setSubmitError(t("newShop.step3.error.invalidPrice"));
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const token = getStoredAuth()?.token;
      const response = await fetch(API_ENDPOINTS.admin.services, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-shopid": shopId,
          "x-shop-id": shopId,
        },
        body: JSON.stringify({
          name: service.name.trim(),
          price,
          durationMin,
          bufferTime: bufferTime === "" ? null : Number(bufferTime),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body && typeof body.message === "string"
            ? body.message
            : t("newShop.step3.error.createServiceFailed");
        throw new Error(message);
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("new_shop_step_1");
        window.sessionStorage.removeItem("new_shop_id");
        window.localStorage.setItem("selected_shop_id", shopId);
        window.localStorage.setItem("providerMode", "true");
      }

      router.push(`/admin?shopId=${encodeURIComponent(shopId)}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : t("newShop.step3.error.createServiceFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[#f5f6f8] pb-8 text-[#111827]">
      <div className="mx-auto max-w-3xl px-4 pt-5">
        <header className="relative mb-6 flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label={t("common.back")}
            className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h1 className="text-lg font-semibold">{t("newShop.step3.pageTitle")}</h1>
        </header>

        <div className="mb-5 flex items-center justify-center gap-2">
          {[1, 2, 3].map((step) => {
            const isActive = step === 3;
            const isDone = step < 3;

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
                {t("newShop.step3.serviceName")}
              </span>
            </div>
            <input
              type="text"
              required
              value={service.name}
              onChange={(e) => setService({ ...service, name: e.target.value })}
              placeholder={t("newShop.step3.serviceNamePlaceholder")}
              className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
            />
          </section>

          <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
            <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
              <Clock3 className="h-4 w-4 text-[#F49B33]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                {t("newShop.step3.serviceDuration")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
                  {t("newShop.step3.hours")}
                </span>
                <select
                  value={service.hours}
                  onChange={(e) => setService({ ...service, hours: e.target.value })}
                  className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] text-[#111827] outline-none transition-colors focus:border-[#F49B33]"
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
                  {t("newShop.step3.minutes")}
                </span>
                <select
                  value={service.minutes}
                  onChange={(e) => setService({ ...service, minutes: e.target.value })}
                  className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] text-[#111827] outline-none transition-colors focus:border-[#F49B33]"
                >
                  {[0, 15, 30, 45].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
            <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
              <DollarSign className="h-4 w-4 text-[#F49B33]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                {t("newShop.step3.pricingOperations")}
              </span>
            </div>

            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold text-[#111827]">
                {t("newShop.step3.servicePrice")}
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#8c94a1]">
                  $
                </span>
                <input
                  type="number"
                  required
                  value={service.price}
                  onChange={(e) => setService({ ...service, price: e.target.value })}
                  placeholder={t("newShop.step3.servicePricePlaceholder")}
                  className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 pl-8 text-[15px] text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
                />
              </div>
            </label>

            <div className="mt-4 rounded-2xl border border-[#eef1f5] bg-[#f8fafc] p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">
                    {t("newShop.step3.bufferTime")}
                  </p>
                  <p className="text-[12px] text-[#7a8493]">
                    {t("newShop.step3.bufferTimeHelp")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setService((current) => ({
                      ...current,
                      bufferTime: current.bufferTime ? "" : "15",
                    }))
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${service.bufferTime ? "bg-[#22c55e]" : "bg-[#d7dbe3]"}`}
                  aria-label={t("newShop.step3.aria.toggleBufferTime")}
                >
                  <span
                    className={`absolute top-0.75 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-all ${service.bufferTime ? "left-5.75" : "left-0.75"}`}
                  />
                </button>
              </div>

              <input
                type="number"
                min="0"
                value={service.bufferTime}
                onChange={(e) => setService({ ...service, bufferTime: e.target.value })}
                placeholder={t("newShop.step3.bufferTimePlaceholder")}
                className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]"
              />
            </div>
          </section>

          <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
            <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
              <Users className="h-4 w-4 text-[#F49B33]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                {t("newShop.step3.staffAssignment")}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[14px] font-semibold text-[#111827]">
                  {t("newShop.step3.assignToAllStaff")}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setService((current) => ({
                    ...current,
                    assignToAllStaff: !current.assignToAllStaff,
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${service.assignToAllStaff ? "bg-[#22c55e]" : "bg-[#d7dbe3]"}`}
                aria-label={t("newShop.step3.aria.toggleStaffAssignment")}
              >
                <span
                  className={`absolute top-0.75 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-all ${service.assignToAllStaff ? "left-5.75" : "left-0.75"}`}
                />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9aa3b1]">
                {t("newShop.step3.specificMembers")}
              </p>
              {staffMembers.map((member) => {
                const active = service.selectedStaff === member.id;
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setService({ ...service, selectedStaff: member.id })}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors ${
                      active
                        ? "border-[#F49B33] bg-[#F49B33] text-white shadow-[0_10px_24px_rgba(244,155,51,0.2)]"
                        : "border-[#e2e6ec] bg-white text-[#6b7280]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          active ? "bg-white/15 text-white" : "bg-[#f3f4f6] text-[#9aa3b1]"
                        }`}
                      >
                        <User className="h-5 w-5" />
                      </span>
                      <span className="text-[15px] font-medium">{member.name}</span>
                    </div>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        active
                          ? "border-white bg-white text-[#F49B33]"
                          : "border-[#d8dde5] bg-white text-transparent"
                      }`}
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
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#F49B33] text-[16px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_16px_32px_rgba(244,155,51,0.28)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? t("newShop.step3.saving") : t("newShop.step3.next")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
