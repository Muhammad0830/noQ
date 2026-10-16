"use client";

import type { RefObject } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

type AppSearchInputProps = {
  placeholder: string;
  value?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  onValueChange?: (value: string) => void;
  onInputClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  onFilterClick?: () => void;
};

export default function AppSearchInput({
  placeholder,
  value,
  inputRef,
  onValueChange,
  onInputClick,
  onFocus,
  onBlur,
  onClear,
  onFilterClick,
}: AppSearchInputProps) {
  const showFilterButton = value?.length === 0;
  const showClearButton = value ? value.length > 0 : false;

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[#f1c894] bg-white px-3 py-2.5 shadow-sm">
      <Search className="h-5 w-5 text-[#F49B33]" />
      <input
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        onClick={onInputClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(event) => onValueChange?.(event.target.value)}
        className="h-6 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-[#d0954d]"
      />

      {showClearButton && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onClear}
          className="rounded-lg bg-[#fff3e6] p-2 text-[#F49B33] transition hover:bg-[#fce2c4]"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {!showClearButton && showFilterButton && (
        <button
          type="button"
          onClick={onFilterClick}
          className="rounded-lg bg-[#fff3e6] p-2 text-[#F49B33] transition hover:bg-[#fce2c4]"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
