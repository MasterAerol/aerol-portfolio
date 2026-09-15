export const capabilities = [
  {
    title: 'Software Development',
    icon: 'code',
    description: 'Build the tools that make work easier.',
    items: ['Web applications', 'Python tooling', 'Internal systems', 'Database-backed applications', 'APIs'],
  },
  {
    title: 'AI & Automation',
    icon: 'workflow',
    description: 'Connect the steps. Keep people in control.',
    items: ['Workflow automation', 'AI-assisted operations', 'Process improvement', 'Workflow design', 'Human review systems'],
  },
  {
    title: 'Technical / Operations Support',
    icon: 'layers',
    description: 'Bring structure to the work behind the work.',
    items: ['Research and information organization', 'Documentation', 'Workflow setup', 'Process mapping', 'Reporting', 'Task/system organization'],
  },
] as const

export const processSteps = [
  { title: 'Understand the work', description: 'Start with the people, the requirements, and the workflow. Find the actual problem before choosing a solution.' },
  { title: 'Define a clear path', description: 'Make product and architecture decisions, map the process, and break the work into manageable milestones.' },
  { title: 'Build, test, review', description: 'Use AI-assisted development with deliberate review, debugging, automated checks, and browser testing.' },
  { title: 'Iterate with evidence', description: 'Check what works, document decisions, and refine the system through Git/GitHub and focused iterations.' },
] as const

// The portfolio skill list preserves its approved scope. Milestone 5 separately
// verifies REST APIs for the Developer resume. ChatGPT/Codex are established by the About brief.
export const skillGroups = [
  { name: 'Development', items: ['Python', 'TypeScript', 'JavaScript', 'React', 'HTML', 'CSS', 'SQL'] },
  { name: 'Backend / Systems', items: ['SQLite', 'PostgreSQL', 'Supabase', 'Cloudflare Workers', 'Cloudflare D1', 'Hono', 'Authentication', 'Row Level Security', 'Workflow orchestration'] },
  { name: 'Automation', items: ['n8n', 'Google Sheets automation', 'Workflow design', 'Human-in-the-loop systems', 'AI-assisted development'] },
  { name: 'Tools', items: ['Git', 'GitHub', 'GitHub Actions', 'Codex', 'ChatGPT'] },
] as const

export const opportunities = [
  'Junior Software Developer',
  'AI Automation / AI Operations',
  'Technical Virtual Assistant',
  'Operations Virtual Assistant',
  'Workflow / Process Automation',
] as const

export const resumeTracks = [
  { id: 'developer-resume', variant: 'software', path: '/resume/software', title: 'Software / Developer Resume', description: 'Software development, systems, and product work.' },
  { id: 'operations-resume', variant: 'operations', path: '/resume/operations', title: 'AI Operations / Technical VA Resume', description: 'Automation, technical support, and operations.' },
] as const
