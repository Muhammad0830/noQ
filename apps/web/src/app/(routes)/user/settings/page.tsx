'use client'

import { useState } from 'react'
import { Bell, Moon, Globe, Lock, CreditCard, MapPin, HelpCircle, Shield, Smartphone } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AppSettings() {
  const { t } = useLanguage()
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
        <h1 className="text-3xl font-bold mb-8">{t('settings.title')}</h1>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">{t('settings.notifications')}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{t('settings.emailNotifications')}</p>
                  <p className="text-sm text-gray-600">{t('settings.emailNotificationsDesc')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotifications}
                    onChange={() => toggleSetting('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{t('settings.pushNotifications')}</p>
                  <p className="text-sm text-gray-600">{t('settings.pushNotificationsDesc')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.pushNotifications}
                    onChange={() => toggleSetting('pushNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{t('settings.smsNotifications')}</p>
                  <p className="text-sm text-gray-600">{t('settings.smsNotificationsDesc')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.smsNotifications}
                    onChange={() => toggleSetting('smsNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{t('settings.bookingReminders')}</p>
                  <p className="text-sm text-gray-600">{t('settings.bookingRemindersDesc')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.bookingReminders}
                    onChange={() => toggleSetting('bookingReminders')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{t('settings.promotionalEmails')}</p>
                  <p className="text-sm text-gray-600">{t('settings.promotionalEmailsDesc')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.promotionalEmails}
                    onChange={() => toggleSetting('promotionalEmails')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">{t('settings.appearance')}</h2>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{t('settings.darkMode')}</p>
                <p className="text-sm text-gray-600">{t('settings.darkModeDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.darkMode}
                  onChange={() => toggleSetting('darkMode')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">{t('settings.languageRegion')}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('settings.language')}</label>
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
                <label className="block text-sm font-medium mb-2">{t('settings.currency')}</label>
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
              <h2 className="text-xl font-bold">{t('settings.location')}</h2>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{t('settings.autoLocation')}</p>
                <p className="text-sm text-gray-600">{t('settings.autoLocationDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.autoLocation}
                  onChange={() => toggleSetting('autoLocation')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Account & Security */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">{t('settings.accountSecurity')}</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold">{t('settings.changePassword')}</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold">{t('settings.twoFactor')}</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold">{t('settings.paymentMethods')}</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">{t('settings.support')}</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <span className="font-semibold">{t('settings.helpCenter')}</span>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <span className="font-semibold">{t('settings.contactUs')}</span>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <span className="font-semibold">{t('settings.privacyPolicy')}</span>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <span className="font-semibold">{t('settings.termsOfService')}</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-2">{t('settings.appVersion')}</h3>
            <p className="text-gray-600">v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
