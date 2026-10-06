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

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000000;

interface FilterType {
  categories: string[];
  priceEnabled: boolean;
  minPrice: number;
  maxPrice: number;
}

interface Props {
  initialCategoryId: string | null;
  categories: ShopCategory[];
  isOpen: boolean;
  filter: FilterType;
  defaultFilter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
  setIsFilterOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FilterDialog({
  categories,
  isOpen,
  filter,
  defaultFilter,
  setFilter,
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

  const applyFilters = () => {
    setFilter(draftFilter);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setIsFilterOpen(false);
    setFilter(defaultFilter);
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
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />
      </DialogContent>
    </Dialog>
  );
}
