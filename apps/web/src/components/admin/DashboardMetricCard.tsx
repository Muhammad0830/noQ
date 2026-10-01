"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type DashboardMetricCardProps = {
  label: string;
  value: ReactNode;
  changeText?: string;
  changePositive?: boolean;
  icon: LucideIcon;
  iconClassName?: string;
  isLoading?: boolean;
};

export default function DashboardMetricCard({
  label,
  value,
  changeText,
  changePositive,
  icon: Icon,
  iconClassName = "bg-orange-400",
  isLoading = false,
}: DashboardMetricCardProps) {
  return (
    <div className="relative flex flex-col overflow-visible rounded-2xl bg-white p-4 shadow-lg md:rounded-2xl md:p-5 lg:rounded-3xl lg:p-5">
      <div
        className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm ${iconClassName}`}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>

      <div className="flex items-start">
        <div>
          <p className="text-xs text-gray-500">{label}</p>

          {isLoading ? (
            <div className="mt-2 space-y-2 animate-pulse">
              <div className="h-8 w-24 rounded-full bg-gray-200" />
              <div className="h-3 w-20 rounded-full bg-gray-200" />
            </div>
          ) : (
            <>
              <p className="mt-2 text-lg font-bold sm:text-xl lg:text-2xl">
                {value}
              </p>

              {changeText ? (
                <div
                  className={`mt-3 text-[11px] ${
                    changePositive === false ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {changeText}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
