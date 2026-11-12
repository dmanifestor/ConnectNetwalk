import React, { useState } from 'react';
import {
  Globe,
  Users,
  Briefcase,
  MessageSquare,
  Sparkles,
  Building2,
  Shield,
  Search,
  Bell,
  Sun,
  Moon,
  Database,
  Plus,
  Check,
  Crown,
  ChevronDown,
} from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { UserRole } from '../../types';

export const TopBar: React.FC = () => {
  const {
    currentUser,
    activeRole,
    switchUserRole,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsSupabaseModalOpen,
    setIsCreatePostModalOpen,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'feed', label: 'Feed', icon: <Globe className="w-4 h-4" /> },
    { tab: 'network', label: 'Network', icon: <Users className="w-4 h-4" /> },
    { tab: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
    { tab: 'messages', label: 'Messaging', icon: <MessageSquare className="w-4 h-4" /> },
    { tab: 'ai-lab', label: 'AI Suite', icon: <Sparkles className="w-4 h-4 text-sky-500" /> },
    { tab: 'companies', label: 'Companies', icon: <Building2 className="w-4 h-4" /> },
  ];

  if (activeRole === 'super_admin' || activeRole === 'recruiter') {
    navItems.push({
      tab: 'admin',
      label: activeRole === 'super_admin' ? 'Admin Hub' : 'Recruiter ATS',
      icon: <Shield className="w-4 h-4 text-emerald-500" />,
    });
  }

  const roleOptions: { role: UserRole; title: string; subtitle: string }[] = [
    {
      role: 'job_seeker',
      title: 'Alex Rivera (Job Seeker / Staff AI)',
      subtitle: 'Browse jobs, optimize resume, network',
    },
    {
      role: 'recruiter',
      title: 'Sarah Vance (Executive Recruiter)',
      subtitle: 'Post jobs, search talent, ATS pipeline',
    },
    {
      role: 'company_admin',
      title: 'David Sterling (Company Executive)',
      subtitle: 'Manage company page, culture, updates',
    },
    {
      role: 'super_admin',
      title: 'Platform Super Admin',
      subtitle: 'Platform analytics, moderation & fraud',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-tighter">CN</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                ConnectNetwalk
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono tracking-wider uppercase font-semibold">
                Enterprise v2.4
              </span>
            </div>
          </button>
        </div>

        {/* Search Bar - High tech & responsive */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people, jobs, RFCs..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500/40 dark:focus:border-blue-400/40 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* Zone 2: Navigation Links (Single Line) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Profile Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick Create Post Button */}
          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </button>

          {/* Supabase Cloud Connect Button */}
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            title="Database & Supabase Sync"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Trigger & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Notifications ({unreadNotifCount} unread)
                  </span>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap tabular-nums">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {n.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu & Role Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 capitalize">
                  {activeRole.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {currentUser.name}
                    </span>
                    {currentUser.isPremium && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                        <Crown className="w-3 h-3" /> PRO
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {currentUser.headline}
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="mt-2 w-full py-1 text-center text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    View & Edit Full Profile
                  </button>
                </div>

                {/* Role Switcher Section */}
                <div className="px-3 pt-2 pb-1">
                  <span className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona
                  </span>
                  <div className="mt-1 space-y-1">
                    {roleOptions.map((opt) => (
                      <button
                        key={opt.role}
                        onClick={() => {
                          switchUserRole(opt.role);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          activeRole === opt.role
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs">{opt.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {opt.subtitle}
                          </span>
                        </div>
                        {activeRole === opt.role && (
                          <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-1 px-3">
                  <button
                    onClick={() => {
                      setActiveTab('premium');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg flex items-center gap-1.5 font-medium"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    ConnectNetwalk Premium & ATS
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
