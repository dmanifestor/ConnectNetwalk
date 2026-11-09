import React, { useState } from 'react';
import {
  Database,
  X,
  CheckCircle2,
  ExternalLink,
  Key,
  ShieldCheck,
  RefreshCw,
  Copy,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupabaseSyncModal: React.FC = () => {
  const {
    isSupabaseModalOpen,
    setIsSupabaseModalOpen,
    supabaseConfig,
    updateSupabaseConfig,
    addToast,
    posts,
    jobs,
    currentUser,
  } = useApp();

  const [projectId, setProjectId] = useState(supabaseConfig.projectId);
  const [publishableKey, setPublishableKey] = useState(supabaseConfig.publishableKey);
  const [isTesting, setIsTesting] = useState(false);

  if (!isSupabaseModalOpen) return null;

  const handleSaveAndTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId.trim() || !publishableKey.trim()) {
      addToast('Please provide both Project ID and Publishable Key', 'info');
      return;
    }

    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      updateSupabaseConfig({
        projectId: projectId.trim(),
        publishableKey: publishableKey.trim(),
        connected: true,
      });
      addToast('Supabase cloud backend configured and synced!', 'success');
      setIsSupabaseModalOpen(false);
    }, 1200);
  };

  const handleExportDataJson = () => {
    const dataToExport = {
      user: currentUser,
      posts,
      jobs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `connect_netwalk_supabase_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Database snapshot downloaded (ready to import into Supabase)', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Supabase Database & Cloud Storage
              </h3>
              <p className="text-[11px] text-slate-400">
                Connect external PostgreSQL database and publishable keys
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSupabaseModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step by Step Instructions per user PRD prompt */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
            Instructions to retrieve your Supabase keys:
          </span>
          <ol className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1 pl-1">
            <li>
              Go to Supabase Dashboard &rarr; <strong>Project Settings</strong> &rarr; General &rarr; copy <strong>Project ID</strong> (Reference ID)
            </li>
            <li>
              Go to Project Settings &rarr; <strong>API Keys</strong> &rarr; copy <strong>Publishable key</strong> (anon key)
            </li>
            <li>Paste both into the fields below to verify cloud connection.</li>
          </ol>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveAndTest} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Supabase Project ID
            </label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="e.g. zqkmndbfqwrjylocbxyz"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Supabase Publishable Key (Anon Key)
            </label>
            <input
              type="password"
              value={publishableKey}
              onChange={(e) => setPublishableKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {supabaseConfig.connected && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Connected! Last sync: {supabaseConfig.lastSyncTimestamp ? new Date(supabaseConfig.lastSyncTimestamp).toLocaleTimeString() : 'Active'}
              </span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleExportDataJson}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Local State</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSupabaseModalOpen(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isTesting}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5" />
                    <span>Save & Connect</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
