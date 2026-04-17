'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Bell, CalendarDays, Star } from 'lucide-react'

const tabs = ['This Week', 'Last 30 Days', 'Annual']

const popularServices = [
  { name: 'Classic Haircut', bookings: 86, width: 86 },
  { name: 'Beard Sculpting', bookings: 42, width: 42 },
  { name: 'Luxury Shave', bookings: 16, width: 16 },
]

const peakHours = [
  { hour: '08:00', value: 34 },
  { hour: '', value: 62 },
  { hour: '', value: 78 },
  { hour: '', value: 66 },
  { hour: '14:00', value: 92, active: true },
  { hour: '', value: 84 },
  { hour: '', value: 58 },
  { hour: '', value: 66 },
  { hour: '', value: 74 },
  { hour: '', value: 60 },
  { hour: '', value: 45 },
  { hour: '20:00', value: 30 },
]

const weeklyRevenue = [42, 58, 50, 72, 18, 84, 66]

function MetricCard({
  icon,
  label,
  value,
  change,
  changeClassName,
}: {
  icon: ReactNode
  label: string
  value: string
  change: string
  changeClassName: string
}) {
  return (
    <div className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff2df] text-[#f3a137]">
          {icon}
        </div>
        <span className={`text-[11px] font-semibold ${changeClassName}`}>{change}</span>
      </div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c2c2c2]">
        {label}
      </p>
      <p className="text-[30px] font-bold tracking-tight text-[#111111]">{value}</p>
    </div>
  )
}

function RevenueChart() {
  const { path, area } = useMemo(() => {
    const width = 320
    const height = 160
    const paddingX = 18
    const paddingY = 18
    const points = weeklyRevenue.map((value, index) => {
      const x = paddingX + (index * (width - paddingX * 2)) / (weeklyRevenue.length - 1)
      const y = height - paddingY - (value / 100) * (height - paddingY * 2)
      return { x, y }
    })

    const line = points.map((point) => `${point.x},${point.y}`).join(' ')
    const fill = `${points.map((point) => `${point.x},${point.y}`).join(' ')} ${width - paddingX},${height - paddingY} ${paddingX},${height - paddingY}`

    return { path: line, area: fill, points }
  }, [])

  const dot = useMemo(() => {
    const width = 320
    const height = 160
    const paddingX = 18
    const paddingY = 18
    const index = 5
    const x = paddingX + (index * (width - paddingX * 2)) / (weeklyRevenue.length - 1)
    const y = height - paddingY - (weeklyRevenue[index] / 100) * (height - paddingY * 2)
    return { x, y }
  }, [])

  return (
    <div className="rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
      <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-[#111111]">
        <span className="h-2 w-2 rounded-full bg-[#f39c33]" />
        Daily Revenue Trends
      </div>

      <div className="relative overflow-hidden rounded-4xl bg-linear-to-b from-[#fff8ef] to-[#fffdf8] px-2 py-4">
        <svg viewBox="0 0 320 180" className="h-47.5 w-full overflow-visible">
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7a03a" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#f7a03a" stopOpacity="0.02" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#f39c33" floodOpacity="0.18" />
            </filter>
          </defs>

          <path
            d={`M ${area} Z`}
            fill="url(#revenueFill)"
          />

          <polyline
            points={path}
            fill="none"
            stroke="#f39c33"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadow)"
          />

          <circle cx={dot.x} cy={dot.y} r="5" fill="#f39c33" stroke="#fff" strokeWidth="4" />

          <g transform={`translate(${dot.x - 22}, ${dot.y - 34})`}>
            <rect x="0" y="0" width="64" height="22" rx="11" fill="#f39c33" />
            <polygon points="28,22 34,22 31,28" fill="#f39c33" />
            <text x="32" y="15" textAnchor="middle" className="fill-white text-[10px] font-semibold">
              SAT $840
            </text>
          </g>
        </svg>

        <div className="-mt-2 grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8b8b8b]">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <span key={day} className={index === 5 ? 'text-[#f39c33]' : ''}>
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ShopAnalytics() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="min-h-screen bg-[#f5f4f2] px-4 py-4 pb-8 text-[#111111]">
      <div className="mx-auto flex w-full max-w-107.5 flex-col gap-4">
        <header className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-full bg-[url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80')] bg-cover bg-center shadow-sm" />
            <div>
              <p className="text-[16px] font-bold leading-tight text-[#111111]">The Loft Studio</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#f39c33]">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1f1f1f] shadow-[0_10px_24px_rgba(15,17,21,0.06)]"
          >
            <Bell className="h-4 w-4" />
          </button>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold transition ${
                activeTab === index
                  ? 'bg-[#f39c33] text-white shadow-[0_10px_24px_rgba(243,156,51,0.32)]'
                  : 'bg-white text-[#7b7b7b] shadow-[0_10px_24px_rgba(15,17,21,0.05)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#bdbdbd]">
              Total Revenue
            </p>
            <span className="rounded-full bg-[#fff1df] px-2.5 py-1 text-[10px] font-semibold text-[#f39c33]">
              +12.4%
            </span>
          </div>

          <div className="flex items-end gap-2">
            <h2 className="text-[42px] font-bold leading-none tracking-tight text-[#111111]">
              $4,250.00
            </h2>
            <span className="pb-1 text-[12px] font-semibold text-[#9a9a9a]">USD</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={<CalendarDays className="h-4 w-4" />}
            label="Bookings"
            value="142"
            change="+8%"
            changeClassName="text-[#5d8dff]"
          />

          <MetricCard
            icon={<Star className="h-4 w-4 fill-[#f39c33] text-[#f39c33]" />}
            label="Rating"
            value="4.9"
            change="+0.2"
            changeClassName="text-[#f39c33]"
          />
        </div>

        <RevenueChart />

        <section className="rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
          <h3 className="mb-4 text-[13px] font-bold uppercase tracking-[0.28em] text-[#111111]">
            Most Popular Services
          </h3>

          <div className="space-y-4">
            {popularServices.map((service) => (
              <div key={service.name}>
                <div className="mb-2 flex items-center justify-between gap-3 text-[12px]">
                  <div className="font-medium text-[#1a1a1a]">{service.name}</div>
                  <div className="text-[#8f8f8f]">{service.bookings} bookings</div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#f1e3d0]">
                  <div
                    className="h-full rounded-full bg-[#f4a341]"
                    style={{ width: `${service.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.28em] text-[#111111]">
              Peak Hours
            </h3>
            <div className="flex gap-1.5 text-[#f39c33]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f39c33]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#f7c57f]" />
            </div>
          </div>

          <div className="mb-3 flex items-end gap-1.5">
            {peakHours.map((slot) => (
              <div
                key={`${slot.hour}-${slot.value}`}
                className={`flex-1 rounded-md ${slot.active ? 'bg-[#f39c33]' : 'bg-[#f8c877]'}`}
                style={{ height: `${slot.value}px` }}
              />
            ))}
          </div>

          <div className="flex justify-between text-[10px] font-semibold text-[#7d7d7d]">
            {peakHours.map((slot, index) => (
              <span key={`${slot.hour}-${index}`} className={slot.hour ? 'min-w-7' : 'min-w-4'}>
                {slot.hour}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
