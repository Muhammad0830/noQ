"use client";

import { cn } from "cn";
import { ChangeEvent, FC } from "react";

interface InputFieldProps {
    value: string | number | null | undefined;
    label?: string;
    placeholder?: string;
    inputClassName?: string;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    tag?: 'text' | 'textarea';
    rows?: number;
}

const InputField: FC<InputFieldProps> = ({
    value,
    label,
    placeholder,
    inputClassName = '',
    tag = 'text',
    rows = 5,
    onChange,
}) => {
    return (
        <div>
            {label &&
                <label className="mb-2 block text-sm text-slate-600">
                    {label}
                </label>
            }

            {tag === 'text'
                ? <input
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder ?? ''}
                    className={cn(
                        "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#F49B33] focus:ring-2 focus:ring-[#F49B33]/20",
                        inputClassName
                    )} />
                : <textarea
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder ?? ''}
                    rows={rows}
                    className={cn(
                        "w-full py-2 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#F49B33] focus:ring-2 focus:ring-[#F49B33]/20",
                        inputClassName
                    )} />}
        </div>
    );
}

export default InputField;