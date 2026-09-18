'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { useWedding } from '@/context/WeddingContext';
import {
  QrCode,
  Tv,
  ShieldCheck,
  Heart,
  HardDriveDownload,
  WifiOff,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  FileSpreadsheet,
} from 'lucide-react';
import { formatUSD, formatKHR } from '@/lib/utils';

export default function HomePage() {
  const { financialSummary, userRole, setUserRole } = useWedding();

  const groom = process.env.NEXT_PUBLIC_GROOM_NAME || 'ពិសិដ្ឋ';
  const bride = process.env.NEXT_PUBLIC_BRIDE_NAME || 'ធីតា';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-100/90 border border-gold-300 text-gold-900 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4 text-gold-600" />
            ប្រព័ន្ធកត់ចំណងដៃអាពាហ៍ពិពាហ៍ទំនើប (Digital Wedding Gift Tracking)
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight font-khmer">
            សិរីសួស្តី អាពាហ៍ពិពាហ៍ <br />
            <span className="gold-text-gradient font-serif">
              {groom} & {bride}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-khmer">
            ប្រព័ន្ធគ្រប់គ្រង និងកត់ត្រាចំណងដៃកម្រិតខ្ពស់ មានសុវត្ថិភាពទ្វេដង
            (Dual-Layer Persistence) ការពារការបាត់បង់ទិន្នន័យ អាចប្រើប្រាស់ក្រៅបណ្ដាញ (Offline
            IndexedDB) និងរៀបចំសម្រាប់ដាក់ពង្រាយលើ Vercel។
          </p>

          {/* Quick Metrics pill */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-gold-200/90 shadow-gold text-xs sm:text-sm font-semibold text-stone-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>សរុបបច្ចុប្បន្ន:</span>
            </span>
            <span className="font-extrabold text-gold-700 font-sans">
              {formatUSD(financialSummary.total_approved_usd)}
            </span>
            <span className="text-stone-300">|</span>
            <span className="font-extrabold text-emerald-700 font-sans">
              {formatKHR(financialSummary.total_approved_khr)}
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-600">
              {financialSummary.approved_count} ស្រោមផ្ទៀងផ្ទាត់រួច
            </span>
          </div>
        </section>

        {/* 3 Main Role Portals */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Guest Portal */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white border border-gold-200 shadow-gold hover:shadow-gold-lg transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gold-500 to-amber-200 flex items-center justify-center text-stone-950 shadow-gold group-hover:scale-105 transition-transform">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="inline-block text-[11px] font-bold text-gold-700 uppercase tracking-wider">
                សម្រាប់ភ្ញៀវកិត្តិយស (Guest Portal)
              </div>
              <h2 className="text-xl font-bold text-stone-900 font-khmer">
                ស្កេន QR & ជូនចំណងដៃ
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed font-khmer">
                ទំព័របញ្ជូនចំណងដៃសម្រាប់ទូរស័ព្ទដៃ មិនបាច់ Login អាចទូទាត់តាម ABA KHQR, Bakong
                ឬសាច់ប្រាក់ ភ្ជាប់រូបភាពបង្កាន់ដៃ និងទទួលប័ណ្ណថ្លែងអំណរគុណឌីជីថលភ្លាមៗ។
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/gift"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 text-xs font-bold shadow-gold transition-colors font-khmer"
              >
                <span>ចូលទៅកាន់ទំព័រភ្ញៀវ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Host Live Dashboard */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-stone-900 to-stone-950 text-white border border-gold-500/40 shadow-2xl hover:border-gold-400 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 group-hover:scale-105 transition-transform">
                <Tv className="w-7 h-7" />
              </div>
              <div className="inline-block text-[11px] font-bold text-gold-400 uppercase tracking-wider">
                សម្រាប់ម្ចាស់ដើមការ (Host VIP)
              </div>
              <h2 className="text-xl font-bold text-white font-khmer">
                ផ្ទាំងផ្សាយផ្ទាល់ (Live Stream)
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed font-khmer">
                ផ្ទាំងមើលបន្តផ្ទាល់សម្រាប់កូនកំលោះ កូនក្រមុំ និងមាតាបិតា បង្ហាញតួលេខសរុបជាដុល្លារ
                និងរៀល ចំនួនភ្ញៀវ ការបែងចែកភាគី និងចរន្តពាក្យជូនពរជាក់ស្ដែង។
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/host"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-gold-300 border border-gold-400/30 text-xs font-bold transition-colors font-khmer"
              >
                <span>បើកផ្ទាំងផ្សាយផ្ទាល់</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Admin Reception Desk */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white border border-gold-200 shadow-gold hover:shadow-gold-lg transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-stone-900 to-stone-700 flex items-center justify-center text-gold-400 shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="inline-block text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                សម្រាប់តុទទួលភ្ញៀវ (Admin Reception)
              </div>
              <h2 className="text-xl font-bold text-stone-900 font-khmer">
                គ្រប់គ្រង & ផ្ទៀងផ្ទាត់ចំណងដៃ
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed font-khmer">
                កត់ត្រាស្រោមសំបុត្រផ្ទាល់រហ័ស ពិនិត្យរូបភាពបង្កាន់ដៃ (Approve/Reject) ទាញយក
                Excel (.xlsx) បោះពុម្ពបញ្ជី និងទាញយក Hard Backup (.json) ការពារបាត់បង់។
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/admin"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-gold-300 text-xs font-bold transition-colors font-khmer"
              >
                <span>ចូលតុទទួលភ្ញៀវ (Admin)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights: Dual-Layer Persistence & Security */}
        <section className="rounded-3xl bg-white p-6 sm:p-8 border border-gold-200/80 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-khmer">
              យុទ្ធសាស្ត្រការពារសុវត្ថិភាព និងទិន្នន័យ (Enterprise Resilience)
            </h2>
            <p className="text-xs text-stone-500">
              រចនាឡើងពិសេសសម្រាប់កម្មវិធីមង្គលការនៅកម្ពុជា ដែលទាមទារភាពរហ័ស និងគ្មានការបាត់បង់ទិន្នន័យ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-gold-100 text-gold-800 flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 font-khmer">Cloud Layer (Supabase)</h3>
              <p className="text-stone-600 text-[11px] leading-relaxed font-khmer">
                PostgreSQL RLS រឹងមាំ Anon អាច Submit បានតែ `pending` ចំណែក Admin មានសិទ្ធិពេញលេញ។
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <WifiOff className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 font-khmer">Offline Caching (IndexedDB)</h3>
              <p className="text-stone-600 text-[11px] leading-relaxed font-khmer">
                ទោះបីជាសាលមង្គលការដាច់ Internet ក៏ដោយ ក៏ការកត់ត្រានៅតែដំណើរការ និង Sync ដោយស្វ័យប្រវត្តិ។
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <HardDriveDownload className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 font-khmer">1-Click JSON Hard Backup</h3>
              <p className="text-stone-600 text-[11px] leading-relaxed font-khmer">
                Admin អាចទាញយក file `.json` ពេញលេញរក្សាទុកលើ Hard Drive ឬ Flash Drive គ្រប់ពេលវេលា។
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 font-khmer">Excel & Print PDF Ledger</h3>
              <p className="text-stone-600 text-[11px] leading-relaxed font-khmer">
                Export ជា spreadsheet `.xlsx` មានរូបមន្តសរុប និង print ledger ស្អាតសម្រាប់ចាស់ទុំផ្ទៀងផ្ទាត់។
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gold-200/60 bg-white/70 py-6 text-center text-xs text-stone-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-khmer">
          <p>© 2026 មង្គលការ {groom} & {bride}. រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
          <p className="text-stone-400">
            Powered by Next.js 14, Supabase, IndexedDB & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
