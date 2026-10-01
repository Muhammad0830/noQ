import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/shared/utils/getBottomNavValues";
import Link from "next/link";

export default function AdminPanelBottomNav({
  isAdmin,
  isActive,
}: {
  isAdmin: boolean;
  isActive: (patterns: string[]) => boolean;
}) {
  const { t } = useLanguage();
  return (
    <div
      className={cn(
        `absolute inset-0 flex h-16 transition-transform duration-300 ease-in-out items-center ${
          isAdmin
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`,
      )}
      aria-hidden={!isAdmin}
    >
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 transition-colors ${
              isActive(item.activePatterns)
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div
              className={isActive(item.activePatterns) ? "text-blue-600" : ""}
            >
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium whitespace-nowrap">
              {t(item.labelKey)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
