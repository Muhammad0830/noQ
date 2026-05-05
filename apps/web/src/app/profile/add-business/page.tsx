"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown } from "lucide-react";
import type { ShopCategory } from "@shared/types/general_types";
import { useLanguage } from "@/contexts/LanguageContext";
import { API_ENDPOINTS } from "@/lib/api";
import useApiQuery from "@/hooks/useApiQuery";

type ShopCategoriesResponse =
  | ShopCategory[]
  | {
      categories?: ShopCategory[];
      data?: ShopCategory[];
    };

export default function AddBusinessStepOnePage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [businessName, setBusinessName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("+998");

  const categoriesUrl = `${API_ENDPOINTS.categories}?lang=${encodeURIComponent(language)}`;

  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useApiQuery<ShopCategoriesResponse>(categoriesUrl, {
      key: ["new-shop-categories", language],
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const categories = useMemo<ShopCategory[]>(() => {
    if (!categoriesResponse) return [];
    if (Array.isArray(categoriesResponse)) return categoriesResponse;
    if (Array.isArray(categoriesResponse.categories)) {
      return categoriesResponse.categories;
    }
    if (Array.isArray(categoriesResponse.data)) return categoriesResponse.data;
    return [];
  }, [categoriesResponse]);

  const canProceed =
    businessName.trim().length > 1 &&
    categoryId.trim().length > 0 &&
    address.trim().length > 3 &&
    phone.trim().length >= 4;

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canProceed) return;

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "new_shop_step_1",
        JSON.stringify({
          businessName: businessName.trim(),
          categoryId,
          description: description.trim(),
          address: address.trim(),
          phone: phone.trim(),
        }),
      );
      window.sessionStorage.removeItem("new_shop_id");
    }

    router.push("/profile/add-business/step-2");
  };

  return (
    <main className="min-h-screen bg-[#f4f5f8] px-4 py-5 text-slate-900">
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
            {t("newShop.step1.pageTitle")}
          </h1>
        </header>

        <div className="mb-5 flex items-center justify-center gap-2">
          {[1, 2, 3].map((step) => {
            const isActive = step === 1;

            return (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-[#F49B33] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step}
                </span>
                {step < 3 && <span className="h-px w-12 bg-slate-300" />}
              </div>
            );
          })}
        </div>

        <h2 className="mb-5 text-2xl font-semibold">
          {t("newShop.step1.title")}
        </h2>

        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-600">
              {t("newShop.step1.businessName")}
            </label>
            <input
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder={t("newShop.step1.businessNamePlaceholder")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#F49B33] focus:ring-2 focus:ring-[#F49B33]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-600">
              {t("newShop.step1.category")}
            </label>

            <div className="relative">
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm outline-none transition focus:border-[#F49B33] focus:ring-2 focus:ring-[#F49B33]/20"
              >
                <option value="">
                  {isLoadingCategories
                    ? t("common.loading")
                    : t("newShop.step1.categoryPlaceholder")}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-600">
              {t("newShop.step1.description")}
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t("newShop.step1.descriptionPlaceholder")}
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#F49B33] focus:ring-2 focus:ring-[#F49B33]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-600">
              {t("newShop.step1.address")}
            </label>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder={t("newShop.step1.addressPlaceholder")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#F49B33] focus:ring-2 focus:ring-[#F49B33]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-600">
              {t("newShop.step1.phone")}
            </label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={t("newShop.step1.phonePlaceholder")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#F49B33] focus:ring-2 focus:ring-[#F49B33]/20"
            />
          </div>

          <button
            type="submit"
            disabled={!canProceed}
            className="mt-7 h-12 w-full rounded-full bg-[#F49B33] text-sm font-semibold text-white transition hover:bg-[#e8891f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("newShop.step1.next")}
          </button>
        </form>
      </div>
    </main>
  );
}
