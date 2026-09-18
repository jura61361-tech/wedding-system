import * as XLSX from 'xlsx';
import { WeddingGift } from '@/types/wedding';
import { translateSide, translateStatus } from '@/lib/utils';

export function exportGiftsToExcel(gifts: WeddingGift[], filenamePrefix = 'wedding_gifts_ledger'): void {
  // Sort gifts by created_at ascending or id
  const sortedGifts = [...gifts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Build rows data
  const rows = sortedGifts.map((gift, idx) => ({
    'No. (ល.រ)': idx + 1,
    'Guest Name (ឈ្មោះភ្ញៀវ)': gift.guest_name,
    'Side (ខាង)': `${translateSide(gift.side, 'km')} / ${translateSide(gift.side, 'en')}`,
    'Amount (ចំនួន)': Number(gift.amount),
    'Currency (រូបិយប័ណ្ណ)': gift.currency,
    'Payment Method (វិធីបង់)': gift.payment_method,
    'Status (ស្ថានភាព)': `${translateStatus(gift.status, 'km')} (${translateStatus(gift.status, 'en')})`,
    'Phone (លេខទូរស័ព្ទ)': gift.guest_phone || '-',
    'Best Wishes (ពាក្យជូនពរ)': gift.wishes || '-',
    'Date & Time (កាលបរិច្ឆេទ)': new Date(gift.created_at).toLocaleString('km-KH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  const colWidths = [
    { wch: 8 },  // No
    { wch: 28 }, // Guest Name
    { wch: 24 }, // Side
    { wch: 14 }, // Amount
    { wch: 12 }, // Currency
    { wch: 18 }, // Payment Method
    { wch: 22 }, // Status
    { wch: 18 }, // Phone
    { wch: 35 }, // Wishes
    { wch: 22 }, // Date
  ];
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Wedding Gifts');

  // Generate filename with timestamp
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const fullFilename = `${filenamePrefix}_${dateStr}.xlsx`;

  // Write file to client
  XLSX.writeFile(wb, fullFilename);
}
