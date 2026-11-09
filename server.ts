import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with required headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'ConnectNetwalk',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Helper to cleanly extract and parse JSON even if Gemini returns markdown code fences or conversational text
function safeJsonParse<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Strip markdown code fences ```json ... ``` or ``` ... ```
    const cleaned = trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      // Regex search for first object or array block
      const match = trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {}
      }
      return fallback;
    }
  }
}

// Timeout helper so calls with invalid keys or slow networks do not block the UI
async function withTimeout<T>(promise: Promise<T>, ms: number = 3800): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI generation timeout')), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

// AI Profile Optimizer
app.post('/api/gemini/profile-optimize', async (req, res) => {
  const { headline, about, currentRole, skills } = req.body;

  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are an elite Silicon Valley executive career coach and personal branding strategist for ConnectNetwalk (a modern high-tech professional network like LinkedIn + Stripe + Linear).
Review the following user profile:
- Current Role: ${currentRole || 'Software Professional'}
- Headline: ${headline || 'Software Engineer at Tech Co'}
- About: ${about || 'Passionate about engineering, scalability, and high-impact systems.'}
- Key Skills: ${Array.isArray(skills) ? skills.join(', ') : skills || 'React, TypeScript, Cloud'}

Provide an ultra-sharp, high-impact optimization in JSON format with the following keys:
{
  "optimizedHeadlines": ["3 high-converting, punchy headlines (under 120 chars)"],
  "improvedAbout": "A compelling 3-paragraph executive summary highlighting quantified impact, technical depth, and strategic leadership",
  "missingHighValueSkills": ["4-5 high-demand skills/keywords the user should highlight"],
  "strategicTips": ["3 concrete actions to boost profile visibility and recruiter conversion"]
}
Return only pure JSON.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        3800
      );

      const parsed = safeJsonParse<any>(response.text, null);
      if (parsed) {
        return res.json({ success: true, data: parsed, engine: 'gemini-3.8-flash' });
      }
    } catch (error: any) {
      console.warn('Gemini live profile optimization failed or timed out, using domain fallback:', error.message);
    }
  }

  // Resilient domain fallback
  const fallbackData = {
    optimizedHeadlines: [
      `${currentRole || 'Staff Systems Engineer'} | Distributed Architectures & Real-Time Low-Latency Inference`,
      `Principal Systems Architect | Scaling Tier-1 Event Fabrics & Microservices to 2.8M RPS`,
      `Founding Systems Lead | Distributed Inference, Rust/Go Core Runtimes & High-Velocity RFCs`,
    ],
    improvedAbout: `Principal & Staff Systems Architect with deep specialization in distributed data planes, sub-15ms ML inference pipelining, and high-throughput transactional backends.\n\nDemonstrated track record scaling critical services to 40M+ daily active sessions while pruning cloud compute expenditures by over 30%. Passionate about clean system design RFCs, developer tooling velocity, and mentoring rising technical talent.\n\nConstantly exploring zero-copy IPC, vector indexing memory architectures, and active-active multi-region resiliency.`,
    missingHighValueSkills: [
      'Sub-15ms Latency Profiling',
      'RDMA & Zero-Copy gRPC',
      'eBPF Network Telemetry',
      'Distributed Transactional Consensus',
      'Large Scale GPU Memory Bandwidth Tuning',
    ],
    strategicTips: [
      'Pin your top RFC architecture breakdown to the Featured section to double inbound founder reach.',
      'Quantify business ROI (e.g. compute cost reduction or latency percentiles) in the first 2 lines of each role.',
      'Highlight cross-functional org multipliers, such as leading company-wide technical design reviews.',
    ],
  };

  return res.json({ success: true, data: fallbackData, engine: 'domain-fallback' });
});

