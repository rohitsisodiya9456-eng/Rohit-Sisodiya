/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  Coins,
  Wallet,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';
import { Transaction, UserProfile } from '../types/finance';
import { translations } from '../i18n/translations';
import { formatINR, getCategoryMeta, SAVING_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories';
import { exportToCSV } from '../utils/storage';

interface ReportsScreenProps {
  transactions: Transaction[];
  profile: UserProfile;
}

type Timeframe = 'week' | 'month' | 'year' | 'all';

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  transactions,
  profile,
}) => {
  const t = translations[profile.language];
  const [timeframe, setTimeframe] = useState<Timeframe>('month');

  // Filter transactions based on timeframe
  const now = new Date();
  const filtered = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    if (timeframe === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 86400000);
      return txDate >= oneWeekAgo;
    }
    if (timeframe === 'month') {
      return (
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    }
    if (timeframe === 'year') {
      return txDate.getFullYear() === now.getFullYear();
    }
    return true; // all
  });

  // Calculate totals
  const totalSavings = filtered
    .filter((tx) => tx.type === 'saving')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalIncome = filtered
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = filtered
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netSavingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;
  const netBalance = totalIncome - totalExpenses;

  // Monthly breakdown for bar chart (last 6 months)
  const monthNames = profile.language === 'hi'
    ? ['जन', 'फ़र', 'मार्च', 'अप्रै', 'मई', 'जून', 'जुला', 'अग', 'सितं', 'अक्टू', 'नव', 'दिस']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const last6MonthsData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const savingsInMonth = transactions
      .filter((tx) => tx.type === 'saving' && tx.date.startsWith(key))
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expensesInMonth = transactions
      .filter((tx) => tx.type === 'expense' && tx.date.startsWith(key))
      .reduce((sum, tx) => sum + tx.amount, 0);

    last6MonthsData.push({
      key,
      label: `${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`,
      savings: savingsInMonth,
      expenses: expensesInMonth,
    });
  }

  const maxChartVal = Math.max(
    ...last6MonthsData.map((d) => Math.max(d.savings, d.expenses)),
    1000
  );

  // Category breakdown for expenses
  const expenseCatMap: Record<string, number> = {};
  filtered
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      expenseCatMap[tx.category] = (expenseCatMap[tx.category] || 0) + tx.amount;
    });

  const expenseCategoryEntries = Object.entries(expenseCatMap).sort((a, b) => b[1] - a[1]);

  // Saving category distribution
  const savingCatMap: Record<string, number> = {};
  filtered
    .filter((tx) => tx.type === 'saving')
    .forEach((tx) => {
      savingCatMap[tx.category] = (savingCatMap[tx.category] || 0) + tx.amount;
    });

  const savingCategoryEntries = Object.entries(savingCatMap).sort((a, b) => b[1] - a[1]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportToCSV(filtered);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.reportsTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.reportsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.exportCsv}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* Timeframe Filter Tabs (No-Print) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-md no-print">
        <button
          onClick={() => setTimeframe('week')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            timeframe === 'week'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.timeframeWeek}
        </button>
        <button
          onClick={() => setTimeframe('month')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            timeframe === 'month'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.timeframeMonth}
        </button>
        <button
          onClick={() => setTimeframe('year')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            timeframe === 'year'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.timeframeYear}
        </button>
        <button
          onClick={() => setTimeframe('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            timeframe === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.timeframeAll}
        </button>
      </div>

      {/* Printable Report Header (Visible when printed) */}
      <div className="hidden print:block mb-4 border-b pb-3">
        <h1 className="text-xl font-bold">मेरी बचत (Meri Bachat) - वित्तीय रिपोर्ट</h1>
        <p className="text-xs text-gray-600">खाताधारक: {profile.name} | दिनांक: {new Date().toLocaleDateString()}</p>
        <p className="text-xs text-gray-500">{t.noMoneyDisclaimer}</p>
      </div>

      {/* 3 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.totalSavings} ({timeframe})
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {formatINR(totalSavings)}
          </div>
          {totalIncome > 0 && (
            <p className="text-[11px] text-emerald-600 mt-1">
              बचत दर: {netSavingsRate}% of total income
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.totalIncome}
          </span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
            {formatINR(totalIncome)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            कुल प्राप्त आमदनी
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.totalExpenses}
          </span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
            {formatINR(totalExpenses)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {profile.language === 'hi' ? `शुद्ध बचत: ${formatINR(netBalance)}` : `Net Margin: ${formatINR(netBalance)}`}
          </p>
        </div>
      </div>

      {/* Visual Chart: 6 Months Savings vs Expenses Trend (SVG Responsive) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm print-break-inside-avoid">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.monthlyTrends}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.language === 'hi' ? 'पिछले 6 महीनों की बचत व खर्च का तुलनात्मक चार्ट' : 'Last 6 months comparison'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
              <span>{t.navSaving}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-400 inline-block" />
              <span>{t.totalExpenses}</span>
            </div>
          </div>
        </div>

        {/* SVG / Bar Chart Representation */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
          {last6MonthsData.map((item, idx) => {
            const savingHeightPercent = Math.min(100, Math.max(5, (item.savings / maxChartVal) * 100));
            const expenseHeightPercent = Math.min(100, Math.max(5, (item.expenses / maxChartVal) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2 py-1 rounded-md mb-2 shadow-lg whitespace-nowrap pointer-events-none tabular-nums z-10">
                  बचत: {formatINR(item.savings)} | खर्च: {formatINR(item.expenses)}
                </div>

                {/* Bars Container */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-44">
                  {/* Saving Bar (Emerald) */}
                  <div
                    className="w-1/2 max-w-[28px] bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition-all duration-500 relative"
                    style={{ height: `${savingHeightPercent}%` }}
                    title={`Saving: ${formatINR(item.savings)}`}
                  />
                  {/* Expense Bar (Rose) */}
                  <div
                    className="w-1/2 max-w-[28px] bg-rose-400 hover:bg-rose-500 rounded-t-lg transition-all duration-500 relative"
                    style={{ height: `${expenseHeightPercent}%` }}
                    title={`Expense: ${formatINR(item.expenses)}`}
                  />
                </div>

                {/* Month Label */}
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2 truncate">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Breakdown: Savings by Category & Expenses by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-break-inside-avoid">
        {/* Savings Mediums */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>{t.savingsBreakdown}</span>
            </h2>
            <span className="text-xs font-bold text-emerald-600 tabular-nums">
              {formatINR(totalSavings)}
            </span>
          </div>

          {savingCategoryEntries.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">{t.noTransactionsYet}</p>
          ) : (
            <div className="space-y-3">
              {savingCategoryEntries.map(([catId, amount]) => {
                const meta = getCategoryMeta('saving', catId);
                const Icon = meta.icon;
                const catKey = `cat_${catId}` as keyof typeof t;
                const catName = t[catKey] || catId;
                const percent = totalSavings > 0 ? Math.round((amount / totalSavings) * 100) : 0;

                return (
                  <div key={catId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${meta.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {catName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 tabular-nums text-[11px]">{percent}%</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {formatINR(amount)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expenses by Category */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-rose-600" />
              <span>{t.expenseBreakdown}</span>
            </h2>
            <span className="text-xs font-bold text-rose-600 tabular-nums">
              {formatINR(totalExpenses)}
            </span>
          </div>

          {expenseCategoryEntries.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">इस अवधि में कोई खर्च नहीं है।</p>
          ) : (
            <div className="space-y-3">
              {expenseCategoryEntries.map(([catId, amount]) => {
                const meta = getCategoryMeta('expense', catId);
                const Icon = meta.icon;
                const catKey = `cat_${catId}` as keyof typeof t;
                const catName = t[catKey] || catId;
                const percent = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;

                return (
                  <div key={catId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${meta.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {catName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 tabular-nums text-[11px]">{percent}%</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                          {formatINR(amount)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Itemized Financial Ledger Table for Reporting / Auditing */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm print-break-inside-avoid">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          {profile.language === 'hi' ? 'विस्तृत लेन-देन विवरण (Statement)' : 'Itemized Transaction Ledger'}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3">{t.date}</th>
                <th className="py-2.5 px-3">{profile.language === 'hi' ? 'प्रकार' : 'Type'}</th>
                <th className="py-2.5 px-3">{t.category}</th>
                <th className="py-2.5 px-3">{t.notes}</th>
                <th className="py-2.5 px-3 text-right">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => {
                const catKey = `cat_${item.category}` as keyof typeof t;
                const catName = t[catKey] || item.category;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {item.date}
                    </td>
                    <td className="py-2.5 px-3 uppercase text-[10px] font-bold">
                      <span
                        className={
                          item.type === 'saving'
                            ? 'text-emerald-600'
                            : item.type === 'income'
                            ? 'text-blue-600'
                            : 'text-rose-600'
                        }
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {catName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                      {item.notes || '-'}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                        item.type === 'saving'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : item.type === 'income'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.type === 'expense' ? '-' : '+'}
                      {formatINR(item.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
