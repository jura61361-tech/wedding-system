'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { downloadJsonBackup, validateAndParseBackup } from '@/lib/backup/backupEngine';
import { formatUSD, formatKHR } from '@/lib/utils';
import {
  X,
  HardDriveDownload,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { BackupPayload } from '@/types/wedding';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { gifts, restoreFromBackup, financialSummary } = useWedding();
  const [activeTab, setActiveTab] = useState<'download' | 'restore'>('download');
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restorePreview, setRestorePreview] = useState<BackupPayload | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadJsonBackup(gifts, 'wedding_gifts_backup');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestoreError(null);
    setRestoreSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = validateAndParseBackup(text);
      if (res.valid && res.data) {
        setRestorePreview(res.data);
      } else {
        setRestoreError(res.error || 'ទម្រង់ឯកសារមិនត្រឹមត្រូវ (Invalid backup file)');
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!restorePreview) return;
    restoreFromBackup(restorePreview);
    setRestoreSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gold-300 overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-400/30 flex items-center justify-center text-gold-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-khmer">
                យន្តការការពារបាត់បង់ទិន្នន័យ (Anti-Loss Backup Engine)
              </h2>
              <p className="text-[11px] text-stone-400">
                រក្សាទុកឯកសារចម្លងរឹង (.json) លើកុំព្យូទ័រមូលដ្ឋាន
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('download')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-gold-600 text-gold-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <HardDriveDownload className="w-4 h-4" />
            ទាញយក Backup (.json)
          </button>
          <button
            onClick={() => setActiveTab('restore')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'restore'
                ? 'border-gold-600 text-gold-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            ពិនិត្យ ឬ ស្ដារទិន្នន័យ (Inspect / Restore)
          </button>
        </div>

        {/* Tab 1: Download */}
        {activeTab === 'download' && (
          <div className="p-6 space-y-4">
            <div className="rounded-2xl p-4 bg-gold-50 border border-gold-200 space-y-2">
              <div className="flex items-center gap-2 text-gold-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-gold-600" />
                <span>សេចក្ដីសង្ខេបទិន្នន័យត្រៀមទាញយក:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-lg border border-gold-200">
                  <span className="text-stone-500 block">ចំនួនស្រោមសរុប:</span>
                  <span className="font-bold text-stone-900">{gifts.length} ស្រោម</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gold-200">
                  <span className="text-stone-500 block">ទឹកប្រាក់បានផ្ទៀងផ្ទាត់:</span>
                  <span className="font-bold text-stone-900">
                    {formatUSD(financialSummary.total_approved_usd)} |{' '}
                    {formatKHR(financialSummary.total_approved_khr)}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-stone-600">
                ឯកសារ Backup នេះមានផ្ទុកទិន្នន័យពេញលេញ រួមទាំងលេខកូដសម្ងាត់ Checksum
                សម្រាប់ការពារការកែបន្លំ (Tamper-proof)។
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-gold transition-colors font-khmer"
            >
              <HardDriveDownload className="w-4 h-4" />
              ទាញយក Backup ទៅកាន់ Hard Drive ឥឡូវនេះ
            </button>
          </div>
        )}

        {/* Tab 2: Restore / Inspect */}
        {activeTab === 'restore' && (
          <div className="p-6 space-y-4">
            <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 text-center bg-stone-50">
              <FileCode className="w-8 h-8 mx-auto text-gold-600 mb-1" />
              <label className="cursor-pointer">
                <span className="text-xs font-bold text-stone-800 block font-khmer">
                  ជ្រើសរើសឯកសារ Backup (.json)
                </span>
                <span className="text-[10px] text-stone-500">
                  {restoreFile ? restoreFile.name : 'ចុចដើម្បីបើកឯកសារពីកុំព្យូទ័រ'}
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {restoreError && (
              <div className="p-3 rounded-xl bg-crimson-50 text-crimson-700 text-xs flex items-center gap-2 border border-crimson-200">
                <AlertTriangle className="w-4 h-4 text-crimson-600 flex-shrink-0" />
                <span>{restoreError}</span>
              </div>
            )}

            {restoreSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>បានស្ដារទិន្នន័យជោគជ័យ!</span>
              </div>
            )}

            {restorePreview && (
              <div className="rounded-xl p-3.5 bg-stone-100 border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-stone-800">
                  ឯកសារត្រឹមត្រូវ: {restorePreview.total_records} ស្រោមសំបុត្រ
                </div>
                <div className="text-[11px] text-stone-600">
                  កាលបរិច្ឆេទ Export: {new Date(restorePreview.exported_at).toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-600">
                  Checksum: {restorePreview.checksum}
                </div>

                <button
                  onClick={handleExecuteRestore}
                  className="w-full mt-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                >
                  បញ្ចូល / បញ្ចូលច្របាច់ទិន្នន័យ (Merge into System)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
