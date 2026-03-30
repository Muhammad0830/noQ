'use client'

import { useState, useMemo, use } from 'react'
import Link from 'next/link'
import { Star, MapPin, Clock, Phone, Heart, Share2, ChevronLeft, Map } from 'lucide-react'
import useApiQuery from '@/hooks/useApiQuery'
import API_ENDPOINTS from '@/lib/api'
import type { Shop, Service, Review } from '@shared/types/types'
import { getImageUrl } from '@/lib/supabaseClient'
import { Skeleton } from '@/components/ui/skeleton'

interface ShopDetailResponse extends Omit<Shop, 'services'> {
  services: Service[]
}

export default function ShopProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState('services')
  const [isFavorite, setIsFavorite] = useState(false)

  // 🔥 FETCH SHOP DETAILS
  const { data: shop, isLoading: shopLoading, error: shopError } = useApiQuery<ShopDetailResponse>(
    API_ENDPOINTS.shopById(id),
    {
      key: ['shop', id],
    }
  )

  // 🔥 FETCH SERVICES
  const { data: servicesData = [] } = useApiQuery<Service[]>(
    API_ENDPOINTS.shopServices(id),
    {
      key: ['services', id],
    }
  )

  // 🔥 FETCH REVIEWS
  const { data: reviewsData = [] } = useApiQuery<Review[]>(
    API_ENDPOINTS.shopReviews(id),
    {
      key: ['reviews', id],
    }
  )

  const services = useMemo(() => {
    return (servicesData?.length > 0 ? servicesData : shop?.services) || []
  }, [servicesData, shop?.services])

  const reviews = useMemo(() => {
    return reviewsData || []
  }, [reviewsData])

  const shopData = shop || {
    id: id,
    name: 'Loading...',
    description: '',
    address: '',
    phone: '',
    isOpen: true,
    averageRating: 0,
    reviewCount: 0,
    categoryId: '',
    ownerId: '',
    category: undefined,
    backgroundImageUrl: undefined,
    createdAt: new Date().toISOString(),
  }

  const backgroundImage = shopData.backgroundImageUrl ? getImageUrl(shopData.backgroundImageUrl) : null
  const distance = '1.2 miles'
  const hours = '9AM - 8PM'
  const hasPhone = Boolean(shopData.phone && shopData.phone.trim().length > 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Error Message */}
      {shopError && (
        <div className="bg-red-50 border border-red-200 p-4 m-4 rounded-lg">
          <p className="text-red-800 font-semibold">Error loading shop details</p>
          <p className="text-red-600 text-sm">{shopError.data?.message || shopError.message}</p>
        </div>
      )}

      {/* Top Bar */}
      <div className="max-w-3xl mx-auto px-4 pt-3 pb-2 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="shrink-0 p-1.5 sm:p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </button>

        <div className="flex-1 text-center min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{shopData.name}</h1>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-xs sm:text-sm">{shopData.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="text-xs sm:text-sm text-gray-600">({shopData.reviewCount || 0} reviews)</span>
          </div>
        </div>

        <button type="button" className="shrink-0 p-1.5 sm:p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50">
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => setIsFavorite(!isFavorite)}
          className="shrink-0 p-1.5 sm:p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50"
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="max-w-3xl mx-auto px-4 mt-1">
        <div className="relative h-64 sm:h-80 bg-gray-300 overflow-hidden rounded-3xl">
          {shopLoading ? (
            <Skeleton className="h-full w-full rounded-3xl" />
          ) : (
            <>
              {backgroundImage ? (
                <img
                  src={backgroundImage}
                  alt={shopData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl font-bold text-gray-300">{shopData.name.charAt(0)}</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

              {/* Status + Address */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 pr-4">
                <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-white ${shopData.isOpen ? 'bg-teal-500' : 'bg-red-500'}`}>
                  {shopData.isOpen ? 'OPEN NOW' : 'CLOSED'}
                </span>
                <p className="mt-1.5 sm:mt-2 text-white text-base sm:text-2xl font-medium leading-tight drop-shadow-md line-clamp-2">
                  {shopData.address || 'Address not available'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header Info */}
        {!shopLoading && (
          <div className="mb-6">
            {/* Quick Info Grid */}
            <div className={`grid ${hasPhone ? 'grid-cols-4' : 'grid-cols-3'} gap-2 sm:gap-3`}>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-[11px] sm:text-xs font-medium text-gray-700">{distance}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-orange-50 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                <span className="text-[11px] sm:text-xs font-medium text-gray-700">{hours}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                <Map className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-[11px] sm:text-xs font-medium text-gray-700">View Map</span>
              </div>
              {hasPhone && (
                <a
                  href={`tel:${shopData.phone}`}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <span className="text-[11px] sm:text-xs font-medium text-gray-700">Qo'ng'iroq</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
            {['services', 'gallery', 'reviews', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-medium text-xs sm:text-sm capitalize transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && !shopLoading && (
          <div className="space-y-4">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      {service.durationMin && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.durationMin} min
                        </span>
                      )}
                      {service.description && (
                        <span>{service.description}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xl font-bold text-teal-600">
                        ${(service.price || 0).toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={`/book/${id}?service=${service.id}`}
                      className="px-6 py-2 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No services available</p>
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-3 gap-4">
            {backgroundImage ? (
              <div className="col-span-3">
                <img 
                  src={backgroundImage} 
                  alt={shopData.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ) : (
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                      <div className="flex items-center gap-1 text-yellow-400 mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment || 'No comment'}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet</p>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700 text-sm">
              {shopData.description || 'No description yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
