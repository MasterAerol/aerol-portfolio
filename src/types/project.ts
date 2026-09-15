export interface ProjectLink { label: string; href: string }
export interface StoryNode {
  id: string
  label: string
  description: string
  features?: readonly string[]
}
interface VisualBase { title: string; description: string }
export type ProjectVisual =
  | (VisualBase & { kind: 'workflow'; review: readonly (readonly StoryNode[])[]; recovery: readonly StoryNode[] })
  | (VisualBase & { kind: 'layers'; layers: readonly StoryNode[] })
  | (VisualBase & { kind: 'learning'; stages: readonly StoryNode[] })
  | (VisualBase & { kind: 'organizer'; concepts: readonly StoryNode[]; categories: readonly string[] })
export interface Project {
  id: string
  name: string
  category: string
  status: string
  statusTone: 'released' | 'built' | 'alpha'
  statusDetail?: string
  description: string
  technologies: readonly string[]
  highlights: readonly string[]
  links: readonly ProjectLink[]
  story: { headline: string; purpose: string; visual: ProjectVisual }
  evidence: {
    label: 'Verified QA' | 'Implementation + QA'
    note: string
    checksLabel?: string
    summary: string
    details: readonly string[]
    metrics?: readonly { value: number; label: string }[]
    checks?: readonly string[]
  }
  resume: { category: string; software: readonly string[]; operations: readonly string[] }
  tagline?: string
}
