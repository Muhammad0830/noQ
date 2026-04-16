import Link from "next/link";
import { CalendarDays, ChevronLeft } from "lucide-react";

export default function AdminSchedulePage() {
  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const month = today.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  const day = today.getDate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
              Schedule
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{weekday}, {month} {day}</h1>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500">
            <CalendarDays className="h-5 w-5 text-orange-400" />
            <p className="font-medium">Schedule view is ready here.</p>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-gray-500">
            Full schedule content can be placed here.
          </div>
        </div>
      </div>
    </div>
  );
}
