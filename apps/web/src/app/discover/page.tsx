'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Star, Filter, Heart } from 'lucide-react'

export default function DiscoverServices() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const shops = [
    { id: 1, name: 'Elite Hair Salon', rating: 4.9, reviews: 320, category: 'Hair Salon', price: '$$', distance: '0.5 km' },
    { id: 2, name: 'Kings Barber Shop', rating: 4.8, reviews: 250, category: 'Barbershop', price: '$', distance: '1.2 km' },
    { id: 3, name: 'Luxury Spa & Wellness', rating: 4.7, reviews: 180, category: 'Spa', price: '$$$', distance: '2.1 km' },
    { id: 4, name: 'Nail Art Studio', rating: 4.9, reviews: 410, category: 'Nail Salon', price: '$$', distance: '0.8 km' },
    { id: 5, name: 'Beauty Lounge', rating: 4.6, reviews: 150, category: 'Beauty', price: '$$', distance: '1.5 km' },
    { id: 6, name: 'Modern Cuts', rating: 4.8, reviews: 290, category: 'Hair Salon', price: '$', distance: '0.3 km' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1 flex items-center gap-2 border rounded-lg px-4 py-2">
              <Search className="text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search services or shops..." 
                className="w-full outline-none"
              />
            </div>
            <div className="flex items-center gap-2 border rounded-lg px-4 py-2 min-w-[200px]">
              <MapPin className="text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Location" 
                className="w-full outline-none"
              />
            </div>
            <button className="flex items-center gap-2 border rounded-lg px-6 py-2 hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {['All', 'Hair Salon', 'Barbershop', 'Nail Salon', 'Spa & Massage', 'Beauty Treatments'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked={cat === 'All'} />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>

              <h3 className="font-bold text-lg mb-4 mt-6">Price Range</h3>
              <div className="space-y-2">
                {['$', '$$', '$$$', '$$$$'].map((price) => (
                  <label key={price} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>{price}</span>
                  </label>
                ))}
              </div>

              <h3 className="font-bold text-lg mb-4 mt-6">Rating</h3>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>{rating}+ stars</span>
                  </label>
                ))}
              </div>

              <h3 className="font-bold text-lg mb-4 mt-6">Distance</h3>
              <input type="range" min="0" max="10" className="w-full" />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>0 km</span>
                <span>10 km</span>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{shops.length} Services Found</h1>
              <select className="border rounded-lg px-4 py-2">
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
                <div key={shop.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4 p-4">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/shop/${shop.id}`} className="text-xl font-bold hover:text-blue-600">
                            {shop.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="font-semibold">{shop.rating}</span>
                            </div>
                            <span className="text-gray-600">({shop.reviews} reviews)</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{shop.category}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{shop.price}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleFavorite(shop.id)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <Heart 
                            className={`w-6 h-6 ${favorites.includes(shop.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                          />
                        </button>
                      </div>
                      
                      <p className="text-gray-600 mt-2">
                        Professional hair cutting, styling, coloring, and beauty services. Experienced staff with modern equipment.
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {shop.distance}
                        </span>
                        <span>Open now • Closes at 9:00 PM</span>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link 
                          href={`/shop/${shop.id}`}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          View Details
                        </Link>
                        <Link 
                          href={`/book/${shop.id}`}
                          className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                        >
                          Book Now
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
  )
}
