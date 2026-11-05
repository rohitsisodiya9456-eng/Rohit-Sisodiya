/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Coins, Globe, Moon, Sun, Calculator, Bell } from 'lucide-react';
import { NavTab, UserProfile } from '../types/finance';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenCalculator: () => void;
  onOpenReminder: () => void;
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onUpdateProfile,
  onOpenCalculator,
  onOpenReminder,
  onOpenAddModal,
}) => {
  const t = translations[profile.language];

  const toggleLanguage = () => {
    const nextLang = profile.language === 'hi' ? 'en' : 'hi';
    onUpdateProfile({ language: nextLang });
  };

  const toggleTheme = () => {
    const nextTheme = profile.theme === 'light' ? 'dark' : 'light';
    onUpdateProfile({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Coins className="w-5 h-5 text-amber-200 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block leading-tight">
              {profile.language === 'hi' ? 'मेरी बचत' : 'Meri Bachat'}
            </span>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 tracking-wider uppercase block">
              DhanDiary
            </span>
          </div>
        </div>

        {/* Zone 2: Desktop Nav Links (Single line, quiet typography) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentTab === 'home'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => onSelectTab('saving')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentTab === 'saving'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {t.navSaving}
          </button>
          <button
            onClick={() => onSelectTab('goals')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentTab === 'goals'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {t.navGoals}
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentTab === 'reports'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {t.navReports}
          </button>
          <button
            onClick={() => onSelectTab('profile')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentTab === 'profile'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {t.navProfile}
          </button>
        </nav>

        {/* Zone 3: Actions (Language switch, Theme toggle, Calculator quick tool, Quick Save Button) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Tool: Calculator */}
          <button
            onClick={onOpenCalculator}
            title={t.calculatorTitle}
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Quick Tool: Reminder Settings */}
          <button
            onClick={onOpenReminder}
            title={t.reminderTitle}
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {profile.reminderEnabled && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Language Toggle: Hindi / English */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{profile.language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
            title={profile.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {profile.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Quick Add Saving Action Button */}
          <button
            onClick={onOpenAddModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <span>+</span>
            <span>{t.quickAddSaving}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
