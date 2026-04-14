"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock3,
  Droplets,
  MoreVertical,
  PenLine,
  Scissors,
  Search,
  Sparkles,
  ThermometerSnowflake,
  UserRound,
} from "lucide-react";

type ServiceItem = {
  id: string;
  name: string;
  duration: string;
  price: string;
  staffCount: number;
  icon: typeof Scissors;
  iconBg: string;
  iconColor: string;
  muted: boolean;
};

const services: ServiceItem[] = [
  {
    id: "classicFade",
    name: "Classic Fade",
    duration: "45 min",
    price: "$45",
    staffCount: 3,
    icon: Scissors,
    iconBg: "bg-[#fff2e5]",
    iconColor: "text-[#f3a33d]",
    muted: false,
  },
  {
    id: "razorShave",
    name: "Razor Shave",
    duration: "30 min",
    price: "$35",
    staffCount: 2,
    icon: Sparkles,
    iconBg: "bg-[#fff2e5]",
    iconColor: "text-[#f3a33d]",
    muted: false,
  },
  {
    id: "luxuryFacial",
    name: "Luxury Facial",
    duration: "60 min",
    price: "$85",
    staffCount: 1,
    icon: Droplets,
    iconBg: "bg-[#fff2e5]",
    iconColor: "text-[#f3a33d]",
    muted: false,
  },
  {
    id: "beardGrooming",
    name: "Beard Grooming",
    duration: "20 min",
    price: "$25",
    staffCount: 1,
    icon: Scissors,
    iconBg: "bg-[#f3f4f6]",
    iconColor: "text-[#a4abb6]",
    muted: true,
  },
  {
    id: "hotTowelScrub",
    name: "Hot Towel Scrub",
    duration: "15 min",
    price: "$15",
    staffCount: 1,
    icon: ThermometerSnowflake,
    iconBg: "bg-[#f3f4f6]",
    iconColor: "text-[#a4abb6]",
    muted: true,
  },
  {
    id: "signatureTint",
    name: "Signature Tint",
    duration: "30 min",
    price: "$30",
    staffCount: 1,
    icon: UserRound,
    iconBg: "bg-[#f3f4f6]",
    iconColor: "text-[#a4abb6]",
    muted: true,
  },
];

const staffAvatars: Record<string, string[]> = {
  classicFade: ["SJ", "MD", "+1"],
  razorShave: ["MD", "EW"],
  luxuryFacial: ["LW"],
  beardGrooming: ["JD"],
  hotTowelScrub: ["KB"],
  signatureTint: ["AM"],
};

