/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, SavingGoal, UserProfile } from '../types/finance';

const TRANSACTIONS_KEY = 'meri_bachat_transactions_v1';
const GOALS_KEY = 'meri_bachat_goals_v1';
const PROFILE_KEY = 'meri_bachat_profile_v1';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'रोहित सिसौदिया',
  phone: '9876543210',
  email: 'rohitsisodiya@dhandiary.in',
  language: 'hi',
  currency: 'INR',
  reminderEnabled: true,
  reminderTime: '20:00',
  theme: 'light',
  isAuthenticated: true,
  loginMethod: 'guest',
};

// Seed realistic transactions centered around current date
export function generateSeedTransactions(): Transaction[] {
  const today = new Date();
  const format = (d: Date) => d.toISOString().split('T')[0];

  const d0 = format(today);
  const d1 = format(new Date(today.getTime() - 1 * 86400000));
  const d2 = format(new Date(today.getTime() - 2 * 86400000));
  const d3 = format(new Date(today.getTime() - 3 * 86400000));
  const d4 = format(new Date(today.getTime() - 5 * 86400000));
  const d5 = format(new Date(today.getTime() - 7 * 86400000));
  const d6 = format(new Date(today.getTime() - 10 * 86400000));
  const d7 = format(new Date(today.getTime() - 14 * 86400000));
  const d8 = format(new Date(today.getTime() - 20 * 86400000));

  return [
    {
      id: 'tx-1',
      type: 'saving',
      amount: 200,
      date: d0,
      category: 'gullak',
      notes: 'आज की दैनिक गुल्लक बचत (Daily Piggy Bank)',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-2',
      type: 'expense',
      amount: 140,
      date: d0,
      category: 'food',
      notes: 'शाम का नाश्ता व चाय',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-3',
      type: 'saving',
      amount: 500,
      date: d1,
      category: 'gold',
      notes: 'डिजिटल गोल्ड में छोटी बचत',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-4',
      type: 'expense',
      amount: 680,
      date: d1,
      category: 'groceries',
      notes: 'सब्जी और किराना राशन',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-5',
      type: 'saving',
      amount: 250,
      date: d2,
      category: 'cash',
      notes: 'बचे हुए फुटकर नोट अलग रखे',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-6',
      type: 'saving',
      amount: 2000,
      date: d3,
      category: 'emergency',
      goalId: 'goal-1',
      notes: 'आपातकालीन फंड में जमा',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-7',
      type: 'expense',
      amount: 350,
      date: d3,
      category: 'transport',
      notes: 'बाइक पेट्रोल रिफिल',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-8',
      type: 'saving',
      amount: 1000,
      date: d4,
      category: 'bank',
      goalId: 'goal-2',
      notes: 'नए फोन लक्ष्य के लिए बचत',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-9',
      type: 'expense',
      amount: 450,
      date: d5,
      category: 'utilities',
      notes: 'मोबाइल व वाई-फाई रिचार्ज',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-10',
      type: 'saving',
      amount: 300,
      date: d5,
      category: 'gullak',
      notes: 'दैनिक बचत गुल्लक',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-11',
      type: 'saving',
      amount: 1500,
      date: d6,
      category: 'chitfund',
      notes: 'मासिक बीसी / कमेटी बचत',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-12',
      type: 'income',
      amount: 35000,
      date: d7,
      category: 'salary',
      notes: 'मासिक वेतन (Monthly Salary Credited)',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-13',
      type: 'expense',
      amount: 6500,
      date: d7,
      category: 'rent',
      notes: 'कमरे का किराया भुगतान',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-14',
      type: 'saving',
      amount: 5000,
      date: d7,
      category: 'bank',
      goalId: 'goal-1',
      notes: 'सैलरी आते ही 5000 बचत में ट्रांसफर',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-15',
      type: 'income',
      amount: 3500,
      date: d8,
      category: 'freelance',
      notes: 'साइड प्रोजेक्ट अतिरिक्त आमदनी',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function generateSeedGoals(): SavingGoal[] {
  return [
    {
      id: 'goal-1',
      title: 'आपातकालीन फंड (Emergency Fund)',
      titleHi: 'आपातकालीन फंड',
      targetAmount: 50000,
      savedAmount: 28500,
      deadline: '2026-12-31',
      category: 'emergency',
      iconName: 'ShieldCheck',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal-2',
      title: 'नया स्मार्टफोन (New Smartphone)',
      titleHi: 'नया स्मार्टफोन',
      targetAmount: 20000,
      savedAmount: 14000,
      deadline: '2026-08-30',
      category: 'technology',
      iconName: 'Laptop',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal-3',
      title: 'त्योहार व दिवाली शॉपिंग (Festive Fund)',
      titleHi: 'त्योहार व दिवाली शॉपिंग',
      targetAmount: 15000,
      savedAmount: 8500,
      deadline: '2026-11-01',
      category: 'festival',
      iconName: 'Gift',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
  ];
}

// Storage helpers
export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      const initial = generateSeedTransactions();
      saveTransactions(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading transactions:', err);
    return generateSeedTransactions();
  }
}

export function saveTransactions(data: Transaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving transactions:', err);
  }
}

export function loadGoals(): SavingGoal[] {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (!raw) {
      const initial = generateSeedGoals();
      saveGoals(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading goals:', err);
    return generateSeedGoals();
  }
}

export function saveGoals(data: SavingGoal[]): void {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving goals:', err);
  }
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      saveProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading profile:', err);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving profile:', err);
  }
}

/**
 * Export data to CSV format
 */
export function exportToCSV(transactions: Transaction[]): void {
  const headers = ['Date', 'Type', 'Amount (INR)', 'Category', 'Notes', 'Goal ID'];
  const rows = transactions.map((t) => [
    t.date,
    t.type.toUpperCase(),
    t.amount.toString(),
    `"${(t.category || '').replace(/"/g, '""')}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
    t.goalId || '',
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Meri_Bachat_Report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export complete JSON backup
 */
export function exportBackupJSON(transactions: Transaction[], goals: SavingGoal[], profile: UserProfile): void {
  const backup = {
    appName: 'Meri Bachat',
    version: '1.0',
    exportDate: new Date().toISOString(),
    transactions,
    goals,
    profile,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Meri_Bachat_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
