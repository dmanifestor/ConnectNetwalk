import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/navigation/TopBar';
import { CreatePostModal } from './components/post/CreatePostModal';
import { SupabaseSyncModal } from './components/settings/SupabaseSyncModal';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  WifiOff,
  Globe,
  Users,
  Briefcase,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
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
  const {
    activeTab,
    setActiveTab,
    currentUser,
    conversations,
    isOnline,
    toasts,
    removeToast,
  } = useApp();

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="min-h-screen bg-[#F3F6F8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-500 selection:text-white">
      {/* Persistent Offline Status Bar */}
      {!isOnline && (
        <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <WifiOff className="w-4 h-4 shrink-0 text-slate-950 animate-pulse" />
          <span>You are currently offline. Operating in local cached mode — updates will synchronize when connection is restored.</span>
        </div>
      )}

      {/* Top Bar with One-Row 3-Zone Contract */}
      <TopBar />

      {/* Main Viewport with Framer Motion tab transitions and Suspense Code Splitting */}
      <main className="flex-1 pb-24 md:pb-16 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className="w-full"
          >
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
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar (Optimized for Mobile View) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-xl safe-bottom">
        {[
          { tab: 'feed' as const, label: 'Feed', icon: <Globe className="w-5 h-5" /> },
          { tab: 'network' as const, label: 'Network', icon: <Users className="w-5 h-5" /> },
          { tab: 'jobs' as const, label: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
          {
            tab: 'messages' as const,
            label: 'Chat',
            icon: (
              <div className="relative">
                <MessageSquare className="w-5 h-5" />
                {totalUnreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
                )}
              </div>
            ),
          },
          { tab: 'ai-lab' as const, label: 'AI Lab', icon: <Sparkles className="w-5 h-5 text-sky-500" /> },
          {
            tab: 'profile' as const,
            label: 'Profile',
            icon: (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
              />
            ),
          },
        ].map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-5 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

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
