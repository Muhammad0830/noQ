'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Trash2, MapPin, Star, Phone } from 'lucide-react'

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: 'Elite Hair Salon',
      category: 'Hair Salon',
      rating: 4.9,
      reviews: 320,
      price: '$$',
      distance: '0.5 km',
      address: '123 Main Street, Tashkent',
      phone: '+998 90 123 45 67',
      image: ''
    },
    {
      id: 2,
      name: 'Kings Barber Shop',
      category: 'Barbershop',
      rating: 4.8,
      reviews: 250,
      price: '$',
      distance: '1.2 km',
      address: '456 Second Ave, Tashkent',
      phone: '+998 90 234 56 78',
      image: ''
    },
    {
      id: 3,
      name: 'Luxury Spa & Wellness',
      category: 'Spa',
      rating: 4.7,
      reviews: 180,
      price: '$$$',
      distance: '2.1 km',
      address: '789 Third St, Tashkent',
      phone: '+998 90 345 67 89',
      image: ''
    },
  ])

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter(f => f.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <span className="text-gray-600">{favorites.length} saved places</span>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">Start adding your favorite shops to easily find them later!</p>
            <Link 
              href="/discover"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Discover Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((shop) => (
              <div key={shop.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="flex">
                  <div className="w-40 h-40 bg-gray-200 flex-shrink-0"></div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/shop/${shop.id}`} className="font-bold text-lg hover:text-blue-600">
                        {shop.name}
                      </Link>
                      <button 
                        onClick={() => removeFavorite(shop.id)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold text-sm">{shop.rating}</span>
                      </div>
                      <span className="text-gray-600 text-sm">({shop.reviews})</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 text-sm">{shop.category}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 text-sm">{shop.price}</span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{shop.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{shop.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Link 
                        href={`/shop/${shop.id}`}
                        className="flex-1 text-center py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/book/${shop.id}`}
                        className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
