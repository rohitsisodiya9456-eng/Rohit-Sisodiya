/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trophy,
  Calendar,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Laptop,
  Gift,
  Car,
  Home,
  HelpCircle,
} from 'lucide-react';
import { SavingGoal, UserProfile } from '../types/finance';
import { formatINR } from '../utils/categories';
import { translations } from '../i18n/translations';

interface SavingGoalsScreenProps {
  goals: SavingGoal[];
  profile: UserProfile;
  onCreateGoal: (goal: Omit<SavingGoal, 'id' | 'createdAt' | 'savedAmount' | 'isCompleted'>) => void;
  onDeleteGoal: (id: string) => void;
  onOpenDepositModal: (goalId: string) => void;
}

const PRESET_GOAL_TEMPLATES = [
  { titleHi: 'आपातकालीन फंड (Emergency)', titleEn: 'Emergency Fund', amount: 50000, iconName: 'ShieldCheck' },
  { titleHi: 'नया स्मार्टफोन / लैपटॉप', titleEn: 'New Smartphone / Laptop', amount: 20000, iconName: 'Laptop' },
  { titleHi: 'त्योहार व दिवाली बजट', titleEn: 'Festival & Diwali Shopping', amount: 15000, iconName: 'Gift' },
  { titleHi: 'मिनी बचत फंड (Mini Target)', titleEn: 'Mini Savings Target', amount: 5000, iconName: 'Target' },
  { titleHi: '1 लाख रुपये की महा-बचत', titleEn: '₹1 Lakh Milestone Goal', amount: 100000, iconName: 'Trophy' },
  { titleHi: 'बाइक या वाहन डाउनपेमेंट', titleEn: 'Bike / Vehicle Downpayment', amount: 40000, iconName: 'Car' },
];

export const SavingGoalsScreen: React.FC<SavingGoalsScreenProps> = ({
  goals,
  profile,
  onCreateGoal,
  onDeleteGoal,
  onOpenDepositModal,
}) => {
  const t = translations[profile.language];
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [deadline, setDeadline] = useState<string>(
    new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]
  );
  const [iconName, setIconName] = useState<string>('Target');

  const activeGoals = goals.filter((g) => !g.isCompleted && g.savedAmount < g.targetAmount);
  const completedGoals = goals.filter((g) => g.isCompleted || g.savedAmount >= g.targetAmount);

  const totalTargetSum = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavedSum = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const overallPercentage = totalTargetSum > 0 ? Math.min(100, Math.round((totalSavedSum / totalTargetSum) * 100)) : 0;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(targetAmount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onCreateGoal({
      title: title.trim(),
      targetAmount: parsedAmount,
      deadline,
      category: 'general',
      iconName,
    });

    setTitle('');
    setTargetAmount('');
    setIsCreating(false);
  };

  const handleApplyTemplate = (tpl: typeof PRESET_GOAL_TEMPLATES[0]) => {
    setTitle(profile.language === 'hi' ? tpl.titleHi : tpl.titleEn);
    setTargetAmount(tpl.amount.toString());
    setIconName(tpl.iconName);
    setIsCreating(true);
  };

  const getDaysLeft = (deadlineDate: string) => {
    const diffTime = new Date(deadlineDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.goalsTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.goalsSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewGoal}</span>
        </button>
      </div>

      {/* Aggregate Goal Progress Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {profile.language === 'hi' ? 'सभी लक्ष्यों की कुल प्रगति' : 'Total Progress Across All Goals'}
            </span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {overallPercentage}% {t.targetAchieved}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>
              {profile.language === 'hi' ? 'जमा हुआ:' : 'Saved:'}{' '}
              <strong className="text-slate-900 dark:text-white tabular-nums">{formatINR(totalSavedSum)}</strong>
            </span>
            <span>
              {profile.language === 'hi' ? 'कुल लक्ष्य:' : 'Total Target:'}{' '}
              <strong className="text-slate-900 dark:text-white tabular-nums">{formatINR(totalTargetSum)}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {completedGoals.length} {profile.language === 'hi' ? 'लक्ष्य पूरे हुए' : 'Goals Achieved'}
            </span>
            <span className="text-[11px] text-slate-500">
              {activeGoals.length} {profile.language === 'hi' ? 'लक्ष्य चालू' : 'in progress'}
            </span>
          </div>
        </div>
      </div>

      {/* CREATE GOAL MODAL / FORM */}
      {isCreating && (
        <div className="bg-emerald-50/50 dark:bg-slate-900/90 rounded-3xl border-2 border-emerald-500/50 p-6 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.addNewGoal}
              </h3>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              {t.cancel}
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.goalName}
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. आपातकालीन फंड या नया फोन"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.targetAmount} (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="100"
                  required
                  placeholder="10000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.targetDeadline}
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Popular Templates Row */}
            <div>
              <span className="block text-xs text-slate-500 mb-2">
                {t.popularTargets}:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_GOAL_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {profile.language === 'hi' ? tpl.titleHi : tpl.titleEn} ({formatINR(tpl.amount)})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
              >
                {t.addNewGoal}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2.5 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ACTIVE GOALS GRID */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          {t.activeGoals} ({activeGoals.length})
        </h2>

        {activeGoals.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
            <Target className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-500">
              {profile.language === 'hi'
                ? 'अभी कोई सक्रिय लक्ष्य नहीं है। ऊपर दिए बटन से अपना पहला लक्ष्य बनाएं!'
                : 'No active goals yet. Click above to create your first target!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeGoals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
              const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
              const daysLeft = getDaysLeft(goal.deadline);

              return (
                <div
                  key={goal.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-800 transition-all group"
                >
                  <div>
                    {/* Top Row: Icon + Title + Delete */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                            {goal.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{goal.deadline}</span>
                            <span>·</span>
                            <span className={daysLeft < 30 ? 'text-amber-600 font-semibold' : ''}>
                              {daysLeft > 0 ? `${daysLeft} ${t.daysLeft}` : (profile.language === 'hi' ? 'समय समाप्त' : 'Expired')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar & Percent */}
                    <div className="space-y-1.5 my-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                          {profile.language === 'hi' ? 'जमा:' : 'Saved:'} <strong className="text-slate-900 dark:text-white">{formatINR(goal.savedAmount)}</strong>
                        </span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {percent}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{t.remaining}: {formatINR(remaining)}</span>
                        <span>{t.targetAmount}: {formatINR(goal.targetAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button: Deposit Into Goal */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onOpenDepositModal(goal.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.depositToGoal}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* COMPLETED GOALS (ACHIEVED) */}
      {completedGoals.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>{t.completedGoals} ({completedGoals.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-amber-50/40 dark:bg-amber-950/20 rounded-3xl border border-amber-200 dark:border-amber-900/40 p-5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{t.goalCompletedNotice}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {goal.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 tabular-nums">
                    {formatINR(goal.savedAmount)} {profile.language === 'hi' ? 'सफलतापूर्वक बचाए गए' : 'successfully accumulated'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-600">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
