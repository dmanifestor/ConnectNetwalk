import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  FileText,
  Compass,
  PenTool,
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  ArrowRight,
  TrendingUp,
  Shield,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { useApp } from '../../context/AppContext';

// Fluid staggered text reveal animation variants
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const badgeItem: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

type AiModule = 'optimizer' | 'resume' | 'roadmap' | 'content' | 'outreach';

export const AiCareerLab: React.FC = () => {
  const { currentUser, updateProfile, addToast, createPost, setActiveTab } = useApp();

  const [activeModule, setActiveModule] = useState<AiModule>('optimizer');
  const [isLoading, setIsLoading] = useState(false);

  // Profile Optimizer State
  const [profileRole, setProfileRole] = useState(currentUser.currentRole);
  const [profileHeadline, setProfileHeadline] = useState(currentUser.headline);
  const [profileAbout, setProfileAbout] = useState(currentUser.about);
  const [optimizerOutput, setOptimizerOutput] = useState<any>(null);

  // Resume Analyzer State
  const [resumeText, setResumeText] = useState(currentUser.resumeText);
  const [targetJobRole, setTargetJobRole] = useState('Staff Distributed Systems Architect');
  const [resumeOutput, setResumeOutput] = useState<any>(null);

  // Career Roadmap State
  const [currentTitle, setCurrentTitle] = useState('Senior Software Engineer');
  const [desiredTargetTitle, setDesiredTargetTitle] = useState('Staff Software Architect');
  const [timelineYears, setTimelineYears] = useState('2-3');
  const [roadmapOutput, setRoadmapOutput] = useState<any>(null);

  // Content Generator State
  const [contentTopic, setContentTopic] = useState('Low-latency distributed inference in Rust');
  const [contentTone, setContentTone] = useState('High-signal technical insights');
  const [contentOutput, setContentOutput] = useState<any>(null);

  // Outreach Message State
  const [outreachName, setOutreachName] = useState('Sarah Vance');
  const [outreachRole, setOutreachRole] = useState('Principal Talent Partner @ Aurora Tech');
  const [outreachGoal, setOutreachGoal] = useState('Exploring Staff Architect opening & collaboration');
  const [outreachOutput, setOutreachOutput] = useState<any>(null);

  const copyToClipboard = (text: string, label = 'Copied') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      addToast(`${label} copied to clipboard!`, 'info');
    }
  };

  const handleRunOptimizer = async () => {
    setIsLoading(true);
    setOptimizerOutput(null);
    try {
      const res = await fetch('/api/gemini/profile-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: profileHeadline,
          about: profileAbout,
          currentRole: profileRole,
          skills: currentUser.skills.map((s) => s.name),
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOptimizerOutput(data.data);
        addToast('Profile recommendations generated with Gemini 3.8 Flash!', 'success');
      } else {
        throw new Error(data.error || 'Failed to optimize profile');
      }
    } catch (err: any) {
      addToast(err.message || 'Error communicating with AI engine', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunResumeAnalyzer = async () => {
    setIsLoading(true);
    setResumeOutput(null);
    try {
      const res = await fetch('/api/gemini/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole: targetJobRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResumeOutput(data.data);
        addToast('ATS Resume evaluation completed!', 'success');
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err: any) {
      addToast(err.message || 'Error analyzing resume', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunRoadmap = async () => {
    setIsLoading(true);
    setRoadmapOutput(null);
    try {
      const res = await fetch('/api/gemini/career-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTitle,
          targetTitle: desiredTargetTitle,
          timeframeYears: timelineYears,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRoadmapOutput(data.data);
        addToast('Executive career acceleration roadmap generated!', 'success');
      } else {
        throw new Error(data.error || 'Failed to generate roadmap');
      }
    } catch (err: any) {
      addToast(err.message || 'Error generating roadmap', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunContentGen = async () => {
    setIsLoading(true);
    setContentOutput(null);
    try {
      const res = await fetch('/api/gemini/content-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: contentTopic,
          tone: contentTone,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setContentOutput(data.data);
        addToast('High-engagement post crafted with Gemini 3.8 Flash!', 'success');
      } else {
        throw new Error(data.error || 'Content generation failed');
      }
    } catch (err: any) {
      addToast(err.message || 'Error generating post', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunOutreach = async () => {
    setIsLoading(true);
    setOutreachOutput(null);
    try {
      const res = await fetch('/api/gemini/outreach-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: outreachName,
          recipientRole: outreachRole,
          senderGoal: outreachGoal,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOutreachOutput(data.data);
        addToast('Warm outreach message crafted!', 'success');
      } else {
        throw new Error(data.error || 'Outreach generation failed');
      }
    } catch (err: any) {
      addToast(err.message || 'Error crafting message', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              ConnectNetwalk AI Career Intelligence Suite
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Powered by Google Gemini 3.8 Flash. Elevate your professional identity, diagnose resume ATS gaps, and generate executive-level roadmap milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-900/60">
            Model: gemini-3.8-flash
          </span>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs overflow-x-auto">
        {[
          { id: 'optimizer', label: 'Profile Optimizer', icon: <UserCheck className="w-4 h-4" /> },
          { id: 'resume', label: 'Resume & ATS Reviewer', icon: <FileText className="w-4 h-4" /> },
          { id: 'roadmap', label: 'Career Roadmap Generator', icon: <Compass className="w-4 h-4" /> },
          { id: 'content', label: 'Creator Post Ghostwriter', icon: <PenTool className="w-4 h-4" /> },
          { id: 'outreach', label: 'Executive Cold Outreach', icon: <Send className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveModule(tab.id as AiModule)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
              activeModule === tab.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MODULE 1: Profile Optimizer */}
      {activeModule === 'optimizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Target Profile Details
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Current Role
              </label>
              <input
                type="text"
                value={profileRole}
                onChange={(e) => setProfileRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Headline to Enhance
              </label>
              <textarea
                value={profileHeadline}
                onChange={(e) => setProfileHeadline(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Summary / Bio Excerpt
              </label>
              <textarea
                value={profileAbout}
                onChange={(e) => setProfileAbout(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleRunOptimizer}
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Optimizing Profile with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Executive AI Optimization</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Optimization Output</span>
              {optimizerOutput && (
                <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Apply
                </span>
              )}
            </h2>

            {optimizerOutput ? (
              <motion.div
                key="optimizer-output"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4 text-xs"
              >
                {/* Headlines */}
                <motion.div variants={staggerItem} className="space-y-2">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Recommended High-Converting Headlines:
                  </span>
                  <div className="space-y-2">
                    {optimizerOutput.optimizedHeadlines?.map((hl: string, i: number) => (
                      <motion.div
                        key={i}
                        variants={staggerItem}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-blue-400/50 transition-colors"
                      >
                        <span className="text-slate-800 dark:text-slate-200 font-medium">
                          {hl}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => copyToClipboard(hl, 'Headline')}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded"
                            title="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              updateProfile({ headline: hl });
                              addToast('Applied to your profile headline!', 'success');
                            }}
                            className="text-[11px] font-semibold text-blue-600 hover:underline"
                          >
                            Apply
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Improved About */}
                <motion.div variants={staggerItem} className="space-y-2">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    High-Impact Executive About Section:
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 relative">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {optimizerOutput.improvedAbout}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => copyToClipboard(optimizerOutput.improvedAbout, 'About text')}
                        className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => {
                          updateProfile({ about: optimizerOutput.improvedAbout });
                          addToast('Applied to your profile About section!', 'success');
                        }}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Apply to Profile
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Missing Skills */}
                {optimizerOutput.missingHighValueSkills && (
                  <motion.div variants={staggerItem}>
                    <span className="font-semibold text-slate-900 dark:text-white block mb-1.5">
                      Top In-Demand Keywords to Add:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {optimizerOutput.missingHighValueSkills.map((sk: string, i: number) => (
                        <motion.span
                          key={i}
                          variants={badgeItem}
                          className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-900/40"
                        >
                          + {sk}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Strategic Tips */}
                {optimizerOutput.strategicTips && (
                  <motion.div variants={staggerItem} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <span className="font-semibold text-slate-900 dark:text-white block mb-1.5">
                      Executive Visibility Strategies:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {optimizerOutput.strategicTips.map((tip: string, i: number) => (
                        <motion.li key={i} variants={staggerItem}>
                          {tip}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-16 text-xs text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>Click "Run Executive AI Optimization" to view Gemini's tailored recommendations.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 2: Resume & ATS Reviewer */}
      {activeModule === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Target Role & Resume Excerpt
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Resume Content
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleRunResumeAnalyzer}
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning ATS Score...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Analyze Resume ATS Match</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              ATS Score & Bullet Enhancements
            </h2>

            {resumeOutput ? (
              <motion.div
                key="resume-output"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4 text-xs"
              >
                {/* Score bar */}
                <motion.div
                  variants={staggerItem}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between shadow-xs"
                >
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                      Overall ATS Match Score
                    </span>
                    <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {resumeOutput.atsScore} / 100
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {resumeOutput.summaryRating}
                  </span>
                </motion.div>

                {/* Strengths & Gaps */}
                <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                      Key Strengths
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {resumeOutput.strengths?.map((s: string, i: number) => (
                        <motion.li key={i} variants={staggerItem}>{s}</motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                    <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-1">
                      Identified Gaps / Missing Keywords
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {resumeOutput.gaps?.map((g: string, i: number) => (
                        <motion.li key={i} variants={staggerItem}>{g}</motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Bullet Improvements */}
                {resumeOutput.bulletImprovements && (
                  <motion.div variants={staggerItem} className="space-y-2">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      XYZ Formula Bullet Point Rewrites:
                    </span>
                    <div className="space-y-2">
                      {resumeOutput.bulletImprovements.map((item: any, i: number) => (
                        <motion.div
                          key={i}
                          variants={staggerItem}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1 hover:border-emerald-400/50 transition-colors"
                        >
                          <div className="text-[11px] text-slate-400 line-through">
                            {item.original}
                          </div>
                          <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{item.revised}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Interview Focus Areas */}
                {resumeOutput.interviewFocusAreas && (
                  <motion.div variants={staggerItem} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <span className="font-semibold text-slate-900 dark:text-white block mb-1.5">
                      Predicted Technical Interview Focus:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {resumeOutput.interviewFocusAreas.map((area: string, i: number) => (
                        <motion.li key={i} variants={staggerItem}>{area}</motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-16 text-xs text-slate-400 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>Run ATS analysis to audit keyword density, metrics, and bullet impact.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 3: Career Roadmap Generator */}
      {activeModule === 'roadmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Career Trajectory Parameters
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Current Title / Level
              </label>
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Target Promotion / Destination
              </label>
              <input
                type="text"
                value={desiredTargetTitle}
                onChange={(e) => setDesiredTargetTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Target Timeframe
              </label>
              <select
                value={timelineYears}
                onChange={(e) => setTimelineYears(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="1-2 years">1 — 2 years (Fast-Track Promotion)</option>
                <option value="2-3 years">2 — 3 years (Standard Staff/Principal trajectory)</option>
                <option value="3-5 years">3 — 5 years (Executive VP / Founder transition)</option>
              </select>
            </div>

            <button
              onClick={handleRunRoadmap}
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Trajectory...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  <span>Generate Career Roadmap</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Strategic Milestones & Deliverables
            </h2>

            {roadmapOutput ? (
              <motion.div
                key="roadmap-output"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4 text-xs"
              >
                {roadmapOutput.targetMilestones?.map((m: any, i: number) => (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2 hover:border-blue-400/50 transition-colors shadow-xs"
                  >
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">
                      {m.period}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                        High-Impact Deliverables:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                        {m.deliverables?.map((d: string, dIdx: number) => (
                          <motion.li key={dIdx} variants={staggerItem}>{d}</motion.li>
                        ))}
                      </ul>
                    </div>
                    {m.skillsToAcquire && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[11px] font-semibold text-slate-500 mr-1">Skills:</span>
                        {m.skillsToAcquire.map((sk: string, sIdx: number) => (
                          <motion.span
                            key={sIdx}
                            variants={badgeItem}
                            className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium text-[11px] border border-blue-200 dark:border-blue-900/40"
                          >
                            {sk}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}

                {roadmapOutput.keyPitfallsToAvoid && (
                  <motion.div variants={staggerItem} className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60">
                    <span className="font-semibold text-amber-800 dark:text-amber-300 block mb-1">
                      Critical Pitfalls to Avoid:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {roadmapOutput.keyPitfallsToAvoid.map((pitfall: string, pIdx: number) => (
                        <motion.li key={pIdx} variants={staggerItem}>{pitfall}</motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-16 text-xs text-slate-400 space-y-2">
                <Compass className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>Generate a customized leadership milestone roadmap to accelerate your next title jump.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 4: Content Creator */}
      {activeModule === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Post Topic & Hook
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Topic or Technical Discovery
              </label>
              <textarea
                value={contentTopic}
                onChange={(e) => setContentTopic(e.target.value)}
                rows={3}
                placeholder="e.g., Why we migrated our Postgres shard to NVMe-backed storage..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Tone & Voice
              </label>
              <select
                value={contentTone}
                onChange={(e) => setContentTone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="High-signal technical insights">High-signal technical insights</option>
                <option value="Humble engineering post-mortem">Humble engineering post-mortem</option>
                <option value="Leadership principles & hiring">Leadership principles & hiring</option>
              </select>
            </div>

            <button
              onClick={handleRunContentGen}
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Post...</span>
                </>
              ) : (
                <>
                  <PenTool className="w-4 h-4" />
                  <span>Draft Viral Thought Leadership Post</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Generated Post Preview</span>
              {contentOutput && (
                <button
                  onClick={() => {
                    createPost({
                      authorId: currentUser.id,
                      authorName: currentUser.name,
                      authorHeadline: currentUser.headline,
                      authorAvatar: currentUser.avatar,
                      authorCompany: currentUser.currentCompany,
                      content: `${contentOutput.hook}\n\n${contentOutput.content}`,
                      tags: contentOutput.hashtags ? contentOutput.hashtags.map((h: string) => h.replace('#', '')) : ['Tech'],
                      postType: 'text',
                    });
                    setActiveTab('feed');
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1 shadow-xs"
                >
                  <span>Publish to Feed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </h2>

            {contentOutput ? (
              <motion.div
                key="content-output"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3.5 text-xs shadow-xs"
              >
                <motion.div variants={staggerItem} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                    Attention-Grabbing Hook
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {contentOutput.hook}
                  </p>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Post Body Narrative
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    {contentOutput.content}
                  </p>
                </motion.div>

                {contentOutput.suggestedPollQuestion && (
                  <motion.div variants={staggerItem} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
                      Recommended Engagement Poll:
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {contentOutput.suggestedPollQuestion}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {contentOutput.suggestedPollOptions?.map((opt: string, oIdx: number) => (
                        <div key={oIdx} className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                          • {opt}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {contentOutput.hashtags && (
                  <motion.div variants={staggerItem} className="flex flex-wrap gap-1.5 pt-1">
                    {contentOutput.hashtags.map((h: string, idx: number) => (
                      <motion.span
                        key={idx}
                        variants={badgeItem}
                        className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200/60 dark:border-blue-900/40 text-[11px]"
                      >
                        {h.startsWith('#') ? h : `#${h}`}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-16 text-xs text-slate-400 space-y-2">
                <PenTool className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>Generate clean, high-signal technical content ready to post with one click.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 5: Executive Cold Outreach */}
      {activeModule === 'outreach' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Recipient & Goal Details
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                value={outreachName}
                onChange={(e) => setOutreachName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Recipient Headline / Role
              </label>
              <input
                type="text"
                value={outreachRole}
                onChange={(e) => setOutreachRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Your Networking Goal
              </label>
              <input
                type="text"
                value={outreachGoal}
                onChange={(e) => setOutreachGoal(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleRunOutreach}
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Outreach...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Craft High-Response Message</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Executive Message Draft
            </h2>

            {outreachOutput ? (
              <motion.div
                key="outreach-output"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3.5 text-xs shadow-xs"
              >
                <motion.div variants={staggerItem} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">
                    Subject Line
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {outreachOutput.subjectLine}
                  </span>
                </motion.div>

                <motion.div variants={staggerItem} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">
                    Personalized Outreach Message
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {outreachOutput.messageBody}
                  </p>
                </motion.div>

                {outreachOutput.followUpTip && (
                  <motion.div variants={staggerItem} className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-200">
                    💡 <strong>Strategic Follow-up Protocol:</strong> {outreachOutput.followUpTip}
                  </motion.div>
                )}

                <motion.div variants={staggerItem} className="pt-1 flex items-center justify-end">
                  <button
                    onClick={() => copyToClipboard(outreachOutput.messageBody, 'Outreach draft')}
                    className="px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Clipboard</span>
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <div className="text-center py-16 text-xs text-slate-400 space-y-2">
                <Send className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>Generate non-transactional, respectful messages with proven 80%+ response rates.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
