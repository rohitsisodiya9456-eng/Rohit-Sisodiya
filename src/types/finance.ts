/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'saving' | 'expense' | 'income';

export type SavingCategory =
  | 'gullak'      // Gullak / Piggy Bank
  | 'gold'        // Digital Gold
  | 'bank'        // Bank FD / RD / Savings
  | 'cash'        // Cash in Hand
  | 'emergency'   // Emergency Fund
  | 'chitfund'    // Chit Fund / Committee
  | 'mutual_fund' // SIP / Investment
  | 'other';

export type ExpenseCategory =
  | 'food'
  | 'groceries'
  | 'rent'
  | 'utilities'
  | 'transport'
  | 'shopping'
  | 'medical'
  | 'entertainment'
  | 'education'
  | 'misc';

export type IncomeCategory =
  | 'salary'
  | 'business'
  | 'freelance'
  | 'interest'
  | 'gift'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
  notes?: string;
  goalId?: string; // Linked goal if saved towards a goal
  createdAt: string;
}

export interface SavingGoal {
  id: string;
  title: string;
  titleHi?: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string; // YYYY-MM-DD
  category: string;
  iconName: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  language: 'hi' | 'en';
  currency: string;
  reminderEnabled: boolean;
  reminderTime: string;
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  loginMethod: 'otp' | 'email' | 'guest';
}

export type NavTab = 'home' | 'saving' | 'goals' | 'reports' | 'profile';

export interface CategoryInfo {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  color: string; // Tailwind color class or hex
}
