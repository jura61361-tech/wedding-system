import type { Metadata, Viewport } from 'next';
import './globals.css';
import { WeddingProvider } from '@/context/WeddingContext';

export const metadata: Metadata = {
  title: 'ប្រព័ន្ធកត់ចំណងដៃអាពាហ៍ពិពាហ៍ | Wedding Gift Tracking System',
  description:
    'ប្រព័ន្ធកត់ត្រា និងគ្រប់គ្រងចំណងដៃអាពាហ៍ពិពាហ៍បែបឌីជីថល សុវត្ថិភាពខ្ពស់ និងរហ័សទាន់ចិត្ត (Wedding Gift Tracking, Real-time Dashboard & Safe Ledger)',
  keywords: ['ចំណងដៃ', 'អាពាហ៍ពិពាហ៍', 'Wedding Gift', 'Khmer Wedding', 'Ledger', 'KHQR'],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#d4af37',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km" suppressHydrationWarning>
      <body className="min-h-screen bg-wedding-pattern text-stone-900 antialiased selection:bg-gold-200 selection:text-gold-900">
        <WeddingProvider>{children}</WeddingProvider>
      </body>
    </html>
  );
}
