"use client";

import type { RefObject } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

type AppSearchInputProps = {
  placeholder: string;
  value?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
  onInputClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  showClearButton?: boolean;
  onClear?: () => void;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
  clearAriaLabel?: string;
  filterAriaLabel: string;
};

export default function AppSearchInput({
  placeholder,
  value,
  inputRef,
  readOnly = false,
  onValueChange,
  onInputClick,
  onFocus,
  onBlur,
  showClearButton = false,
  onClear,
  showFilterButton = true,
  onFilterClick,
  clearAriaLabel,
  filterAriaLabel,
}: AppSearchInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[#f1c894] bg-white px-3 py-2.5 shadow-sm dark:border-[#4a2e1b] dark:bg-white">
      <Search className="h-5 w-5 text-[#F49B33] dark:text-[#F49B33]" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        readOnly={readOnly}
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
          aria-label={clearAriaLabel}
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {!showClearButton && showFilterButton && (
        <button
          type="button"
          onClick={onFilterClick}
          className="rounded-lg bg-[#fff3e6] p-2 text-[#F49B33] transition hover:bg-[#fce2c4]"
          aria-label={filterAriaLabel}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
