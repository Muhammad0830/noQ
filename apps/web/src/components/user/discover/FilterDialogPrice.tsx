import { cn, formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent } from "react";

interface FilterType {
  categories: string[];
  priceEnabled: boolean;
  minPrice: number;
  maxPrice: number;
}

interface Props {
  togglePriceEnabled: () => void;
  draftFilter: FilterType;
  onChangeMinPrice: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMaxPrice: (event: ChangeEvent<HTMLInputElement>) => void;
  priceTrackStyle: React.CSSProperties;
  defaultMinPrice: number;
  defaultMaxPrice: number;
}

export default function FilterDialogPrice({
  togglePriceEnabled,
  draftFilter,
  onChangeMinPrice,
  onChangeMaxPrice,
  priceTrackStyle,
  defaultMinPrice,
  defaultMaxPrice,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="rounded-3xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] text-slate-500">
            {t("user.discover.filter.priceRange").toUpperCase()}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {t("user.discover.filter.togglePrice")}
          </p>
        </div>

        <button
          type="button"
          onClick={togglePriceEnabled}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center overflow-hidden rounded-full p-0.5 transition ${draftFilter.priceEnabled ? "bg-green-500" : "bg-slate-300"
            }`}
          aria-label={t("user.discover.filter.togglePrice")}
          aria-pressed={draftFilter.priceEnabled}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white shadow transition-transform ${draftFilter.priceEnabled ? "translate-x-5" : "translate-x-0"
              }`}
          />
        </button>
      </div>

      <div className={cn("grid grid-cols-2 gap-2 sm:gap-2.5", !draftFilter.priceEnabled && 'opacity-60')}>
        <div className="rounded-2xl">
          <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:text-[7px]">
            {t("user.discover.filter.priceFrom")}
          </p>

          <p className="mt-1 text-sm font-bold whitespace-nowrap text-slate-900 sm:text-xs">
            {formatPrice(draftFilter.minPrice, locale)} {t("common.currency")}
          </p>
        </div>

        <div className="rounded-2xl">
          <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:text-[7px]">
            {t("user.discover.filter.priceTo")}
          </p>

          <p className="mt-1 text-sm font-bold whitespace-nowrap text-slate-900 sm:text-xs">
            {formatPrice(draftFilter.maxPrice, locale)} {t("common.currency")}
          </p>
        </div>
      </div>

      <div
        className={`rangePrice mb-4 ${draftFilter.priceEnabled ? "" : "opacity-45"}`}
      >
        <div className="slider rounded-full bg-linear-to-r from-[#fff4e7] via-[#ffe1bd] to-[#fff4e7]">
          <input
            type="range"
            min={defaultMinPrice}
            max={defaultMaxPrice}
            step={1}
            value={draftFilter.minPrice}
            disabled={!draftFilter.priceEnabled}
            onChange={onChangeMinPrice}
            className={`range-thumb ${draftFilter.minPrice > defaultMaxPrice - 20 ? "range-thumb--zindex-5" : "range-thumb--zindex-3"}`}
          />

          <input
            type="range"
            min={defaultMinPrice}
            max={defaultMaxPrice}
            step={1}
            value={draftFilter.maxPrice}
            disabled={!draftFilter.priceEnabled}
            onChange={onChangeMaxPrice}
            className="range-thumb range-thumb--zindex-4"
          />

          <div className="slider-track bg-slate-200/90" />

          <div
            className="slider-range bg-linear-to-r from-[#f49b33] via-[#f7b35c] to-[#f49b33]"
            style={priceTrackStyle}
          />

          <div className="slider-left-value">
            {formatPrice(defaultMinPrice, locale)} {t("common.currency")}
          </div>

          <div className="slider-right-value">
            {formatPrice(defaultMaxPrice, locale)} {t("common.currency")}
          </div>
        </div>
      </div>
    </div>
  );
}
