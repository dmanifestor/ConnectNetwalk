import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Flag,
  CheckCircle2,
  Sparkles,
  FileText,
} from 'lucide-react';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    currentUser,
    toggleLikePost,
    toggleSavePost,
    addComment,
    votePoll,
    flagPost,
    addToast,
  } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Post link copied to clipboard', 'info');
    }
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700/80 transition-all overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                {post.authorName}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {post.timestamp}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {post.authorHeadline}
            </p>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-20">
              <button
                onClick={() => {
                  toggleSavePost(post.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{post.userSaved ? 'Remove from Saved' : 'Save Post'}</span>
              </button>
              <button
                onClick={() => {
                  flagPost(post.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{post.isFlagged ? 'Flagged for Review' : 'Report Post'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Text Body */}
      <div className="px-4 sm:px-5 pb-3">
        {post.postType === 'article' && (
          <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Technical Article / Whitepaper</span>
          </div>
        )}
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Poll Component */}
      {post.poll && (
        <div className="mx-4 sm:mx-5 mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <span className="text-xs font-bold text-slate-900 dark:text-white block mb-3">
            {post.poll.question}
          </span>
          <div className="space-y-2.5">
            {post.poll.options.map((opt) => {
              const total = post.poll?.totalVotes || 1;
              const percent = Math.round((opt.votes / total) * 100);
              const isSelected = post.poll?.userVotedOptionId === opt.id;
              const hasVoted = Boolean(post.poll?.userVotedOptionId);

              return (
                <button
                  key={opt.id}
                  onClick={() => !hasVoted && votePoll(post.id, opt.id)}
                  disabled={hasVoted}
                  className={`w-full relative overflow-hidden rounded-lg p-2.5 text-left border transition-all text-xs ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                  } ${!hasVoted ? 'hover:border-blue-400 cursor-pointer' : 'cursor-default'}`}
                >
                  {/* Progress fill */}
                  {hasVoted && (
                    <div
                      className="absolute inset-y-0 left-0 bg-blue-100/70 dark:bg-blue-900/40 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                      {opt.text}
                    </span>
                    {hasVoted && (
                      <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold tabular-nums">
                        {percent}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 tabular-nums">
            <span>{post.poll.totalVotes.toLocaleString()} votes cast</span>
            <span>Final results verified</span>
          </div>
        </div>
      )}

      {/* Image attachment with graceful styling */}
      {post.imageUrl && (
        <div className="relative max-h-96 overflow-hidden border-y border-slate-100 dark:border-slate-800 bg-slate-950">
          <img
            src={post.imageUrl}
            alt="Post attachment"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-96 hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      )}

      {/* Metrics Bar */}
      <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
        <span className="tabular-nums flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
            👍
          </span>
          {post.likesCount}
        </span>
        <div className="flex items-center gap-3 tabular-nums">
          <span>{post.commentsCount} comments</span>
          <span>·</span>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Actions Toolbar */}
      <div className="px-2 py-1 flex items-center justify-around text-xs font-semibold text-slate-600 dark:text-slate-400">
        <button
          onClick={() => toggleLikePost(post.id)}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            post.userLiked
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${post.userLiked ? 'fill-current' : ''}`} />
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>

        <button
          onClick={handleShare}
          className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>

        <button
          onClick={() => toggleSavePost(post.id)}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            post.userSaved
              ? 'text-blue-600 dark:text-blue-400'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.userSaved ? 'fill-current' : ''}`} />
          <span>Save</span>
        </button>
      </div>

      {/* Comment Section Drawer */}
      {showComments && (
        <div className="bg-slate-50/70 dark:bg-slate-900/60 p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-start gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your technical perspective or experience..."
                className="flex-1 bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-1 text-blue-600 dark:text-blue-400 disabled:opacity-40 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comment List */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5">
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="flex-1 bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/60">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {comment.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {comment.timestamp}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1 mb-1">
                      {comment.authorHeadline}
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-normal">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-slate-400">
              No comments yet. Be the first to start the discussion!
            </div>
          )}
        </div>
      )}
    </article>
  );
};
