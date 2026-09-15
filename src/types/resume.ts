import type { Project } from './project'
import type { profile } from '../data/profile'
import type { education, training } from '../data/education'

export type ResumeVariant = 'software' | 'operations' | 'general-va'
interface ResumeBase {
  title: string
  headline: string
  focus: string
  summary: string
  identity: typeof profile
  education: typeof education
  training: typeof training
  disclosure: string
  projects: readonly Project[]
  skills: readonly { name: string; items: readonly string[] }[]
}

export type ResumeContent = ResumeBase & (
  | { variant: 'software' | 'operations' }
  | { variant: 'general-va'; projectExperience: Readonly<Record<string, { category: string; bullets: readonly string[] }>> }
)
