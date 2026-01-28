'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Heart, 
  Share2, 
  ChevronLeft,
  Calendar as CalendarIcon,
  User,
  Scissors
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShopDetailPageProps {
  params: { id: string };
}

export default function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('services');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock data - barbershop oriented
  const shop = {
    id: params.id,
    name: 'Classic Barbershop',
    category: 'Barbershop',
    rating: 4.9,
    reviewCount: 245,
    address: 'Amir Temur ko\'chasi, 15, Toshkent',
    phone: '+998 90 123 45 67',
    isOpen: true,
    openTime: '09:00',
    closeTime: '21:00',
    description: 'Professional erkaklar sartaroshxonasi. Klassik va zamonaviy soch turmagi, soqol olish va parvarish. Tajribali ustalar va premium mahsulotlar.',
  };

  const services = [
    { id: 1, name: 'Klassik soch olish', duration: 30, price: 50000, description: 'Professional soch kesish xizmati' },
    { id: 2, name: 'Zamonaviy soch turmagi', duration: 45, price: 80000, description: 'Trendi stillar va dizayn' },
    { id: 3, name: 'Soqol olish', duration: 20, price: 30000, description: 'Klassik ustara bilan soqol olish' },
    { id: 4, name: 'Soqol parvarish', duration: 30, price: 40000, description: 'Soqol shakllantirish va parvarish' },
    { id: 5, name: 'Soch + Soqol', duration: 50, price: 70000, description: 'To\'liq xizmat paketi' },
    { id: 6, name: 'Bola soch kesish', duration: 25, price: 40000, description: '12 yoshgacha bolalar uchun' },
  ];

  const staff = [
    { id: 1, name: 'Aziz Sharipov', role: 'Bosh usta', rating: 4.9, experience: 12 },
    { id: 2, name: 'Bekzod Karimov', role: 'Usta sartarosh', rating: 4.8, experience: 8 },
    { id: 3, name: 'Davron Aliyev', role: 'Sartarosh', rating: 4.7, experience: 5 },
  ];

  const reviews = [
    { id: 1, author: 'Sardor', rating: 5, date: '2 kun oldin', text: 'Juda professional xizmat! Aziz usta zo\'r!' },
    { id: 2, author: 'Jahongir', rating: 5, date: '1 hafta oldin', text: 'Eng yaxshi sartaroshxona shaharda!' },
    { id: 3, author: 'Bobur', rating: 4, date: '2 hafta oldin', text: 'Yaxshi xizmat, toza joy. Tavsiya qilaman' },
  ];

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleBooking = (service: any) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ${t('currency.som')}`;
  };

  const formatDate = (date: Date) => {
    const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan'];
    return `${days[date.getDay()]}, ${date.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>{t('nav.home')}</span>
          </Link>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <div className="relative h-80 sm:h-96 bg-linear-to-r from-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`} />
          </button>
          <button className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors">
            <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Scissors className="w-24 h-24 text-white/20" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shop Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {shop.name}
                  </h1>
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                    {shop.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{shop.rating}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  ({shop.reviewCount} {t('common.reviews')})
                </span>
                <span 
                  className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                    shop.isOpen 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}
                >
                  {shop.isOpen ? t('shop.openNow') : t('shop.closed')}
                </span>
              </div>

              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <span>{shop.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                  <span>{shop.openTime} - {shop.closeTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                  <a href={`tel:${shop.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {shop.phone}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('shop.about')}</h3>
                <p className="text-gray-600 dark:text-gray-400">{shop.description}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex overflow-x-auto">
                  {[
                    { id: 'services', label: t('shop.services') },
                    { id: 'staff', label: t('shop.staff') },
                    { id: 'reviews', label: t('shop.reviews') }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Services Tab */}
                {activeTab === 'services' && (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div 
                        key={service.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                              {service.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{service.duration} {t('services.duration')}</span>
                              </div>
                              <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                {formatPrice(service.price)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBooking(service)}
                            className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg shrink-0"
                          >
                            {t('shop.bookNow')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Staff Tab */}
                {activeTab === 'staff' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {staff.map((member) => (
                      <div 
                        key={member.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                              {member.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {member.role}
                            </p>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {member.rating}
                                </span>
                              </div>
                              <span className="text-gray-600 dark:text-gray-400">
                                {member.experience} {t('shop.years')} {t('shop.experience')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div 
                        key={review.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {review.author}
                            </h4>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('booking.title')}
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full px-6 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span>{t('shop.bookNow')}</span>
                </button>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('shop.schedule')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Dushanba-Yakshanba</span>
                      <span className="font-medium">{shop.openTime} - {shop.closeTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('booking.title')}
              </h2>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedService(null);
                  setSelectedStaff(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  1. {t('shop.selectService')}
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        selectedService?.id === service.id
                          ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {service.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {service.duration} {t('services.duration')}
                          </p>
                        </div>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Staff Selection */}
              {selectedService && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    2. {t('shop.selectStaff')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {staff.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => setSelectedStaff(member)}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          selectedStaff?.id === member.id
                            ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {member.name}
                            </h4>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {member.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Selection - CALENDAR */}
              {selectedStaff && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    3. {t('shop.selectDate')}
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {generateDates().map((date, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 border-2 rounded-xl transition-all ${
                          selectedDate?.toDateString() === date.toDateString()
                            ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(date)}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                            {date.getDate()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    4. {t('shop.selectTime')}
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {generateTimeSlots().map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 border-2 rounded-xl font-medium transition-all ${
                          selectedTime === time
                            ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 text-gray-900 dark:text-white'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary & Confirm */}
              {selectedTime && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>{t('booking.service')}:</span>
                      <span className="font-semibold">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>{t('booking.staff')}:</span>
                      <span className="font-semibold">{selectedStaff.name}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>{t('booking.date')}:</span>
                      <span className="font-semibold">
                        {selectedDate?.toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>{t('booking.time')}:</span>
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span>{t('booking.total')}:</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {formatPrice(selectedService.price)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(t('booking.success'));
                      setShowBookingModal(false);
                    }}
                    className="w-full px-6 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
                  >
                    {t('booking.confirm')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
