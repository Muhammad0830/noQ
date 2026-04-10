'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  History,
  User,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activePatterns: string[];
}

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems: NavItem[] = [
    {
      href: '/user',
      label: t('bottomNav.home'),
      icon: <Home className="w-6 h-6" />,
      activePatterns: ['^/user$', '^/user/home'],
    },
    {
      href: '/user/discover',
      label: t('bottomNav.search'),
      icon: <Search className="w-6 h-6" />,
      activePatterns: ['^/user/discover'],
    },
    {
      href: '/user/bookings',
      label: t('bottomNav.history'),
      icon: <History className="w-6 h-6" />,
      activePatterns: ['^/user/bookings'],
    },
    {
      href: '/user/profile',
      label: t('bottomNav.profile'),
      icon: <User className="w-6 h-6" />,
      activePatterns: ['^/user/profile', '^/user/settings'],
    },
  ];

  const isActive = (patterns: string[]) => {
    return patterns.some((pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(pathname);
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 md:hidden">
      <div className="flex h-16">
        {navItems.map((item) => {
          const active = isActive(item.activePatterns);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 transition-colors ${
                active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className={active ? 'text-blue-600 dark:text-blue-400' : ''}>
                {item.icon}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
