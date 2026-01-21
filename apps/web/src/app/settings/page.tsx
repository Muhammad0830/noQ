'use client'

import { useState } from 'react'
import { Bell, Moon, Globe, Lock, CreditCard, MapPin, HelpCircle, Shield, Smartphone } from 'lucide-react'

export default function AppSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    promotionalEmails: false,
    darkMode: false,
    language: 'en',
    currency: 'UZS',
    autoLocation: true
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotifications}
                    onChange={() => toggleSetting('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Push Notifications</p>
                  <p className="text-sm text-gray-600">Get alerts on your device</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.pushNotifications}
                    onChange={() => toggleSetting('pushNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Receive text messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.smsNotifications}
                    onChange={() => toggleSetting('smsNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Booking Reminders</p>
                  <p className="text-sm text-gray-600">Reminders before appointments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.bookingReminders}
                    onChange={() => toggleSetting('bookingReminders')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Promotional Emails</p>
                  <p className="text-sm text-gray-600">Special offers and deals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.promotionalEmails}
                    onChange={() => toggleSetting('promotionalEmails')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Appearance</h2>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Dark Mode</p>
                <p className="text-sm text-gray-600">Use dark theme</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.darkMode}
                  onChange={() => toggleSetting('darkMode')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Language & Region</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select 
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="en">English</option>
                  <option value="uz">O'zbekcha</option>
                  <option value="ru">Русский</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select 
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="UZS">UZS (Uzbek Som)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Location</h2>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Auto-detect Location</p>
                <p className="text-sm text-gray-600">Use GPS to find nearby services</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.autoLocation}
                  onChange={() => toggleSetting('autoLocation')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Account & Security */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Account & Security</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold">Change Password</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold">Two-Factor Authentication</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold">Payment Methods</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Support</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <span className="font-semibold">Help Center</span>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <span className="font-semibold">Contact Us</span>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <span className="font-semibold">Privacy Policy</span>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <span className="font-semibold">Terms of Service</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-2">App Version</h3>
            <p className="text-gray-600">v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
