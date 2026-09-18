import { BackupPayload, WeddingGift } from '@/types/wedding';

// Simple lightweight deterministic checksum
export function calculateChecksum(dataStr: string): string {
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {
    const char = dataStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function generateBackupPayload(gifts: WeddingGift[], exportedBy = 'Admin Reception'): BackupPayload {
  const approvedGifts = gifts.filter((g) => g.status === 'approved');
  const pendingGifts = gifts.filter((g) => g.status === 'pending');

  const approvedUSD = approvedGifts
    .filter((g) => g.currency === 'USD')
    .reduce((sum, g) => sum + Number(g.amount), 0);
  const approvedKHR = approvedGifts
    .filter((g) => g.currency === 'KHR')
    .reduce((sum, g) => sum + Number(g.amount), 0);

  const pendingUSD = pendingGifts
    .filter((g) => g.currency === 'USD')
    .reduce((sum, g) => sum + Number(g.amount), 0);
  const pendingKHR = pendingGifts
    .filter((g) => g.currency === 'KHR')
    .reduce((sum, g) => sum + Number(g.amount), 0);

  const rawPayload = {
    version: '1.0.0',
    exported_at: new Date().toISOString(),
    exported_by: exportedBy,
    app: 'Wedding Gift Tracking Web Application (ប្រព័ន្ធកត់ចំណងដៃអាពាហ៍ពិពាហ៍)',
    wedding_meta: {
      groom: process.env.NEXT_PUBLIC_GROOM_NAME || 'Piseth',
      bride: process.env.NEXT_PUBLIC_BRIDE_NAME || 'Thida',
      date: process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-11-28',
    },
    total_records: gifts.length,
    totals: {
      approved_usd: approvedUSD,
      approved_khr: approvedKHR,
      pending_usd: pendingUSD,
      pending_khr: pendingKHR,
    },
    gifts: gifts,
  };

  const checksum = calculateChecksum(JSON.stringify(rawPayload.gifts));

  return {
    ...rawPayload,
    checksum,
  };
}

export function downloadJsonBackup(gifts: WeddingGift[], filenamePrefix = 'wedding_gift_backup'): void {
  const payload = generateBackupPayload(gifts);
  const jsonStr = JSON.stringify(payload, null, 2);

  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/[:]/g, '-');

  const filename = `${filenamePrefix}_${timestamp}.json`;

  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateAndParseBackup(jsonText: string): {
  valid: boolean;
  error?: string;
  data?: BackupPayload;
} {
  try {
    const parsed = JSON.parse(jsonText) as BackupPayload;
    if (!parsed || !Array.isArray(parsed.gifts)) {
      return { valid: false, error: 'Invalid file format: Missing gifts array.' };
    }

    // Verify records have required fields
    for (const item of parsed.gifts) {
      if (!item.guest_name || typeof item.amount !== 'number' || !item.currency) {
        return {
          valid: false,
          error: `Corrupted record found in backup: ${item.guest_name || 'unknown'}`,
        };
      }
    }

    return { valid: true, data: parsed };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON syntax';
    return { valid: false, error: msg };
  }
}
