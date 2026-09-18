'use client';

import React, { useState, useRef } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { WeddingGift, WeddingSide, CurrencyType, PaymentMethod } from '@/types/wedding';
import { ThankYouPass } from './ThankYouPass';
import {
  Heart,
  QrCode,
  Upload,
  User,
  Phone,
  DollarSign,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
} from 'lucide-react';

const QUICK_AMOUNTS_USD = [20, 50, 100, 200, 500];
const QUICK_AMOUNTS_KHR = [50000, 100000, 200000, 400000, 1000000];

const SAMPLE_WISHES = [
  'សូមជូនពរគូស្វាមីភរិយាថ្មី មានសុភមង្គល និងស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង!',
  'រីករាយថ្ងៃអាពាហ៍ពិពាហ៍! ជូនពររកស៊ីមានបាន សុខសប្បាយគ្រប់ប្រការ!',
  'សូមឱ្យស្រឡាញ់គ្នាផ្អែមល្ហែម ឆាប់បានកូនពូជល្អតពូជពង្ស!',
  'Happy Wedding! Wishing you a lifetime of love and happiness!',
];

export const GiftSubmissionForm: React.FC = () => {
  const { submitGuestGift } = useWedding();

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [side, setSide] = useState<WeddingSide>('both');
  const [amount, setAmount] = useState<string>('50');
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ABA KHQR');
  const [wishes, setWishes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedGift, setSubmittedGift] = useState<WeddingGift | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const groom = process.env.NEXT_PUBLIC_GROOM_NAME || 'ពិសិដ្ឋ';
  const bride = process.env.NEXT_PUBLIC_BRIDE_NAME || 'ធីតា';

  const handleCurrencyChange = (newCurrency: CurrencyType) => {
    setCurrency(newCurrency);
    if (newCurrency === 'KHR' && (amount === '50' || amount === '20' || amount === '100')) {
      setAmount('200000');
    } else if (newCurrency === 'USD' && (amount === '200000' || amount === '100000')) {
      setAmount('50');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const url = URL.createObjectURL(file);
      setReceiptPreview(url);
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    if (receiptPreview) {
      URL.revokeObjectURL(receiptPreview);
      setReceiptPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericAmount = parseFloat(amount);
    if (!guestName.trim()) {
      setErrorMessage('សូមបញ្ចូលឈ្មោះភ្ញៀវ (Please enter guest name)');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('សូមបញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ (Please enter a valid amount)');
      return;
    }

    setIsSubmitting(true);

    const result = await submitGuestGift(
      {
        guest_name: guestName.trim(),
        guest_phone: guestPhone.trim() || null,
        side,
        amount: numericAmount,
        currency,
        payment_method: paymentMethod,
        wishes: wishes.trim() || null,
      },
      receiptFile
    );

    setIsSubmitting(false);

    if (result.success && result.gift) {
      setSubmittedGift(result.gift);
    } else {
      setErrorMessage(result.error || 'មានបញ្ហាបច្ចេកទេស សូមព្យាយាមម្តងទៀត។');
    }
  };

  if (submittedGift) {
    return (
      <ThankYouPass
        gift={submittedGift}
        onReset={() => {
          setSubmittedGift(null);
          setGuestName('');
          setGuestPhone('');
          setWishes('');
          removeReceipt();
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-3 sm:p-6 animate-fadeIn">
      {/* Wedding Header Card */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          កត់ចំណងដៃអាពាហ៍ពិពាហ៍
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-khmer">
          {groom} ❤️ {bride}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          សូមស្វាគមន៍វត្តមានដ៏ខ្ពង់ខ្ពស់របស់លោកអ្នក! សូមបំពេញព័ត៌មានខាងក្រោម
        </p>
      </div>

      {/* Main Form Container */}
      <div className="glass-card rounded-3xl p-5 sm:p-8 shadow-gold border border-gold-300/70 bg-white/95">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-crimson-50 border border-crimson-200 text-crimson-700 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-crimson-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Guest Name */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 font-khmer">
              ឈ្មោះភ្ញៀវ (Guest Name) <span className="text-crimson-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="ឧ. លោក សុខ សុវណ្ណ & ភរិយា"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm transition-all bg-white"
              />
            </div>
          </div>

          {/* Wedding Side (Groom, Bride, Both) */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 font-khmer">
              ភ្ញៀវខាងណា? (Wedding Side) <span className="text-crimson-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'groom', labelKm: 'ខាងកូនកំលោះ', labelEn: 'Groom' },
                { id: 'bride', labelKm: 'ខាងកូនក្រមុំ', labelEn: 'Bride' },
                { id: 'both', labelKm: 'ទាំងសងខាង', labelEn: 'Both' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSide(item.id as WeddingSide)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-0.5 border transition-all ${
                    side === item.id
                      ? 'bg-gold-500 border-gold-600 text-stone-950 shadow-gold'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-gold-50'
                  }`}
                >
                  <span className="font-khmer">{item.labelKm}</span>
                  <span className="text-[10px] opacity-80">{item.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number (Optional) */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 font-khmer">
              លេខទូរស័ព្ទ (Phone Number - ស្រេចចិត្ត)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="ឧ. 012 345 678"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm transition-all bg-white"
              />
            </div>
          </div>

          {/* Amount & Currency Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-800 font-khmer">
                ចំនួនទឹកប្រាក់ចំណងដៃ (Gift Amount) <span className="text-crimson-600">*</span>
              </label>
              {/* Currency Toggle */}
              <div className="inline-flex rounded-lg p-0.5 bg-stone-200 border border-stone-300 text-xs">
                <button
                  type="button"
                  onClick={() => handleCurrencyChange('USD')}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${
                    currency === 'USD'
                      ? 'bg-gold-500 text-stone-950 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => handleCurrencyChange('KHR')}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${
                    currency === 'KHR'
                      ? 'bg-gold-500 text-stone-950 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  KHR (៛)
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500 font-bold">
                {currency === 'USD' ? '$' : '៛'}
              </div>
              <input
                type="number"
                step={currency === 'USD' ? '1' : '1000'}
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={currency === 'USD' ? '50' : '200000'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-base font-bold text-stone-900 transition-all bg-white"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(currency === 'USD' ? QUICK_AMOUNTS_USD : QUICK_AMOUNTS_KHR).map((quickAmt) => (
                <button
                  type="button"
                  key={quickAmt}
                  onClick={() => setAmount(quickAmt.toString())}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    amount === quickAmt.toString()
                      ? 'bg-stone-900 text-gold-300 border-stone-900 font-bold'
                      : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-gold-100 hover:border-gold-300'
                  }`}
                >
                  {currency === 'USD'
                    ? `$${quickAmt}`
                    : `${quickAmt.toLocaleString('km-KH')} ៛`}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 font-khmer">
              វិធីបង់ប្រាក់ (Payment Method)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ABA KHQR', label: 'ABA KHQR', color: 'text-cyan-700' },
                { id: 'Bakong', label: 'Bakong KHQR', color: 'text-red-700' },
                { id: 'Cash', label: 'Cash (សាច់ប្រាក់)', color: 'text-emerald-700' },
              ].map((pm) => (
                <button
                  type="button"
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    paymentMethod === pm.id
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {/* KHQR Display Card if Electronic Payment Selected */}
          {(paymentMethod === 'ABA KHQR' || paymentMethod === 'Bakong') && (
            <div className="rounded-2xl p-4 bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/80 text-center space-y-2">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-red-800">
                <QrCode className="w-4 h-4 text-red-600" />
                ស្កេនទូទាត់តាម KHQR ({paymentMethod})
              </div>
              <p className="text-[11px] text-stone-600">
                លោកអ្នកអាចស្កេន KHQR ខាងក្រោម រួចថតរូបបង្កាន់ដៃបញ្ជាក់
              </p>

              {/* KHQR Mock Visual Card */}
              <div className="mx-auto w-44 bg-white p-3 rounded-2xl shadow-md border-2 border-red-600/60">
                <div className="bg-red-600 text-white text-[10px] font-extrabold uppercase py-0.5 rounded mb-2 tracking-wider">
                  KHQR
                </div>
                <div className="aspect-square bg-stone-100 rounded-lg flex flex-col items-center justify-center p-2 border border-stone-200">
                  <QrCode className="w-28 h-28 text-stone-900" />
                  <span className="text-[10px] text-stone-500 font-semibold mt-1">
                    {groom} & {bride}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-stone-700 mt-1.5">
                  ABA: 000 123 456 ($ / ៛)
                </div>
              </div>
            </div>
          )}

          {/* Receipt Screenshot Upload */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 font-khmer">
              រូបភាពបង្កាន់ដៃផ្ទេរប្រាក់ (Receipt Screenshot)
            </label>
            {receiptPreview ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-gold-400 bg-stone-950 p-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="w-16 h-16 object-cover rounded-xl border border-stone-700"
                  />
                  <div className="text-left">
                    <span className="text-xs font-medium text-gold-300 block">
                      {receiptFile?.name || 'receipt_screenshot.png'}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      រូបភាពត្រូវបានភ្ជាប់រួចរាល់
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeReceipt}
                  className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-stone-300 hover:border-gold-500 rounded-2xl p-4 text-center transition-colors bg-stone-50 hover:bg-gold-50/50"
              >
                <Upload className="w-6 h-6 mx-auto text-gold-600 mb-1" />
                <span className="text-xs font-semibold text-stone-700 block font-khmer">
                  ចុចទីនេះដើម្បីបញ្ចូលរូបភាពបង្កាន់ដៃ (Upload Receipt)
                </span>
                <span className="text-[10px] text-stone-400">
                  PNG, JPG ឬ WebP ត្រឹម 10MB
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Best Wishes */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 font-khmer">
              ពាក្យជូនពរដល់គូស្វាមីភរិយាថ្មី (Best Wishes)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-stone-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                rows={3}
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                placeholder="សូមជូនពរគូស្វាមីភរិយាថ្មី..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-xs sm:text-sm font-khmer transition-all bg-white"
              />
            </div>

            {/* Quick Wishes Chips */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {SAMPLE_WISHES.map((w, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setWishes(w)}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-gold-50 text-gold-900 border border-gold-200 hover:bg-gold-100 transition-colors text-left truncate max-w-full font-khmer"
                >
                  ✨ {w}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-gold-600 via-gold-500 to-amber-500 hover:from-gold-700 hover:to-amber-600 text-stone-950 font-bold text-sm sm:text-base shadow-gold-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 font-khmer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                <span>កំពុងបញ្ជូន... (Submitting...)</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-stone-950" />
                <span>បញ្ជូនចំណងដៃ (Submit Wedding Gift)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
