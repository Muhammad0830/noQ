"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useShop } from "@/contexts/ShopContext";
import ActiveServiceList from "@/components/admin/services/AcitveServiceList";
import InactiveServiceList from "@/components/admin/services/InactiveServiceList";
import { useAdminServices } from "@/hooks/admin/useAdminServices";
import ErrorSection from "@/components/admin/services/ErrorSection";
import SearchSection from "@/components/admin/services/SearchSection";

export default function AdminServicesPage() {
  const t = useTranslations();
  const { shop } = useShop();

  const [search, setSearch] = useState("");

  const {
    services,
    isLoading,
    error,
    refetch,
    activateService,
    deactivateService,
    isUpdating,
    activationError,
    deactivationError,
  } = useAdminServices({ shopId: shop?.id })

  const { activeServices, inactiveServices } = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = services.filter(service =>
      !q ||
      service.name.toLowerCase().includes(q) ||
      service.price.toString().includes(q)
    );

    return {
      activeServices: filtered.filter(service => service.isActive),
      inactiveServices: filtered.filter(service => !service.isActive),
    };
  }, [services, search]);

  const onActivateService = (id: string) => {
    activateService({ id }, { onSuccess: () => refetch() })
  }

  const onDeactivateService = (id: string) => {
    deactivateService({ id }, { onSuccess: () => refetch() })
  }

  return (
    <main className="min-h-dvh bg-[#f4f4f4] p-4 pb-20 mx-auto w-full">
      <SearchSection search={search} setSearch={setSearch} />

      <ErrorSection
        serviceDataError={error}
        serviceUpdateError={activationError || deactivationError}
      />

      <section className="mt-4 md:mt-5 lg:mt-6 flex items-center justify-between">
        <div>
          <h2 className="mt-1 text-[15px] md:text-[16px] lg:text-[17px] font-medium text-[#8b95a1]">
            {t("admin.services.active")}
          </h2>
        </div>
        <span className="rounded-full bg-[#fff2e1] px-3 py-1 text-[10px] md:text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F49B33] shadow-[0_6px_14px_rgba(244,155,51,0.12)]">
          {t("admin.services.total", { count: activeServices.length })}
        </span>
      </section>

      <ActiveServiceList
        isUpdating={isUpdating}
        deactivateService={onDeactivateService}
        services={activeServices}
        isLoading={isLoading}
      />

      <InactiveServiceList
        isUpdating={isUpdating}
        activateService={onActivateService}
        services={inactiveServices}
        isLoading={isLoading}
      />
    </main>
  );
}
