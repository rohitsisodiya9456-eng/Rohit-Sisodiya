/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Globe,
  Moon,
  Sun,
  ShieldCheck,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Bell,
  HelpCircle,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, Transaction, SavingGoal } from '../types/finance';
import { translations } from '../i18n/translations';
import { exportBackupJSON } from '../utils/storage';

interface ProfileScreenProps {
  profile: UserProfile;
  transactions: Transaction[];
  goals: SavingGoal[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
  onRestoreBackup: (data: { transactions: Transaction[]; goals: SavingGoal[]; profile: UserProfile }) => void;
  onOpenReminderModal: () => void;
  onOpenLoginModal: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  transactions,
  goals,
  onUpdateProfile,
  onResetDemoData,
  onClearAllData,
  onRestoreBackup,
  onOpenReminderModal,
  onOpenLoginModal,
}) => {
  const t = translations[profile.language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [isEditing, setIsEditing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, phone, email });
    setIsEditing(false);
    showToast(t.savedSuccessfully);
  };

  const handleDownloadBackup = () => {
    exportBackupJSON(transactions, goals, profile);
    showToast(profile.language === 'hi' ? 'बैकअप फ़ाइल डाउनलोड हो गई!' : 'Backup file downloaded!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.transactions && parsed.goals) {
          onRestoreBackup(parsed);
          showToast(profile.language === 'hi' ? 'बैकअप सफलतापूर्वक लोड हुआ!' : 'Backup restored successfully!');
        } else {
          alert('Invalid backup file');
        }
      } catch (err) {
        alert('Could not parse backup JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 max-w-4xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-3 bg-emerald-600 text-white rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.profileTitle}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {profile.language === 'hi'
            ? 'अपनी वित्तीय डायरी और डेटा को प्रबंधित करें'
            : 'Manage your savings preferences and offline storage'}
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md">
              {profile.name.charAt(0) || 'B'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {profile.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>+91 {profile.phone || '9876543210'}</span>
                <span>·</span>
                <span className="capitalize">{profile.loginMethod} User</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {isEditing ? t.cancel : t.edit}
            </button>
            <button
              onClick={onOpenLoginModal}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              {t.loginNow}
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveInfo} className="pt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.mobileNumber}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.emailAddress}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              {t.saveButton}
            </button>
          </form>
        ) : (
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-400 block mb-0.5">{t.emailAddress}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {profile.email || 'rohitsisodiya@dhandiary.in'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-400 block mb-0.5">{t.currency}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ₹ भारतीय रुपया (INR)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-400 block mb-0.5">{t.language}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {profile.language === 'hi' ? 'हिंदी (Hindi)' : 'English'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* App Preferences & Tools */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {t.appPreferences}
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {/* Language Switch */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  {t.language}
                </span>
                <span className="text-slate-400">
                  {profile.language === 'hi' ? 'हिंदी सक्रिय है' : 'English is active'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => onUpdateProfile({ language: 'hi' })}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  profile.language === 'hi'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => onUpdateProfile({ language: 'en' })}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  profile.language === 'en'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Theme Switch */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                {profile.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  {t.theme}
                </span>
                <span className="text-slate-400">
                  {profile.theme === 'light' ? 'Light mode' : 'Dark mode'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpdateProfile({ theme: profile.theme === 'light' ? 'dark' : 'light' })}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {profile.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>

          {/* Reminder Settings */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  {t.reminderTitle}
                </span>
                <span className="text-slate-400">
                  {profile.reminderEnabled ? `${profile.reminderTime || '20:00'} बजे सेट है` : 'बंद है'}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenReminderModal}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {profile.language === 'hi' ? 'सेटिंग्स बदलें' : 'Configure'}
            </button>
          </div>
        </div>
      </div>

      {/* Backup, Restore & Data Reset */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {t.backupRestore}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            onClick={handleDownloadBackup}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/40 text-left transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                {t.downloadBackup}
              </span>
              <span className="text-[11px] text-slate-400">
                {profile.language === 'hi' ? 'अपनी बचत का JSON बैकअप अपने पास रखें' : 'Save all records as offline JSON file'}
              </span>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 text-left transition-all flex items-center gap-3"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                {t.restoreBackup}
              </span>
              <span className="text-[11px] text-slate-400">
                {profile.language === 'hi' ? 'पुरानी बैकअप फ़ाइल लोड करें' : 'Restore from existing JSON backup'}
              </span>
            </div>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={onResetDemoData}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.loadDemoData}</span>
          </button>

          <button
            onClick={onClearAllData}
            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearAllData}</span>
          </button>
        </div>
      </div>

      {/* Security & FAQ Info Card */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl p-5 border border-emerald-200/50 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="w-5 h-5" />
          <span>{profile.language === 'hi' ? 'सुरक्षा व गोपनीयता (No Real Money)' : 'Privacy & Security Guarantee'}</span>
        </div>
        <p className="leading-relaxed">
          {profile.language === 'hi'
            ? 'इस ऐप में कोई भी असली वित्तीय लेन-देन नहीं होता। न ही आपके बैंक से पैसे कटेंगे और न ही ऐप में पैसे जमा होंगे। यह केवल आपकी निजी डिजिटल बचत डायरी है जो 100% आपके डिवाइस पर सुरक्षित रहती है।'
            : 'No real money transactions occur inside this application. No bank accounts are debited. This is strictly a personal financial record diary running locally on your device.'}
        </p>
      </div>
    </div>
  );
};
