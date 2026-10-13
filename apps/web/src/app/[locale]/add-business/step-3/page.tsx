"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock3,
  DollarSign,
  Info,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { defaultServiceValues, mockStaffMembers } from "@/features/addBusiness/utils";
import { useForm, useWatch } from "react-hook-form";
import { CreateServiceData, CreateServiceInput, createServiceSchema } from "@/features/addBusiness/schemas/service.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { TimePicker } from "@/components/paragon/ui/time-picker";
import { Switch } from "@/components/ui/switch";
import { cn } from "cn";
import { durationToMinutes } from "@/shared/utils/schedule";
import InputField from "@/features/addBusiness/components/InputField";
import FieldCard from "@/features/addBusiness/components/FieldCard";

export default function AddBusinessStepThreePage() {
  const router = useRouter();
  const t = useTranslations();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<'duration' | 'bufferTime'>('duration')

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateServiceInput, typeof createServiceSchema, CreateServiceData>({
    resolver: zodResolver(createServiceSchema(mockStaffMembers)),
    defaultValues: defaultServiceValues,
  })

  const onSubmit = async (data: CreateServiceData) => {
    // await createShop(data);
    console.log('data', data)
    return;
    router.push(`/admin?shopId=${encodeURIComponent("shopId")}`);
    setError("root", {
      message: "Unable to create shop. Please try again.",
    });
  };

  useEffect(() => {
    const hasDetails = window.sessionStorage.getItem("shop_details");
    const hasSchedule = window.sessionStorage.getItem("shop_schedule");

    if (!hasDetails) {
      router.replace("/add-business");
    } else if (!hasSchedule) {
      router.replace("/add-business/step-2")
    }
  }, [router]);

  const handleDrawerOpen = (field: 'duration' | 'bufferTime') => {
    setIsDrawerOpen(true);
    setSelectedField(field);
  }

  const [name, price, duration, bufferTime, enabled, selectedStaffs] = useWatch({
    control,
    name: [
      "name",
      "price",
      "duration",
      "bufferTime",
      "assignedToAllStaffs",
      "selectedStaffs"
    ],
  });

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

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();

  //   const durationMin = Number(service.hours) * 60 + Number(service.minutes);
  //   const price = Number(service.price);
  //   const bufferTime = service.bufferTime.trim();

  //   if (!service.name.trim()) {
  //     setSubmitError(t("newShop.step3.error.serviceNameRequired"));
  //     return;
  //   }

  //   if (Number.isNaN(durationMin) || durationMin <= 0) {
  //     setSubmitError(t("newShop.step3.error.invalidDuration"));
  //     return;
  //   }

  //   if (Number.isNaN(price) || price <= 0) {
  //     setSubmitError(t("newShop.step3.error.invalidPrice"));
  //     return;
  //   }

  //   setSubmitError(null);

  //   const token = getStoredAuth()?.token;
  //   const response = await fetch(API_ENDPOINTS.admin.services, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //     },
  //     body: JSON.stringify({
  //       name: service.name.trim(),
  //       price,
  //       durationMin,
  //       bufferTime: bufferTime === "" ? null : Number(bufferTime),
  //     }),
  //   });

  //   if (!response.ok) {
  //     const body = await response.json().catch(() => null);
  //     const message =
  //       body && typeof body.message === "string"
  //         ? body.message
  //         : t("newShop.step3.error.createServiceFailed");
  //     throw new Error(message);
  //   }

  //   const shopId = "0";

  //   if (typeof window !== "undefined") {
  //     window.sessionStorage.removeItem("shop_details");
  //     window.sessionStorage.removeItem("new_shop_id");
  //     window.localStorage.setItem("selected_shop_id", shopId);
  //     window.localStorage.setItem("providerMode", "true");
  //   }

  // };

  return (
    <main className="bg-[#f5f6f8] text-[#111827]">
      <div className="mx-auto max-w-3xl px-4 pt-5">
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

          <FieldCard
            icon={<Clock3 className="h-4 w-4 text-[#F49B33]" />}
            label={t("newShop.step3.serviceDuration")}
            error={errors.duration || errors.bufferTime}
          >
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
                  {t("newShop.step3.duration")}
                </label>

                <button
                  type="button"
                  onClick={() => handleDrawerOpen('duration')}
                  className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[#111827] text-start"
                >
                  {duration === "00:00" ? '--:--' : duration}
                </button>
              </div>

              <div className="flex-1">
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
                  {t("newShop.step3.bufferTime")}
                </label>

                <button
                  type="button"
                  onClick={() => handleDrawerOpen('bufferTime')}
                  className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[#111827] text-start"
                >
                  {bufferTime}
                </button>
              </div>
            </div>
          </FieldCard>

          <FieldCard
            label={t("newShop.step3.servicePrice")}
            icon={<DollarSign className="h-4 w-4 text-[#F49B33]" />}
            error={errors.price}
          >
            <InputField
              type="button"
              placeholder={t("newShop.step3.servicePricePlaceholder")}
              value={price}
              {...register('price', { valueAsNumber: true })}
              className="text-start"
            />
          </FieldCard>

          <FieldCard
            icon={<Users className="h-4 w-4 text-[#F49B33]" />}
            label={t("newShop.step3.staffAssignment")}
            error={errors.selectedStaffs?.[0] || errors.assignedToAllStaffs}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[14px] font-semibold text-[#111827]">
                {t("newShop.step3.assignToAllStaff")}
              </p>

              <Switch checked={enabled} onChange={(event) =>
                handleSelectAll(event.target.checked)
              } />
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9aa3b1]">
                {t("newShop.step3.specificMembers")}
              </p>

              {mockStaffMembers.map((member) => {
                const active = selectedStaffs?.includes(member.id);

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleStaff(member.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-150",
                      active ? "border-[#F49B33] bg-[#F49B33] text-white shadow-[0_10px_24px_rgba(244,155,51,0.2)]" : "border-[#e2e6ec] bg-white text-[#6b7280]"
                    )}
                    aria-pressed={active}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          active ? "bg-white/15 text-white" : "bg-[#f3f4f6] text-[#9aa3b1]"
                        )}
                      >
                        <User className="h-5 w-5" />
                      </span>

                      <span className="text-[15px] font-medium">{member.name}</span>
                    </div>

                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border",
                        active && enabled ? "border-white bg-white text-[#F49B33]" : "border-[#d8dde5] bg-white text-transparent"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </span>
                  </button>
                )
              })}
            </div>
          </FieldCard>

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

      <Drawer
        open={isDrawerOpen}
        direction="bottom"
        onOpenChange={setIsDrawerOpen}
      >
        <DrawerContent className="rounded-lg">
          <DrawerHeader>
            <DrawerTitle>
              {t("admin.schedule.timePicker")}
            </DrawerTitle>
          </DrawerHeader>

          <div className="w-full flex justify-center">
            <TimePicker
              hourCycle={24}
              defaultValue="00:00"
              minuteStep={1}
              onValueChange={(value) => setValue(
                selectedField,
                selectedField === 'duration' ? value : durationToMinutes(value)
              )} />
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
