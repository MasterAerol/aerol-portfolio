import type { Project } from './project'
import type { profile } from '../data/profile'
import type { education, training } from '../data/education'

export type ResumeVariant = 'software' | 'operations'
export interface ResumeContent {
  variant: ResumeVariant
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
