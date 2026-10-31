'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Send,
  CheckCircle2,
} from 'lucide-react';
import {
  ClientRecord,
  AgentTemplate,
  PortalSection,
} from '@/lib/rose-data';

interface ClientPortalViewProps {
  clients: ClientRecord[];
  agents: AgentTemplate[];
  activeClientId: string;
  setActiveClientId: (id: string) => void;
  onExitPortal: () => void;
}

const PORTAL_NAV: { id: PortalSection; label: string }[] = [
  { id: 'overview', label: 'Executive Summary' },
  { id: 'agents', label: 'My Assigned Agents' },
  { id: 'conversations', label: 'Customer Conversations' },
  { id: 'knowledge', label: 'Knowledge Base' },
  { id: 'analytics', label: 'ROI & Performance' },
  { id: 'billing', label: 'Billing & Retainer' },
];

export default function ClientPortalView({
  clients,
  agents,
  activeClientId,
  setActiveClientId,
  onExitPortal,
}: ClientPortalViewProps) {
  const [section, setSection] = useState<PortalSection>('overview');
  const [testAgentId, setTestAgentId] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [testReply, setTestReply] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const currentClient = useMemo(
    () => clients.find((c) => c.id === activeClientId) || clients[0],
    [clients, activeClientId]
  );

  // Strictly filter agents so the client ONLY sees their own assigned agents
  const assignedAgents = useMemo(
    () =>
      agents.filter((ag) => currentClient.assignedAgentIds.includes(ag.id)),
    [agents, currentClient]
  );

  const handleQuickAgentTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessage.trim()) return;
    const targetAg =
      assignedAgents.find((a) => a.id === testAgentId) || assignedAgents[0];
    setTestReply(
      `[${targetAg?.name || 'Assigned Agent'} · ${currentClient.businessName}]: Thank you! I have verified that against ${currentClient.businessName}’s indexed knowledge base (${currentClient.knowledgeBase.length} active documents) and logged the update.`
    );
    setTestMessage('');
  };

  return (
    <div className="min-h-screen bg-[#07050C] text-[#F4F2F8] flex flex-col">
      {/* Agency Preview Banner (Allows switching which isolated client portal is being previewed) */}
      <div className="bg-[#18102B] border-b border-purple-400/25 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#CCF655] shrink-0" />
          <span className="text-slate-200">
            <strong>Isolated Client Portal Mode</strong> — Clients only see their own
            business metrics, conversations, and assigned AI agents.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-slate-400">Previewing as Client:</label>
          <select
            value={currentClient.id}
            onChange={(e) => {
              setActiveClientId(e.target.value);
              setTestReply(null);
            }}
            className="bg-[#0B0813] border border-white/[0.15] rounded-lg px-3 py-1 text-xs text-[#CCF655] font-semibold focus:outline-none"
          >
            {clients.map((cl) => (
              <option key={cl.id} value={cl.id}>
                {cl.businessName} ({cl.industry})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onExitPortal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#CCF655]" />
            <span>Return to ROSE AI Agency OS</span>
          </button>
        </div>
      </div>

      {/* Client-Facing Top Navigation Bar (Strict 3-Zone Top Bar Contract) */}
      <header className="flex items-center justify-between gap-8 px-6 lg:px-10 py-4 border-b border-white/[0.08] bg-[#0C0816]/90 backdrop-blur-xl">
        {/* Zone 1: Single text element wordmark */}
        <div className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          {currentClient.businessName} · AI Portal
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          {PORTAL_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                section === item.id
                  ? 'text-[#CCF655] border-[#CCF655] font-semibold'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => {
              setFeedbackSent(true);
              setTimeout(() => setFeedbackSent(false), 3000);
            }}
            className="px-4 py-2 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75] transition-colors whitespace-nowrap shrink-0"
          >
            {feedbackSent ? 'Concierge Notified ✓' : 'Request Agent Adjustment'}
          </button>
        </div>
      </header>

      {/* Mobile Nav Fallback */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto px-6 py-3 border-b border-white/[0.07] bg-[#0C0816]">
        {PORTAL_NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shrink-0 ${
              section === item.id
                ? 'bg-[#CCF655] text-[#08060D] font-semibold'
                : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Client Portal Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#19112E] via-[#130D21] to-[#110C1D] border border-white/[0.08] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-mono text-[#CCF655] uppercase tracking-wider mb-1">
              Powered by ROSE AI OS · Dedicated Client Environment
            </p>
            <h1 className="text-2xl font-semibold text-white">
              Welcome back, {currentClient.contactName}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              {currentClient.overviewNotes}
            </p>
          </div>
          <div className="text-left md:text-right shrink-0 font-mono">
            <div className="text-xs text-slate-400">Account Status</div>
            <div className="text-sm font-semibold text-[#CCF655] mt-0.5">
              {currentClient.status} · {assignedAgents.length} Active Agents
            </div>
          </div>
        </div>

        {/* SECTION 1: OVERVIEW */}
        {section === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-5">
                <div className="text-xs text-slate-400">Tasks Completed (30d)</div>
                <div className="text-3xl font-mono tabular-nums font-semibold text-white mt-2">
                  {currentClient.tasksCompleted30d.toLocaleString()}
                </div>
                <div className="text-xs text-[#CCF655] mt-2">
                  {currentClient.successRate}% resolution accuracy
                </div>
              </div>

              <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-5">
                <div className="text-xs text-slate-400">Qualified Leads & Bookings</div>
                <div className="text-3xl font-mono tabular-nums font-semibold text-[#CCF655] mt-2">
                  {currentClient.leadsGenerated30d}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Synced directly to your calendar
                </div>
              </div>

              <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-5">
                <div className="text-xs text-slate-400">Team Hours Saved</div>
                <div className="text-3xl font-mono tabular-nums font-semibold text-white mt-2">
                  {currentClient.hoursSaved30d} hrs
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  24/7 inbound & after-hours coverage
                </div>
              </div>

              <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-5">
                <div className="text-xs text-slate-400">Your Assigned AI Fleet</div>
                <div className="text-3xl font-mono tabular-nums font-semibold text-white mt-2">
                  {assignedAgents.length}
                </div>
                <div className="text-xs text-[#CCF655] mt-2">
                  All agents online & nominal
                </div>
              </div>
            </div>

            {/* Assigned Agents Quick View + Test Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white">
                    Your Deployed AI Agents ({assignedAgents.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSection('agents')}
                    className="text-xs text-[#CCF655] hover:underline"
                  >
                    View Full Details
                  </button>
                </div>

                <div className="space-y-3">
                  {assignedAgents.map((ag) => (
                    <div
                      key={ag.id}
                      className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06] flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{ag.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Persona: {ag.voicePersona} · {ag.category}
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums text-xs shrink-0">
                        <div className="text-[#CCF655] font-semibold">
                          {ag.successRate}% success
                        </div>
                        <div className="text-slate-400">{ag.avgLatencyMs}ms response</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Interactive Agent Test Box */}
              <div className="lg:col-span-5 rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white mb-1">
                    Test Your Assigned AI Agent
                  </h2>
                  <p className="text-xs text-slate-400 mb-4">
                    Send a sample customer inquiry to verify how your agent responds using{' '}
                    {currentClient.businessName}’s knowledge base.
                  </p>

                  <form onSubmit={handleQuickAgentTest} className="space-y-3">
                    <select
                      value={testAgentId || assignedAgents[0]?.id || ''}
                      onChange={(e) => setTestAgentId(e.target.value)}
                      className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white"
                    >
                      {assignedAgents.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.name} ({ag.voicePersona})
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        placeholder="Ask a customer question..."
                        className="flex-1 bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                  </form>

                  {testReply && (
                    <div className="mt-4 p-3.5 rounded-xl bg-[#19122C] border border-[#CCF655]/40 text-xs text-slate-100 leading-relaxed">
                      {testReply}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-white/[0.07] text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Tenant Data Isolation</span>
                  <span className="text-[#CCF655] font-mono">Verified Single-Tenant</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: MY ASSIGNED AGENTS */}
        {section === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assignedAgents.map((ag) => (
              <div
                key={ag.id}
                className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>{ag.category}</span>
                    <span className="text-[#CCF655] font-medium">Active on Account</span>
                  </div>
                  <h2 className="text-base font-semibold text-white">{ag.name}</h2>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {ag.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs space-y-1">
                    <div className="text-slate-300">
                      Voice / Persona: <strong>{ag.voicePersona}</strong>
                    </div>
                    <div className="text-slate-400 font-mono tabular-nums">
                      Success Rate: {ag.successRate}% · Turn Latency: {ag.avgLatencyMs}ms
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 3: CONVERSATIONS */}
        {section === 'conversations' && (
          <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">
              Recent Customer Conversations for {currentClient.businessName}
            </h2>
            {currentClient.conversations.length === 0 ? (
              <p className="text-xs text-slate-400 py-8">
                No conversations recorded in this window yet.
              </p>
            ) : (
              <div className="space-y-4">
                {currentClient.conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-5 rounded-xl bg-[#0B0813] border border-white/[0.07] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-white">
                        {conv.customerName} ({conv.customerContact})
                      </span>
                      <span className="text-[#CCF655] font-mono">
                        {conv.outcome} · {conv.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{conv.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: KNOWLEDGE BASE */}
        {section === 'knowledge' && (
          <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">
              Approved Knowledge Documents ({currentClient.knowledgeBase.length})
            </h2>
            <div className="divide-y divide-white/[0.06]">
              {currentClient.knowledgeBase.map((doc) => (
                <div
                  key={doc.id}
                  className="py-3.5 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#CCF655]" />
                    <div>
                      <div className="font-semibold text-white">{doc.title}</div>
                      <div className="text-slate-400 mt-0.5">
                        {doc.type} · {doc.sizeOrUrl}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[#CCF655]">
                    {doc.status} ({doc.chunks} chunks)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: ANALYTICS */}
        {section === 'analytics' && (
          <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">
              30-Day Executive ROI Summary for {currentClient.businessName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                <div className="text-xs text-slate-400">Qualified Leads Generated</div>
                <div className="text-2xl font-mono tabular-nums font-semibold text-[#CCF655] mt-1">
                  {currentClient.leadsGenerated30d}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                <div className="text-xs text-slate-400">Staff Hours Saved</div>
                <div className="text-2xl font-mono tabular-nums font-semibold text-white mt-1">
                  {currentClient.hoursSaved30d} hours
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B0813] border border-white/[0.06]">
                <div className="text-xs text-slate-400">Estimated Payroll Savings</div>
                <div className="text-2xl font-mono tabular-nums font-semibold text-[#CCF655] mt-1">
                  ${(currentClient.hoursSaved30d * 45).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: BILLING */}
        {section === 'billing' && (
          <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">
              Plan & Invoice History — {currentClient.businessName}
            </h2>
            <div className="divide-y divide-white/[0.06] text-xs">
              {currentClient.invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-mono font-semibold text-white">
                      {inv.invoiceNumber} · {inv.period}
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      Retainer: ${inv.retainerAmount.toLocaleString()} + AI Usage: $
                      {inv.aiUsageCost.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <div className="font-semibold text-white">
                      ${inv.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-[#CCF655] flex items-center gap-1 justify-end mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{inv.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