// AI Resume Analyzer
app.post('/api/gemini/resume-analyzer', async (req, res) => {
  const { resumeText, targetRole, industry } = req.body;

  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are a Principal Technical Recruiter and ATS (Applicant Tracking System) specialist at a tier-1 tech firm.
Analyze this candidate profile / resume excerpt against the target role:
- Target Role: ${targetRole || 'Senior Full-Stack Engineer / Engineering Lead'}
- Industry: ${industry || 'Enterprise SaaS / Cloud'}
- Resume / Profile text:
${resumeText || 'Full-Stack Developer with 5 years experience in React, Node.js, distributed databases, and high-load architecture.'}

Evaluate thoroughly and return JSON matching this structure:
{
  "atsScore": 88, // integer between 0 and 100
  "summaryRating": "Strong Candidate / Competitive / Needs Metric Refinement",
  "strengths": ["Top 3 impressive accomplishments and strengths"],
  "gaps": ["Top 2-3 missing certifications, architecture keywords, or metrics"],
  "bulletImprovements": [
    {
      "original": "Weak bullet or generic description",
      "revised": "Impactful XYZ formula bullet: Accomplished [X], as measured by [Y], by doing [Z]"
    }
  ],
  "interviewFocusAreas": ["3 technical topics recruiters will grill this candidate on"]
}
Return only pure JSON.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        3800
      );

      const parsed = safeJsonParse<any>(response.text, null);
      if (parsed) {
        return res.json({ success: true, data: parsed, engine: 'gemini-3.8-flash' });
      }
    } catch (error: any) {
      console.warn('Gemini live resume analyzer failed or timed out, using domain fallback:', error.message);
    }
  }

  // Resilient domain fallback
  const fallbackResume = {
    atsScore: 94,
    summaryRating: "Top 5% Tier-1 Candidate (Exceeds Senior Staff Benchmark)",
    strengths: [
      "Quantified high-scale impact (e.g. cutting p99 latency from 140ms to 22ms at 40M RPS).",
      "Proven multi-region infrastructure ownership across hybrid cloud environments (AWS & GCP).",
      "Demonstrated organizational multiplier effect through cross-team RFC stewardship.",
    ],
    gaps: [
      "Could explicitly highlight experience with kernel-bypass networking (RDMA/DPDK).",
      "Add explicit mention of GPU cluster scheduling algorithms (Slurm / Kubernetes Device Plugins).",
    ],
    bulletImprovements: [
      {
        original: "Worked on reducing latency of our ML model APIs.",
        revised: "Architected real-time speculative prefix-caching layer in Rust & Go, slashing p99 latency by 84% (140ms -> 22ms) across 40M daily user sessions."
      },
      {
        original: "Helped team deploy services with Kubernetes and Docker.",
        revised: "Standardized multi-cluster Kubernetes deployment pipelines across 12 global regions, achieving 99.999% SLA and eliminating deployment rollbacks."
      }
    ],
    interviewFocusAreas: [
      "Cache coherence and race prevention under high concurrent writes in distributed Redis clusters.",
      "Trade-offs between gRPC streaming vs WebSocket push in ultra-low latency client interactions.",
      "How to design an organizational RFC review process that balances velocity with architectural rigor."
    ]
  };

  return res.json({ success: true, data: fallbackResume, engine: 'domain-fallback' });
});

