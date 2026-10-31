export type NavSection =
  | 'workspace'
  | 'dashboard'
  | 'clients'
  | 'agents'
  | 'automations'
  | 'integrations'
  | 'analytics'
  | 'projects'
  | 'settings';

export type PortalSection =
  | 'overview'
  | 'agents'
  | 'conversations'
  | 'knowledge'
  | 'analytics'
  | 'billing';

export interface KnowledgeDoc {
  id: string;
  title: string;
  type: 'PDF' | 'URL' | 'Markdown' | 'CSV';
  sizeOrUrl: string;
  updatedAt: string;
  status: 'Indexed' | 'Syncing';
  chunks: number;
}

export interface ClientConversation {
  id: string;
  customerName: string;
  customerContact: string;
  agentName: string;
  channel: 'Voice Call' | 'WhatsApp' | 'Web Chat' | 'Email';
  durationOrLength: string;
  timestamp: string;
  outcome: 'Qualified & Booked' | 'Resolved' | 'Escalated to Human' | 'Follow-up Scheduled';
  sentiment: 'Positive' | 'Neutral' | 'Urgent';
  summary: string;
  transcript: { speaker: 'Agent' | 'Customer'; text: string; time: string }[];
}

export interface ClientTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  portalAccess: 'Admin' | 'Viewer' | 'Billing Only';
  lastActive: string;
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  period: string;
  retainerAmount: number;
  aiUsageCost: number;
  totalAmount: number;
  status: 'Paid' | 'Scheduled' | 'Processing';
  issuedDate: string;
}

export interface ClientRecord {
  id: string;
  businessName: string;
  industry: string;
  website: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  status: 'Active' | 'Onboarding' | 'Pilot';
  monthlyRetainer: number;
  aiSpendMonthly: number;
  assignedAgentIds: string[];
  connectedIntegrationIds: string[];
  tasksCompleted30d: number;
  successRate: number;
  hoursSaved30d: number;
  leadsGenerated30d: number;
  overviewNotes: string;
  knowledgeBase: KnowledgeDoc[];
  conversations: ClientConversation[];
  team: ClientTeamMember[];
  invoices: ClientInvoice[];
}

export interface AgentTemplate {
  id: string;
  name: string;
  category: 'Voice & Inbound' | 'Revenue & Sales' | 'Customer Experience' | 'Growth & Marketing';
  status: 'Production Ready' | 'Active Fleet' | 'Beta';
  description: string;
  defaultModel: string;
  voicePersona: string;
  avgLatencyMs: number;
  successRate: number;
  totalExecutions: number;
  systemPrompt: string;
  guardrails: string[];
  capabilities: string[];
  assignedClientIds: string[];
}

export interface AutomationStep {
  id: string;
  title: string;
  type: 'Trigger' | 'AI Agent' | 'Condition' | 'Integration Action';
  provider: string;
  detail: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: 'Active' | 'Paused' | 'Draft';
  triggerDescription: string;
  scheduleOrEvent: string;
  executions30d: number;
  successRate: number;
  avgDurationSec: number;
  lastRun: string;
  steps: AutomationStep[];
}

export interface IntegrationItem {
  id: string;
  name: string;
  providerGroup: 'Google Ecosystem' | 'Messaging & Telephony' | 'CRM Platforms' | 'Billing & Ops';
  description: string;
  connectionState: 'Demo Connected' | 'Available (Demo)' | 'Sandbox Mode';
  demoAccountLabel: string;
  scopes: string[];
  webhookEndpoint: string;
  syncedClientsCount: number;
  lastSync: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  attachments?: ChatAttachment[];
}

export interface WorkspaceConversation {
  id: string;
  title: string;
  updatedAt: string;
  pinned?: boolean;
  model: string;
  clientContext?: string;
  messages: ChatMessage[];
}

export interface AgencyProject {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  stage: 'Discovery & Architecture' | 'Agent Training' | 'Staging & QA' | 'Live Production';
  progress: number;
  leadEngineer: string;
  dueDate: string;
  priority: 'High' | 'Standard' | 'Critical';
  tasks: { id: string; title: string; completed: boolean }[];
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  type: 'Agent Execution' | 'Automation Trigger' | 'Knowledge Sync' | 'Billing Event';
  title: string;
  clientName: string;
  agentOrWorkflow: string;
  status: 'Completed' | 'Nominal' | 'Attention';
  latencyOrMetric: string;
}

