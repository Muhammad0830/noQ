import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { categoryIcons } from "@/lib/getCategoryIcon";
import { Shop } from "@/shared/types/shop";
import { Plus, User } from "lucide-react";
import { Route } from "next";
import { useTranslations } from "next-intl";
import PanelChangeListItem from "./PanelChangeListItem";

interface Props {
  isAdmin: boolean;
  providerMode: boolean;
  isLoadingShops: boolean;
  visibleAdminShops: Shop[];
  setProviderMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PanelChangeAccordion({
  isAdmin,
  providerMode,
  isLoadingShops,
  setProviderMode,
  visibleAdminShops,
}: Props) {
  const t = useTranslations();

  if (!isAdmin) {
    return (
      <PanelChangeListItem
        href={"/add-business" as Route}
        icon={<Plus className="h-5 w-5" />}
        title={t("profile.addNewShop")}
      />
    );
  }

  return (
    <section className="mb-5 rounded-2xl border border-[#f1c894] bg-white px-4 shadow-sm">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="admin-shops" className="border-0!">
          <AccordionTrigger icon_center color="#F49B33" className="rounded-xl px-0 py-3 hover:no-underline [&>svg]:text-[#F49B33]">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff3e6] text-[#F49B33]">
                <User className="h-7 w-7" />
              </div>

              <div className="min-w-0 text-left">
                <span className="block truncate text-base font-semibold text-slate-900">
                  {t("profile.switchPanel")}
                </span>

                <span className="block truncate text-sm font-normal text-slate-500">
                  {providerMode ? t("profile.adminPanel") : t("profile.personal")}
                </span>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-0">
            {isLoadingShops ? (
              <p className="text-sm text-slate-500">{t("common.loading")}</p>
            ) : visibleAdminShops.length === 0 ? (
              <p className="text-sm text-slate-500">
                {t("profile.noAdminShops")}
              </p>
            ) : (
              <ul className="p-0">
                {providerMode && (
                  <PanelChangeListItem
                    href={"home" as Route}
                    icon={<User className="h-5 w-5" />}
                    title={t("profile.personal")}
                    subtitle={t("profile.goToUserPanel")}
                    onClick={() => setProviderMode(false)}
                  />
                )}

                {visibleAdminShops.map((shop) => (
                  <PanelChangeListItem
                    key={shop.id}
                    href={"/admin/dashboard" as Route}
                    icon={categoryIcons[`${shop.category?.icon ?? 'store'}`]}
                    title={shop.name}
                    subtitle={shop.category?.name}
                    onClick={() => {
                      localStorage.setItem("selected_shop_id", shop.id);
                      setProviderMode(true);
                    }}
                  />
                ))}

                <PanelChangeListItem
                  href={"/add-business" as Route}
                  icon={<Plus className="h-5 w-5" />}
                  title={t("profile.addNewShop")}
                />
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