// AI Career Roadmap
app.post('/api/gemini/career-roadmap', async (req, res) => {
  const { currentTitle, targetTitle, timeframeYears } = req.body;

  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Create a realistic, prestigious career advancement roadmap from:
- Current: ${currentTitle || 'Senior Software Engineer'}
- Target: ${targetTitle || 'Staff Engineer / VP of Technology'}
- Timeframe: ${timeframeYears || '2-3'} years

Generate a JSON object with:
{
  "targetMilestones": [
    {
      "period": "Months 1-6: Technical Mastery & Scope Expansion",
      "deliverables": ["2-3 specific technical goals, e.g., cross-org architecture, open-source"],
      "skillsToAcquire": ["Key hard skills"]
    },
    {
      "period": "Months 7-18: Influence & Strategic Leadership",
      "deliverables": ["Mentorship, RFC authoring, system design reviews"],
      "skillsToAcquire": ["Key soft & leadership skills"]
    },
    {
      "period": "Months 19-36: Executive & Industry Eminence",
      "deliverables": ["Conference speaking, business impact, organizational hiring"],
      "skillsToAcquire": ["Executive communication & budgeting"]
    }
  ],
  "keyPitfallsToAvoid": ["2 critical traps that stall promotion to this level"],
  "recommendedBooksOrResources": ["3 foundational books or frameworks"]
}
Return only pure JSON.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        3800
      );

      const parsed = safeJsonParse<any>(response.text, null);
      if (parsed) {
        return res.json({ success: true, data: parsed, engine: 'gemini-3.8-flash' });
      }
    } catch (error: any) {
      console.warn('Gemini live career roadmap failed or timed out, using domain fallback:', error.message);
    }
  }

  // Resilient domain fallback
  const fallbackRoadmap = {
    targetMilestones: [
      {
        period: "Months 1-6: Architectural Scope Expansion",
        deliverables: [
          "Author and defend a cross-department RFC standardizing real-time telemetry streaming.",
          "Identify and eliminate a $100k+/year infrastructure inefficiency in compute provisioning.",
          "Lead a zero-downtime database migration impacting more than 3 distinct engineering squads."
        ],
        skillsToAcquire: ["Distributed Consensus (Raft/Paxos)", "eBPF Kernel Tracing", "System RFC Design"]
      },
      {
        period: "Months 7-18: Strategic Influence & Force Multiplier",
        deliverables: [
          "Mentor 3 senior engineers towards staff promotion with structured weekly design reviews.",
          "Establish organization-wide latency and reliability SLOs with executive signoff.",
          "Co-author a patent or publish high-signal technical engineering blog post read by 10k+ engineers."
        ],
        skillsToAcquire: ["Executive Stakeholder Alignment", "CapEx/OpEx Cloud Modeling", "Talent Interview Rubrics"]
      },
      {
        period: "Months 19-36: Industry Eminence & Executive Scope",
        deliverables: [
          "Direct multi-year technical strategy aligning with company ARR and market moat.",
          "Serve as primary technical advisor to VP of Engineering and CTO on M&A or vendor selection.",
          "Keynote speaker at tier-1 systems conference (e.g., QCon, Strange Loop, or Systems Distributed)."
        ],
        skillsToAcquire: ["Strategic Technology Roadmapping", "Board-Level Communication", "Engineering Org Topology"]
      }
    ],
    keyPitfallsToAvoid: [
      "Staying heads-down writing code instead of unblocking 20+ other engineers through high-leverage architectural primitives.",
      "Becoming dogmatic about technology stacks rather than anchoring decisions strictly to business latency and cost curves."
    ],
    recommendedBooksOrResources: [
      "Designing Data-Intensive Applications (Martin Kleppmann)",
      "The Staff Engineer's Path (Tanya Reilly)",
      "An Elegant Puzzle: Systems of Engineering Management (Will Larson)"
    ]
  };

  return res.json({ success: true, data: fallbackRoadmap, engine: 'domain-fallback' });
});

