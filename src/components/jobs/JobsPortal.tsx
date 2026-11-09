import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  Building,
  Plus,
  ArrowRight,
  Filter,
  Check,
  Send,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import { LOGO_AURORA } from '../../data/mockData';

export const JobsPortal: React.FC = () => {
  const {
    jobs,
    currentUser,
    activeRole,
    applyToJob,
    createJob,
    addToast,
    setActiveTab,
    searchQuery,
  } = useApp();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [filterType, setFilterType] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>(searchQuery || '');

  React.useEffect(() => {
    if (searchQuery) {
      setKeyword(searchQuery);
    }
  }, [searchQuery]);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // AI Fit Analyzer state
  const [isAnalyzingFit, setIsAnalyzingFit] = useState(false);
  const [fitAnalysisResult, setFitAnalysisResult] = useState<any>(null);

  // New Job state
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState(currentUser.currentCompany || 'Aurora Tech');
  const [newLocation, setNewLocation] = useState('San Francisco, CA');
  const [newWorkplaceType, setNewWorkplaceType] = useState<'Remote' | 'Hybrid' | 'On-Site'>('Remote');
  const [newSalaryMin, setNewSalaryMin] = useState(190000);
  const [newSalaryMax, setNewSalaryMax] = useState(250000);
  const [newDescription, setNewDescription] = useState('');
  const [newRequirements, setNewRequirements] = useState('5+ years distributed systems, Go/Rust, Cloud infrastructure');

  const filteredJobs = jobs.filter((job) => {
    if (filterType !== 'all' && job.workplaceType.toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchComp = job.company.toLowerCase().includes(q);
      const matchSkills = job.preferredSkills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchSkills) return false;
    }
    return true;
  });

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const handleRunAiMatch = async () => {
    if (!selectedJob) return;
    setIsAnalyzingFit(true);
    setFitAnalysisResult(null);

    try {
      const response = await fetch('/api/gemini/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: currentUser.resumeText,
          targetRole: `${selectedJob.title} at ${selectedJob.company}`,
          industry: 'Enterprise SaaS & Cloud Infrastructure',
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setFitAnalysisResult(res.data);
        addToast('AI Resume Fit computed with Gemini 3.8 Flash!', 'success');
      } else {
        throw new Error(res.error || 'Failed to analyze fit');
      }
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Could not reach AI matcher.', 'error');
    } finally {
      setIsAnalyzingFit(false);
    }
  };

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      addToast('Please fill out all required job details', 'info');
      return;
    }

    createJob({
      title: newTitle.trim(),
      company: newCompany.trim(),
      companyLogo: LOGO_AURORA,
      location: newLocation.trim(),
      workplaceType: newWorkplaceType,
      employmentType: 'Full-time',
      salaryMin: Number(newSalaryMin),
      salaryMax: Number(newSalaryMax),
      salaryCurrency: 'USD',
      description: newDescription.trim(),
      requirements: newRequirements.split(',').map((r) => r.trim()).filter(Boolean),
      preferredSkills: ['Distributed Systems', 'Cloud', 'Architecture'],
      easyApply: true,
      matchScore: 92,
    });

    setIsPostJobModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Search Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Verified Tech Careers & Talent Portal</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Top tier engineering & leadership openings with full salary transparency and AI resume matching.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {activeRole === 'recruiter' && (
              <button
                onClick={() => setIsPostJobModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Post Open Role</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('ai-lab')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>AI Resume Reviewer</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by title, company, or skills (e.g. Distributed, Rust, Staff)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {['all', 'Remote', 'Hybrid', 'On-Site'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  filterType.toLowerCase() === type.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type === 'all' ? 'All Workplace Types' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Jobs Layout: Left List + Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Job Card List (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-1">
            {filteredJobs.length} Positions Available
          </span>

          <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1">
            {filteredJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setFitAnalysisResult(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-contain bg-slate-900/5 dark:bg-slate-800 p-1 shrink-0 border border-slate-200/60 dark:border-slate-700/60"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {job.title}
                        </h3>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mt-0.5">
                          {job.company}
                        </span>
                      </div>
                    </div>
                    {job.matchScore && (
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/60 tabular-nums">
                        {job.matchScore}% FIT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap tabular-nums">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 tabular-nums">
                    <span>{job.postedAt}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {job.applicantsCount} applicants
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Job Full Details (lg:col-span-7) */}
        {selectedJob && (
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 sticky top-24">
            
            {/* Header info */}
            <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={selectedJob.companyLogo}
                    alt={selectedJob.company}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-contain bg-slate-900/5 dark:bg-slate-800 p-1.5 shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedJob.title}
                    </h2>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 block mt-1">
                      {selectedJob.company} · {selectedJob.location}
                    </span>
                  </div>
                </div>
                {selectedJob.matchScore && (
                  <div className="text-right">
                    <span className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 block tabular-nums">
                      {selectedJob.matchScore}%
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Profile Fit Score
                    </span>
                  </div>
                )}
              </div>

              {/* Badges bar */}
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 flex-wrap tabular-nums pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
                  {selectedJob.workplaceType}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
                  {selectedJob.employmentType}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60">
                  ${selectedJob.salaryMin.toLocaleString()} – ${selectedJob.salaryMax.toLocaleString()} / year
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-3">
                {selectedJob.hasApplied ? (
                  <button
                    disabled
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white flex items-center gap-2 cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Application Submitted</span>
                  </button>
                ) : (
                  <button
                    onClick={() => applyToJob(selectedJob.id)}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-600/30 flex items-center gap-2 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>1-Click Easy Apply</span>
                  </button>
                )}

                <button
                  onClick={handleRunAiMatch}
                  disabled={isAnalyzingFit}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isAnalyzingFit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Computing Fit...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                      <span>Deep AI Fit Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Fit Analysis Result Card (Gemini 3.8 Flash) */}
            {fitAnalysisResult && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-sky-50/60 dark:from-blue-950/40 dark:to-sky-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    Gemini 3.8 Flash — Technical Fit Evaluation
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                    ATS Score: {fitAnalysisResult.atsScore}/100
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Key Strengths for this Role:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 pl-1 mt-0.5 space-y-0.5">
                      {fitAnalysisResult.strengths?.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {fitAnalysisResult.interviewFocusAreas && (
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Likely Interview Focus Areas:
                      </span>
                      <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 pl-1 mt-0.5 space-y-0.5">
                        {fitAnalysisResult.interviewFocusAreas?.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Role Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Role Overview
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedJob.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Requirements & Technical Qualifications
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-1 leading-relaxed">
                {selectedJob.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Preferred Skills */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Core Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.preferredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Recruiter Post Job Modal */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Create New Enterprise Job Listing</span>
            </h3>

            <form onSubmit={handleCreateJobSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Staff Distributed Systems Architect"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Workplace Type
                  </label>
                  <select
                    value={newWorkplaceType}
                    onChange={(e) => setNewWorkplaceType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-Site">On-Site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Min Salary (USD)
                  </label>
                  <input
                    type="number"
                    value={newSalaryMin}
                    onChange={(e) => setNewSalaryMin(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Max Salary (USD)
                  </label>
                  <input
                    type="number"
                    value={newSalaryMax}
                    onChange={(e) => setNewSalaryMax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                  Job Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Summarize the core technical impact and vision of this role..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Publish Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
