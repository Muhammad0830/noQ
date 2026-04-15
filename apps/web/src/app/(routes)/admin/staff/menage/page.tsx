"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  LayoutGrid,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

type StaffMember = {
  id: number;
  name: string;
  role: string;
  skill: string;
  totalLabel: string;
  initials: string;
  avatarFrom: string;
  avatarTo: string;
};

const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Lead Stylist",
    skill: "Hair Design",
    totalLabel: "3 Total",
    initials: "SJ",
    avatarFrom: "#d8c1a8",
    avatarTo: "#f4e6d4",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Color Specialist",
    skill: "Balayage",
    totalLabel: "2 Total",
    initials: "MC",
    avatarFrom: "#5e6c80",
    avatarTo: "#d9dee7",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Nail Technician",
    skill: "Artistry",
    totalLabel: "1 Total",
    initials: "ER",
    avatarFrom: "#5e8b82",
    avatarTo: "#d7ebe7",
  },
];

export default function Page() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeStaffId, setActiveStaffId] = useState<number>(1);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [skillsOpenFor, setSkillsOpenFor] = useState<number | null>(1);

  const filteredStaff = useMemo(() => {
    const query = search.toLowerCase().trim();

    return staffMembers.filter((member) => {
      if (!query) return true;
      return (
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.skill.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const activeCount = staffMembers.length;

  const openSchedule = (id: number) => {
    router.push(`/admin/staff/${id}/schedule`);
  };

  const openQuickAdd = () => {
    setQuickAddOpen((current) => !current);
  };

  return (
    <div className="min-h-dvh bg-red">
      <div className="mx-auto w-full bg-red">
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
              Manage Staff
            </h1>
            <button
              type="button"
              className="absolute right-0 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#b0b0b0] transition-colors duration-200 hover:bg-[#ececec]"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="px-4 pt-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0aa]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff by name or skill"
              className="w-full rounded-[18px] border border-[#d7d7d7] bg-white py-4 pl-11 pr-4 text-[15px] text-[#2c3138] placeholder:text-[#9aa0aa] shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 focus:border-[#f49b33] focus:outline-none"
            />
          </div>

          <section className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a5adb7]">
                Active Team Members
              </p>
            </div>
            <span className="rounded-full bg-[#fff2e1] px-3 py-1 text-[11px] font-semibold text-[#f49b33] shadow-[0_6px_14px_rgba(244,155,51,0.12)]">
              {activeCount} Total
            </span>
          </section>

          <section className="mt-4 space-y-4">
            {filteredStaff.map((member) => {
              const isActive = member.id === activeStaffId;
              const skillsVisible = member.id === skillsOpenFor;

              return (
                <article
                  key={member.id}
                  className={`rounded-[24px] bg-white p-4 shadow-[0_10px_28px_rgba(17,24,39,0.05)] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 ${
                    isActive ? "ring-[#f49b33]/25" : ""
                  }`}
                  onMouseEnter={() => setActiveStaffId(member.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full border border-white shadow-[0_8px_20px_rgba(17,24,39,0.12)]"
                        style={{
                          background: `linear-gradient(135deg, ${member.avatarFrom}, ${member.avatarTo})`,
                        }}
                      >
                        <span className="text-[16px] font-bold text-[#1e293b]">
                          {member.initials}
                        </span>
                      </div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#c8c8c8]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-[19px] font-bold tracking-tight text-[#111111]">
                        {member.name}
                      </h2>
                      <p className="mt-1 truncate text-[14px] text-[#8f98a4]">
                        {member.role} • {member.skill}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => openSchedule(member.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#f49b33] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(244,155,51,0.25)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                        >
                          <CalendarDays className="h-4 w-4" />
                          Edit Schedu...
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveStaffId(member.id);
                            setSkillsOpenFor((current) =>
                              current === member.id ? null : member.id,
                            );
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#f5f5f5] px-4 py-3 text-[14px] font-semibold text-[#656b75] shadow-[0_8px_18px_rgba(17,24,39,0.05)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                        >
                          <Sparkles className="h-4 w-4" />
                          Skills
                        </button>
                      </div>

                      {skillsVisible && (
                        <div className="mt-4 rounded-[18px] border border-dashed border-[#e5e7eb] bg-[#fafafa] px-4 py-3">
                          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#8b95a1]">
                            <Users className="h-4 w-4 text-[#f49b33]" />
                            Staff focus
                          </div>
                          <p className="mt-2 text-[14px] text-[#4d5560]">
                            {member.name} uchun skills va schedule qisqa
                            yo‘riqnomasi shu yerda ochiladi.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredStaff.length === 0 && (
              <div className="rounded-[24px] border border-dashed border-[#d7dbe0] bg-white px-4 py-8 text-center text-sm text-[#8f98a4]">
                No team members matched your search.
              </div>
            )}
          </section>

          <div className="flex justify-end pb-20 pt-6">
            <button
              type="button"
              onClick={openQuickAdd}
              className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#111111] shadow-[0_18px_35px_rgba(17,24,39,0.16)] ring-1 ring-black/5 transition-transform duration-200 hover:scale-105 active:scale-95"
              aria-label="Add staff member"
            >
              <Plus
                className={`h-8 w-8 transition-transform duration-200 ${quickAddOpen ? "rotate-45" : ""}`}
              />
            </button>
          </div>
        </main>

        {quickAddOpen && (
          <div className="fixed bottom-28 right-4 z-30 w-44 rounded-4xl border border-[#e5e7eb] bg-white p-2 shadow-[0_18px_35px_rgba(17,24,39,0.14)]">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#4d5560] transition-colors hover:bg-[#f7f7f7]"
              onClick={() => router.push("/admin/staff/new")}
            >
              <LayoutGrid className="h-4 w-4 text-[#f49b33]" />
              Add staff
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#4d5560] transition-colors hover:bg-[#f7f7f7]"
              onClick={() => setQuickAddOpen(false)}
            >
              <Users className="h-4 w-4 text-[#f49b33]" />
              Invite team
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
