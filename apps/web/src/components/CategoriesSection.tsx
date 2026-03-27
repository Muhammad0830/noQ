'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Scissors,
  Sparkles,
  Heart,
  Coffee,
  Dumbbell,
  Palette,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ShopCategory } from '@shared/types/types';

interface CategoriesSectionProps {
  categories?: ShopCategory[];
  onCategorySelect?: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  scissors: <Scissors className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  coffee: <Coffee className="w-6 h-6" />,
  dumbbell: <Dumbbell className="w-6 h-6" />,
  palette: <Palette className="w-6 h-6" />,
};

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories = [],
  onCategorySelect,
  selectedCategory = null,
}) => {
  const { t } = useLanguage();

  // Default categories if none provided
  const defaultCategories: ShopCategory[] = [
    { id: '1', name: 'Barbershop', icon: 'scissors' },
    { id: '2', name: 'Beauty Salon', icon: 'sparkles' },
    { id: '3', name: 'Spa & Massage', icon: 'heart' },
    { id: '4', name: 'Nail Salon', icon: 'palette' },
    { id: '5', name: 'Fitness', icon: 'dumbbell' },
    { id: '6', name: 'Cafe', icon: 'coffee' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  const indicatorCount = useMemo(() => {
    return Math.max(1, displayCategories.length);
  }, [displayCategories.length]);

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

  const handleCategoryClick = (categoryId: string | null) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t('categories.title')}
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>


        {/* Categories Carousel Row */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex flex-nowrap gap-3 w-max min-w-full">
              {/* All Categories Button */}
              <button
                onClick={() => handleCategoryClick(null)}
                className={`group min-w-28 sm:min-w-30 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 shrink-0 ${
                  selectedCategory === null
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-all ${
                      selectedCategory === null
                        ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-linear-to-br group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-semibold text-center leading-tight ${
                      selectedCategory === null
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t('categories.all')}
                  </span>
                </div>
              </button>

              {/* Category Buttons */}
              {displayCategories.map((category) => {
                const isSelected = selectedCategory === category.id;
                const icon = category.icon ? categoryIcons[category.icon] : categoryIcons['sparkles'];

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`group min-w-28 sm:min-w-30 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 shrink-0 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-linear-to-br group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white'
                        }`}
                      >
                        {icon}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-semibold text-center leading-tight ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Carousel dots indicator */}
        {indicatorCount > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
            {Array.from({ length: indicatorCount }).map((_, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={() => scrollToDot(i)}
                aria-label={`Go to category ${i + 1}`}
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
    </section>
  );
};

export default CategoriesSection;
