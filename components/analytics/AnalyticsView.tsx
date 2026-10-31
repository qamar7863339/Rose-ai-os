'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { ClientRecord, AgentTemplate } from '@/lib/rose-data';

interface AnalyticsViewProps {
  clients: ClientRecord[];
  agents: AgentTemplate[];
}

export default function AnalyticsView({ clients, agents }: AnalyticsViewProps) {
  const [period, setPeriod] = useState<'30d' | '90d' | 'YTD'>('30d');
  const [exportedNotice, setExportedNotice] = useState(false);

  const multiplier = period === '30d' ? 1 : period === '90d' ? 2.85 : 8.4;

  const totalRetainerRevenue = Math.round(
    clients.reduce((sum, c) => sum + c.monthlyRetainer, 0) * multiplier
  );
  const totalAiSpend = Math.round(
    clients.reduce((sum, c) => sum + c.aiSpendMonthly, 0) * multiplier
  );
  const totalHoursSaved = Math.round(
    clients.reduce((sum, c) => sum + c.hoursSaved30d, 0) * multiplier
  );
  const totalLeads = Math.round(
    clients.reduce((sum, c) => sum + c.leadsGenerated30d, 0) * multiplier
  );

  const handleDownloadCsv = () => {
    const headers = [
      'Client Name',
      'Industry',
      'Status',
      'Retainer ($)',
      'AI Spend ($)',
      'Tasks Completed',
      'Success Rate (%)',
      'Hours Saved',
      'Leads Generated',
    ];
    const rows = clients.map((c) => [
      `"${c.businessName}"`,
      `"${c.industry}"`,
      c.status,
      Math.round(c.monthlyRetainer * multiplier),
      Math.round(c.aiSpendMonthly * multiplier),
      Math.round(c.tasksCompleted30d * multiplier),
      c.successRate,
      Math.round(c.hoursSaved30d * multiplier),
      Math.round(c.leadsGenerated30d * multiplier),
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ROSE_AI_OS_Analytics_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedNotice(true);
    setTimeout(() => setExportedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-[#CCF655] uppercase tracking-wider mb-1">
            Executive Telemetry & Economics
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Agency & Fleet Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Cross-client token consumption, voice latency percentiles, margin economics,
            and ROI attribution.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#120D1F] border border-white/[0.08]">
            {(['30d', '90d', 'YTD'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  period === p
                    ? 'bg-[#CCF655] text-[#08060D] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'Year-to-Date'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D1432] hover:bg-[#281C44] border border-white/[0.1] text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-[#CCF655]" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {exportedNotice && (
        <div className="p-3 rounded-xl bg-[#CCF655]/15 border border-[#CCF655]/40 text-xs text-[#CCF655] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Exported ROSE_AI_OS_Analytics_{period}.csv with full client telemetry.</span>
        </div>
      )}

      {/* Top Financial & Operational Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-5">
          <div className="text-xs text-slate-400">Agency Retainer Revenue ({period})</div>
          <div className="text-3xl font-mono tabular-nums font-semibold text-white mt-2">
            ${totalRetainerRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-[#CCF655] mt-2 font-mono">
            87.0% Gross Compute Margin
          </div>
        </div>

        <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-5">
          <div className="text-xs text-slate-400">Total AI Compute & Voice Cost</div>
          <div className="text-3xl font-mono tabular-nums font-semibold text-white mt-2">
            ${totalAiSpend.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            100% rebilled to client invoices
          </div>
        </div>

        <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-5">
          <div className="text-xs text-slate-400">Client Labor Hours Saved</div>
          <div className="text-3xl font-mono tabular-nums font-semibold text-[#CCF655] mt-2">
            {totalHoursSaved.toLocaleString()} hrs
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">
            ~${(totalHoursSaved * 45).toLocaleString()} payroll equivalent
          </div>
        </div>

        <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-5">
          <div className="text-xs text-slate-400">Qualified Opportunities Created</div>
          <div className="text-3xl font-mono tabular-nums font-semibold text-white mt-2">
            {totalLeads.toLocaleString()}
          </div>
          <div className="text-xs text-[#CCF655] mt-2 font-mono">
            9.4s median speed-to-lead
          </div>
        </div>
      </div>

      {/* Client Economics & Agent Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6">
          <h2 className="text-base font-semibold text-white mb-4">
            Client Unit Economics & Utilization Matrix ({period})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400">
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3 text-right">Retainer</th>
                  <th className="py-2.5 px-3 text-right">AI Compute</th>
                  <th className="py-2.5 px-3 text-right">Tasks</th>
                  <th className="py-2.5 px-3 text-right">Success</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-medium text-white">
                      {c.businessName}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-200">
                      ${Math.round(c.monthlyRetainer * multiplier).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-400">
                      ${Math.round(c.aiSpendMonthly * multiplier).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-white">
                      {Math.round(c.tasksCompleted30d * multiplier).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#CCF655]">
                      {c.successRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6">
          <h2 className="text-base font-semibold text-white mb-4">
            Agent Template Throughput & Latency Benchmarks
          </h2>
          <div className="space-y-3.5">
            {agents.map((ag) => (
              <div
                key={ag.id}
                className="p-3.5 rounded-xl bg-[#0B0813] border border-white/[0.06] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{ag.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {ag.defaultModel}
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums text-xs">
                  <div className="text-[#CCF655] font-semibold">
                    {Math.round(ag.totalExecutions * multiplier).toLocaleString()} runs
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {ag.avgLatencyMs}ms · {ag.successRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
