'use client';

import React from 'react';
import { Clock, MapPin, Star, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Service, Shop } from '@shared/types/types';
import Link from 'next/link';

interface ServiceCardProps {
  service: Service;
  onFavorite?: (serviceId: string) => void;
  isFavorite?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onFavorite,
  isFavorite = false 
}) => {
  const { t } = useLanguage();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onFavorite) {
      onFavorite(service.id);
    }
  };

  return (
    <Link href={`/shop/${service.shopId}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Image Section */}
        <div className="relative h-48 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden">
          {service.shop?.logoUrl ? (
            <img
              src={service.shop.logoUrl}
              alt={service.shop.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-300 dark:text-gray-600">
                {service.name.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </button>

          {/* Shop Status Badge */}
          {service.shop && (
            <div className="absolute bottom-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  service.shop.isOpen
                    ? 'bg-green-500/90 text-white'
                    : 'bg-gray-500/90 text-white'
                }`}
              >
                {service.shop.isOpen ? t('filter.openNow') : 'Closed'}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Service Name */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {service.name}
          </h3>

          {/* Shop Name */}
          {service.shop && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
              <MapPin className="w-4 h-4 mr-1 shrink-0" />
              <span className="line-clamp-1">{service.shop.name}</span>
            </div>
          )}

          {/* Description */}
          {service.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {service.description}
            </p>
          )}

          {/* Service Details */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>{service.durationMin} {t('services.duration')}</span>
            </div>
            
            {service.shop?.rating && (
              <div className="flex items-center text-sm">
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {service.shop.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Price and Book Button */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t('services.price')}
              </span>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Number(service.price).toLocaleString()} {t('currency.som')}
              </div>
            </div>
            
            <button className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg">
              {t('services.book')}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
