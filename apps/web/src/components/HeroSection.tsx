'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroSectionProps {
  onSearch?: (query: string, location: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const openDiscover = () => {
    router.push('/discover');
  };

  return (
    <section className="relative bg-linear-to-br from-blue-600 via-purple-600 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Search Form */}
          <form className="max-w-4xl mx-auto">
            <div className="flex items-stretch gap-2">
              {/* Service Search */}
              <div className="flex-1 flex items-center px-4 py-3 bg-white dark:bg-gray-800 rounded-4xl shadow-2xl">
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder={t('hero.search.placeholder')}
                  readOnly
                  onClick={openDiscover}
                  onFocus={openDiscover}
                  className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base"
                />
              </div>
            </div>
          </form>

        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-white dark:fill-gray-900"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
