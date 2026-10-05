import { cn } from "@/lib/utils";
import { USER_NAV_ITEMS } from "@/shared/utils/getBottomNavValues";
import { User } from "@shared/types/general_types";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface Props {
  isAdmin: boolean;
  user: User|null;
  open: () => void;
  isActive(patterns: string[]): boolean;
}

export default function UserPanelBottomNav({
  isAdmin,
  isActive,
  user,
  open,
}: Props) {
  const t = useTranslations();
  const protectedRoutes = new Set(["/bookings", "/profile"]);

  return (
    <div
      className={cn(
        `absolute inset-0 flex h-16 transition-transform duration-300 ease-in-out items-center ${
          isAdmin
            ? "translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`,
      )}
      aria-hidden={isAdmin}
    >
      {USER_NAV_ITEMS.map((item) => {
        const Icon = item.icon;

        if (!user && protectedRoutes.has(item.href)) {
          return (
            <button
              key={item.href}
              type="button"
              onClick={open}
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
            </button>
          );
        }

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
