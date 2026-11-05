/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calculator, Calendar, ArrowRight, Coins, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/categories';
import { translations } from '../i18n/translations';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hi' | 'en';
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language];
  const [calcMode, setCalcMode] = useState<'duration' | 'requiredRate'>('duration');

  // Mode 1: Duration calculation
  const [targetAmount, setTargetAmount] = useState<string>('50000');
  const [savePeriod, setSavePeriod] = useState<'daily' | 'monthly'>('daily');
  const [savingPace, setSavingPace] = useState<string>('200');

  // Mode 2: Required saving calculation
  const [targetAmount2, setTargetAmount2] = useState<string>('100000');
  const [targetMonths, setTargetMonths] = useState<string>('12');

  if (!isOpen) return null;

  // Calculations for Mode 1
  const targetNum = parseFloat(targetAmount) || 0;
  const paceNum = parseFloat(savingPace) || 0;

  let totalDaysNeeded = 0;
  let totalMonthsNeeded = 0;
  let estimatedFinishDate = new Date();

  if (targetNum > 0 && paceNum > 0) {
    if (savePeriod === 'daily') {
      totalDaysNeeded = Math.ceil(targetNum / paceNum);
      totalMonthsNeeded = Math.round((totalDaysNeeded / 30.4) * 10) / 10;
      estimatedFinishDate = new Date(Date.now() + totalDaysNeeded * 86400000);
    } else {
      totalMonthsNeeded = Math.ceil(targetNum / paceNum);
      totalDaysNeeded = Math.round(totalMonthsNeeded * 30.4);
      estimatedFinishDate = new Date(Date.now() + totalDaysNeeded * 86400000);
    }
  }

  // Calculations for Mode 2
  const targetNum2 = parseFloat(targetAmount2) || 0;
  const monthsNum2 = parseFloat(targetMonths) || 1;
  const requiredMonthly = monthsNum2 > 0 ? Math.ceil(targetNum2 / monthsNum2) : 0;
  const requiredDaily = monthsNum2 > 0 ? Math.ceil(targetNum2 / (monthsNum2 * 30.4)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in no-print">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.calculatorTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.calculatorSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Mode Switch */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1 text-xs font-semibold">
            <button
              onClick={() => setCalcMode('duration')}
              className={`py-2 rounded-lg transition-all ${
                calcMode === 'duration'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.calcMode1}
            </button>
            <button
              onClick={() => setCalcMode('requiredRate')}
              className={`py-2 rounded-lg transition-all ${
                calcMode === 'requiredRate'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.calcMode2}
            </button>
          </div>

          {/* MODE 1: Know how long it takes */}
          {calcMode === 'duration' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.targetToAchieve}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Pacing daily / monthly */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {savePeriod === 'daily' ? t.howMuchCanSaveDaily : t.howMuchCanSaveMonthly}
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSavePeriod('daily')}
                      className={`px-2 py-0.5 rounded-md ${
                        savePeriod === 'daily'
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      {language === 'hi' ? 'दैनिक' : 'Daily'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSavePeriod('monthly')}
                      className={`px-2 py-0.5 rounded-md ${
                        savePeriod === 'monthly'
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      {language === 'hi' ? 'मासिक' : 'Monthly'}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={savingPace}
                    onChange={(e) => setSavingPace(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Preset suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(savePeriod === 'daily' ? [50, 100, 200, 500] : [2000, 3000, 5000, 10000]).map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSavingPace(amt.toString())}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-900 transition-colors"
                    >
                      ₹{amt.toLocaleString('en-IN')}/{savePeriod === 'daily' ? 'दिन' : 'माह'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Showcase */}
              <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-3">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block">
                  {t.targetWillCompleteIn}:
                </span>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-900 dark:text-amber-200 tabular-nums">
                    {totalMonthsNeeded}
                  </span>
                  <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
                    {t.months} ({totalDaysNeeded} {t.days})
                  </span>
                </div>

                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
                  <span>{t.estimatedDate}:</span>
                  <span className="font-bold tabular-nums">
                    {estimatedFinishDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: Know required saving from deadline months */}
          {calcMode === 'requiredRate' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.targetToAchieve}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={targetAmount2}
                    onChange={(e) => setTargetAmount2(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'कितने महीनों में लक्ष्य पूरा करना है?' : 'Target duration (months)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={targetMonths}
                  onChange={(e) => setTargetMonths(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Result Showcase */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">
                  {language === 'hi' ? 'आवश्यक बचत राशि:' : 'Required Savings Rate:'}
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-emerald-200/50">
                    <span className="text-[11px] text-slate-500 block">{t.requiredDailySaving}</span>
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                      {formatINR(requiredDaily)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/ दिन</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-emerald-200/50">
                    <span className="text-[11px] text-slate-500 block">{t.requiredMonthlySaving}</span>
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                      {formatINR(requiredMonthly)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/ महीना</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inspirational Saving Insight */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-amber-500 shrink-0" />
            <p>
              💡 {language === 'hi'
                ? 'यदि आप रोज़ केवल ₹100 बचाते हैं, तो 1 साल में ₹36,500 और 3 साल में ₹1,09,500 जमा हो जाते हैं!'
                : 'Saving just ₹100 a day accumulates into ₹36,500 in one year and over ₹1 Lakh in 3 years!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
