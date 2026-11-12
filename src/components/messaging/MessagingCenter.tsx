import React, { useState, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Phone,
  Video,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  CheckCheck,
  Check,
  Search,
  Loader2,
  X,
  Settings,
  Eye,
  EyeOff,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessagingCenter: React.FC = () => {
  const {
    currentUser,
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    toggleConversationReadReceipts,
    addToast,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [smartReplies, setSmartReplies] = useState<{ type: string; text: string }[]>([]);
  const [isLoadingSmartReplies, setIsLoadingSmartReplies] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inspectingMessageId, setInspectingMessageId] = useState<string | null>(null);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Fetch smart replies whenever active conversation changes
  useEffect(() => {
    if (!activeConv || activeConv.messages.length === 0) return;
    const lastMsg = activeConv.messages[activeConv.messages.length - 1];

    const fetchReplies = async () => {
      setIsLoadingSmartReplies(true);
      try {
        const res = await fetch('/api/gemini/smart-replies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lastMessage: lastMsg.text,
            senderName: activeConv.participantName,
          }),
        });
        const data = await res.json();
        if (data.success && data.data?.replies) {
          setSmartReplies(data.data.replies);
        }
      } catch (err) {
        console.error('Smart replies failed', err);
      } finally {
        setIsLoadingSmartReplies(false);
      }
    };

    fetchReplies();
  }, [activeConv?.id, activeConv?.messages.length]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeConv.id, inputText);
    setInputText('');
  };

  const handleSendSmartReply = (replyText: string) => {
    sendMessage(activeConv.id, replyText, true);
    setSmartReplies([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[700px] h-[calc(100vh-140px)]">
        
        {/* Left Column: Conversations List (md:col-span-4) */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Messaging
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-semibold">
              Live Socket.IO
            </span>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConv?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-2 border-blue-600'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {conv.participantName}
                      </span>
                      <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.participantHeadline}
                    </p>

                    <p className="text-xs text-slate-700 dark:text-slate-300 truncate mt-1">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation (md:col-span-8) */}
        {activeConv ? (
          <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900">
            
            {/* Conversation Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeConv.participantAvatar}
                    alt={activeConv.participantName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  {activeConv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeConv.participantName}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block line-clamp-1">
                    {activeConv.participantHeadline}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 relative">
                {/* Read Receipts Settings Toggle Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeConv.readReceiptsEnabled !== false
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                  title="Configure chat privacy and read receipts"
                >
                  {activeConv.readReceiptsEnabled !== false ? (
                    <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="hidden sm:inline">
                    {activeConv.readReceiptsEnabled !== false ? 'Receipts: ON' : 'Receipts: OFF'}
                  </span>
                  <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {/* Call Buttons */}
                <button
                  onClick={() => setIsVideoCallActive(true)}
                  className="p-2 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Start Netwalk Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsVideoCallActive(true)}
                  className="p-2 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4" />
                </button>

                {/* Conversation Settings Popover */}
                {isSettingsOpen && (
                  <div className="absolute right-0 top-11 w-84 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Chat Settings & Privacy
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          Channel: {activeConv.participantName}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="py-3 space-y-3.5">
                      {/* Read Receipts Setting Switch */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <label
                            htmlFor="read-receipts-toggle"
                            className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                            <span>Read Receipts</span>
                          </label>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                            Allow {activeConv.participantName} to see when you have read incoming messages. When disabled, your status remains "Sent" without read timestamps.
                          </p>
                        </div>

                        {/* Interactive toggle switch */}
                        <button
                          id="read-receipts-toggle"
                          type="button"
                          role="switch"
                          aria-checked={activeConv.readReceiptsEnabled !== false}
                          onClick={() => {
                            toggleConversationReadReceipts(
                              activeConv.id,
                              !(activeConv.readReceiptsEnabled !== false)
                            );
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            activeConv.readReceiptsEnabled !== false
                              ? 'bg-blue-600'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              activeConv.readReceiptsEnabled !== false
                                ? 'translate-x-5'
                                : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Database Message Metadata Box */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-[11px] space-y-1.5 font-sans">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                          <span>Database Store:</span>
                          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            Synced to Database
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                          <span>Metadata Policy:</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                            {activeConv.readReceiptsEnabled !== false
                              ? 'broadcast_seen_event'
                              : 'suppressed_private'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px]">
                          <span>Active Channel ID:</span>
                          <span className="font-mono text-slate-400">{activeConv.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Updates sync immediately</span>
                      <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Read Receipts Disabled Advisory Banner */}
            {activeConv.readReceiptsEnabled === false && (
              <div className="px-6 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Read receipts are disabled for this chat. Your read timestamps and seen status are hidden.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleConversationReadReceipts(activeConv.id, true)}
                  className="font-semibold underline text-[11px] hover:text-amber-950 dark:hover:text-amber-100"
                >
                  Turn On
                </button>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeConv.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isReceiptsActive = activeConv.readReceiptsEnabled !== false;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 tabular-nums">
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        isReceiptsActive ? (
                          <span
                            className="flex items-center gap-0.5 text-blue-500 font-medium"
                            title="Read receipt active: Message seen by participant"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-mono">Read</span>
                          </span>
                        ) : (
                          <span
                            className="flex items-center gap-0.5 text-slate-400 font-medium"
                            title="Read receipts disabled for this conversation"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-mono">Sent</span>
                          </span>
                        )
                      )}
                      {msg.metadata && (
                        <button
                          type="button"
                          onClick={() =>
                            setInspectingMessageId(
                              inspectingMessageId === msg.id ? null : msg.id
                            )
                          }
                          className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors ml-0.5 p-0.5 rounded"
                          title="Inspect message metadata record"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Metadata Card Drawer */}
                    {inspectingMessageId === msg.id && msg.metadata && (
                      <div className="mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs max-w-xs space-y-0.5">
                        <div className="font-bold text-slate-800 dark:text-slate-100 pb-0.5 border-b border-slate-200 dark:border-slate-700">
                          Database Message Metadata
                        </div>
                        <div className="flex justify-between">
                          <span>Receipts Policy:</span>
                          <span className="font-semibold">{msg.metadata.readReceiptsEnabled ? 'enabled' : 'disabled'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivered At:</span>
                          <span>{msg.metadata.deliveredAt || msg.timestamp}</span>
                        </div>
                        {msg.metadata.readAt && (
                          <div className="flex justify-between">
                            <span>Read At:</span>
                            <span>{msg.metadata.readAt}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span>Database Store:</span>
                          <span>synced_to_database</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Smart AI Suggestions Bar */}
            {smartReplies.length > 0 && (
              <div className="px-6 py-2 bg-blue-50/50 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-900/30 flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  AI Smart Replies:
                </span>
                {smartReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendSmartReply(reply.text)}
                    className="px-3 py-1 rounded-full text-xs bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/80 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => addToast('Attachment selector opened', 'info')}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => addToast('Voice message recording simulated', 'info')}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConv.participantName}...`}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        ) : (
          <div className="md:col-span-8 flex items-center justify-center p-8 text-xs text-slate-400">
            Select a conversation to begin messaging
          </div>
        )}

      </div>

      {/* Video Call Modal Simulator */}
      {isVideoCallActive && activeConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <span className="text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ConnectNetwalk WebRTC Video Bridge
              </span>
              <button
                onClick={() => setIsVideoCallActive(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-80 bg-slate-950 flex items-center justify-center">
              <img
                src={activeConv.participantAvatar}
                alt={activeConv.participantName}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500 shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold">
                {activeConv.participantName} (Speaking)
              </div>
            </div>

            <div className="p-6 bg-slate-900 flex items-center justify-center gap-4">
              <button
                onClick={() => setIsVideoCallActive(false)}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-lg transition-colors"
              >
                End Meeting
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
