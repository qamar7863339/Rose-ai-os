'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  Sliders,
  Search,
  ChevronRight,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  ClientRecord,
  AgentTemplate,
  AutomationWorkflow,
  SystemEvent,
  DASHBOARD_TIMEFRAMES,
  NavSection,
} from '@/lib/rose-data';

interface DashboardViewProps {
  clients: ClientRecord[];
  agents: AgentTemplate[];
  automations: AutomationWorkflow[];
  events: SystemEvent[];
  onNavigate: (section: NavSection) => void;
  onSelectClient: (clientId: string) => void;
  onConfigureAgent: (agent: AgentTemplate) => void;
}

export default function DashboardView({
  clients,
  agents,
  automations,
  events,
  onNavigate,
  onSelectClient,
  onConfigureAgent,
}: DashboardViewProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [eventFilter, setEventFilter] = useState<string>('ALL');
  const [eventSearch, setEventSearch] = useState<string>('');

  const tfData = DASHBOARD_TIMEFRAMES[timeframe];

  const activeAgentsCount = useMemo(
    () => clients.reduce((acc, c) => acc + c.assignedAgentIds.length, 0),
    [clients]
  );

  const runningAutomationsCount = useMemo(
    () => automations.filter((a) => a.status === 'Active').length,
    [automations]
  );

  const maxTaskValue = useMemo(
    () => Math.max(...tfData.dailySeries.map((d) => d.tasks), 1),
    [tfData]
  );

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesType = eventFilter === 'ALL' || evt.type === eventFilter;
      const matchesSearch =
        !eventSearch.trim() ||
        evt.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        evt.clientName.toLowerCase().includes(eventSearch.toLowerCase()) ||
        evt.agentOrWorkflow.toLowerCase().includes(eventSearch.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [events, eventFilter, eventSearch]);

  return (
    <div className="space-y-8">
      {/* Top Executive Header & Timeframe Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-[#CCF655] tracking-wider uppercase mb-1.5">
            Agency Command Center
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Fleet Telemetry & Revenue Operations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time performance across {clients.length} enterprise clients,{' '}
            {activeAgentsCount} deployed agent instances, and{' '}
            {runningAutomationsCount} active workflows.
          </p>
        </div>

        {/* Interactive Segmented Timeframe Control */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.09] self-start md:self-auto">
          {(['7d', '30d', '90d'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimeframe(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                timeframe === key
                  ? 'bg-gradient-to-r from-[#6D28D9] to-[#4C1D95] text-white border border-purple-300/35 shadow-[0_0_20px_rgba(124,58,237,0.35)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {DASHBOARD_TIMEFRAMES[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Required KPI Cards with Frosted Purple Glass & Subtle Neon-Lime Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Clients */}
        <div
          onClick={() => onNavigate('clients')}
          className="group cursor-pointer rounded-2xl bg-gradient-to-b from-purple-500/[0.09] via-[#150E26]/85 to-[#0D0919]/90 backdrop-blur-xl border border-purple-300/[0.13] hover:border-[#CCF655]/50 p-5 transition-all flex flex-col justify-between shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Total Clients</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#CCF655]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-semibold font-mono tabular-nums text-white">
              {clients.length}
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-[#CCF655] font-mono tabular-nums">$72.0k</span>
            <span>·</span>
            <span>Monthly Retainers</span>
          </div>
        </div>

        {/* 2. Active AI Agents */}
        <div
          onClick={() => onNavigate('agents')}
          className="group cursor-pointer rounded-2xl bg-gradient-to-b from-purple-500/[0.09] via-[#150E26]/85 to-[#0D0919]/90 backdrop-blur-xl border border-purple-300/[0.13] hover:border-[#CCF655]/50 p-5 transition-all flex flex-col justify-between shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Active AI Agents</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#CCF655]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-semibold font-mono tabular-nums text-white">
              {activeAgentsCount}
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-[#CCF655] font-mono tabular-nums">
              {agents.length} templates
            </span>
            <span>·</span>
            <span>Sub-450ms SLA</span>
          </div>
        </div>

        {/* 3. Running Automations */}
        <div
          onClick={() => onNavigate('automations')}
          className="group cursor-pointer rounded-2xl bg-gradient-to-b from-purple-500/[0.09] via-[#150E26]/85 to-[#0D0919]/90 backdrop-blur-xl border border-purple-300/[0.13] hover:border-[#CCF655]/50 p-5 transition-all flex flex-col justify-between shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Running Automations</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#CCF655]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-semibold font-mono tabular-nums text-white">
              {runningAutomationsCount}
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-slate-200 font-mono tabular-nums">
              {automations.length} total
            </span>
            <span>·</span>
            <span>Event & Webhook</span>
          </div>
        </div>

        {/* 4. Tasks Completed */}
        <div className="rounded-2xl bg-gradient-to-b from-purple-500/[0.09] via-[#150E26]/85 to-[#0D0919]/90 backdrop-blur-xl border border-purple-300/[0.13] p-5 flex flex-col justify-between shadow-lg">
          <div className="text-xs text-slate-300">Tasks Completed</div>
          <div className="my-3">
            <div className="text-3xl font-semibold font-mono tabular-nums text-[#CCF655]">
              {tfData.tasksCompleted}
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono tabular-nums">
            {tfData.tasksDelta}
          </div>
        </div>

        {/* 5. Agent Success Rate */}
        <div className="rounded-2xl bg-gradient-to-b from-purple-500/[0.09] via-[#150E26]/85 to-[#0D0919]/90 backdrop-blur-xl border border-purple-300/[0.13] p-5 flex flex-col justify-between shadow-lg">
          <div className="text-xs text-slate-300">Agent Success Rate</div>
          <div className="my-3">
            <div className="text-3xl font-semibold font-mono tabular-nums text-white">
              {tfData.successRate}
            </div>
          </div>
          <div className="text-xs text-[#CCF655] font-mono tabular-nums">
            {tfData.successDelta}
          </div>
        </div>

        {/* 6. AI Usage & Estimated Costs */}
        <div
          onClick={() => onNavigate('analytics')}
          className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#3B1770]/60 via-[#1B1133]/90 to-[#0F0A1D] border border-purple-300/30 hover:border-[#CCF655]/50 p-5 transition-all flex flex-col justify-between shadow-[0_8px_30px_rgba(91,33,182,0.2)]"
        >
          <div className="flex items-center justify-between text-xs text-purple-200">
            <span>AI Usage & Est. Cost</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-300 group-hover:text-[#CCF655]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-semibold font-mono tabular-nums text-white">
              {tfData.aiUsageCost}
            </div>
          </div>
          <div className="text-xs text-slate-300 flex items-center gap-1.5">
            <span>Billed:</span>
            <span className="text-[#CCF655] font-mono tabular-nums">
              {tfData.revenueBilled}
            </span>
          </div>
        </div>
      </div>

      {/* Usage Charts & Client Utilization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive AI Throughput & Cost Chart */}
        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-white/[0.04] to-[#0D0918]/90 backdrop-blur-xl border border-white/[0.08] p-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">
                Autonomous Task Execution & Voice Minute Volume
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Completed agent sessions, qualified leads, and telephony minutes ({tfData.label})
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#CCF655] inline-block" />
                Tasks Executed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-purple-400 inline-block" />
                Voice Minutes
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 items-end h-56 pt-6 pb-2 border-b border-white/[0.07]">
            {tfData.dailySeries.map((point) => {
              const heightPct = Math.max(
                18,
                Math.round((point.tasks / maxTaskValue) * 100)
              );
              const voicePct = Math.max(
                12,
                Math.round((point.voiceMins / (maxTaskValue * 0.35)) * 100)
              );
              return (
                <div
                  key={point.label}
                  className="flex flex-col items-center h-full justify-end group"
                >
                  <div className="text-[11px] font-mono tabular-nums text-slate-400 group-hover:text-[#CCF655] mb-2 transition-colors">
                    {point.tasks.toLocaleString()}
                  </div>
                  <div className="w-full max-w-[44px] flex items-end justify-center gap-1.5 h-40">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-1/2 rounded-t-md bg-gradient-to-t from-[#99C22B] to-[#CCF655] group-hover:brightness-110 transition-all"
                      title={`Tasks: ${point.tasks.toLocaleString()}`}
                    />
                    <div
                      style={{ height: `${Math.min(100, voicePct)}%` }}
                      className="w-1/2 rounded-t-md bg-gradient-to-t from-[#5B21B6] to-purple-400 group-hover:brightness-110 transition-all"
                      title={`Voice Mins: ${point.voiceMins.toLocaleString()}`}
                    />
                  </div>
                  <div className="mt-2.5 text-xs font-mono text-slate-300">
                    {point.label}
                  </div>
                  <div className="text-[10px] font-mono tabular-nums text-slate-500">
                    ${point.cost}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              Median Voice Turn Latency:{' '}
              <span className="font-mono tabular-nums text-white">390ms</span>
              <span className="mx-2">·</span>
              RAG Cache Hit Ratio:{' '}
              <span className="font-mono tabular-nums text-[#CCF655]">94.2%</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="text-xs font-medium text-[#CCF655] hover:underline flex items-center gap-1"
            >
              <span>Open Full Cost & Token Telemetry</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Client AI Usage & ROI Leaderboard */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-[#0D0918]/90 backdrop-blur-xl border border-white/[0.08] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Client Consumption & Hours Saved
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any client to inspect their profile & assigned fleet
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('clients')}
                className="text-xs font-medium text-[#CCF655] hover:underline whitespace-nowrap shrink-0"
              >
                All Clients
              </button>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {clients.slice(0, 5).map((client) => (
                <div
                  key={client.id}
                  onClick={() => onSelectClient(client.id)}
                  className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.03] px-2 -mx-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {client.businessName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{client.industry}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">
                        {client.assignedAgentIds.length} agents
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono tabular-nums text-[#CCF655] font-semibold">
                      {client.tasksCompleted30d.toLocaleString()} tasks
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-400">
                      {client.hoursSaved30d}h saved · ${client.aiSpendMonthly}/mo
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-xs text-slate-400">
            <span>Total Client Hours Saved (30d)</span>
            <span className="font-mono tabular-nums text-white font-semibold">
              2,397 hrs
            </span>
          </div>
        </div>
      </div>

      {/* Agent Status Cards Section */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              Active Agent Fleet Status
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Production agent templates, real-time success rates, and average latency
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('agents')}
            className="text-xs font-medium text-[#CCF655] hover:underline flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <span>Open Agent Library</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {agents.slice(0, 4).map((agent) => (
            <div
              key={agent.id}
              className="rounded-2xl bg-gradient-to-b from-purple-500/[0.08] via-[#150E26]/85 to-[#0D0919]/90 backdrop-blur-xl border border-purple-300/[0.12] hover:border-purple-400/40 p-5 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                  <span>{agent.category}</span>
                  <span>·</span>
                  <span className="text-[#CCF655] font-medium">{agent.status}</span>
                </div>
                <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/[0.07]">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-400">
                    Success:{' '}
                    <strong className="font-mono tabular-nums text-white">
                      {agent.successRate}%
                    </strong>
                  </span>
                  <span className="text-slate-400">
                    Latency:{' '}
                    <strong className="font-mono tabular-nums text-[#CCF655]">
                      {agent.avgLatencyMs}ms
                    </strong>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono tabular-nums text-slate-400">
                    {agent.assignedClientIds.length} clients assigned
                  </span>
                  <button
                    type="button"
                    onClick={() => onConfigureAgent(agent)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-purple-600/35 border border-white/[0.1] text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <Sliders className="w-3 h-3 text-[#CCF655]" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Agent Activity & System Events Table */}
      <div className="rounded-2xl bg-gradient-to-b from-white/[0.04] to-[#0D0918]/90 backdrop-blur-xl border border-white/[0.08] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">
              Recent Agent Activity & System Events
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live audit log across voice calls, CRM qualification webhooks, and RAG syncs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Events */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                placeholder="Filter activity..."
                className="bg-[#090612] border border-white/[0.08] rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#CCF655]/50"
              />
            </div>

            {/* Event Type Filter */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#090612] border border-white/[0.08]">
              {['ALL', 'Agent Execution', 'Automation Trigger', 'Knowledge Sync'].map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEventFilter(type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      eventFilter === type
                        ? 'bg-purple-600/35 text-[#CCF655]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {type === 'ALL' ? 'All Events' : type}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* High-Density Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] text-slate-400">
                <th className="py-2.5 px-3 font-medium">Event & Outcome</th>
                <th className="py-2.5 px-3 font-medium">Client Account</th>
                <th className="py-2.5 px-3 font-medium">Agent / Workflow</th>
                <th className="py-2.5 px-3 font-medium text-right">Telemetry</th>
                <th className="py-2.5 px-3 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs">
              {filteredEvents.map((evt) => (
                <tr
                  key={evt.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {evt.status === 'Completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#CCF655] shrink-0" />
                      ) : evt.status === 'Nominal' ? (
                        <Activity className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="font-medium text-slate-100">
                        {evt.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                    {evt.clientName}
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                    {evt.agentOrWorkflow}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-[#CCF655] whitespace-nowrap">
                    {evt.latencyOrMetric}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-400 whitespace-nowrap">
                    {evt.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
