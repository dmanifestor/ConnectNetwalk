import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/navigation/TopBar';
import { CreatePostModal } from './components/post/CreatePostModal';
import { SupabaseSyncModal } from './components/settings/SupabaseSyncModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import {
  FeedSkeleton,
  NetworkSkeleton,
  JobsSkeleton,
  MessagingSkeleton,
  AiLabSkeleton,
  CompanySkeleton,
  ProfileSkeleton,
  AdminSkeleton,
  PremiumSkeleton,
} from './components/common/Skeletons';

// Code-split dynamic chunks via React.lazy
const HomeFeed = lazy(() => import('./components/feed/HomeFeed').then((m) => ({ default: m.HomeFeed })));
const NetworkHub = lazy(() => import('./components/network/NetworkHub').then((m) => ({ default: m.NetworkHub })));
const JobsPortal = lazy(() => import('./components/jobs/JobsPortal').then((m) => ({ default: m.JobsPortal })));
const MessagingCenter = lazy(() => import('./components/messaging/MessagingCenter').then((m) => ({ default: m.MessagingCenter })));
const AiCareerLab = lazy(() => import('./components/ai/AiCareerLab').then((m) => ({ default: m.AiCareerLab })));
const CompanyShowcase = lazy(() => import('./components/company/CompanyShowcase').then((m) => ({ default: m.CompanyShowcase })));
const ProfileView = lazy(() => import('./components/profile/ProfileView').then((m) => ({ default: m.ProfileView })));
const AdminConsole = lazy(() => import('./components/admin/AdminConsole').then((m) => ({ default: m.AdminConsole })));
const PremiumHub = lazy(() => import('./components/premium/PremiumHub').then((m) => ({ default: m.PremiumHub })));

const MainContent: React.FC = () => {
  const { activeTab, toasts, removeToast } = useApp();

  return (
    <div className="min-h-screen bg-[#F3F6F8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-500 selection:text-white">
      {/* Top Bar with One-Row 3-Zone Contract */}
      <TopBar />

      {/* Main Viewport with Suspense Code Splitting */}
      <main className="flex-1 pb-16">
        {activeTab === 'feed' && (
          <Suspense fallback={<FeedSkeleton />}>
            <HomeFeed />
          </Suspense>
        )}
        {activeTab === 'network' && (
          <Suspense fallback={<NetworkSkeleton />}>
            <NetworkHub />
          </Suspense>
        )}
        {activeTab === 'jobs' && (
          <Suspense fallback={<JobsSkeleton />}>
            <JobsPortal />
          </Suspense>
        )}
        {activeTab === 'messages' && (
          <Suspense fallback={<MessagingSkeleton />}>
            <MessagingCenter />
          </Suspense>
        )}
        {activeTab === 'ai-lab' && (
          <Suspense fallback={<AiLabSkeleton />}>
            <AiCareerLab />
          </Suspense>
        )}
        {activeTab === 'companies' && (
          <Suspense fallback={<CompanySkeleton />}>
            <CompanyShowcase />
          </Suspense>
        )}
        {activeTab === 'profile' && (
          <Suspense fallback={<ProfileSkeleton />}>
            <ProfileView />
          </Suspense>
        )}
        {activeTab === 'admin' && (
          <Suspense fallback={<AdminSkeleton />}>
            <AdminConsole />
          </Suspense>
        )}
        {activeTab === 'premium' && (
          <Suspense fallback={<PremiumSkeleton />}>
            <PremiumHub />
          </Suspense>
        )}
      </main>

      {/* Modals */}
      <CreatePostModal />
      <SupabaseSyncModal />

      {/* Toast Notification Stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-xl border flex items-center justify-between gap-3 text-xs font-medium transition-all ${
              toast.type === 'success'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-800'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-200" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
