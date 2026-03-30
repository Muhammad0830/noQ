"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Lock,
  Bell,
  CreditCard,
  Globe,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import type { Language } from "@shared/types/types";

export default function UserProfile() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    birthdate: "1990-01-15",
    address: "Tashkent, Uzbekistan",
    bio: "Love trying new salons and styles!",
  });

  useEffect(() => {
    if (!user) return;

    setProfile((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
      phone: user.phoneNumber || "",
    }));
  }, [user]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  const languages: { code: Language; label: string }[] = [
    { code: "uz-latn", label: "O'zbekcha" },
    { code: "uz-cyrl", label: "Ўзбекча" },
    { code: "ru", label: "Русский" },
  ];

  const activeLanguageLabel =
    languages.find((item) => item.code === language)?.label || "Language";

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        name: profile.name,
        phoneNumber: profile.phone,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-5 flex flex-wrap items-center justify-end gap-3">
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Change language"
            >
              <Globe className="h-4 w-4" />
              <span className="max-w-24 truncate sm:max-w-none">
                {activeLanguageLabel}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        language === lang.code
                          ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          </button>
        </div>

        <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900 dark:ring-1 dark:ring-gray-800">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="mx-auto h-32 w-32 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold mb-1">
                  {profile.name || "User"}
                </h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {profile.email || "-"}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Member since Jan 2026</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <CreditCard className="w-4 h-4" />
                    <span>12 bookings completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900 dark:ring-1 dark:ring-gray-800">
              <h3 className="font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Bookings
                  </span>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Favorites
                  </span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Reviews Written
                  </span>
                  <span className="font-semibold">10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900 dark:ring-1 dark:ring-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span>{profile.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span>{profile.phone || "-"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Birth Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profile.birthdate}
                      onChange={(e) =>
                        setProfile({ ...profile, birthdate: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span>
                        {new Date(profile.birthdate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className="h-24 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-200">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            </div>

            {/* Security Settings */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900 dark:ring-1 dark:ring-gray-800">
              <h2 className="text-xl font-bold mb-6">Security Settings</h2>
              <div className="space-y-4">
                <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <div className="text-left">
                      <p className="font-semibold">Change Password</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Update your password regularly
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500">→</span>
                </button>

                <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <div className="text-left">
                      <p className="font-semibold">Notification Preferences</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage email and push notifications
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500">→</span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-lg border-2 border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-gray-900 dark:ring-1 dark:ring-gray-800">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Danger Zone
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
