'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWedding } from '@/context/WeddingContext';
import {
  Heart,
  ShieldCheck,
  Tv,
  QrCode,
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '@/types/wedding';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    isOnline,
    isLiveSupabase,
    userRole,
    setUserRole,
    offlineQueueCount,
    syncOfflineQueue,
  } = useWedding();

  const groom = process.env.NEXT_PUBLIC_GROOM_NAME || 'ពិសិដ្ឋ';
  const bride = process.env.NEXT_PUBLIC_BRIDE_NAME || 'ធីតា';

  const navLinks = [
    {
      href: '/gift',
      labelKm: 'ភ្ញៀវជូនចំណងដៃ',
      labelEn: 'Guest Form',
      icon: QrCode,
    },
    {
      href: '/host',
      labelKm: 'ម្ចាស់ដើមការ (Live)',
      labelEn: 'Host Dashboard',
      icon: Tv,
    },
    {
      href: '/admin',
      labelKm: 'តុទទួលភ្ញៀវ (Admin)',
      labelEn: 'Reception Desk',
      icon: ShieldCheck,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gold-200/60 bg-white/90 backdrop-blur-md shadow-sm no-print">
      {/* Top micro bar for system status & quick role switch */}
      <div className="bg-stone-900 text-stone-200 px-3 py-1 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Couple Announcement */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-medium text-gold-300">
              មង្គលការ {groom} & {bride}
            </span>
            <span className="text-stone-500 hidden sm:inline">|</span>
            <span className="text-stone-400 hidden sm:inline">Wedding Gift System</span>
          </div>

          {/* Status Badges & Switcher */}
          <div className="flex items-center gap-3">
            {/* Online/Offline Status */}
            <div className="flex items-center gap-1.5">
              {isOnline ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Wifi className="w-3 h-3" /> Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                  <WifiOff className="w-3 h-3" /> Offline (IndexedDB)
                </span>
              )}
            </div>

            {/* Offline Sync Queue Counter */}
            {offlineQueueCount > 0 && (
              <button
                onClick={() => syncOfflineQueue()}
                title="ចុចដើម្បីបញ្ជូនទិន្នន័យក្រៅបណ្ដាញ / Click to sync offline queue"
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[11px] transition-colors"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                {offlineQueueCount} មិនទាន់សមកាលកម្ម
              </button>
            )}

            {/* Supabase connection indicator */}
            <div className="hidden md:flex items-center gap-1 text-stone-400">
              <Database className="w-3 h-3 text-gold-400" />
              <span>{isLiveSupabase ? 'Supabase Cloud' : 'Local / Demo Mode'}</span>
            </div>

            {/* Fast Role Simulator for Presentation */}
            <div className="flex items-center gap-1 bg-stone-800 rounded p-0.5 border border-stone-700">
              <span className="text-[10px] text-stone-400 px-1 font-semibold uppercase">
                Role:
              </span>
              {(['admin', 'host', 'guest'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRole(r as UserRole | 'guest')}
                  className={`px-1.5 py-0.5 text-[11px] rounded transition-all capitalize font-medium ${
                    userRole === r
                      ? 'bg-gold-500 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-200 flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-crimson-800 fill-crimson-800 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-gold-700 transition-colors leading-tight">
                កត់ចំណងដៃអាពាហ៍ពិពាហ៍
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Wedding Gift Tracking & Ledger System
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gold-500 text-stone-950 shadow-gold font-bold'
                      : 'text-stone-700 hover:bg-gold-50 hover:text-gold-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-gold-600'}`} />
                  <span className="hidden md:inline">{item.labelKm}</span>
                  <span className="md:hidden">{item.labelEn}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
