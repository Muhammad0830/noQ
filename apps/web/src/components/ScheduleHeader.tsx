import { ChevronLeft, MoreVertical } from "lucide-react";

type ScheduleHeaderProps = {
  title: string;
  onBack: () => void;
  backAriaLabel?: string;
  moreAriaLabel?: string;
};

export default function ScheduleHeader({
  title,
  onBack,
  backAriaLabel = "Back",
  moreAriaLabel = "More",
}: ScheduleHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex w-full items-center justify-center border-b border-[#eef0f3] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(17,24,39,0.04)] sm:px-5">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d2d5db] text-[#b1b6bf] transition-colors hover:bg-black/5"
        aria-label={backAriaLabel}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <h1 className="text-[20px] font-bold tracking-tight text-[#1b1b1b]">{title}</h1>

      <button
        type="button"
        className="absolute right-8 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#a9a9a9] transition-colors hover:bg-black/5"
        aria-label={moreAriaLabel}
      >
        <MoreVertical className="h-5 w-5" />
      </button>
    </header>
  );
}
