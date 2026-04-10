'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function StaffSchedule({ params }: { params: { id: string } }) {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const hours = Array.from({ length: 12 }, (_, i) => i + 9) // 9 AM to 8 PM
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const schedule = {
    Monday: [
      { start: 9, duration: 1, client: 'John Doe', service: 'Haircut' },
      { start: 11, duration: 1.5, client: 'Jane Smith', service: 'Coloring' },
      { start: 14, duration: 0.5, client: 'Bob Wilson', service: 'Trim' },
    ],
    Tuesday: [
      { start: 10, duration: 1, client: 'Alice Brown', service: 'Styling' },
      { start: 15, duration: 2, client: 'Charlie Davis', service: 'Treatment' },
    ],
    Wednesday: [],
    Thursday: [
      { start: 9, duration: 1, client: 'Diana Evans', service: 'Haircut' },
      { start: 12, duration: 1, client: 'Eve Foster', service: 'Styling' },
    ],
    Friday: [
      { start: 10, duration: 1.5, client: 'Frank Green', service: 'Coloring' },
      { start: 14, duration: 1, client: 'Grace Hill', service: 'Haircut' },
      { start: 16, duration: 1, client: 'Henry Irving', service: 'Trim' },
    ],
    Saturday: [
      { start: 9, duration: 1, client: 'Ivy Johnson', service: 'Styling' },
      { start: 11, duration: 2, client: 'Jack King', service: 'Treatment' },
      { start: 15, duration: 1, client: 'Kelly Lee', service: 'Haircut' },
    ],
    Sunday: [],
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Staff Schedule</h1>
          <p className="text-gray-600">Sarah Johnson - Senior Stylist</p>
        </div>

        {/* Week Navigator */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="text-lg font-bold">Week of January 20 - 26, 2026</p>
              <p className="text-sm text-gray-600">40 hours scheduled • 12 appointments</p>
            </div>
            <button 
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Working Hours Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-bold mb-4">Working Hours</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {days.map((day) => (
              <div key={day} className="border rounded-lg p-3">
                <p className="font-semibold text-sm mb-2">{day.slice(0, 3)}</p>
                <label className="flex items-center gap-2 mb-2 text-sm">
                  <input type="checkbox" defaultChecked={day !== 'Sunday'} />
                  <span>Working</span>
                </label>
                {day !== 'Sunday' && (
                  <div className="space-y-1 text-xs">
                    <input type="time" defaultValue="09:00" className="w-full border rounded px-2 py-1" />
                    <input type="time" defaultValue="18:00" className="w-full border rounded px-2 py-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Update Working Hours
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="font-semibold text-sm text-gray-600">Time</div>
              {days.map(day => (
                <div key={day} className="font-semibold text-sm text-center">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 gap-2 border-t">
                <div className="py-2 text-sm text-gray-600 font-medium">
                  {hour}:00
                </div>
                {days.map(day => {
                  const daySchedule = schedule[day as keyof typeof schedule] || []
                  const appointment = daySchedule.find(app => app.start === hour)
                  
                  return (
                    <div key={`${day}-${hour}`} className="min-h-[60px] border-l relative">
                      {appointment && (
                        <div 
                          className="absolute inset-x-1 bg-blue-100 border-l-4 border-blue-600 p-2 rounded"
                          style={{ 
                            height: `${appointment.duration * 60}px`,
                            zIndex: 10 
                          }}
                        >
                          <p className="text-xs font-semibold">{appointment.client}</p>
                          <p className="text-xs text-gray-600">{appointment.service}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Time Off Requests */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Time Off Requests</h3>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Request Time Off
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-semibold">Vacation</p>
                <p className="text-sm text-gray-600">Feb 10-15, 2026</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
