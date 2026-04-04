import { BookingFilter } from "../bookings.types";

type Props = {
  filter: BookingFilter;
  onChange: (next: BookingFilter) => void;
  t: (key: string) => string;
};

export default function BookingFilterTabs({ filter, onChange, t }: Props) {
  const tabs: Array<{ key: BookingFilter; label: string }> = [
    { key: "ongoing", label: t("history.tab.ongoing") },
    { key: "completed", label: t("history.tab.completed") },
    { key: "cancelled", label: t("history.tab.cancelled") },
  ];

  return (
    <div className="mb-6 w-full rounded-2xl border border-slate-200 bg-white/75 p-1.5 dark:border-white/10 dark:bg-white/3 sm:max-w-xl">
      <div className="grid grid-cols-3 gap-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`rounded-xl px-2 py-2.5 text-xs font-medium transition sm:text-sm ${
              filter === key
                ? "bg-slate-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:bg-white/12"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
