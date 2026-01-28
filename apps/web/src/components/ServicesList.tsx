'use client';

import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from './ServiceCard';
import type { Service, ShopCategory } from '@shared/types/types';

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
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000000,
    minRating: 0,
    openNow: false,
  });

  // Mock services data for demonstration
  useEffect(() => {
    if (initialServices.length === 0) {
      // Mock data
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Klassik soch olish',
          description: "Professional soch olish xizmati erkaklar uchun",
          price: 50000,
          durationMin: 30,
          isActive: true,
          shopId: '1',
          shop: {
            id: '1',
            name: 'Classic Barbershop',
            address: 'Amir Temur ko\'chasi, Toshkent',
            phone: '+998901234567',
            categoryId: '1',
            ownerId: '1',
            isOpen: true,
            createdAt: new Date().toISOString(),
            rating: 4.8,
            reviewCount: 125,
          },
        },
        {
          id: '2',
          name: 'Manikür + Pedikür',
          description: 'Professional tirnoq parvarishi',
          price: 80000,
          durationMin: 60,
          isActive: true,
          shopId: '2',
          shop: {
            id: '2',
            name: 'Beauty Paradise',
            address: 'Chilonzor tumani, Toshkent',
            phone: '+998901234568',
            categoryId: '2',
            ownerId: '2',
            isOpen: true,
            createdAt: new Date().toISOString(),
            rating: 4.9,
            reviewCount: 89,
          },
        },
        {
          id: '3',
          name: 'Klassik massaj',
          description: 'Tanani dam olish uchun professional massaj',
          price: 150000,
          durationMin: 60,
          isActive: true,
          shopId: '3',
          shop: {
            id: '3',
            name: 'Relax Spa Center',
            address: 'Yunusobod tumani, Toshkent',
            phone: '+998901234569',
            categoryId: '3',
            ownerId: '3',
            isOpen: true,
            createdAt: new Date().toISOString(),
            rating: 4.7,
            reviewCount: 67,
          },
        },
        {
          id: '4',
          name: 'Soqol olish',
          description: "Professional soqol tarosh xizmati",
          price: 30000,
          durationMin: 20,
          isActive: true,
          shopId: '1',
          shop: {
            id: '1',
            name: 'Classic Barbershop',
            address: 'Amir Temur ko\'chasi, Toshkent',
            phone: '+998901234567',
            categoryId: '1',
            ownerId: '1',
            isOpen: true,
            createdAt: new Date().toISOString(),
            rating: 4.8,
            reviewCount: 125,
          },
        },
      ];
      setServices(mockServices);
    }
  }, [initialServices]);

  const filteredServices = services.filter((service) => {
    // Filter by search query
    if (searchQuery && !service.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by price range
    if (Number(service.price) < filters.priceMin || Number(service.price) > filters.priceMax) {
      return false;
    }

    // Filter by rating
    if (service.shop?.rating && service.shop.rating < filters.minRating) {
      return false;
    }

    // Filter by open now
    if (filters.openNow && !service.shop?.isOpen) {
      return false;
    }

    return true;
  });

  const handleFavorite = (serviceId: string) => {
    // TODO: Implement favorite functionality
    console.log('Toggle favorite:', serviceId);
  };

  const resetFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: 1000000,
      minRating: 0,
      openNow: false,
    });
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('services.all')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredServices.length} {t('services.all').toLowerCase()}
            </p>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">{t('filter.title')}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('filter.title')}
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('filter.reset')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('filter.priceRange')}
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('filter.rating')}
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value={0}>All ratings</option>
                  <option value={3}>3+ ⭐</option>
                  <option value={4}>4+ ⭐</option>
                  <option value={4.5}>4.5+ ⭐</option>
                </select>
              </div>

              {/* Open Now Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('filter.openNow')}
                </label>
                <button
                  onClick={() => setFilters({ ...filters, openNow: !filters.openNow })}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    filters.openNow
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {filters.openNow ? 'Yes' : 'All'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('services.noResults')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesList;
