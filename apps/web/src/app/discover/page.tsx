'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, Filter, Heart, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DiscoverServices() {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const shops = [
    {
      id: 1,
      name: 'Elite Hair Salon',
      rating: 4.9,
      reviews: 320,
      category: 'Hair Salon',
      price: '$$',
      distance: '0.5 km',
      address: '123 Main Street, Tashkent',
      phone: '+998 90 123 45 67',
    },
    {
      id: 2,
      name: 'Kings Barber Shop',
      rating: 4.8,
      reviews: 250,
      category: 'Barbershop',
      price: '$',
      distance: '1.2 km',
      address: '456 Second Ave, Tashkent',
      phone: '+998 90 234 56 78',
    },
    {
      id: 3,
      name: 'Luxury Spa & Wellness',
      rating: 4.7,
      reviews: 180,
      category: 'Spa',
      price: '$$$',
      distance: '2.1 km',
      address: '789 Third St, Tashkent',
      phone: '+998 90 345 67 89',
    },
    {
      id: 4,
      name: 'Nail Art Studio',
      rating: 4.9,
      reviews: 410,
      category: 'Nail Salon',
      price: '$$',
      distance: '0.8 km',
      address: '321 Fourth Rd, Tashkent',
      phone: '+998 90 456 78 90',
    },
    {
      id: 5,
      name: 'Beauty Lounge',
      rating: 4.6,
      reviews: 150,
      category: 'Beauty',
      price: '$$',
      distance: '1.5 km',
      address: '654 Fifth Lane, Tashkent',
      phone: '+998 90 567 89 01',
    },
    {
      id: 6,
      name: 'Modern Cuts',
      rating: 4.8,
      reviews: 290,
      category: 'Hair Salon',
      price: '$',
      distance: '0.3 km',
      address: '987 Sixth Blvd, Tashkent',
      phone: '+998 90 678 90 12',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 md:py-4">
          {/* Mobile: Stacked */}
          {/* Desktop: Horizontal */}
          <div className="space-y-3 md:space-y-0 md:flex md:gap-3 md:items-center">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
              <Search className="text-gray-400 w-5 h-5 shrink-0" />
              <input
                type="text"
                placeholder={t('hero.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Location */}
            <div className="flex-1 md:flex-none flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
              <MapPin className="text-gray-400 w-5 h-5 shrink-0" />
              <input
                type="text"
                placeholder={t('hero.location.placeholder')}
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full md:w-40 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">{t('filter.title')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters - Desktop Only */}
          <aside className="hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                {t('filter.title')}
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
                  {t('filter.category')}
                </h4>
                <div className="space-y-2">
                  {[
                    'All',
                    'Hair Salon',
                    'Barbershop',
                    'Nail Salon',
                    'Spa & Massage',
                    'Beauty',
                  ].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked={cat === 'All'}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
                  {t('filter.priceRange')}
                </h4>
                <div className="space-y-2">
                  {['$', '$$', '$$$', '$$$$'].map((price) => (
                    <label
                      key={price}
                      className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
                  {t('filter.rating')}
                </h4>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {rating}+ ⭐
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters Modal */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
              <div
                className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-800 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {t('filter.title')}
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
                      {t('filter.category')}
                    </h4>
                    <div className="space-y-2">
                      {[
                        'All',
                        'Hair Salon',
                        'Barbershop',
                        'Nail Salon',
                        'Spa & Massage',
                        'Beauty',
                      ].map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded"
                            defaultChecked={cat === 'All'}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
                      {t('filter.priceRange')}
                    </h4>
                    <div className="space-y-2">
                      {['$', '$$', '$$$', '$$$$'].map((price) => (
                        <label
                          key={price}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {price}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
                      {t('filter.rating')}
                    </h4>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {rating}+ ⭐
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {shops.length} {t('services.all')}
              </h1>
              <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 md:px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option>Sort by: Recommended</option>
                <option>Highest Rated</option>
                <option>Most Reviews</option>
                <option>Distance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            <div className="space-y-4">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Image */}
                    <div className="w-full sm:w-40 md:w-48 h-40 md:h-48 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0"></div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <div className="flex-1">
                          <Link
                            href={`/shop/${shop.id}`}
                            className="text-lg md:text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                          >
                            {shop.name}
                          </Link>
                          <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="font-semibold">{shop.rating}</span>
                            </div>
                            <span>({shop.reviews})</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{shop.category}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{shop.price}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(shop.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full self-start md:self-auto"
                        >
                          <Heart
                            className={`w-5 md:w-6 h-5 md:h-6 ${
                              favorites.includes(shop.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="line-clamp-1">{shop.distance}</span>
                        </div>
                        <p className="line-clamp-2 text-gray-700 dark:text-gray-300">
                          Professional services with experienced staff and modern equipment.
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/shop/${shop.id}`}
                          className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {t('shop.viewDetails')}
                        </Link>
                        <Link
                          href={`/book/${shop.id}`}
                          className="flex-1 text-center px-4 py-2 border-2 border-blue-600 text-blue-600 dark:text-blue-400 text-sm md:text-base rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          {t('shop.bookNow')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
