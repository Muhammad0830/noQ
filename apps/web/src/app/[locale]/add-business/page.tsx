"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { ShopCategory } from "@shared/types/general_types";
import { API_ENDPOINTS } from "@/lib/api";
import useApiQuery from "@/hooks/useApiQuery";
import { useTranslations } from "next-intl";
import { AddBusinessStepOneForm } from "@/features/profile/types";
import { addBusinessStepOneFormDefault } from "@/features/profile/utils";
import InputField from "@/shared/components/InputField";
import SelectField from "@/shared/components/SelectField";

export default function AddBusinessStepOnePage() {
  const router = useRouter();
  const t = useTranslations();

  const [form, setForm] = useState<AddBusinessStepOneForm>(addBusinessStepOneFormDefault);

  const { data: categories = [], isLoading } =
    useApiQuery<ShopCategory[]>(API_ENDPOINTS.categories, { key: ["new-shop-categories"] });

  const canProceed =
    form.name.trim().length > 1 &&
    form.categoryId.trim().length > 0 &&
    form.address.trim().length > 3 &&
    form.phone.trim().length >= 4;

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canProceed) return;

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "new_shop_details",
        JSON.stringify({
          businessName: form.name.trim(),
          categoryId: form.categoryId,
          description: form.description?.trim(),
          address: form.address.trim(),
          phone: form.phone.trim(),
        }),
      );
    }

    router.push("/add-business/step-2");
  };

  const handleInputChange = (
    value: string,
    key: keyof AddBusinessStepOneForm
  ) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  return (
    <main className="mx-auto w-full" style={{ maxWidth: 540 }}>
      <form onSubmit={handleNext} className="space-y-4">
        <InputField
          value={form.name}
          label={t("newShop.step1.businessName")}
          placeholder={t("newShop.step1.businessNamePlaceholder")}
          onChange={(event) => handleInputChange(event.target.value, 'name')} />

        <SelectField
          value={form.categoryId}
          items={categories}
          label={t("newShop.step1.category")}
          selectLabel={t('categories.Title')}
          placeholder={isLoading
            ? t("common.loading")
            : t("newShop.step1.categoryPlaceholder")}
          onChange={(categoryId) => handleInputChange(categoryId, 'categoryId')} />

        <InputField
          tag="textarea"
          value={form.description}
          label={t("newShop.step1.description")}
          placeholder={t("newShop.step1.descriptionPlaceholder")}
          onChange={(event) => handleInputChange(event.target.value, 'description')} />

        <InputField
          value={form.address}
          label={t("newShop.step1.address")}
          placeholder={t("newShop.step1.addressPlaceholder")}
          onChange={(event) => handleInputChange(event.target.value, 'address')} />

        <InputField
          value={form.phone}
          label={t("newShop.step1.phone")}
          placeholder={t("newShop.step1.phonePlaceholder")}
          onChange={(event) => handleInputChange(event.target.value, 'phone')} />

        <button
          type="submit"
          disabled={!canProceed}
          className="mt-7 h-12 w-full rounded-full bg-[#F49B33] text-sm font-semibold text-white transition hover:bg-[#e8891f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("newShop.step1.next")}
        </button>
      </form>
    </main >
  );
}
