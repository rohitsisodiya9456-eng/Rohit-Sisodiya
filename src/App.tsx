/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  loadTransactions,
  saveTransactions,
  loadGoals,
  saveGoals,
  loadProfile,
  saveProfile,
  generateSeedTransactions,
  generateSeedGoals,
  DEFAULT_PROFILE,
} from './utils/storage';
import { Transaction, SavingGoal, UserProfile, NavTab, TransactionType } from './types/finance';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { DailySavingScreen } from './components/DailySavingScreen';
import { SavingGoalsScreen } from './components/SavingGoalsScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AddTransactionModal } from './components/AddTransactionModal';
import { CalculatorModal } from './components/CalculatorModal';
import { ReminderModal } from './components/ReminderModal';
import { SplashLoginModal } from './components/SplashLoginModal';
import { translations } from './i18n/translations';
import { Bell, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [goals, setGoals] = useState<SavingGoal[]>(() => loadGoals());
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<TransactionType>('saving');
  const [addModalGoalId, setAddModalGoalId] = useState<string>('');

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isSplashLoginOpen, setIsSplashLoginOpen] = useState(false);

  // In-app alert / simulated notification
  const [notificationBanner, setNotificationBanner] = useState<{
    show: boolean;
    title: string;
    message: string;
  } | null>(null);

  // Sync theme to <html> tag
  useEffect(() => {
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.theme]);

  // Persist transactions
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Persist goals
  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  // Persist profile
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Profile update handler
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Add transaction handler
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const created: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [created, ...prev]);

    // If this transaction was a saving linked to a goal, increment the goal's savedAmount
    if (newTx.type === 'saving' && newTx.goalId) {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id === newTx.goalId) {
            const nextAmount = g.savedAmount + newTx.amount;
            return {
              ...g,
              savedAmount: nextAmount,
              isCompleted: nextAmount >= g.targetAmount,
            };
          }
          return g;
        })
      );
    }
  };

  // Quick 1-tap save handler
  const handleQuickSave = (amount: number) => {
    handleAddTransaction({
      type: 'saving',
      amount,
      date: new Date().toISOString().split('T')[0],
      category: 'gullak',
      notes: profile.language === 'hi' ? 'झटपट गुल्लक बचत' : 'Quick Piggy Save',
    });

    setNotificationBanner({
      show: true,
      title: profile.language === 'hi' ? 'बचत सफल!' : 'Saved Successfully!',
      message:
        profile.language === 'hi'
          ? `शानदार! आपकी गुल्लक में ₹${amount} जुड़ गए हैं।`
          : `Awesome! ₹${amount} added to your piggy bank.`,
    });
    setTimeout(() => setNotificationBanner(null), 4000);
  };

  // Delete transaction handler
  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    // If was linked to a goal, deduct from goal
    if (tx.type === 'saving' && tx.goalId) {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id === tx.goalId) {
            const nextAmount = Math.max(0, g.savedAmount - tx.amount);
            return {
              ...g,
              savedAmount: nextAmount,
              isCompleted: nextAmount >= g.targetAmount,
            };
          }
          return g;
        })
      );
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Goals handler
  const handleCreateGoal = (
    newGoal: Omit<SavingGoal, 'id' | 'createdAt' | 'savedAmount' | 'isCompleted'>
  ) => {
    const created: SavingGoal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      savedAmount: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, created]);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleOpenDepositModal = (goalId: string) => {
    setAddModalType('saving');
    setAddModalGoalId(goalId);
    setIsAddModalOpen(true);
  };

  const handleOpenAddModal = (
    type: 'saving' | 'expense' | 'income' = 'saving',
    goalId?: string
  ) => {
    setAddModalType(type);
    setAddModalGoalId(goalId || '');
    setIsAddModalOpen(true);
  };

  // Trigger simulated reminder
  const handleTriggerTestReminder = () => {
    setIsReminderOpen(false);
    setNotificationBanner({
      show: true,
      title: profile.language === 'hi' ? '⏰ रोज़ाना बचत रिमाइंडर' : '⏰ Daily Saving Reminder',
      message:
        profile.language === 'hi'
          ? 'नमस्ते! क्या आज आपने अपनी दैनिक बचत दर्ज की? एक क्लिक में अपनी बचत जोड़ें।'
          : "Hello! Did you record your daily saving today? Add your savings in one tap.",
    });
  };

  // Reset demo data
  const handleResetDemoData = () => {
    if (
      window.confirm(
        profile.language === 'hi'
          ? 'क्या आप डेमो डेटा दोबारा लोड करना चाहते हैं?'
          : 'Do you want to reset and reload demo data?'
      )
    ) {
      const seedTxs = generateSeedTransactions();
      const seedGoals = generateSeedGoals();
      setTransactions(seedTxs);
      setGoals(seedGoals);
      setProfile(DEFAULT_PROFILE);
    }
  };

  // Clear all data
  const handleClearAllData = () => {
    if (
      window.confirm(
        profile.language === 'hi'
          ? 'क्या आप वाकई अपना सारा डेटा साफ़ करना चाहते हैं?'
          : 'Are you sure you want to clear all data?'
      )
    ) {
      setTransactions([]);
      setGoals([]);
    }
  };

  // Restore backup
  const handleRestoreBackup = (data: {
    transactions: Transaction[];
    goals: SavingGoal[];
    profile: UserProfile;
  }) => {
    if (data.transactions) setTransactions(data.transactions);
    if (data.goals) setGoals(data.goals);
    if (data.profile) setProfile((prev) => ({ ...prev, ...data.profile }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenReminder={() => setIsReminderOpen(true)}
        onOpenAddModal={() => handleOpenAddModal('saving')}
      />

      {/* Simulated Push Notification Banner */}
      {notificationBanner && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-down no-print">
          <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-700/80 flex items-start justify-between gap-3 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-300">
                  {notificationBanner.title}
                </p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {notificationBanner.message}
                </p>
                <button
                  onClick={() => {
                    setNotificationBanner(null);
                    handleOpenAddModal('saving');
                  }}
                  className="mt-2 px-3 py-1 bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg shadow-sm hover:bg-amber-300 transition-colors"
                >
                  + {profile.language === 'hi' ? 'बचत जोड़ें' : 'Add Saving'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setNotificationBanner(null)}
              className="text-emerald-300 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-12">
        {currentTab === 'home' && (
          <Dashboard
            transactions={transactions}
            goals={goals}
            profile={profile}
            onNavigate={setCurrentTab}
            onOpenAddModal={handleOpenAddModal}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
            onQuickSave={handleQuickSave}
          />
        )}

        {currentTab === 'saving' && (
          <DailySavingScreen
            transactions={transactions}
            goals={goals}
            profile={profile}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {currentTab === 'goals' && (
          <SavingGoalsScreen
            goals={goals}
            profile={profile}
            onCreateGoal={handleCreateGoal}
            onDeleteGoal={handleDeleteGoal}
            onOpenDepositModal={handleOpenDepositModal}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsScreen
            transactions={transactions}
            profile={profile}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            profile={profile}
            transactions={transactions}
            goals={goals}
            onUpdateProfile={handleUpdateProfile}
            onResetDemoData={handleResetDemoData}
            onClearAllData={handleClearAllData}
            onRestoreBackup={handleRestoreBackup}
            onOpenReminderModal={() => setIsReminderOpen(true)}
            onOpenLoginModal={() => setIsSplashLoginOpen(true)}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={profile.language}
        onOpenAddModal={() => handleOpenAddModal('saving')}
      />

      {/* Floating Action Button for Quick Add (Mobile only) */}
      <div className="md:hidden fixed bottom-20 right-4 z-30 no-print">
        <button
          onClick={() => handleOpenAddModal('saving')}
          className="w-13 h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xl shadow-emerald-600/40 flex items-center justify-center transition-all"
          title={translations[profile.language].quickAddSaving}
        >
          <span className="text-2xl font-bold leading-none">+</span>
        </button>
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        language={profile.language}
        goals={goals}
        defaultType={addModalType}
        defaultGoalId={addModalGoalId}
      />

      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        language={profile.language}
      />

      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onTriggerTestReminder={handleTriggerTestReminder}
      />

      <SplashLoginModal
        isOpen={isSplashLoginOpen}
        onClose={() => setIsSplashLoginOpen(false)}
        profile={profile}
        onSaveProfile={handleUpdateProfile}
      />
    </div>
  );
}
