'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { WeddingSide, CurrencyType, PaymentMethod } from '@/types/wedding';
import { X, DollarSign, PlusCircle, CheckCircle, User, Sparkles } from 'lucide-react';

interface QuickCashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCashModal: React.FC<QuickCashModalProps> = ({ isOpen, onClose }) => {
  const { addDirectCashGift } = useWedding();

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [side, setSide] = useState<WeddingSide>('both');
  const [amount, setAmount] = useState('50');
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [wishes, setWishes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!guestName.trim() || isNaN(num) || num <= 0) return;

    setIsSubmitting(true);
    const res = await addDirectCashGift({
      guest_name: guestName.trim(),
      guest_phone: guestPhone.trim() || null,
      side,
      amount: num,
      currency,
      payment_method: paymentMethod,
      wishes: wishes.trim() || null,
    });
    setIsSubmitting(false);

    if (res.success) {
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        // Reset and keep modal ready for next envelope or close
        setGuestName('');
        setGuestPhone('');
        setWishes('');
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gold-300 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-khmer">
                កត់ត្រាស្រោមសំបុត្រផ្ទាល់ (Direct Cash Entry)
              </h2>
              <p className="text-[11px] text-stone-400">
                បញ្ចូលរហ័សនៅតុទទួលភ្ញៀវ (ស្វ័យប្រវត្តិ Approved)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successToast && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>បានកត់ត្រាជោគជ័យ! (Recorded successfully)</span>
            </div>
          )}

          {/* Guest Name */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1 font-khmer">
              ឈ្មោះភ្ញៀវ (Guest Name) *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="ឧ. លោក សុខ ចិន្តា"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm bg-white"
            />
          </div>

          {/* Side Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1 font-khmer">
              ភ្ញៀវខាងណា? (Side)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'groom', label: 'ខាងកូនកំលោះ' },
                { id: 'bride', label: 'ខាងកូនក្រមុំ' },
                { id: 'both', label: 'ទាំងសងខាង' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSide(item.id as WeddingSide)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all font-khmer ${
                    side === item.id
                      ? 'bg-gold-500 border-gold-600 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 font-khmer">
                ចំនួនទឹកប្រាក់ (Amount) *
              </label>
              <input
                type="number"
                step={currency === 'USD' ? '1' : '1000'}
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-base font-bold text-stone-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 font-khmer">
                រូបិយប័ណ្ណ (Currency)
              </label>
              <div className="flex gap-2 h-10">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`flex-1 rounded-xl text-xs font-bold border transition-all ${
                    currency === 'USD'
                      ? 'bg-gold-500 border-gold-600 text-stone-950 shadow-sm'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('KHR')}
                  className={`flex-1 rounded-xl text-xs font-bold border transition-all ${
                    currency === 'KHR'
                      ? 'bg-gold-500 border-gold-600 text-stone-950 shadow-sm'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  KHR (៛)
                </button>
              </div>
            </div>
          </div>

          {/* Method & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 font-khmer">
                វិធីបង់ប្រាក់ (Method)
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
              >
                <option value="Cash">Cash (សាច់ប្រាក់)</option>
                <option value="ABA KHQR">ABA KHQR</option>
                <option value="Bakong">Bakong KHQR</option>
                <option value="Other">ផ្សេងៗ (Other)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 font-khmer">
                លេខទូរស័ព្ទ (Phone)
              </label>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="012 xxx xxx"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              />
            </div>
          </div>

          {/* Note / Wishes */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1 font-khmer">
              ចំណាំ / ពាក្យជូនពរ (Note / Wishes)
            </label>
            <input
              type="text"
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              placeholder="ស្រោមសំបុត្រផ្ទាល់ពីតុមុខ"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              បោះបង់ (Cancel)
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold text-xs shadow-gold transition-colors font-khmer"
            >
              {isSubmitting ? 'កំពុងរក្សាទុក...' : 'កត់ត្រាភ្លាមៗ (Save Envelope)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
