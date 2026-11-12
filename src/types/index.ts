export type UserRole = 'job_seeker' | 'recruiter' | 'company_admin' | 'super_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  headline: string;
  location: string;
  avatar: string;
  bannerImage: string;
  about: string;
  currentCompany: string;
  currentRole: string;
  connectionsCount: number;
  followersCount: number;
  profileViewsMonthly: number;
  searchAppearancesMonthly: number;
  isPremium: boolean;
  isAvailableForHire: boolean;
  skills: { name: string; endorsements: number }[];
  experience: {
    id: string;
    company: string;
    role: string;
    period: string;
    location: string;
    bullets: string[];
    logo?: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    period: string;
    honors?: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    credentialId: string;
    verified: boolean;
  }[];
  resumeText: string;
}

export interface PostPoll {
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  authorCompany?: string;
  timestamp: string;
  content: string;
  tags: string[];
  postType: 'text' | 'image' | 'poll' | 'article';
  imageUrl?: string;
  poll?: PostPoll;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  userLiked?: boolean;
  userSaved?: boolean;
  isFollowingAuthor?: boolean;
  isConnectionAuthor?: boolean;
  comments: PostComment[];
  isFlagged?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-Site';
  employmentType: 'Full-time' | 'Contract' | 'Part-time';
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  postedAt: string;
  applicantsCount: number;
  description: string;
  requirements: string[];
  preferredSkills: string[];
  easyApply: boolean;
  hasApplied?: boolean;
  isSaved?: boolean;
  matchScore?: number;
}

export interface Company {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  industry: string;
  headquarters: string;
  employeeCount: string;
  website: string;
  about: string;
  followersCount: number;
  isFollowing?: boolean;
  openJobsCount: number;
  specialties: string[];
}

export interface Connection {
  id: string;
  userId: string;
  name: string;
  headline: string;
  avatar: string;
  company: string;
  mutualCount: number;
  status: 'connected' | 'pending' | 'suggested';
  connectedDate?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  readAt?: string;
  metadata?: {
    readReceiptsEnabled?: boolean;
    deliveredAt?: string;
    readAt?: string;
    clientPlatform?: string;
    [key: string]: any;
  };
  voiceDuration?: string;
  reactions?: string[];
  attachmentName?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantHeadline: string;
  participantAvatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  readReceiptsEnabled?: boolean;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'connection' | 'job' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  avatarUrl?: string;
  actionUrl?: string;
}

export interface SupabaseConfig {
  projectId: string;
  publishableKey: string;
  connected: boolean;
  lastSyncTimestamp?: string;
}
