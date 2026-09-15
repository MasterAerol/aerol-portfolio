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
  'general-va': {
    ...shared,
    variant: 'general-va',
    title: 'James Aerol Ilagan — General VA & Data Entry Resume',
    headline: 'General Virtual Assistant',
    focus: 'Data Entry · Administrative Support · Research',
    summary: 'Civil Engineering graduate transitioning into remote support work, with hands-on, project-based experience managing independent digital projects, organizing structured information, researching solutions, documenting requirements, testing workflows, and using AI tools to improve productivity. Comfortable with detail-oriented and repetitive tasks, spreadsheet-based tracking, web research, documentation, quality checking, and learning unfamiliar software quickly.',
    projects: orderedProjects(['ai-operations-hub', 'pasawise-cse']),
    projectExperience: {
      'ai-operations-hub': {
        category: 'Independent / project-based work',
        bullets: [
          'Built and tested an operations workflow using Google Sheets, n8n automation, authenticated data handling, approval steps, task states, and verification checks.',
          'Organized workflow states, approval steps, task information, and validation checks to keep information structured and processes reliable.',
          'Used ChatGPT and Codex to research solutions, document requirements, troubleshoot issues, and improve repetitive workflows.',
        ],
      },
      'pasawise-cse': {
        category: 'Personal Project',
        bullets: [
          'Managed requirements, content, structured information, and testing across a multi-feature web platform.',
          'Performed detailed quality checks on desktop and mobile, documented issues, and iterated until workflows behaved as intended.',
          'Used AI-assisted tools for research, documentation, implementation support, and process improvement while learning new tools as needed.',
        ],
      },
    },
    skills: [
      { name: 'Administrative & Data', items: ['Data entry', 'Spreadsheet organization', 'Web research', 'Documentation', 'Information organization', 'Quality checking'] },
      { name: 'AI & Productivity', items: ['ChatGPT', 'Codex', 'AI-assisted research', 'AI-assisted documentation', 'Troubleshooting', 'Process improvement'] },
      { name: 'Workflow Tools', items: ['Google Sheets', 'Google Drive', 'n8n', 'Structured task tracking', 'Workflow testing'] },
      { name: 'Technical Foundation', items: ['Python fundamentals', 'Git / GitHub', 'Basic web systems', 'APIs', 'Databases'] },
    ],
  },
} as const satisfies Record<ResumeVariant, ResumeContent>
