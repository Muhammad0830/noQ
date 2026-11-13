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

export default function AddBusinessStepThreePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

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
      <ServiceAddComponent
        errors={errors}
        isLoading={isSubmitting || isPending}
        onSubmit={() => handleSubmit(onSubmit)}
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
    </main>
  );
}
