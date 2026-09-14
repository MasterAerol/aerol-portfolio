import type { Project } from '../types/project'

// Content is grounded in the user-supplied Milestone 1 brief.
// Null status and empty links mean no release status or URL was supplied.
export const projects = [
  {
    id: 'opscheck-flow',
    name: 'OpsCheck Flow',
    category: 'Open Source / Systems Engineering',
    status: 'Released — v0.1.0',
    description: 'A local-first durable Python/SQLite workflow runner for operational CSV review with persistent state, retries, idempotent events, human approval, worker leasing, crash recovery, dead-letter handling, and replay.',
    technologies: ['Python', 'SQLite', 'Git', 'GitHub', 'GitHub Actions', 'HTML reports', 'JSON reports'],
    highlights: [
      'Persisted workflow orchestration with parallel workers and deterministic verification.',
      'Human approval with a rejection/revision loop and idempotent event ingestion.',
      'Durable queue, atomic claims, worker leasing, heartbeat renewal, and stale-token fencing.',
      'Crash recovery, bounded retries with backoff, dead-letter handling, and replay.',
    ],
    links: [
      { label: 'Repository', href: 'https://github.com/MasterAerol/opscheck-flow' },
      { label: 'Release v0.1.0', href: 'https://github.com/MasterAerol/opscheck-flow/releases/tag/v0.1.0' },
    ],
    evidence: {
      summary: '227 tests · 225 passed · 2 intentional skips',
      details: [
        'Validation snapshot: 227 tests executed; 225 passed; 0 failed; 2 intentional Windows symlink skips.',
        'CI coverage: Ubuntu Python 3.10, 3.12, and 3.14; Windows Python 3.12.',
      ],
    },
  },
  {
    id: 'ai-operations-hub',
    name: 'AI Operations Automation Hub',
    category: 'Operations Automation / Workflow Systems',
    status: null,
    description: 'A full-stack operations workspace for requests, tasks, approvals, activity tracking, and workflow automation.',
    technologies: ['Supabase', 'Supabase Auth', 'PostgreSQL', 'Row Level Security (RLS)', 'n8n', 'Google Sheets', 'TypeScript', 'JavaScript', 'Git', 'GitHub', 'Automated testing', 'Browser testing'],
    highlights: [
      'Operations dashboard with requests, tasks, activity tracking, and review/approval workflows.',
      'Workspace authentication and database access controls.',
      'Automation integration through n8n and Google Sheets workflows.',
    ],
    links: [],
  },
  {
    id: 'pasawise-cse',
    name: 'PasaWise CSE',
    category: 'Full-Stack Product / EdTech',
    status: null,
    description: 'A web-based review platform for Filipino Civil Service Exam learners with structured lessons, practice, assessments, progress tracking, and targeted recovery workflows.',
    technologies: ['React', 'TypeScript', 'Vite', 'Hono', 'Cloudflare Workers', 'Cloudflare D1 / SQL', 'Git', 'GitHub'],
    highlights: [
      'Authentication, access control, dashboard, curriculum roadmap, and a lesson reader.',
      'Structured learning content, practice, subject assessments, and a full mock examination.',
      'Smart Recovery and progress/weak-area signals.',
      'Responsive desktop/mobile UI with testing and QA.',
    ],
    links: [],
  },
  {
    id: 'kivo',
    name: 'Kivo — Life Organizer',
    category: 'Consumer App',
    status: 'Private Alpha',
    tagline: "Things you shouldn't have to keep in your head.",
    description: 'A private Android-first life organizer for dates, responsibilities, documents, belongings, bills, subscriptions, warranties, and everyday life administration.',
    technologies: ['Android', 'Capacitor', 'APK builds', 'Automated QA'],
    highlights: [
      'PETSA for dates and commitments; SAAN KO for locations and belongings.',
      'Today, Search, and Add / capture for life-admin records.',
      'Reminders, expirations, responsibilities, subscriptions, documents, and belongings.',
      'Responsive mobile layouts with offline/local-first behavior and a local data-oriented architecture.',
    ],
    links: [],
    evidence: {
      summary: '596 automated tests',
      details: [
        'Latest supplied private-alpha evidence: 596 automated tests and Android private-alpha builds.',
        'Permanent Android package: app.kivo.lifeorganizer.',
      ],
    },
  },
] as const satisfies readonly Project[]
