import { profile } from './profile'
import { projects } from './projects'
import { skillGroups, capabilities } from './content'
import { education, training } from './education'
import type { ResumeContent, ResumeVariant } from '../types/resume'

type ProjectId = typeof projects[number]['id']
function orderedProjects(ids: readonly ProjectId[]) {
  return ids.map(id => projects.find(project => project.id === id)!)
}

const shared = {
  identity: profile,
  education,
  training,
  disclosure: 'I use AI-assisted development with ChatGPT and Codex for implementation, debugging, code review, and iteration while defining requirements, validating behavior, and reviewing generated work.',
}

export const resumes = {
  software: {
    ...shared,
    variant: 'software',
    title: 'James Aerol Ilagan — Software Developer Resume',
    headline: 'Junior Software Developer',
    focus: 'Software Systems · Full-Stack Projects · AI-Assisted Development',
    summary: 'Hands-on personal project experience building software systems and web applications. I translate requirements into implementation milestones, work with databases and authentication, and design workflows around testing, debugging, and recovery. My process combines Git/GitHub, AI-assisted implementation, and human review of generated work.',
    projects: orderedProjects(['opscheck-flow', 'pasawise-cse', 'ai-operations-hub', 'kivo']),
    skills: [
      { name: 'Programming / Web', items: skillGroups[0].items },
      { name: 'Backend / Systems', items: ['SQLite', 'PostgreSQL', 'Supabase', 'Supabase Auth', 'Row Level Security', 'Cloudflare Workers', 'Cloudflare D1', 'Hono', 'REST APIs', 'Workflow orchestration'] },
      { name: 'Automation / Engineering', items: ['n8n', 'Google Sheets automation', 'Git', 'GitHub', 'GitHub Actions', 'Testing / debugging', 'Browser testing', 'AI-assisted development'] },
    ],
  },
  operations: {
    ...shared,
    variant: 'operations',
    title: 'James Aerol Ilagan — AI Operations & Technical VA Resume',
    headline: 'AI Operations / Technical Virtual Assistant',
    focus: 'Workflow Automation · Technical Operations · Systems Support',
    summary: 'Project-based experience organizing operational workflows, turning requests into structured tasks, and building automation with review and controlled data access. I bring process mapping, documentation, research and information organization, QA, and technical troubleshooting to software projects, learning unfamiliar tools as the work requires.',
    projects: orderedProjects(['ai-operations-hub', 'opscheck-flow', 'pasawise-cse', 'kivo']),
    skills: [
      { name: 'Operations / Systems Support', items: capabilities[2].items },
      { name: 'Workflow / Data', items: ['Workflow design', 'Human review systems', 'n8n', 'Google Sheets automation', 'Supabase Auth', 'PostgreSQL', 'Row Level Security', 'SQL'] },
      { name: 'Technical / QA', items: ['Python', 'TypeScript', 'JavaScript', 'Git', 'GitHub', 'Testing / debugging', 'Browser testing', 'AI-assisted development'] },
    ],
  },
} as const satisfies Record<ResumeVariant, ResumeContent>
