import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResumeRouter } from '../ResumeRouter'
import { projects } from '../data/projects'

const forbiddenClaims = /OpenAI API|Docker|Resend|\bAWS\b|Kubernetes|Stripe|enterprise.grade|production.proven|thousands of users|\bclients\b|\bcustomers\b|Professional Experience|Employment History|paid employment|Play Store|launching soon|bank integration|cloud sync|payment execution|PasaWise CE/i

describe('final published-content guardrails', () => {
  it('keeps exactly the approved featured projects in their approved order', () => {
    expect(projects.map(project => project.name)).toEqual([
      'OpsCheck Flow', 'AI Operations Automation Hub', 'PasaWise CSE', 'Kivo — Life Organizer',
    ])
    const hub = projects[1]
    expect(hub.category).toBe('Operations Automation / Workflow Systems')
    expect(hub.technologies.join(' ')).not.toMatch(forbiddenClaims)
    expect(projects[0].evidence.checks).toEqual([
      'Ubuntu / Python 3.10', 'Ubuntu / Python 3.12', 'Ubuntu / Python 3.14', 'Windows / Python 3.12',
    ])
  })

  for (const path of ['/', '/resume/software', '/resume/operations']) {
    it(`keeps all rendered ${path} content and links within verified claims`, () => {
      render(<ResumeRouter pathname={path} />)
      expect(document.body).not.toHaveTextContent(forbiddenClaims)
      expect(document.querySelectorAll(path === '/' ? '#work article' : '.resume-project')).toHaveLength(4)
      expect(document.querySelector('a[href$=".pdf"], [download]')).toBeNull()
      for (const link of document.querySelectorAll<HTMLAnchorElement>('a')) {
        const href = link.getAttribute('href')
        expect(href).toBeTruthy()
        expect(href).not.toBe('#')
        expect(href).not.toMatch(/^(javascript:|data:)/i)
      }
      expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1')
    })
  }
})
