/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Plus,
  Flame,
  CheckCircle,
  Clock,
  ArrowRight,
  Calculator,
  ShieldCheck,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { Transaction, SavingGoal, UserProfile, NavTab } from '../types/finance';
import { translations } from '../i18n/translations';
import { formatINR, getCategoryMeta } from '../utils/categories';

interface DashboardProps {
  transactions: Transaction[];
  goals: SavingGoal[];
  profile: UserProfile;
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: (type?: 'saving' | 'expense' | 'income', goalId?: string) => void;
  onOpenCalculator: () => void;
  onDeleteTransaction: (id: string) => void;
  onQuickSave: (amount: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  goals,
  profile,
  onNavigate,
  onOpenAddModal,
  onOpenCalculator,
  onDeleteTransaction,
  onQuickSave,
}) => {
  const t = translations[profile.language];
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthPrefix = todayStr.substring(0, 7); // YYYY-MM

  // Financial aggregates
  const totalSavings = transactions
    .filter((tx) => tx.type === 'saving')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlySavings = transactions
    .filter((tx) => tx.type === 'saving' && tx.date.startsWith(currentMonthPrefix))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyExpenses = transactions
    .filter((tx) => tx.type === 'expense' && tx.date.startsWith(currentMonthPrefix))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Check today's saving
  const todaySavings = transactions
    .filter((tx) => tx.type === 'saving' && tx.date === todayStr)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const hasSavedToday = todaySavings > 0;

  // Calculate saving streak (consecutive days with at least 1 saving entry)
  const savingDatesSet = new Set(
    transactions.filter((tx) => tx.type === 'saving').map((tx) => tx.date)
  );

  let streak = 0;
  let checkDate = new Date();
  // If not saved today, check starting from yesterday for streak continuity
  if (!hasSavedToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  for (let i = 0; i < 60; i++) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (savingDatesSet.has(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Recent transactions (last 6)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      {/* 1. Welcome & Today's Saving Streak Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-6 sm:p-7 shadow-xl shadow-emerald-900/10 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-end overflow-hidden">
          <Coins className="w-56 h-56 -mr-10 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-emerald-100 text-xs font-semibold tracking-wider uppercase">
                {profile.language === 'hi' ? 'नमस्ते' : 'Welcome back'}, {profile.name} 👋
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                {profile.language === 'hi' ? 'आज की बचत डायरी' : "Today's Saving Diary"}
              </h1>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              <Flame className="w-4 h-4 text-amber-300 animate-pulse fill-amber-300" />
              <span className="text-xs font-bold tabular-nums">
                {streak} {t.savingStreak}
              </span>
            </div>
          </div>

          {/* Today's Saving Status Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  hasSavedToday ? 'bg-amber-400 text-slate-900' : 'bg-white/20 text-white'
                }`}
              >
                {hasSavedToday ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Coins className="w-6 h-6 text-amber-300" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-100">
                  {hasSavedToday ? t.todaySavedSuccess : t.todayNotSavedYet}
                </p>
                <p className="text-lg font-bold tabular-nums">
                  {hasSavedToday ? (
                    <span>{formatINR(todaySavings)} {profile.language === 'hi' ? 'जमा हुआ' : 'Saved'}</span>
                  ) : (
                    <span>₹0 {profile.language === 'hi' ? 'की बचत' : 'Saved today'}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Saving Chips if not saved, or add more */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-emerald-100 hidden sm:inline">
                {profile.language === 'hi' ? 'झटपट बचत:' : 'Quick Save:'}
              </span>
              {[50, 100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => onQuickSave(amt)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 transition-all shadow-sm"
                >
                  +₹{amt}
                </button>
              ))}
              <button
                onClick={() => onOpenAddModal('saving')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-900/60 text-white border border-white/30 hover:bg-emerald-900 active:scale-95 transition-all"
              >
                + {t.quickAddSaving}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Key Financial Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Savings */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-emerald-300 dark:hover:border-emerald-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.totalSavings}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {formatINR(totalSavings)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span>{profile.language === 'hi' ? 'आपकी कुल डिजिटल बचत' : 'Lifetime savings recorded'}</span>
          </div>
        </div>

        {/* Monthly Savings */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-teal-300 dark:hover:border-teal-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.monthlySavings}
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-teal-700 dark:text-teal-300 tabular-nums">
            {formatINR(monthlySavings)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {profile.language === 'hi' ? 'चालू माह का संचय' : 'Current month savings'}
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-blue-300 dark:hover:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.totalIncome}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-300 tabular-nums">
            {formatINR(totalIncome)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {profile.language === 'hi' ? 'वेतन व अतिरिक्त आय' : 'Salary & other sources'}
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-rose-300 dark:hover:border-rose-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.totalExpenses}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-rose-700 dark:text-rose-300 tabular-nums">
            {formatINR(totalExpenses)}
          </div>
          <div className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            {profile.language === 'hi' ? `मासिक खर्च: ${formatINR(monthlyExpenses)}` : `This Month: ${formatINR(monthlyExpenses)}`}
          </div>
        </div>
      </div>

      {/* 3. Fast Action Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onOpenAddModal('saving')}
          className="flex items-center justify-center gap-2 p-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.quickAddSaving}</span>
        </button>

        <button
          onClick={() => onOpenAddModal('expense')}
          className="flex items-center justify-center gap-2 p-3.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.quickAddExpense}</span>
        </button>

        <button
          onClick={() => onOpenAddModal('income')}
          className="flex items-center justify-center gap-2 p-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.quickAddIncome}</span>
        </button>

        <button
          onClick={onOpenCalculator}
          className="flex items-center justify-center gap-2 p-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-900 font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Calculator className="w-4 h-4" />
          <span>{profile.language === 'hi' ? 'बचत कैलकुलेटर' : 'Target Calculator'}</span>
        </button>
      </div>

      {/* 4. Two-Column Layout: Active Goals & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols on lg): Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.recentTransactions}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profile.language === 'hi' ? 'हालिया बचत, खर्च व आय प्रविष्टियां' : 'Latest financial entries'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('saving')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Coins className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs">{t.noTransactionsYet}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentTransactions.map((tx) => {
                const meta = getCategoryMeta(tx.type, tx.category);
                const Icon = meta.icon;
                const catKey = `cat_${tx.category}` as keyof typeof t;
                const catName = t[catKey] || tx.category;

                const isSaving = tx.type === 'saving';
                const isExpense = tx.type === 'expense';
                const isIncome = tx.type === 'income';

                return (
                  <div
                    key={tx.id}
                    className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 px-2 -mx-2 rounded-xl transition-colors"
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
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {tx.date}
                          </span>
                        </div>
                        {tx.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {tx.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-sm font-bold tabular-nums ${
                          isSaving
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isIncome
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isExpense ? '-' : '+'}
                        {formatINR(tx.amount)}
                      </span>
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (1 Col on lg): Active Goals Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.activeGoals}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {goals.length} {profile.language === 'hi' ? 'लक्ष्य प्रगति पर' : 'goals in progress'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('goals')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{t.viewAll}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => {
                const percent = Math.min(
                  100,
                  Math.round((goal.savedAmount / goal.targetAmount) * 100)
                );
                const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);

                return (
                  <div
                    key={goal.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {goal.title}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {percent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{formatINR(goal.savedAmount)} / {formatINR(goal.targetAmount)}</span>
                      <button
                        onClick={() => onOpenAddModal('saving', goal.id)}
                        className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>+ {profile.language === 'hi' ? 'जमा करें' : 'Deposit'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('goals')}
              className="w-full py-2.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Target className="w-4 h-4" />
              <span>{t.addNewGoal}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
