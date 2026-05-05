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
import { useLanguage } from "@/contexts/LanguageContext";
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

const getDisplayName = (member: StaffApiItem, unnamedLabel: string) => {
  return (
    member.user?.name?.trim() || member.user?.email?.trim() || unnamedLabel
  );
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);
  const [persistedShopId, setPersistedShopId] = useState<string | null>(null);
  const [hasLoadedPersistedShop, setHasLoadedPersistedShop] = useState(false);

  const shopId = searchParams.get("shopId");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem("selected_shop_id");
    const frame = window.requestAnimationFrame(() => {
      setPersistedShopId(saved);
      setHasLoadedPersistedShop(true);
    });

    return () => window.cancelAnimationFrame(frame);
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

  const unnamedStaffLabel = t("admin.staff.unnamedStaff");

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

      return getDisplayName(left, unnamedStaffLabel).localeCompare(
        getDisplayName(right, unnamedStaffLabel),
      );
    });
  }, [staffResponse, unnamedStaffLabel]);

  const filteredStaff = (() => {
    const query = search.trim().toLowerCase();
    if (!query) return staffMembers;

    return staffMembers.filter((member) => {
      const name = getDisplayName(
        member,
        t("admin.staff.unnamedStaff"),
      ).toLowerCase();
      const email = member.user?.email?.toLowerCase() || "";
      const role = t(
        `admin.staff.role.${member.role.toLowerCase()}`,
      ).toLowerCase();
      const shopName = member.shop?.name?.toLowerCase() || "";

      return [name, email, role, shopName].some((field) =>
        field.includes(query),
      );
    });
  })();

  const visibleExpandedStaffId = useMemo(() => {
    if (filteredStaff.length === 0) return null;

    if (
      expandedStaffId &&
      filteredStaff.some((member) => member.id === expandedStaffId)
    ) {
      return expandedStaffId;
    }

    return filteredStaff[0]?.id || null;
  }, [expandedStaffId, filteredStaff]);

  const currentShopName = useMemo(() => {
    if (!user) return t("admin.staff.manageTitle");

    return (
      user.shops?.find((shop) => shop.id === activeShopId)?.name ||
      user.shops?.[0]?.name ||
      t("admin.staff.manageTitle")
    );
  }, [activeShopId, t, user]);

  const activeCount = staffMembers.length;

  const roleLabels: Record<StaffRole, string> = {
    OWNER: t("admin.staff.role.owner"),
    MANAGER: t("admin.staff.role.manager"),
    STAFF: t("admin.staff.role.staff"),
  };

  const staffErrorMessage =
    (staffError?.data &&
      typeof staffError.data === "object" &&
      "message" in staffError.data &&
      typeof (staffError.data as { message?: unknown }).message === "string" &&
      (staffError.data as { message: string }).message) ||
    staffError?.message ||
    t("admin.staff.error.loadFailed");

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
              {t("admin.staff.manageTitle")}
            </h1>

            <button
              type="button"
              className="absolute right-0 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#c2c8d0] transition-colors duration-200 hover:bg-[#e8ebef]"
              aria-label={t("admin.staff.moreOptions")}
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 md:px-5 lg:px-6 pt-4 md:pt-5 lg:pt-6">
        {!activeShopId && (
          <div className="mb-4 rounded-[18px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {t("admin.staff.noShopSelected")}
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
            placeholder={t("admin.staff.searchPlaceholder")}
            className="w-full rounded-[18px] border border-[#d7d7d7] bg-white py-3 md:py-4 lg:py-4 pl-11 pr-4 text-[13px] md:text-[15px] lg:text-[15px] text-[#2c3138] placeholder:text-[#9aa0aa] shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 focus:border-[#f49b33] focus:outline-none"
          />
        </div>

        <section className="mt-4 md:mt-5 lg:mt-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] md:text-[11px] lg:text-[11px] font-bold uppercase tracking-[0.2em] text-[#a5adb7]">
              {t("admin.staff.activeMembers")}
            </p>
          </div>
          <span className="rounded-full bg-[#fff2e1] px-3 py-1 text-[10px] md:text-[11px] lg:text-[11px] font-semibold text-[#f49b33] shadow-[0_6px_14px_rgba(244,155,51,0.12)]">
            {t("admin.staff.total", { count: activeCount })}
          </span>
        </section>

        <section className="mt-4 md:mt-5 lg:mt-6 space-y-3 md:space-y-4 lg:space-y-4">
          {isStaffLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <article
                key={index}
                className="rounded-[22px] md:rounded-[23px] lg:rounded-[24px] bg-white p-3 md:p-4 lg:p-5 shadow-[0_10px_28px_rgba(17,24,39,0.05)] ring-1 ring-black/5"
              >
                <div className="flex items-start gap-3 md:gap-3.5 lg:gap-4">
                  <div className="h-14 md:h-15 lg:h-16 w-14 md:w-15 lg:w-16 shrink-0 rounded-full bg-[#eef2f7]" />
                  <div className="min-w-0 flex-1">
                    <div className="h-5 w-36 md:w-40 lg:w-40 rounded-full bg-[#eef2f7]" />
                    <div className="mt-2 md:mt-3 h-4 w-48 md:w-56 lg:w-56 rounded-full bg-[#eef2f7]" />
                    <div className="mt-3 md:mt-4 lg:mt-4 grid grid-cols-2 gap-2 md:gap-3 lg:gap-3">
                      <div className="h-10 md:h-11 lg:h-12 rounded-3xl bg-[#eef2f7]" />
                      <div className="h-10 md:h-11 lg:h-12 rounded-3xl bg-[#eef2f7]" />
                    </div>
                  </div>
                </div>
              </article>
            ))}

          {!isStaffLoading &&
            filteredStaff.map((member, index) => {
              const isActive = member.id === visibleExpandedStaffId;
              const displayName = getDisplayName(
                member,
                t("admin.staff.unnamedStaff"),
              );
              const initials = getInitials(displayName);
              const roleLabel = roleLabels[member.role];
              const gradient = avatarGradients[index % avatarGradients.length];
              const hasEmail = Boolean(member.user?.email?.trim());

              return (
                <article
                  key={member.id}
                  className={`rounded-[22px] md:rounded-[23px] lg:rounded-[24px] bg-white p-3 md:p-4 lg:p-5 shadow-[0_10px_28px_rgba(17,24,39,0.05)] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 ${
                    isActive ? "ring-[#f49b33]/25" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 md:gap-3.5 lg:gap-4">
                    <div className="relative shrink-0">
                      <div
                        className="flex h-14 md:h-15 lg:h-16 w-14 md:w-15 lg:w-16 items-center justify-center rounded-full border border-white shadow-[0_8px_20px_rgba(17,24,39,0.12)]"
                        style={{ background: gradient }}
                      >
                        <span className="text-[14px] md:text-[15px] lg:text-[16px] font-bold text-[#1e293b]">
                          {initials}
                        </span>
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 lg:h-3 lg:w-3 rounded-full border-2 border-white ${
                          member.role === "OWNER"
                            ? "bg-[#f49b33]"
                            : "bg-[#c8c8c8]"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 md:gap-3 lg:gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate text-[17px] md:text-[18px] lg:text-[19px] font-bold tracking-tight text-[#111111]">
                            {displayName}
                          </h2>
                          <p className="mt-0.5 md:mt-1 lg:mt-1 truncate text-[12px] md:text-[13px] lg:text-[14px] text-[#8f98a4]">
                            {roleLabel}
                            {hasEmail ? ` • ${member.user?.email}` : ""}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-[#fff2e1] px-2.5 md:px-3 lg:px-3 py-0.5 md:py-1 lg:py-1 text-[10px] md:text-[11px] lg:text-[11px] font-semibold text-[#f49b33]">
                          {roleLabel}
                        </span>
                      </div>

                      <div className="mt-3 md:mt-4 lg:mt-4 grid grid-cols-2 gap-2 md:gap-3 lg:gap-3">
                        <button
                          type="button"
                          onClick={() => openSchedule(member.id)}
                          className="inline-flex min-w-0 items-center justify-center gap-1.5 md:gap-2 lg:gap-2 rounded-3xl bg-[#f49b33] px-2.5 md:px-3 lg:px-3 py-2 md:py-3 lg:py-3 text-[12px] md:text-[13px] lg:text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(244,155,51,0.25)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                        >
                          <CalendarDays className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-4 lg:w-4 shrink-0" />
                          <span className="min-w-0 max-w-full truncate whitespace-nowrap">
                            {t("admin.staff.editSchedule")}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setExpandedStaffId((current) =>
                              current === member.id ? null : member.id,
                            );
                          }}
                          className="inline-flex items-center justify-center gap-1.5 md:gap-2 lg:gap-2 rounded-3xl bg-[#f5f5f5] px-2.5 md:px-3 lg:px-4 py-2 md:py-3 lg:py-3 text-[12px] md:text-[13px] lg:text-[14px] font-semibold text-[#656b75] shadow-[0_8px_18px_rgba(17,24,39,0.05)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                        >
                          <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-4 lg:w-4" />
                          {t("admin.staff.details")}
                        </button>
                      </div>

                      {isActive && (
                        <div className="mt-3 md:mt-4 lg:mt-4 rounded-3xl border border-dashed border-[#e5e7eb] bg-[#fafafa] px-3 md:px-4 lg:px-4 py-2.5 md:py-3 lg:py-3">
                          <div className="flex items-center gap-2 text-[11px] md:text-[12px] lg:text-[12px] font-semibold text-[#8b95a1]">
                            <Users className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-4 lg:w-4 text-[#f49b33]" />
                            {t("admin.staff.detailsTitle")}
                          </div>

                          <div className="mt-2 md:mt-3 lg:mt-3 space-y-1.5 md:space-y-2 lg:space-y-2 text-[12px] md:text-[13px] lg:text-[13px] text-[#4d5560]">
                            <div className="flex items-center justify-between gap-3 md:gap-4 lg:gap-4">
                              <span className="font-medium text-[#8f98a4]">
                                {t("admin.staff.role")}
                              </span>
                              <span className="font-semibold text-[#111111]">
                                {roleLabel}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 md:gap-4 lg:gap-4">
                              <span className="font-medium text-[#8f98a4]">
                                {t("admin.staff.email")}
                              </span>
                              <span className="max-w-[60%] truncate font-semibold text-[#111111]">
                                {member.user?.email || t("admin.staff.noEmail")}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 md:gap-4 lg:gap-4">
                              <span className="font-medium text-[#8f98a4]">
                                {t("admin.staff.shop")}
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
              {t("admin.staff.noResults")}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
