import { FC, useState } from "react";
import DurationDrawer from "./DurationDrawer";
import FieldCard from "@/shared/components/FieldCard";
import { useTranslations } from "next-intl";
import { DollarSign, Info } from "lucide-react";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { CreateServiceInput } from "../schemas/service.schema";
import InputField from "./InputField";
import ServiceAddDurationFields from "./ServiceAddDurationFields";
import ServiceAddStaffSelect from "./ServiceAddStaffSelect";
import { minutesToTimeString } from "@noq/shared";
import { durationToMinutes } from "@/shared/utils/schedule";
import { mockStaffMembers } from "../utils";

interface ServiceAddComponentProps {
    errors: FieldErrors<CreateServiceInput>;
    formValues: CreateServiceInput;
    isLoading: boolean;
    onSubmit: () => void;
    setValue: UseFormSetValue<CreateServiceInput>;
}

const ServiceAddComponent: FC<ServiceAddComponentProps> = ({
    errors,
    formValues,
    isLoading,
    onSubmit,
    setValue,
}) => {
    const t = useTranslations();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedField, setSelectedField] = useState<'durationMin' | 'bufferTime'>('durationMin')

    const handleDrawerOpen = (field: 'durationMin' | 'bufferTime') => {
        setIsDrawerOpen(true);
        setSelectedField(field);
    }

    const handleSelectAll = (enabled: boolean) => {
        const allStaffsIdList = mockStaffMembers.map(s => s.id);

        setValue('selectedStaffs', enabled ? allStaffsIdList : [], {
            shouldValidate: true,
            shouldDirty: true,
        })

        setValue('assignedToAllStaffs', enabled);
    }

    const toggleStaff = (staffId: string) => {
        const updatedStaffs = formValues.selectedStaffs.includes(staffId)
            ? formValues.selectedStaffs.filter((id) => id !== staffId)
            : [...formValues.selectedStaffs, staffId];

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

    return (
        <>
            <div className="mx-auto max-w-3xl pt-5">
                <form onSubmit={onSubmit} className="space-y-4">
                    <FieldCard
                        label={t("newShop.step3.serviceName")}
                        icon={<Info className="h-4 w-4 text-[#F49B33]" />}
                        error={errors.name}
                    >
                        <InputField
                            placeholder={t("newShop.step3.serviceNamePlaceholder")}
                            value={formValues.name}
                            onChange={(event) => setValue('name', event.target.value)}
                        />
                    </FieldCard>

                    <ServiceAddDurationFields
                        error={errors.durationMin || errors.bufferTime}
                        durationMin={formValues.durationMin}
                        bufferTime={formValues.bufferTime}
                        handleDrawerOpen={handleDrawerOpen} />

                    <FieldCard
                        label={t("newShop.step3.servicePrice")}
                        icon={<DollarSign className="h-4 w-4 text-[#F49B33]" />}
                        error={errors.price}
                    >
                        <InputField
                            type="text"
                            placeholder={t("newShop.step3.servicePricePlaceholder")}
                            value={formValues.price}
                            onChange={(event) => setValue('price', Number(event.target.value.replace(/\D/g, '')))}
                            className="text-start"
                        />
                    </FieldCard>

                    <ServiceAddStaffSelect
                        error={errors.selectedStaffs?.[0] || errors.assignedToAllStaffs}
                        enabled={formValues.assignedToAllStaffs}
                        selectedStaffs={formValues.selectedStaffs}
                        handleSelectAll={handleSelectAll}
                        toggleStaff={toggleStaff} />

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex h-14 w-full items-center justify-center rounded-full bg-[#F49B33] text-[16px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_16px_32px_rgba(244,155,51,0.28)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? t("newShop.step3.saving") : t("newShop.step3.next")}
                        </button>
                    </div>
                </form>
            </div>

            <DurationDrawer
                isOpen={isDrawerOpen}
                setIsOpen={setIsDrawerOpen}
                value={selectedField === "durationMin"
                    ? formValues.durationMin
                    : minutesToTimeString(formValues.bufferTime)}
                onValueChange={(value) => setValue(
                    selectedField,
                    selectedField === 'durationMin' ? value : durationToMinutes(value)
                )} />
        </>
    );
}

export default ServiceAddComponent;