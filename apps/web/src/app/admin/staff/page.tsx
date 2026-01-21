'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Star, Clock } from 'lucide-react'

export default function ManageStaff() {
  const [search, setSearch] = useState('')

  const staff = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Stylist',
      email: 'sarah@salon.com',
      phone: '+998 90 123 45 67',
      rating: 4.9,
      bookings: 145,
      specialties: ['Haircut', 'Styling', 'Treatment'],
      status: 'active',
      avatar: ''
    },
    {
      id: 2,
      name: 'Mike Davis',
      role: 'Master Barber',
      email: 'mike@salon.com',
      phone: '+998 90 234 56 78',
      rating: 4.8,
      bookings: 128,
      specialties: ['Haircut', 'Beard Trim', 'Styling'],
      status: 'active',
      avatar: ''
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'Colorist',
      email: 'emma@salon.com',
      phone: '+998 90 345 67 89',
      rating: 4.9,
      bookings: 112,
      specialties: ['Hair Coloring', 'Highlights', 'Treatment'],
      status: 'active',
      avatar: ''
    },
    {
      id: 4,
      name: 'Lisa Brown',
      role: 'Nail Technician',
      email: 'lisa@salon.com',
      phone: '+998 90 456 78 90',
      rating: 4.7,
      bookings: 98,
      specialties: ['Manicure', 'Pedicure', 'Nail Art'],
      status: 'on-leave',
      avatar: ''
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Staff</h1>
            <p className="text-gray-600">{staff.length} team members</p>
          </div>
          <Link 
            href="/admin/staff/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Staff Member
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff by name, role, or specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-4 py-2"
              />
            </div>
            <select className="border rounded-lg px-4 py-2">
              <option>All Roles</option>
              <option>Stylist</option>
              <option>Barber</option>
              <option>Colorist</option>
              <option>Technician</option>
            </select>
            <select className="border rounded-lg px-4 py-2">
              <option>All Status</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div>
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">{member.rating}</span>
                        <span className="text-xs text-gray-500">({member.bookings})</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <p className="text-gray-600">{member.email}</p>
                  <p className="text-gray-600">{member.phone}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">SPECIALTIES</p>
                  <div className="flex flex-wrap gap-1">
                    {member.specialties.map((spec, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Link 
                    href={`/admin/staff/${member.id}/schedule`}
                    className="flex-1 flex items-center justify-center gap-1 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Clock className="w-4 h-4" />
                    Schedule
                  </Link>
                  <Link 
                    href={`/admin/staff/${member.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button className="p-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
