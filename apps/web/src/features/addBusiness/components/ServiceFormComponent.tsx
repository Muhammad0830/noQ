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

interface ServiceFormComponentProps {
    errors: FieldErrors<CreateServiceInput>;
    formValues: CreateServiceInput;
    setValue: UseFormSetValue<CreateServiceInput>;
}

const ServiceFormComponent: FC<ServiceFormComponentProps> = ({
    errors,
    formValues,
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
            <div className="mx-auto max-w-3xl pt-5 space-y-4">
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
                    bufferTime={formValues.bufferTime ?? 0}
                    handleDrawerOpen={handleDrawerOpen}
                />

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
                    toggleStaff={toggleStaff}
                />
            </div>

            <DurationDrawer
                isOpen={isDrawerOpen}
                setIsOpen={setIsDrawerOpen}
                value={selectedField === "durationMin"
                    ? formValues.durationMin
                    : minutesToTimeString(formValues.bufferTime ?? 0)}
                onValueChange={(value) => setValue(
                    selectedField,
                    selectedField === 'durationMin' ? value : durationToMinutes(value)
                )} />
        </>
    );
}

export default ServiceFormComponent;