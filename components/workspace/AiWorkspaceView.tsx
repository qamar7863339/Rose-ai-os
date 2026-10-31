'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  Send,
  Paperclip,
  ChevronDown,
  FileText,
  Trash2,
  Pin,
  Copy,
  Check,
  RotateCcw,
  FolderOpen,
  X,
  Code2,
  Compass,
  Sparkles,
  Lightbulb,
  MessageSquare,
  Sliders,
  ArrowUp,
} from 'lucide-react';
import {
  WorkspaceConversation,
  ChatAttachment,
  ChatMessage,
  ClientRecord,
} from '@/lib/rose-data';

interface AiWorkspaceViewProps {
  conversations: WorkspaceConversation[];
  setConversations: React.Dispatch<React.SetStateAction<WorkspaceConversation[]>>;
  clients: ClientRecord[];
  activeConvId: string | null;
  setActiveConvId: (id: string | null) => void;
  onNavigateToSection: (section: 'clients' | 'agents' | 'automations') => void;
}

const AVAILABLE_MODELS = [
  {
    id: 'ROSE-4 Omni',
    label: 'ROSE-4 Omni',
    badge: '4.0e',
    subtitle: 'Executive agency reasoning & multi-client synthesis',
    latency: '420ms',
  },
  {
    id: 'Gemini 3.8 Flash',
    label: 'Gemini 3.8 Flash',
    badge: '3.8f',
    subtitle: 'High-speed prompt engineering & workflow generation',
    latency: '280ms',
  },
  {
    id: 'ROSE Reasoning Pro',
    label: 'ROSE Reasoning Pro',
    badge: 'Pro',
    subtitle: 'Deep margin economics, architecture & audit analysis',
    latency: '690ms',
  },
  {
    id: 'ROSE Voice & Script Synth',
    label: 'ROSE Voice & Script Synth',
    badge: 'Voice',
    subtitle: 'Conversational telephony scripts & objection battlecards',
    latency: '350ms',
  },
];

const HERO_PROMPT_CARDS = [
  {
    icon: Code2,
    title: 'Engineer Agent Prompt',
    quote: '"Write a low-latency voice script for Vanguard Luxury Realty to qualify $5M+ buyers..."',
    prompt:
      'Write a natural, low-latency inbound voice script for Vanguard Luxury Realty to qualify $5M+ cash buyers and book private penthouse viewings.',
    context: 'Vanguard Luxury Realty',
  },
  {
    icon: Compass,
    title: 'Architect Client Workflow',
    quote: '"Create a 4-step WhatsApp + HubSpot speed-to-lead automation under 15 seconds..."',
    prompt:
      'Architect a 4-step WhatsApp + HubSpot CRM automation that responds to Meta Lead Ads within 15 seconds and scores BANT criteria.',
    context: 'NovaScale Cloud Systems',
  },
  {
    icon: Sparkles,
    title: 'Audit Retainer Margins',
    quote: '"Analyze agency compute spend vs monthly retainers across all 6 active clients..."',
    prompt:
      'Analyze our agency compute spend vs monthly retainers across all 6 clients and identify where caching or Gemini 3.8 Flash routing can reduce cost by 20%.',
    context: 'ROSE AI Agency Internal',
  },
];

const QUICK_CAPABILITY_CHIPS = [
  {
    label: 'Generate Voice Battlecard',
    prompt:
      'Create an enterprise pricing objection battlecard for NovaScale Cloud Systems AI Sales Agent.',
    context: 'NovaScale Cloud Systems',
  },
  {
    label: 'Analyze Client ROI',
    prompt:
      'Summarize 30-day qualified leads, hours saved, and resolution rates for Vanguard Luxury Realty.',
    context: 'Vanguard Luxury Realty',
  },
  {
    label: 'HIPAA Triage Rules',
    prompt:
      'Draft clinical red-flag escalation rules for Aether Medical Group so acute callers transfer to an RN immediately.',
    context: 'Aether Medical Group',
  },
];

const SAMPLE_WORKSPACE_FILES: ChatAttachment[] = [
  {
    id: 'sample-1',
    name: 'Vanguard_Q4_Penthouse_Leads.csv',
    type: 'CSV',
    size: '1.8 MB',
  },
  {
    id: 'sample-2',
    name: 'Aether_Clinical_Voice_SOP_v3.pdf',
    type: 'PDF',
    size: '4.2 MB',
  },
  {
    id: 'sample-3',
    name: 'NovaScale_Enterprise_Battlecard.md',
    type: 'Markdown',
    size: '340 KB',
  },
  {
    id: 'sample-4',
    name: 'Agency_Compute_Telemetry_Oct2026.csv',
    type: 'CSV',
    size: '920 KB',
  },
];

