'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from './ServiceCard';
import API_ENDPOINTS from '@/lib/api';
import type { Service, Shop, ShopCategory } from '@shared/types/types';

interface ServicesListProps {
  initialServices?: Service[];
  categories?: ShopCategory[];
  selectedCategory?: string | null;
  searchQuery?: string;
  locationQuery?: string;
}

const ServicesList: React.FC<ServicesListProps> = ({
  initialServices = [],
  categories = [],
  selectedCategory = null,
  searchQuery = '',
  locationQuery = '',
}) => {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  // Fetch services from backend
useEffect(() => {
  let mounted = true;

  const fetchServices = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const query = new URLSearchParams({
        open: 'true',
        limit: '12',
      });

      if (selectedCategory) {
        query.set('categoryId', selectedCategory);
      }

      if (searchQuery.trim()) {
        query.set('search', searchQuery.trim());
      }

      const shopsResponse = await fetch(
        `${API_ENDPOINTS.shops_trending}?${query.toString()}`,
        { headers, cache: 'no-store' }
      );

      if (!shopsResponse.ok) throw new Error();

      const shopsPayload = await shopsResponse.json();
      const shops = shopsPayload ?? [];

    

      if (!mounted) return;

      setServices(shops.flat());
    } catch (err) {
      if (!mounted) return;
      setFetchError('failed');
      setServices([]);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  fetchServices();

  return () => {
    mounted = false;
  };
}, [searchQuery, selectedCategory]);

  const filteredServices = services.filter((service) => {
    // Filter by search query
    if (searchQuery && !service.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const indicatorCount = useMemo(() => {
    return Math.max(1, filteredServices.length);
  }, [filteredServices.length]);

  const updateActiveDot = () => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setActiveDot(0);
      return;
    }

    const progress = el.scrollLeft / maxScroll;
    const nextActive = Math.round(progress * (indicatorCount - 1));
    setActiveDot(nextActive);
  };

  useEffect(() => {
    updateActiveDot();
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => updateActiveDot();
    const onResize = () => updateActiveDot();

    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [indicatorCount]);

  const scrollToDot = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    const target = (maxScroll * index) / Math.max(1, indicatorCount - 1);
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  const handleFavorite = (serviceId: string) => {
    // TODO: Implement favorite functionality
    console.log('Toggle favorite:', serviceId);
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t('services.homePopularPurchases')}
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <>
            {/* Mobile: Swipe cards */}
            <div className="sm:hidden">
              <div
                ref={scrollRef}
                className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="flex flex-nowrap gap-4 w-max min-w-full">
                  {filteredServices.map((service) => (
                    <div key={service.id} className="w-[84vw] max-w-sm shrink-0">
                      <ServiceCard service={service} onFavorite={handleFavorite} />
                    </div>
                  ))}
                </div>
              </div>

              {indicatorCount > 1 && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  {Array.from({ length: indicatorCount }).map((_, i) => (
                    <button
                      key={`service-dot-${i}`}
                      type="button"
                      onClick={() => scrollToDot(i)}
                      aria-label={`Go to service ${i + 1}`}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activeDot
                          ? 'bg-blue-600 dark:bg-blue-400'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Grid */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onFavorite={handleFavorite}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('services.noResults')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {fetchError ? t('common.error') : 'Try adjusting your filters'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesList;
