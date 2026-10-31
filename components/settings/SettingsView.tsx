'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function SettingsView() {
  const [agencyName, setAgencyName] = useState('ROSE AI Agency');
  const [supportDomain, setSupportDomain] = useState('ops@rose-ai-agency.example.com');
  const [defaultModel, setDefaultModel] = useState('ROSE-4 Omni');
  const [piiRedaction, setPiiRedaction] = useState(true);
  const [autoEscalation, setAutoEscalation] = useState(true);
  const [whiteLabelPortal, setWhiteLabelPortal] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-mono text-[#CCF655] uppercase tracking-wider mb-1">
          System Configuration & Governance
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          ROSE AI OS Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure global agency branding, default model routing, safety guardrails, and
          Client Portal white-label options.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-[#CCF655]/15 border border-[#CCF655]/40 text-xs text-[#CCF655] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Agency OS preferences saved and applied across all workspaces.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">
            Agency Identity & White-Label Portal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">
                Agency Organization Name
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">
                Operations Escalation Email
              </label>
              <input
                type="email"
                value={supportDomain}
                onChange={(e) => setSupportDomain(e.target.value)}
                className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs text-slate-300 mb-1.5">
              Default Workspace Model Engine
            </label>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full sm:w-80 bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
            >
              <option value="ROSE-4 Omni">ROSE-4 Omni</option>
              <option value="Gemini 3.8 Flash">Gemini 3.8 Flash</option>
              <option value="ROSE Reasoning Pro">ROSE Reasoning Pro</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">
            Global Fleet Guardrails & Security Policies
          </h2>

          <div className="divide-y divide-white/[0.06] text-xs">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white">
                  Automatic PII & HIPAA Transcript Redaction
                </div>
                <div className="text-slate-400 mt-0.5">
                  Mask SSNs, payment card numbers, and protected health identifiers before
                  storing call logs.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPiiRedaction((v) => !v)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  piiRedaction
                    ? 'bg-[#CCF655] text-[#08060D]'
                    : 'bg-white/[0.08] text-slate-400'
                }`}
              >
                {piiRedaction ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white">
                  Sentiment-Triggered Human Warm Transfer
                </div>
                <div className="text-slate-400 mt-0.5">
                  Immediately alert client Slack channel and transfer calls when caller
                  frustration is detected.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoEscalation((v) => !v)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  autoEscalation
                    ? 'bg-[#CCF655] text-[#08060D]'
                    : 'bg-white/[0.08] text-slate-400'
                }`}
              >
                {autoEscalation ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white">
                  Strict Single-Tenant Client Portal Isolation
                </div>
                <div className="text-slate-400 mt-0.5">
                  Enforce tenant-level row isolation so client portal users only see their
                  own business data and assigned agents.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhiteLabelPortal((v) => !v)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  whiteLabelPortal
                    ? 'bg-[#CCF655] text-[#08060D]'
                    : 'bg-white/[0.08] text-slate-400'
                }`}
              >
                {whiteLabelPortal ? 'Enforced' : 'Standard'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75]"
          >
            Save OS Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
