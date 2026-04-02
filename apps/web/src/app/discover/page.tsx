'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ShopCard from '@/components/ShopCard';
import { API_ENDPOINTS } from '@/lib/api';
import type { Shop } from '@shared/types/types';
import useApiQuery from '@/hooks/useApiQuery';

const popularServices = [
  {
    id: 1,
    title: 'Precision Beard Trim',
    shop: '30min • The Fade',
    price: '$25.00',
  },
  {
    id: 2,
    title: 'Express Glow Facial',
    shop: '45min • Aura Wellness',
    price: '$60.00',
  },
];

export default function DiscoverServices() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const popularScrollRef = useRef<HTMLDivElement | null>(null);
  const [activePopularDot, setActivePopularDot] = useState(0);

  const { data: popularShops = [], isLoading: isPopularShopsLoading } =
    useApiQuery<Shop[]>(`${API_ENDPOINTS.shops_trending}`, {
      key: ['discover-popular-purchases'],
    });

  const filteredServices = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return popularServices;

    return popularServices.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.shop.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredPopularShops = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return popularShops;

    return popularShops.filter((shop) =>
      shop.name.toLowerCase().includes(q)
    );
  }, [popularShops, query]);

  const popularIndicatorCount = Math.max(1, filteredPopularShops.length);

  const updatePopularActiveDot = () => {
    const el = popularScrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setActivePopularDot(0);
      return;
    }

    const progress = el.scrollLeft / maxScroll;
    setActivePopularDot(Math.round(progress * (popularIndicatorCount - 1)));
  };

  const scrollToPopularDot = (index: number) => {
    const el = popularScrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = (maxScroll * index) / Math.max(1, popularIndicatorCount - 1);
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070d18] dark:text-white">
      <div className="mx-auto w-full max-w-md px-4 pb-8 pt-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700 dark:bg-white">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your next look..."
            className="h-6 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('services.homePopularPurchases')}
          </p>

          {isPopularShopsLoading ? (
            <div className="flex gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={`discover-popular-skeleton-${i}`}
                  className="max-w-85 min-w-65 h-56 w-[70vw] shrink-0 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1422] dark:shadow-none"
                />
              ))}
            </div>
          ) : filteredPopularShops.length > 0 ? (
            <>
              <div className="sm:hidden">
                <div
                  ref={popularScrollRef}
                  onScroll={updatePopularActiveDot}
                  className="overflow-x-auto flex gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  {filteredPopularShops.map((shop) => (
                    <div key={shop.id} className="max-w-85 min-w-65 w-[70vw] shrink-0">
                      <ShopCard shop={shop} />
                    </div>
                  ))}
                </div>

                {popularIndicatorCount > 1 && (
                  <div className="mt-3 flex justify-center gap-2">
                    {Array.from({ length: popularIndicatorCount }).map((_, i) => (
                      <button
                        key={`popular-dot-${i}`}
                        type="button"
                        onClick={() => scrollToPopularDot(i)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          i === activePopularDot
                            ? 'bg-cyan-500 dark:bg-cyan-400'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                        aria-label={`Go to card ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden sm:grid grid-cols-2 gap-4">
                {filteredPopularShops.slice(0, 4).map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#0e1726] dark:text-slate-400 dark:shadow-none">
              No results
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Popular Services</p>
          <div className="space-y-2.5">
            {filteredServices.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-800 dark:bg-[#0e1726] dark:shadow-none"
              >
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-slate-300 to-slate-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{item.shop}</p>
                  <p className="text-sm font-bold text-cyan-400">{item.price}</p>
                </div>
                <Link
                  href={`/book/${item.id}`}
                  className="rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-bold text-emerald-950"
                >
                  BOOK
                </Link>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#0e1726] dark:text-slate-400 dark:shadow-none">
                No services found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
