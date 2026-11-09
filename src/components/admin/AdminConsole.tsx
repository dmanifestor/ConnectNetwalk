import React, { useState } from 'react';
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Activity,
  Briefcase,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminConsole: React.FC = () => {
  const { posts, flagPost, removePost, addToast, activeRole } = useApp();

  const [activeView, setActiveView] = useState<'moderation' | 'ats' | 'metrics'>('moderation');

  // Candidate ATS Pipeline state
  const [candidates, setCandidates] = useState([
    { id: 'c1', name: 'Alex Rivera', role: 'Staff AI Systems Architect', stage: 'Interview', match: '96%' },
    { id: 'c2', name: 'Marcus Chen', role: 'Lead Infrastructure Engineer', stage: 'Screening', match: '91%' },
    { id: 'c3', name: 'Elena Rostova', role: 'VP Research', stage: 'Offer', match: '98%' },
    { id: 'c4', name: 'Jordan Hayes', role: 'Senior Systems Dev', stage: 'Applied', match: '84%' },
  ]);

  const flaggedPosts = posts.filter((p) => p.isFlagged);

  const moveCandidate = (id: string, newStage: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage: newStage } : c))
    );
    addToast(`Candidate moved to ${newStage}`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Admin Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeRole === 'super_admin' ? 'Platform Operations & Super Admin' : 'Recruiter ATS & Talent Pipeline'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time content moderation, trust & safety telemetry, and high-velocity recruitment pipeline.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setActiveView('moderation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeView === 'moderation'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Trust & Moderation ({flaggedPosts.length})
          </button>
          <button
            onClick={() => setActiveView('ats')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeView === 'ats'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ATS Candidate Pipeline
          </button>
          <button
            onClick={() => setActiveView('metrics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeView === 'metrics'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Platform Telemetry
          </button>
        </div>
      </div>

      {/* VIEW 1: Trust & Content Moderation */}
      {activeView === 'moderation' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Flagged Content Queue</span>
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">
              AI Auto-Moderation SLA: &lt; 3 mins
            </span>
          </div>

          {flaggedPosts.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {flaggedPosts.map((post) => (
                <div key={post.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Author: {post.authorName} ({post.authorHeadline})
                    </span>
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                      Flagged by Community
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => flagPost(post.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Content</span>
                    </button>
                    <button
                      onClick={() => removePost(post.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Remove Post</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                All queues clear! Zero unresolved reports.
              </p>
              <p>You can flag any post on the home feed to test the real-time moderation workflow.</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ATS Candidate Pipeline Kanban */}
      {activeView === 'ats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Applied', 'Screening', 'Interview', 'Offer'].map((stage) => {
              const stageCandidates = candidates.filter((c) => c.stage === stage);
              return (
                <div
                  key={stage}
                  className="bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{stage}</span>
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[11px] tabular-nums">
                      {stageCandidates.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {stageCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {cand.name}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                            {cand.match}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                          {cand.role}
                        </span>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <select
                            value={cand.stage}
                            onChange={(e) => moveCandidate(cand.id, e.target.value)}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded focus:outline-none"
                          >
                            <option value="Applied">Move: Applied</option>
                            <option value="Screening">Move: Screening</option>
                            <option value="Interview">Move: Interview</option>
                            <option value="Offer">Move: Offer</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: Platform Telemetry */}
      {activeView === 'metrics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Daily Active Users</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">38,420</span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">+18.4% WoW</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Monthly Recurring Rev</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">$428,500</span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">94% gross margin</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Verified Open Jobs</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 block mt-1">1,290</span>
            <span className="text-[11px] text-slate-400 block mt-1">Avg Salary $214k</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">AI Latency (p95)</span>
            <span className="text-2xl font-bold text-sky-600 dark:text-sky-400 block mt-1">280ms</span>
            <span className="text-[11px] text-slate-400 block mt-1">Gemini 3.8 Flash</span>
          </div>
        </div>
      )}

    </div>
  );
};
