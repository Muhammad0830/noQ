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
    <div className="mb-6 w-full rounded-2xl border border-[#f1c894] bg-white/90 p-1.5 sm:max-w-xl">
      <div className="grid grid-cols-3 gap-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`rounded-xl px-2 py-2.5 text-xs font-medium transition sm:text-sm ${
              filter === key
                ? "bg-[#F49B33] text-white shadow-[0_8px_18px_rgba(244,155,51,0.34)]"
                : "text-[#F49B33] hover:bg-[#fff3e6]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
