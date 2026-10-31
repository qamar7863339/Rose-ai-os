'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  Sliders,
  ExternalLink,
  FileText,
  MessageSquare,
  CheckCircle2,
  X,
  UserPlus,
  Upload,
} from 'lucide-react';
import {
  ClientRecord,
  AgentTemplate,
  IntegrationItem,
  KnowledgeDoc,
  ClientTeamMember,
} from '@/lib/rose-data';

interface ClientsViewProps {
  clients: ClientRecord[];
  setClients: React.Dispatch<React.SetStateAction<ClientRecord[]>>;
  agents: AgentTemplate[];
  setAgents: React.Dispatch<React.SetStateAction<AgentTemplate[]>>;
  integrations: IntegrationItem[];
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  onConfigureAgent: (agent: AgentTemplate) => void;
  onOpenClientPortal: (clientId: string) => void;
}

type ClientProfileTab =
  | 'Overview'
  | 'Agents'
  | 'Integrations'
  | 'Knowledge Base'
  | 'Conversations'
  | 'Analytics'
  | 'Team'
  | 'Billing';

const PROFILE_TABS: ClientProfileTab[] = [
  'Overview',
  'Agents',
  'Integrations',
  'Knowledge Base',
  'Conversations',
  'Analytics',
  'Team',
  'Billing',
];

