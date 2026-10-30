"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { defaultServiceValues, mockStaffMembers } from "@/features/addBusiness/utils";
import { useForm, useWatch } from "react-hook-form";
import { CreateServiceData, CreateServiceInput, createServiceSchema } from "@/features/addBusiness/schemas/service.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { durationToMinutes } from "@/shared/utils/schedule";
import InputField from "@/features/addBusiness/components/InputField";
import FieldCard from "@/features/addBusiness/components/FieldCard";
import ServiceAddStaffSelect from "@/features/addBusiness/components/ServiceAddStaffSelect";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import ServiceAddDurationFields from "@/features/addBusiness/components/ServiceAddDurationFields";
import DurationDrawer from "@/features/addBusiness/components/DurationDrawer";
import { minutesToTimeString } from "@noq/shared";
import { useAuth } from "@/contexts/AuthContext";

export default function AddBusinessStepThreePage() {
  const router = useRouter();
  const t = useTranslations();
  const { user, isLoading } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<'durationMin' | 'bufferTime'>('durationMin')

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

  const [name, price, durationMin, bufferTime, enabled, selectedStaffs] = useWatch({
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

    const durationMin = durationToMinutes(data.durationMin);
    const shopDetails = window.sessionStorage.getItem('shop_details');
    const scheduleDetails = window.sessionStorage.getItem('shop_schedule')

    const parsedShop = JSON.parse(shopDetails || 'undefined');
    const parsedScheduleData = JSON.parse(scheduleDetails || 'undefined');

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
      services: [{ ...data, durationMin }],
    }, {
      onSuccess: (response) => {
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem("shop_details");
          window.sessionStorage.removeItem("shop_schedule");
          window.localStorage.setItem("selected_shop_id", response.data.shopId);
          window.localStorage.setItem("providerMode", "true");
        }

        router.push("/admin");
      }
    });
  };

  const handleDrawerOpen = (field: 'durationMin' | 'bufferTime') => {
    setIsDrawerOpen(true);
    setSelectedField(field);
  }

  const toggleStaff = (staffId: string) => {
    const updatedStaffs = selectedStaffs.includes(staffId)
      ? selectedStaffs.filter((id) => id !== staffId)
      : [...selectedStaffs, staffId];

    setValue('selectedStaffs', updatedStaffs, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const allStaffIds = mockStaffMembers
      .map((staff) => staff.id)
      .sort();

    const selectedStaffIds = [...updatedStaffs].sort();

    const assignedToAllStaffs =
      selectedStaffIds.length === allStaffIds.length &&
      selectedStaffIds.every(
        (id, index) => id === allStaffIds[index]
      );

    setValue('assignedToAllStaffs', assignedToAllStaffs);
  }

  const handleSelectAll = (enabled: boolean) => {
    const allStaffsIdList = mockStaffMembers.map(s => s.id);

    setValue('selectedStaffs', enabled ? allStaffsIdList : [], {
      shouldValidate: true,
      shouldDirty: true,
    })

    setValue('assignedToAllStaffs', enabled);
  }

  return (
    <main className="bg-[#f5f6f8] text-[#111827]">
      <div className="mx-auto max-w-3xl pt-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldCard
            label={t("newShop.step3.serviceName")}
            icon={<Info className="h-4 w-4 text-[#F49B33]" />}
            error={errors.name}
          >
            <InputField
              placeholder={t("newShop.step3.serviceNamePlaceholder")}
              value={name}
              onChange={(event) => setValue('name', event.target.value)}
            />
          </FieldCard>

          <ServiceAddDurationFields
            error={errors.durationMin || errors.bufferTime}
            durationMin={durationMin}
            bufferTime={bufferTime}
            handleDrawerOpen={handleDrawerOpen} />

          <FieldCard
            label={t("newShop.step3.servicePrice")}
            icon={<DollarSign className="h-4 w-4 text-[#F49B33]" />}
            error={errors.price}
          >
            <InputField
              type="text"
              placeholder={t("newShop.step3.servicePricePlaceholder")}
              value={price}
              onChange={(event) => setValue('price', Number(event.target.value.replace(/\D/g, '')))}
              className="text-start"
            />
          </FieldCard>

          <ServiceAddStaffSelect
            error={errors.selectedStaffs?.[0] || errors.assignedToAllStaffs}
            enabled={enabled}
            selectedStaffs={selectedStaffs}
            handleSelectAll={handleSelectAll}
            toggleStaff={toggleStaff} />

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#F49B33] text-[16px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_16px_32px_rgba(244,155,51,0.28)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting || isPending ? t("newShop.step3.saving") : t("newShop.step3.next")}
            </button>
          </div>
        </form>
      </div>

      <DurationDrawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        value={selectedField === "durationMin"
          ? durationMin
          : minutesToTimeString(bufferTime)}
        onValueChange={(value) => setValue(
          selectedField,
          selectedField === 'durationMin' ? value : durationToMinutes(value)
        )} />
    </main>
  );
}
