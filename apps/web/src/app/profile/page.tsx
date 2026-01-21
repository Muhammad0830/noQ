'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Camera, Lock, Bell, CreditCard } from 'lucide-react'

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+998 90 123 45 67',
    birthdate: '1990-01-15',
    address: 'Tashkent, Uzbekistan',
    bio: 'Love trying new salons and styles!'
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto"></div>
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Member since Jan 2026</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>12 bookings completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
              <h3 className="font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorites</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reviews Written</span>
                  <span className="font-semibold">10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Personal Information</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-5 h-5 text-gray-400" />
                      <span>{profile.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                  {isEditing ? (
                    <input 
                      type="date" 
                      value={profile.birthdate}
                      onChange={(e) => setProfile({...profile, birthdate: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{new Date(profile.birthdate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea 
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 h-24"
                    />
                  ) : (
                    <p className="text-gray-700">{profile.bio}</p>
                  )}
                </div>

                {isEditing && (
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                    Save Changes
                  </button>
                )}
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Security Settings</h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-semibold">Change Password</p>
                      <p className="text-sm text-gray-600">Update your password regularly</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-semibold">Notification Preferences</p>
                      <p className="text-sm text-gray-600">Manage email and push notifications</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-red-200">
              <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
              <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
