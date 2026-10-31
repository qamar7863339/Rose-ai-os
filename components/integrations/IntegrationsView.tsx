'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Sliders,
  RefreshCw,
  CheckCircle2,
  X,
  ShieldAlert,
} from 'lucide-react';
import { IntegrationItem } from '@/lib/rose-data';

interface IntegrationsViewProps {
  integrations: IntegrationItem[];
  setIntegrations: React.Dispatch<React.SetStateAction<IntegrationItem[]>>;
}

export default function IntegrationsView({
  integrations,
  setIntegrations,
}: IntegrationsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('ALL');
  const [activeIntegration, setActiveIntegration] = useState<IntegrationItem | null>(
    null
  );
  const [pingResult, setPingResult] = useState<string | null>(null);

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((item) => {
      const matchesGroup =
        groupFilter === 'ALL' || item.providerGroup === groupFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.providerGroup.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
  }, [integrations, groupFilter, searchQuery]);

  const handleToggleConnectionState = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextState: IntegrationItem['connectionState'] =
          item.connectionState === 'Demo Connected'
            ? 'Available (Demo)'
            : 'Demo Connected';
        const updated = {
          ...item,
          connectionState: nextState,
          lastSync: nextState === 'Demo Connected' ? 'Just now (Demo)' : item.lastSync,
        };
        if (activeIntegration?.id === id) {
          setActiveIntegration(updated);
        }
        return updated;
      })
    );
  };

  const handleSimulatePing = (item: IntegrationItem) => {
    setPingResult(
      `Simulated Demo Webhook handshake succeeded for ${item.name} (200 OK · 48ms in sandbox).`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-[#CCF655] uppercase tracking-wider mb-1">
            Ecosystem Connectors · Phase 1 Prototype
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Integration Marketplace
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Connect Google Workspace, Gmail, Google Calendar, Google Drive, WhatsApp, CRM
            platforms, and low-latency telephony providers.
          </p>
        </div>

        {/* Explicit Transparent Demo Notice */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#19122C] border border-purple-400/30 text-xs text-slate-200">
          <ShieldAlert className="w-4 h-4 text-[#CCF655] shrink-0" />
          <span>
            Phase 1 Environment: All connectors below display simulated{' '}
            <strong className="text-[#CCF655]">Demo Connections</strong> with zero
            exposed credentials.
          </span>
        </div>
      </div>

      {/* Search & Provider Group Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#120D1F] border border-white/[0.08] rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Google, WhatsApp, HubSpot, Salesforce, Twilio..."
            className="w-full bg-[#090610] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#CCF655]/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#090610] border border-white/[0.08]">
          {[
            'ALL',
            'Google Ecosystem',
            'Messaging & Telephony',
            'CRM Platforms',
            'Billing & Ops',
          ].map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => setGroupFilter(grp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                groupFilter === grp
                  ? 'bg-[#1F1635] text-[#CCF655]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {grp === 'ALL' ? 'All Providers' : grp}
            </button>
          ))}
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredIntegrations.map((item) => {
          const isConnected = item.connectionState === 'Demo Connected';
          return (
            <div
              key={item.id}
              className="rounded-2xl bg-[#120D1F] border border-white/[0.08] hover:border-purple-400/40 p-6 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                  <span>{item.providerGroup}</span>
                  <span
                    className={`font-mono ${
                      isConnected ? 'text-[#CCF655]' : 'text-amber-300'
                    }`}
                  >
                    {item.connectionState}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-white">{item.name}</h2>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 pt-3.5 border-t border-white/[0.06] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Demo Identity</span>
                    <span className="font-mono text-slate-200 truncate max-w-[190px]">
                      {item.demoAccountLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Client Workspaces</span>
                    <span className="font-mono tabular-nums text-white">
                      {item.syncedClientsCount} mapped · {item.lastSync}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveIntegration(item);
                    setPingResult(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1D1432] hover:bg-[#271B42] border border-white/[0.08] text-xs font-medium text-white transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#CCF655]" />
                  <span>Inspect Demo Config</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleConnectionState(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isConnected
                      ? 'bg-white/[0.07] text-slate-200 hover:bg-white/[0.14]'
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

      {/* INTEGRATION CONFIGURATION MODAL */}
      {activeIntegration && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#130D22] border border-white/[0.12] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="text-xs font-mono text-[#CCF655]">
                  {activeIntegration.providerGroup} · {activeIntegration.connectionState}
                </div>
                <h2 className="text-lg font-semibold text-white mt-0.5">
                  {activeIntegration.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveIntegration(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#090610] border border-white/[0.07]">
                <div className="text-slate-400 mb-1">Sandbox Account Identifier</div>
                <div className="font-mono text-white">
                  {activeIntegration.demoAccountLabel}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090610] border border-white/[0.07]">
                <div className="text-slate-400 mb-1">Simulated Webhook Endpoint</div>
                <div className="font-mono text-[#CCF655] break-all">
                  {activeIntegration.webhookEndpoint}
                </div>
              </div>

              <div>
                <div className="text-slate-300 font-medium mb-2">
                  Configured Demo OAuth / API Scopes
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeIntegration.scopes.map((sc) => (
                    <span
                      key={sc}
                      className="px-2.5 py-1 rounded-md bg-[#1C1430] border border-white/[0.08] font-mono text-[11px] text-slate-200"
                    >
                      {sc}
                    </span>
                  ))}
                </div>
              </div>

              {pingResult && (
                <div className="p-3 rounded-xl bg-[#CCF655]/15 border border-[#CCF655]/40 text-[#CCF655] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{pingResult}</span>
                </div>
              )}

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleSimulatePing(activeIntegration)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D1432] hover:bg-[#281C44] text-white font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#CCF655]" />
                  <span>Test Demo Handshake</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveIntegration(null)}
                  className="px-5 py-2 rounded-xl bg-[#CCF655] text-[#08060D] font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
