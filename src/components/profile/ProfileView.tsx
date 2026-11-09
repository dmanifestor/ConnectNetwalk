import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Building,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle,
  Download,
  Share2,
  Edit3,
  ExternalLink,
  Eye,
  TrendingUp,
  Users,
  Shield,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResumePreviewModal } from './ResumePreviewModal';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, setActiveTab, addToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editHeadline, setEditHeadline] = useState(currentUser.headline);
  const [editAbout, setEditAbout] = useState(currentUser.about);
  const [editLocation, setEditLocation] = useState(currentUser.location);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim(),
      headline: editHeadline.trim(),
      about: editAbout.trim(),
      location: editLocation.trim(),
    });
    setIsEditing(false);
  };

  const handleDownloadResume = () => {
    const blob = new Blob([currentUser.resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser.name.replace(/\s+/g, '_')}_Resume_ConnectNetwalk.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Resume file generated and downloaded', 'success');
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Profile link copied to clipboard', 'info');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Profile Header Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Banner with high quality image asset */}
        <div className="h-48 sm:h-64 w-full relative overflow-hidden bg-slate-950">
          <img
            src={currentUser.bannerImage}
            alt="Profile cover banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShareProfile}
              className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 shadow-xs transition-colors"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* User Info Row */}
        <div className="px-6 sm:px-8 pb-8 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-28 sm:w-36 h-28 sm:h-36 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl"
              />
              {currentUser.isAvailableForHire && (
                <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  OPEN TO WORK
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setActiveTab('ai-lab')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/80 dark:border-blue-800/60 flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>AI Profile Optimizer</span>
              </button>
              <button
                onClick={() => setIsResumePreviewOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-95 border border-slate-300/80 dark:border-slate-700 shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Quick View Resume</span>
              </button>
              <button
                onClick={handleDownloadResume}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-600/30 flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {currentUser.name}
              </h1>
              {currentUser.isPremium && (
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/60">
                  PREMIUM PRO
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 max-w-3xl leading-snug">
              {currentUser.headline}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap tabular-nums">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {currentUser.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                <Users className="w-3.5 h-3.5" />
                {currentUser.connectionsCount.toLocaleString()} connections
              </span>
              <span>·</span>
              <span>{currentUser.followersCount.toLocaleString()} followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Analytics Overview Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Profile Analytics & Reach
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Private to you · Past 30 days telemetry
            </p>
          </div>
          <button
            onClick={() => setActiveTab('ai-lab')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Analyze with AI</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Profile Views
              </span>
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">
              {currentUser.profileViewsMonthly.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +24% vs last month
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Search Appearances
              </span>
              <TrendingUp className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">
              {currentUser.searchAppearancesMonthly.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Found for: "Staff AI Architect", "Distributed inference"
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Recruiter Inbound
              </span>
              <Briefcase className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">
              18 InMails
            </span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 block">
              92% from Tier-1 Tech & AI Labs
            </span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          About
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {currentUser.about}
        </p>
      </section>

      {/* Featured Document: Verified Resume PDF */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Featured Resume & Verified Credentials</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified by ConnectNetwalk ATS Engine · 2 Pages · Updated this week
            </p>
          </div>
          <button
            onClick={() => setIsResumePreviewOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Open Quick View</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-blue-950/20 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs flex flex-col items-center justify-center text-rose-500 shrink-0">
              <FileText className="w-6 h-6" />
              <span className="text-[9px] font-mono font-bold uppercase mt-0.5">PDF</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser.name.replace(/\s+/g, '_')}_Staff_Architect_Resume.pdf
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60">
                  96% ATS MATCH
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Executive format covering 10+ years scaling high-throughput distributed systems & ML inference infrastructure.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsResumePreviewOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleDownloadResume}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all"
              title="Download File"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Experience</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-6">
          {currentUser.experience.map((exp, idx) => (
            <div key={exp.id} className={`${idx !== 0 ? 'pt-6' : ''} space-y-2`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {exp.role}
                  </h3>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block">
                    {exp.company}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 tabular-nums">
                    <span>{exp.period}</span>
                    <span>·</span>
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300 pl-1 leading-relaxed">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Education */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Education</span>
          </h2>
          <div className="space-y-4">
            {currentUser.education.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {edu.school}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {edu.degree}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400 tabular-nums">
                  <span>{edu.period}</span>
                  {edu.honors && (
                    <>
                      <span>·</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {edu.honors}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Licenses & Certifications</span>
          </h2>
          <div className="space-y-4">
            {currentUser.certifications.map((cert) => (
              <div key={cert.id} className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {cert.name}
                  </h3>
                  {cert.verified && (
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {cert.issuer}
                </p>
                <span className="text-[11px] text-slate-400 block tabular-nums">
                  {cert.issueDate} · ID: {cert.credentialId}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Skills Section with Endorsement Counts */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Skills & Endorsements
          </h2>
          <button
            onClick={() => setActiveTab('ai-lab')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Scan Missing Skills with AI</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {currentUser.skills.map((skill, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between"
            >
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {skill.name}
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                +{skill.endorsements}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Edit Professional Identity
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                  About / Bio
                </label>
                <textarea
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick View PDF Resume Modal */}
      <ResumePreviewModal
        isOpen={isResumePreviewOpen}
        onClose={() => setIsResumePreviewOpen(false)}
        user={currentUser}
        onOpenAiOptimizer={() => setActiveTab('ai-lab')}
      />

    </div>
  );
};
