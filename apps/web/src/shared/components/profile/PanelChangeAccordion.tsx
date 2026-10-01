import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { resolveCategoryIcon } from "@/lib/getCategoryIcon";
import { Plus, Store, User } from "lucide-react";
import { useRouter } from "next/navigation";

type AdminShop = {
  id: string;
  name: string;
  address?: string;
  ownerId?: string;
  isOpen?: boolean;
  category?: { id: string; name: string; icon?: string };
};

interface Props {
  isAdmin: boolean;
  providerMode: boolean;
  isLoadingShops: boolean;
  visibleAdminShops: AdminShop[];
  setProviderMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PanelChangeAccordion({
  isAdmin,
  providerMode,
  isLoadingShops,
  setProviderMode,
  visibleAdminShops,
}: Props) {
    const router = useRouter();
  const { t } = useLanguage();

  if (isAdmin) {
    return (
      <section className="mb-5 rounded-2xl border border-[#f1c894] bg-white px-4 shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="admin-shops" className="border-0!">
            <AccordionTrigger className="rounded-xl px-0 py-3 hover:no-underline [&>svg]:text-[#F49B33]">
              <span className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff3e6] text-[#F49B33]">
                  <User className="h-7 w-7" />
                </span>

                <span className="min-w-0 text-left">
                  <span className="block truncate text-base font-semibold text-slate-900">
                    {t("profile.switchPanel")}
                  </span>
                  <span className="block truncate text-sm font-normal text-slate-500">
                    {providerMode
                      ? t("profile.adminPanel")
                      : t("profile.personal")}
                  </span>
                </span>
              </span>
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
                    <button
                      type="button"
                      onClick={() => {
                        setProviderMode(false);
                        router.push("/user");
                      }}
                      aria-label={t("profile.addNewShop")}
                      className="w-full relative flex items-center gap-2 py-3 rounded-lg text-left text-base"
                    >
                      <div className="absolute left-0 right-0 top-0 bg-black/10 h-px" />
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff3e6] text-[#F49B33]">
                        <User className="h-5 w-5" />
                      </span>

                      <div>
                        <p className="font-semibold text-sm text-slate-800">
                          {t("profile.personal")}
                        </p>
                        <p className="text-xs text-slate-800">
                          {t("profile.goToUserPanel")}
                        </p>
                      </div>
                    </button>
                  )}
                  {visibleAdminShops.map((shop) => (
                    <li key={shop.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            localStorage.setItem("selected_shop_id", shop.id);
                          }
                          setProviderMode(true);
                          router.push(`/admin?shopId=${shop.id}`);
                        }}
                        className="w-full relative flex items-center gap-2 py-3 rounded-lg text-left text-base"
                      >
                        <div className="absolute left-0 right-0 top-0 bg-black/10 h-px" />
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff3e6] text-[#F49B33]">
                          {resolveCategoryIcon(shop.category?.icon) && (
                            <Store className="h-5 w-5" />
                          )}
                        </span>

                        <div>
                          <p className="font-semibold text-sm text-slate-800">
                            {shop.name}
                          </p>
                          <p className="text-xs text-slate-800">
                            {shop.category?.name}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                  <button
                    type="button"
                    onClick={() => router.push("/profile/add-business")}
                    aria-label={t("profile.addNewShop")}
                    className="w-full relative flex items-center gap-2 py-3 rounded-lg text-left text-base"
                  >
                    <div className="absolute left-0 right-0 top-0 bg-black/10 h-px" />
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff3e6] text-[#F49B33]">
                      <Plus className="h-5 w-5" />
                    </span>

                    <p className="font-semibold text-sm text-slate-800">
                      {t("profile.addNewShop")}
                    </p>
                  </button>
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    );
  } else
    return (
      <button
        type="button"
        onClick={() => router.push("/profile/add-business")}
        className="mb-5 flex w-full items-center gap-2 rounded-2xl border border-[#f1c894] bg-white p-3 shadow-sm"
      >
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fff3e6] text-[#F49B33]">
          <Plus className="h-5 w-5" />
        </span>

        <span className="min-w-0 text-left">
          <span className="block truncate text-sm font-semibold text-slate-900">
            {t("profile.addNewShop")}
          </span>
        </span>
      </button>
    );
}
