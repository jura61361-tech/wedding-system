# ប្រព័ន្ធកត់ចំណងដៃអាពាហ៍ពិពាហ៍ (Wedding Gift Tracking & Ledger System)

A production-ready, highly secure, and mobile-friendly Cambodian Wedding Gift Tracking Web Application built with **Next.js 14/15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase (PostgreSQL with Row Level Security)**, **IndexedDB Offline Caching**, and **Excel (XLSX) / PDF Export Engines**. Ready for instant deployment on **Vercel**.

---

## 🌟 Key Highlights & Features

### 1. Dual-Layer Persistence & Anti-Loss Strategy
- **Cloud Layer**: Powered by Supabase PostgreSQL with strict **Row Level Security (RLS)**:
  - **Guests (Anon)**: Allowed ONLY to insert submissions with `status = 'pending'`.
  - **Host (ម្ចាស់ដើមការ)**: View-only access to `status = 'approved'` records.
  - **Admin (តុទទួលភ្ញៀវ)**: Full CRUD access to manage, approve, reject, and export.
- **Client Resilience Layer**: Local **IndexedDB** engine caches all gifts in the browser. If the wedding hall has an internet drop or lag, reception desk entries are stored in an offline queue and synced automatically upon reconnection.
- **Anti-Hack & Anti-Loss Hard Backup**: 1-click button in the Admin console to download a complete, timestamped `.json` file (`wedding_gifts_backup_YYYYMMDD_HHmmss.json`) with cryptographic checksum verification directly to a local hard drive or USB drive.

### 2. User Roles & Dedicated Workflows
- **Guest Portal (ភ្ញៀវ - QR Code Scan)** (`/gift`):
  - Mobile-responsive, zero login required.
  - Guest Name, Side (ខាងកូនកំលោះ / ខាងកូនក្រមុំ / ទាំងសងខាង), Phone Number, Amount & Currency toggle (USD $ / KHR ៛), Payment Method (Cash, ABA KHQR, Bakong), Receipt Screenshot Upload, and Best Wishes.
  - Visual KHQR payment card.
  - Instant digital thank-you pass (ប័ណ្ណថ្លែងអំណរគុណ) with celebratory confetti.
- **Host Live Dashboard (ម្ចាស់ដើមការ)** (`/host`):
  - View-only live dashboard for the Bride, Groom, and Parents.
  - Live total approved figures in USD ($) and Khmer Riel (៛), plus combined approximate USD at current exchange rate (1$ = 4,100៛).
  - Verified guest count and side distribution breakdown (Groom vs Bride vs Both).
  - Live celebration ticker streaming verified gifts and heartfelt wishes.
  - Audio celebration chime toggle.
- **Admin Reception Desk (តុទទួលភ្ញៀវ)** (`/admin`):
  - Fast-Entry Cash Envelope Modal (Direct entry < 5 seconds, auto-approved).
  - Live Verification Queue: Review incoming guest submissions with full-size receipt viewer, 1-click Approve or Reject.
  - Multi-faceted Search & Filter: By name, phone number, status, side, currency, payment method.
  - **Excel Export (`.xlsx`)**: Formatted Cambodian wedding spreadsheet with bilingual headers and auto-column widths.
  - **Print / PDF Ledger**: Clean, printer-friendly ledger table (`@media print`) with total calculations and family elder signature lines.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> **Zero-Configuration Demo Mode**: The application runs out of the box with realistic Cambodian wedding sample data even before connecting to Supabase! You can switch roles (Admin, Host, Guest) anytime using the navbar switcher.

---

## 🗄️ Supabase Database Setup

When you are ready to connect your production database:

1. Create a free project at [Supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open the included file [`supabase/schema.sql`](./supabase/schema.sql) and paste the entire script, then click **Run**.
   - This creates:
     - ENUM types: `user_role`, `gift_status`, `currency_type`, `wedding_side`
     - Tables: `profiles`, `wedding_gifts`
     - Row Level Security (RLS) policies
     - Realtime publication on `wedding_gifts`
     - Public storage bucket `receipts` for guest payment slips.
4. Copy your project credentials into `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_USD_TO_KHR_RATE=4100
NEXT_PUBLIC_GROOM_NAME=ពិសិដ្ឋ (Piseth)
NEXT_PUBLIC_BRIDE_NAME=ធីតា (Thida)
```

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select this repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_USD_TO_KHR_RATE` (e.g. `4100`)
   - `NEXT_PUBLIC_GROOM_NAME` (e.g. `ពិសិដ្ឋ`)
   - `NEXT_PUBLIC_BRIDE_NAME` (e.g. `ធីតា`)
5. Click **Deploy**. Your wedding tracking system will be live on a secure HTTPS URL!

---

## 🛡️ Security & Anti-Hack Summary
- **No Client Secrets**: Service role keys are never exposed to the client.
- **SQL Injection Immune**: Built with Supabase parameterized queries.
- **Strict RLS**: Public anonymous visitors cannot read unapproved ledger data, modify records, or alter gift statuses.
- **Tamper-Evident Backups**: Downloaded `.json` backups include an integrity checksum.
