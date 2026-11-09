import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BarChart2,
  Image as ImageIcon,
  Tag,
  Loader2,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreatePostModal: React.FC = () => {
  const {
    currentUser,
    isCreatePostModalOpen,
    setIsCreatePostModalOpen,
    createPost,
    addToast,
  } = useApp();

  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'image' | 'poll'>('text');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('DistributedSystems, Engineering, AI');

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2', 'Option 3']);

  // AI Generation state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('High-signal technical insights');
  const [showAiPrompt, setShowAiPrompt] = useState(false);

  if (!isCreatePostModalOpen) return null;

  const handleGenerateWithAi = async () => {
    if (!aiTopic.trim()) {
      addToast('Please enter a topic or theme for the AI generator', 'info');
      return;
    }
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/gemini/content-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          format: 'Insightful thought leadership with actionable bullet points',
          tone: aiTone,
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setContent(`${res.data.hook}\n\n${res.data.content}`);
        if (res.data.hashtags && Array.isArray(res.data.hashtags)) {
          setTagsInput(res.data.hashtags.map((h: string) => h.replace('#', '')).join(', '));
        }
        if (res.data.suggestedPollQuestion && res.data.suggestedPollOptions) {
          setPollQuestion(res.data.suggestedPollQuestion);
          setPollOptions(res.data.suggestedPollOptions.slice(0, 4));
        }
        setShowAiPrompt(false);
        addToast(
          res.engine === 'gemini-3.8-flash'
            ? 'Post draft generated with Gemini 3.8 Flash!'
            : 'Post draft generated with AI creator engine!',
          'success'
        );
      } else {
        throw new Error(res.error || 'Generation failed');
      }
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Could not reach AI engine. Check GEMINI_API_KEY in Secrets.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && postType === 'text') {
      addToast('Please enter post content', 'info');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    let pollData;
    if (postType === 'poll') {
      const validOptions = pollOptions.filter((o) => o.trim().length > 0);
      if (!pollQuestion.trim() || validOptions.length < 2) {
        addToast('Polls require a question and at least 2 options', 'info');
        return;
      }
      pollData = {
        question: pollQuestion.trim(),
        options: validOptions.map((text, i) => ({
          id: `opt_${Date.now()}_${i}`,
          text: text.trim(),
          votes: 0,
        })),
        totalVotes: 0,
      };
    }

    createPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHeadline: currentUser.headline,
      authorAvatar: currentUser.avatar,
      authorCompany: currentUser.currentCompany,
      content: content.trim(),
      tags,
      postType,
      imageUrl: postType === 'image' && imageUrl.trim() ? imageUrl.trim() : undefined,
      poll: pollData,
    });

    setIsCreatePostModalOpen(false);
    setContent('');
    setImageUrl('');
    setPollQuestion('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                {currentUser.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block truncate max-w-xs">
                Posting to ConnectNetwalk Network
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCreatePostModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Drafting Drawer */}
        {showAiPrompt && (
          <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 border-b border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-500" />
                Gemini 3.8 Flash — Post Drafter
              </span>
              <button
                onClick={() => setShowAiPrompt(false)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Close
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., Scaling microservices, gRPC migration lessons, hiring staff engineers..."
                className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <div className="flex items-center justify-between gap-2">
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="High-signal technical insights">High-signal technical insights</option>
                  <option value="Transparent engineering story">Transparent engineering story</option>
                  <option value="Leadership & team culture">Leadership & team culture</option>
                  <option value="Hiring & talent announcement">Hiring & talent announcement</option>
                </select>
                <button
                  type="button"
                  onClick={handleGenerateWithAi}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Draft
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What technical insights, architectural breakthroughs, or career lessons do you want to share?"
            rows={5}
            className="w-full resize-none text-sm bg-transparent border-0 focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />

          {/* Poll Builder Mode */}
          {postType === 'poll' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Interactive Poll Configuration
              </span>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <div className="space-y-2">
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollOptions];
                        newOpts[idx] = e.target.value;
                        setPollOptions(newOpts);
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={() => setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`])}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  + Add another option
                </button>
              )}
            </div>
          )}

          {/* Image URL Mode */}
          {postType === 'image' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Image Attachment URL
              </span>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL or select from generated assets..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">Quick preset:</span>
                <button
                  type="button"
                  onClick={() => setImageUrl('/src/assets/images/company_cover_quantum_1793843121951.jpg')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Quantum Campus Architecture
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => setImageUrl('/src/assets/images/hero_banner_tech_1793843120563.jpg')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Glass Headquarters
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Add tags separated by comma (e.g. DistributedSystems, Cloud, Hiring)"
              className="flex-1 text-xs bg-transparent border-0 focus:ring-0 text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setPostType('text')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  postType === 'text'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => setPostType('image')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                  postType === 'image'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media</span>
              </button>
              <button
                type="button"
                onClick={() => setPostType('poll')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                  postType === 'poll'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Poll</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAiPrompt(!showAiPrompt)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Assist</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreatePostModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-lg shadow-sm shadow-blue-600/30"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
