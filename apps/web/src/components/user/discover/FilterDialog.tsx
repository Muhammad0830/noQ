import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ShopCategory } from "@shared/types/general_types";
import { useTranslations } from "next-intl";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import FilterDialogCategories from "./FilterDialogCategories";
import FilterDialogPrice from "./FilterDialogPrice";
import { FilterType } from "@/features/discovery/types";

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000000;

interface Props {
  categories: ShopCategory[];
  isOpen: boolean;
  filter: FilterType;
  applyFilters: (draftFilter: FilterType) => void;
  clearFilters: () => void;
  setIsFilterOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FilterDialog({
  categories,
  isOpen,
  filter,
  applyFilters,
  clearFilters,
  setIsFilterOpen,
}: Props) {
  const t = useTranslations();

  const [draftFilter, setDraftFilter] = useState<FilterType>(filter);

  const priceTrackStyle = useMemo(() => {
    const min = DEFAULT_MIN_PRICE;
    const max = DEFAULT_MAX_PRICE;
    const left = ((draftFilter.minPrice - min) / (max - min)) * 100;
    const right = ((draftFilter.maxPrice - min) / (max - min)) * 100;

    return {
      left: `${Math.max(0, Math.min(left, 100))}%`,
      width: `${Math.max(0, Math.min(right, 100) - Math.max(0, Math.min(left, 100)))}%`,
    };
  }, [draftFilter]);

  const toggleCategory = (category: string) => {
    setDraftFilter((prev: FilterType) => ({
      ...prev,
      categories: draftFilter.categories.includes(category)
        ? draftFilter.categories.filter((item: string) => item !== category)
        : [...draftFilter.categories, category],
    }));
  };

  const togglePriceEnabled = () => {
    if (!draftFilter.priceEnabled) {
      setDraftFilter((prev: FilterType) => ({
        ...prev,
        priceEnabled: true,
        minPrice: DEFAULT_MIN_PRICE,
        maxPrice: DEFAULT_MAX_PRICE,
      }));
    } else {
      setDraftFilter((prev: FilterType) => ({
        ...prev,
        priceEnabled: false,
      }));
    }
  };

  const onChangeMinPrice = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    setDraftFilter((prev: FilterType) => ({
      ...prev,
      minPrice: value,
    }));
  };

  const onChangeMaxPrice = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    setDraftFilter((prev: FilterType) => ({
      ...prev,
      maxPrice: value,
    }));
  };

  return (
    <Dialog onOpenChange={setIsFilterOpen} open={isOpen}>
      <DialogContent>
        <DialogTitle>{t("user.discover.filter.title")}</DialogTitle>

        <FilterDialogCategories
          categories={categories}
          toggleCategory={toggleCategory}
          draftFilter={draftFilter}
        />

        <FilterDialogPrice
          togglePriceEnabled={togglePriceEnabled}
          draftFilter={draftFilter}
          onChangeMinPrice={onChangeMinPrice}
          onChangeMaxPrice={onChangeMaxPrice}
          priceTrackStyle={priceTrackStyle}
          defaultMinPrice={DEFAULT_MIN_PRICE}
          defaultMaxPrice={DEFAULT_MAX_PRICE}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearFilters}
            className="flex-1 rounded-2xl border border-[#F49B33]/25 bg-white px-4 py-3 text-sm font-semibold text-[#8a5620] shadow-sm transition hover:border-[#F49B33]/35 hover:bg-[#fff8ef]"
          >
            {t("user.discover.filter.reset")}
          </button>
          <button
            type="button"
            onClick={() => applyFilters(draftFilter)}
            className="flex-1 rounded-2xl bg-[#F49B33] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#e58d26] hover:shadow-md"
          >
            {t("common.save")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
