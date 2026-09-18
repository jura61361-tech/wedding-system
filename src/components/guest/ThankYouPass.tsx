'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WeddingGift } from '@/types/wedding';
import { formatCurrency, translateSide, translateStatus, formatDateKhmer } from '@/lib/utils';
import { CheckCircle2, Heart, QrCode, Sparkles, ArrowLeft, Share2 } from 'lucide-react';

interface ThankYouPassProps {
  gift: WeddingGift;
  onReset: () => void;
}

export const ThankYouPass: React.FC<ThankYouPassProps> = ({ gift, onReset }) => {
  useEffect(() => {
    // Fire confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f3e5ab', '#8b0000', '#ee3f3f', '#ffffff'],
      });
    } catch {
      // Ignored if canvas-confetti is not loaded
    }
  }, []);

  const groom = process.env.NEXT_PUBLIC_GROOM_NAME || 'ពិសិដ្ឋ';
  const bride = process.env.NEXT_PUBLIC_BRIDE_NAME || 'ធីតា';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ប័ណ្ណថ្លែងអំណរគុណ - មង្គលការ ${groom} & ${bride}`,
          text: `ខ្ញុំបានជូនចំណងដៃចំនួន ${formatCurrency(gift.amount, gift.currency)} ជូនគូស្វាមីភរិយាថ្មី!`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 animate-fadeIn">
      {/* Luxury Digital Pass Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-gold-400 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white shadow-2xl">
        {/* Golden ribbon top header */}
        <div className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 px-6 py-4 text-center text-stone-950">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-extrabold text-stone-900 mb-0.5">
            <Sparkles className="w-4 h-4 text-stone-900" />
            ប័ណ្ណថ្លែងអំណរគុណចំណងដៃ
          </div>
          <h2 className="text-xl font-bold font-khmer">
            {groom} ❤️ {bride}
          </h2>
        </div>

        {/* Card Body */}
        <div className="p-6 text-center space-y-6">
          {/* Heart icon badge */}
          <div className="relative mx-auto w-16 h-16 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center">
            <Heart className="w-8 h-8 text-gold-400 fill-gold-400 animate-bounce" />
          </div>

          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">
              សូមអរគុណយ៉ាងជ្រាលជ្រៅចំពោះ
            </span>
            <h3 className="text-2xl font-bold text-gold-300 font-khmer">
              {gift.guest_name}
            </h3>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-gold-500/10 text-gold-300 border border-gold-500/30">
              {translateSide(gift.side, 'km')} ({translateSide(gift.side, 'en')})
            </span>
          </div>

          {/* Amount Badge */}
          <div className="rounded-2xl bg-white/5 border border-gold-500/30 p-4">
            <span className="text-xs text-stone-400 block mb-1 font-khmer">
              ចំនួនទឹកប្រាក់ចំណងដៃ (Gift Amount)
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-gold-400 tracking-tight font-sans">
              {formatCurrency(gift.amount, gift.currency)}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-stone-300">
              <span>វិធីបង់ប្រាក់:</span>
              <span className="font-semibold text-white bg-stone-800 px-2 py-0.5 rounded border border-stone-700">
                {gift.payment_method}
              </span>
            </div>
          </div>

          {/* Wishes */}
          {gift.wishes && (
            <div className="rounded-xl bg-stone-800/60 p-3.5 text-stone-300 text-xs sm:text-sm italic font-khmer border border-stone-700/50">
              &ldquo;{gift.wishes}&rdquo;
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center justify-between border-t border-stone-800 pt-4 text-xs">
            <div className="text-left">
              <span className="text-stone-400 block text-[11px]">ស្ថានភាពផ្ទៀងផ្ទាត់:</span>
              <span
                className={`inline-flex items-center gap-1 font-semibold mt-0.5 ${
                  gift.status === 'approved'
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {translateStatus(gift.status, 'km')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block text-[11px]">កាលបរិច្ឆេទ:</span>
              <span className="text-stone-300 text-[11px]">
                {formatDateKhmer(gift.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            កត់ត្រាបន្ថែមទៀត
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 text-xs font-bold transition-colors shadow-gold"
          >
            <Share2 className="w-4 h-4" />
            ចែករំលែក
          </button>
        </div>
      </div>
    </div>
  );
};
