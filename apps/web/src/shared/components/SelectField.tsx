import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "cn";
import { FC } from "react";

interface SelectFieldProps {
    value: string | undefined;
    items: { name: string, id: string }[];
    label?: string;
    selectLabel?: string;
    placeholder?: string;
    triggerClassName?: string;
    onChange: (value: string) => void;
}

const SelectField: FC<SelectFieldProps> = ({
    value,
    items,
    label,
    selectLabel,
    placeholder,
    triggerClassName,
    onChange,
}) => {
    return (
        <div>
            {label &&
                <label className="mb-2 block text-sm text-slate-600">
                    {label}
                </label>
            }

            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className={cn(
                    "h-12! w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#F49B33] focus:ring-2 focus:ring-[#F49B33]/20",
                    triggerClassName
                )}>
                    <SelectValue placeholder={placeholder ?? ''} />
                </SelectTrigger>
                <SelectContent position="popper" className="rounded-lg">
                    <SelectGroup>
                        <SelectLabel>{selectLabel}</SelectLabel>
                        {items.map((item) => (
                            <SelectItem className="rounded-md" key={item.id} value={item.id}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default SelectField;