export const INITIAL_AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'agent-receptionist',
    name: 'AI Receptionist',
    category: 'Voice & Inbound',
    status: 'Active Fleet',
    description:
      'Front-desk omnichannel receptionist that answers inbound inquiries, routes urgent calls, verifies caller identity, and logs structured intake notes.',
    defaultModel: 'ROSE-4 Omni + Gemini 3.8 Live',
    voicePersona: 'Clara — Warm Executive British',
    avgLatencyMs: 410,
    successRate: 99.1,
    totalExecutions: 18420,
    systemPrompt:
      'You are the Executive AI Receptionist for our client organization. Greet callers warmly, identify their intent within two exchanges, answer FAQ questions strictly from the verified Knowledge Base, and route urgent or VIP requests directly to the appropriate department calendar.',
    guardrails: [
      'Never quote custom enterprise pricing without verifying CRM tier',
      'Escalate medical or legal emergencies immediately to human on-call line',
      'Confirm phone number and email spelling before finalizing intake',
    ],
    capabilities: ['Inbound Call Routing', 'FAQ Resolution', 'VIP Caller Recognition', 'CRM Contact Creation'],
    assignedClientIds: ['client-vanguard', 'client-aether', 'client-lumina'],
  },
  {
    id: 'agent-voice',
    name: 'AI Voice Agent',
    category: 'Voice & Inbound',
    status: 'Active Fleet',
    description:
      'Low-latency conversational telephony agent capable of natural turn-taking, interruption handling, outbound confirmation calls, and live calendar booking.',
    defaultModel: 'Gemini 3.8 Live Audio',
    voicePersona: 'Julian — Calm Consultative US',
    avgLatencyMs: 380,
    successRate: 97.8,
    totalExecutions: 24910,
    systemPrompt:
      'Operate as a natural-sounding voice specialist. Keep spoken responses concise (1 to 2 sentences per turn), acknowledge caller interruptions gracefully, and guide the conversation toward resolution or scheduled consultation.',
    guardrails: [
      'Disclose AI assistant identity clearly at the start of recorded calls',
      'Respect Do-Not-Call requests immediately and tag contact in CRM',
      'Maximum call duration threshold of 12 minutes before human warm transfer',
    ],
    capabilities: ['Sub-400ms Voice Turn-Taking', 'Live Warm Transfer', 'SMS Summary Dispatch', 'Multilingual Switching'],
    assignedClientIds: ['client-vanguard', 'client-aether', 'client-novascale', 'client-lumina'],
  },
  {
    id: 'agent-sales',
    name: 'AI Sales Agent',
    category: 'Revenue & Sales',
    status: 'Active Fleet',
    description:
      'Consultative outbound and inbound revenue agent that handles product discovery, overcomes pricing objections using battlecards, and generates tailored proposals.',
    defaultModel: 'ROSE-4 Omni',
    voicePersona: 'Elena — High-Trust Enterprise',
    avgLatencyMs: 620,
    successRate: 95.4,
    totalExecutions: 12380,
    systemPrompt:
      'You are a consultative Senior Account Executive assistant. Uncover the prospect’s core business bottleneck, quantify the cost of inaction, map their requirements to our client’s solution tiers, and secure commitment for a technical walkthrough.',
    guardrails: [
      'Do not offer discounts exceeding 10% without Deal Desk approval workflow',
      'Cite only verified case study metrics from the client Knowledge Base',
      'Log all competitor mentions in HubSpot / Salesforce deal notes',
    ],
    capabilities: ['Objection Battlecards', 'ROI Calculator Generation', 'CRM Deal Stage Progression', 'Proposal Drafting'],
    assignedClientIds: ['client-vanguard', 'client-novascale', 'client-veritas'],
  },
  {
    id: 'agent-lead-qual',
    name: 'AI Lead Qualification Agent',
    category: 'Revenue & Sales',
    status: 'Production Ready',
    description:
      'Instant speed-to-lead qualification engine that engages web form, WhatsApp, and ad leads within 15 seconds using BANT and MEDDIC scoring frameworks.',
    defaultModel: 'Gemini 3.8 Flash',
    voicePersona: 'Marcus — Crisp Direct Analyst',
    avgLatencyMs: 340,
    successRate: 98.6,
    totalExecutions: 31540,
    systemPrompt:
      'Engage inbound leads within seconds of submission. Ask natural, conversational questions to determine Budget, Authority, Need, and Timeline (BANT). Score leads from 0 to 100 and route scores above 75 directly to senior closers.',
    guardrails: [
      'Never ask more than one qualification question per message turn',
      'Politely disqualify leads outside target geography and share self-serve resources',
      'Sync structured BANT JSON payload to CRM before closing session',
    ],
    capabilities: ['15-Second Speed-to-Lead', 'BANT / MEDDIC Scoring', 'CRM Enrichment', 'Instant Routing'],
    assignedClientIds: ['client-vanguard', 'client-novascale', 'client-solaris'],
  },
  {
    id: 'agent-appointment',
    name: 'AI Appointment Setter',
    category: 'Revenue & Sales',
    status: 'Active Fleet',
    description:
      'Dedicated scheduling coordinator that negotiates time zones, checks multi-rep Google Calendar availability, books slots, and sends reminders.',
    defaultModel: 'Gemini 3.8 Flash',
    voicePersona: 'Aria — Friendly Coordinator',
    avgLatencyMs: 390,
    successRate: 99.4,
    totalExecutions: 28750,
    systemPrompt:
      'Coordinate meeting times effortlessly across time zones. Offer two concrete time slots based on real-time calendar availability, confirm attendee emails, dispatch calendar invitations, and handle rescheduling requests with zero friction.',
    guardrails: [
      'Always verify prospect time zone explicitly before locking calendar slot',
      'Enforce minimum 2-hour buffer before same-day executive meetings',
      'Trigger 24-hour and 1-hour WhatsApp/SMS confirmation sequence',
    ],
    capabilities: ['Multi-Calendar Round Robin', 'Time-Zone Normalization', 'No-Show Recovery', 'Google Meet Provisioning'],
    assignedClientIds: ['client-vanguard', 'client-aether', 'client-veritas'],
  },
  {
    id: 'agent-support',
    name: 'AI Customer Support Agent',
    category: 'Customer Experience',
    status: 'Active Fleet',
    description:
      'Tier-1 and Tier-2 technical & account support specialist grounded in client documentation, order systems, and troubleshooting workflows.',
    defaultModel: 'ROSE-4 Omni',
    voicePersona: 'Sora — Empathetic Support Lead',
    avgLatencyMs: 480,
    successRate: 96.9,
    totalExecutions: 42190,
    systemPrompt:
      'Resolve customer support inquiries accurately using indexed SOPs and knowledge documents. Verify account status, walk users through step-by-step troubleshooting, and escalate complex bugs with full reproduction context.',
    guardrails: [
      'Never fabricate product features or undocumented workarounds',
      'Require OTP verification before disclosing billing or order shipping addresses',
      'Auto-escalate if customer sentiment score drops below threshold',
    ],
    capabilities: ['RAG Knowledge Grounding', 'Order & Ticket Lookup', 'Sentiment Escalation', 'Multichannel Threading'],
    assignedClientIds: ['client-aether', 'client-novascale', 'client-lumina', 'client-solaris'],
  },
  {
    id: 'agent-followup',
    name: 'AI Follow-up Agent',
    category: 'Customer Experience',
    status: 'Production Ready',
    description:
      'Persistent, context-aware re-engagement agent that revives stalled pipeline deals, follows up post-consultation, and collects NPS feedback.',
    defaultModel: 'Gemini 3.8 Flash',
    voicePersona: 'Noah — Thoughtful Relationship Manager',
    avgLatencyMs: 420,
    successRate: 94.7,
    totalExecutions: 15890,
    systemPrompt:
      'Craft personalized, high-context follow-up messages referencing the prospect’s last conversation transcript. Add value in each touchpoint rather than sending generic check-ins, and pause immediately once the contact replies.',
    guardrails: [
      'Maximum 4 follow-up touchpoints over a 21-day window',
      'Suppress outreach during weekends and public holidays in recipient locale',
      'Halt sequence immediately upon any inbound reply or calendar booking',
    ],
    capabilities: ['Transcript-Aware Nurture', 'Stalled Deal Reactivation', 'Post-Visit Check-in', 'Review & NPS Collection'],
    assignedClientIds: ['client-aether', 'client-lumina', 'client-veritas', 'client-solaris'],
  },
  {
    id: 'agent-marketing',
    name: 'AI Marketing Agent',
    category: 'Growth & Marketing',
    status: 'Production Ready',
    description:
      'Brand-aligned content strategist and campaign engine that drafts omnichannel ad copy, repurposes call insights into social assets, and analyzes campaign ROI.',
    defaultModel: 'ROSE Reasoning Pro',
    voicePersona: 'Lyra — Editorial Strategist',
    avgLatencyMs: 710,
    successRate: 96.2,
    totalExecutions: 9640,
    systemPrompt:
      'Synthesize winning customer language from live sales transcripts into high-converting ad creative, email sequences, and landing page copy. Maintain strict adherence to each client’s brand voice and compliance rules.',
    guardrails: [
      'Enforce brand vocabulary bans and regulatory disclaimers per industry',
      'Validate all comparative claims against approved proof points',
      'Output structured campaign variants for A/B testing',
    ],
    capabilities: ['Voice-of-Customer Mining', 'Ad Variation Synthesis', 'Newsletter Drafting', 'Attribution Briefings'],
    assignedClientIds: ['client-novascale', 'client-solaris'],
  },
];

