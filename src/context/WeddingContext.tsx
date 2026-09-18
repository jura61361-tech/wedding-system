'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  WeddingGift,
  WeddingGiftInsert,
  UserRole,
  Profile,
  FinancialSummary,
  BackupPayload,
} from '@/types/wedding';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  saveAllGiftsLocally,
  getLocalGifts,
  addToOfflineQueue,
  getOfflineQueue,
  removeOfflineQueueItem,
} from '@/lib/offline/indexeddb';
import { downloadJsonBackup } from '@/lib/backup/backupEngine';
import { INITIAL_MOCK_GIFTS } from '@/lib/mockData';

interface WeddingContextType {
  gifts: WeddingGift[];
  isLoading: boolean;
  isOnline: boolean;
  isLiveSupabase: boolean;
  userRole: UserRole | 'guest';
  setUserRole: (role: UserRole | 'guest') => void;
  currentProfile: Profile | null;
  offlineQueueCount: number;
  financialSummary: FinancialSummary;
  exchangeRate: number;
  // Actions
  submitGuestGift: (
    gift: WeddingGiftInsert,
    receiptFile?: File | null
  ) => Promise<{ success: boolean; gift?: WeddingGift; error?: string }>;
  addDirectCashGift: (
    gift: WeddingGiftInsert
  ) => Promise<{ success: boolean; gift?: WeddingGift; error?: string }>;
  approveGift: (id: string) => Promise<boolean>;
  rejectGift: (id: string) => Promise<boolean>;
  deleteGift: (id: string) => Promise<boolean>;
  syncOfflineQueue: () => Promise<{ synced: number; failed: number }>;
  downloadBackup: () => void;
  restoreFromBackup: (payload: BackupPayload) => void;
  refreshGifts: () => Promise<void>;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

const EXCHANGE_RATE = Number(process.env.NEXT_PUBLIC_USD_TO_KHR_RATE) || 4100;

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gifts, setGifts] = useState<WeddingGift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | 'guest'>('admin');
  const [currentProfile, setCurrentProfile] = useState<Profile | null>({
    id: 'admin_reception_01',
    full_name: 'Reception Admin (អ្នកទទួលភ្ញៀវ)',
    role: 'admin',
    created_at: new Date().toISOString(),
  });
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Detect online / offline status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => {
        setIsOnline(true);
        syncOfflineQueue();
      };
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Initialize data: Load from Supabase if configured, otherwise from IndexedDB / mock data
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    const hasSupabase = isSupabaseConfigured();
    setIsLiveSupabase(hasSupabase);

    if (hasSupabase) {
      const supabase = createClient();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('wedding_gifts')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            setGifts(data as WeddingGift[]);
            await saveAllGiftsLocally(data as WeddingGift[]);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase fetch failed, falling back to local storage:', err);
        }
      }
    }

    // Fallback to IndexedDB
    try {
      const cached = await getLocalGifts();
      if (cached && cached.length > 0) {
        setGifts(cached);
      } else {
        // First time running: seed with realistic mock gifts
        setGifts(INITIAL_MOCK_GIFTS);
        await saveAllGiftsLocally(INITIAL_MOCK_GIFTS);
      }
    } catch {
      setGifts(INITIAL_MOCK_GIFTS);
    } finally {
      // Check offline queue count
      const queue = await getOfflineQueue();
      setOfflineQueueCount(queue.length);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Supabase Realtime Subscription
  useEffect(() => {
    if (!isLiveSupabase) return;
    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel('realtime_wedding_gifts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wedding_gifts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setGifts((prev) => {
              if (prev.some((g) => g.id === payload.new.id)) return prev;
              const updated = [payload.new as WeddingGift, ...prev];
              saveAllGiftsLocally(updated);
              return updated;
            });
          } else if (payload.eventType === 'UPDATE') {
            setGifts((prev) => {
              const updated = prev.map((g) =>
                g.id === payload.new.id ? (payload.new as WeddingGift) : g
              );
              saveAllGiftsLocally(updated);
              return updated;
            });
          } else if (payload.eventType === 'DELETE') {
            setGifts((prev) => {
              const updated = prev.filter((g) => g.id !== payload.old.id);
              saveAllGiftsLocally(updated);
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLiveSupabase]);

  // Financial summary computation
  const financialSummary: FinancialSummary = useMemo(() => {
    let approvedUSD = 0;
    let approvedKHR = 0;
    let pendingUSD = 0;
    let pendingKHR = 0;
    let approvedCount = 0;
    let pendingCount = 0;
    let rejectedCount = 0;
    let groomCount = 0;
    let brideCount = 0;
    let bothCount = 0;

    for (const g of gifts) {
      const amt = Number(g.amount) || 0;
      if (g.status === 'approved') {
        approvedCount++;
        if (g.currency === 'USD') approvedUSD += amt;
        if (g.currency === 'KHR') approvedKHR += amt;
      } else if (g.status === 'pending') {
        pendingCount++;
        if (g.currency === 'USD') pendingUSD += amt;
        if (g.currency === 'KHR') pendingKHR += amt;
      } else if (g.status === 'rejected') {
        rejectedCount++;
      }

      if (g.side === 'groom') groomCount++;
      else if (g.side === 'bride') brideCount++;
      else bothCount++;
    }

    const approxTotalUSD = approvedUSD + approvedKHR / EXCHANGE_RATE;

    return {
      total_approved_usd: approvedUSD,
      total_approved_khr: approvedKHR,
      total_pending_usd: pendingUSD,
      total_pending_khr: pendingKHR,
      approx_total_usd: approxTotalUSD,
      total_gifts_count: gifts.length,
      approved_count: approvedCount,
      pending_count: pendingCount,
      rejected_count: rejectedCount,
      groom_side_count: groomCount,
      bride_side_count: brideCount,
      both_side_count: bothCount,
    };
  }, [gifts]);

  // Upload receipt image to Supabase storage or return base64 / null
  const uploadReceipt = async (file: File): Promise<string | null> => {
    if (!file) return null;
    const supabase = createClient();
    if (supabase && isLiveSupabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('receipts').getPublicUrl(fileName);
          return data.publicUrl;
        }
      } catch (e) {
        console.warn('Storage upload error, falling back to data URL:', e);
      }
    }

    // Fallback: convert to base64 Data URL so user can still preview in offline/demo mode!
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Submit Guest Gift (Mobile QR Flow - status 'pending')
  const submitGuestGift = async (
    giftData: WeddingGiftInsert,
    receiptFile?: File | null
  ): Promise<{ success: boolean; gift?: WeddingGift; error?: string }> => {
    try {
      let receiptUrl = giftData.receipt_url || null;
      if (receiptFile) {
        receiptUrl = await uploadReceipt(receiptFile);
      }

      const newGiftPayload: WeddingGiftInsert = {
        ...giftData,
        receipt_url: receiptUrl,
        status: 'pending',
      };

      const supabase = createClient();
      if (supabase && isLiveSupabase && isOnline) {
        const { data, error } = await supabase
          .from('wedding_gifts')
          .insert([newGiftPayload])
          .select()
          .single();

        if (error) {
          throw error;
        }

        const createdGift = data as WeddingGift;
        setGifts((prev) => [createdGift, ...prev]);
        saveAllGiftsLocally([createdGift, ...gifts]);
        return { success: true, gift: createdGift };
      }

      // Offline / Demo fallback
      const offlineGift = await addToOfflineQueue(newGiftPayload);
      setGifts((prev) => [offlineGift, ...prev]);
      setOfflineQueueCount((prev) => prev + 1);
      return { success: true, gift: offlineGift };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      return { success: false, error: message };
    }
  };

  // Direct Entry by Receptionist (Cash/Envelope - status 'approved')
  const addDirectCashGift = async (
    giftData: WeddingGiftInsert
  ): Promise<{ success: boolean; gift?: WeddingGift; error?: string }> => {
    try {
      const payload: WeddingGiftInsert = {
        ...giftData,
        status: 'approved',
        approved_by: currentProfile?.id || 'admin_reception',
      };

      const supabase = createClient();
      if (supabase && isLiveSupabase && isOnline) {
        const { data, error } = await supabase
          .from('wedding_gifts')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        const createdGift = data as WeddingGift;
        setGifts((prev) => [createdGift, ...prev]);
        saveAllGiftsLocally([createdGift, ...gifts]);
        return { success: true, gift: createdGift };
      }

      // Offline / Demo
      const offlineGift = await addToOfflineQueue(payload);
      setGifts((prev) => [offlineGift, ...prev]);
      setOfflineQueueCount((prev) => prev + 1);
      return { success: true, gift: offlineGift };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save envelope';
      return { success: false, error: message };
    }
  };

  // Approve a pending gift
  const approveGift = async (id: string): Promise<boolean> => {
    try {
      const supabase = createClient();
      if (supabase && isLiveSupabase && isOnline) {
        const { error } = await supabase
          .from('wedding_gifts')
          .update({
            status: 'approved',
            approved_by: currentProfile?.id || 'admin_reception',
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
      }

      setGifts((prev) => {
        const updated = prev.map((g) =>
          g.id === id
            ? {
                ...g,
                status: 'approved' as const,
                approved_by: currentProfile?.id || 'admin_reception',
                updated_at: new Date().toISOString(),
              }
            : g
        );
        saveAllGiftsLocally(updated);
        return updated;
      });
      return true;
    } catch (err) {
      console.error('Approve failed:', err);
      return false;
    }
  };

  // Reject a gift
  const rejectGift = async (id: string): Promise<boolean> => {
    try {
      const supabase = createClient();
      if (supabase && isLiveSupabase && isOnline) {
        const { error } = await supabase
          .from('wedding_gifts')
          .update({
            status: 'rejected',
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
      }

      setGifts((prev) => {
        const updated = prev.map((g) =>
          g.id === id
            ? {
                ...g,
                status: 'rejected' as const,
                updated_at: new Date().toISOString(),
              }
            : g
        );
        saveAllGiftsLocally(updated);
        return updated;
      });
      return true;
    } catch (err) {
      console.error('Reject failed:', err);
      return false;
    }
  };

  // Delete a gift
  const deleteGift = async (id: string): Promise<boolean> => {
    try {
      const supabase = createClient();
      if (supabase && isLiveSupabase && isOnline) {
        const { error } = await supabase.from('wedding_gifts').delete().eq('id', id);
        if (error) throw error;
      }

      setGifts((prev) => {
        const updated = prev.filter((g) => g.id !== id);
        saveAllGiftsLocally(updated);
        return updated;
      });
      return true;
    } catch (err) {
      console.error('Delete failed:', err);
      return false;
    }
  };

  // Sync Offline Queue to Supabase
  const syncOfflineQueue = async (): Promise<{ synced: number; failed: number }> => {
    if (!isLiveSupabase || !isOnline) {
      return { synced: 0, failed: 0 };
    }

    const supabase = createClient();
    if (!supabase) return { synced: 0, failed: 0 };

    const queue = await getOfflineQueue();
    if (queue.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;

    for (const item of queue) {
      try {
        const { is_offline, ...insertData } = item;
        const { error } = await supabase.from('wedding_gifts').insert([{
          guest_name: insertData.guest_name,
          guest_phone: insertData.guest_phone,
          side: insertData.side,
          amount: insertData.amount,
          currency: insertData.currency,
          payment_method: insertData.payment_method,
          receipt_url: insertData.receipt_url,
          wishes: insertData.wishes,
          status: insertData.status,
          approved_by: insertData.approved_by,
        }]);

        if (!error) {
          await removeOfflineQueueItem(item.id);
          synced++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    const remaining = await getOfflineQueue();
    setOfflineQueueCount(remaining.length);
    await loadInitialData();

    return { synced, failed };
  };

  // 1-Click Hard Backup (.json)
  const downloadBackup = () => {
    downloadJsonBackup(gifts, 'wedding_gifts_hard_backup');
  };

  // Restore or merge from a JSON Backup file
  const restoreFromBackup = (payload: BackupPayload) => {
    if (!payload.gifts || !Array.isArray(payload.gifts)) return;

    setGifts((prev) => {
      // Merge unique by ID
      const map = new Map<string, WeddingGift>();
      for (const g of prev) map.set(g.id, g);
      for (const g of payload.gifts) map.set(g.id, g);
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      saveAllGiftsLocally(merged);
      return merged;
    });
  };

  const refreshGifts = async () => {
    await loadInitialData();
  };

  return (
    <WeddingContext.Provider
      value={{
        gifts,
        isLoading,
        isOnline,
        isLiveSupabase,
        userRole,
        setUserRole,
        currentProfile,
        offlineQueueCount,
        financialSummary,
        exchangeRate: EXCHANGE_RATE,
        submitGuestGift,
        addDirectCashGift,
        approveGift,
        rejectGift,
        deleteGift,
        syncOfflineQueue,
        downloadBackup,
        restoreFromBackup,
        refreshGifts,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
