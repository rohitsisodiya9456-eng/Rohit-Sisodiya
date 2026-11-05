/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Coins, Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2, Globe, Sparkles, UserCheck } from 'lucide-react';
import { UserProfile } from '../types/finance';
import { translations } from '../i18n/translations';

interface SplashLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
}

export const SplashLoginModal: React.FC<SplashLoginModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<'splash' | 'login' | 'otp'>('splash');
  const [mode, setMode] = useState<'otp' | 'email' | 'guest'>('otp');
  const [name, setName] = useState<string>(profile.name || 'बचत मित्र');
  const [phone, setPhone] = useState<string>(profile.phone || '9876543210');
  const [email, setEmail] = useState<string>(profile.email || '');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  const t = translations[profile.language];

  if (!isOpen) return null;

  const handleLanguageChange = (lang: 'hi' | 'en') => {
    onSaveProfile({ language: lang });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setStep('otp');
    setEnteredOtp('');
    setOtpError('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow demo OTP 786110 or any 6-digit OTP
    if (enteredOtp.length === 6) {
      onSaveProfile({
        name: name.trim() || 'बचत मित्र',
        phone,
        loginMethod: 'otp',
        isAuthenticated: true,
      });
      onClose();
    } else {
      setOtpError(profile.language === 'hi' ? 'कृपया 6 अंकों का सही OTP दर्ज करें' : 'Please enter valid 6-digit OTP');
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSaveProfile({
      name: name.trim() || 'बचत मित्र',
      email,
      loginMethod: 'email',
      isAuthenticated: true,
    });
    onClose();
  };

  const handleDirectGuestLogin = () => {
    onSaveProfile({
      name: name.trim() || (profile.language === 'hi' ? 'अतिथि बचतकर्ता' : 'Guest Saver'),
      loginMethod: 'guest',
      isAuthenticated: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in no-print">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col relative max-h-[95vh] overflow-y-auto">
        {/* Language selector in top-right */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-sm p-1 rounded-full border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => handleLanguageChange('hi')}
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full transition-colors ${
              profile.language === 'hi'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full transition-colors ${
              profile.language === 'en'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            English
          </button>
        </div>

        {/* STEP 1: SPLASH SCREEN */}
        {step === 'splash' && (
          <div className="p-6 text-center flex flex-col items-center">
            {/* Splash Image Hero */}
            <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 relative bg-emerald-950/20 shadow-inner">
              <img
                src="/src/assets/images/piggy_bank_wealth_gold_1793886508211.jpg"
                alt="Meri Bachat Gullak"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-3">
                <span className="text-white text-xs font-medium tracking-wide flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% सुरक्षित · ऑफलाइन सक्षम डायरी</span>
                </span>
              </div>
            </div>

            {/* App Brand */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-3">
              <Coins className="w-8 h-8 text-amber-200" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.appName}
            </h2>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              "{t.tagline}"
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-4">
              {t.appSubtitle}
            </p>

            <div className="my-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left text-xs text-slate-600 dark:text-slate-300 space-y-1.5 w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{profile.language === 'hi' ? 'रोज़ की बचत का आसान रिकॉर्ड' : 'Daily saving tracking in seconds'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{profile.language === 'hi' ? 'बचत लक्ष्य (₹5,000 से ₹1 लाख तक)' : 'Set saving goals (₹5k to ₹1 Lakh)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{profile.language === 'hi' ? 'कोई बैंक खाता लिंक नहीं होगा' : 'No real money deducted or linked'}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-2.5">
              <button
                onClick={() => setStep('login')}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>{t.quickStart}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleDirectGuestLogin}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t.loginDirectGuest}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOGIN / SIGNUP SCREEN */}
        {step === 'login' && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.loginTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.loginTagline}
              </p>
            </div>

            {/* Login Mode Selector */}
            <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5 text-xs font-semibold">
              <button
                onClick={() => setMode('otp')}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'otp'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.loginWithMobile}
              </button>
              <button
                onClick={() => setMode('email')}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'email'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.loginWithEmail}
              </button>
              <button
                onClick={() => setMode('guest')}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'guest'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {profile.language === 'hi' ? 'सीधे शुरू करें' : 'Direct App'}
              </button>
            </div>

            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {t.enterYourName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. रोहित सिसौदिया"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Mode 1: Mobile + OTP */}
            {mode === 'otp' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.enterMobileNumber}</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 p-2.5 rounded-xl">
                  💡 {t.demoOtpHint}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.sendOtp}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Mode 2: Email + Password */}
            {mode === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.emailAddress}</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {profile.language === 'hi' ? 'पासवर्ड (Password)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.loginNow}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Mode 3: Guest / Direct */}
            {mode === 'guest' && (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <UserCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">
                    {profile.language === 'hi' ? 'सीधा इस्तेमाल' : 'Instant Direct Access'}
                  </p>
                  <p>
                    {profile.language === 'hi'
                      ? 'बिना किसी पासवर्ड या ओटीपी के तुरंत ऐप इस्तेमाल करें। आपका सारा डेटा आपके ब्राउज़र में सुरक्षित रहेगा।'
                      : 'Use the app immediately without password or OTP. All your records stay safe on your device.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDirectGuestLogin}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{profile.language === 'hi' ? 'डायरेक्ट ऐप में जाएं' : 'Enter App Directly'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                onClick={() => setStep('splash')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ← {profile.language === 'hi' ? 'वापस जाएं' : 'Back to Splash'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 'otp' && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.verifyOtp}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.otpSentTo} <span className="font-semibold text-slate-800 dark:text-slate-200">+91 {phone}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="786110"
                  className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
                {otpError && (
                  <p className="text-xs text-rose-500 mt-1 text-center font-medium">
                    {otpError}
                  </p>
                )}
              </div>

              {/* Quick auto-fill button */}
              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setEnteredOtp('786110')}
                  className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  ⚡ {profile.language === 'hi' ? 'डेमो कोड भरें (786110)' : 'Fill Demo Code (786110)'}
                </button>
                <button
                  type="button"
                  onClick={() => setEnteredOtp('')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {t.resendOtp}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t.verifyOtp}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ← {profile.language === 'hi' ? 'नंबर बदलें' : 'Change Number'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