export const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: 'client-vanguard',
    businessName: 'Vanguard Luxury Realty',
    industry: 'Luxury Real Estate',
    website: 'https://vanguardestates.example.com',
    contactName: 'Victoria Sterling',
    contactRole: 'Managing Partner',
    contactEmail: 'v.sterling@vanguardestates.example.com',
    contactPhone: '+1 (305) 890-4412',
    status: 'Active',
    monthlyRetainer: 12500,
    aiSpendMonthly: 1840,
    assignedAgentIds: ['agent-receptionist', 'agent-voice', 'agent-sales', 'agent-lead-qual', 'agent-appointment'],
    connectedIntegrationIds: ['int-google-cal', 'int-whatsapp', 'int-hubspot', 'int-twilio'],
    tasksCompleted30d: 14820,
    successRate: 98.7,
    hoursSaved30d: 412,
    leadsGenerated30d: 318,
    overviewNotes:
      'Deployed 24/7 multilingual inbound concierge and instant WhatsApp buyer qualification across 18 luxury waterfront developments in Miami and Aspen.',
    knowledgeBase: [
      {
        id: 'kb-v1',
        title: '2026 Waterfront Penthouse Inventory & Pricing Sheet.pdf',
        type: 'PDF',
        sizeOrUrl: '14.2 MB',
        updatedAt: '2 hours ago',
        status: 'Indexed',
        chunks: 412,
      },
      {
        id: 'kb-v2',
        title: 'International Buyer Escrow & Financing FAQ.md',
        type: 'Markdown',
        sizeOrUrl: '380 KB',
        updatedAt: 'Yesterday',
        status: 'Indexed',
        chunks: 86,
      },
      {
        id: 'kb-v3',
        title: 'Private Viewing & Helicopter Tour Booking Protocol.pdf',
        type: 'PDF',
        sizeOrUrl: '2.8 MB',
        updatedAt: '4 days ago',
        status: 'Indexed',
        chunks: 94,
      },
    ],
    conversations: [
      {
        id: 'conv-v1',
        customerName: 'Alexander Vance',
        customerContact: '+1 (212) 644-0921',
        agentName: 'AI Voice Agent',
        channel: 'Voice Call',
        durationOrLength: '3m 42s',
        timestamp: '14 mins ago',
        outcome: 'Qualified & Booked',
        sentiment: 'Positive',
        summary:
          'Cash buyer inquiring about 4-bedroom penthouse availability at Aurelia Tower. Verified $8.5M–$11M budget and scheduled private viewing for Thursday at 2:00 PM EST.',
        transcript: [
          {
            speaker: 'Agent',
            time: '00:02',
            text: 'Good afternoon, thank you for calling Vanguard Luxury Realty. This is Julian, Vanguard’s AI concierge. How may I assist you with our portfolio today?',
          },
          {
            speaker: 'Customer',
            time: '00:11',
            text: 'Hi, I saw the Aurelia South Beach penthouse listing. Is Residence 42A still available for private showing this week?',
          },
          {
            speaker: 'Agent',
            time: '00:19',
            text: 'Residence 42A is currently available and listed at $9.4M with private elevator and marina slip. Are you looking at a primary residence or investment timeline?',
          },
          {
            speaker: 'Customer',
            time: '00:31',
            text: 'Secondary residence, cash acquisition. I am flying into Miami Wednesday evening and only have Thursday afternoon open.',
          },
          {
            speaker: 'Agent',
            time: '00:40',
            text: 'Managing Partner Victoria Sterling has Thursday at 2:00 PM EST open for a private tour of Residence 42A. Shall I lock that in and send the gate pass to your mobile?',
          },
        ],
      },
      {
        id: 'conv-v2',
        customerName: 'Sofia Mendoza',
        customerContact: 'WhatsApp · +52 55 4190 8821',
        agentName: 'AI Lead Qualification Agent',
        channel: 'WhatsApp',
        durationOrLength: '6 messages',
        timestamp: '1 hour ago',
        outcome: 'Qualified & Booked',
        sentiment: 'Positive',
        summary:
          'Pre-construction investor from Mexico City requesting floorplans and payment schedule for Brickell Sky Villas. Qualified at $3.2M budget.',
        transcript: [
          {
            speaker: 'Customer',
            time: '10:14',
            text: 'Hello, can you send the deposit structure for Brickell Sky Villas 3BR units?',
          },
          {
            speaker: 'Agent',
            time: '10:14',
            text: 'Certainly, Sofia! The 3-bedroom residences start at $2.9M with a staged 20% contract / 20% groundbreaking / 60% closing schedule. Are you exploring for personal use or portfolio yield?',
          },
          {
            speaker: 'Customer',
            time: '10:16',
            text: 'Portfolio yield. I would like to review the projected rental cap rates with an advisor.',
          },
          {
            speaker: 'Agent',
            time: '10:16',
            text: 'I have attached the 2026 Yield Memorandum PDF and reserved a 20-minute Zoom briefing with our Senior Investment Director tomorrow at 11:00 AM CST.',
          },
        ],
      },
    ],
    team: [
      {
        id: 'tm-v1',
        name: 'Victoria Sterling',
        role: 'Managing Partner',
        email: 'v.sterling@vanguardestates.example.com',
        portalAccess: 'Admin',
        lastActive: 'Online now',
      },
      {
        id: 'tm-v2',
        name: 'Damon Ross',
        role: 'Head of Acquisitions',
        email: 'd.ross@vanguardestates.example.com',
        portalAccess: 'Viewer',
        lastActive: '3 hours ago',
      },
    ],
    invoices: [
      {
        id: 'inv-v1',
        invoiceNumber: 'ROSE-2026-1042',
        period: 'October 2026',
        retainerAmount: 12500,
        aiUsageCost: 1840,
        totalAmount: 14340,
        status: 'Paid',
        issuedDate: 'Oct 01, 2026',
      },
      {
        id: 'inv-v2',
        invoiceNumber: 'ROSE-2026-0988',
        period: 'September 2026',
        retainerAmount: 12500,
        aiUsageCost: 1710,
        totalAmount: 14210,
        status: 'Paid',
        issuedDate: 'Sep 01, 2026',
      },
    ],
  },
  {
    id: 'client-aether',
    businessName: 'Aether Medical Group',
    industry: 'Healthcare & Longevity',
    website: 'https://aetherlongevity.example.com',
    contactName: 'Dr. Julian Vance',
    contactRole: 'Chief Medical Officer',
    contactEmail: 'j.vance@aetherlongevity.example.com',
    contactPhone: '+1 (415) 772-9010',
    status: 'Active',
    monthlyRetainer: 16000,
    aiSpendMonthly: 2490,
    assignedAgentIds: ['agent-receptionist', 'agent-voice', 'agent-appointment', 'agent-support', 'agent-followup'],
    connectedIntegrationIds: ['int-google-cal', 'int-gmail', 'int-twilio', 'int-vapi'],
    tasksCompleted30d: 22410,
    successRate: 99.3,
    hoursSaved30d: 640,
    leadsGenerated30d: 495,
    overviewNotes:
      'Automates patient intake triage, diagnostic lab appointment coordination, pre-fasting preparation reminders, and post-consultation follow-up across 6 clinics.',
    knowledgeBase: [
      {
        id: 'kb-a1',
        title: 'Executive Biomarker & Full-Body MRI Prep Guidelines.pdf',
        type: 'PDF',
        sizeOrUrl: '6.4 MB',
        updatedAt: '5 hours ago',
        status: 'Indexed',
        chunks: 240,
      },
      {
        id: 'kb-a2',
        title: 'Clinic Hours, Physician Specialties & Triage Escalation Rules.md',
        type: 'Markdown',
        sizeOrUrl: '512 KB',
        updatedAt: '2 days ago',
        status: 'Indexed',
        chunks: 118,
      },
    ],
    conversations: [
      {
        id: 'conv-a1',
        customerName: 'Claire Beaumont',
        customerContact: '+1 (415) 309-1182',
        agentName: 'AI Appointment Setter',
        channel: 'Voice Call',
        durationOrLength: '2m 18s',
        timestamp: '28 mins ago',
        outcome: 'Qualified & Booked',
        sentiment: 'Positive',
        summary:
          'Rescheduled Comprehensive Longevity Panel to Friday at 7:30 AM PST and confirmed 12-hour fasting instructions via SMS.',
        transcript: [
          {
            speaker: 'Agent',
            time: '00:01',
            text: 'Thank you for calling Aether Medical Group. I am Aria, Aether’s automated scheduling assistant. How can I help you today?',
          },
          {
            speaker: 'Customer',
            time: '00:08',
            text: 'I need to move my Thursday morning blood panel to Friday morning if possible.',
          },
          {
            speaker: 'Agent',
            time: '00:14',
            text: 'I can certainly help with that, Claire. We have a 7:30 AM or 8:15 AM slot available at our San Francisco Pacific Heights clinic this Friday. Which works best?',
          },
          {
            speaker: 'Customer',
            time: '00:24',
            text: '7:30 AM is great.',
          },
          {
            speaker: 'Agent',
            time: '00:28',
            text: 'Confirmed for Friday at 7:30 AM PST. Please remember to fast for 12 hours prior—water and black coffee are permitted. I have just sent your updated calendar pass.',
          },
        ],
      },
    ],
    team: [
      {
        id: 'tm-a1',
        name: 'Dr. Julian Vance',
        role: 'Chief Medical Officer',
        email: 'j.vance@aetherlongevity.example.com',
        portalAccess: 'Admin',
        lastActive: '18 mins ago',
      },
      {
        id: 'tm-a2',
        name: 'Hannah Cho',
        role: 'VP of Patient Operations',
        email: 'h.cho@aetherlongevity.example.com',
        portalAccess: 'Admin',
        lastActive: '1 hour ago',
      },
    ],
    invoices: [
      {
        id: 'inv-a1',
        invoiceNumber: 'ROSE-2026-1045',
        period: 'October 2026',
        retainerAmount: 16000,
        aiUsageCost: 2490,
        totalAmount: 18490,
        status: 'Paid',
        issuedDate: 'Oct 01, 2026',
      },
    ],
  },
  {
    id: 'client-novascale',
    businessName: 'NovaScale Cloud Systems',
    industry: 'B2B Enterprise SaaS',
    website: 'https://novascale.example.io',
    contactName: 'Marcus Chen',
    contactRole: 'VP of Revenue Operations',
    contactEmail: 'm.chen@novascale.example.io',
    contactPhone: '+1 (650) 449-2200',
    status: 'Active',
    monthlyRetainer: 14500,
    aiSpendMonthly: 2120,
    assignedAgentIds: ['agent-voice', 'agent-sales', 'agent-lead-qual', 'agent-support', 'agent-marketing'],
    connectedIntegrationIds: ['int-salesforce', 'int-slack', 'int-google-drive', 'int-gmail'],
    tasksCompleted30d: 31290,
    successRate: 97.9,
    hoursSaved30d: 580,
    leadsGenerated30d: 612,
    overviewNotes:
      'Full-funnel SDR qualification, technical Tier-1/2 developer support, and automated enterprise battlecard generation integrated with Salesforce and Slack.',
    knowledgeBase: [
      {
        id: 'kb-n1',
        title: 'NovaScale Kubernetes Autoscaler v4.2 Documentation',
        type: 'URL',
        sizeOrUrl: 'https://docs.novascale.example.io',
        updatedAt: '1 hour ago',
        status: 'Indexed',
        chunks: 1280,
      },
      {
        id: 'kb-n2',
        title: 'Enterprise SOC2 & HIPAA Security Questionnaire Matrix.csv',
        type: 'CSV',
        sizeOrUrl: '4.1 MB',
        updatedAt: '3 days ago',
        status: 'Indexed',
        chunks: 350,
      },
    ],
    conversations: [
      {
        id: 'conv-n1',
        customerName: 'Devon Brooks (CTO, FinEdge)',
        customerContact: 'Web Chat · Enterprise Pricing Page',
        agentName: 'AI Sales Agent',
        channel: 'Web Chat',
        durationOrLength: '8 messages',
        timestamp: '42 mins ago',
        outcome: 'Qualified & Booked',
        sentiment: 'Positive',
        summary:
          'Answered multi-region VPC peering questions and booked Solutions Architect demo for 120-node cluster migration.',
        transcript: [
          {
            speaker: 'Customer',
            time: '11:02',
            text: 'Does your Enterprise tier support zero-downtime VPC peering across AWS us-east-1 and eu-central-1?',
          },
          {
            speaker: 'Agent',
            time: '11:02',
            text: 'Yes—NovaScale Enterprise supports active-active cross-region mesh peering across AWS, GCP, and Azure with sub-15ms control plane failover. How many worker nodes are you currently orchestrating?',
          },
          {
            speaker: 'Customer',
            time: '11:04',
            text: 'Roughly 120 production nodes right now, scaling to 250 in Q1.',
          },
          {
            speaker: 'Agent',
            time: '11:04',
            text: 'At 120+ nodes, you qualify for our dedicated cluster volume tier (saving ~28% vs on-demand). I can connect you with our Principal Solutions Architect tomorrow at 10:00 AM PST for a live architecture benchmark.',
          },
        ],
      },
    ],
    team: [
      {
        id: 'tm-n1',
        name: 'Marcus Chen',
        role: 'VP of Revenue Operations',
        email: 'm.chen@novascale.example.io',
        portalAccess: 'Admin',
        lastActive: '5 mins ago',
      },
    ],
    invoices: [
      {
        id: 'inv-n1',
        invoiceNumber: 'ROSE-2026-1049',
        period: 'October 2026',
        retainerAmount: 14500,
        aiUsageCost: 2120,
        totalAmount: 16620,
        status: 'Paid',
        issuedDate: 'Oct 01, 2026',
      },
    ],
  },
  {
    id: 'client-lumina',
    businessName: 'Lumina Boutique Hospitality',
    industry: 'Hospitality & Resorts',
    website: 'https://luminaresorts.example.com',
    contactName: 'Elena Rostova',
    contactRole: 'Director of Guest Experience',
    contactEmail: 'e.rostova@luminaresorts.example.com',
    contactPhone: '+1 (212) 901-3340',
    status: 'Active',
    monthlyRetainer: 9500,
    aiSpendMonthly: 1390,
    assignedAgentIds: ['agent-receptionist', 'agent-voice', 'agent-support', 'agent-followup'],
    connectedIntegrationIds: ['int-whatsapp', 'int-google-cal', 'int-stripe'],
    tasksCompleted30d: 19400,
    successRate: 98.4,
    hoursSaved30d: 390,
    leadsGenerated30d: 274,
    overviewNotes:
      'Handles multilingual VIP room upgrades, dining & spa reservations, airport chauffeur dispatch, and post-stay review generation.',
    knowledgeBase: [
      {
        id: 'kb-l1',
        title: 'Lumina Resort Concierge Directory & Michelin Dining Guide.pdf',
        type: 'PDF',
        sizeOrUrl: '9.8 MB',
        updatedAt: '1 day ago',
        status: 'Indexed',
        chunks: 310,
      },
    ],
    conversations: [],
    team: [
      {
        id: 'tm-l1',
        name: 'Elena Rostova',
        role: 'Director of Guest Experience',
        email: 'e.rostova@luminaresorts.example.com',
        portalAccess: 'Admin',
        lastActive: '2 hours ago',
      },
    ],
    invoices: [
      {
        id: 'inv-l1',
        invoiceNumber: 'ROSE-2026-1051',
        period: 'October 2026',
        retainerAmount: 9500,
        aiUsageCost: 1390,
        totalAmount: 10890,
        status: 'Paid',
        issuedDate: 'Oct 01, 2026',
      },
    ],
  },
  {
    id: 'client-veritas',
    businessName: 'Veritas Corporate Law Partners',
    industry: 'Legal & Advisory',
    website: 'https://veritaslaw.example.com',
    contactName: 'Arthur Pendelton',
    contactRole: 'Senior Managing Partner',
    contactEmail: 'a.pendelton@veritaslaw.example.com',
    contactPhone: '+1 (312) 550-8200',
    status: 'Onboarding',
    monthlyRetainer: 11000,
    aiSpendMonthly: 640,
    assignedAgentIds: ['agent-sales', 'agent-appointment', 'agent-followup'],
    connectedIntegrationIds: ['int-google-workspace', 'int-google-cal', 'int-hubspot'],
    tasksCompleted30d: 4120,
    successRate: 99.0,
    hoursSaved30d: 145,
    leadsGenerated30d: 89,
    overviewNotes:
      'Automating M&A conflict-check intake forms, partner consultation scheduling, and document collection reminders.',
    knowledgeBase: [
      {
        id: 'kb-ve1',
        title: 'Corporate M&A Intake & Conflict Check Standard Procedure.pdf',
        type: 'PDF',
        sizeOrUrl: '3.2 MB',
        updatedAt: '3 hours ago',
        status: 'Indexed',
        chunks: 142,
      },
    ],
    conversations: [],
    team: [
      {
        id: 'tm-ve1',
        name: 'Arthur Pendelton',
        role: 'Senior Managing Partner',
        email: 'a.pendelton@veritaslaw.example.com',
        portalAccess: 'Admin',
        lastActive: 'Yesterday',
      },
    ],
    invoices: [
      {
        id: 'inv-ve1',
        invoiceNumber: 'ROSE-2026-1055',
        period: 'October 2026',
        retainerAmount: 11000,
        aiUsageCost: 640,
        totalAmount: 11640,
        status: 'Processing',
        issuedDate: 'Oct 15, 2026',
      },
    ],
  },
  {
    id: 'client-solaris',
    businessName: 'Solaris Clean Energy',
    industry: 'Renewable Infrastructure',
    website: 'https://solarisgrid.example.com',
    contactName: 'Liam O’Connor',
    contactRole: 'Chief Commercial Officer',
    contactEmail: 'l.oconnor@solarisgrid.example.com',
    contactPhone: '+1 (512) 884-1920',
    status: 'Pilot',
    monthlyRetainer: 8500,
    aiSpendMonthly: 910,
    assignedAgentIds: ['agent-lead-qual', 'agent-support', 'agent-followup', 'agent-marketing'],
    connectedIntegrationIds: ['int-gohighlevel', 'int-whatsapp', 'int-twilio'],
    tasksCompleted30d: 8930,
    successRate: 96.8,
    hoursSaved30d: 230,
    leadsGenerated30d: 215,
    overviewNotes:
      'Commercial solar roof assessment qualification, utility rebate calculator chat, and field installer dispatch coordination.',
    knowledgeBase: [
      {
        id: 'kb-s1',
        title: '2026 Federal & State Commercial Solar Tax Credit Matrix.csv',
        type: 'CSV',
        sizeOrUrl: '1.9 MB',
        updatedAt: '5 days ago',
        status: 'Indexed',
        chunks: 195,
      },
    ],
    conversations: [],
    team: [
      {
        id: 'tm-s1',
        name: 'Liam O’Connor',
        role: 'Chief Commercial Officer',
        email: 'l.oconnor@solarisgrid.example.com',
        portalAccess: 'Admin',
        lastActive: '4 hours ago',
      },
    ],
    invoices: [
      {
        id: 'inv-s1',
        invoiceNumber: 'ROSE-2026-1058',
        period: 'October 2026',
        retainerAmount: 8500,
        aiUsageCost: 910,
        totalAmount: 9410,
        status: 'Paid',
        issuedDate: 'Oct 05, 2026',
      },
    ],
  },
];