export default function ClientsView({
  clients,
  setClients,
  agents,
  setAgents,
  integrations,
  selectedClientId,
  setSelectedClientId,
  onConfigureAgent,
  onOpenClientPortal,
}: ClientsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Onboarding' | 'Pilot'>('ALL');
  const [activeTab, setActiveTab] = useState<ClientProfileTab>('Overview');

  // Add Client Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newIndustry, setNewIndustry] = useState('Enterprise B2B');
  const [newWebsite, setNewWebsite] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('VP of Operations');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newRetainer, setNewRetainer] = useState('10000');
  const [newStatus, setNewStatus] = useState<'Active' | 'Onboarding' | 'Pilot'>('Onboarding');
  const [newSelectedAgents, setNewSelectedAgents] = useState<string[]>([
    'agent-receptionist',
    'agent-lead-qual',
  ]);
  const [formError, setFormError] = useState('');

  // Profile sub-modals
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<'PDF' | 'URL' | 'Markdown' | 'CSV'>('PDF');
  const [docSizeOrUrl, setDocSizeOrUrl] = useState('');

  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberAccess, setMemberAccess] = useState<'Admin' | 'Viewer' | 'Billing Only'>('Admin');

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || null,
    [clients, selectedClientId]
  );

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.businessName.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.contactEmail.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [clients, statusFilter, searchQuery]);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusinessName.trim() || !newContactName.trim() || !newContactEmail.trim()) {
      setFormError('Business name, primary contact name, and contact email are required.');
      return;
    }
    if (!newContactEmail.includes('@')) {
      setFormError('Please enter a valid business email address.');
      return;
    }

    const cleanWeb = newWebsite.trim()
      ? newWebsite.startsWith('http')
        ? newWebsite.trim()
        : `https://${newWebsite.trim()}`
      : `https://${newBusinessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.example.com`;

    const createdId = `client-${Date.now()}`;
    const retainerNum = Math.max(1000, Number(newRetainer) || 10000);

    const newClient: ClientRecord = {
      id: createdId,
      businessName: newBusinessName.trim(),
      industry: newIndustry.trim() || 'Enterprise Services',
      website: cleanWeb,
      contactName: newContactName.trim(),
      contactRole: newContactRole.trim() || 'Executive Sponsor',
      contactEmail: newContactEmail.trim(),
      contactPhone: newContactPhone.trim() || '+1 (800) 555-0199',
      status: newStatus,
      monthlyRetainer: retainerNum,
      aiSpendMonthly: 420,
      assignedAgentIds: newSelectedAgents,
      connectedIntegrationIds: ['int-google-cal', 'int-whatsapp'],
      tasksCompleted30d: 1240,
      successRate: 98.2,
      hoursSaved30d: 48,
      leadsGenerated30d: 34,
      overviewNotes: `Newly provisioned ROSE AI OS workspace for ${newBusinessName.trim()}. Initial agent fleet configured and synced.`,
      knowledgeBase: [
        {
          id: `kb-${Date.now()}`,
          title: `${newBusinessName.trim()} — Core Onboarding & Brand Playbook.pdf`,
          type: 'PDF',
          sizeOrUrl: '2.4 MB',
          updatedAt: 'Just now',
          status: 'Indexed',
          chunks: 84,
        },
      ],
      conversations: [],
      team: [
        {
          id: `tm-${Date.now()}`,
          name: newContactName.trim(),
          role: newContactRole.trim() || 'Executive Sponsor',
          email: newContactEmail.trim(),
          portalAccess: 'Admin',
          lastActive: 'Just invited',
        },
      ],
      invoices: [
        {
          id: `inv-${Date.now()}`,
          invoiceNumber: `ROSE-2026-${Math.floor(1100 + Math.random() * 800)}`,
          period: 'November 2026',
          retainerAmount: retainerNum,
          aiUsageCost: 420,
          totalAmount: retainerNum + 420,
          status: 'Scheduled',
          issuedDate: 'Oct 30, 2026',
        },
      ],
    };

    setClients((prev) => [newClient, ...prev]);
    // Also update assignedClientIds on selected agents
    setAgents((prev) =>
      prev.map((ag) =>
        newSelectedAgents.includes(ag.id) && !ag.assignedClientIds.includes(createdId)
          ? { ...ag, assignedClientIds: [...ag.assignedClientIds, createdId] }
          : ag
      )
    );

    setIsAddModalOpen(false);
    setNewBusinessName('');
    setNewWebsite('');
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setFormError('');
    setSelectedClientId(createdId);
    setActiveTab('Overview');
  };

  const handleToggleAgentForClient = (clientId: string, agentId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const exists = c.assignedAgentIds.includes(agentId);
        return {
          ...c,
          assignedAgentIds: exists
            ? c.assignedAgentIds.filter((id) => id !== agentId)
            : [...c.assignedAgentIds, agentId],
        };
      })
    );
    setAgents((prev) =>
      prev.map((ag) => {
        if (ag.id !== agentId) return ag;
        const exists = ag.assignedClientIds.includes(clientId);
        return {
          ...ag,
          assignedClientIds: exists
            ? ag.assignedClientIds.filter((id) => id !== clientId)
            : [...ag.assignedClientIds, clientId],
        };
      })
    );
  };

  const handleToggleIntegrationForClient = (clientId: string, intId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const exists = c.connectedIntegrationIds.includes(intId);
        return {
          ...c,
          connectedIntegrationIds: exists
            ? c.connectedIntegrationIds.filter((id) => id !== intId)
            : [...c.connectedIntegrationIds, intId],
        };
      })
    );
  };

  const handleAddKnowledgeDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !docTitle.trim()) return;
    const newDoc: KnowledgeDoc = {
      id: `kb-${Date.now()}`,
      title: docTitle.trim(),
      type: docType,
      sizeOrUrl: docSizeOrUrl.trim() || (docType === 'URL' ? 'https://docs.example.com' : '1.6 MB'),
      updatedAt: 'Just now',
      status: 'Indexed',
      chunks: Math.floor(60 + Math.random() * 180),
    };
    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? { ...c, knowledgeBase: [newDoc, ...c.knowledgeBase] }
          : c
      )
    );
    setDocTitle('');
    setDocSizeOrUrl('');
    setIsAddDocOpen(false);
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !memberName.trim() || !memberEmail.trim()) return;
    const newMember: ClientTeamMember = {
      id: `tm-${Date.now()}`,
      name: memberName.trim(),
      role: memberRole.trim() || 'Operations Lead',
      email: memberEmail.trim(),
      portalAccess: memberAccess,
      lastActive: 'Invite sent',
    };
    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id ? { ...c, team: [...c.team, newMember] } : c
      )
    );
    setMemberName('');
    setMemberRole('');
    setMemberEmail('');
    setIsAddTeamOpen(false);
  };

  // ============================================================================
  // DETAILED CLIENT PROFILE VIEW
  // ============================================================================
  if (selectedClient) {
    const clientAgents = agents.filter((a) =>
      selectedClient.assignedAgentIds.includes(a.id)
    );
    const activeConv =
      selectedClient.conversations.find((c) => c.id === selectedConversationId) ||
      selectedClient.conversations[0] ||
      null;

    return (
      <div className="space-y-6">
        {/* Top Back Navigation & Client Portal Quick Launch */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setSelectedClientId(null)}
            className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-[#CCF655] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Client Directory</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenClientPortal(selectedClient.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Preview Client Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Client Header Summary Card */}
        <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                <span>{selectedClient.industry}</span>
                <span>·</span>
                <span className="text-[#CCF655] font-medium">
                  Status: {selectedClient.status}
                </span>
                <span>·</span>
                <a
                  href={selectedClient.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white underline decoration-white/20"
                >
                  {selectedClient.website.replace('https://', '')}
                </a>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {selectedClient.businessName}
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-3xl">
                {selectedClient.overviewNotes}
              </p>
            </div>

            {/* Key Retainer & Fleet Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/[0.07] shrink-0">
              <div className="bg-[#0B0813] border border-white/[0.06] rounded-xl p-3.5">
                <div className="text-[11px] text-slate-400">Monthly Retainer</div>
                <div className="text-lg font-mono tabular-nums font-semibold text-white mt-1">
                  ${selectedClient.monthlyRetainer.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#0B0813] border border-white/[0.06] rounded-xl p-3.5">
                <div className="text-[11px] text-slate-400">Assigned Agents</div>
                <div className="text-lg font-mono tabular-nums font-semibold text-[#CCF655] mt-1">
                  {selectedClient.assignedAgentIds.length} active
                </div>
              </div>
              <div className="bg-[#0B0813] border border-white/[0.06] rounded-xl p-3.5">
                <div className="text-[11px] text-slate-400">Tasks (30d)</div>
                <div className="text-lg font-mono tabular-nums font-semibold text-white mt-1">
                  {selectedClient.tasksCompleted30d.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#0B0813] border border-white/[0.06] rounded-xl p-3.5">
                <div className="text-[11px] text-slate-400">Success Rate</div>
                <div className="text-lg font-mono tabular-nums font-semibold text-[#CCF655] mt-1">
                  {selectedClient.successRate}%
                </div>
              </div>
            </div>
          </div>

          {/* 8 Required Profile Tabs */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-1.5 overflow-x-auto pb-1">
            {PROFILE_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? 'bg-[#CCF655] text-[#08060D] font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 space-y-5">
              <h2 className="text-base font-semibold text-white">
                Executive Account Summary & Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                  <div className="text-slate-400 mb-1">Primary Executive Contact</div>
                  <div className="text-sm font-semibold text-white">
                    {selectedClient.contactName}
                  </div>
                  <div className="text-slate-400 mt-0.5">{selectedClient.contactRole}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                  <div className="text-slate-400 mb-1">Direct Communication</div>
                  <div className="text-slate-200 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#CCF655]" />
                    <span className="truncate">{selectedClient.contactEmail}</span>
                  </div>
                  <div className="text-slate-300 flex items-center gap-2 mt-1.5 font-mono tabular-nums">
                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                    <span>{selectedClient.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-xs font-semibold text-slate-300 mb-3">
                  30-Day Value Delivery Highlights
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                    <div className="text-xs text-slate-400">Qualified Leads</div>
                    <div className="text-xl font-mono tabular-nums font-semibold text-[#CCF655] mt-1">
                      {selectedClient.leadsGenerated30d}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                    <div className="text-xs text-slate-400">Staff Hours Saved</div>
                    <div className="text-xl font-mono tabular-nums font-semibold text-white mt-1">
                      {selectedClient.hoursSaved30d} hrs
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                    <div className="text-xs text-slate-400">AI Compute Spend</div>
                    <div className="text-xl font-mono tabular-nums font-semibold text-white mt-1">
                      ${selectedClient.aiSpendMonthly}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white">
                    Assigned AI Fleet ({clientAgents.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Agents')}
                    className="text-xs text-[#CCF655] hover:underline"
                  >
                    Manage Fleet
                  </button>
                </div>
                <div className="space-y-2.5">
                  {clientAgents.map((ag) => (
                    <div
                      key={ag.id}
                      className="p-3.5 rounded-xl bg-[#0B0813] border border-white/[0.06] flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">{ag.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {ag.defaultModel} · {ag.voicePersona}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onConfigureAgent(ag)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1A122E] hover:bg-[#251A40] text-xs text-[#CCF655] font-medium transition-colors shrink-0"
                      >
                        Configure
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs text-slate-400">
                <span>Knowledge Base Chunks Indexed</span>
                <span className="font-mono tabular-nums text-white font-semibold">
                  {selectedClient.knowledgeBase.reduce((s, k) => s + k.chunks, 0)} vectors
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AGENTS */}
        {activeTab === 'Agents' && (
          <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Client Agent Assignments & Deployment Controls
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Toggle any ROSE AI OS agent template to deploy or unassign it for{' '}
                  {selectedClient.businessName}.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.map((ag) => {
                const isAssigned = selectedClient.assignedAgentIds.includes(ag.id);
                return (
                  <div
                    key={ag.id}
                    className={`rounded-xl p-5 border transition-colors flex flex-col justify-between ${
                      isAssigned
                        ? 'bg-[#19122C] border-[#CCF655]/45'
                        : 'bg-[#0B0813] border-white/[0.07]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span>{ag.category}</span>
                        <span className={isAssigned ? 'text-[#CCF655] font-semibold' : ''}>
                          {isAssigned ? 'Assigned' : 'Unassigned'}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">{ag.name}</h3>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                        {ag.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/[0.07] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onConfigureAgent(ag)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs text-slate-200 transition-colors"
                      >
                        Configure
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleAgentForClient(selectedClient.id, ag.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isAssigned
                            ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25'
                            : 'bg-[#CCF655] text-[#08060D] hover:bg-[#d8fa75]'
                        }`}
                      >
                        {isAssigned ? 'Unassign' : 'Assign Agent'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: INTEGRATIONS */}
        {activeTab === 'Integrations' && (
          <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-white">
                Client Integration Connections (Demo Environment)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage connected CRM, Calendar, Messaging, and Telephony providers scoped to{' '}
                {selectedClient.businessName}. All connections operate in safe Demo Mode.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((intItem) => {
                const isConnected = selectedClient.connectedIntegrationIds.includes(
                  intItem.id
                );
                return (
                  <div
                    key={intItem.id}
                    className={`p-5 rounded-xl border flex flex-col justify-between ${
                      isConnected
                        ? 'bg-[#19122C] border-[#CCF655]/40'
                        : 'bg-[#0B0813] border-white/[0.07]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                        <span>{intItem.providerGroup}</span>
                        <span className={isConnected ? 'text-[#CCF655]' : 'text-slate-500'}>
                          {isConnected ? 'Demo Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">{intItem.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {intItem.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400 truncate max-w-[180px]">
                        {intItem.demoAccountLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleIntegrationForClient(selectedClient.id, intItem.id)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          isConnected
                            ? 'bg-white/[0.08] text-slate-200 hover:bg-white/[0.14]'
                            : 'bg-[#CCF655] text-[#08060D] hover:bg-[#d8fa75]'
                        }`}
                      >
                        {isConnected ? 'Disconnect Demo' : 'Connect Demo'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: KNOWLEDGE BASE */}
        {activeTab === 'Knowledge Base' && (
          <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Client Vector Knowledge Base & RAG Sources
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Documents, SOPs, and URLs indexed for {selectedClient.businessName}’s AI agents
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDocOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75] transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Add Document or URL</span>
              </button>
            </div>

            {isAddDocOpen && (
              <form
                onSubmit={handleAddKnowledgeDoc}
                className="mb-6 p-4 rounded-xl bg-[#19122B] border border-[#CCF655]/40 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-white">
                    Index New Client Knowledge Source
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddDocOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Document title or URL label..."
                    className="bg-[#0B0813] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <select
                    value={docType}
                    onChange={(e) =>
                      setDocType(e.target.value as 'PDF' | 'URL' | 'Markdown' | 'CSV')
                    }
                    className="bg-[#0B0813] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="URL">Website / Docs URL</option>
                    <option value="Markdown">Markdown Playbook</option>
                    <option value="CSV">CSV Pricing / Inventory</option>
                  </select>
                  <input
                    type="text"
                    value={docSizeOrUrl}
                    onChange={(e) => setDocSizeOrUrl(e.target.value)}
                    placeholder="File size (e.g. 3.2 MB) or URL..."
                    className="bg-[#0B0813] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#CCF655] text-[#08060D] text-xs font-semibold"
                  >
                    Index into Vector Store
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-white/[0.06]">
              {selectedClient.knowledgeBase.map((doc) => (
                <div
                  key={doc.id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#CCF655] shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">{doc.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {doc.type} · {doc.sizeOrUrl} · Updated {doc.updatedAt}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums text-xs">
                    <span className="text-[#CCF655]">{doc.status}</span>
                    <span className="mx-2 text-slate-600">·</span>
                    <span className="text-slate-300">{doc.chunks} chunks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CONVERSATIONS */}
        {activeTab === 'Conversations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 rounded-2xl bg-[#120D1F] border border-white/[0.08] p-5">
              <h2 className="text-sm font-semibold text-white mb-4">
                Recent Client Customer Sessions
              </h2>
              {selectedClient.conversations.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No recorded conversations yet for this client.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedClient.conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                        activeConv?.id === conv.id
                          ? 'bg-[#1C1430] border-[#CCF655]/50'
                          : 'bg-[#0B0813] border-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-white">
                        <span>{conv.customerName}</span>
                        <span className="text-[#CCF655] font-mono tabular-nums">
                          {conv.outcome}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {conv.channel} · Handled by {conv.agentName} · {conv.timestamp}
                      </div>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                        {conv.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6">
              {activeConv ? (
                <div>
                  <div className="pb-4 mb-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Transcript: {activeConv.customerName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeConv.customerContact} · {activeConv.agentName} ·{' '}
                        {activeConv.durationOrLength}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[#CCF655]">
                      Sentiment: {activeConv.sentiment}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeConv.transcript.map((line, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                          line.speaker === 'Agent'
                            ? 'bg-[#19122C] border border-purple-400/20 text-slate-100'
                            : 'bg-[#0B0813] border border-white/[0.06] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-white">
                            {line.speaker === 'Agent'
                              ? activeConv.agentName
                              : activeConv.customerName}
                          </span>
                          <span className="font-mono tabular-nums">{line.time}</span>
                        </div>
                        <p>{line.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-slate-400">
                  Select a conversation session on the left to inspect the full transcript.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS */}
        {activeTab === 'Analytics' && (
          <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-white">
                Client ROI & Conversion Attribution
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                30-day performance metrics exclusively for {selectedClient.businessName}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                <div className="text-xs text-slate-400">Tasks Automated</div>
                <div className="text-2xl font-mono tabular-nums font-semibold text-white mt-1">
                  {selectedClient.tasksCompleted30d.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                <div className="text-xs text-slate-400">Qualified Leads Booked</div>
                <div className="text-2xl font-mono tabular-nums font-semibold text-[#CCF655] mt-1">
                  {selectedClient.leadsGenerated30d}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                <div className="text-xs text-slate-400">Human Hours Saved</div>
                <div className="text-2xl font-mono tabular-nums font-semibold text-white mt-1">
                  {selectedClient.hoursSaved30d}h
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                <div className="text-xs text-slate-400">Est. Payroll Savings</div>
                <div className="text-2xl font-mono tabular-nums font-semibold text-[#CCF655] mt-1">
                  ${(selectedClient.hoursSaved30d * 45).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: TEAM */}
        {activeTab === 'Team' && (
          <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Client Stakeholders & Portal Access
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Users authorized to sign into the isolated Client Portal for{' '}
                  {selectedClient.businessName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTeamOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite Client User</span>
              </button>
            </div>

            {isAddTeamOpen && (
              <form
                onSubmit={handleAddTeamMember}
                className="mb-6 p-4 rounded-xl bg-[#19122B] border border-[#CCF655]/40 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Full Name"
                    className="bg-[#0B0813] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    placeholder="Job Title"
                    className="bg-[#0B0813] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="Email Address"
                    className="bg-[#0B0813] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <select
                    value={memberAccess}
                    onChange={(e) =>
                      setMemberAccess(e.target.value as 'Admin' | 'Viewer' | 'Billing Only')
                    }
                    className="bg-[#0B0813] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Admin">Portal Admin</option>
                    <option value="Viewer">Read-Only Viewer</option>
                    <option value="Billing Only">Billing Only</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddTeamOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#CCF655] text-[#08060D] text-xs font-semibold"
                  >
                    Send Portal Invite
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-white/[0.06]">
              {selectedClient.team.map((tm) => (
                <div
                  key={tm.id}
                  className="py-3.5 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{tm.name}</div>
                    <div className="text-slate-400 mt-0.5">
                      {tm.role} · {tm.email}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#CCF655] font-medium">{tm.portalAccess}</span>
                    <span className="mx-2 text-slate-600">·</span>
                    <span className="text-slate-400 font-mono">{tm.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: BILLING */}
        {activeTab === 'Billing' && (
          <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-white">
                Retainer Subscription & AI Compute Rebilled Invoices
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Monthly agency retainer (${selectedClient.monthlyRetainer.toLocaleString()}/mo) plus
                metered AI token & voice usage
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400">
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Billing Period</th>
                    <th className="py-2.5 px-3 text-right">Agency Retainer</th>
                    <th className="py-2.5 px-3 text-right">AI Compute Usage</th>
                    <th className="py-2.5 px-3 text-right">Total Billed</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {selectedClient.invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-3 px-3 font-mono text-white">{inv.invoiceNumber}</td>
                      <td className="py-3 px-3 text-slate-300">{inv.period}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                        ${inv.retainerAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                        ${inv.aiUsageCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-white">
                        ${inv.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#CCF655]">
                        {inv.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // MAIN CLIENT DIRECTORY VIEW
  // ============================================================================
  return (
    <div className="space-y-6">
      {/* Header & Add Client Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-[#CCF655] uppercase tracking-wider mb-1">
            Client Operations Directory
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Managed Business Clients
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Select any client card to open their 8-tab operational profile or launch their
            isolated Client Portal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#120D1F] border border-white/[0.08] rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by business name, industry, or executive contact..."
            className="w-full bg-[#090610] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#CCF655]/50"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090610] border border-white/[0.08]">
          {(['ALL', 'Active', 'Onboarding', 'Pilot'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === st
                  ? 'bg-[#1F1635] text-[#CCF655]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All Clients' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards Grid */}
      {filteredClients.length === 0 ? (
        <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-12 text-center">
          <p className="text-sm text-slate-300 font-medium">
            No clients match your current search filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            className="mt-3 text-xs text-[#CCF655] hover:underline"
          >
            Reset directory filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredClients.map((client) => {
            const assignedNames = agents
              .filter((a) => client.assignedAgentIds.includes(a.id))
              .map((a) => a.name);

            return (
              <div
                key={client.id}
                onClick={() => {
                  setSelectedClientId(client.id);
                  setActiveTab('Overview');
                }}
                className="group cursor-pointer rounded-2xl bg-[#120D1F] border border-white/[0.08] hover:border-[#CCF655]/50 p-6 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Clean unboxed metadata header */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                    <span>{client.industry}</span>
                    <span className="font-mono text-[#CCF655]">{client.status}</span>
                  </div>

                  <h2 className="text-lg font-semibold text-white group-hover:text-[#CCF655] transition-colors">
                    {client.businessName}
                  </h2>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {client.website.replace('https://', '')}
                    </span>
                  </div>

                  {/* Contact Information */}
                  <div className="mt-4 pt-3.5 border-t border-white/[0.06] space-y-1 text-xs">
                    <div className="text-slate-200 font-medium">
                      {client.contactName}{' '}
                      <span className="text-slate-400 font-normal">
                        · {client.contactRole}
                      </span>
                    </div>
                    <div className="text-slate-400 truncate">{client.contactEmail}</div>
                    <div className="text-slate-400 font-mono tabular-nums">
                      {client.contactPhone}
                    </div>
                  </div>

                  {/* Assigned Agents List */}
                  <div className="mt-4 pt-3.5 border-t border-white/[0.06]">
                    <div className="text-[11px] text-slate-400 mb-1.5">
                      Assigned AI Agents ({assignedNames.length})
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {assignedNames.length > 0
                        ? assignedNames.join(' · ')
                        : 'No agents assigned yet'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <div className="font-mono tabular-nums text-slate-300">
                    Retainer:{' '}
                    <strong className="text-white">
                      ${client.monthlyRetainer.toLocaleString()}/mo
                    </strong>
                  </div>
                  <span className="text-[#CCF655] font-medium group-hover:underline">
                    Open Profile →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD CLIENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#140E24] border border-white/[0.12] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Onboard New Agency Client
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Provision an isolated client workspace, knowledge base, and initial agent fleet
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="mt-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBusinessName}
                    onChange={(e) => setNewBusinessName(e.target.value)}
                    placeholder="e.g. Obsidian Private Aviation"
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CCF655]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    placeholder="e.g. Private Aviation & Charter"
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CCF655]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    placeholder="https://obsidianjets.example.com"
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CCF655]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Initial Status & Monthly Retainer ($)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(e.target.value as 'Active' | 'Onboarding' | 'Pilot')
                      }
                      className="bg-[#090610] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="Onboarding">Onboarding</option>
                      <option value="Active">Active</option>
                      <option value="Pilot">Pilot</option>
                    </select>
                    <input
                      type="number"
                      value={newRetainer}
                      onChange={(e) => setNewRetainer(e.target.value)}
                      className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Primary Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="e.g. Julian Mercer"
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CCF655]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Contact Role
                  </label>
                  <input
                    type="text"
                    value={newContactRole}
                    onChange={(e) => setNewContactRole(e.target.value)}
                    placeholder="Managing Director"
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CCF655]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="j.mercer@obsidianjets.example.com"
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CCF655]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="+1 (212) 555-0148"
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CCF655]"
                  />
                </div>
              </div>

              {/* Select Initial AI Agents */}
              <div>
                <label className="block text-xs text-slate-300 mb-2">
                  Assign Initial AI Agent Templates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {agents.map((ag) => {
                    const checked = newSelectedAgents.includes(ag.id);
                    return (
                      <button
                        key={ag.id}
                        type="button"
                        onClick={() =>
                          setNewSelectedAgents((prev) =>
                            checked ? prev.filter((i) => i !== ag.id) : [...prev, ag.id]
                          )
                        }
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                          checked
                            ? 'bg-[#22183B] border-[#CCF655]/50 text-white'
                            : 'bg-[#090610] border-white/[0.08] text-slate-400'
                        }`}
                      >
                        <span className="truncate">{ag.name}</span>
                        {checked && <CheckCircle2 className="w-3.5 h-3.5 text-[#CCF655] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75]"
                >
                  Create Client Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
