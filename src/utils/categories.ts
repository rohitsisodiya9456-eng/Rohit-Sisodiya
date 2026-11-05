/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Coins,
  Gem,
  Building2,
  Banknote,
  ShieldCheck,
  Users,
  TrendingUp,
  HelpCircle,
  Utensils,
  ShoppingCart,
  Home,
  Zap,
  Car,
  ShoppingBag,
  HeartPulse,
  Film,
  GraduationCap,
  Briefcase,
  Store,
  Laptop,
  Percent,
  Gift,
} from 'lucide-react';
import React from 'react';

export const SAVING_CATEGORIES = [
  { id: 'gullak', icon: Coins, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
  { id: 'gold', icon: Gem, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40' },
  { id: 'bank', icon: Building2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
  { id: 'cash', icon: Banknote, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40' },
  { id: 'emergency', icon: ShieldCheck, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { id: 'chitfund', icon: Users, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' },
  { id: 'mutual_fund', icon: TrendingUp, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' },
  { id: 'other', icon: HelpCircle, color: 'text-slate-600 bg-slate-50 dark:bg-slate-800/40' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'food', icon: Utensils, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40' },
  { id: 'groceries', icon: ShoppingCart, color: 'text-lime-600 bg-lime-50 dark:bg-lime-950/40' },
  { id: 'rent', icon: Home, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
  { id: 'utilities', icon: Zap, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
  { id: 'transport', icon: Car, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { id: 'shopping', icon: ShoppingBag, color: 'text-pink-600 bg-pink-50 dark:bg-pink-950/40' },
  { id: 'medical', icon: HeartPulse, color: 'text-red-600 bg-red-50 dark:bg-red-950/40' },
  { id: 'entertainment', icon: Film, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40' },
  { id: 'education', icon: GraduationCap, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40' },
  { id: 'misc', icon: HelpCircle, color: 'text-slate-600 bg-slate-50 dark:bg-slate-800/40' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
  { id: 'business', icon: Store, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { id: 'freelance', icon: Laptop, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' },
  { id: 'interest', icon: Percent, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
  { id: 'gift', icon: Gift, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
  { id: 'other', icon: HelpCircle, color: 'text-slate-600 bg-slate-50 dark:bg-slate-800/40' },
];

/**
 * Format currency with Indian Rupee formatting (en-IN: 1,00,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

/**
 * Get category icon and colors
 */
export function getCategoryMeta(type: 'saving' | 'expense' | 'income', categoryId: string) {
  let list = SAVING_CATEGORIES;
  if (type === 'expense') list = EXPENSE_CATEGORIES;
  if (type === 'income') list = INCOME_CATEGORIES;

  const found = list.find((c) => c.id === categoryId);
  return found || { id: categoryId, icon: Coins, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' };
}
