"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Star,
  PlusCircle,
  Bell,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminDashboard() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const shopId = searchParams.get("shopId");

  const currentShopName = useMemo(() => {
    if (!user) return "Admin Panel";
    if (shopId) {
      const found = (user.shops || []).find((s: any) => s.id === shopId);
      return found
        ? found.name
        : user.shops && user.shops[0]
          ? user.shops[0].name
          : "Admin Panel";
    }
    return user.shops && user.shops[0] ? user.shops[0].name : "Admin Panel";
  }, [user, shopId]);

  // placeholder values; real values should come from API
  const revenue = "$1,240.00";
  const bookingsCount = 42;

  const today = new Date()
  const [now, setNow] = useState<Date>(() => new Date())
  const { locale, t, language } = useLanguage()
  const monthNames: Record<string, string[]> = {
    'uz-latn': ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktyabr','Noyabr','Dekabr'],
    'uz-cyrl': ['Январ','Феврал','Март','Апрел','Май','Июн','Июл','Август','Сентябр','Октябр','Ноябр','Декабр'],
    ru: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
  }
  const weekdayShort: Record<string, string[]> = {
    'uz-latn': ['YAK','DUSH','SESH','CHOR','PAY','JUM','SHA'],
    'uz-cyrl': ['ЯКШ','ДУШ','СЕШ','ЧОР','ПАЙ','ЖУМ','ШАН'],
    ru: ['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'],
  }
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth())
  const [monthOpen, setMonthOpen] = useState(false)
  const monthDropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!monthOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!monthDropdownRef.current) return
      if (!monthDropdownRef.current.contains(event.target as Node)) {
        setMonthOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMonthOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [monthOpen])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => window.clearInterval(timer)
  }, [])

  const weekDates = useMemo(() => {
    const res: Date[] = []
    const year = today.getFullYear()
    const start = selectedMonth === today.getMonth() ? new Date(today) : new Date(year, selectedMonth, 1)
    start.setHours(0, 0, 0, 0)
    const endOfMonth = new Date(year, selectedMonth + 1, 0)
    const cursor = new Date(start)
    while (cursor <= endOfMonth) {
      res.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    return res
  }, [today.toDateString(), selectedMonth])

  const headerWeekday = (weekdayShort[language]?.[today.getDay()] ?? today.toLocaleDateString(locale || undefined, { weekday: 'long' })).toUpperCase()
  const headerMonthDay = `${monthNames[language]?.[today.getMonth()] ?? today.toLocaleDateString(locale || undefined, { month: 'long' })} ${today.getDate()}`.toUpperCase()
  const currentTimeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <div className="bg-gray-50 pb-24">
      {/* Header pill with avatar and actions (sticky top) */}
      <div className="sticky top-0 z-40 w-full">
        <div className="w-full p-3 flex items-center justify-between border-b md:bg-white md:shadow-sm bg-orange-50">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 sm:h-10 sm:w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
              {(currentShopName || "A")
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="text-base font-semibold">{currentShopName}</div>
              <div className="text-xs text-orange-400 uppercase font-semibold">
                Admin Panel
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-9 w-9 rounded-full bg-white border shadow flex items-center justify-center text-gray-600">
              <Bell className="w-4 h-4" />
            </button>
            <button className="h-9 w-9 rounded-full bg-white border shadow flex items-center justify-center text-gray-600">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-5">
        {/* Top cards + actions (match mock) */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="relative bg-white rounded-3xl p-5 shadow-lg flex flex-col overflow-visible">
              <div className="absolute top-3 right-3 h-10 w-10 rounded-full bg-orange-400 flex items-center justify-center text-white shadow-sm z-10">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-start">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold mt-2">{revenue}</p>
                  <div className="text-xs text-green-600 mt-3">+12.5% today</div>
                </div>
              </div>
            </div>

            <div className="relative bg-white rounded-3xl p-5 shadow-lg flex flex-col overflow-visible">
              <div className="absolute top-3 right-3 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm z-10">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-start">
                <div>
                  <p className="text-sm text-gray-500">Bookings</p>
                  <p className="text-2xl font-bold mt-2">{bookingsCount}</p>
                  <div className="text-xs text-orange-400 mt-3">8 slots remaining</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3 md:ml-4 w-full">
            <button
              onClick={() => router.push("/admin/bookings/new")}
              className="flex-1 flex items-center justify-center gap-3 bg-orange-400 text-white px-4 py-3 rounded-full shadow-lg"
            >
              <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <PlusCircle className="w-4 h-4 text-orange-400" />
              </span>
              <span className="font-semibold text-sm uppercase">New Appointment</span>
            </button>

            <Link
              href="/admin/staff"
              className="flex-1 flex items-center justify-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-full shadow"
            >
              <span className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-400" />
              </span>
              <span className="font-semibold text-sm uppercase">Staff (4)</span>
            </Link>
          </div>
        </div>

        {/* Schedule + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">{t('booking.timeline')}</h2>
                <div className="text-sm text-gray-500 uppercase mt-1">{headerWeekday}, {headerMonthDay}</div>
              </div>
              <div className="flex items-center gap-3 relative">
                <div ref={monthDropdownRef} className="relative">
                  <button onClick={() => setMonthOpen((s)=>!s)} className="text-sm px-3 py-2 border rounded-full flex items-center gap-2">
                    <span className="text-sm text-orange-400">{(monthNames[language] || monthNames['uz-latn'])[selectedMonth]}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {monthOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
                      <div className="max-h-44 overflow-y-auto">
                        {(monthNames[language] || monthNames['uz-latn']).map((m, idx) => (
                          <button
                            key={m}
                            onClick={() => { setSelectedMonth(idx); setMonthOpen(false) }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${idx === selectedMonth ? 'bg-orange-50' : ''}`}
                          >
                            <div className={`text-sm font-bold ${idx === selectedMonth ? 'text-orange-500' : 'text-gray-700'}`}>{m}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date strip */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {weekDates.map((d) => {
                const isToday = d.toDateString() === today.toDateString()
                const shortDay = (weekdayShort[language]?.[d.getDay()] ?? d.toLocaleDateString(locale || undefined, { weekday: 'short' })).toUpperCase()
                const dayNum = d.getDate()
                return (
                  <div key={d.toDateString()} className={`flex flex-col items-center justify-center ${isToday ? 'py-5 px-6' : 'py-3 px-4'} rounded-2xl min-w-16 ${isToday ? 'bg-orange-400 text-white shadow-lg' : 'bg-gray-100 text-gray-700'}`}>
                    <div className="text-xs opacity-80">{shortDay}</div>
                    <div className={`font-semibold ${isToday ? 'text-xl' : ''}`}>{dayNum}</div>
                    {isToday && <div className="mt-2 h-1 w-1 rounded-full bg-white" />}
                  </div>
                )
              })}
            </div>

            {/* Timeline area (time and schedule are separated) */}
            <div className="max-h-130 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="space-y-4">
                {/* row 1 */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-2 pt-2 text-xs font-semibold text-gray-500">09:00</div>

                  <div className="col-span-10 relative pl-6">
                    <span className="absolute left-2 top-0 bottom-0 w-px bg-gray-300" />
                    <span className="absolute left-2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-gray-300 bg-white" />

                    <div className="rounded-2xl border border-gray-300 bg-gray-50/60 px-4 py-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <p className="text-2xl font-bold leading-none text-gray-900">John Doe</p>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold tracking-wide text-orange-500">CONFIRMED</span>
                      </div>
                      <p className="text-sm text-gray-400">Classic Haircut · 45m</p>
                      <div className="my-3 h-px bg-gray-300" />
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="h-5 w-5 rounded-full bg-linear-to-br from-orange-100 via-teal-100 to-teal-500 shadow-inner" />
                        <span>Stylist: <span className="font-semibold text-gray-700">Alex M.</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* current time row */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-2 pt-1">
                    <span className="inline-flex rounded-full bg-orange-400 px-3 py-0.5 text-[10px] font-bold text-white">{currentTimeLabel}</span>
                  </div>

                  <div className="col-span-10 relative h-7 pl-6">
                    <span className="absolute left-2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400 ring-4 ring-orange-100" />
                    <span className="absolute left-2 right-0 top-1/2 h-px -translate-y-1/2 bg-orange-300" />
                  </div>
                </div>

                {/* row 2 */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-2 pt-2 text-xs font-semibold text-orange-500">10:30</div>

                  <div className="col-span-10 relative pl-6">
                    <span className="absolute left-2 top-0 bottom-0 w-px bg-gray-300" />
                    <span className="absolute left-2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-orange-300 bg-white" />

                    <div className="rounded-2xl border-2 border-emerald-500 bg-gray-50/60 px-4 py-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <p className="text-2xl font-bold leading-none text-gray-900">Sarah Smith</p>
                        <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold tracking-wide text-white">ACTIVE</span>
                      </div>
                      <p className="text-sm text-gray-400">Full Coloring · 2h 30m</p>
                      <div className="my-3 h-px bg-gray-300" />
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="h-5 w-5 rounded-full bg-linear-to-br from-cyan-100 via-teal-200 to-teal-700 shadow-inner" />
                        <span>Stylist: <span className="font-semibold text-gray-700">Julia R.</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* row 3 */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-2 pt-2 text-xs font-semibold text-gray-500">11:45</div>

                  <div className="col-span-10 relative pl-6">
                    <span className="absolute left-2 top-0 bottom-0 w-px bg-gray-300" />
                    <span className="absolute left-2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-gray-300 bg-white" />

                    <div className="rounded-2xl border border-gray-300 bg-gray-50/60 px-4 py-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <p className="text-2xl font-bold leading-none text-gray-900">Michael Brown</p>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold tracking-wide text-orange-500">PENDING</span>
                      </div>
                      <p className="text-sm text-gray-400">Beard Trim & Shape · 30m</p>
                      <div className="my-3 h-px bg-gray-300" />
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="h-5 w-5 rounded-full bg-linear-to-br from-orange-100 via-orange-300 to-orange-500 shadow-inner" />
                        <span>Stylist: <span className="font-semibold text-gray-700">Alex M.</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
