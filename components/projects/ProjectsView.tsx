'use client';

import React, { useState } from 'react';
import { Plus, CheckSquare, Square, X } from 'lucide-react';
import { AgencyProject, ClientRecord } from '@/lib/rose-data';

interface ProjectsViewProps {
  projects: AgencyProject[];
  setProjects: React.Dispatch<React.SetStateAction<AgencyProject[]>>;
  clients: ClientRecord[];
}

export default function ProjectsView({
  projects,
  setProjects,
  clients,
}: ProjectsViewProps) {
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClientId, setNewClientId] = useState(clients[0]?.id || 'client-vanguard');
  const [newLead, setNewLead] = useState('Elena Vance');
  const [newDueDate, setNewDueDate] = useState('Dec 05, 2026');

  const filteredProjects = projects.filter(
    (p) => stageFilter === 'ALL' || p.stage === stageFilter
  );

  const handleToggleTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedTasks = proj.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const nextProgress = Math.round(
          (completedCount / Math.max(1, updatedTasks.length)) * 100
        );
        return {
          ...proj,
          tasks: updatedTasks,
          progress: nextProgress,
        };
      })
    );
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const cl = clients.find((c) => c.id === newClientId) || clients[0];
    const created: AgencyProject = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      clientId: cl.id,
      clientName: cl.businessName,
      stage: 'Discovery & Architecture',
      progress: 25,
      leadEngineer: newLead,
      dueDate: newDueDate,
      priority: 'High',
      tasks: [
        { id: `t-${Date.now()}-1`, title: 'Ingest client SOPs & historical transcripts', completed: true },
        { id: `t-${Date.now()}-2`, title: 'Configure system prompt & safety guardrails', completed: false },
        { id: `t-${Date.now()}-3`, title: 'Connect CRM & Calendar sandbox webhooks', completed: false },
        { id: `t-${Date.now()}-4`, title: 'Executive sign-off & production cutover', completed: false },
      ],
    };
    setProjects((prev) => [created, ...prev]);
    setIsNewOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-[#CCF655] uppercase tracking-wider mb-1">
            Implementation & Delivery Tracker
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Client AI Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track agent engineering milestones, RAG indexing checklists, and production
            rollouts across clients.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold hover:bg-[#d8fa75] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stage Filter */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-2xl bg-[#120D1F] border border-white/[0.08] w-fit">
        {[
          'ALL',
          'Discovery & Architecture',
          'Agent Training',
          'Staging & QA',
          'Live Production',
        ].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStageFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              stageFilter === st
                ? 'bg-[#1F1635] text-[#CCF655]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {st === 'ALL' ? 'All Delivery Stages' : st}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl bg-[#120D1F] border border-white/[0.08] p-6 flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                <span>
                  {proj.clientName} · <strong className="text-[#CCF655]">{proj.stage}</strong>
                </span>
                <span className="font-mono tabular-nums">Due {proj.dueDate}</span>
              </div>

              <h2 className="text-base font-semibold text-white">{proj.title}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Lead AI Engineer: <span className="text-slate-200">{proj.leadEngineer}</span> ·
                Priority: <span className="text-slate-200">{proj.priority}</span>
              </p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Deployment Completion</span>
                  <span className="font-mono tabular-nums text-[#CCF655] font-semibold">
                    {proj.progress}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#090610] overflow-hidden">
                  <div
                    style={{ width: `${proj.progress}%` }}
                    className="h-full bg-[#CCF655] transition-all"
                  />
                </div>
              </div>

              {/* Interactive Checklist */}
              <div className="mt-5 pt-4 border-t border-white/[0.07] space-y-2">
                <div className="text-xs font-medium text-slate-300 mb-2">
                  Engineering Milestones (Click to toggle completion)
                </div>
                {proj.tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleToggleTask(proj.id, task.id)}
                    className="w-full text-left flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.03] text-xs transition-colors"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#CCF655] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span
                      className={
                        task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }
                    >
                      {task.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isNewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#130D22] border border-white/[0.12] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-white">
                Launch New Client Delivery Project
              </h2>
              <button
                type="button"
                onClick={() => setIsNewOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  Project Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Outbound Renewal Voice Fleet & HubSpot Sync"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Lead Engineer
                  </label>
                  <input
                    type="text"
                    value={newLead}
                    onChange={(e) => setNewLead(e.target.value)}
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5">
                    Target Go-Live Date
                  </label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[#090610] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#CCF655] text-[#08060D] text-xs font-semibold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
