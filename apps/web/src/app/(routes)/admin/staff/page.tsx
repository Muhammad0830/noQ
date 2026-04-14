"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  MoreVertical,
  Search,
  Share2,
  UserRound,
} from "lucide-react";

export default function ManageStaff() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeDay, setActiveDay] = useState("thu");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const weekDays = [
    { id: "mon", day: "MON", date: 21, muted: false },
    { id: "tue", day: "TUE", date: 22, muted: false },
    { id: "wed", day: "WED", date: 23, muted: false },
    { id: "thu", day: "THU", date: 24, muted: false },
    { id: "fri", day: "FRI", date: 25, muted: false },
    { id: "sat", day: "SAT", date: 26, active: false, muted: true },
  ];

  const transactions = [
    {
      id: 1,
      customer: "Sarah Jenkins",
      time: "10:30 AM",
      service: "Men's Fade & Styling",
      amount: "$45.00",
      initials: "ALEX M.",
      cancelled: false,
      dayId: "thu",
    },
    {
      id: 2,
      customer: "Michael Ross",
      time: "11:15 AM",
      service: "Coloring & Treatment",
      amount: "$120.00",
      initials: "LINDA S.",
      cancelled: false,
      dayId: "thu",
    },
    {
      id: 3,
      customer: "David Goggins",
      time: "12:30 PM",
      service: "Beard Trim",
      amount: "$35.00",
      initials: "",
      cancelled: true,
      dayId: "thu",
    },
    {
      id: 4,
      customer: "Emily Blunt",
      time: "02:45 PM",
      service: "Full Head Highlights",
      amount: "$85.00",
      initials: "LINDA S.",
      cancelled: false,
      dayId: "thu",
    },
    {
      id: 5,
      customer: "Jessica Alba",
      time: "03:30 PM",
      service: "Manicure Express",
      amount: "$25.00",
      initials: "KIM J.",
      cancelled: false,
      dayId: "thu",
    },
    {
      id: 6,
      customer: "Marcus T.",
      time: "04:15 PM",
      service: "Buzz Cut",
      amount: "$30.00",
      initials: "ALEX M.",
      cancelled: false,
      dayId: "thu",
    },
  ];

  const filteredTransactions = useMemo(() => {
    const q = search.toLowerCase().trim();

    return transactions.filter((item) => {
      const dayMatch = item.dayId === activeDay;
      const textMatch =
        !q ||
        item.customer.toLowerCase().includes(q) ||
        item.service.toLowerCase().includes(q);

      return dayMatch && textMatch;
    });
  }, [activeDay, search, transactions]);

  const handleExport = () => {
    if (isExporting) return;

    setExportDone(false);
    setIsExporting(true);

    window.setTimeout(() => {
      setIsExporting(false);
      setExportDone(true);

      window.setTimeout(() => {
        setExportDone(false);
      }, 1300);
    }, 900);
  };

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto w-full bg-white">
        <header className="sticky top-0 z-10 border-b border-[#d6d6d6] bg-white px-4 py-3 backdrop-blur-sm">
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute left-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#cfcfcf] text-[#8f8f8f] transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h1 className="text-[30px] font-bold tracking-tight text-[#191919]">
              Shop History
            </h1>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="absolute right-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#9e9e9e] transition-colors duration-200 hover:bg-[#e7e7e7]"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-40 rounded-lg border border-[#d7d9dd] bg-white p-1 shadow-lg">
                <button
                  type="button"
                  className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-[#4e5560] transition-colors hover:bg-[#f7f7f7]"
                >
                  Refresh Logs
                </button>
                <button
                  type="button"
                  className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-[#4e5560] transition-colors hover:bg-[#f7f7f7]"
                >
                  Print Summary
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="space-y-5 px-4 pb-6 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f949a]" />
            <input
              type="text"
              placeholder="Search customer or staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[11px] border border-[#b8bec6] bg-transparent py-2.5 pl-10 pr-3 text-[13px] text-[#2c2f34] placeholder:text-[#8f949a] transition-colors focus:border-[#f0a339] focus:outline-none"
            />
          </div>

          <section className="flex items-center gap-2 overflow-x-auto pb-1">
            {weekDays.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setActiveDay(day.id)}
                className={`min-w-11 rounded-[11px] border px-2 py-1 text-center leading-tight transition-colors ${
                  activeDay === day.id
                    ? "border-[#efa83c] bg-[#efa83c] text-white"
                    : day.muted
                      ? "border-[#c5c7cc] bg-white text-[#b4b8bf]"
                      : "border-[#40454f] bg-white text-[#1f242c]"
                } active:scale-95`}
              >
                <p className="text-[9px] font-semibold">{day.day}</p>
                <p className="text-[24px] font-semibold tracking-tight">
                  {day.date}
                </p>
              </button>
            ))}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#8f949a]">
                Recent Transactions
              </h2>
              <span className="rounded-md border border-[#c8ccd1] px-2 py-1 text-[10px] font-medium text-[#9ba0a6]">
                12 Logs Today
              </span>
            </div>

            <div className="divide-y divide-[#d7d9dd] border-y border-[#d7d9dd]">
              {filteredTransactions.map((item) => (
                <article
                  key={item.id}
                  className="flex items-start gap-3 py-3 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                      item.cancelled
                        ? "bg-[#f2dddd] text-[#d09898]"
                        : "bg-[#f8ece0] text-[#e5a65f]"
                    }`}
                  >
                    <UserRound className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[20px] font-bold tracking-tight text-[#1f232a]">
                      {item.customer}
                    </p>
                    <p className="truncate text-[13px] font-medium">
                      <span className="text-[#f0a339]">{item.time}</span>
                      <span className="mx-2 text-[#b7bcc2]">•</span>
                      <span className="text-[#8f949a]">{item.service}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-[30px] font-semibold tracking-tight ${
                        item.cancelled ? "text-[#c8c8c8]" : "text-[#f0932b]"
                      }`}
                    >
                      {item.amount}
                    </p>
                    {item.cancelled ? (
                      <p className="text-[10px] font-semibold uppercase text-[#ef8f8f]">
                        Cancelled
                      </p>
                    ) : (
                      <p className="text-[10px] uppercase text-[#c0c3c9]">
                        {item.initials}
                      </p>
                    )}
                  </div>
                </article>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="py-8 text-center text-sm text-[#8f949a]">
                  Bu kunga mos transaction topilmadi.
                </div>
              )}
            </div>
          </section>

          <footer className="flex items-end justify-between pt-1">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#f0a339]">
                Daily Total Revenue
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-[42px] font-bold tracking-tight text-[#0f1115]">
                  $1,428.50
                </p>
                <span className="text-[14px] font-semibold text-[#2aa85d]">
                  +12%
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1 rounded-xl bg-[#eea338] px-4 py-2 text-[16px] font-semibold text-white shadow-[0_8px_18px_rgba(238,163,56,0.35)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              {exportDone ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2
                  className={`h-4 w-4 ${isExporting ? "animate-pulse" : ""}`}
                />
              )}
              {isExporting
                ? "Exporting..."
                : exportDone
                  ? "Exported"
                  : "Export"}
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
