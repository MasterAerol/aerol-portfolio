import { projects } from '../../data/projects'

const identities = [
  { id: 'opscheck-flow', glyph: 'O', orbit: 0, phase: 4.65, speed: 0.052 },
  { id: 'ai-operations-hub', glyph: 'AI', orbit: 1, phase: 2.95, speed: 0.041 },
  { id: 'pasawise-cse', glyph: 'P', orbit: 0, phase: 0.1, speed: -0.047 },
  { id: 'kivo', glyph: 'K', orbit: 2, phase: 1.35, speed: 0.035 },
] as const

// Names are read from the approved content source, never duplicated in WebGL copy.
export const projectNodes = identities.map(identity => {
  const project = projects.find(project => project.id === identity.id)
  if (!project) throw new Error('A hero identity must reference an approved project.')
  return { ...identity, name: project.name }
})

export type ProjectNodeIdentity = (typeof projectNodes)[number]