// AI Content & Post Generator
app.post('/api/gemini/content-generator', async (req, res) => {
  const { topic, format, tone } = req.body;

  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are a viral Silicon Valley tech creator and founder on ConnectNetwalk (a modern professional network like LinkedIn + Linear).
Draft a high-engagement post:
- Topic: ${topic || 'Scaling distributed systems from 1k to 1M QPS'}
- Format: ${format || 'Story & Lessons learned with bullet points'}
- Tone: ${tone || 'Authoritative yet humble, transparent, high-signal'}

Guidelines:
1. Start with an irresistible 1-line hook (no generic "I'm thrilled to announce" clichés!).
2. Short, readable paragraphs with breathing room.
3. Concrete insights or framework steps.
4. An engaging closing question to spark thoughtful discussion.
5. 3-4 tasteful hashtags.

Return pure JSON:
{
  "hook": "Punchy first sentence",
  "content": "Full formatted markdown post text",
  "suggestedPollQuestion": "Optional poll question that complements this post",
  "suggestedPollOptions": ["Option A", "Option B", "Option C", "Option D"],
  "hashtags": ["#DistributedSystems", "#EngineeringLeadership", "#Scale"]
}`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        3800
      );

      const parsed = safeJsonParse<any>(response.text, null);
      if (parsed) {
        return res.json({ success: true, data: parsed, engine: 'gemini-3.8-flash' });
      }
    } catch (error: any) {
      console.warn('Gemini live post generation failed or timed out, using domain fallback:', error.message);
    }
  }

  // Resilient domain fallback
  const fallbackPost = {
    hook: `Most teams scaling distributed systems optimize database queries, but 80% of our production latency was hidden in plain sight.`,
    content: `When scaling our core cluster past 1.2M QPS, our p99 latency started degrading unpredictably.\n\nAfter profiling with eBPF and flame graphs, we uncovered 3 non-obvious culprits:\n\n1. TCP handshakes & connection churn: Switching to persistent HTTP/2 gRPC channels saved 42ms per hop.\n2. Serialization bottlenecks: Moving internal RPC payloads from JSON to FlatBuffers eliminated 60% of our CPU memory allocation spikes.\n3. Speculative prefix caching: Storing pre-computed query token masks in Redis cluster gave us a 91% cache hit rate on repeated enterprise workflows.\n\nBefore you rewrite your database queries or buy more GPU servers, instrument the actual network payload lifecycle. The numbers might surprise you.\n\nWhat is the most counter-intuitive bottleneck you have diagnosed in production?`,
    suggestedPollQuestion: "Where do you typically uncover the worst p99 latency in your architecture?",
    suggestedPollOptions: [
      "JSON / Payload Serialization",
      "Unpooled TCP Handshakes",
      "Unindexed Database Queries",
      "Distributed Lock Contention"
    ],
    hashtags: ["DistributedSystems", "EngineeringLeadership", "Performance", "CloudScale"]
  };

  return res.json({ success: true, data: fallbackPost, engine: 'domain-fallback' });
});

// AI Outreach / Message Generator
app.post('/api/gemini/outreach-message', async (req, res) => {
  const { recipientName, recipientRole, senderGoal, extraDetails } = req.body;

  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Write a high-converting, warm, professional message on ConnectNetwalk:
- Recipient: ${recipientName || 'Alex'} (${recipientRole || 'Engineering Director'})
- Sender Goal: ${senderGoal || 'Exploring potential collaboration / high-level engineering hire opportunity'}
- Details: ${extraDetails || 'Admire their recent post on microfrontends and Kubernetes migration'}

Rules:
- Under 100 words.
- Specific, respectful of their time, zero corporate jargon, authentic human tone.
- Low friction call to action (e.g. 10-minute async chat or coffee).

Return pure JSON:
{
  "subjectLine": "Quick question regarding [Topic]",
  "messageBody": "The polished message body text",
  "followUpTip": "Tip on when and how to follow up if no reply"
}`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        3800
      );

      const parsed = safeJsonParse<any>(response.text, null);
      if (parsed) {
        return res.json({ success: true, data: parsed, engine: 'gemini-3.8-flash' });
      }
    } catch (error: any) {
      console.warn('Gemini live outreach generation failed or timed out, using domain fallback:', error.message);
    }
  }

  // Resilient domain fallback
  const cleanName = (recipientName || 'Alex').split(' ')[0];
  const fallbackOutreach = {
    subjectLine: `Quick question on your distributed systems architecture`,
    messageBody: `Hi ${cleanName},\n\nI really enjoyed reading your recent insights regarding low-latency inference caching. The way you tackled serialization overhead with persistent channels resonated deeply with what our engineering team has been exploring.\n\n${senderGoal || 'I would love to connect and hear your perspective on scaling distributed data planes.'} If you're open to a quick 10-minute async chat or virtual coffee sometime next week, I'd be grateful to exchange notes.\n\nBest,\nAlex`,
    followUpTip: "If no response after 4 business days, follow up with a short 1-line update referencing a new benchmark or relevant industry paper."
  };

  return res.json({ success: true, data: fallbackOutreach, engine: 'domain-fallback' });
});

// AI Smart Reply suggestions
app.post('/api/gemini/smart-replies', async (req, res) => {
  const { lastMessage, senderName } = req.body;

  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `A colleague or recruiter (${senderName || 'Colleague'}) just sent this message:
"${lastMessage || 'Would you be open to a 15-minute sync this Thursday to discuss the Staff Architect opening?'}"

Provide 3 distinct quick reply drafts in JSON:
{
  "replies": [
    { "type": "Accept / Enthusiastic", "text": "Short affirmative response" },
    { "type": "Busy / Need Info First", "text": "Polite request for JD/compensation range or agenda" },
    { "type": "Respectful Decline", "text": "Gracious pass keeping the door open for future" }
  ]
}`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        3800
      );

      const parsed = safeJsonParse<any>(response.text, null);
      if (parsed && Array.isArray(parsed.replies)) {
        return res.json({ success: true, data: parsed, engine: 'gemini-3.8-flash' });
      }
    } catch (error: any) {
      console.warn('Gemini live smart replies failed or timed out, using domain fallback:', error.message);
    }
  }

  // Resilient domain fallback
  const fallbackReplies = {
    replies: [
      {
        type: "Enthusiastic Acceptance",
        text: "Thanks for reaching out! I'd love to chat. Thursday afternoon works great on my end."
      },
      {
        type: "Request Details First",
        text: "Appreciate the note! Could you share a quick link to the role scope and team charter?"
      },
      {
        type: "Warm Follow-Up",
        text: "Sounds promising! Let's connect over a brief 15-min briefing this week."
      }
    ]
  };

  return res.json({ success: true, data: fallbackReplies, engine: 'domain-fallback' });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ConnectNetwalk platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
