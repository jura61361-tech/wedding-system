'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { formatCurrency, formatUSD, formatKHR, translateSide, formatDateShort } from '@/lib/utils';
import {
  Heart,
  Sparkles,
  Users,
  TrendingUp,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  Gift,
} from 'lucide-react';

export const HostDashboard: React.FC = () => {
  const { gifts, financialSummary, exchangeRate } = useWedding();
  const [soundEnabled, setSoundEnabled] = useState(false);

  const groom = process.env.NEXT_PUBLIC_GROOM_NAME || 'ពិសិដ្ឋ';
  const bride = process.env.NEXT_PUBLIC_BRIDE_NAME || 'ធីតា';

  // Only approved gifts for the Host view (per RLS policy & user requirements)
  const approvedGifts = gifts
    .filter((g) => g.status === 'approved')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Recent approved gifts stream
  const recentGifts = approvedGifts.slice(0, 10);

  // Side statistics percentages
  const totalApproved = approvedGifts.length || 1;
  const groomCount = approvedGifts.filter((g) => g.side === 'groom').length;
  const brideCount = approvedGifts.filter((g) => g.side === 'bride').length;
  const bothCount = approvedGifts.filter((g) => g.side === 'both').length;

  const groomPct = Math.round((groomCount / totalApproved) * 100);
  const bridePct = Math.round((brideCount / totalApproved) * 100);
  const bothPct = Math.round((bothCount / totalApproved) * 100);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Executive Stage Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 p-6 sm:p-8 text-white border-2 border-gold-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              ផ្ទាំងព័ត៌មានម្ចាស់ដើមការ (Host Live Dashboard)
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-khmer text-gold-200">
              មង្គលការ {groom} ❤️ {bride}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              ផ្សាយផ្ទាល់តាមពេលវេលាជាក់ស្ដែង (Live Real-Time Financial Overview)
            </p>
          </div>

          {/* Audio Chime & Live Pulse */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-stone-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>ផ្សាយផ្ទាល់ (Live Stream)</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-2xl border transition-colors ${
                soundEnabled
                  ? 'bg-gold-500 text-stone-950 border-gold-400'
                  : 'bg-white/10 text-stone-400 border-white/10 hover:text-white'
              }`}
              title={soundEnabled ? 'បិទសំឡេងជួង' : 'បើកសំឡេងជួងពេលមានចំណងដៃ'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Approved USD */}
        <div className="p-6 rounded-3xl bg-white border border-gold-200/80 shadow-gold">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              សរុបប្រាក់ដុល្លារ (Total USD)
            </span>
            <div className="w-8 h-8 rounded-xl bg-gold-100 flex items-center justify-center text-gold-700">
              $
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gold-700 font-sans tracking-tight">
            {formatUSD(financialSummary.total_approved_usd)}
          </div>
          <div className="mt-2 text-xs text-stone-500 flex items-center gap-1 font-khmer">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>បានផ្ទៀងផ្ទាត់រួចរាល់</span>
          </div>
        </div>

        {/* Approved KHR */}
        <div className="p-6 rounded-3xl bg-white border border-gold-200/80 shadow-gold">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              សរុបប្រាក់រៀល (Total KHR)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              ៛
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-sans tracking-tight">
            {formatKHR(financialSummary.total_approved_khr)}
          </div>
          <div className="mt-2 text-xs text-stone-500 flex items-center gap-1 font-khmer">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>បានផ្ទៀងផ្ទាត់រួចរាល់</span>
          </div>
        </div>

        {/* Combined Estimated USD */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-gold-500 via-gold-400 to-amber-500 text-stone-950 shadow-gold-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              សរុបរួមប្រមាណ (~ USD)
            </span>
            <TrendingUp className="w-5 h-5 text-stone-900" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
            ~{formatUSD(financialSummary.approx_total_usd)}
          </div>
          <div className="mt-2 text-xs font-medium text-stone-900">
            ប្តូរតាមអត្រា 1$ = {exchangeRate} ៛
          </div>
        </div>

        {/* Verified Guests Count */}
        <div className="p-6 rounded-3xl bg-stone-900 text-white shadow-xl border border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              ចំនួនភ្ញៀវបានកត់ (Guests)
            </span>
            <Users className="w-5 h-5 text-gold-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gold-300 font-sans">
            {financialSummary.approved_count} នាក់
          </div>
          <div className="mt-2 text-xs text-stone-400 font-khmer">
            សរុបស្រោមសំបុត្រដែលបានផ្ទៀងផ្ទាត់
          </div>
        </div>
      </div>

      {/* 3. Side Breakdown & Live Celebration Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Wedding Side Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-gold-200/80 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 font-khmer flex items-center gap-2">
            <Users className="w-4 h-4 text-gold-600" />
            ការបែងចែកតាមភាគី (Side Distribution)
          </h2>

          <div className="space-y-3">
            {/* Groom Side */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-700 font-khmer">ខាងកូនកំលោះ (Groom)</span>
                <span className="text-stone-900 font-bold font-sans">
                  {groomCount} នាក់ ({groomPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 rounded-full transition-all duration-500"
                  style={{ width: `${groomPct}%` }}
                />
              </div>
            </div>

            {/* Bride Side */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-700 font-khmer">ខាងកូនក្រមុំ (Bride)</span>
                <span className="text-stone-900 font-bold font-sans">
                  {brideCount} នាក់ ({bridePct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-crimson-600 rounded-full transition-all duration-500"
                  style={{ width: `${bridePct}%` }}
                />
              </div>
            </div>

            {/* Both Sides */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-700 font-khmer">ទាំងសងខាង (Both)</span>
                <span className="text-stone-900 font-bold font-sans">
                  {bothCount} នាក់ ({bothPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${bothPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 text-xs text-stone-500">
            ទិន្នន័យនេះជួយឱ្យក្រុមគ្រួសារ និងម្ចាស់ដើមការដឹងពីតុល្យភាពភ្ញៀវចូលរួមជាក់ស្ដែង។
          </div>
        </div>

        {/* Right Col: Real-time Wish & Gift Stream */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gold-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 font-khmer flex items-center gap-2">
              <Gift className="w-4 h-4 text-gold-600" />
              ចរន្តចំណងដៃ & ពាក្យជូនពរចុងក្រោយ (Live Gift Stream)
            </h2>
            <span className="text-xs text-stone-500">
              {approvedGifts.length} កំណត់ត្រា
            </span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {recentGifts.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs font-khmer">
                មិនទាន់មានចំណងដៃដែលបានផ្ទៀងផ្ទាត់នៅឡើយទេ
              </div>
            ) : (
              recentGifts.map((gift) => (
                <div
                  key={gift.id}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-gold-300 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center text-gold-800 font-bold text-xs flex-shrink-0">
                      <Heart className="w-4 h-4 fill-gold-600 text-gold-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-xs font-khmer">
                          {gift.guest_name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-khmer">
                          {translateSide(gift.side, 'km')}
                        </span>
                      </div>
                      {gift.wishes && (
                        <p className="text-[11px] text-stone-600 italic mt-0.5 font-khmer">
                          &ldquo;{gift.wishes}&rdquo;
                        </p>
                      )}
                      <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDateShort(gift.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-extrabold text-stone-900 text-sm font-sans">
                      {formatCurrency(gift.amount, gift.currency)}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      {gift.payment_method}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
