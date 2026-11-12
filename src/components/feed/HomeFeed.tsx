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
  FileText,
  Layers,
  ChevronDown,
  SlidersHorizontal,
  UserCheck,
  Flame,
  Users,
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

  const [feedSourceTab, setFeedSourceTab] = useState<'following' | 'trending' | 'connections'>('following');
  const [contentFilter, setContentFilter] = useState<'all' | 'articles' | 'media'>('all');
  const [feedFilter, setFeedFilter] = useState<'all' | 'trending' | 'polls' | 'saved'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Dynamic counts for each feed source tab
  const followingCount = posts.filter(
    (p) => Boolean(p.isFollowingAuthor) || p.authorId === currentUser.id
  ).length;

  const trendingSourceCount = posts.filter((p) => p.likesCount >= 400).length;

  const connectionsSourceCount = posts.filter(
    (p) =>
      Boolean(p.isConnectionAuthor) ||
      connections.some(
        (c) => c.status === 'connected' && (c.name === p.authorName || c.userId === p.authorId)
      )
  ).length;

  // Dynamic counts for each content format
  const allCount = posts.length;
  const articlesCount = posts.filter(
    (p) => p.postType === 'article' || (p.postType === 'text' && p.content.length > 200)
  ).length;
  const mediaCount = posts.filter(
    (p) => p.postType === 'image' || Boolean(p.imageUrl) || p.postType === 'poll' || Boolean(p.poll)
  ).length;

  const filteredPosts = posts.filter((post) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchContent && !matchAuthor && !matchTags) return false;
    }

    // Top Feed Source Tab filter ('following' | 'trending' | 'connections')
    if (feedSourceTab === 'following') {
      const isFollowing = Boolean(post.isFollowingAuthor) || post.authorId === currentUser.id;
      if (!isFollowing) return false;
    } else if (feedSourceTab === 'trending') {
      const isTrending = post.likesCount >= 400;
      if (!isTrending) return false;
    } else if (feedSourceTab === 'connections') {
      const isDirectConnection =
        Boolean(post.isConnectionAuthor) ||
        connections.some(
          (c) => c.status === 'connected' && (c.name === post.authorName || c.userId === post.authorId)
        );
      if (!isDirectConnection) return false;
    }

    // Content format filter ('all' | 'articles' | 'media')
    if (contentFilter === 'articles') {
      const isArticle = post.postType === 'article' || (post.postType === 'text' && post.content.length > 200);
      if (!isArticle) return false;
    } else if (contentFilter === 'media') {
      const isMedia = post.postType === 'image' || Boolean(post.imageUrl) || post.postType === 'poll' || Boolean(post.poll);
      if (!isMedia) return false;
    }

    // Secondary feed sub-filter
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
          
          {/* Feed Source Tabbed Navigation: Following | Trending | Connections */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 shadow-xs">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setFeedSourceTab('following')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative ${
                  feedSourceTab === 'following'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>Following</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    feedSourceTab === 'following'
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {followingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFeedSourceTab('trending')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative ${
                  feedSourceTab === 'trending'
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Flame className="w-4 h-4 shrink-0" />
                <span>Trending</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    feedSourceTab === 'trending'
                      ? 'bg-rose-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {trendingSourceCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFeedSourceTab('connections')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative ${
                  feedSourceTab === 'connections'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Connections</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    feedSourceTab === 'connections'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {connectionsSourceCount}
                </span>
              </button>
            </div>

            {/* Informational Sub-Bar */}
            <div className="flex items-center justify-between px-2 pt-2 pb-0.5 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 mt-1.5">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  feedSourceTab === 'following' ? 'bg-blue-500' : feedSourceTab === 'trending' ? 'bg-amber-500' : 'bg-emerald-500'
                } animate-pulse`} />
                {feedSourceTab === 'following' && 'Showing posts from engineering leaders & creators you follow'}
                {feedSourceTab === 'trending' && 'Showing viral engineering discussions with 400+ likes'}
                {feedSourceTab === 'connections' && 'Exclusively showing posts from your 1st-degree connections'}
              </span>
              <span className="text-[10px] font-mono tabular-nums text-slate-400">
                {filteredPosts.length} posts
              </span>
            </div>
          </div>

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

          {/* Content Navigation Filter Component (Tabs + Dropdown) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* Tab Filter Component: All Posts, Articles, Media */}
              <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => setContentFilter('all')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    contentFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All Posts</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    contentFilter === 'all'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-200/70 dark:bg-slate-700/70 text-slate-500'
                  }`}>
                    {allCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentFilter('articles')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    contentFilter === 'articles'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Articles</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    contentFilter === 'articles'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-200/70 dark:bg-slate-700/70 text-slate-500'
                  }`}>
                    {articlesCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentFilter('media')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    contentFilter === 'media'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Media</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    contentFilter === 'media'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-200/70 dark:bg-slate-700/70 text-slate-500'
                  }`}>
                    {mediaCount}
                  </span>
                </button>
              </div>

              {/* Dropdown Filter Component */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 transition-colors shadow-2xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {feedFilter === 'all'
                      ? 'All Feed'
                      : feedFilter === 'trending'
                      ? 'Trending'
                      : feedFilter === 'polls'
                      ? 'Polls'
                      : 'Saved'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Content View
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setContentFilter('all');
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                        contentFilter === 'all' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        All Posts
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{allCount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setContentFilter('articles');
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                        contentFilter === 'articles' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
                        Articles
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{articlesCount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setContentFilter('media');
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                        contentFilter === 'media' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5" />
                        Media
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{mediaCount}</span>
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Feed Category
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFeedFilter('all');
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs ${
                        feedFilter === 'all' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      All Discussions
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFeedFilter('trending');
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs ${
                        feedFilter === 'trending' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      Trending (400+ Likes)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFeedFilter('polls');
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs ${
                        feedFilter === 'polls' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      Industry Polls
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFeedFilter('saved');
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs ${
                        feedFilter === 'saved' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      Saved Bookmarks
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick status indicator if sub-filter or active search is applied */}
            {(feedFilter !== 'all' || contentFilter !== 'all' || searchQuery.trim()) && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <span>Filtering by:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize">
                  {contentFilter === 'all' ? 'All Posts' : contentFilter}
                </span>
                {feedFilter !== 'all' && (
                  <>
                    <span>·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                      {feedFilter}
                    </span>
                  </>
                )}
                {searchQuery.trim() && (
                  <>
                    <span>·</span>
                    <span className="italic truncate max-w-[150px]">
                      "{searchQuery}"
                    </span>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setContentFilter('all');
                    setFeedFilter('all');
                  }}
                  className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Reset filters
                </button>
              </div>
            )}
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
