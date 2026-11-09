import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Post,
  Job,
  Company,
  Connection,
  Conversation,
  NotificationItem,
  SupabaseConfig,
  UserRole,
} from '../types';
import {
  CURRENT_USER,
  RECRUITER_USER,
  INITIAL_POSTS,
  INITIAL_JOBS,
  INITIAL_COMPANIES,
  INITIAL_CONNECTIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export type ActiveTab =
  | 'feed'
  | 'network'
  | 'jobs'
  | 'messages'
  | 'ai-lab'
  | 'companies'
  | 'profile'
  | 'admin'
  | 'premium';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentUser: UserProfile;
  activeRole: UserRole;
  switchUserRole: (role: UserRole) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  posts: Post[];
  createPost: (newPost: Omit<Post, 'id' | 'timestamp' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'comments'>) => void;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  flagPost: (postId: string) => void;
  removePost: (postId: string) => void;
  jobs: Job[];
  applyToJob: (jobId: string) => void;
  createJob: (jobData: Omit<Job, 'id' | 'postedAt' | 'applicantsCount' | 'hasApplied'>) => void;
  companies: Company[];
  toggleFollowCompany: (companyId: string) => void;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  connections: Connection[];
  acceptConnection: (connId: string) => void;
  rejectConnection: (connId: string) => void;
  sendConnectionRequest: (connId: string) => void;
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  sendMessage: (convId: string, text: string, isAi?: boolean) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: Partial<SupabaseConfig>) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  isCreatePostModalOpen: boolean;
  setIsCreatePostModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'connect_netwalk_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('job_seeker');
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_posts`);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_jobs`);
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_companies`);
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_connections`);
    return saved ? JSON.parse(saved) : INITIAL_CONNECTIONS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_conversations`);
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string>('conv_1');

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_supabase`);
    return saved ? JSON.parse(saved) : { projectId: '', publishableKey: '', connected: false };
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Persist key slices to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_posts`, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_companies`, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_connections`, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_conversations`, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_supabase`, JSON.stringify(supabaseConfig));
  }, [supabaseConfig]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchUserRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'recruiter') {
      setCurrentUser(RECRUITER_USER);
      addToast('Switched to Executive Recruiter persona (Sarah Vance)', 'info');
    } else if (role === 'job_seeker') {
      setCurrentUser(CURRENT_USER);
      addToast('Switched to Technical Staff persona (Alex Rivera)', 'info');
    } else if (role === 'super_admin') {
      setCurrentUser({
        ...CURRENT_USER,
        name: 'Super Admin',
        role: 'super_admin',
        headline: 'Platform Operations & Moderation Directorate',
      });
      addToast('Platform Admin privileges activated', 'info');
    } else {
      setCurrentUser({
        ...CURRENT_USER,
        name: 'David Sterling',
        role: 'company_admin',
        headline: 'VP Engineering & Executive Admin @ QuantumScale',
      });
      addToast('Switched to Company Executive persona (David Sterling)', 'info');
    }
  };

  const createPost = (newPostData: Omit<Post, 'id' | 'timestamp' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'comments'>) => {
    const post: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
      timestamp: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      comments: [],
    };
    setPosts([post, ...posts]);
    addToast('Post published to ConnectNetwalk network!', 'success');
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const userLiked = !p.userLiked;
          return {
            ...p,
            userLiked,
            likesCount: userLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const toggleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const userSaved = !p.userSaved;
          addToast(userSaved ? 'Post saved to your bookmarks' : 'Post removed from bookmarks', 'info');
          return { ...p, userSaved };
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const comment = {
      id: `c_${Date.now()}`,
      authorName: currentUser.name,
      authorHeadline: currentUser.headline,
      authorAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      likesCount: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, comment],
          };
        }
        return p;
      })
    );
    addToast('Comment added', 'success');
  };

  const votePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.poll && !p.poll.userVotedOptionId) {
          const updatedOptions = p.poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...p,
            poll: {
              ...p.poll,
              options: updatedOptions,
              totalVotes: p.poll.totalVotes + 1,
              userVotedOptionId: optionId,
            },
          };
        }
        return p;
      })
    );
    addToast('Vote registered on poll', 'success');
  };

  const flagPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isFlagged: !p.isFlagged } : p))
    );
    addToast('Post flagged for review by trust & safety team', 'info');
  };

  const removePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    addToast('Post removed from network per safety guidelines', 'info');
  };

  const applyToJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            hasApplied: true,
            applicantsCount: j.applicantsCount + 1,
          };
        }
        return j;
      })
    );
    addToast('Application submitted with your ConnectNetwalk resume!', 'success');
  };

  const createJob = (jobData: Omit<Job, 'id' | 'postedAt' | 'applicantsCount' | 'hasApplied'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      postedAt: 'Just now',
      applicantsCount: 0,
      hasApplied: false,
    };
    setJobs([newJob, ...jobs]);
    addToast('New open position published to the talent portal!', 'success');
  };

  const toggleFollowCompany = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          const isFollowing = !c.isFollowing;
          addToast(
            isFollowing ? `Now following ${c.name}` : `Unfollowed ${c.name}`,
            'info'
          );
          return {
            ...c,
            isFollowing,
            followersCount: isFollowing ? c.followersCount + 1 : Math.max(0, c.followersCount - 1),
          };
        }
        return c;
      })
    );
  };

  const acceptConnection = (connId: string) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.id === connId ? { ...c, status: 'connected', connectedDate: 'Just now' } : c
      )
    );
    setCurrentUser((prev) => ({ ...prev, connectionsCount: prev.connectionsCount + 1 }));
    addToast('Connection accepted! Added to your professional network', 'success');
  };

  const rejectConnection = (connId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
    addToast('Connection invitation dismissed', 'info');
  };

  const sendConnectionRequest = (connId: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === connId ? { ...c, status: 'pending' } : c))
    );
    addToast('Connection request sent with personalized intro', 'success');
  };

  const sendMessage = (convId: string, text: string, isAi = false) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    if (isAi) {
      addToast('AI smart message dispatched', 'info');
    }

    // Simulate instant natural response from participant after 2 seconds
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            const replies = [
              'Got it! Looking over your note right now.',
              'Thanks for sending this through. Let me loop in the team.',
              'Sounds fantastic! Excited to collaborate.',
            ];
            const replyText = replies[Math.floor(Math.random() * replies.length)];
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: 'Just now',
              messages: [
                ...c.messages,
                {
                  id: `reply_${Date.now()}`,
                  senderId: c.participantId,
                  text: replyText,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isRead: true,
                },
              ],
            };
          }
          return c;
        })
      );
    }, 2400);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
    addToast('Profile updated successfully', 'success');
  };

  const updateSupabaseConfig = (cfg: Partial<SupabaseConfig>) => {
    setSupabaseConfig((prev) => ({
      ...prev,
      ...cfg,
      lastSyncTimestamp: new Date().toISOString(),
    }));
    addToast('Supabase configuration saved', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        switchUserRole,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isDarkMode,
        toggleDarkMode,
        posts,
        createPost,
        toggleLikePost,
        toggleSavePost,
        addComment,
        votePoll,
        flagPost,
        removePost,
        jobs,
        applyToJob,
        createJob,
        companies,
        toggleFollowCompany,
        selectedCompanyId,
        setSelectedCompanyId,
        connections,
        acceptConnection,
        rejectConnection,
        sendConnectionRequest,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        updateProfile,
        supabaseConfig,
        updateSupabaseConfig,
        toasts,
        addToast,
        removeToast,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        isCreatePostModalOpen,
        setIsCreatePostModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
