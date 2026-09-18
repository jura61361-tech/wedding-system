'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { GiftSubmissionForm } from '@/components/guest/GiftSubmissionForm';

export default function GuestGiftPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-6 sm:py-10 px-4">
        <GiftSubmissionForm />
      </main>
    </div>
  );
}
