import { ChevronRight } from 'lucide-react';
import React from 'react'

export default function ProfileRow({
  icon,
  title,
  subtitle,
  onClick,
  trailing,
  bordered = false,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
  onClick: () => void;
  trailing?: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#fff3e6] ${
        bordered ? "border-t border-[#f1c894]" : ""
      }`}
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fff3e6] text-[#F49B33]">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-slate-900">
          {title}
        </span>
        <span className="block truncate text-xs text-slate-500">
          {subtitle}
        </span>
      </span>

      {trailing || <ChevronRight className="h-4 w-4 shrink-0 text-[#F49B33]" />}
    </button>
  );
}