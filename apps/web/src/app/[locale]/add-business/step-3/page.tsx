"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultServiceValues, mockStaffMembers } from "@/features/addBusiness/utils";
import { useForm, useWatch } from "react-hook-form";
import { CreateServiceData, CreateServiceInput, createServiceSchema } from "@/features/addBusiness/schemas/service.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { durationToMinutes } from "@/shared/utils/schedule";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ServiceAddComponent from "@/features/addBusiness/components/ServiceAddComponent";
import { useTranslations } from "next-intl";

export default function AddBusinessStepThreePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const t = useTranslations()

  const { mutate, isPending } = useApiMutation<{ shopId: string }>(API_ENDPOINTS.shops, 'post');

  useEffect(() => {
    const hasDetails = window.sessionStorage.getItem("shop_details");
    const hasSchedule = window.sessionStorage.getItem("shop_schedule");

    if (!hasDetails) {
      router.replace("/add-business");
    } else if (!hasSchedule) {
      router.replace("/add-business/step-2")
    }
  }, [router]);

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
    enabled,
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

  const onSubmit = async (data: CreateServiceData) => {
    if (isLoading || !user) {
      return;
    }

    const shopDetails = window.sessionStorage.getItem('shop_details');
    const scheduleDetails = window.sessionStorage.getItem('shop_schedule')

    const parsedShop = JSON.parse(shopDetails || 'undefined');
    const parsedScheduleData = JSON.parse(scheduleDetails || 'undefined');
    const services = [{ ...data, durationMin: durationToMinutes(data.durationMin) }]

    mutate({
      shop: {
        userId: user.id,
        categoryId: parsedShop.categoryId,
        name: parsedShop.name,
        address: parsedShop.address,
        phoneNumber: parsedShop.phoneNumber,
        description: parsedShop.description,
      },
      schedule: parsedScheduleData.schedule,
      services: services,
    }, {
      onSuccess: (response) => {
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem("shop_details");
          window.sessionStorage.removeItem("shop_schedule");
          window.localStorage.setItem("selected_shop_id", response.data.shopId);
          window.localStorage.setItem("providerMode", "true");
        }

        router.push("/admin/dashboard");
      }
    });
  };

  return (
    <main className="bg-[#f5f6f8] text-[#111827]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ServiceAddComponent
          errors={errors}
          setValue={setValue}
          formValues={{
            name,
            price,
            durationMin,
            bufferTime,
            selectedStaffs,
            assignedToAllStaffs: enabled
          }}
        />

        <div className="pt-2 flex flex-col gap-2">
          <button
            type="submit"
            disabled={isSubmitting || isPending}
            className="flex h-14 w-full items-center justify-center rounded-full bg-[#F49B33] text-[16px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_16px_32px_rgba(244,155,51,0.28)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting || isPending ? t("newShop.step3.saving") : t("newShop.step3..next")}
          </button>
        </div>
      </form>
    </main>
  );
}
