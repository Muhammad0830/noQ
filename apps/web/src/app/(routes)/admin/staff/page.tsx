"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  MoreVertical,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";

type StaffRole = "OWNER" | "MANAGER" | "STAFF";

type StaffApiItem = {
  id: string;
  role: StaffRole;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  shop?: {
    id?: string;
    name?: string | null;
  } | null;
};

type StaffResponse = {
  owner?: StaffApiItem[];
  staffMembers?: StaffApiItem[];
};

const avatarGradients = [
  "linear-gradient(135deg, #f49b33, #ffd39a)",
  "linear-gradient(135deg, #5e6c80, #d9dee7)",
  "linear-gradient(135deg, #5e8b82, #d7ebe7)",
  "linear-gradient(135deg, #8b5cf6, #ddd6fe)",
  "linear-gradient(135deg, #db2777, #fbcfe8)",
] as const;

const roleLabels: Record<StaffRole, string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  STAFF: "Staff",
};

const getInitials = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "S";
  }

  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "S"
  );
};

const getDisplayName = (member: StaffApiItem) => {
  return (
    member.user?.name?.trim() || member.user?.email?.trim() || "Unnamed staff"
  );
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);
  const [persistedShopId, setPersistedShopId] = useState<string | null>(null);
  const [hasLoadedPersistedShop, setHasLoadedPersistedShop] = useState(false);

  const shopId = searchParams.get("shopId");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem("selected_shop_id");
    if (saved) {
      setPersistedShopId(saved);
    }

    setHasLoadedPersistedShop(true);
  }, []);

  const activeShopId = useMemo(() => {
    if (!hasLoadedPersistedShop) return null;

    const userShops = user?.shops || [];

    if (shopId && userShops.some((shop) => shop.id === shopId)) {
      return shopId;
    }

    if (
      persistedShopId &&
      userShops.some((shop) => shop.id === persistedShopId)
    ) {
      return persistedShopId;
    }

    return userShops[0]?.id || null;
  }, [hasLoadedPersistedShop, persistedShopId, shopId, user?.shops]);

  useEffect(() => {
    if (!activeShopId || typeof window === "undefined") return;

    window.localStorage.setItem("selected_shop_id", activeShopId);
  }, [activeShopId]);

  const staffUrl = useMemo(() => {
    if (!activeShopId) return null;

    const params = new URLSearchParams({ shopId: activeShopId });
    if (search.trim()) {
      params.set("search", search.trim());
    }

    return `${API_ENDPOINTS.admin.staffs}?${params.toString()}`;
  }, [activeShopId, search]);

  const {
    data: staffResponse,
    error: staffError,
    isLoading: isStaffLoading,
    isError: isStaffError,
  } = useApiQuery<StaffResponse>(staffUrl, {
    key: ["admin-staffs", activeShopId || "none", search.trim()],
    enabled: Boolean(activeShopId && user),
    staleTime: 30_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    headers: activeShopId
      ? { "x-shopid": activeShopId, "x-shop-id": activeShopId }
      : undefined,
  });

  const staffMembers = useMemo(() => {
    const merged = [
      ...(staffResponse?.owner || []),
      ...(staffResponse?.staffMembers || []),
    ];
    const unique = new Map<string, StaffApiItem>();

    for (const item of merged) {
      if (!unique.has(item.id)) {
        unique.set(item.id, item);
      }
    }

    const rank = (role: StaffRole) => {
      if (role === "OWNER") return 0;
      if (role === "MANAGER") return 1;
      return 2;
    };

    return Array.from(unique.values()).sort((left, right) => {
      const roleDiff = rank(left.role) - rank(right.role);
      if (roleDiff !== 0) return roleDiff;

      return getDisplayName(left).localeCompare(getDisplayName(right));
    });
  }, [staffResponse]);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return staffMembers;

    return staffMembers.filter((member) => {
      const name = getDisplayName(member).toLowerCase();
      const email = member.user?.email?.toLowerCase() || "";
      const role = roleLabels[member.role].toLowerCase();
      const shopName = member.shop?.name?.toLowerCase() || "";

      return [name, email, role, shopName].some((field) =>
        field.includes(query),
      );
    });
  }, [search, staffMembers]);

  useEffect(() => {
    if (filteredStaff.length === 0) {
      setExpandedStaffId(null);
      return;
    }

    if (
      expandedStaffId &&
      !filteredStaff.some((member) => member.id === expandedStaffId)
    ) {
      setExpandedStaffId(filteredStaff[0]?.id || null);
    }
  }, [expandedStaffId, filteredStaff]);

  const currentShopName = useMemo(() => {
    if (!user) return "Manage Staff";

    return (
      user.shops?.find((shop) => shop.id === activeShopId)?.name ||
      user.shops?.[0]?.name ||
      "Manage Staff"
    );
  }, [activeShopId, user]);

  const activeCount = staffMembers.length;

  const staffErrorMessage =
    (staffError?.data &&
      typeof staffError.data === "object" &&
      "message" in staffError.data &&
      typeof (staffError.data as { message?: unknown }).message === "string" &&
      (staffError.data as { message: string }).message) ||
    staffError?.message ||
    "Failed to load staff members.";

  const openSchedule = (id: string) => {
    const basePath = `/admin/staff/${id}/schedule`;
    if (!activeShopId) {
      router.push(basePath);
      return;
    }

    router.push(`${basePath}?shopId=${encodeURIComponent(activeShopId)}`);
  };

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(244,155,51,0.12),transparent_35%),linear-gradient(180deg,#fffaf4_0%,#f9fafb_45%,#f3f4f6_100%)] pb-24">
      <div className="sticky top-0 z-20 border-b border-[#e9ebee] bg-[#f4f5f7]/95 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-6xl px-4 py-4">
          <div className="relative flex min-h-10 items-center justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d2d6dc] bg-[#f0f2f5] text-[#c2c8d0] transition-colors duration-200 hover:bg-[#e8ebef]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <h1 className="text-[18px] font-bold tracking-tight text-[#121417]">
              Manage Staff
            </h1>

            <button
              type="button"
              className="absolute right-0 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#c2c8d0] transition-colors duration-200 hover:bg-[#e8ebef]"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pt-4">
        {!activeShopId && (
          <div className="mb-4 rounded-[18px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            No shop is selected for this admin view.
          </div>
        )}

        {isStaffError && (
          <div className="mb-4 rounded-[18px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {staffErrorMessage}
          </div>
        )}

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0aa]" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search staff by name, email, or role"
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
          {isStaffLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <article
                key={index}
                className="rounded-[24px] bg-white p-4 shadow-[0_10px_28px_rgba(17,24,39,0.05)] ring-1 ring-black/5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 shrink-0 rounded-full bg-[#eef2f7]" />
                  <div className="min-w-0 flex-1">
                    <div className="h-5 w-40 rounded-full bg-[#eef2f7]" />
                    <div className="mt-3 h-4 w-56 rounded-full bg-[#eef2f7]" />
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="h-12 rounded-3xl bg-[#eef2f7]" />
                      <div className="h-12 rounded-3xl bg-[#eef2f7]" />
                    </div>
                  </div>
                </div>
              </article>
            ))}

          {!isStaffLoading &&
            filteredStaff.map((member, index) => {
              const isActive = member.id === expandedStaffId;
              const displayName = getDisplayName(member);
              const initials = getInitials(displayName);
              const roleLabel = roleLabels[member.role];
              const gradient = avatarGradients[index % avatarGradients.length];
              const hasEmail = Boolean(member.user?.email?.trim());

              return (
                <article
                  key={member.id}
                  className={`rounded-[24px] bg-white p-4 shadow-[0_10px_28px_rgba(17,24,39,0.05)] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 ${
                    isActive ? "ring-[#f49b33]/25" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full border border-white shadow-[0_8px_20px_rgba(17,24,39,0.12)]"
                        style={{ background: gradient }}
                      >
                        <span className="text-[16px] font-bold text-[#1e293b]">
                          {initials}
                        </span>
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          member.role === "OWNER"
                            ? "bg-[#f49b33]"
                            : "bg-[#c8c8c8]"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate text-[19px] font-bold tracking-tight text-[#111111]">
                            {displayName}
                          </h2>
                          <p className="mt-1 truncate text-[14px] text-[#8f98a4]">
                            {roleLabel}
                            {hasEmail ? ` • ${member.user?.email}` : ""}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-[#fff2e1] px-3 py-1 text-[11px] font-semibold text-[#f49b33]">
                          {roleLabel}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => openSchedule(member.id)}
                          className="inline-flex min-w-0 items-center justify-center gap-2 rounded-3xl bg-[#f49b33] px-3 py-3 text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(244,155,51,0.25)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                        >
                          <CalendarDays className="h-4 w-4 shrink-0" />
                          <span className="min-w-0 max-w-full truncate whitespace-nowrap">
                            Edit Schedule
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setExpandedStaffId((current) =>
                              current === member.id ? null : member.id,
                            );
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#f5f5f5] px-4 py-3 text-[14px] font-semibold text-[#656b75] shadow-[0_8px_18px_rgba(17,24,39,0.05)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                        >
                          <Sparkles className="h-4 w-4" />
                          Details
                        </button>
                      </div>

                      {isActive && (
                        <div className="mt-4 rounded-[18px] border border-dashed border-[#e5e7eb] bg-[#fafafa] px-4 py-3">
                          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#8b95a1]">
                            <Users className="h-4 w-4 text-[#f49b33]" />
                            Staff details
                          </div>

                          <div className="mt-3 space-y-2 text-[13px] text-[#4d5560]">
                            <div className="flex items-center justify-between gap-4">
                              <span className="font-medium text-[#8f98a4]">
                                Role
                              </span>
                              <span className="font-semibold text-[#111111]">
                                {roleLabel}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="font-medium text-[#8f98a4]">
                                Email
                              </span>
                              <span className="max-w-[60%] truncate font-semibold text-[#111111]">
                                {member.user?.email || "No email"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="font-medium text-[#8f98a4]">
                                Shop
                              </span>
                              <span className="max-w-[60%] truncate font-semibold text-[#111111]">
                                {member.shop?.name || currentShopName}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

          {!isStaffLoading && filteredStaff.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-[#d7dbe0] bg-white px-4 py-8 text-center text-sm text-[#8f98a4]">
              No team members matched your search.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
