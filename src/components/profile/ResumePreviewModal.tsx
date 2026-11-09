import React, { useState } from 'react';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Printer,
  FileText,
  Sparkles,
  ExternalLink,
  MapPin,
  Mail,
  Globe,
  Award,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onOpenAiOptimizer?: () => void;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAiOptimizer,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activePage, setActivePage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'sheet' | 'ats'>('sheet');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 70));
  const handleResetZoom = () => setZoomLevel(100);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([user.resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.name.replace(/\s+/g, '_')}_Executive_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(user.resumeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Document Viewer Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {user.name.replace(/\s+/g, '_')}_Staff_Architect_Resume.pdf
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  ATS 96% Match
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                PDF 1.7 • 2 Pages • Verified Digital Talent Passport
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium">
              <button
                onClick={() => setViewMode('sheet')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'sheet'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Rendered PDF
              </button>
              <button
                onClick={() => setViewMode('ats')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'ats'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                ATS Raw Stream
              </button>
            </div>

            {/* Zoom Controls */}
            {viewMode === 'sheet' && (
              <div className="hidden sm:flex items-center gap-1 px-1.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 70}
                  className="p-1 hover:text-blue-600 disabled:opacity-40 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-1.5 font-mono text-[11px] hover:text-blue-600 transition-colors"
                  title="Reset to 100%"
                >
                  {zoomLevel}%
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 160}
                  className="p-1 hover:text-blue-600 disabled:opacity-40 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Page navigation */}
            {viewMode === 'sheet' && (
              <div className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <button
                  onClick={() => setActivePage((p) => Math.max(p - 1, 1))}
                  disabled={activePage === 1}
                  className="p-1 hover:text-blue-600 disabled:opacity-40 transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-medium px-1">
                  Page {activePage} of 2
                </span>
                <button
                  onClick={() => setActivePage((p) => Math.min(p + 1, 2))}
                  disabled={activePage === 2}
                  className="p-1 hover:text-blue-600 disabled:opacity-40 transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Action buttons */}
            {onOpenAiOptimizer && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAiOptimizer();
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>AI Review</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-all"
              title="Download Resume"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewer Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-slate-200/70 dark:bg-slate-950/80">
          
          {/* SHEET VIEW (High-fidelity rendered executive resume) */}
          {viewMode === 'sheet' ? (
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-150 ease-out"
            >
              <div className="w-[794px] min-h-[1123px] bg-white text-slate-900 shadow-2xl rounded-sm p-12 sm:p-14 relative flex flex-col justify-between border border-slate-300/80">
                
                {/* PAGE 1 CONTENT */}
                {activePage === 1 && (
                  <div className="space-y-6">
                    {/* Resume Header */}
                    <div className="border-b-2 border-slate-900 pb-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 uppercase font-sans">
                            {user.name}
                          </h1>
                          <p className="text-base font-semibold text-blue-700 tracking-wide mt-0.5">
                            {user.headline}
                          </p>
                        </div>
                        <div className="text-right text-[11px] text-slate-600 space-y-0.5 font-sans">
                          <p className="font-semibold text-slate-900">{user.location}</p>
                          <p>alex.rivera@connectnetwalk.io</p>
                          <p className="text-blue-700 font-mono">github.com/alexrivera</p>
                        </div>
                      </div>

                      {/* Coordinates bar */}
                      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-sans">
                        <span>Work Authorization: US Citizen</span>
                        <span>•</span>
                        <span>Security Clearance: Public Trust Eligible</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ConnectNetwalk Identity Verified
                        </span>
                      </div>
                    </div>

                    {/* Section: Executive Summary */}
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 font-sans">
                        Executive Summary & Architectural Scope
                      </h2>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans text-justify">
                        {user.about}
                      </p>
                    </div>

                    {/* Section: Core Technical Competencies */}
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 font-sans">
                        Core Technical Competencies & Systems Stack
                      </h2>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-sans">
                        <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                          <span className="font-bold text-slate-900 block mb-0.5">Distributed Core</span>
                          <span className="text-slate-600">Rust, Go, C++, gRPC, RDMA, Protocol Buffers, FlatBuffers</span>
                        </div>
                        <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                          <span className="font-bold text-slate-900 block mb-0.5">Data & Storage</span>
                          <span className="text-slate-600">PostgreSQL, Redis Cluster, ScyllaDB, ClickHouse, Apache Kafka</span>
                        </div>
                        <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                          <span className="font-bold text-slate-900 block mb-0.5">Cloud & Kernel</span>
                          <span className="text-slate-600">Kubernetes (K8s), eBPF, Linux Kernel Tuning, AWS, GCP, Docker</span>
                        </div>
                      </div>
                    </div>

                    {/* Section: Professional Experience */}
                    <div className="space-y-4">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 font-sans">
                        Professional Systems Experience
                      </h2>

                      {/* Role 1 */}
                      <div className="space-y-1.5 font-sans">
                        <div className="flex items-start justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-950">Staff Distributed Systems Architect</span>
                            <span className="text-slate-600 font-medium"> — QuantumScale Systems</span>
                          </div>
                          <span className="font-mono text-slate-600 text-[11px]">2022 — Present · San Francisco, CA</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 leading-normal pl-1">
                          <li>
                            Architected core real-time speculative inference pipeline across 6 multi-region clusters, serving <strong>40M+ daily user sessions</strong> at 99.999% availability.
                          </li>
                          <li>
                            Reduced distributed cluster p99 tail latency from <strong>140ms to 22ms</strong> (slashing latency by 84%) via custom eBPF zero-copy TCP socket telemetry.
                          </li>
                          <li>
                            Authored and defended 8 cross-organization architecture RFCs, standardizing RPC schema governance and decreasing inter-service breaking changes to zero.
                          </li>
                          <li>
                            Spearheaded cloud compute rightsizing campaign, decommissioning underutilized GPU nodes and saving <strong>$1.4M annually in AWS compute spend</strong>.
                          </li>
                        </ul>
                      </div>

                      {/* Role 2 */}
                      <div className="space-y-1.5 font-sans">
                        <div className="flex items-start justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-950">Principal Systems & Infrastructure Engineer</span>
                            <span className="text-slate-600 font-medium"> — Aurora Cloud Platform</span>
                          </div>
                          <span className="font-mono text-slate-600 text-[11px]">2019 — 2022 · Seattle, WA</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 leading-normal pl-1">
                          <li>
                            Designed custom Kubernetes scheduling controller balancing mixed ML inference and transactional API workloads across 1,800 bare-metal instances.
                          </li>
                          <li>
                            Built distributed multi-tier caching layer on top of Redis Cluster and NVMe SSD tiers, handling over <strong>2.8M peak QPS</strong>.
                          </li>
                          <li>
                            Mentored a squad of 11 senior and staff engineers, conducting weekly systems design workshops and peer code quality reviews.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 2 CONTENT */}
                {activePage === 2 && (
                  <div className="space-y-6">
                    {/* Header Continued */}
                    <div className="border-b border-slate-300 pb-3 flex items-center justify-between text-xs font-sans text-slate-500">
                      <span className="font-bold text-slate-900">{user.name} — Curriculum Vitae</span>
                      <span>Page 2 of 2</span>
                    </div>

                    {/* Prior Role 3 */}
                    <div className="space-y-3 font-sans">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                        Professional Systems Experience (Continued)
                      </h2>

                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-950">Senior Infrastructure Developer</span>
                            <span className="text-slate-600 font-medium"> — Hyperion Cloud Data</span>
                          </div>
                          <span className="font-mono text-slate-600 text-[11px]">2017 — 2019 · San Jose, CA</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 leading-normal pl-1">
                          <li>
                            Migrated monolithic Cassandra data plane to partitioned distributed ScyllaDB, improving write throughput by <strong>320%</strong>.
                          </li>
                          <li>
                            Automated multi-region CI/CD delivery pipelines with Terraform and GitHub Actions, reducing deployment lead time from 4 days to 18 minutes.
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Patents & RFC Publications */}
                    <div className="space-y-2 font-sans">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                        Patents & RFC Publications
                      </h2>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                          <span className="font-bold text-slate-900 block">
                            US Patent #11,842,910: Speculative Cache Coherence for Distributed Key-Value Fabrics
                          </span>
                          <span className="text-[11px] text-slate-600">
                            Inventors: Alex Rivera, Marcus Chen · Issued: November 2023 · USPTO
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                          <span className="font-bold text-slate-900 block">
                            RFC-8891: Zero-Copy IPC Protocols in Containerized Microkernel Runtimes
                          </span>
                          <span className="text-[11px] text-slate-600">
                            Lead Author · Systems Architecture Working Group · 2022
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Education */}
                    <div className="space-y-2 font-sans">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                        Education & Academic Honors
                      </h2>
                      <div className="flex items-start justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-950">
                            University of California, Berkeley
                          </p>
                          <p className="text-slate-700">
                            Bachelor of Science (B.S.) in Computer Science & Distributed Systems
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Honors: Summa Cum Laude · Regents' and Chancellor's Scholar (Top 1.5%)
                          </p>
                        </div>
                        <span className="font-mono text-slate-600 text-[11px]">2013 — 2017</span>
                      </div>
                    </div>

                    {/* Verified Certifications */}
                    <div className="space-y-2 font-sans">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                        Industry Certifications & Accreditations
                      </h2>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {user.certifications.map((cert) => (
                          <div key={cert.id} className="p-2 border border-slate-200 rounded">
                            <span className="font-bold text-slate-900 block">{cert.name}</span>
                            <span className="text-[11px] text-slate-600">
                              {cert.issuer} · Credential ID: {cert.credentialId}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Page Footer */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                  <span>ConnectNetwalk Verified Talent Passport • Document ID: #CNW-98421</span>
                  <span>Page {activePage} of 2</span>
                </div>

              </div>
            </div>
          ) : (
            /* ATS RAW TEXT VIEW */
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Machine-Readable ATS Plaintext Stream
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Exact text parsed by Greenhouse, Lever, and Workday ATS algorithms.
                  </p>
                </div>
                <button
                  onClick={handleCopyText}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                >
                  {isCopied ? 'Copied to Clipboard!' : 'Copy Raw Text'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
                {user.resumeText}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Bottom Status Bar */}
        <div className="px-6 py-2.5 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Live Preview Active
            </span>
            <span>·</span>
            <span>Press ESC or click Outside to close</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrint}
              className="hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
