export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  id: string
  name: string
  category: string
  status: string | null
  description: string
  technologies: readonly string[]
  highlights: readonly string[]
  links: readonly ProjectLink[]
  evidence?: {
    summary: string
    details: readonly string[]
  }
  tagline?: string
}
