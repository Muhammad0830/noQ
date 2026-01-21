import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                N
              </div>
              <span className="text-xl font-bold text-white">NoQ</span>
            </div>
            <p className="text-sm mb-4">
              Your trusted platform for booking beauty and wellness services. 
              Find and book the best salons, spas, and professionals near you.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/discover" className="hover:text-white">Discover Services</Link></li>
              <li><Link href="/bookings" className="hover:text-white">My Bookings</Link></li>
              <li><Link href="/favorites" className="hover:text-white">Favorites</Link></li>
              <li><Link href="/profile" className="hover:text-white">My Profile</Link></li>
              <li><Link href="/settings" className="hover:text-white">Settings</Link></li>
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h3 className="text-white font-bold mb-4">For Business</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/business/register" className="hover:text-white">List Your Business</Link></li>
              <li><Link href="/admin" className="hover:text-white">Business Dashboard</Link></li>
              <li><Link href="/business/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/business/resources" className="hover:text-white">Resources</Link></li>
              <li><Link href="/business/support" className="hover:text-white">Business Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+998 90 123 45 67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@noq.uz</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Tashkent, Uzbekistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; 2026 NoQ. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              <Link href="/help" className="hover:text-white">Help Center</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