export default function AdminServicesPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"active" | "inactive">(
    "active",
  );
  const [serviceState, setServiceState] = useState<Record<string, boolean>>({
    classicFade: true,
    razorShave: true,
    luxuryFacial: true,
    beardGrooming: false,
    hotTowelScrub: false,
    signatureTint: false,
  });

  const filteredServices = useMemo(() => {
    const q = search.toLowerCase().trim();

    return services.filter((service) => {
      const matchesFilter =
        activeFilter === "active" ? !service.muted : service.muted;
      const matchesSearch =
        !q ||
        service.name.toLowerCase().includes(q) ||
        service.duration.toLowerCase().includes(q) ||
        service.price.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const totalActive = services.filter((service) => !service.muted).length;

  const toggleService = (id: string) => {
    setServiceState((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const renderProfileStyleToggle = (enabled: boolean, label: string) => (
    <button
      type="button"
      onClick={() => toggleService(label)}
      className={`relative h-7 w-12 rounded-full border transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F49B33]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
        enabled
          ? "border-[#F49B33]/60 bg-[#F49B33]/25 dark:border-[#F49B33]/70 dark:bg-[#F49B33]/35"
          : "border-slate-300 bg-slate-200 dark:border-white/25 dark:bg-white/10"
      }`}
      aria-label={`Toggle ${label}`}
      aria-pressed={enabled}
    >
      <span
        className={`absolute top-0.75 h-5 w-5 rounded-full ring-1 transition-all duration-200 ${
          enabled
            ? "left-6 bg-[#F49B33] ring-[#F49B33]/60 dark:bg-[#F49B33] dark:ring-[#F49B33]/70"
            : "left-1 bg-white ring-slate-300 dark:bg-slate-100 dark:ring-white/35"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-dvh bg-[#f4f4f4]">
      <div className="mx-auto w-full bg-[#f4f4f4] pb-4">
        <header className="sticky top-0 z-20 border-b border-[#dcdcdc] bg-[#f9f9f9]/95 px-4 py-3 backdrop-blur-sm">
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute left-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d7d7d7] text-[#9d9d9d] transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h1 className="text-[18px] font-bold tracking-tight text-[#111111]">
              Manage Services
            </h1>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="absolute right-0 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#b0b0b0] transition-colors duration-200 hover:bg-[#ececec]"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 w-44 rounded-xl border border-[#e5e7eb] bg-white p-1 shadow-lg">
                <button
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#4d5560] transition-colors hover:bg-[#f7f7f7]"
                >
                  Add Category
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#4d5560] transition-colors hover:bg-[#f7f7f7]"
                >
                  Export Catalog
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="px-4 pt-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0aa]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search service by name or duration"
              className="w-full rounded-[18px] border border-[#d7d7d7] bg-white py-4 pl-11 pr-4 text-[15px] text-[#2c3138] placeholder:text-[#9aa0aa] shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 focus:border-[#F49B33] focus:outline-none"
            />
          </div>

          <section className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a5adb7]">
                Live Updates
              </p>
              <h2 className="mt-1 text-[17px] font-medium text-[#8b95a1]">
                Active Services
              </h2>
            </div>
            <span className="rounded-full bg-[#fff2e1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F49B33] shadow-[0_6px_14px_rgba(244,155,51,0.12)]">
              {totalActive} Total
            </span>
          </section>

          <section className="mt-4 space-y-4">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => {
                const enabled = serviceState[service.id];

                return (
                  <article
                    key={service.id}
                    className="overflow-hidden rounded-[24px] bg-white p-4 shadow-[0_10px_25px_rgba(17,24,39,0.04)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[18px] font-bold tracking-tight text-[#111827]">
                              {service.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-[12px] text-[#8b95a1]">
                              <Clock3 className="h-3.5 w-3.5" />
                              <span>{service.duration}</span>
                              <span className="text-[#d8dbe1]">•</span>
                              <span>{service.price}</span>
                            </div>
                          </div>
                          <div className="relative flex h-12 w-12 items-start justify-end overflow-hidden rounded-full bg-[#fff2e4]">
                            <div className="absolute right-0 top-0 h-12 w-12 rounded-full bg-[#fff2e4]" />
                            <p className="relative z-10 px-2 pt-2 text-[20px] font-bold tracking-tight text-[#F49B33]">
                              {service.price}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {staffAvatars[service.id]?.map((label) => (
                                <span
                                  key={label}
                                  className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#1f2937] text-[8px] font-semibold text-white"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f8894]">
                              {service.staffCount} staff
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8f98a4] transition-colors hover:bg-[#f3f4f6]"
                            >
                              <PenLine className="h-4 w-4" />
                            </button>
                            {renderProfileStyleToggle(enabled, service.id)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#d5d9df] bg-white px-4 py-8 text-center text-sm text-[#8b95a1]">
                No services matched your search.
              </div>
            )}
          </section>

          <section className="mt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#9da4ad]">
              Archived Catalog
            </p>
            <h3 className="mt-1 text-[17px] font-medium text-[#8b95a1]">
              Inactive Services
            </h3>

            <div className="mt-4 space-y-3 rounded-[24px] bg-white p-4 shadow-[0_10px_25px_rgba(17,24,39,0.04)] ring-1 ring-black/5">
              {services
                .filter((service) => service.muted)
                .map((service) => {
                  const Icon = service.icon;
                  const enabled = serviceState[service.id];

                  return (
                    <div
                      key={service.id}
                      className="flex items-center gap-3 rounded-2xl py-1"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${service.iconBg} ${service.iconColor}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[16px] font-semibold text-[#374151]">
                          {service.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#98a0ab]">
                          <span>{service.duration}</span>
                          <span className="text-[#d8dbe1]">•</span>
                          <span>{service.price}</span>
                        </div>
                        <button
                          type="button"
                          className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aa1ab] transition-colors hover:text-[#F49B33]"
                        >
                          <PenLine className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      </div>

                      {renderProfileStyleToggle(enabled, service.id)}
                    </div>
                  );
                })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
