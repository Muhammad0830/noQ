import { ChevronLeft, MoreVertical } from "lucide-react";

type ScheduleHeaderProps = {
  title: string;
  onBack: () => void;
};

export default function ScheduleHeader({ title, onBack }: ScheduleHeaderProps) {
  return (
    <header className="mb-2 flex items-center justify-center px-4 py-3">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d2d5db] text-[#b1b6bf] transition-colors hover:bg-black/5"
        aria-label="Back"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <h1 className="text-[20px] font-bold tracking-tight text-[#1b1b1b]">{title}</h1>

      <button
        type="button"
        className="absolute right-8 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#a9a9a9] transition-colors hover:bg-black/5"
        aria-label="More"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
    </header>
  );
}
