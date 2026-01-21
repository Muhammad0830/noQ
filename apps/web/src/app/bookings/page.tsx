'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, X, Check, AlertCircle } from 'lucide-react'

export default function MyBookings() {
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
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                filter === key 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">You don't have any {filter !== 'all' ? filter : ''} bookings yet.</p>
              <Link 
                href="/discover"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{booking.shopName}</h3>
                      <p className="text-gray-600">{booking.service} with {booking.staff}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>{booking.time} ({booking.duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-lg font-bold">{booking.price.toLocaleString()} UZS</span>
                    <div className="flex gap-2">
                      {booking.status === 'upcoming' && (
                        <>
                          <Link 
                            href={`/book/${booking.id}/reschedule`}
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                          >
                            Reschedule
                          </Link>
                          <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <>
                          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                            Write Review
                          </button>
                          <Link 
                            href={`/book/${booking.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Book Again
                          </Link>
                        </>
                      )}
                      <Link 
                        href={`/bookings/${booking.id}`}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        View Details
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
