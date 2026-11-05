/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Coins,
  Calendar,
  Filter,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Building2,
  Gem,
  Banknote,
  ShieldCheck,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Transaction, SavingGoal, UserProfile } from '../types/finance';
import { SAVING_CATEGORIES, formatINR, getCategoryMeta } from '../utils/categories';
import { translations } from '../i18n/translations';

interface DailySavingScreenProps {
  transactions: Transaction[];
  goals: SavingGoal[];
  profile: UserProfile;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const DailySavingScreen: React.FC<DailySavingScreenProps> = ({
  transactions,
  goals,
  profile,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const t = translations[profile.language];
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  // Form states
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('gullak');
  const [date, setDate] = useState<string>(todayStr);
  const [notes, setNotes] = useState<string>('');
  const [linkedGoalId, setLinkedGoalId] = useState<string>('');
  const [isSuccessToast, setIsSuccessToast] = useState<boolean>(false);

  // Filter & Search states for history
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);

  // Only saving transactions
  const allSavings = transactions.filter((tx) => tx.type === 'saving');

  // Month-specific savings
  const monthSavings = allSavings.filter((tx) => tx.date.startsWith(selectedMonth));
  const monthTotal = monthSavings.reduce((sum, item) => sum + item.amount, 0);

  // Distinct days saved in selected month
  const daysSavedInMonth = new Set(monthSavings.map((item) => item.date)).size;
  const daysInMonthTotal = 30; // standard approximation for monthly pacing
  const avgDailySaving = daysSavedInMonth > 0 ? Math.round(monthTotal / daysSavedInMonth) : 0;

  // Filtered savings for table / list
  const filteredSavings = allSavings
    .filter((tx) => {
      const matchesSearch =
        tx.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.amount.toString().includes(searchQuery) ||
        tx.date.includes(searchQuery);

      const matchesCat =
        selectedCategoryFilter === 'all' || tx.category === selectedCategoryFilter;

      return matchesSearch && matchesCat;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddTransaction({
      type: 'saving',
      amount: parsedAmount,
      date,
      category,
      notes: notes.trim(),
      goalId: linkedGoalId || undefined,
    });

    setAmount('');
    setNotes('');
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.dailySavingTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.dailySavingSubtitle}
          </p>
        </div>

        {/* Month Selector for Summary */}
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 shadow-sm"
          />
        </div>
      </div>

      {/* Monthly Bachat KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-600 text-white p-5 rounded-2xl shadow-md">
          <span className="text-xs text-emerald-100 font-medium">
            {profile.language === 'hi' ? `${selectedMonth} की कुल बचत` : `Total in ${selectedMonth}`}
          </span>
          <div className="text-3xl font-extrabold tracking-tight mt-1 tabular-nums">
            {formatINR(monthTotal)}
          </div>
          <p className="text-[11px] text-emerald-100 mt-1">
            {monthSavings.length} {profile.language === 'hi' ? 'बचत प्रविष्टियां दर्ज' : 'entries recorded'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t.totalDaysSaved}
          </span>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 tabular-nums">
            {daysSavedInMonth} <span className="text-sm font-medium text-slate-400">/ 30 दिन</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (daysSavedInMonth / 30) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t.averageDailySaving}
          </span>
          <div className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {formatINR(avgDailySaving)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {profile.language === 'hi' ? 'प्रति सक्रिय बचत दिवस' : 'Per active saving day'}
          </p>
        </div>
      </div>

      {/* Main Grid: Add Daily Saving Form (Left) & Saving History (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ADD SAVING FORM (5 Cols on lg) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {profile.language === 'hi' ? 'नई बचत दर्ज करें' : 'Record New Saving'}
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.noMoneyDisclaimer}
              </span>
            </div>
          </div>

          {isSuccessToast && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t.savedSuccessfully}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.enterAmount} (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-2xl font-bold text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[50, 100, 200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 transition-colors"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Category / Mode of Saving */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.selectCategory}
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                {SAVING_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  const catKey = `cat_${cat.id}` as keyof typeof t;
                  const catName = t[catKey] || cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs truncate">{catName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.selectDate}</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Optional Link to Goal */}
            {goals.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.linkToGoal}
                </label>
                <select
                  value={linkedGoalId}
                  onChange={(e) => setLinkedGoalId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">{t.none}</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({formatINR(g.savedAmount)} / {formatINR(g.targetAmount)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.addNotes}
              </label>
              <input
                type="text"
                placeholder={profile.language === 'hi' ? 'उदा. किराना से बचे ₹100' : 'e.g., Grocery savings'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.saveButton}</span>
            </button>
          </form>
        </div>

        {/* SAVING HISTORY & LOGS (7 Cols on lg) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {profile.language === 'hi' ? 'बचत इतिहास व रिकॉर्ड' : 'Saving History & Logs'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {filteredSavings.length} {profile.language === 'hi' ? 'प्रविष्टियां मिलीं' : 'records found'}
                </p>
              </div>

              {/* Search & Category Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={profile.language === 'hi' ? 'खोजें...' : 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 w-28 sm:w-36 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="all">{t.allCategories}</option>
                  {SAVING_CATEGORIES.map((cat) => {
                    const catKey = `cat_${cat.id}` as keyof typeof t;
                    return (
                      <option key={cat.id} value={cat.id}>
                        {t[catKey] || cat.id}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* List */}
            {filteredSavings.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Coins className="w-12 h-12 mx-auto mb-2 opacity-30 text-emerald-500" />
                <p className="text-xs">{t.noTransactionsYet}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto pr-1">
                {filteredSavings.map((item) => {
                  const meta = getCategoryMeta('saving', item.category);
                  const Icon = meta.icon;
                  const catKey = `cat_${item.category}` as keyof typeof t;
                  const catName = t[catKey] || item.category;

                  return (
                    <div
                      key={item.id}
                      className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {catName}
                            </span>
                            <span className="text-[10px] text-slate-400 tabular-nums">
                              {item.date}
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          +{formatINR(item.amount)}
                        </span>
                        <button
                          onClick={() => onDeleteTransaction(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Motivational Bottom Quote */}
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {profile.language === 'hi'
                ? 'नियमित बचत ही सच्ची अमीरी की सीढ़ी है। हर छोटी बचत मायने रखती है!'
                : 'Consistent daily savings create enduring financial security.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
