'use client';

import React, { useState } from 'react';
import { WeddingGift } from '@/types/wedding';
import { formatCurrency, translateSide, formatDateKhmer } from '@/lib/utils';
import {
  X,
  CheckCircle,
  XCircle,
  ExternalLink,
  Calendar,
  Phone,
  User,
  Heart,
  FileText,
} from 'lucide-react';

interface PendingReviewModalProps {
  gift: WeddingGift | null;
  onClose: () => void;
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
}

export const PendingReviewModal: React.FC<PendingReviewModalProps> = ({
  gift,
  onClose,
  onApprove,
  onReject,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!gift) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(gift.id);
    setIsProcessing(false);
    onClose();
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(gift.id);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-gold-300 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 px-6 py-4 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider block">
              ការផ្ទៀងផ្ទាត់ចំណងដៃ (Gift Verification)
            </span>
            <h2 className="text-base font-bold font-khmer">
              {gift.guest_name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Amount Badge */}
          <div className="rounded-2xl bg-gold-50 border border-gold-300 p-4 text-center">
            <span className="text-xs text-stone-600 block mb-1">
              ចំនួនទឹកប្រាក់ដែលភ្ញៀវបានបញ្ជូន (Declared Amount)
            </span>
            <div className="text-3xl font-extrabold text-gold-800 font-sans">
              {formatCurrency(gift.amount, gift.currency)}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-white font-semibold text-stone-800 border border-gold-200">
                {gift.payment_method}
              </span>
              <span className="px-2 py-0.5 rounded bg-gold-200/60 font-semibold text-gold-900">
                {translateSide(gift.side, 'km')}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500 block mb-0.5">លេខទូរស័ព្ទ (Phone):</span>
              <span className="font-semibold text-stone-800">{gift.guest_phone || 'មិនមាន'}</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500 block mb-0.5">កាលបរិច្ឆេទ (Submitted):</span>
              <span className="font-semibold text-stone-800">{formatDateKhmer(gift.created_at)}</span>
            </div>
          </div>

          {/* Wishes */}
          {gift.wishes && (
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-500 block mb-1 font-semibold">
                ពាក្យជូនពរ (Wishes):
              </span>
              <p className="text-stone-800 italic font-khmer">&ldquo;{gift.wishes}&rdquo;</p>
            </div>
          )}

          {/* Receipt Screenshot Preview */}
          <div>
            <span className="text-xs font-bold text-stone-800 block mb-1.5 font-khmer">
              រូបភាពបង្កាន់ដៃ (Receipt Screenshot):
            </span>
            {gift.receipt_url ? (
              <div className="rounded-2xl border-2 border-stone-200 overflow-hidden bg-stone-900 group relative">
                <img
                  src={gift.receipt_url}
                  alt="Receipt"
                  className="w-full max-h-72 object-contain mx-auto"
                />
                <a
                  href={gift.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-stone-900/80 hover:bg-stone-900 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  ពង្រីក (Open Original)
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-stone-100 text-stone-500 text-center text-xs">
                ភ្ញៀវមិនបានភ្ជាប់រូបភាពបង្កាន់ដៃទេ (No receipt image attached)
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleReject}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-crimson-300 text-crimson-700 hover:bg-crimson-50 text-xs font-bold transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4 text-crimson-600" />
            បដិសេធ (Reject)
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleApprove}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            យល់ព្រមផ្ទៀងផ្ទាត់ (Approve Gift)
          </button>
        </div>
      </div>
    </div>
  );
};
