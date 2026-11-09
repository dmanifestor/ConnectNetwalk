import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  BarChart2,
  TrendingUp,
  UserPlus,
  Bookmark,
  Eye,
  Search,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PostCard } from './PostCard';

export const HomeFeed: React.FC = () => {
  const {
    currentUser,
    posts,
    searchQuery,
    connections,
    sendConnectionRequest,
    setActiveTab,
    setIsCreatePostModalOpen,
  } = useApp();

  const [feedFilter, setFeedFilter] = useState<'all' | 'trending' | 'polls' | 'saved'>('all');

  const filteredPosts = posts.filter((post) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchContent && !matchAuthor && !matchTags) return false;
    }

    if (feedFilter === 'trending') return post.likesCount > 400;
    if (feedFilter === 'polls') return Boolean(post.poll);
    if (feedFilter === 'saved') return Boolean(post.userSaved);
    return true;
  });

  const suggestedConnections = connections.filter((c) => c.status === 'suggested');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Profile Snapshot & Navigation (lg:col-span-3) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            {/* Banner */}
            <div className="h-20 w-full overflow-hidden relative">
              <img
                src={currentUser.bannerImage}
                alt="Profile banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {/* User Info */}
            <div className="px-4 pb-4 -mt-10 text-center relative z-10">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-18 h-18 rounded-full object-cover mx-auto ring-4 ring-white dark:ring-slate-900 shadow-md cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setActiveTab('profile')}
              />
              <button
                onClick={() => setActiveTab('profile')}
                className="text-sm font-bold text-slate-900 dark:text-white mt-2 block hover:text-blue-600 dark:hover:text-blue-400 transition-colors mx-auto"
              >
                {currentUser.name}
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {currentUser.headline}
              </p>

              {/* Stats Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-left tabular-nums">
                <div
                  onClick={() => setActiveTab('profile')}
                  className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">
                    Profile views
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentUser.profileViewsMonthly.toLocaleString()}
                  </span>
                </div>
                <div
                  onClick={() => setActiveTab('network')}
                  className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">
                    Connections
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {currentUser.connectionsCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Career Assistant Prompt */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/20 border-t border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                  AI Career Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                Optimize your resume and simulate interviews with Gemini 3.8 Flash.
              </p>
              <button
                onClick={() => setActiveTab('ai-lab')}
                className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:gap-1.5 transition-all"
              >
                <span>Launch AI Lab</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-1">
            <button
              onClick={() => setActiveTab('jobs')}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between transition-colors"
            >
              <span>Recommended Jobs</span>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono">
                4 new
              </span>
            </button>
            <button
              onClick={() => setFeedFilter('saved')}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between transition-colors"
            >
              <span>Saved Bookmarks</span>
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </aside>

        {/* Middle Column: Post Creator & Stream (lg:col-span-6) */}
        <main className="lg:col-span-6 space-y-4">
          
          {/* Quick Post Creator Trigger Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="flex-1 text-left px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 text-xs text-slate-500 dark:text-slate-400 transition-colors"
              >
                Share an architectural discovery, RFC, or team milestone...
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span>Media</span>
              </button>
              <button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <BarChart2 className="w-4 h-4 text-amber-500" />
                <span>Poll</span>
              </button>
              <button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold py-1 px-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>AI Draft</span>
              </button>
            </div>
          </div>

          {/* Feed Filter Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setFeedFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                feedFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              All Discussions
            </button>
            <button
              onClick={() => setFeedFilter('trending')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                feedFilter === 'trending'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Trending (400+ Likes)
            </button>
            <button
              onClick={() => setFeedFilter('polls')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                feedFilter === 'polls'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Industry Polls
            </button>
            <button
              onClick={() => setFeedFilter('saved')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                feedFilter === 'saved'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Saved Posts
            </button>
          </div>

          {/* Posts Feed Stream */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No matching posts found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Try clearing your search query or switching filter tabs.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right Column: Trending News & Suggested Leaders (lg:col-span-3) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          
          {/* Trending Topics */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex items-center gap-1.5 mb-3 text-slate-900 dark:text-white font-bold text-xs">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Trending in Tech</span>
            </div>
            <div className="space-y-3">
              {[
                { topic: 'Speculative Prefix Caching', category: 'Distributed Systems', count: '14.2k readers' },
                { topic: 'Zero-Copy Data Pipelines', category: 'Cloud Infrastructure', count: '9.8k readers' },
                { topic: 'Salary Transparency Law 2026', category: 'Tech Careers', count: '28.1k readers' },
                { topic: 'Rust in Linux Kernel 6.14', category: 'Systems Programming', count: '18.4k readers' },
              ].map((item, idx) => (
                <div key={idx} className="cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 tabular-nums">
                    <span>{item.category}</span>
                    <span>·</span>
                    <span>{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested People to Connect */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <span className="text-xs font-bold text-slate-900 dark:text-white block mb-3">
              Leaders to Connect
            </span>
            <div className="space-y-3">
              {suggestedConnections.map((conn) => (
                <div key={conn.id} className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <img
                      src={conn.avatar}
                      alt={conn.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block line-clamp-1">
                        {conn.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                        {conn.headline}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {conn.mutualCount} mutual connections
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => sendConnectionRequest(conn.id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Send Connection"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveTab('network')}
              className="mt-3 w-full py-1.5 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all recommendations
            </button>
          </div>

          {/* Footer note */}
          <div className="px-2 text-[11px] text-slate-400 leading-relaxed">
            ConnectNetwalk Platform © 2026. Enterprise Talent, Creator Economy & AI Intelligence.
          </div>
        </aside>

      </div>
    </div>
  );
};
