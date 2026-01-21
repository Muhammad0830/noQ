import Link from 'next/link'
import { Search, Bell, User, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              N
            </div>
            <span className="text-xl font-bold">NoQ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-blue-600 font-medium">Home</Link>
            <Link href="/discover" className="hover:text-blue-600 font-medium">Discover</Link>
            <Link href="/bookings" className="hover:text-blue-600 font-medium">My Bookings</Link>
            <Link href="/favorites" className="hover:text-blue-600 font-medium">Favorites</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 hover:bg-gray-100 rounded-lg font-medium">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Sign Up
              </Link>
            </div>

            {/* User Menu (when logged in) */}
            {/* <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="hidden md:block font-medium">John Doe</span>
            </Link> */}

            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
