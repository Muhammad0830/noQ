import { cn } from "cn";
import { ComponentPropsWithoutRef, FC } from "react";

interface InputFieldProps
    extends ComponentPropsWithoutRef<"input"> {
    placeholder: string;
    value: string | number;
}

const InputField: FC<InputFieldProps> = ({
    placeholder,
    value,
    onChange,
    className,
    ...props
}) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="off"
            className={cn(
                "h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[15px] text-[#111827] outline-none transition-colors placeholder:text-[#b0b7c3] focus:border-[#F49B33]",
                className,
            )}
            {...props}
        />
    );
}

export default InputField;