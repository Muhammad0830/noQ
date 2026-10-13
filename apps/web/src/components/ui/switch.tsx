"use client";

import type { ComponentPropsWithoutRef } from "react";

interface Props extends Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "checked" | "onChange"
> {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Switch = ({
  checked,
  onChange,
  ...props
}: Props) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        {...props}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />

      <div className="w-11 h-6 peer-checked:bg-[#F49B33] bg-gray-200 transition-colors duration-150 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
    </label>
  );
};