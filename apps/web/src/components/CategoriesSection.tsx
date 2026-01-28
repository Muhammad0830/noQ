'use client';

import React from 'react';
import { Scissors, Sparkles, Heart, Coffee, Dumbbell, Palette } from 'lucide-react';
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

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* All Categories Button */}
          <button
            onClick={() => handleCategoryClick(null)}
            className={`group p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedCategory === null
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 hover:shadow-lg'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                  selectedCategory === null
                    ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-linear-to-br group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white'
                }`}
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <span
                className={`text-sm font-semibold text-center ${
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
                className={`group p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-linear-to-br group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white'
                    }`}
                  >
                    {icon}
                  </div>
                  <span
                    className={`text-sm font-semibold text-center ${
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
    </section>
  );
};

export default CategoriesSection;
