import type { Project } from '../types/project'

// Supplied Milestone 3 facts with Milestone 4 status and proof presentation. Milestone 5 adds approved resume narratives; unverified URLs stay absent.
const opsQA = { total: 227, passed: 225, failed: 0, skips: 2 } as const
const opsCI = ['Ubuntu / Python 3.10', 'Ubuntu / Python 3.12', 'Ubuntu / Python 3.14', 'Windows / Python 3.12'] as const
const kivoTests = 596

export const projects = [
  {
    id: 'opscheck-flow',
    name: 'OpsCheck Flow',
    category: 'Open Source / Systems Engineering',
    status: 'Released — v0.1.0',
    statusTone: 'released',
    description: 'A local-first durable Python/SQLite workflow runner for operational CSV review with persistent state, retries, idempotent events, human approval, worker leasing, crash recovery, dead-letter handling, and replay.',
    technologies: ['Python', 'SQLite', 'Git', 'GitHub', 'GitHub Actions', 'HTML reports', 'JSON reports'],
    highlights: [
      'Persistent workflow state and idempotent event handling.',
      'Quality and change workers, verification, briefing, and human approval.',
      'Worker leasing and heartbeat handling.',
      'Crash recovery, retry/backoff, dead-letter handling, and replay.',
    ],
    resume: {
      "category": "Open-source systems project",
      "software": [
        "Built a Python/SQLite workflow runner with parallel CSV checks, persistent workflow state, retries, idempotent event ingestion, human approval, worker leasing, and dead-letter replay.",
        "Implemented local concurrency safeguards including atomic SQLite claims, lease-token fencing, heartbeat renewal, and crash recovery.",
        "Added cross-platform GitHub Actions validation covering Ubuntu and Windows environments."
      ],
      "operations": [
        "Built a software project for durable operational CSV review, automated checks, persistent workflow state, and human approval.",
        "Designed retry/recovery, queue, dead-letter, and replay mechanisms to keep interrupted work recoverable.",
        "Produced HTML and JSON reports with auditable process history, backed by cross-platform automated validation."
      ]
    },
    story: {
      headline: 'State that survives interruption.',
      purpose: 'Designed to make a local operational review workflow durable, recoverable, and auditable.',
      visual: {
        kind: 'workflow',
        title: 'A review, with a recovery path.',
        description: 'Follow the operational review or inspect what happens after a worker failure.',
        review: [
          [{ id: 'event', label: 'Event', description: 'An incoming event starts the operational CSV review.' }],
          [{ id: 'idempotency', label: 'Idempotency', description: 'Idempotent event handling protects the workflow from duplicate event processing.' }],
          [{ id: 'queue', label: 'Queue', description: 'The durable queue keeps operational work in persistent state.' }],
          [{ id: 'claim', label: 'Worker claim', description: 'A worker claims queued work using worker leasing.' }],
          [{ id: 'workflow', label: 'Workflow', description: 'The persisted workflow coordinates the review steps.' }],
          [
            { id: 'quality', label: 'Quality worker', description: 'The quality worker contributes to the operational review.' },
            { id: 'change', label: 'Change worker', description: 'The change worker contributes alongside the quality worker.' },
          ],
          [{ id: 'verifier', label: 'Verifier', description: 'Verification follows the worker steps in the review workflow.' }],
          [{ id: 'briefing', label: 'Briefing', description: 'The briefing prepares the review for a human decision.' }],
          [{ id: 'approval', label: 'Human approval', description: 'A human reviews the work before it is revised or completed.' }],
          [
            { id: 'revise', label: 'Revise', description: 'The revision path returns work to the workflow for further review.' },
            { id: 'complete', label: 'Complete', description: 'Completion follows the human approval decision.' },
          ],
        ],
        recovery: [
          { id: 'worker', label: 'Worker', description: 'Recovery concerns the worker carrying out the queued workflow.' },
          { id: 'lease', label: 'Lease / heartbeat', description: 'Worker leasing and heartbeat handling support the execution lifecycle.' },
          { id: 'failure', label: 'Failure', description: 'Crash recovery preserves a path forward after an interrupted execution.' },
          { id: 'retry', label: 'Retry / backoff', description: 'Retry and backoff provide a recovery path after failure.' },
          { id: 'dead-letter', label: 'Dead letter', description: 'Dead-letter handling retains failed work for later review.' },
          { id: 'replay', label: 'Replay', description: 'Replay provides a way to run retained work again.' },
        ],
      },
    },
    links: [
      { label: 'View Repository', href: 'https://github.com/MasterAerol/opscheck-flow' },
      { label: 'View v0.1.0 Release', href: 'https://github.com/MasterAerol/opscheck-flow/releases/tag/v0.1.0' },
    ],
    evidence: {
      label: 'Verified QA',
      note: 'Open-source release with cross-platform automated validation.',
      checksLabel: 'CI environments',
      summary: `${opsQA.total} tests · ${opsQA.passed} passed · ${opsQA.skips} intentional skips`,
      metrics: [
        { value: opsQA.total, label: 'tests' },
        { value: opsQA.passed, label: 'passed' },
        { value: opsQA.failed, label: 'failed' },
        { value: opsQA.skips, label: 'intentional Windows symlink skips' },
      ],
      checks: opsCI,
      details: [
        `Validation snapshot: ${opsQA.total} tests total; ${opsQA.passed} passed; ${opsQA.failed} failed; ${opsQA.skips} intentional Windows symlink skips.`,
        'Cross-platform CI covers the Ubuntu and Windows Python versions listed above.',
      ],
    },
  },
  {
    id: 'ai-operations-hub',
    name: 'AI Operations Automation Hub',
    category: 'Operations Automation / Workflow Systems',
    status: 'Built / Workflow Prototype',
    statusTone: 'built',
    description: 'A full-stack operations workspace for requests, tasks, approvals, activity tracking, and workflow automation.',
    technologies: ['Supabase', 'Supabase Auth', 'PostgreSQL', 'Row Level Security (RLS)', 'n8n', 'Google Sheets', 'TypeScript', 'JavaScript', 'Git', 'GitHub', 'Automated testing', 'Browser testing'],
    highlights: [
      'Requests, tasks, review/approval workflows, and activity tracking.',
      'Workspace authentication and controlled database access.',
      'External automation through n8n and Google Sheets.',
    ],
    resume: {
      "category": "Operations workflow application",
      "software": [
        "Built a full-stack operations workspace for requests, tasks, approvals, and activity tracking.",
        "Implemented Supabase authentication and PostgreSQL Row Level Security for controlled workspace data access.",
        "Integrated n8n and Google Sheets for external automation workflows, with automated and browser testing around workflow behavior."
      ],
      "operations": [
        "Organized incoming requests into task workflows with approval/review stages and activity tracking in a project-based operations workspace.",
        "Used Supabase workspace authentication and PostgreSQL Row Level Security for controlled data access.",
        "Connected n8n and Google Sheets automation and checked workflow behavior through automated and browser QA."
      ]
    },
    story: {
      headline: 'From incoming requests to structured work.',
      purpose: 'Bring review, tracking, automation, and controlled data access into one operational workflow.',
      visual: {
        kind: 'layers',
        title: 'One system. Three connected layers.',
        description: 'Select a layer to explore its role in the operations workspace.',
        layers: [
          { id: 'workspace', label: 'Workspace', description: 'Incoming requests move through review and approval into tasks, with activity tracking across the application.', features: ['Requests', 'Review / approval', 'Tasks', 'Activity tracking'] },
          { id: 'data', label: 'Data', description: 'Supabase is the application/data foundation. Supabase Auth, PostgreSQL, and Row Level Security provide authentication and controlled data access.', features: ['Supabase Auth', 'PostgreSQL', 'Row Level Security (RLS)'] },
          { id: 'automation', label: 'Automation', description: 'The external automation layer connects operations workflows with n8n and Google Sheets.', features: ['n8n', 'Google Sheets'] },
        ],
      },
    },
    links: [{ label: 'View Live Project', href: 'https://ai-operations-hub-fawn.vercel.app/' }],
    evidence: {
      label: 'Implementation + QA',
      note: 'Implemented workspace, data/access, and external automation layers, supported by automated and browser testing.',
      summary: 'Automated testing · Browser testing',
      details: ['Automated testing and browser testing are included in the supplied implementation evidence.'],
    },
  },
  {
    id: 'pasawise-cse',
    name: 'PasaWise CSE',
    category: 'Full-Stack Product / EdTech',
    status: 'Built / Web Application',
    statusTone: 'built',
    description: 'A web-based review platform for Filipino Civil Service Exam learners with structured lessons, practice, assessments, progress tracking, and targeted recovery workflows.',
    technologies: ['React', 'TypeScript', 'Vite', 'Hono', 'Cloudflare Workers', 'Cloudflare D1', 'SQL', 'Git', 'GitHub'],
    highlights: [
      'Authentication, access control, and dashboard.',
      'Curriculum roadmap, lesson reader, and structured teaching content.',
      'Practice, subject assessments, and full mock examination.',
      'Smart Recovery, progress tracking, and weak-area signals.',
      'Responsive UI with testing / QA.',
    ],
    resume: {
      "category": "Full-stack EdTech web application",
      "software": [
        "Built and iterated a Civil Service Exam review platform with authentication, access control, curriculum, lessons, practice, assessments, mock exams, progress, and recovery workflows.",
        "Worked with React, TypeScript, Vite, Hono, Cloudflare Workers, D1/SQL, responsive UI, and application QA.",
        "Designed and tested curriculum roadmaps, subject assessments, full mock examinations, and Smart Recovery."
      ],
      "operations": [
        "Broke product requirements into milestones for structured content, practice, assessment, and recovery workflows.",
        "Iterated learning flows through testing, debugging, and QA across authentication, access control, responsive UI, and progress/weak-area signals."
      ]
    },
    story: {
      headline: 'Learning continues after the result.',
      purpose: 'Move from structured lessons to practice and assessment, then use weak-area signals and Smart Recovery to guide targeted follow-up practice.',
      visual: {
        kind: 'learning',
        title: 'Learn. Practice. Measure. Recover.',
        description: 'A study loop that connects assessment results to the next round of learning.',
        stages: [
          { id: 'learn', label: 'Learn', description: 'Start with structured teaching content and a path through the curriculum.', features: ['Curriculum roadmap', 'Lesson reader', 'Structured teaching content'] },
          { id: 'practice', label: 'Practice', description: 'Work through practice questions and subject assessments.', features: ['Practice questions', 'Subject assessments'] },
          { id: 'measure', label: 'Measure', description: 'Read results and progress signals to identify weak areas.', features: ['Results', 'Progress signals', 'Weak areas', 'Full mock examination'] },
          { id: 'recover', label: 'Recover', description: 'Use Smart Recovery and targeted follow-up practice before continuing to the next study session.', features: ['Smart Recovery', 'Targeted follow-up practice'] },
        ],
      },
    },
    links: [{ label: 'View Live Project', href: 'https://pasawise.com/' }],
    evidence: {
      label: 'Implementation + QA',
      note: 'Implemented access control, structured study, assessments, and recovery workflows, with responsive UI and testing / QA.',
      summary: 'Responsive UI · Testing / QA',
      details: ['The supplied implementation includes responsive layouts, testing, and QA.'],
    },
  },
  {
    id: 'kivo',
    name: 'Kivo — Life Organizer',
    category: 'Consumer App',
    status: 'Private Alpha',
    statusTone: 'alpha',
    statusDetail: 'In Development',
    tagline: "Things you shouldn't have to keep in your head.",
    description: 'A private Android-first life organizer for dates, responsibilities, documents, belongings, bills, subscriptions, warranties, and everyday life administration.',
    technologies: ['Android', 'Capacitor'],
    highlights: [
      'Today for what needs attention now.',
      'PETSA for dates, commitments, reminders, and expirations.',
      'SAAN KO for the locations of belongings and important records.',
      'Search and Add for finding and capturing life-admin information.',
      'Offline/local-first behavior and responsive mobile layouts.',
    ],
    resume: {
      "category": "Android consumer application",
      "software": [
        "Building an Android-first life organizer around dates, responsibilities, documents, belongings, subscriptions, warranties, and everyday administration.",
        "Implemented Android builds, Capacitor integration, offline/local-first behavior, responsive mobile layouts, and automated QA."
      ],
      "operations": [
        "Organized life-admin workflows around Today, PETSA, SAAN KO, Search, and Add in a private-alpha Android product.",
        "Iterated milestone development with mobile QA, responsive layouts, and local/offline considerations for dates, belongings, records, and responsibilities."
      ]
    },
    story: {
      headline: 'Give everyday life administration a place.',
      purpose: 'Organize what needs attention, dates and commitments, saved locations, and the information people otherwise keep in their head.',
      visual: {
        kind: 'organizer',
        title: 'The structure behind the organizer.',
        description: 'A system diagram of the implemented product concepts.',
        concepts: [
          { id: 'today', label: 'Today', description: 'What needs attention now.' },
          { id: 'petsa', label: 'PETSA', description: 'Dates, commitments, reminders, and expirations.' },
          { id: 'saan-ko', label: 'SAAN KO', description: 'Where belongings or important records are located.' },
          { id: 'search', label: 'Search', description: 'Find saved information.' },
          { id: 'add', label: 'Add', description: 'Capture and organize life-admin information.' },
        ],
        categories: ['Bills', 'Subscriptions', 'Documents', 'Expirations', 'Warranties', 'Belongings', 'Responsibilities'],
      },
    },
    links: [],
    evidence: {
      label: 'Verified QA',
      note: 'Private-alpha Android application with APK builds and automated QA. In development.',
      checksLabel: 'Private-alpha implementation evidence',
      summary: `${kivoTests} automated tests`,
      metrics: [{ value: kivoTests, label: 'automated tests' }],
      checks: ['Android application', 'Capacitor integration', 'APK builds', 'Offline/local-first behavior', 'Responsive mobile layouts', 'Automated QA'],
      details: [`Latest supplied private-alpha evidence: ${kivoTests} automated tests. The Android application remains in development.`],
    },
  },
] as const satisfies readonly Project[]
