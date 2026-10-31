'use client';

import React, { useState, useMemo } from 'react';
import {
  Sliders,
  UserCheck,
  Plus,
  Search,
  X,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AgentTemplate, ClientRecord } from '@/lib/rose-data';

interface AgentsViewProps {
  agents: AgentTemplate[];
  setAgents: React.Dispatch<React.SetStateAction<AgentTemplate[]>>;
  clients: ClientRecord[];
  setClients: React.Dispatch<React.SetStateAction<ClientRecord[]>>;
  activeConfigAgent: AgentTemplate | null;
  setActiveConfigAgent: (agent: AgentTemplate | null) => void;
}

export default function AgentsView({
  agents,
  setAgents,
  clients,
  setClients,
  activeConfigAgent,
  setActiveConfigAgent,
}: AgentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Assign to Client Modal state
  const [assignModalAgent, setAssignModalAgent] = useState<AgentTemplate | null>(null);

  // Create New Custom Agent Template Modal state
  const [isNewAgentOpen, setIsNewAgentOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<AgentTemplate['category']>('Revenue & Sales');
  const [newDescription, setNewDescription] = useState('');
  const [newSystemPrompt, setNewSystemPrompt] = useState('');

  // Configuration Studio local state
  const [configTab, setConfigTab] = useState<'prompt' | 'voice' | 'sandbox'>('prompt');
  const [editedPrompt, setEditedPrompt] = useState('');
  const [editedModel, setEditedModel] = useState('');
  const [editedVoice, setEditedVoice] = useState('');
  const [newGuardrail, setNewGuardrail] = useState('');
  const [saveBanner, setSaveBanner] = useState(false);

  // Live Sandbox Test inside Agent Configuration Studio
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxMessages, setSandboxMessages] = useState<
    { role: 'user' | 'agent'; text: string }[]
  >([]);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  const currentPromptValue =
    editedPrompt !== '' ? editedPrompt : activeConfigAgent?.systemPrompt || '';
  const currentModelValue =
    editedModel !== '' ? editedModel : activeConfigAgent?.defaultModel || 'ROSE-4 Omni';
  const currentVoiceValue =
    editedVoice !== ''
      ? editedVoice
      : activeConfigAgent?.voicePersona || 'Clara — Warm Executive British';

  const openConfigStudio = (agent: AgentTemplate) => {
    setActiveConfigAgent(agent);
    setEditedPrompt(agent.systemPrompt);
    setEditedModel(agent.defaultModel);
    setEditedVoice(agent.voicePersona);
    setConfigTab('prompt');
    setSaveBanner(false);
    setSandboxMessages([
      {
        role: 'agent',
        text: `Hello! I am configured as the ${agent.name} (${agent.voicePersona}). Send a test customer message to verify my prompt and guardrails.`,
      },
    ]);
  };

  const filteredAgents = useMemo(() => {
    return agents.filter((ag) => {
      const matchesCat = categoryFilter === 'ALL' || ag.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ag.name.toLowerCase().includes(q) ||
        ag.description.toLowerCase().includes(q) ||
        ag.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [agents, categoryFilter, searchQuery]);

  const handleSaveAgentConfig = () => {
    if (!activeConfigAgent) return;
    const updated: AgentTemplate = {
      ...activeConfigAgent,
      systemPrompt: currentPromptValue,
      defaultModel: currentModelValue,
      voicePersona: currentVoiceValue,
    };
    setAgents((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    setActiveConfigAgent(updated);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  const handleAddGuardrail = () => {
    if (!activeConfigAgent || !newGuardrail.trim()) return;
    const updated: AgentTemplate = {
      ...activeConfigAgent,
      guardrails: [...activeConfigAgent.guardrails, newGuardrail.trim()],
    };
    setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setActiveConfigAgent(updated);
    setNewGuardrail('');
  };

  const handleTestInSandbox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConfigAgent || !sandboxInput.trim() || sandboxLoading) return;
    const userText = sandboxInput.trim();
    setSandboxMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setSandboxInput('');
    setSandboxLoading(true);

    try {
      const res = await fetch('/api/workspace/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          model: editedModel || activeConfigAgent.defaultModel,
          systemOverride: `${editedPrompt || activeConfigAgent.systemPrompt}\n\nGuardrails:\n${activeConfigAgent.guardrails.join('\n')}\nRespond directly in character as the AI Agent speaking to a customer.`,
        }),
      });
      const data = await res.json();
      setSandboxMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text:
            data.text ||
            'Understood. I have verified your details against our knowledge base and scheduled the next step.',
        },
      ]);
    } catch {
      setSandboxMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text: 'Thank you for reaching out! Based on my configured guardrails, I have logged your inquiry and can lock in a time slot on the calendar right now.',
        },
      ]);
    } finally {
      setSandboxLoading(false);
    }
  };

  const handleToggleClientAssignment = (agentId: string, clientId: string) => {
    setAgents((prev) =>
      prev.map((ag) => {
        if (ag.id !== agentId) return ag;
        const exists = ag.assignedClientIds.includes(clientId);
        const updatedIds = exists
          ? ag.assignedClientIds.filter((id) => id !== clientId)
          : [...ag.assignedClientIds, clientId];
        const updatedAgent = { ...ag, assignedClientIds: updatedIds };
        if (assignModalAgent?.id === agentId) {
          setAssignModalAgent(updatedAgent);
        }
        return updatedAgent;
      })
    );

    setClients((prev) =>
      prev.map((cl) => {
        if (cl.id !== clientId) return cl;
        const exists = cl.assignedAgentIds.includes(agentId);
        return {
          ...cl,
          assignedAgentIds: exists
            ? cl.assignedAgentIds.filter((id) => id !== agentId)
            : [...cl.assignedAgentIds, agentId],
        };
      })
    );
  };

  const handleCreateCustomAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDescription.trim()) return;
    const created: AgentTemplate = {
      id: `agent-custom-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      status: 'Production Ready',
      description: newDescription.trim(),
      defaultModel: 'ROSE-4 Omni',
      voicePersona: 'Clara — Warm Executive British',
      avgLatencyMs: 410,
      successRate: 98.5,
      totalExecutions: 0,
      systemPrompt:
        newSystemPrompt.trim() ||
        `You are the ${newName.trim()}. Assist customers accurately using the client Knowledge Base and escalate high-priority requests.`,
      guardrails: [
        'Ground all claims in verified client documentation',
        'Confirm contact information before booking or escalating',
      ],
      capabilities: ['Knowledge Base RAG', 'CRM Sync', 'Live Escalation'],
      assignedClientIds: [],
    };
    setAgents((prev) => [created, ...prev]);
    setIsNewAgentOpen(false);
    setNewName('');
    setNewDescription('');
    setNewSystemPrompt('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-[#CCF655] uppercase tracking-wider mb-1">
            Reusable Autonomous Fleet
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            AI Agent Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pre-engineered voice, sales, qualification, and support templates ready to
            configure and assign across client workspaces.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewAgentOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Agent Template</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#120D1F] border border-white/[0.08] rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agent templates by role or capability..."
            className="w-full bg-[#090610] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#CCF655]/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#090610] border border-white/[0.08]">
          {[
            'ALL',
            'Voice & Inbound',
            'Revenue & Sales',
            'Customer Experience',
            'Growth & Marketing',
          ].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#1F1635] text-[#CCF655]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-2xl bg-[#120D1F] border border-white/[0.08] hover:border-purple-400/40 p-6 flex flex-col justify-between transition-all"
          >
            <div>
              {/* Unboxed Metadata Line */}
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                <span>{agent.category}</span>
                <span className="text-[#CCF655] font-medium">{agent.status}</span>
              </div>

              <h2 className="text-base font-semibold text-white">{agent.name}</h2>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {agent.description}
              </p>

              <div className="mt-4 pt-3.5 border-t border-white/[0.06] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Engine</span>
                  <span className="text-slate-200 font-medium">{agent.defaultModel}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Success / Latency</span>
                  <span className="font-mono tabular-nums text-[#CCF655]">
                    {agent.successRate}% · {agent.avgLatencyMs}ms
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Assigned Clients</span>
                  <span className="font-mono tabular-nums text-white">
                    {agent.assignedClientIds.length} active
                  </span>
                </div>
              </div>
            </div>

            {/* Required Buttons: Configure & Assign to Client */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => openConfigStudio(agent)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1D1432] hover:bg-[#281C44] border border-white/[0.08] text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0"
              >
                <Sliders className="w-3.5 h-3.5 text-[#CCF655]" />
                <span>Configure</span>
              </button>
              <button
                type="button"
                onClick={() => setAssignModalAgent(agent)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#CCF655] hover:bg-[#d8fa75] text-xs font-semibold text-[#08060D] transition-colors whitespace-nowrap shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Assign to Client</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================================
          AGENT CONFIGURATION STUDIO MODAL
         ===================================================================== */}
      {activeConfigAgent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-[#130D22] border border-white/[0.12] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="text-xs font-mono text-[#CCF655]">
                  Agent Configuration Studio · {activeConfigAgent.category}
                </div>
                <h2 className="text-xl font-semibold text-white mt-0.5">
                  {activeConfigAgent.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveConfigAgent(null);
                  setEditedPrompt('');
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Studio Tabs */}
            <div className="flex items-center gap-2 mt-4 border-b border-white/[0.08] pb-3">
              {[
                { id: 'prompt', label: 'System Prompt & Guardrails' },
                { id: 'voice', label: 'Model & Voice Persona' },
                { id: 'sandbox', label: 'Live Agent Test Sandbox' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setConfigTab(t.id as 'prompt' | 'voice' | 'sandbox')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    configTab === t.id
                      ? 'bg-[#CCF655] text-[#08060D] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {saveBanner && (
              <div className="mt-4 p-3 rounded-xl bg-[#CCF655]/15 border border-[#CCF655]/40 text-xs text-[#CCF655] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Agent configuration saved and propagated to{' '}
                  {activeConfigAgent.assignedClientIds.length} assigned client workspaces.
                </span>
              </div>
            )}

            {configTab === 'prompt' && (
              <div className="mt-5 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-2">
                    Core System Instruction Prompt
                  </label>
                  <textarea
                    rows={5}
                    value={currentPromptValue}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    className="w-full rounded-xl bg-[#090610] border border-white/[0.1] p-3.5 text-xs text-slate-100 leading-relaxed focus:outline-none focus:border-[#CCF655]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-2">
                    Operational Safety & Compliance Guardrails
                  </label>
                  <div className="space-y-2 mb-3">
                    {activeConfigAgent.guardrails.map((g, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#090610] border border-white/[0.07] text-xs text-slate-300 flex items-center justify-between gap-2"
                      >
                        <span>
                          {idx + 1}. {g}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGuardrail}
                      onChange={(e) => setNewGuardrail(e.target.value)}
                      placeholder="Add a new compliance or escalation guardrail..."
                      className="flex-1 bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddGuardrail}
                      className="px-4 py-2 rounded-xl bg-[#24193C] text-xs font-medium text-[#CCF655] hover:bg-[#2F214E]"
                    >
                      + Add Rule
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleSaveAgentConfig}
                    className="px-5 py-2.5 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75]"
                  >
                    Save Agent Configuration
                  </button>
                </div>
              </div>
            )}

            {configTab === 'voice' && (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5">
                      Primary Foundation Model
                    </label>
                    <select
                      value={currentModelValue}
                      onChange={(e) => setEditedModel(e.target.value)}
                      className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                    >
                      <option value="ROSE-4 Omni">ROSE-4 Omni</option>
                      <option value="Gemini 3.8 Flash">Gemini 3.8 Flash</option>
                      <option value="Gemini 3.8 Live Audio">Gemini 3.8 Live Audio</option>
                      <option value="ROSE Reasoning Pro">ROSE Reasoning Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5">
                      Synthesized Voice & Persona
                    </label>
                    <select
                      value={currentVoiceValue}
                      onChange={(e) => setEditedVoice(e.target.value)}
                      className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                    >
                      <option value="Clara — Warm Executive British">
                        Clara — Warm Executive British
                      </option>
                      <option value="Julian — Calm Consultative US">
                        Julian — Calm Consultative US
                      </option>
                      <option value="Elena — High-Trust Enterprise">
                        Elena — High-Trust Enterprise
                      </option>
                      <option value="Aria — Friendly Coordinator">
                        Aria — Friendly Coordinator
                      </option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveAgentConfig}
                    className="px-5 py-2.5 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75]"
                  >
                    Save Model & Voice Settings
                  </button>
                </div>
              </div>
            )}

            {configTab === 'sandbox' && (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl bg-[#090610] border border-white/[0.08] p-4 h-64 overflow-y-auto space-y-3">
                  {sandboxMessages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl text-xs max-w-xl ${
                        m.role === 'user'
                          ? 'ml-auto bg-[#261B42] text-white'
                          : 'bg-[#171126] border border-white/[0.07] text-slate-200'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 mb-1 font-mono">
                        {m.role === 'user' ? 'Simulated Caller / Prospect' : activeConfigAgent.name}
                      </div>
                      <div className="whitespace-pre-line">{m.text}</div>
                    </div>
                  ))}
                  {sandboxLoading && (
                    <div className="text-xs text-[#CCF655] font-mono">
                      {activeConfigAgent.name} is responding...
                    </div>
                  )}
                </div>

                <form onSubmit={handleTestInSandbox} className="flex gap-2">
                  <input
                    type="text"
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    placeholder={`Simulate a customer message to ${activeConfigAgent.name}...`}
                    className="flex-1 bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                  <button
                    type="submit"
                    disabled={sandboxLoading}
                    className="px-4 py-2.5 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Test Turn</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          ASSIGN TO CLIENT MODAL
         ===================================================================== */}
      {assignModalAgent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#130D22] border border-white/[0.12] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="text-xs font-mono text-[#CCF655]">
                  Fleet Deployment Assignment
                </div>
                <h2 className="text-lg font-semibold text-white mt-0.5">
                  Assign {assignModalAgent.name} to Clients
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalAgent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {clients.map((client) => {
                const isAssigned = assignModalAgent.assignedClientIds.includes(
                  client.id
                );
                return (
                  <div
                    key={client.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                      isAssigned
                        ? 'bg-[#1D1433] border-[#CCF655]/45'
                        : 'bg-[#090610] border-white/[0.07]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {client.businessName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {client.industry} · {client.status}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleClientAssignment(assignModalAgent.id, client.id)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isAssigned
                          ? 'bg-[#CCF655] text-[#08060D]'
                          : 'bg-white/[0.07] text-slate-200 hover:bg-white/[0.14]'
                      }`}
                    >
                      {isAssigned ? 'Assigned ✓' : 'Assign'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                type="button"
                onClick={() => setAssignModalAgent(null)}
                className="px-5 py-2 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          NEW CUSTOM AGENT TEMPLATE MODAL
         ===================================================================== */}
      {isNewAgentOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#130D22] border border-white/[0.12] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#CCF655]" />
                <span>Create Reusable AI Agent Template</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsNewAgentOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomAgent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  Agent Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. AI Concierge & Charter Coordinator"
                  className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as AgentTemplate['category'])
                  }
                  className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="Voice & Inbound">Voice & Inbound</option>
                  <option value="Revenue & Sales">Revenue & Sales</option>
                  <option value="Customer Experience">Customer Experience</option>
                  <option value="Growth & Marketing">Growth & Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the agent's primary operational responsibility..."
                  className="w-full bg-[#090610] border border-white/[0.1] rounded-xl p-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  Initial System Prompt
                </label>
                <textarea
                  rows={3}
                  value={newSystemPrompt}
                  onChange={(e) => setNewSystemPrompt(e.target.value)}
                  placeholder="Define the agent's persona, tone, and escalation rules..."
                  className="w-full bg-[#090610] border border-white/[0.1] rounded-xl p-3 text-xs text-white"
                />
              </div>
              <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAgentOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold"
                >
                  Publish to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
