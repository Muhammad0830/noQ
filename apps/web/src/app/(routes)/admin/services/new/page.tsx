'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, DollarSign, Tag, Image as ImageIcon } from 'lucide-react'

export default function AddNewService() {
  const router = useRouter()
  const [service, setService] = useState({
    name: '',
    description: '',
    category: '',
    duration: '',
    price: '',
    image: ''
  })

  const categories = [
    'Haircut & Styling',
    'Hair Coloring',
    'Hair Treatment',
    'Beard Services',
    'Nails',
    'Spa & Massage',
    'Makeup',
    'Skincare',
    'Other'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save service
    router.push('/admin/services')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-2">
            ← Back to Services
          </button>
          <h1 className="text-3xl font-bold">Add New Service</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Service Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Service Image</label>
            <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-blue-400 cursor-pointer">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Service Name *</label>
            <input
              type="text"
              required
              value={service.name}
              onChange={(e) => setService({...service, name: e.target.value})}
              placeholder="e.g., Men's Haircut"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              required
              value={service.category}
              onChange={(e) => setService({...service, category: e.target.value})}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              required
              value={service.description}
              onChange={(e) => setService({...service, description: e.target.value})}
              placeholder="Describe what's included in this service..."
              rows={4}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes) *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  required
                  value={service.duration}
                  onChange={(e) => setService({...service, duration: e.target.value})}
                  placeholder="30"
                  className="w-full border rounded-lg pl-10 pr-4 py-3"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price (UZS) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  required
                  value={service.price}
                  onChange={(e) => setService({...service, price: e.target.value})}
                  placeholder="50000"
                  className="w-full border rounded-lg pl-10 pr-4 py-3"
                />
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-lg mb-4">Additional Options</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Featured Service</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Available for online booking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Require deposit</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
