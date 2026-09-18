'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { GiftTable } from '@/components/admin/GiftTable';

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-khmer">
                តុទទួលភ្ញៀវ & គ្រប់គ្រងចំណងដៃ (Admin Reception Desk)
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                ផ្ទៀងផ្ទាត់ចំណងដៃ បញ្ចូលស្រោមសំបុត្រផ្ទាល់ និងគ្រប់គ្រងរបាយការណ៍ហិរញ្ញវត្ថុ
              </p>
            </div>
          </div>
        </div>

        <GiftTable />
      </main>
    </div>
  );
}
