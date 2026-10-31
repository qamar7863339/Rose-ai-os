'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import { AutomationWorkflow, ClientRecord, AgentTemplate } from '@/lib/rose-data';

interface AutomationsViewProps {
  automations: AutomationWorkflow[];
  setAutomations: React.Dispatch<React.SetStateAction<AutomationWorkflow[]>>;
  clients: ClientRecord[];
  agents: AgentTemplate[];
}

export default function AutomationsView({
  automations,
  setAutomations,
  clients,
  agents,
}: AutomationsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Paused'>('ALL');
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [lastTestedId, setLastTestedId] = useState<string | null>(null);

  // Configure Workflow Modal
  const [configWorkflow, setConfigWorkflow] = useState<AutomationWorkflow | null>(null);
  const [editedTrigger, setEditedTrigger] = useState('');
  const [editedSchedule, setEditedSchedule] = useState('');

  // Create New Automation Modal
  const [isNewAutoOpen, setIsNewAutoOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClientId, setNewClientId] = useState(clients[0]?.id || 'client-vanguard');
  const [newTrigger, setNewTrigger] = useState('');
  const [newAgentName, setNewAgentName] = useState(agents[0]?.name || 'AI Voice Agent');
  const [newActionProvider, setNewActionProvider] = useState('Google Calendar + HubSpot');

  const filteredAutomations = useMemo(() => {
    return automations.filter((wf) => {
      const matchesStatus = statusFilter === 'ALL' || wf.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        wf.name.toLowerCase().includes(q) ||
        wf.clientName.toLowerCase().includes(q) ||
        wf.triggerDescription.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [automations, statusFilter, searchQuery]);

  const handleToggleWorkflowStatus = (id: string) => {
    setAutomations((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === 'Active' ? 'Paused' : 'Active' }
          : w
      )
    );
  };

  const handleRunTestExecution = (id: string) => {
    setRunningTestId(id);
    setTimeout(() => {
      setAutomations((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                executions30d: w.executions30d + 1,
                lastRun: 'Just now (Test Run)',
              }
            : w
        )
      );
      setRunningTestId(null);
      setLastTestedId(id);
      setTimeout(() => setLastTestedId(null), 3000);
    }, 850);
  };

  const openConfigureModal = (wf: AutomationWorkflow) => {
    setConfigWorkflow(wf);
    setEditedTrigger(wf.triggerDescription);
    setEditedSchedule(wf.scheduleOrEvent);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configWorkflow) return;
    const updated: AutomationWorkflow = {
      ...configWorkflow,
      triggerDescription: editedTrigger,
      scheduleOrEvent: editedSchedule,
    };
    setAutomations((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    setConfigWorkflow(null);
  };

  const handleCreateAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTrigger.trim()) return;
    const targetClient = clients.find((c) => c.id === newClientId) || clients[0];

    const created: AutomationWorkflow = {
      id: `auto-${Date.now()}`,
      name: newName.trim(),
      clientId: targetClient?.id || 'client-vanguard',
      clientName: targetClient?.businessName || 'Vanguard Luxury Realty',
      status: 'Active',
      triggerDescription: newTrigger.trim(),
      scheduleOrEvent: 'Real-time Event Webhook',
      executions30d: 1,
      successRate: 100,
      avgDurationSec: 14,
      lastRun: 'Just provisioned',
      steps: [
        {
          id: `st-${Date.now()}-1`,
          title: 'Inbound Event Trigger',
          type: 'Trigger',
          provider: 'Webhook / CRM',
          detail: newTrigger.trim(),
        },
        {
          id: `st-${Date.now()}-2`,
          title: 'Autonomous Agent Execution',
          type: 'AI Agent',
          provider: newAgentName,
          detail: 'Processes payload against client RAG store and guardrails',
        },
        {
          id: `st-${Date.now()}-3`,
          title: 'Validation & Routing Gate',
          type: 'Condition',
          provider: 'ROSE Flow Engine',
          detail: 'Verifies confidence score >= 0.85 before external write',
        },
        {
          id: `st-${Date.now()}-4`,
          title: 'Downstream Sync',
          type: 'Integration Action',
          provider: newActionProvider,
          detail: 'Updates client records and dispatches confirmation',
        },
      ],
    };

    setAutomations((prev) => [created, ...prev]);
    setIsNewAutoOpen(false);
    setNewName('');
    setNewTrigger('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-[#CCF655] uppercase tracking-wider mb-1">
            Multi-Step Orchestration Engine
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Automation Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual pipelines connecting webhooks, autonomous AI agents, conditional
            routers, and client CRM/calendar actions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewAutoOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#120D1F] border border-white/[0.08] rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workflows by name, client, or trigger..."
            className="w-full bg-[#090610] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#CCF655]/50"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090610] border border-white/[0.08]">
          {(['ALL', 'Active', 'Paused'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === st
                  ? 'bg-[#1F1635] text-[#CCF655]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All Workflows' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Cards List */}
      <div className="space-y-5">
        {filteredAutomations.map((wf) => {
          const isRunning = runningTestId === wf.id;
          const justTested = lastTestedId === wf.id;

          return (
            <div
              key={wf.id}
              className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 space-y-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <span className="text-white font-medium">{wf.clientName}</span>
                    <span>·</span>
                    <span
                      className={
                        wf.status === 'Active'
                          ? 'text-[#CCF655] font-semibold'
                          : 'text-amber-400 font-semibold'
                      }
                    >
                      Status: {wf.status}
                    </span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{wf.scheduleOrEvent}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">Last run: {wf.lastRun}</span>
                  </div>

                  <h2 className="text-lg font-semibold text-white">{wf.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Trigger: {wf.triggerDescription}
                  </p>
                </div>

                {/* Action Controls */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRunTestExecution(wf.id)}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E1433] hover:bg-[#2A1D47] border border-white/[0.08] text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 text-[#CCF655]" />
                    <span>{isRunning ? 'Executing...' : 'Test Run'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleWorkflowStatus(wf.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B0813] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0"
                  >
                    {wf.status === 'Active' ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-[#CCF655]" />
                        <span>Resume</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openConfigureModal(wf)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#CCF655] hover:bg-[#d8fa75] text-xs font-semibold text-[#08060D] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>

              {justTested && (
                <div className="p-3 rounded-xl bg-[#CCF655]/15 border border-[#CCF655]/40 text-xs text-[#CCF655] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Synthetic test payload executed cleanly across all {wf.steps.length}{' '}
                    pipeline nodes in 410ms.
                  </span>
                </div>
              )}

              {/* Visual Pipeline Steps */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                {wf.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="relative rounded-xl bg-[#0B0813] border border-white/[0.07] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                        <span className="font-mono text-[#CCF655]">
                          0{index + 1}. {step.type}
                        </span>
                        {index < wf.steps.length - 1 && (
                          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden md:block" />
                        )}
                      </div>
                      <div className="text-xs font-semibold text-white">{step.title}</div>
                      <div className="text-[11px] text-purple-300 mt-0.5">
                        {step.provider}
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Telemetry Footer */}
              <div className="pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span>
                    30d Executions:{' '}
                    <strong className="font-mono tabular-nums text-white">
                      {wf.executions30d.toLocaleString()}
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Success Rate:{' '}
                    <strong className="font-mono tabular-nums text-[#CCF655]">
                      {wf.successRate}%
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Avg Duration:{' '}
                    <strong className="font-mono tabular-nums text-white">
                      {wf.avgDurationSec}s
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONFIGURE WORKFLOW MODAL */}
      {configWorkflow && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#130D22] border border-white/[0.12] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="text-xs font-mono text-[#CCF655]">
                  Workflow Configuration · {configWorkflow.clientName}
                </div>
                <h2 className="text-lg font-semibold text-white mt-0.5">
                  {configWorkflow.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setConfigWorkflow(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  Trigger Condition Description
                </label>
                <input
                  type="text"
                  value={editedTrigger}
                  onChange={(e) => setEditedTrigger(e.target.value)}
                  className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  Execution Cadence / SLA Target
                </label>
                <input
                  type="text"
                  value={editedSchedule}
                  onChange={(e) => setEditedSchedule(e.target.value)}
                  className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <div className="text-xs text-slate-300 mb-2">
                  Configured Pipeline Nodes ({configWorkflow.steps.length})
                </div>
                <div className="space-y-2">
                  {configWorkflow.steps.map((st, idx) => (
                    <div
                      key={st.id}
                      className="p-3 rounded-xl bg-[#090610] border border-white/[0.07] text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-[#CCF655] mr-2">0{idx + 1}</span>
                        <span className="font-semibold text-white">{st.title}</span>
                        <span className="text-slate-400 ml-2">({st.provider})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{st.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfigWorkflow(null)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold"
                >
                  Save Workflow Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW AUTOMATION MODAL */}
      {isNewAutoOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#130D22] border border-white/[0.12] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-white">
                Create Multi-Step AI Automation
              </h2>
              <button
                type="button"
                onClick={() => setIsNewAutoOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAutomation} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  Workflow Title *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Missed Call Instant WhatsApp Qualification & Booking"
                  className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  Client Account
                </label>
                <select
                  value={newClientId}
                  onChange={(e) => setNewClientId(e.target.value)}
                  className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.businessName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  Trigger Event Description *
                </label>
                <input
                  type="text"
                  required
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  placeholder="e.g. Inbound webhook from Twilio missed call or Meta Lead form"
                  className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Assigned AI Agent Node
                  </label>
                  <select
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Target Integration Action
                  </label>
                  <input
                    type="text"
                    value={newActionProvider}
                    onChange={(e) => setNewActionProvider(e.target.value)}
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAutoOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold"
                >
                  Deploy Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
