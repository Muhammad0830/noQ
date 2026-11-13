import { Plus, Search } from "lucide-react";
import { Route } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";

interface SearchSectionProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
}

const SearchSection: FC<SearchSectionProps> = ({
    search,
    setSearch,
}) => {
    const t = useTranslations();

    return (
        <div className="flex md:hidden items-center gap-3">
            <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0aa]" />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("admin.services.searchPlaceholder")}
                    className="w-full rounded-full border border-[#d7d7d7] bg-white py-4 pl-11 pr-4 text-[15px] text-[#2c3138] placeholder:text-[#9aa0aa] shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 focus:border-[#F49B33] focus:outline-none"
                />
            </div>

            <Link
                href={"/admin/services/new" as Route}
                aria-label={t("admin.services.aria.addService")}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F49B33] text-white shadow-[0_10px_24px_rgba(244,155,51,0.24)] transition-transform duration-200 active:scale-95"
            >
                <Plus className="h-5 w-5" />
            </Link>
        </div>
    );
}

export default SearchSection;