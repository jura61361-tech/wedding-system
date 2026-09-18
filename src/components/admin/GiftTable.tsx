'use client';

import React, { useState, useMemo } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { WeddingGift, GiftStatus, WeddingSide, CurrencyType } from '@/types/wedding';
import {
  formatCurrency,
  formatUSD,
  formatKHR,
  translateSide,
  translateStatus,
  formatDateKhmer,
  formatDateShort,
} from '@/lib/utils';
import { exportGiftsToExcel } from '@/lib/export/excelExport';
import { PendingReviewModal } from './PendingReviewModal';
import { QuickCashModal } from './QuickCashModal';
import { BackupModal } from './BackupModal';
import {
  Search,
  Filter,
  FileSpreadsheet,
  Printer,
  HardDriveDownload,
  PlusCircle,
  Eye,
  Check,
  X,
  Trash2,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const GiftTable: React.FC = () => {
  const {
    gifts,
    financialSummary,
    approveGift,
    rejectGift,
    deleteGift,
    exchangeRate,
  } = useWedding();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Modals
  const [selectedReviewGift, setSelectedReviewGift] = useState<WeddingGift | null>(null);
  const [isQuickCashOpen, setIsQuickCashOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Filtered gifts list
  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = gift.guest_name.toLowerCase().includes(term);
        const matchPhone = gift.guest_phone ? gift.guest_phone.includes(term) : false;
        const matchWishes = gift.wishes ? gift.wishes.toLowerCase().includes(term) : false;
        if (!matchName && !matchPhone && !matchWishes) return false;
      }

      // Status
      if (statusFilter !== 'all' && gift.status !== statusFilter) return false;

      // Side
      if (sideFilter !== 'all' && gift.side !== sideFilter) return false;

      // Currency
      if (currencyFilter !== 'all' && gift.currency !== currencyFilter) return false;

      // Payment method
      if (methodFilter !== 'all' && gift.payment_method !== methodFilter) return false;

      return true;
    });
  }, [gifts, searchTerm, statusFilter, sideFilter, currencyFilter, methodFilter]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    exportGiftsToExcel(filteredGifts);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`តើអ្នកពិតជាចង់លុបទិន្នន័យរបស់ "${name}" មែនទេ?`)) {
      await deleteGift(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Financial Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 no-print">
        {/* Approved USD */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-gold-200/80 shadow-sm">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            សរុបជាដុល្លារ (Total USD)
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gold-700 font-sans">
            {formatUSD(financialSummary.total_approved_usd)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {gifts.filter((g) => g.status === 'approved' && g.currency === 'USD').length} ស្រោម
          </div>
        </div>

        {/* Approved KHR */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-gold-200/80 shadow-sm">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            សរុបជារៀល (Total KHR)
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-sans">
            {formatKHR(financialSummary.total_approved_khr)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {gifts.filter((g) => g.status === 'approved' && g.currency === 'KHR').length} ស្រោម
          </div>
        </div>

        {/* Combined Approx USD */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-gold-500 to-amber-600 text-stone-950 shadow-gold">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-stone-900/80 mb-1">
            ប្រមាណរួម ($ + ៛)
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-sans">
            ~{formatUSD(financialSummary.approx_total_usd)}
          </div>
          <div className="text-[11px] text-stone-900/80 mt-1 font-medium">
            (អត្រាប្តូរ: 1$ = {exchangeRate}៛)
          </div>
        </div>

        {/* Guest & Envelope Count */}
        <div className="p-4 sm:p-5 rounded-3xl bg-stone-900 text-white shadow-md">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
            ចំនួនស្រោមសរុប (Total)
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gold-400 font-sans">
            {financialSummary.total_gifts_count} ស្រោម
          </div>
          <div className="flex items-center gap-2 text-[10px] text-stone-300 mt-1">
            <span className="text-emerald-400">
              ✓ {financialSummary.approved_count} ផ្ទៀងផ្ទាត់
            </span>
            <span>•</span>
            <span className="text-amber-400">
              ⏳ {financialSummary.pending_count} រង់ចាំ
            </span>
          </div>
        </div>
      </div>

      {/* 2. Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-gold-200/70 shadow-sm no-print">
        {/* Left: Direct Quick Cash Entry */}
        <button
          onClick={() => setIsQuickCashOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold text-xs sm:text-sm shadow-gold transition-all transform active:scale-95 font-khmer"
        >
          <PlusCircle className="w-4 h-4 text-stone-950" />
          កត់ត្រាស្រោមផ្ទាល់ (Direct Cash Entry)
        </button>

        {/* Right: Export & Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Excel Export */}
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            ទាញយក Excel (.xlsx)
          </button>

          {/* Print / PDF */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            បោះពុម្ព (Print / PDF)
          </button>

          {/* Hard Backup */}
          <button
            onClick={() => setIsBackupOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors"
          >
            <HardDriveDownload className="w-4 h-4 text-amber-600" />
            Hard Backup (.json)
          </button>
        </div>
      </div>

      {/* 3. Search and Multi-Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gold-200/70 shadow-sm space-y-3 no-print">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ស្វែងរកតាមឈ្មោះ, លេខទូរស័ព្ទ, ពាក្យជូនពរ..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:border-gold-500 focus:ring-1 focus:ring-gold-300 bg-stone-50"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-stone-50"
          >
            <option value="all">ស្ថានភាពទាំងអស់ (All Status)</option>
            <option value="pending">⏳ រង់ចាំពិនិត្យ (Pending)</option>
            <option value="approved">✓ បានផ្ទៀងផ្ទាត់ (Approved)</option>
            <option value="rejected">✕ បានបដិសេធ (Rejected)</option>
          </select>

          {/* Side Filter */}
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-stone-50"
          >
            <option value="all">ខាងទាំងអស់ (All Sides)</option>
            <option value="groom">ខាងកូនកំលោះ (Groom)</option>
            <option value="bride">ខាងកូនក្រមុំ (Bride)</option>
            <option value="both">ទាំងសងខាង (Both)</option>
          </select>

          {/* Currency Filter */}
          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-stone-50"
          >
            <option value="all">រូបិយប័ណ្ណទាំងអស់ (All Currency)</option>
            <option value="USD">USD ($)</option>
            <option value="KHR">KHR (៛)</option>
          </select>
        </div>
      </div>

      {/* 4. Main Ledger Table */}
      <div className="bg-white rounded-3xl border border-gold-200/70 shadow-sm overflow-hidden">
        {/* Table Header Info */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-stone-900 font-khmer">
              បញ្ជីកត់ត្រាចំណងដៃ (Gift Ledger)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 text-xs font-bold">
              {filteredGifts.length} កំណត់ត្រា
            </span>
          </div>
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            កាលបរិច្ឆេទធ្វើបច្ចុប្បន្នភាពចុងក្រោយ: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100/90 text-stone-700 uppercase font-bold text-[11px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">ល.រ</th>
                <th className="py-3 px-4 font-khmer">ឈ្មោះភ្ញៀវ (Guest Name)</th>
                <th className="py-3 px-4 font-khmer">ខាង (Side)</th>
                <th className="py-3 px-4 font-khmer">ចំនួនទឹកប្រាក់ (Amount)</th>
                <th className="py-3 px-4 font-khmer">វិធីបង់ប្រាក់</th>
                <th className="py-3 px-4 font-khmer text-center">បង្កាន់ដៃ</th>
                <th className="py-3 px-4 font-khmer text-center">ស្ថានភាព</th>
                <th className="py-3 px-4 font-khmer">កាលបរិច្ឆេទ</th>
                <th className="py-3 px-4 text-center no-print font-khmer">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredGifts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400 font-khmer">
                    ពុំមានទិន្នន័យស្របតាមការស្វែងរកនេះឡើយ (No gifts found)
                  </td>
                </tr>
              ) : (
                filteredGifts.map((gift, idx) => (
                  <tr
                    key={gift.id}
                    className={`hover:bg-gold-50/40 transition-colors ${
                      gift.status === 'pending' ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center text-stone-500 font-medium">
                      {idx + 1}
                    </td>

                    {/* Guest Name & Phone */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900 font-khmer">
                        {gift.guest_name}
                      </div>
                      {gift.guest_phone && (
                        <div className="text-[10px] text-stone-500">
                          {gift.guest_phone}
                        </div>
                      )}
                      {gift.wishes && (
                        <div className="text-[10px] text-stone-500 italic max-w-xs truncate mt-0.5">
                          &ldquo;{gift.wishes}&rdquo;
                        </div>
                      )}
                    </td>

                    {/* Side */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-100 text-stone-700 font-khmer">
                        {translateSide(gift.side, 'km')}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-stone-900 font-sans text-sm">
                        {formatCurrency(gift.amount, gift.currency)}
                      </div>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {gift.currency}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700">
                        {gift.payment_method}
                      </span>
                    </td>

                    {/* Receipt thumbnail */}
                    <td className="py-3.5 px-4 text-center">
                      {gift.receipt_url ? (
                        <button
                          onClick={() => setSelectedReviewGift(gift)}
                          className="relative inline-block w-9 h-9 rounded-lg overflow-hidden border border-stone-300 hover:border-gold-500 shadow-sm"
                        >
                          <img
                            src={gift.receipt_url}
                            alt="receipt"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <span className="text-stone-300 text-xs">-</span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4 text-center">
                      {gift.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <Check className="w-3 h-3" />
                          ផ្ទៀងផ្ទាត់
                        </span>
                      )}
                      {gift.status === 'pending' && (
                        <button
                          onClick={() => setSelectedReviewGift(gift)}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse hover:bg-amber-200"
                        >
                          ⏳ រង់ចាំពិនិត្យ
                        </button>
                      )}
                      {gift.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                          <X className="w-3 h-3" />
                          បដិសេធ
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-stone-600 text-[11px]">
                      <div>{formatDateShort(gift.created_at)}</div>
                      <div className="text-[10px] text-stone-400">
                        {new Date(gift.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        {gift.status === 'pending' ? (
                          <button
                            onClick={() => setSelectedReviewGift(gift)}
                            title="ពិនិត្យ និងយល់ព្រម (Review)"
                            className="p-1.5 rounded-lg bg-gold-500 text-stone-950 hover:bg-gold-600 shadow-sm transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedReviewGift(gift)}
                            title="មើលព័ត៌មានលម្អិត"
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(gift.id, gift.guest_name)}
                          title="លុបកំណត់ត្រា"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-crimson-600 hover:bg-crimson-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <QuickCashModal
        isOpen={isQuickCashOpen}
        onClose={() => setIsQuickCashOpen(false)}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />

      <PendingReviewModal
        gift={selectedReviewGift}
        onClose={() => setSelectedReviewGift(null)}
        onApprove={approveGift}
        onReject={rejectGift}
      />
    </div>
  );
};
