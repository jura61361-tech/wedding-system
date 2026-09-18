import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CurrencyType, GiftStatus, WeddingSide } from '@/types/wedding';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatKHR(amount: number): string {
  return (
    new Intl.NumberFormat('km-KH', {
      maximumFractionDigits: 0,
    }).format(amount) + ' ៛'
  );
}

export function formatCurrency(amount: number, currency: CurrencyType): string {
  if (currency === 'KHR') {
    return formatKHR(amount);
  }
  return formatUSD(amount);
}

export function convertKHRToUSD(khr: number, rate = 4100): number {
  return khr / rate;
}

export function translateSide(side: WeddingSide, lang: 'km' | 'en' = 'km'): string {
  if (lang === 'km') {
    switch (side) {
      case 'groom':
        return 'ខាងកូនកំលោះ';
      case 'bride':
        return 'ខាងកូនក្រមុំ';
      case 'both':
      default:
        return 'ទាំងសងខាង';
    }
  }
  switch (side) {
    case 'groom':
      return 'Groom Side';
    case 'bride':
      return 'Bride Side';
    case 'both':
    default:
      return 'Both Sides';
  }
}

export function translateStatus(status: GiftStatus, lang: 'km' | 'en' = 'km'): string {
  if (lang === 'km') {
    switch (status) {
      case 'approved':
        return 'បានផ្ទៀងផ្ទាត់';
      case 'pending':
        return 'រង់ចាំពិនិត្យ';
      case 'rejected':
        return 'បានបដិសេធ';
    }
  }
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'pending':
      return 'Pending';
    case 'rejected':
      return 'Rejected';
  }
}

export function formatDateKhmer(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('km-KH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function formatDateShort(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateString;
  }
}
