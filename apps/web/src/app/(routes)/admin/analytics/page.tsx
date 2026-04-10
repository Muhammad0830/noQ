'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Star } from 'lucide-react'

export default function ShopAnalytics() {
  const [period, setPeriod] = useState('month')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shop Analytics</h1>
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  period === p 
                    ? 'bg-blue-600 text-white' 
                    : 'border hover:bg-gray-50'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 p-3 rounded-lg text-white">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-green-600 text-sm font-semibold">+12.5%</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">15.2M UZS</p>
            <p className="text-xs text-gray-500 mt-1">vs last month: 13.5M</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 p-3 rounded-lg text-white">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-green-600 text-sm font-semibold">+8.2%</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold">1,248</p>
            <p className="text-xs text-gray-500 mt-1">vs last month: 1,154</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 p-3 rounded-lg text-white">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-green-600 text-sm font-semibold">+15.3%</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">New Clients</p>
            <p className="text-3xl font-bold">86</p>
            <p className="text-xs text-gray-500 mt-1">vs last month: 75</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500 p-3 rounded-lg text-white">
                <Star className="w-6 h-6" />
              </div>
              <span className="text-green-600 text-sm font-semibold">+0.2</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Average Rating</p>
            <p className="text-3xl font-bold">4.8</p>
            <p className="text-xs text-gray-500 mt-1">from 245 reviews</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-end justify-around gap-2">
              {[65, 45, 75, 55, 85, 70, 90, 80, 95, 85, 100, 90].map((height, idx) => (
                <div key={idx} className="flex-1 bg-blue-200 rounded-t hover:bg-blue-400 cursor-pointer" style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          {/* Bookings Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Bookings by Service</h3>
            <div className="space-y-4">
              {[
                { name: 'Haircut', value: 45, color: 'bg-blue-500' },
                { name: 'Coloring', value: 25, color: 'bg-purple-500' },
                { name: 'Styling', value: 15, color: 'bg-green-500' },
                { name: 'Treatment', value: 10, color: 'bg-yellow-500' },
                { name: 'Other', value: 5, color: 'bg-gray-500' }
              ].map((service) => (
                <div key={service.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-gray-600">{service.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${service.color} h-2 rounded-full`} style={{ width: `${service.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Top Services</h3>
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm">
                  <th className="pb-3">Service</th>
                  <th className="pb-3 text-right">Bookings</th>
                  <th className="pb-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Haircut', bookings: 562, revenue: '28.1M' },
                  { name: 'Hair Coloring', bookings: 312, revenue: '46.8M' },
                  { name: 'Styling', bookings: 187, revenue: '13.1M' },
                  { name: 'Treatment', bookings: 125, revenue: '12.5M' },
                  { name: 'Beard Trim', bookings: 62, revenue: '1.9M' }
                ].map((service, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="py-3 font-medium">{service.name}</td>
                    <td className="py-3 text-right text-gray-600">{service.bookings}</td>
                    <td className="py-3 text-right font-semibold">{service.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Staff */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Top Performers</h3>
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm">
                  <th className="pb-3">Staff</th>
                  <th className="pb-3 text-right">Bookings</th>
                  <th className="pb-3 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Sarah Johnson', bookings: 145, rating: 4.9 },
                  { name: 'Mike Davis', bookings: 128, rating: 4.8 },
                  { name: 'Emma Wilson', bookings: 112, rating: 4.9 },
                  { name: 'Lisa Brown', bookings: 98, rating: 4.7 },
                  { name: 'Tom Anderson', bookings: 87, rating: 4.8 }
                ].map((staff, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="py-3 font-medium">{staff.name}</td>
                    <td className="py-3 text-right text-gray-600">{staff.bookings}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{staff.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold mb-2">Peak Hours</h4>
            <p className="text-2xl font-bold mb-1">2:00 PM - 5:00 PM</p>
            <p className="text-sm text-gray-600">45% of daily bookings</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold mb-2">Avg. Booking Value</h4>
            <p className="text-2xl font-bold mb-1">95,000 UZS</p>
            <p className="text-sm text-green-600">+5.2% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold mb-2">Client Retention</h4>
            <p className="text-2xl font-bold mb-1">78%</p>
            <p className="text-sm text-green-600">+3% from last month</p>
          </div>
        </div>
      </div>
    </div>
  )
}
