"use client";

import { useRouter } from "next/navigation";
import {
  ChevronLeft,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Route } from "next";
import { useForm, useWatch } from "react-hook-form";
import { UpdateServiceFormData, UpdateServiceFormInput, updateServiceFormSchema, updateServiceSchema } from "@/schemas/services/update.schema";
import { defaultServiceValues, mockStaffMembers } from "@/features/addBusiness/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShop } from "@/contexts/ShopContext";
import { use, useEffect } from "react";
import { durationToMinutes } from "@/shared/utils/schedule";
import { minutesToTimeString } from "@noq/shared";
import ServiceAddComponent from "@/features/addBusiness/components/ServiceAddComponent";
import ServiceEditSkeleton from "@/components/admin/services/ServiceEditSkeleton";
import { useUpdateService } from "@/hooks/admin/useUpdateService";
import ConfirmDeleteServiceDialog from "@/components/admin/services/ConfirmDeleteServiceDialog";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditServicePage({
  params
}: Props) {
  const { shop } = useShop();
  const { id } = use(params);

  const t = useTranslations();
  const router = useRouter();

  const {
    service,
    isLoading,
    isError,
    error,

    updateService,
    deleteService,

    isUpdating,
    isDeleting
  } = useUpdateService({
    serviceId: id,
    shopId: shop?.id,
  })

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateServiceFormInput, typeof updateServiceFormSchema, UpdateServiceFormData>({
    resolver: zodResolver(updateServiceFormSchema(mockStaffMembers)),
    defaultValues: defaultServiceValues,
  });

  useEffect(() => {
    if (service) {
      setValue("name", service.name);
      setValue("price", service.price);
      setValue("durationMin", minutesToTimeString(service.durationMin));
      setValue("bufferTime", service.bufferTime ?? undefined);
    }
  }, [service, setValue])

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

  if (!shop) {
    return (
      <div>Shop not found</div>
    )
  }

  const onSubmit = async () => {
    const result = updateServiceSchema(mockStaffMembers).safeParse({
      id: id,
      shopId: service?.shopId,
      name: name,
      price,
      durationMin,
      bufferTime,
      selectedStaffs,
      assignedToAllStaffs,
    });

    if (!result.success) {
      console.error(result.error)
      return;
    }

    await updateService(
      { ...result.data, durationMin: durationToMinutes(durationMin) },
      { onSuccess: () => router.push("/admin/services" as Route) });
  }

  const onDelete = async () => {
    await deleteService({}, {
      onSuccess: () => router.push("/admin/services" as Route),
    });
  };

  const isButtonsLoading = isSubmitting || isUpdating || isDeleting || isLoading;

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
          {t("admin.services.edit.title")}
        </h1>
      </header>

      {isError && error && (
        <div className="mt-6 px-4 py-2 rounded-2xl border border-destructive bg-destructive/5 text-destructive text-center">{t("common.something_went_wrong")}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {isLoading
          ? <ServiceEditSkeleton />
          : <ServiceAddComponent
            errors={errors}
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
        }

        <div className="pt-2 flex flex-col gap-2">
          <button
            type="submit"
            disabled={isButtonsLoading}
            className="flex h-14 w-full items-center justify-center rounded-full bg-[#F49B33] text-[16px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_16px_32px_rgba(244,155,51,0.28)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isButtonsLoading ? t("newShop.step3.saving") : t("admin.services.save")}
          </button>

          <ConfirmDeleteServiceDialog
            isLoading={isButtonsLoading}
            onDelete={onDelete}
          />
        </div>
      </form>
    </div>
  );
}