export const INITIAL_AUTOMATIONS: AutomationWorkflow[] = [
  {
    id: 'auto-1',
    name: 'Instant Inbound Lead Qualification & VIP Calendar Booking',
    clientId: 'client-vanguard',
    clientName: 'Vanguard Luxury Realty',
    status: 'Active',
    triggerDescription: 'Webhook trigger on Meta Lead Ads or Luxury Portal inquiry submission',
    scheduleOrEvent: 'Real-time Event (< 15s SLA)',
    executions30d: 4820,
    successRate: 99.2,
    avgDurationSec: 18,
    lastRun: '2 mins ago',
    steps: [
      {
        id: 'st-1',
        title: 'Inbound Lead Webhook',
        type: 'Trigger',
        provider: 'HubSpot CRM',
        detail: 'Captures prospect name, phone, listing ID, and source campaign',
      },
      {
        id: 'st-2',
        title: 'WhatsApp & Voice Qualification',
        type: 'AI Agent',
        provider: 'AI Lead Qualification Agent',
        detail: 'Initiates instant WhatsApp thread and scores BANT criteria (0–100)',
      },
      {
        id: 'st-3',
        title: 'VIP Score Threshold Router',
        type: 'Condition',
        provider: 'ROSE Flow Engine',
        detail: 'Routes leads with score >= 80 or budget >= $3M to Senior Partner track',
      },
      {
        id: 'st-4',
        title: 'Round-Robin Viewing Lock',
        type: 'Integration Action',
        provider: 'Google Calendar',
        detail: 'Reserves showing slot and sends calendar pass + portfolio PDF',
      },
    ],
  },
  {
    id: 'auto-2',
    name: '24/7 Patient Biomarker Triage & Fasting Prep Sequence',
    clientId: 'client-aether',
    clientName: 'Aether Medical Group',
    status: 'Active',
    triggerDescription: 'Inbound patient phone call or diagnostic booking confirmation',
    scheduleOrEvent: 'Continuous Voice + Scheduled SMS',
    executions30d: 7390,
    successRate: 99.5,
    avgDurationSec: 42,
    lastRun: '6 mins ago',
    steps: [
      {
        id: 'st-21',
        title: 'Inbound Telephony Trunk',
        type: 'Trigger',
        provider: 'Vapi / Twilio Voice',
        detail: 'Receives patient call on clinic main number with zero hold time',
      },
      {
        id: 'st-22',
        title: 'Symptom & Panel Triage',
        type: 'AI Agent',
        provider: 'AI Voice Agent',
        detail: 'Verifies patient DOB, matches requested panel, and checks contraindications',
      },
      {
        id: 'st-23',
        title: 'Urgency & Physician Check',
        type: 'Condition',
        provider: 'ROSE Flow Engine',
        detail: 'Escalates acute symptoms to on-call RN; routes standard panels to booking',
      },
      {
        id: 'st-24',
        title: 'Calendar Sync & Prep Dispatch',
        type: 'Integration Action',
        provider: 'Google Calendar + Gmail',
        detail: 'Books phlebotomy suite and schedules 12h fasting reminder',
      },
    ],
  },
  {
    id: 'auto-3',
    name: 'Enterprise Trial Usage Spike -> Outbound SDR Architecture Call',
    clientId: 'client-novascale',
    clientName: 'NovaScale Cloud Systems',
    status: 'Active',
    triggerDescription: 'Triggers when trial workspace exceeds 50 active container nodes',
    scheduleOrEvent: 'Telemetry Event Stream',
    executions30d: 3150,
    successRate: 97.4,
    avgDurationSec: 26,
    lastRun: '19 mins ago',
    steps: [
      {
        id: 'st-31',
        title: 'Product Telemetry Alert',
        type: 'Trigger',
        provider: 'Salesforce CRM',
        detail: 'Detects cluster node threshold breach in self-serve trial account',
      },
      {
        id: 'st-32',
        title: 'Custom ROI & Architecture Brief',
        type: 'AI Agent',
        provider: 'AI Sales Agent',
        detail: 'Generates volume tier savings analysis from live usage telemetry',
      },
      {
        id: 'st-33',
        title: 'Enterprise Account Check',
        type: 'Condition',
        provider: 'ROSE Flow Engine',
        detail: 'Verifies employee count > 200 and no active AE lock',
      },
      {
        id: 'st-34',
        title: 'Slack Deal Room & Outreach',
        type: 'Integration Action',
        provider: 'Slack + Gmail',
        detail: 'Alerts #enterprise-closers and dispatches personalized architecture invite',
      },
    ],
  },
  {
    id: 'auto-4',
    name: 'Post-Stay VIP Sentiment & Direct Rebooking Concierge',
    clientId: 'client-lumina',
    clientName: 'Lumina Boutique Hospitality',
    status: 'Active',
    triggerDescription: 'Triggers 24 hours after resort guest checkout in PMS',
    scheduleOrEvent: 'Daily Batch & Live Reply Handler',
    executions30d: 2640,
    successRate: 98.1,
    avgDurationSec: 15,
    lastRun: '1 hour ago',
    steps: [
      {
        id: 'st-41',
        title: 'Guest Checkout Event',
        type: 'Trigger',
        provider: 'Stripe / PMS Webhook',
        detail: 'Fires 24h after folio settlement with suite tier metadata',
      },
      {
        id: 'st-42',
        title: 'Personalized WhatsApp Check-in',
        type: 'AI Agent',
        provider: 'AI Follow-up Agent',
        detail: 'Sends warm note referencing guest’s dining/spa visits during stay',
      },
      {
        id: 'st-43',
        title: 'Sentiment Classification',
        type: 'Condition',
        provider: 'ROSE Flow Engine',
        detail: 'Splits 5-star sentiment toward direct seasonal rebooking offer',
      },
      {
        id: 'st-44',
        title: 'VIP Loyalty Credit Issuance',
        type: 'Integration Action',
        provider: 'WhatsApp Business',
        detail: 'Delivers private seasonal suite voucher for direct booking',
      },
    ],
  },
  {
    id: 'auto-5',
    name: 'Stalled Commercial Solar Proposal Reactivation Sequence',
    clientId: 'client-solaris',
    clientName: 'Solaris Clean Energy',
    status: 'Paused',
    triggerDescription: 'Triggers when commercial proposal remains unsigned for 7 days',
    scheduleOrEvent: 'Every 6 hours check',
    executions30d: 940,
    successRate: 95.8,
    avgDurationSec: 31,
    lastRun: 'Yesterday',
    steps: [
      {
        id: 'st-51',
        title: 'Unsigned Proposal Monitor',
        type: 'Trigger',
        provider: 'GoHighLevel CRM',
        detail: 'Identifies commercial solar quotes idle > 7 days in pipeline',
      },
      {
        id: 'st-52',
        title: 'Tax Credit Deadline Calculation',
        type: 'AI Agent',
        provider: 'AI Follow-up Agent',
        detail: 'Computes quarterly depreciation & state rebate expiration impact',
      },
      {
        id: 'st-53',
        title: 'SMS + Email Executive Brief',
        type: 'Integration Action',
        provider: 'Twilio + Gmail',
        detail: 'Sends updated cash-flow breakdown and 1-click booking link',
      },
    ],
  },
];

