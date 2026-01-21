'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, User, CreditCard, Check } from 'lucide-react'

export default function ScheduleAppointment({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState({
    service: '',
    staff: '',
    date: '',
    time: '',
    notes: ''
  })

  const services = [
    { id: 1, name: 'Haircut', duration: '30 min', price: 50000 },
    { id: 2, name: 'Hair Coloring', duration: '90 min', price: 150000 },
    { id: 3, name: 'Styling', duration: '45 min', price: 70000 },
  ]

  const staff = [
    { id: 1, name: 'Sarah Johnson', role: 'Senior Stylist' },
    { id: 2, name: 'Mike Davis', role: 'Master Barber' },
    { id: 3, name: 'Emma Wilson', role: 'Colorist' },
  ]

  const handleSubmit = () => {
    // Submit booking
    router.push('/bookings')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            {[
              { num: 1, label: 'Service & Staff', icon: User },
              { num: 2, label: 'Date & Time', icon: Calendar },
              { num: 3, label: 'Confirmation', icon: Check }
            ].map(({ num, label, icon: Icon }) => (
              <div key={num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > num ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-sm mt-2 ${step >= num ? 'font-semibold' : 'text-gray-500'}`}>
                    {label}
                  </span>
                </div>
                {num < 3 && (
                  <div className={`h-1 flex-1 ${step > num ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Select Service</h2>
                <div className="space-y-3">
                  {services.map((service) => (
                    <label key={service.id} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name="service" 
                          value={service.id}
                          onChange={(e) => setBooking({...booking, service: e.target.value})}
                          className="w-4 h-4"
                        />
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-gray-600 text-sm">{service.duration}</p>
                        </div>
                      </div>
                      <span className="font-bold">{service.price.toLocaleString()} UZS</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Select Staff (Optional)</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="staff" 
                      value="any"
                      onChange={(e) => setBooking({...booking, staff: e.target.value})}
                      className="w-4 h-4"
                      defaultChecked
                    />
                    <div>
                      <h3 className="font-semibold">Any Available Staff</h3>
                      <p className="text-gray-600 text-sm">First available professional</p>
                    </div>
                  </label>
                  {staff.map((member) => (
                    <label key={member.id} className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="staff" 
                        value={member.id}
                        onChange={(e) => setBooking({...booking, staff: e.target.value})}
                        className="w-4 h-4"
                      />
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-gray-600 text-sm">{member.role}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Select Date</h2>
                <input 
                  type="date" 
                  className="w-full border rounded-lg px-4 py-3"
                  value={booking.date}
                  onChange={(e) => setBooking({...booking, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Select Time</h2>
                <div className="grid grid-cols-4 gap-3">
                  {['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
                    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map(time => (
                    <button
                      key={time}
                      onClick={() => setBooking({...booking, time})}
                      className={`py-3 border rounded-lg hover:border-blue-600 hover:bg-blue-50 ${
                        booking.time === time ? 'border-blue-600 bg-blue-50 font-semibold' : ''
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Additional Notes (Optional)</h2>
                <textarea 
                  className="w-full border rounded-lg px-4 py-3 h-32"
                  placeholder="Any special requests or notes for the salon..."
                  value={booking.notes}
                  onChange={(e) => setBooking({...booking, notes: e.target.value})}
                ></textarea>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Confirm Your Booking</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shop:</span>
                  <span className="font-semibold">Elite Hair Salon</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold">Haircut</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Staff:</span>
                  <span className="font-semibold">Sarah Johnson</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{booking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{booking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">30 minutes</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">50,000 UZS</span>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-bold mb-4">Cancellation Policy</h3>
                <p className="text-gray-600 text-sm">
                  Free cancellation up to 24 hours before your appointment. 
                  Cancellations within 24 hours may incur a 50% fee.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !booking.service}
                className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
