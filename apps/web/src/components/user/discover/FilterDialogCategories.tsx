import { ShopCategory } from "@shared/types/general_types";
import { useTranslations } from "next-intl";

interface Props {
  categories: ShopCategory[];
  toggleCategory: (category: string) => void;
  draftFilter: FilterType;
}

interface FilterType {
  categories: string[];
  priceEnabled: boolean;
  minPrice: number;
  maxPrice: number;
}

export default function FilterDialogCategories({
  categories,
  toggleCategory,
  draftFilter,
}: Props) {
  const t = useTranslations();

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold tracking-[0.18em] text-slate-500">
          {t("user.discover.filter.category").toUpperCase()}
        </p>
        <span className="text-[10px] font-bold tracking-[0.14em] text-[#F49B33]">
          {t("user.discover.filter.multiSelect").toUpperCase()}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {categories.map((category) => {
          const active = draftFilter.categories.includes(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[#F49B33] text-white"
                  : "bg-[#fff3e6] text-[#8a5620]"
              }`}
            >
              {t(`categories.${category.name}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