export const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'int-google-workspace',
    name: 'Google Workspace Core',
    providerGroup: 'Google Ecosystem',
    description:
      'Unified identity, directory sync, and organizational permission scoping across ROSE AI OS client environments.',
    connectionState: 'Demo Connected',
    demoAccountLabel: 'demo-ops@rose-ai-agency.example.com (Demo Environment)',
    scopes: ['directory.readonly', 'userinfo.email', 'orgunits.readonly'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/google-workspace',
    syncedClientsCount: 5,
    lastSync: '4 mins ago',
  },
  {
    id: 'int-gmail',
    name: 'Gmail Executive Threads',
    providerGroup: 'Google Ecosystem',
    description:
      'Drafts, threads, and dispatches context-aware client follow-ups, proposals, and support resolutions with human-in-the-loop approval.',
    connectionState: 'Demo Connected',
    demoAccountLabel: 'concierge-fleet@rose-ai-agency.example.com (Demo Environment)',
    scopes: ['gmail.send', 'gmail.readonly', 'gmail.modify'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/gmail-push',
    syncedClientsCount: 4,
    lastSync: '2 mins ago',
  },
  {
    id: 'int-google-cal',
    name: 'Google Calendar',
    providerGroup: 'Google Ecosystem',
    description:
      'Real-time free/busy availability lookup, multi-advisor round-robin scheduling, time-zone normalization, and instant Google Meet links.',
    connectionState: 'Demo Connected',
    demoAccountLabel: 'scheduling-engine@rose-ai-agency.example.com (Demo Environment)',
    scopes: ['calendar.events', 'calendar.freebusy'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/gcal-events',
    syncedClientsCount: 5,
    lastSync: 'Just now',
  },
  {
    id: 'int-google-drive',
    name: 'Google Drive Knowledge Sync',
    providerGroup: 'Google Ecosystem',
    description:
      'Continuous RAG ingestion of client folders, SOP PDFs, pricing sheets, and onboarding docs into vector memory.',
    connectionState: 'Demo Connected',
    demoAccountLabel: 'knowledge-vault@rose-ai-agency.example.com (Demo Environment)',
    scopes: ['drive.readonly', 'drive.metadata.readonly'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/gdrive-changes',
    syncedClientsCount: 4,
    lastSync: '11 mins ago',
  },
  {
    id: 'int-whatsapp',
    name: 'WhatsApp Business Platform',
    providerGroup: 'Messaging & Telephony',
    description:
      'Official Meta WhatsApp Business API messaging for 15-second lead qualification, rich media brochures, and voice note transcription.',
    connectionState: 'Demo Connected',
    demoAccountLabel: 'WABA ID: 9042-8812-DEMO (Sandbox)',
    scopes: ['whatsapp_business_messaging', 'whatsapp_business_management'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/whatsapp-cloud',
    syncedClientsCount: 4,
    lastSync: '1 min ago',
  },
  {
    id: 'int-twilio',
    name: 'Twilio Voice & Programmable SMS',
    providerGroup: 'Messaging & Telephony',
    description:
      'Elastic SIP trunking, dedicated local/toll-free client numbers, call recording storage, and automated SMS appointment confirmations.',
    connectionState: 'Demo Connected',
    demoAccountLabel: 'AC_DEMO_8841902a91c (Demo Trunk)',
    scopes: ['voice.sip', 'sms.messages', 'recordings.read'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/twilio-voice',
    syncedClientsCount: 5,
    lastSync: '3 mins ago',
  },
  {
    id: 'int-vapi',
    name: 'Vapi / Retell Ultra-Low-Latency Voice',
    providerGroup: 'Messaging & Telephony',
    description:
      'Sub-400ms streaming voice orchestration layer with natural barge-in detection, ambient office soundscapes, and warm human transfer.',
    connectionState: 'Demo Connected',
    demoAccountLabel: 'voice-cluster-us-east-demo',
    scopes: ['assistants.write', 'calls.stream', 'phonenumbers.read'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/voice-stream',
    syncedClientsCount: 4,
    lastSync: 'Just now',
  },
  {
    id: 'int-hubspot',
    name: 'HubSpot CRM Enterprise',
    providerGroup: 'CRM Platforms',
    description:
      'Bi-directional contact sync, automated BANT property enrichment, call transcript logging, and deal stage progression.',
    connectionState: 'Demo Connected',
    demoAccountLabel: 'Portal ID: 4481920-DEMO',
    scopes: ['crm.objects.contacts.write', 'crm.objects.deals.write', 'timeline'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/hubspot-crm',
    syncedClientsCount: 3,
    lastSync: '7 mins ago',
  },
  {
    id: 'int-salesforce',
    name: 'Salesforce Cloud CRM',
    providerGroup: 'CRM Platforms',
    description:
      'Enterprise lead routing, Opportunity activity synchronization, and custom Apex webhook triggers for high-velocity sales teams.',
    connectionState: 'Demo Connected',
    demoAccountLabel: 'na142.salesforce-demo.example.com',
    scopes: ['api', 'refresh_token', 'chatter_api'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/sfdc-events',
    syncedClientsCount: 2,
    lastSync: '15 mins ago',
  },
  {
    id: 'int-gohighlevel',
    name: 'GoHighLevel Agency Sub-Accounts',
    providerGroup: 'CRM Platforms',
    description:
      'Multi-location agency pipeline sync, missed-call text-back orchestration, and automated reputation management.',
    connectionState: 'Sandbox Mode',
    demoAccountLabel: 'GHL-Agency-Sandbox-09',
    scopes: ['contacts.write', 'opportunities.write', 'conversations.message'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/ghl-subaccount',
    syncedClientsCount: 2,
    lastSync: '22 mins ago',
  },
  {
    id: 'int-slack',
    name: 'Slack Deal & Escalation Alerts',
    providerGroup: 'Billing & Ops',
    description:
      'Real-time VIP lead notifications, human handoff escalation buttons, and daily executive digest reports in client channels.',
    connectionState: 'Demo Connected',
    demoAccountLabel: 'rose-agency-workspace.slack-demo.com',
    scopes: ['chat:write', 'channels:read', 'commands'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/slack-interactive',
    syncedClientsCount: 5,
    lastSync: '5 mins ago',
  },
  {
    id: 'int-stripe',
    name: 'Stripe Retainer & Usage Billing',
    providerGroup: 'Billing & Ops',
    description:
      'Automated agency retainer invoicing, metered AI token & voice minute rebilling, and in-call payment link generation.',
    connectionState: 'Available (Demo)',
    demoAccountLabel: 'acct_demo_rose_billing_01',
    scopes: ['invoices.write', 'customers.read', 'payment_links.write'],
    webhookEndpoint: 'https://api.rose-os.example/webhooks/stripe-billing',
    syncedClientsCount: 4,
    lastSync: '1 hour ago',
  },
];

export const INITIAL_CONVERSATIONS: WorkspaceConversation[] = [
  {
    id: 'chat-1',
    title: 'Vanguard Luxury Realty — Q4 Penthouse Lead Funnel Optimization',
    updatedAt: '10 mins ago',
    pinned: true,
    model: 'ROSE-4 Omni',
    clientContext: 'Vanguard Luxury Realty',
    messages: [
      {
        id: 'm-1',
        role: 'user',
        content:
          'Analyze the last 30 days of inbound performance for Vanguard Luxury Realty and recommend how we can increase private showing conversion on the Aurelia Tower penthouse listings.',
        timestamp: '10:42 AM',
        attachments: [
          {
            id: 'att-1',
            name: 'Vanguard_30d_Lead_Attribution.csv',
            type: 'CSV',
            size: '1.4 MB',
          },
        ],
      },
      {
        id: 'm-2',
        role: 'assistant',
        model: 'ROSE-4 Omni',
        timestamp: '10:42 AM',
        content: `Here is the 30-day diagnostic and conversion blueprint for **Vanguard Luxury Realty**:

### 1. Funnel Telemetry Summary (Last 30 Days)
- **Inbound Volume**: 1,420 inquiries across Voice (38%), WhatsApp (47%), and Web Chat (15%).
- **Speed-to-Lead SLA**: 9.4 seconds median response time via **AI Lead Qualification Agent**.
- **Qualified Buyer Rate ($3M+ Verified)**: 318 qualified prospects (22.4% qualification rate).
- **Private Showing Conversion**: 68.2% of qualified international buyers booked a viewing when offered an immediate WhatsApp portfolio memo + helicopter/chauffeur transfer option.

### 2. Identified Bottleneck on Aurelia Tower ($8.5M–$14M Tier)
Prospects inquiring from **New York, London, and Mexico City** between 7:00 PM and 11:00 PM EST frequently ask about **cross-border escrow structures and marina slip dimensions** before committing to a flight or in-person showing. Currently, 14% of these high-intent conversations pause waiting for a daytime broker callback.

### 3. Recommended Action Plan
1. **Expand RAG Knowledge Base**: Index the *Aurelia Marina Superyacht Slip Specifications (up to 110ft)* directly into the **AI Voice Agent** and **AI Sales Agent**.
2. **Deploy Dual-Calendar Hold**: Allow the **AI Appointment Setter** to provisionally lock a 15-minute Zoom Architectural Flythrough with Victoria Sterling prior to the physical Miami visit.
3. **Activate 48-Hour WhatsApp Follow-up**: Trigger the **AI Follow-up Agent** to share the newly released 4K Sunset Penthouse Walkthrough video with the 19 qualified prospects from last week.`,
      },
    ],
  },
  {
    id: 'chat-2',
    title: 'Aether Medical Group — Voice Agent Prompt & HIPAA Guardrail Audit',
    updatedAt: '3 hours ago',
    pinned: true,
    model: 'Gemini 3.8 Flash',
    clientContext: 'Aether Medical Group',
    messages: [
      {
        id: 'm-21',
        role: 'user',
        content:
          'Draft an updated system prompt for Aether Medical Group’s AI Voice Agent that handles Executive Full-Body MRI & Longevity Blood Panel scheduling while enforcing strict clinical escalation rules.',
        timestamp: 'Yesterday',
      },
      {
        id: 'm-22',
        role: 'assistant',
        model: 'Gemini 3.8 Flash',
        timestamp: 'Yesterday',
        content: `Below is the hardened production system prompt for **Aether Medical Group — AI Voice Agent (v3.4)**:

### System Persona & Objective
You are **Aria**, the Clinical Concierge Voice Assistant for **Aether Medical Group**. Your role is to assist patients with scheduling Executive Biomarker Panels, Full-Body MRI scans, and Longevity Physician Consultations across our 6 clinics with warmth, clarity, and clinical precision.

### Strict Operational Guardrails
1. **Acute Symptom Escalation**: If a caller mentions chest pain, shortness of breath, neurological symptoms, or any acute medical distress, immediately state: *"Because you are describing acute symptoms, I am transferring you directly to our on-call Registered Nurse right now,"* and execute tool \`warm_transfer_clinical_rn\`.
2. **MRI Contraindication Screening**: Prior to locking any Full-Body MRI slot, confirm whether the patient has pacemakers, cochlear implants, or metallic fragments.
3. **12-Hour Fasting Protocol**: For all morning blood biomarker appointments (7:00 AM – 10:30 AM), explicitly confirm the 12-hour fasting requirement (water and plain black coffee permitted) and trigger the SMS preparation checklist.`,
      },
    ],
  },
  {
    id: 'chat-3',
    title: 'Agency Capacity & Monthly Retainer Margin Forecast',
    updatedAt: '2 days ago',
    pinned: false,
    model: 'ROSE Reasoning Pro',
    clientContext: 'ROSE AI Agency Internal',
    messages: [
      {
        id: 'm-31',
        role: 'user',
        content:
          'Summarize our current agency gross margin across our 6 active clients factoring in monthly retainers vs AI token and telephony compute costs.',
        timestamp: '2 days ago',
      },
      {
        id: 'm-32',
        role: 'assistant',
        model: 'ROSE Reasoning Pro',
        timestamp: '2 days ago',
        content: `### ROSE AI Agency — Monthly Margin & Compute Economics

- **Total Monthly Recurring Retainers (MRR)**: **$72,000 / mo** across 6 client accounts.
- **Total AI Compute & Telephony Spend**: **$9,390 / mo** (includes Gemini 3.8 Flash/Live tokens, ROSE-4 Omni reasoning calls, and Twilio/Vapi voice minutes).
- **Blended Gross Infrastructure Margin**: **86.9%**.
- **Client Usage Rebilling**: 100% of direct AI usage ($9,390) is passed through on client invoices as itemized compute consumption, resulting in **100% net retainer capture** before agency engineering labor.`,
      },
    ],
  },
];

export const INITIAL_PROJECTS: AgencyProject[] = [
  {
    id: 'proj-1',
    title: 'Multilingual WhatsApp & Voice Concierge Rollout (EN / ES / PT)',
    clientName: 'Vanguard Luxury Realty',
    clientId: 'client-vanguard',
    stage: 'Live Production',
    progress: 94,
    leadEngineer: 'Elena Vance',
    dueDate: 'Nov 08, 2026',
    priority: 'High',
    tasks: [
      { id: 't-1', title: 'Index 18 waterfront development brochures into RAG store', completed: true },
      { id: 't-2', title: 'Configure HubSpot BANT custom properties & deal stage webhooks', completed: true },
      { id: 't-3', title: 'Calibrate Portuguese & Spanish voice prosody on Vapi trunk', completed: true },
      { id: 't-4', title: 'Final partner sign-off on helicopter tour booking guardrails', completed: false },
    ],
  },
  {
    id: 'proj-2',
    title: 'Clinical Biomarker Intake & Automated Lab Prep Voice Fleet',
    clientName: 'Aether Medical Group',
    clientId: 'client-aether',
    stage: 'Live Production',
    progress: 100,
    leadEngineer: 'Kieran Patel',
    dueDate: 'Oct 28, 2026',
    priority: 'Critical',
    tasks: [
      { id: 't-21', title: 'HIPAA-compliant PII redaction pipeline verification', completed: true },
      { id: 't-22', title: 'MRI metallic implant screening decision tree', completed: true },
      { id: 't-23', title: 'Multi-clinic Google Calendar phlebotomy room sync', completed: true },
    ],
  },
  {
    id: 'proj-3',
    title: 'M&A Conflict-Check Intake Agent & Partner Scheduling',
    clientName: 'Veritas Corporate Law Partners',
    clientId: 'client-veritas',
    stage: 'Staging & QA',
    progress: 72,
    leadEngineer: 'Sora Takahashi',
    dueDate: 'Nov 15, 2026',
    priority: 'High',
    tasks: [
      { id: 't-31', title: 'Ingest corporate entity conflict-check taxonomy', completed: true },
      { id: 't-32', title: 'Connect Senior Partner executive assistant calendars', completed: true },
      { id: 't-33', title: 'Red-team adversarial legal advice boundary tests', completed: false },
      { id: 't-34', title: 'Deploy client portal view for Managing Partners', completed: false },
    ],
  },
  {
    id: 'proj-4',
    title: 'Commercial Solar Roof Qualification & Tax Credit Calculator Bot',
    clientName: 'Solaris Clean Energy',
    clientId: 'client-solaris',
    stage: 'Agent Training',
    progress: 55,
    leadEngineer: 'Elena Vance',
    dueDate: 'Nov 24, 2026',
    priority: 'Standard',
    tasks: [
      { id: 't-41', title: 'Import 50-state utility rebate & federal ITC tables', completed: true },
      { id: 't-42', title: 'Wire GoHighLevel pipeline stage triggers', completed: true },
      { id: 't-43', title: 'Train objection handling on commercial roof lease structures', completed: false },
    ],
  },
];

export const INITIAL_SYSTEM_EVENTS: SystemEvent[] = [
  {
    id: 'evt-1',
    timestamp: 'Just now',
    type: 'Agent Execution',
    title: 'Qualified $9.4M Aurelia Penthouse buyer & locked Thursday 2:00 PM private tour',
    clientName: 'Vanguard Luxury Realty',
    agentOrWorkflow: 'AI Voice Agent',
    status: 'Completed',
    latencyOrMetric: '380ms turn latency',
  },
  {
    id: 'evt-2',
    timestamp: '4 mins ago',
    type: 'Automation Trigger',
    title: 'Dispatched 12-hour fasting SMS & calendar pass for Friday Longevity Panel',
    clientName: 'Aether Medical Group',
    agentOrWorkflow: 'Patient Biomarker Triage Flow',
    status: 'Completed',
    latencyOrMetric: '1.2s workflow exec',
  },
  {
    id: 'evt-3',
    timestamp: '11 mins ago',
    type: 'Knowledge Sync',
    title: 'Indexed 1,280 documentation chunks from NovaScale Kubernetes Autoscaler v4.2',
    clientName: 'NovaScale Cloud Systems',
    agentOrWorkflow: 'Google Drive & Docs RAG Sync',
    status: 'Nominal',
    latencyOrMetric: '1,280 vectors synced',
  },
  {
    id: 'evt-4',
    timestamp: '26 mins ago',
    type: 'Agent Execution',
    title: 'Resolved cross-region VPC peering technical inquiry & booked Solutions Architect',
    clientName: 'NovaScale Cloud Systems',
    agentOrWorkflow: 'AI Sales Agent',
    status: 'Completed',
    latencyOrMetric: 'Score: 94/100 BANT',
  },
  {
    id: 'evt-5',
    timestamp: '48 mins ago',
    type: 'Automation Trigger',
    title: 'Issued VIP post-stay seasonal suite voucher after 5-star guest reply',
    clientName: 'Lumina Boutique Hospitality',
    agentOrWorkflow: 'Post-Stay VIP Sentiment Flow',
    status: 'Completed',
    latencyOrMetric: 'WhatsApp delivered',
  },
  {
    id: 'evt-6',
    timestamp: '1 hour ago',
    type: 'Billing Event',
    title: 'Processed monthly agency retainer + metered AI compute invoice ($18,490)',
    clientName: 'Aether Medical Group',
    agentOrWorkflow: 'Stripe Retainer Billing',
    status: 'Nominal',
    latencyOrMetric: '$18,490.00 settled',
  },
];

export const DASHBOARD_TIMEFRAMES = {
  '7d': {
    label: 'Last 7 Days',
    tasksCompleted: '24,810',
    tasksDelta: '+18.4% vs prior 7d',
    successRate: '98.6%',
    successDelta: '+0.4% improvement',
    aiUsageCost: '$2,190',
    revenueBilled: '$18,400',
    dailySeries: [
      { label: 'Mon', tasks: 3120, voiceMins: 840, cost: 290 },
      { label: 'Tue', tasks: 3480, voiceMins: 920, cost: 315 },
      { label: 'Wed', tasks: 3890, voiceMins: 1050, cost: 345 },
      { label: 'Thu', tasks: 4120, voiceMins: 1140, cost: 360 },
      { label: 'Fri', tasks: 3950, voiceMins: 1080, cost: 340 },
      { label: 'Sat', tasks: 3210, voiceMins: 790, cost: 280 },
      { label: 'Sun', tasks: 3040, voiceMins: 740, cost: 260 },
    ],
  },
  '30d': {
    label: 'Last 30 Days',
    tasksCompleted: '100,970',
    tasksDelta: '+24.2% vs prior 30d',
    successRate: '98.4%',
    successDelta: '+0.8% improvement',
    aiUsageCost: '$9,390',
    revenueBilled: '$81,390',
    dailySeries: [
      { label: 'Wk 1', tasks: 21400, voiceMins: 5800, cost: 1980 },
      { label: 'Wk 2', tasks: 24150, voiceMins: 6420, cost: 2240 },
      { label: 'Wk 3', tasks: 26300, voiceMins: 7110, cost: 2490 },
      { label: 'Wk 4', tasks: 29120, voiceMins: 7890, cost: 2680 },
    ],
  },
  '90d': {
    label: 'Last 90 Days',
    tasksCompleted: '284,500',
    tasksDelta: '+62.0% quarter-over-quarter',
    successRate: '98.1%',
    successDelta: '+1.5% improvement',
    aiUsageCost: '$26,410',
    revenueBilled: '$234,800',
    dailySeries: [
      { label: 'Aug', tasks: 82400, voiceMins: 21900, cost: 7650 },
      { label: 'Sep', tasks: 101130, voiceMins: 26400, cost: 9370 },
      { label: 'Oct', tasks: 100970, voiceMins: 27220, cost: 9390 },
    ],
  },
};
