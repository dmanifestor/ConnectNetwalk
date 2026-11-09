import React, { useState } from 'react';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Shield,
  Eye,
  Mail,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PremiumHub: React.FC = () => {
  const { currentUser, updateProfile, addToast } = useApp();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');

  const handleActivatePlan = (planName: string) => {
    updateProfile({ isPremium: true });
    addToast(`${planName} activated on your account!`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-900/60">
          <Crown className="w-3.5 h-3.5" />
          <span>ConnectNetwalk Premium & Enterprise</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Accelerate Your Career with Unfair AI Advantages
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Get 3x more recruiter visibility, unlimited messaging, and deep Gemini 3.8 Flash technical roadmaps.
        </p>

        {/* Billing Switch */}
        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold mt-4">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-1.5 rounded-lg transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              billingPeriod === 'annual'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] text-emerald-600 font-bold">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Tier 1: Career Pro */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Career Pro
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                For Job Seekers
              </span>
            </div>

            <div className="tabular-nums">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {billingPeriod === 'annual' ? '$24' : '$29'}
              </span>
              <span className="text-xs text-slate-400"> / month billed {billingPeriod}</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              {[
                'See who viewed your profile in past 365 days',
                '25 monthly InMail credits to reach anyone',
                'Gemini 3.8 Flash AI Resume & ATS Diagnostic',
                'Direct salary benchmarking & percentile comparisons',
                'PRO badge and top-of-feed applicant spotlight',
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleActivatePlan('Career Pro')}
            className="mt-8 w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all active:scale-98"
          >
            Activate Career Pro
          </button>
        </div>

        {/* Tier 2: Recruiter Enterprise */}
        <div className="bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-900/90 rounded-3xl border-2 border-blue-500 p-8 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
            Most Popular for Teams
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                Recruiter Enterprise
              </span>
            </div>

            <div className="tabular-nums">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {billingPeriod === 'annual' ? '$159' : '$199'}
              </span>
              <span className="text-xs text-slate-400"> / month billed {billingPeriod}</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              {[
                'Full Recruiter ATS pipeline (Applied &rarr; Offer)',
                '150 monthly InMail credits with 92% open rate',
                'Advanced 25+ Boolean search filters & talent mapping',
                'AI Candidate match scoring with custom rubric',
                'Direct Supabase / PostgreSQL sync & data export',
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleActivatePlan('Recruiter Enterprise')}
            className="mt-8 w-full py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm transition-all active:scale-98"
          >
            Activate Recruiter Enterprise
          </button>
        </div>

      </div>

    </div>
  );
};
