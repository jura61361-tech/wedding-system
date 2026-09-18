export type UserRole = 'admin' | 'host';
export type GiftStatus = 'pending' | 'approved' | 'rejected';
export type CurrencyType = 'USD' | 'KHR';
export type WeddingSide = 'groom' | 'bride' | 'both';

export type PaymentMethod = 'Cash' | 'ABA KHQR' | 'Bakong' | 'Wing' | 'Other';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface WeddingGift {
  id: string;
  guest_name: string;
  guest_phone?: string | null;
  side: WeddingSide;
  amount: number;
  currency: CurrencyType;
  payment_method: string;
  receipt_url?: string | null;
  wishes?: string | null;
  status: GiftStatus;
  approved_by?: string | null;
  created_at: string;
  updated_at?: string;
  is_offline?: boolean; // Set if saved in offline queue before syncing
}

export interface WeddingGiftInsert {
  guest_name: string;
  guest_phone?: string | null;
  side: WeddingSide;
  amount: number;
  currency: CurrencyType;
  payment_method: string;
  receipt_url?: string | null;
  wishes?: string | null;
  status?: GiftStatus;
  approved_by?: string | null;
}

export interface BackupPayload {
  version: string;
  exported_at: string;
  exported_by?: string;
  app: string;
  wedding_meta: {
    groom: string;
    bride: string;
    date: string;
  };
  total_records: number;
  totals: {
    approved_usd: number;
    approved_khr: number;
    pending_usd: number;
    pending_khr: number;
  };
  gifts: WeddingGift[];
  checksum: string;
}

export interface FinancialSummary {
  total_approved_usd: number;
  total_approved_khr: number;
  total_pending_usd: number;
  total_pending_khr: number;
  approx_total_usd: number;
  total_gifts_count: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
  groom_side_count: number;
  bride_side_count: number;
  both_side_count: number;
}
