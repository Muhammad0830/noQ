'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart3, Calendar, DollarSign, Users, TrendingUp, Clock, Star, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Bookings', value: '156', change: '+12%', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Revenue', value: '15.2M UZS', change: '+8%', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Active Clients', value: '432', change: '+24%', icon: Users, color: 'bg-purple-500' },
    { label: 'Avg Rating', value: '4.8', change: '+0.2', icon: Star, color: 'bg-yellow-500' },
  ]

  const recentBookings = [
    { id: 1, client: 'John Doe', service: 'Haircut', staff: 'Sarah', time: '10:00 AM', status: 'confirmed' },
    { id: 2, client: 'Jane Smith', service: 'Coloring', staff: 'Mike', time: '11:30 AM', status: 'confirmed' },
    { id: 3, client: 'Bob Wilson', service: 'Styling', staff: 'Emma', time: '2:00 PM', status: 'pending' },
    { id: 4, client: 'Alice Brown', service: 'Treatment', staff: 'Sarah', time: '3:30 PM', status: 'confirmed' },
  ]

  const todaySchedule = [
    { time: '9:00 AM', staff: 'Sarah Johnson', client: 'John Doe', service: 'Haircut' },
    { time: '10:00 AM', staff: 'Mike Davis', client: 'Jane Smith', service: 'Beard Trim' },
    { time: '11:00 AM', staff: 'Emma Wilson', client: 'Bob Wilson', service: 'Coloring' },
    { time: '2:00 PM', staff: 'Sarah Johnson', client: 'Alice Brown', service: 'Treatment' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-4">
              <Link href="/admin/bookings" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Bookings
              </Link>
              <Link href="/admin/services" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Services
              </Link>
              <Link href="/admin/staff" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Staff
              </Link>
              <Link href="/admin/analytics" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Today's Schedule</h2>
                <Link href="/admin/schedule" className="text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {todaySchedule.map((appointment, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-semibold">{appointment.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{appointment.client}</p>
                      <p className="text-sm text-gray-600">{appointment.service} with {appointment.staff}</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-semibold">Client</th>
                      <th className="pb-3 font-semibold">Service</th>
                      <th className="pb-3 font-semibold">Staff</th>
                      <th className="pb-3 font-semibold">Time</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b last:border-0">
                        <td className="py-3">{booking.client}</td>
                        <td className="py-3">{booking.service}</td>
                        <td className="py-3">{booking.staff}</td>
                        <td className="py-3">{booking.time}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/admin/services/new" className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center">
                  Add New Service
                </Link>
                <Link href="/admin/staff/new" className="block w-full px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-center">
                  Add Staff Member
                </Link>
                <Link href="/admin/bookings/new" className="block w-full px-4 py-3 border rounded-lg hover:bg-gray-50 text-center">
                  Create Booking
                </Link>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Alerts</h2>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Pending Approval</p>
                    <p className="text-xs text-gray-600">3 new bookings need confirmation</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Staff Availability</p>
                    <p className="text-xs text-gray-600">Update schedule for next week</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Performance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Top Performers</h2>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Johnson', bookings: 45, rating: 4.9 },
                  { name: 'Mike Davis', bookings: 38, rating: 4.8 },
                  { name: 'Emma Wilson', bookings: 32, rating: 4.9 }
                ].map((staff, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{staff.name}</p>
                      <p className="text-xs text-gray-600">{staff.bookings} bookings</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{staff.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
