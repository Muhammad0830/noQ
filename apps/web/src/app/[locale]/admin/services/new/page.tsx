"use client";

import { useRouter } from "next/navigation";
import {
  ChevronLeft,
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useTranslations } from "next-intl";
import ServiceAddComponent from "@/features/addBusiness/components/ServiceAddComponent";
import { CreateServiceData, CreateServiceInput, createServiceSchema } from "@/features/addBusiness/schemas/service.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultServiceValues, mockStaffMembers } from "@/features/addBusiness/utils";
import { useForm, useWatch } from "react-hook-form";
import { useShop } from "@/contexts/ShopContext";
import { Route } from "next";
import { durationToMinutes } from "@/shared/utils/schedule";

type CreateServicePayload = {
  shopId: string;
  name: string;
  price: number;
  durationMin: number;
  bufferTime: number | null;
  selectedStaffs: string[];
};

export default function AddNewService() {
  const { shop } = useShop();
  const t = useTranslations();
  const router = useRouter();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceInput, typeof createServiceSchema, CreateServiceData>({
    resolver: zodResolver(createServiceSchema(mockStaffMembers)),
    defaultValues: defaultServiceValues,
  })

  const [
    name,
    price,
    durationMin,
    bufferTime,
    assignedToAllStaffs,
    selectedStaffs
  ] = useWatch({
    control,
    name: [
      "name",
      "price",
      "durationMin",
      "bufferTime",
      "assignedToAllStaffs",
      "selectedStaffs"
    ],
  });

  const { mutateAsync: createService, isPending } =
    useApiMutation<unknown, CreateServicePayload>(
      API_ENDPOINTS.admin.services,
      "post",
      {
        headers: {
          "x-shop-id": shop?.id,
        },
      }
    );

  if (!shop) {
    return (
      <div>Shop not found</div>
    )
  }

  const onSubmit = async () => {
    await createService({
      shopId: shop.id,
      name,
      price,
      durationMin: durationToMinutes(durationMin),
      bufferTime,
      selectedStaffs,
    }, {
      onSuccess: () => router.push("/admin/services" as Route)
    });
  }

  return (
    <div className="min-h-dvh bg-[#f5f6f8] px-4 pb-8 text-[#111827]">
      <header className="relative mx-auto flex max-w-3xl items-center justify-center mt-5 mb-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7dbe3] bg-white text-[#8d95a3] shadow-sm transition-transform active:scale-95"
          aria-label={t("admin.services.aria.goBack")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h1 className="w-4/5 text-center text-[18px] font-semibold tracking-tight text-[#111827]">
          {t("admin.services.addTitle")}
        </h1>
      </header>

      <ServiceAddComponent
        errors={errors}
        isLoading={isPending || isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        setValue={setValue}
        formValues={{
          name,
          price,
          durationMin,
          bufferTime,
          selectedStaffs,
          assignedToAllStaffs
        }}
      />
    </div>
  );
}
