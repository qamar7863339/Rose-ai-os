'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  LayoutDashboard,
  Users,
  Bot,
  Workflow,
  Plug,
  BarChart3,
  FolderKanban,
  Settings,
  Plus,
  ExternalLink,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  NavSection,
  INITIAL_CLIENTS,
  INITIAL_AGENT_TEMPLATES,
  INITIAL_AUTOMATIONS,
  INITIAL_INTEGRATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_PROJECTS,
  INITIAL_SYSTEM_EVENTS,
  AgentTemplate,
} from '@/lib/rose-data';
import AiWorkspaceView from '@/components/workspace/AiWorkspaceView';
import DashboardView from '@/components/dashboard/DashboardView';
import ClientsView from '@/components/clients/ClientsView';
import AgentsView from '@/components/agents/AgentsView';
import AutomationsView from '@/components/automations/AutomationsView';
import IntegrationsView from '@/components/integrations/IntegrationsView';
import AnalyticsView from '@/components/analytics/AnalyticsView';
import ProjectsView from '@/components/projects/ProjectsView';
import SettingsView from '@/components/settings/SettingsView';
import ClientPortalView from '@/components/portal/ClientPortalView';

const SIDEBAR_ITEMS: {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'workspace', label: 'AI Workspace', icon: MessageSquare },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'agents', label: 'AI Agents', icon: Bot },
  { id: 'automations', label: 'Automations', icon: Workflow },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function RoseAiOsPage() {
  // Default to AI Workspace so the iconic Image 1 + Image 2 fusion greets the user immediately
  const [activeSection, setActiveSection] = useState<NavSection>('workspace');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isPortalMode, setIsPortalMode] = useState(false);

  // Shared Interactive State Across ROSE AI OS
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [agents, setAgents] = useState(INITIAL_AGENT_TEMPLATES);
  const [automations, setAutomations] = useState(INITIAL_AUTOMATIONS);
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [events] = useState(INITIAL_SYSTEM_EVENTS);

  // Deep-link states
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [portalClientId, setPortalClientId] = useState<string>(
    INITIAL_CLIENTS[0].id
  );
  const [activeConfigAgent, setActiveConfigAgent] =
    useState<AgentTemplate | null>(null);

  const handleNavigate = (section: NavSection) => {
    setActiveSection(section);
    if (section !== 'clients') {
      setSelectedClientId(null);
    }
  };

  const handleStartNewChatFromSidebar = () => {
    setActiveConvId(null);
    setActiveSection('workspace');
  };

  const handleOpenClientProfile = (clientId: string) => {
    setSelectedClientId(clientId);
    setActiveSection('clients');
  };

  const handleOpenAgentConfig = (agent: AgentTemplate) => {
    setActiveConfigAgent(agent);
    setActiveSection('agents');
  };

  const handleLaunchClientPortal = (clientId?: string) => {
    if (clientId) {
      setPortalClientId(clientId);
    }
    setIsPortalMode(true);
  };

  // Dedicated Client Portal Mode
  if (isPortalMode) {
    return (
      <ClientPortalView
        clients={clients}
        agents={agents}
        activeClientId={portalClientId}
        setActiveClientId={setPortalClientId}
        onExitPortal={() => setIsPortalMode(false)}
      />
    );
  }

  const currentSectionLabel =
    SIDEBAR_ITEMS.find((i) => i.id === activeSection)?.label || 'AI Workspace';

  return (
    <div className="min-h-screen bg-[#06040B] text-[#F4F2F8] flex p-2 sm:p-3 gap-2 sm:gap-3 relative overflow-hidden">
      {/* Deep Cosmic Purple & Subtle Neon-Lime Ambient Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div className="absolute -top-36 left-1/3 w-[680px] h-[440px] rounded-full bg-purple-800/20 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[520px] h-[360px] rounded-full bg-indigo-900/20 blur-[140px]" />
        <div className="absolute top-1/2 right-12 w-[360px] h-[280px] rounded-full bg-[#CCF655]/[0.035] blur-[130px]" />
      </div>

      {/* =====================================================================
          LEFT SIDEBAR (Fusing Image 1's Clean Hierarchy + Image 2's Purple Glow)
         ===================================================================== */}
      <aside
        className={`relative z-20 flex flex-col justify-between rounded-[26px] bg-[#0B0714]/90 backdrop-blur-2xl border border-white/[0.07] p-3.5 transition-all duration-200 shrink-0 ${
          sidebarCollapsed ? 'w-[78px]' : 'w-[264px]'
        }`}
      >
        {/* Top Section: Brand Emblem + Glowing "+ New Chat" Button + Navigation */}
        <div className="space-y-4 overflow-y-auto pr-0.5">
          {/* Brand Header (Image 2 faceted purple-lime emblem + Image 1 search icon) */}
          <div className="flex items-center justify-between px-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleNavigate('workspace')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B21B6] via-[#9333EA] to-[#CCF655] p-[1.5px] shadow-[0_0_24px_rgba(147,51,234,0.45)] shrink-0">
                <div className="w-full h-full rounded-[10px] bg-[#0D0818] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#CCF655]" />
                </div>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="text-sm font-bold tracking-tight text-white">
                    ROSE AI OS
                  </div>
                  <div className="text-[10px] font-mono text-purple-300/80">
                    Agency Operating System
                  </div>
                </div>
              )}
            </button>

            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => handleNavigate('workspace')}
                title="Search Workspace"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Prominent Glowing Purple "+ New Chat" Button (From Image 1 & Image 2) */}
          <button
            type="button"
            onClick={handleStartNewChatFromSidebar}
            title="Start New AI Workspace Chat"
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4C1D95]/90 via-[#5B21B6]/85 to-[#3B0764]/90 hover:from-[#5B21B6] hover:to-[#4C1D95] border border-purple-400/30 text-xs font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.28)] transition-all whitespace-nowrap shrink-0 ${
              sidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Plus className="w-4 h-4 text-[#CCF655]" />
              {!sidebarCollapsed && <span>New Chat</span>}
            </span>
            {!sidebarCollapsed && (
              <span className="text-[10px] font-mono text-purple-200/70">
                ⌥N
              </span>
            )}
          </button>

          {/* 9 Core OS Navigation Modules */}
          <div>
            {!sidebarCollapsed && (
              <div className="px-2.5 mb-1.5 text-[11px] font-medium text-slate-500">
                Operating System
              </div>
            )}
            <nav className="space-y-0.5">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2.2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 py-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500/25 to-white/[0.03] border border-purple-400/30 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#CCF655]' : 'text-slate-400'
                        }`}
                      />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </span>
                    {!sidebarCollapsed && isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CCF655]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Image 2's Vertical-Line Indented "Recent" Threads List */}
          {!sidebarCollapsed && (
            <div className="pt-2">
              <div className="px-2.5 mb-2 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>Recent Threads</span>
                <span className="font-mono text-[10px] text-slate-500">
                  {conversations.length}
                </span>
              </div>
              <div className="ml-3 pl-3 border-l border-white/[0.1] space-y-1.5">
                {conversations.slice(0, 4).map((conv) => {
                  const isThreadSelected =
                    activeSection === 'workspace' && activeConvId === conv.id;
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => {
                        setActiveConvId(conv.id);
                        setActiveSection('workspace');
                      }}
                      className={`w-full text-left text-xs py-1 px-2 rounded-lg transition-colors truncate block ${
                        isThreadSelected
                          ? 'text-[#CCF655] font-medium bg-white/[0.04]'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {conv.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Frosted Glass Client Portal Card + User Footer (From Image 1 & 2) */}
        <div className="pt-3 space-y-3 border-t border-white/[0.07]">
          {!sidebarCollapsed ? (
            <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#1A1130]/90 to-[#100A1E]/95 border border-purple-400/20 shadow-lg">
              <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                <span>Client Portal Mode</span>
                <span className="text-[10px] font-mono text-[#CCF655]">
                  Isolated
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Preview the simplified white-label portal scoped to each client’s
                own business data.
              </p>
              <button
                type="button"
                onClick={() => handleLaunchClientPortal()}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#4C1D95] hover:from-[#6D28D9] hover:to-[#5B21B6] border border-purple-300/30 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all"
              >
                <span>Switch to Client Portal</span>
                <ExternalLink className="w-3 h-3 text-[#CCF655]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleLaunchClientPortal()}
              title="Switch to Client Portal"
              className="w-full p-2.5 rounded-xl bg-[#1A1130] border border-purple-400/25 text-[#CCF655] flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {/* Operator Profile + Collapse Button (Image 2 bottom row) */}
          <div className="flex items-center justify-between gap-2 px-1 pt-1">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-[#CCF655] p-[1px] shrink-0">
                  <div className="w-full h-full rounded-full bg-[#120C22] flex items-center justify-center text-xs font-bold text-white">
                    QM
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    ROSE Agency Lead
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    ops@rose-ai.agency
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] flex items-center justify-center text-slate-300 hover:text-white transition-colors mx-auto sm:mx-0 shrink-0"
            >
              {sidebarCollapsed ? (
                <ChevronsRight className="w-4 h-4 text-[#CCF655]" />
              ) : (
                <ChevronsLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          RECESSED GLASSMORPHIC MAIN STAGE (Inspired by Image 2's Framed Canvas)
         ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 rounded-[28px] bg-gradient-to-b from-[#130C24]/90 via-[#0C0818]/95 to-[#090612]/98 border border-white/[0.08] shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Strict 3-Zone Top Bar Contract */}
        <header className="h-15 flex items-center justify-between gap-8 px-6 lg:px-8 border-b border-white/[0.07] bg-[#0D091A]/75 backdrop-blur-xl">
          {/* Zone 1: Single text element wordmark / breadcrumb */}
          <div className="text-sm font-semibold tracking-tight text-white whitespace-nowrap shrink-0">
            ROSE AI OS · {currentSectionLabel}
          </div>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <button
              type="button"
              onClick={() => handleNavigate('workspace')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'workspace' ? 'text-[#CCF655] font-semibold' : ''
              }`}
            >
              AI Workspace
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('dashboard')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'dashboard' ? 'text-[#CCF655] font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('clients')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'clients' ? 'text-[#CCF655] font-semibold' : ''
              }`}
            >
              Clients ({clients.length})
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('agents')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'agents' ? 'text-[#CCF655] font-semibold' : ''
              }`}
            >
              AI Agents ({agents.length})
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => handleLaunchClientPortal()}
              className="px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-[#CCF655] hover:text-[#08060D] border border-white/[0.12] text-xs font-semibold text-white transition-all whitespace-nowrap shrink-0"
            >
              Client Portal
            </button>
          </div>
        </header>

        {/* Main Scrollable Viewport Container */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection + (selectedClientId || '')}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeSection === 'workspace' && (
                <AiWorkspaceView
                  conversations={conversations}
                  setConversations={setConversations}
                  clients={clients}
                  activeConvId={activeConvId}
                  setActiveConvId={setActiveConvId}
                  onNavigateToSection={(sec) => handleNavigate(sec)}
                />
              )}

              {activeSection === 'dashboard' && (
                <DashboardView
                  clients={clients}
                  agents={agents}
                  automations={automations}
                  events={events}
                  onNavigate={handleNavigate}
                  onSelectClient={handleOpenClientProfile}
                  onConfigureAgent={handleOpenAgentConfig}
                />
              )}

              {activeSection === 'clients' && (
                <ClientsView
                  clients={clients}
                  setClients={setClients}
                  agents={agents}
                  setAgents={setAgents}
                  integrations={integrations}
                  selectedClientId={selectedClientId}
                  setSelectedClientId={setSelectedClientId}
                  onConfigureAgent={handleOpenAgentConfig}
                  onOpenClientPortal={handleLaunchClientPortal}
                />
              )}

              {activeSection === 'agents' && (
                <AgentsView
                  agents={agents}
                  setAgents={setAgents}
                  clients={clients}
                  setClients={setClients}
                  activeConfigAgent={activeConfigAgent}
                  setActiveConfigAgent={setActiveConfigAgent}
                />
              )}

              {activeSection === 'automations' && (
                <AutomationsView
                  automations={automations}
                  setAutomations={setAutomations}
                  clients={clients}
                  agents={agents}
                />
              )}

              {activeSection === 'integrations' && (
                <IntegrationsView
                  integrations={integrations}
                  setIntegrations={setIntegrations}
                />
              )}

              {activeSection === 'analytics' && (
                <AnalyticsView clients={clients} agents={agents} />
              )}

              {activeSection === 'projects' && (
                <ProjectsView
                  projects={projects}
                  setProjects={setProjects}
                  clients={clients}
                />
              )}

              {activeSection === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
