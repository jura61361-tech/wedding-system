'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useWedding } from '@/context/WeddingContext';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUserRole } = useWedding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }

        // Fetch profile to know role
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profile?.role === 'admin') {
            setUserRole('admin');
            router.push('/admin');
          } else {
            setUserRole('host');
            router.push('/host');
          }
          return;
        }
      }
    }

    // Demo Mode fallback authentication
    if (email.includes('admin')) {
      setUserRole('admin');
      router.push('/admin');
    } else {
      setUserRole('host');
      router.push('/host');
    }
    setIsLoading(false);
  };

  const handleQuickDemoLogin = (role: 'admin' | 'host') => {
    setUserRole(role);
    if (role === 'admin') router.push('/admin');
    else router.push('/host');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-gold-300 shadow-gold space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gold-100 flex items-center justify-center text-gold-700 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-khmer">
              ចូលប្រព័ន្ធ (System Login)
            </h1>
            <p className="text-xs text-stone-500">
              សម្រាប់គណៈកម្មការតុទទួលភ្ញៀវ និងម្ចាស់ដើមការ
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-crimson-50 border border-crimson-200 text-crimson-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 font-khmer">
                អ៊ីមែល (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wedding.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 font-khmer">
                ពាក្យសម្ងាត់ (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-300 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold text-xs sm:text-sm shadow-gold transition-colors font-khmer"
            >
              {isLoading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ចូលប្រព័ន្ធ (Sign In)'}
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-4 border-t border-stone-200 text-center space-y-2">
            <span className="text-[11px] text-stone-400 block uppercase font-bold tracking-wider">
              ឬ ចូលសាកល្បងរហ័ស (Quick Demo Access)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-2 px-3 rounded-xl bg-stone-900 text-gold-300 hover:bg-stone-800 text-xs font-bold transition-colors"
              >
                ចូលជា Admin (តុទទួល)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('host')}
                className="py-2 px-3 rounded-xl bg-gold-100 text-gold-900 hover:bg-gold-200 text-xs font-bold border border-gold-300 transition-colors"
              >
                ចូលជា Host (ម្ចាស់ការ)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
