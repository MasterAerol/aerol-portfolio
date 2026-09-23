import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { ResumeRouter } from '../ResumeRouter'
import { ResumePage } from '../pages/ResumePage'
import { resumes } from '../data/resume'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import { education, training } from '../data/education'

const orders = {
  software: ['OpsCheck Flow', 'PasaWise CSE', 'AI Operations Automation Hub', 'Kivo — Life Organizer'],
  operations: ['AI Operations Automation Hub', 'OpsCheck Flow', 'PasaWise CSE', 'Kivo — Life Organizer'],
}

describe('targeted HTML resumes', () => {
  for (const variant of ['software', 'operations'] as const) {
    it(`renders the ${variant} route with accurate project ordering, proof and contact`, () => {
      render(<ResumeRouter pathname={`/resume/${variant}`} />)
      expect(document.title).toBe(resumes[variant].title)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name)
      expect(screen.getByText('Target role')).toBeVisible()
      expect(screen.getByText(resumes[variant].headline)).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Selected Project Experience' })).toBeVisible()
      expect(screen.getAllByRole('article').map(article => within(article).getByRole('heading', { level: 3 }).textContent)).toEqual(orders[variant])
      const ops = screen.getByRole('article', { name: 'OpsCheck Flow' })
      expect(ops).toHaveTextContent('Released — v0.1.0')
      expect(ops).toHaveTextContent('227 tests · 225 passed · 0 failed · 2 intentional Windows symlink skips')
      expect(within(ops).getByRole('link')).toHaveAttribute('href', projects[0].links[0].href)
      const kivo = screen.getByRole('article', { name: 'Kivo — Life Organizer' })
      expect(kivo).toHaveTextContent('Private Alpha / In Development')
      expect(kivo).toHaveTextContent('596 automated tests')
      expect(screen.getByRole('link', { name: /Email James Aerol/ })).toHaveAttribute('href', `mailto:${profile.email}`)
      expect(screen.getByRole('link', { name: /GitHub profile:/ })).toHaveAttribute('href', profile.github)
      expect(screen.getByRole('link', { name: 'LinkedIn — Aerol Ilagan' })).toHaveAttribute('href', profile.linkedin)
      expect(document.querySelector('canvas, .hero-visual, [download], a[href$=".pdf"]')).toBeNull()
      expect(screen.getByRole('link', { name: 'Back to Portfolio' })).toHaveAttribute('href', '/#resume')
    })

    it(`keeps ${variant} education, completed training and claims accurate`, () => {
      render(<ResumePage resume={resumes[variant]} />)
      const educationSection = screen.getByRole('region', { name: 'Education' })
      for (const value of Object.values(education)) expect(educationSection).toHaveTextContent(value)
      const trainingSection = screen.getByRole('region', { name: 'Completed Training' })
      for (const value of Object.values(training)) expect(trainingSection).toHaveTextContent(value)
      expect(document.body).not.toHaveTextContent(/Professional Experience|Employment History|Work Experience|OpenAI API|Docker|Resend|AWS|Kubernetes|Stripe|Play Store|Launching Soon|public users|exam pass rate|Udemy|certificate number|commercial experience/i)
      expect(document.body).toHaveTextContent('AI-assisted development with ChatGPT and Codex')
      const headings = screen.getAllByRole('heading', { level: 2 }).map(node => node.textContent)
      expect(headings).toEqual(['Summary', 'Selected Project Experience', 'Skills', 'Education', 'Completed Training'])
    })
  }

  it('uses shared object references rather than separate project histories', () => {
    for (const resume of Object.values(resumes)) {
      expect(resume.identity).toBe(profile)
      expect(resume.education).toBe(education)
      expect(resume.training).toBe(training)
      for (const project of resume.projects) expect(projects).toContain(project)
    }
    expect(resumes.software.skills.flatMap(group => group.items)).toContain('REST APIs')
    expect(projects[0].resume.software.join(' ')).toMatch(/atomic SQLite claims, lease-token fencing, heartbeat renewal/)
    expect(resumes.operations.summary).toMatch(/^Project-based experience/)
  })

  it('provides a real print button and screen-only controls without a fake PDF', () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {})
    render(<ResumePage resume={resumes.software} />)
    const button = screen.getByRole('button', { name: 'Print / Save as PDF' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button.closest('.screen-only')).not.toBeNull()
    fireEvent.click(button)
    expect(print).toHaveBeenCalledOnce()
    expect(document.querySelector('.resume-continuation')).toHaveClass('print-only')
    expect(document.querySelector('[download]')).toBeNull()
  })

  it('accepts trailing slashes and keeps unknown routes on the existing portfolio', () => {
    const { rerender } = render(<ResumeRouter pathname="/resume/software/" />)
    expect(document.querySelector('.resume-document')).not.toBeNull()
    rerender(<ResumeRouter pathname="/unknown/path" />)
    expect(document.querySelector('.resume-document')).toBeNull()
    expect(document.querySelector('.hero-visual')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('JAMES AEROLILAGAN.')
  })
})

for (const variant of ['software', 'operations', 'general-va'] as const) {
  it(`${variant} uses the real project link label and at most one link per project`, () => {
    render(<ResumePage resume={resumes[variant]} />)
    for (const project of resumes[variant].projects) {
      const article = screen.getByRole('article', { name: project.name })
      const links = within(article).queryAllByRole('link')
      expect(links).toHaveLength(Math.min(1, project.links.length))
      if (project.links.length) {
        const first = project.links[0]
        expect(links[0]).toHaveAttribute('href', first.href)
        expect(links[0]).toHaveAccessibleName(`${project.name} ${first.label}: ${first.href.replace('https://', '')}`)
        expect(links[0]).toHaveTextContent(`${first.label}: ${first.href.replace('https://', '')}`)
        if (first.label === 'View Live Project') expect(links[0]).not.toHaveTextContent('Repository:')
      }
    }
  })
}
