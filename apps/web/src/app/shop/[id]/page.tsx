'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, MapPin, Clock, Phone, Globe, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ShopProfile({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('services')
  const [isFavorite, setIsFavorite] = useState(false)

  const services = [
    { id: 1, name: 'Haircut', duration: '30 min', price: 50000 },
    { id: 2, name: 'Hair Coloring', duration: '90 min', price: 150000 },
    { id: 3, name: 'Styling', duration: '45 min', price: 70000 },
    { id: 4, name: 'Beard Trim', duration: '20 min', price: 30000 },
    { id: 5, name: 'Hair Treatment', duration: '60 min', price: 100000 },
  ]

  const staff = [
    { id: 1, name: 'Sarah Johnson', role: 'Senior Stylist', rating: 4.9, experience: '8 years' },
    { id: 2, name: 'Mike Davis', role: 'Master Barber', rating: 4.8, experience: '6 years' },
    { id: 3, name: 'Emma Wilson', role: 'Colorist', rating: 4.9, experience: '5 years' },
  ]

  const reviews = [
    { id: 1, author: 'John Doe', rating: 5, date: '2 days ago', text: 'Excellent service! Very professional and friendly staff.' },
    { id: 2, author: 'Jane Smith', rating: 5, date: '1 week ago', text: 'Amazing haircut! Will definitely come back.' },
    { id: 3, author: 'Bob Wilson', rating: 4, date: '2 weeks ago', text: 'Good service, clean place. Slightly expensive but worth it.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-96 bg-gray-300">
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button className="p-2 bg-white/80 rounded-full hover:bg-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="p-2 bg-white/80 rounded-full hover:bg-white">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-white rounded-full hover:bg-gray-100"
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button className="p-2 bg-white rounded-full hover:bg-gray-100">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold mb-2">Elite Hair Salon</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold text-lg">4.9</span>
                </div>
                <span className="text-gray-600">(320 reviews)</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Hair Salon</span>
              </div>

              <div className="space-y-3 mb-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>123 Main Street, Downtown, Tashkent</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>Open now • Mon-Sun: 9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>+998 90 123 45 67</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a href="#" className="text-blue-600 hover:underline">www.elitesalon.uz</a>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Welcome to Elite Hair Salon, where style meets excellence. Our team of experienced professionals 
                is dedicated to providing you with the best hair care and styling services. We use only premium 
                products and the latest techniques to ensure you leave looking and feeling your best.
              </p>

              {/* Tabs */}
              <div className="border-b mb-6">
                <div className="flex gap-8">
                  {['services', 'staff', 'reviews', 'gallery'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 font-semibold capitalize ${
                        activeTab === tab 
                          ? 'border-b-2 border-blue-600 text-blue-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-gray-600">{service.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{service.price.toLocaleString()} UZS</p>
                        <Link 
                          href={`/book/${params.id}?service=${service.id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Book now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'staff' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <p className="text-gray-600 text-sm">{member.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-semibold">{member.rating}</span>
                            </div>
                            <span className="text-gray-600 text-sm">• {member.experience}</span>
                          </div>
                          <Link 
                            href={`/book/${params.id}?staff=${member.id}`}
                            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                          >
                            Book with {member.name.split(' ')[0]}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{review.author}</h4>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  ))}
                  <button className="w-full py-3 border rounded-lg hover:bg-gray-50 font-semibold">
                    Load More Reviews
                  </button>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="font-bold text-xl mb-4">Book an Appointment</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Service</label>
                  <select className="w-full border rounded-lg px-4 py-2">
                    <option>Choose a service...</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - {s.price.toLocaleString()} UZS</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Staff</label>
                  <select className="w-full border rounded-lg px-4 py-2">
                    <option>Any available staff</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <input type="date" className="w-full border rounded-lg px-4 py-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                      <button key={time} className="border rounded-lg py-2 hover:border-blue-600 hover:bg-blue-50">
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Link 
                href={`/book/${params.id}`}
                className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-semibold"
              >
                Continue to Book
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
