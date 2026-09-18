'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HostDashboard } from '@/components/host/HostDashboard';

export default function HostPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <HostDashboard />
      </main>
    </div>
  );
}
