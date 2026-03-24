'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, X, Check, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MyBookings() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all')

  const bookings = [
    {
      id: 1,
      shopName: 'Elite Hair Salon',
      service: 'Haircut',
      staff: 'Sarah Johnson',
      date: '2026-01-25',
      time: '10:00 AM',
      duration: '30 min',
      price: 50000,
      status: 'upcoming',
      address: '123 Main Street, Tashkent'
    },
    {
      id: 2,
      shopName: 'Kings Barber Shop',
      service: 'Beard Trim',
      staff: 'Mike Davis',
      date: '2026-01-22',
      time: '2:00 PM',
      duration: '20 min',
      price: 30000,
      status: 'upcoming',
      address: '456 Second Ave, Tashkent'
    },
    {
      id: 3,
      shopName: 'Luxury Spa',
      service: 'Massage',
      staff: 'Emma Wilson',
      date: '2026-01-15',
      time: '4:00 PM',
      duration: '60 min',
      price: 200000,
      status: 'completed',
      address: '789 Third St, Tashkent'
    },
    {
      id: 4,
      shopName: 'Nail Art Studio',
      service: 'Manicure',
      staff: 'Lisa Brown',
      date: '2026-01-10',
      time: '11:00 AM',
      duration: '45 min',
      price: 80000,
      status: 'cancelled',
      address: '321 Fourth Rd, Tashkent'
    },
  ]

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter || (filter === 'past' && b.status === 'completed'))

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'upcoming': return <Clock className="w-4 h-4" />
      case 'completed': return <Check className="w-4 h-4" />
      case 'cancelled': return <X className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">Tarix</h1>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 md:p-3 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-min md:min-w-0">
            {[
              { key: 'all', label: 'Barchasi' },
              { key: 'upcoming', label: 'Kelasi' },
              { key: 'past', label: 'O\'tgan' },
              { key: 'cancelled', label: 'Bekor' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`py-2 px-3 md:py-3 md:px-4 rounded-lg font-semibold transition-colors text-sm md:text-base whitespace-nowrap md:flex-1 ${
                  filter === key 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 md:p-12 text-center">
              <Calendar className="w-12 md:w-16 h-12 md:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Buking topilmadi</h3>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-6">Hozircha {filter !== 'all' ? filter : ''} bukingyoki yo\'q.</p>
              <Link 
                href="/discover"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
              >
                Xizmatlarni ko\'rish
              </Link>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{booking.shopName}</h3>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-1">{booking.service} — {booking.staff}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1 whitespace-nowrap ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status === 'upcoming' && 'Kelasi'}
                      {booking.status === 'completed' && 'Tugatildi'}
                      {booking.status === 'cancelled' && 'Bekor'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2 min-w-0">
                      <Calendar className="w-4 md:w-5 h-4 md:h-5 text-gray-400 shrink-0" />
                      <span className="truncate">{new Date(booking.date).toLocaleDateString('uz-UZ')}</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock className="w-4 md:w-5 h-4 md:h-5 text-gray-400 shrink-0" />
                      <span className="truncate">{booking.time} ({booking.duration})</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 md:w-5 h-4 md:h-5 text-gray-400 shrink-0" />
                      <span className="truncate text-xs md:text-sm">{booking.address}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 md:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{booking.price.toLocaleString()} UZS</span>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      {booking.status === 'upcoming' && (
                        <>
                          <Link 
                            href={`/book/${booking.id}/reschedule`}
                            className="px-3 md:px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm md:text-base text-center"
                          >
                            O'zgartirish
                          </Link>
                          <button className="px-3 md:px-4 py-2 border border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm md:text-base">
                            Bekor qilish
                          </button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <>
                          <button className="px-3 md:px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm md:text-base text-center">
                            Sharh yozish
                          </button>
                          <Link 
                            href={`/book/${booking.id}`}
                            className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base text-center"
                          >
                            Qayta band
                          </Link>
                        </>
                      )}
                      <Link 
                        href={`/bookings/${booking.id}`}
                        className="px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm md:text-base text-center"
                      >
                        Tafsilot
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
