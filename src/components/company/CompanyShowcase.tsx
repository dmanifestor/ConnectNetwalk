import React, { useState } from 'react';
import {
  Building2,
  Users,
  MapPin,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  Plus,
  ArrowRight,
  Globe,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CompanyShowcase: React.FC = () => {
  const {
    companies,
    selectedCompanyId,
    setSelectedCompanyId,
    toggleFollowCompany,
    jobs,
    setActiveTab,
    addToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'about' | 'jobs' | 'life'>('about');

  const selectedCompany =
    companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const companyJobs = jobs.filter(
    (j) => j.company.toLowerCase() === selectedCompany?.name.toLowerCase()
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Company link copied', 'info');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Company Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {companies.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setSelectedCompanyId(comp.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              selectedCompany?.id === comp.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{comp.name}</span>
          </button>
        ))}
      </div>

      {/* Main Company Card */}
      {selectedCompany && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          
          {/* Cover Banner */}
          <div className="h-52 sm:h-64 w-full relative overflow-hidden bg-slate-950">
            <img
              src={selectedCompany.coverImage}
              alt={selectedCompany.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:bg-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Row */}
          <div className="px-6 sm:px-8 pb-8 pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-4">
              <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-xl ring-4 ring-white dark:ring-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                <img
                  src={selectedCompany.logo}
                  alt={selectedCompany.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Follow Button */}
              <button
                onClick={() => toggleFollowCompany(selectedCompany.id)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                  selectedCompany.isFollowing
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {selectedCompany.isFollowing ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Follow Company</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedCompany.name}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                {selectedCompany.tagline}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap tabular-nums">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedCompany.headquarters}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {selectedCompany.employeeCount}
                </span>
                <span>·</span>
                <span>{selectedCompany.followersCount.toLocaleString()} followers</span>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveSubTab('about')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeSubTab === 'about'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Overview & Mission
              </button>
              <button
                onClick={() => setActiveSubTab('jobs')}
                className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeSubTab === 'jobs'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>Open Positions</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 px-1.5 py-0.2 rounded-full tabular-nums">
                  {selectedCompany.openJobsCount}
                </span>
              </button>
            </div>

            {/* Sub Tab Content */}
            {activeSubTab === 'about' && (
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    About {selectedCompany.name}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedCompany.about}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    Core Technical Domains & Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'jobs' && (
              <div className="mt-6 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Available Roles at {selectedCompany.name} ({companyJobs.length})
                </span>
                {companyJobs.length > 0 ? (
                  companyJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {job.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 tabular-nums">
                          <span>{job.location}</span>
                          <span>·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('jobs')}
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 flex items-center gap-1"
                      >
                        <span>View Job</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4">No active openings at this time.</p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