export default function AiWorkspaceView({
  conversations,
  setConversations,
  clients,
  activeConvId,
  setActiveConvId,
}: AiWorkspaceViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('ROSE-4 Omni');
  const [selectedClientContext, setSelectedClientContext] = useState<string>(
    'All Agency Clients'
  );
  const [deepReasoning, setDeepReasoning] = useState(true);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [attachmentDrawerOpen, setAttachmentDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [composerText, setComposerText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef<number>(2000);

  const nextId = (prefix: string) => {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  };

  const activeConversation = useMemo(
    () =>
      activeConvId
        ? conversations.find((c) => c.id === activeConvId) || null
        : null,
    [conversations, activeConvId]
  );

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.clientContext && c.clientContext.toLowerCase().includes(q)) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  useEffect(() => {
    if (activeConversation && activeConversation.messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation, activeConversation?.messages.length, isGenerating]);

  const handleStartNewCoPilotSession = () => {
    setActiveConvId(null);
    setComposerText('');
    setPendingAttachments([]);
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId(null);
    }
  };

  const handleAttachSample = (file: ChatAttachment) => {
    if (!pendingAttachments.some((a) => a.name === file.name)) {
      setPendingAttachments((prev) => [
        ...prev,
        { ...file, id: nextId('att') },
      ]);
    }
    setAttachmentDrawerOpen(false);
  };

  const handleBrowserFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploaded: ChatAttachment[] = Array.from(files).map((f, idx) => ({
      id: `${nextId('upload')}-${idx}`,
      name: f.name,
      type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
      size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
    }));
    setPendingAttachments((prev) => [...prev, ...uploaded]);
    setAttachmentDrawerOpen(false);
    e.target.value = '';
  };

  const sendMessage = async (textOverride?: string, contextOverride?: string) => {
    const rawText = (textOverride ?? composerText).trim();
    if (!rawText || isGenerating) return;

    const targetContext =
      contextOverride ||
      activeConversation?.clientContext ||
      selectedClientContext;

    const userMsg: ChatMessage = {
      id: nextId('msg'),
      role: 'user',
      content: rawText,
      timestamp: 'Just now',
      attachments:
        pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
    };

    let targetConvId = activeConvId;

    if (!activeConversation) {
      const newId = nextId('chat');
      const created: WorkspaceConversation = {
        id: newId,
        title: rawText.slice(0, 56),
        updatedAt: 'Just now',
        pinned: false,
        model: selectedModel,
        clientContext: targetContext,
        messages: [userMsg],
      };
      setConversations((prev) => [created, ...prev]);
      targetConvId = newId;
      setActiveConvId(newId);
    } else {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== targetConvId) return c;
          const updatedTitle =
            c.messages.length === 0 ? rawText.slice(0, 56) : c.title;
          return {
            ...c,
            title: updatedTitle,
            updatedAt: 'Just now',
            model: selectedModel,
            clientContext: targetContext,
            messages: [...c.messages, userMsg],
          };
        })
      );
    }

    setComposerText('');
    setPendingAttachments([]);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/workspace/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: rawText,
          model: deepReasoning ? `${selectedModel} (Deep Reasoning)` : selectedModel,
          clientContext: targetContext,
        }),
      });
      const data = await res.json();
      const replyContent =
        data.text ||
        'Execution synthesized. Ready to deploy configuration across client workspace.';

      const assistantMsg: ChatMessage = {
        id: nextId('msg'),
        role: 'assistant',
        content: replyContent,
        model: selectedModel,
        timestamp: 'Just now',
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? {
                ...c,
                updatedAt: 'Just now',
                messages: [...c.messages, assistantMsg],
              }
            : c
        )
      );
    } catch {
      const fallbackMsg: ChatMessage = {
        id: nextId('msg'),
        role: 'assistant',
        content:
          '### ROSE AI OS Executive Response\n\nConfiguration validated for **' +
          targetContext +
          '**. You can now assign this prompt directly to an active agent in the **AI Agents** library.',
        model: selectedModel,
        timestamp: 'Just now',
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? { ...c, messages: [...c.messages, fallbackMsg] }
            : c
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMessage = (msg: ChatMessage) => {
    navigator.clipboard?.writeText(msg.content);
    setCopiedMessageId(msg.id);
    setTimeout(() => setCopiedMessageId(null), 1800);
  };

  const isCoPilotHome =
    !activeConversation || activeConversation.messages.length === 0;

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-8rem)] justify-between">
      {/* Ambient Cosmic Purple & Subtle Neon-Lime Backlight inside Workspace */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
      >
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[540px] h-[300px] rounded-full bg-gradient-to-b from-purple-600/20 via-fuchsia-600/10 to-transparent blur-[110px]" />
        <div className="absolute bottom-20 left-1/3 w-[380px] h-[220px] rounded-full bg-[#CCF655]/[0.04] blur-[100px]" />
      </div>

      {/* Top Floating Workspace Controls (Inspired by Image 1 & Image 2) */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          {/* Pill Model Selector Dropdown (Image 2 style) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setModelDropdownOpen((o) => !o)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] text-xs font-semibold text-white shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all whitespace-nowrap shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-[#CCF655]" />
              <span>{selectedModel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {modelDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#140D26]/95 backdrop-blur-2xl border border-purple-300/20 shadow-2xl p-2 z-40">
                <div className="px-3 py-1.5 text-[11px] text-slate-400 border-b border-white/[0.07] mb-1">
                  ROSE AI OS Cognitive Engines
                </div>
                {AVAILABLE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(m.id);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-start justify-between gap-2 ${
                      selectedModel === m.id
                        ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 border border-purple-400/30 text-white'
                        : 'hover:bg-white/[0.05] text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <span>{m.label}</span>
                        {selectedModel === m.id && (
                          <span className="text-[10px] font-mono text-[#CCF655]">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {m.subtitle}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400 shrink-0">
                      {m.latency}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Client Context Selector */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="text-slate-400 hidden sm:inline">Workspace:</span>
            <select
              value={selectedClientContext}
              onChange={(e) => setSelectedClientContext(e.target.value)}
              className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer"
            >
              <option value="All Agency Clients" className="bg-[#120C22]">
                All Agency Clients
              </option>
              <option value="ROSE AI Agency Internal" className="bg-[#120C22]">
                ROSE AI Agency Internal
              </option>
              {clients.map((cl) => (
                <option key={cl.id} value={cl.businessName} className="bg-[#120C22]">
                  {cl.businessName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions: Search Threads Drawer & New Co-Pilot Session */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setHistoryDrawerOpen((o) => !o)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            <Search className="w-3.5 h-3.5 text-purple-300" />
            <span>Threads ({conversations.length})</span>
          </button>

          {!isCoPilotHome && (
            <button
              type="button"
              onClick={handleStartNewCoPilotSession}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#4C1D95] hover:from-[#7C3AED] hover:to-[#5B21B6] border border-purple-400/35 text-xs font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#CCF655]" />
              <span>New Co-Pilot Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Slide-Over Thread Search & History Drawer */}
      {historyDrawerOpen && (
        <div className="relative z-30 mb-6 rounded-2xl bg-[#130C24]/95 backdrop-blur-2xl border border-purple-400/25 p-5 shadow-2xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Conversation Archive & Search
              </h3>
              <p className="text-xs text-slate-400">
                Search across all agency prompts, client audits, and transcripts
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHistoryDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter conversations by title, client, or keyword..."
              className="w-full bg-[#090612] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#CCF655]/60"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setHistoryDrawerOpen(false);
                }}
                className={`group p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  conv.id === activeConvId
                    ? 'bg-purple-900/30 border-[#CCF655]/50 text-white'
                    : 'bg-[#0B0716]/90 border-white/[0.08] hover:border-purple-400/40 text-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium line-clamp-2 leading-snug">
                    {conv.title}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleTogglePin(conv.id, e)}
                      className={`p-1 rounded hover:bg-white/10 ${
                        conv.pinned ? 'text-[#CCF655]' : 'text-slate-500'
                      }`}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[140px]">
                    {conv.clientContext || 'Agency OS'}
                  </span>
                  <span className="font-mono tabular-nums">{conv.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          CENTER STAGE: CO-PILOT HERO (Image 1 + Image 2 Fusion) OR ACTIVE THREAD
         ===================================================================== */}
      {isCoPilotHome ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto py-4">
          {/* Glowing Cosmic ROSE AI Orb (Inspired by Image 2) */}
          <div className="relative mb-6 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4C1D95] via-[#9333EA] to-[#CCF655] p-[2px] shadow-[0_0_55px_rgba(147,51,234,0.55)]">
              <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,#F0ABFC_0%,#9333EA_38%,#3B0764_78%,#090514_100%)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_75%,rgba(204,246,85,0.35),transparent_55%)]" />
                <div className="w-10 h-10 rounded-full border border-white/25 backdrop-blur-xs flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#CCF655]" />
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Status Kicker (Inspired by Image 1) */}
          <div className="mb-3 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300">
            ROSE AI Agency Operating System ·{' '}
            <span className="text-[#CCF655] font-medium">6 Client Fleets Online</span>
          </div>

          {/* Main Greeting & Subtitle (Combining Image 1 & Image 2) */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight text-center text-balance">
            Welcome to your cognitive agency co-pilot
          </h1>
          <p className="text-sm text-slate-400 mt-2.5 text-center max-w-xl">
            I am ROSE AI OS. Ask me to engineer voice agents, audit client conversion
            funnels, design multi-step automations, or analyze live portfolio ROI.
          </p>

          {/* 3 Frosted-Glass Prompt Cards (Inspired by Image 2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
            {HERO_PROMPT_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(card.prompt, card.context)}
                  className="group text-left rounded-2xl p-5 bg-gradient-to-b from-purple-500/[0.12] via-[#17102B]/85 to-[#100B1E]/90 backdrop-blur-xl border border-purple-300/[0.16] hover:border-[#CCF655]/50 shadow-[0_12px_35px_rgba(12,6,28,0.65)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="p-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-purple-200 group-hover:text-[#CCF655] transition-colors">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-semibold text-white group-hover:text-[#CCF655] transition-colors">
                        {card.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300/90 leading-relaxed">
                      {card.quote}
                    </p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                    <span>{card.context}</span>
                    <span className="text-[#CCF655] opacity-0 group-hover:opacity-100 transition-opacity">
                      Run →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Spacious Central Glassmorphic Composer Box (Inspired by Image 1 & Image 2) */}
          <div className="w-full mt-7">
            {/* Attachment Drawer if open */}
            {attachmentDrawerOpen && (
              <div className="mb-3 p-4 rounded-2xl bg-[#160F29]/95 backdrop-blur-xl border border-purple-400/25">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-white">
                    Attach Client Dataset, Brief, or Local File
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachmentDrawerOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {SAMPLE_WORKSPACE_FILES.map((file) => (
                    <button
                      key={file.id}
                      type="button"
                      onClick={() => handleAttachSample(file)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0B0714] border border-white/[0.08] hover:border-[#CCF655]/50 text-xs text-slate-200 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#CCF655]" />
                      <span>{file.name}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {file.size}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/25 border border-purple-400/35 text-xs font-medium text-white hover:bg-purple-600/35 transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#CCF655]" />
                    <span>Upload Local File...</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleBrowserFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="rounded-3xl bg-gradient-to-b from-[#1A1330]/90 to-[#110C20]/95 backdrop-blur-2xl border border-white/[0.12] focus-within:border-purple-400/50 shadow-[0_16px_50px_rgba(5,3,12,0.85)] p-4 transition-all"
            >
              {/* Pending Attachments */}
              {pendingAttachments.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-3 pb-2.5 border-b border-white/[0.08]">
                  {pendingAttachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D0918] border border-[#CCF655]/40 text-xs text-white"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#CCF655]" />
                      <span>{att.name}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {att.size}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingAttachments((prev) =>
                            prev.filter((item) => item.id !== att.id)
                          )
                        }
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                rows={3}
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="How can ROSE AI OS help orchestrate your agency today? Send a message or attach a client brief..."
                className="w-full bg-transparent px-2 py-1 text-sm text-white placeholder:text-slate-400/80 focus:outline-none resize-none"
              />

              {/* Composer Bottom Control Bar (Fusing Image 1 & Image 2) */}
              <div className="mt-3 pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAttachmentDrawerOpen((o) => !o)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      attachmentDrawerOpen || pendingAttachments.length > 0
                        ? 'bg-purple-600/30 border-[#CCF655]/50 text-[#CCF655]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.1] text-slate-300'
                    }`}
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Files</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeepReasoning((r) => !r)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      deepReasoning
                        ? 'bg-purple-600/30 border-purple-400/45 text-white'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.1] text-slate-400'
                    }`}
                  >
                    <Lightbulb
                      className={`w-3.5 h-3.5 ${
                        deepReasoning ? 'text-[#CCF655]' : 'text-slate-400'
                      }`}
                    />
                    <span>Reasoning</span>
                  </button>

                  {/* Quick capability chips from Image 1 */}
                  {QUICK_CAPABILITY_CHIPS.map((chip, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => sendMessage(chip.prompt, chip.context)}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2.5 ml-auto">
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                    {selectedModel}
                  </span>
                  <button
                    type="submit"
                    disabled={!composerText.trim() || isGenerating}
                    title="Send message"
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6D28D9] via-[#7C3AED] to-[#CCF655] p-[1px] disabled:opacity-40 disabled:pointer-events-none shadow-[0_0_24px_rgba(139,92,246,0.45)] transition-transform active:scale-95"
                  >
                    <span className="w-full h-full rounded-full bg-[#5B21B6] hover:bg-[#6D28D9] flex items-center justify-center text-white transition-colors">
                      <ArrowUp className="w-4 h-4 text-[#CCF655]" />
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Image 1's "Your Recent Chats" 3-Column Card Grid at the bottom */}
          <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <MessageSquare className="w-3.5 h-3.5 text-[#CCF655]" />
                <span>Your Recent Workspace Threads</span>
              </div>
              <button
                type="button"
                onClick={() => setHistoryDrawerOpen(true)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                View all ({conversations.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {conversations.slice(0, 3).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className="group cursor-pointer rounded-2xl p-4 bg-[#120D20]/85 hover:bg-[#19122C] border border-white/[0.07] hover:border-purple-400/35 transition-all flex flex-col justify-between"
                >
                  <div>
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#CCF655] mb-2 transition-colors" />
                    <h3 className="text-xs font-medium text-slate-100 group-hover:text-white line-clamp-2 leading-relaxed">
                      {conv.title}
                    </h3>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[140px]">
                      {conv.clientContext || 'ROSE Agency'}
                    </span>
                    <span className="font-mono tabular-nums">{conv.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ===================================================================
           ACTIVE CONVERSATION THREAD VIEW
           =================================================================== */
        <div className="relative z-10 flex-1 flex flex-col justify-between max-w-4xl w-full mx-auto">
          {/* Active Thread Header Banner */}
          <div className="mb-4 px-5 py-3.5 rounded-2xl bg-[#150E26]/90 backdrop-blur-xl border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white">
                {activeConversation.title}
              </h2>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Context: {activeConversation.clientContext || 'All Clients'}</span>
                <span>·</span>
                <span className="text-[#CCF655] font-mono">
                  {activeConversation.model}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleStartNewCoPilotSession}
              className="text-xs text-slate-300 hover:text-[#CCF655] transition-colors"
            >
              ← Back to Co-Pilot Home
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 py-2 max-h-[520px]">
            {activeConversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">
                    {msg.role === 'user'
                      ? 'Agency Operator'
                      : msg.model || activeConversation.model}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-3xl rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#5B21B6]/90 to-[#3B0764]/90 border border-purple-300/30 text-white shadow-[0_8px_28px_rgba(91,33,182,0.3)]'
                      : 'bg-[#150F26]/95 backdrop-blur-xl border border-white/[0.09] text-slate-100 shadow-xl'
                  }`}
                >
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-white/[0.12]">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-white/[0.12] text-xs text-slate-100"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#CCF655]" />
                          <span>{att.name}</span>
                          <span className="text-slate-300 font-mono tabular-nums">
                            ({att.size})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="whitespace-pre-line space-y-2">{msg.content}</div>

                  {msg.role === 'assistant' && (
                    <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg)}
                          className="flex items-center gap-1.5 hover:text-white transition-colors"
                        >
                          {copiedMessageId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#CCF655]" />
                              <span className="text-[#CCF655]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy response</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            sendMessage(
                              'Expand the previous recommendation with concrete KPI benchmarks and step-by-step rollout tasks.'
                            )
                          }
                          className="flex items-center gap-1.5 hover:text-white transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Expand with KPIs</span>
                        </button>
                      </div>
                      <span className="font-mono text-[11px] text-[#CCF655]">
                        Grounded in Client KB
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-3 text-xs text-slate-200 bg-[#17102A] border border-purple-400/30 rounded-2xl px-4 py-3 w-fit">
                <span className="font-mono text-[#CCF655]">[{selectedModel}]</span>
                <span>Synthesizing executive response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Composer for Active Conversation */}
          <div className="mt-4 pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="rounded-3xl bg-[#161029]/95 backdrop-blur-2xl border border-white/[0.12] focus-within:border-purple-400/50 p-3.5 shadow-2xl"
            >
              <div className="flex items-end gap-3">
                <button
                  type="button"
                  onClick={() => setAttachmentDrawerOpen((o) => !o)}
                  className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 hover:text-white transition-colors shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <textarea
                  rows={2}
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Send a follow-up message or drop a file..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none resize-none py-1"
                />

                <button
                  type="submit"
                  disabled={!composerText.trim() || isGenerating}
                  className="w-10 h-10 rounded-full bg-[#6D28D9] hover:bg-[#7C3AED] border border-purple-300/40 flex items-center justify-center text-white disabled:opacity-40 shrink-0 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                >
                  <Send className="w-4 h-4 text-[#CCF655]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
