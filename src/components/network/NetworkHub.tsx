import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  Search,
  Check,
  X,
  Sparkles,
  MapPin,
  Building,
  Mail,
  Send,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Connection } from '../../types';

export const NetworkHub: React.FC = () => {
  const {
    connections,
    acceptConnection,
    rejectConnection,
    sendConnectionRequest,
    setActiveTab,
    addToast,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'suggested'>('all');

  // AI outreach modal state
  const [outreachTarget, setOutreachTarget] = useState<Connection | null>(null);
  const [senderGoal, setSenderGoal] = useState('Connect about distributed ML inference and collaborate');
  const [aiGeneratedMessage, setAiGeneratedMessage] = useState('');
  const [isGeneratingAiOutreach, setIsGeneratingAiOutreach] = useState(false);

  const pendingConnections = connections.filter((c) => c.status === 'pending');
  const connectedList = connections.filter((c) => c.status === 'connected');
  const suggestedList = connections.filter((c) => c.status === 'suggested');

  const filteredConnections = connections.filter((c) => {
    if (activeFilter === 'pending' && c.status !== 'pending') return false;
    if (activeFilter === 'suggested' && c.status !== 'suggested') return false;
    if (activeFilter === 'all' && c.status !== 'connected') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleGenerateOutreach = async () => {
    if (!outreachTarget) return;
    setIsGeneratingAiOutreach(true);
    try {
      const res = await fetch('/api/gemini/outreach-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: outreachTarget.name,
          recipientRole: outreachTarget.headline,
          senderGoal,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.messageBody) {
        setAiGeneratedMessage(data.data.messageBody);
        addToast('High-converting warm outreach crafted with Gemini 3.8 Flash!', 'success');
      } else {
        throw new Error(data.error || 'Failed to craft outreach');
      }
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Error generating AI outreach.', 'error');
    } finally {
      setIsGeneratingAiOutreach(false);
    }
  };

  const handleSendCustomInvite = () => {
    if (outreachTarget) {
      sendConnectionRequest(outreachTarget.id);
      setOutreachTarget(null);
      setAiGeneratedMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Network Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>My Professional Network</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grow, nurture, and strategically expand your connections with Silicon Valley founders and staff engineers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 block tabular-nums">
              {connectedList.length + 840}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Verified Connections
            </span>
          </div>
        </div>
      </div>

      {/* Pending Invitations Banner (if any) */}
      {pendingConnections.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Pending Invitations ({pendingConnections.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingConnections.map((conn) => (
              <div
                key={conn.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conn.avatar}
                    alt={conn.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {conn.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                      {conn.headline}
                    </p>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {conn.mutualCount} mutual connections
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => rejectConnection(conn.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Ignore
                  </button>
                  <button
                    onClick={() => acceptConnection(conn.id)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Connected ({connectedList.length})
          </button>
          <button
            onClick={() => setActiveFilter('suggested')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeFilter === 'suggested'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            People You May Know ({suggestedList.length})
          </button>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connections..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid of Connections / Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConnections.map((conn) => (
          <div
            key={conn.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={conn.avatar}
                  alt={conn.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {conn.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {conn.headline}
                  </p>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 block mt-1">
                    {conn.company}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 tabular-nums">
                {conn.mutualCount} mutual connections
                {conn.connectedDate && ` · ${conn.connectedDate}`}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              {conn.status === 'connected' ? (
                <button
                  onClick={() => setActiveTab('messages')}
                  className="w-full py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              ) : (
                <div className="w-full flex items-center gap-2">
                  <button
                    onClick={() => {
                      setOutreachTarget(conn);
                      setAiGeneratedMessage('');
                    }}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 flex items-center justify-center gap-1 transition-colors"
                    title="Write personalized note with AI"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    <span>AI Note</span>
                  </button>
                  <button
                    onClick={() => sendConnectionRequest(conn.id)}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Outreach Note Modal */}
      {outreachTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Craft AI Outreach for {outreachTarget.name}
                </h3>
              </div>
              <button
                onClick={() => setOutreachTarget(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                  Your Primary Networking Goal
                </label>
                <input
                  type="text"
                  value={senderGoal}
                  onChange={(e) => setSenderGoal(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateOutreach}
                disabled={isGeneratingAiOutreach}
                className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isGeneratingAiOutreach ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Writing with Gemini 3.8 Flash...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Personalized Invitation Note</span>
                  </>
                )}
              </button>

              {aiGeneratedMessage && (
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Generated Note Draft (Ready to send)
                  </label>
                  <textarea
                    value={aiGeneratedMessage}
                    onChange={(e) => setAiGeneratedMessage(e.target.value)}
                    rows={4}
                    className="w-full p-3 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setOutreachTarget(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCustomInvite}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
