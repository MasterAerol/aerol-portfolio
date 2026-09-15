import { describe, expect, it } from 'vitest'
import { projects } from '../data/projects'
import { readFileSync } from 'node:fs'

describe('verified project data', () => {
  it('has exactly four unique projects and no empty content or technology fields', () => {
    expect(projects).toHaveLength(4)
    expect(new Set(projects.map(project => project.id)).size).toBe(4)
    for (const project of projects) {
      expect(project.name.trim()).not.toBe('')
      expect(project.category.trim()).not.toBe('')
      expect(project.description.trim()).not.toBe('')
      expect(project.technologies.length).toBeGreaterThan(0)
      expect(project.technologies.every(technology => technology.trim().length > 0)).toBe(true)
      expect(project.highlights.length).toBeGreaterThan(0)
      expect(project).toHaveProperty('status')
      expect(project).toHaveProperty('links')
    }
  })

  it('preserves the supplied OpsCheck release, links, stack, and validation snapshot', () => {
    const project = projects[0]
    expect(project.status).toBe('Released — v0.1.0')
    expect(project.evidence.summary).toBe('227 tests · 225 passed · 2 intentional skips')
    expect(project.links.map(link => link.href)).toEqual([
      'https://github.com/MasterAerol/opscheck-flow',
      'https://github.com/MasterAerol/opscheck-flow/releases/tag/v0.1.0',
    ])
    expect(project.technologies).toEqual(['Python', 'SQLite', 'Git', 'GitHub', 'GitHub Actions', 'HTML reports', 'JSON reports'])
    expect(project.evidence.details[0]).toBe('Validation snapshot: 227 tests total; 225 passed; 0 failed; 2 intentional Windows symlink skips.')
    expect(project.evidence.checks).toEqual(['Ubuntu / Python 3.10', 'Ubuntu / Python 3.12', 'Ubuntu / Python 3.14', 'Windows / Python 3.12'])
    expect(JSON.stringify(project)).not.toMatch(/AI agent|227 passing/)
  })

  it('keeps Hub and PasaWise built status conservative and public links unspecified', () => {
    for (const project of [projects[1], projects[2]]) {
      expect(project.status).toMatch(/^Built \/ (Workflow Prototype|Web Application)$/)
      expect(project.links).toEqual([])
    }
    expect(projects[1].technologies).toEqual(['Supabase', 'Supabase Auth', 'PostgreSQL', 'Row Level Security (RLS)', 'n8n', 'Google Sheets', 'TypeScript', 'JavaScript', 'Git', 'GitHub', 'Automated testing', 'Browser testing'])
    expect(projects[2].technologies).toEqual(['React', 'TypeScript', 'Vite', 'Hono', 'Cloudflare Workers', 'Cloudflare D1', 'SQL', 'Git', 'GitHub'])
    expect(projects[2].name).toBe('PasaWise CSE')
    expect(projects[1].name).toBe('AI Operations Automation Hub')
    expect(projects[1].category).toBe('Operations Automation / Workflow Systems')
  })

  it('preserves private alpha status and the limited Kivo evidence', () => {
    const project = projects[3]
    expect(project.status).toBe('Private Alpha')
    expect(project.links).toEqual([])
    expect(project.technologies).toEqual(['Android', 'Capacitor'])
    expect(project.evidence.summary).toBe('596 automated tests')
    expect(project.evidence.checks).toEqual(['Android application', 'Capacitor integration', 'APK builds', 'Offline/local-first behavior', 'Responsive mobile layouts', 'Automated QA'])
    expect(project.evidence.details.join(' ')).not.toContain('app.kivo.lifeorganizer')
    expect(JSON.stringify(project)).not.toMatch(/596 passed|596 passing|Play Store|Launching Soon|React|TypeScript/)
  })

  it('contains no unsupported metrics or technology claims', () => {
    expect(JSON.stringify(projects)).not.toMatch(/OpenAI API|Docker|Resend|AWS|Kubernetes|Stripe|paid AI APIs|revenue|customers|PasaWise CE/)
    for (const project of projects) {
      for (const link of project.links) {
        const url = new URL(link.href)
        expect(url.protocol).toBe('https:')
        expect(url.hostname).toBe('github.com')
        expect(link.label.trim()).not.toBe('')
      }
    }
  })

  it('sets the supplied SEO title and description with the verified production canonical URL', () => {
    const html = readFileSync('index.html', 'utf8')
    expect(html).toContain('James Aerol Ilagan — Software, Automation &amp; Operations')
    expect(html).toContain('Portfolio of James Aerol Ilagan showcasing software development, workflow automation, systems engineering, and digital product work.')
    expect(html).toContain('<html lang="en">')
    expect(html).toContain('<link rel="canonical" href="https://aerol-portfolio.master-course.workers.dev/" />')
  })
})
