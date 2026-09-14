import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { navigation, profile } from '../data/profile'
import { projects } from '../data/projects'

describe('portfolio foundation', () => {
  it('renders the semantic page and all ten main sections', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getAllByRole('region')).toHaveLength(10)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    for (const id of ['home', 'about', 'work', 'capabilities', 'process', 'skills', 'opportunities', 'resume', 'education', 'contact']) {
      const section = document.getElementById(id)
      expect(section).toHaveAttribute('aria-labelledby')
      const headingId = section?.getAttribute('aria-labelledby')
      expect(document.getElementById(headingId!)).toBeInTheDocument()
    }
    expect(screen.getByText(profile.positioning)).toBeInTheDocument()
  })

  it('resolves every internal navigation and CTA anchor to a unique target', () => {
    render(<App />)
    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href')!
      if (href.startsWith('#')) {
        expect(document.querySelectorAll(href)).toHaveLength(1)
      }
    }
    const nav = screen.getByRole('navigation', { name: 'Primary navigation' })
    for (const item of navigation) {
      expect(within(nav).getByRole('link', { name: item.label })).toHaveAttribute('href', item.href)
    }
  })

  it('opens the menu and returns focus to its toggle on Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    const toggle = screen.getByRole('button', { name: 'Open navigation menu' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('closes the menu after a navigation selection or outside click', async () => {
    const user = userEvent.setup()
    render(<App />)
    const toggle = screen.getByRole('button', { name: 'Open navigation menu' })
    await user.click(toggle)
    await user.click(within(screen.getByRole('navigation')).getByRole('link', { name: 'Work' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    await user.click(screen.getByRole('heading', { level: 1 }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders each project once with meaningful links and disclosures', () => {
    render(<App />)
    const work = document.getElementById('work')!
    expect(within(work).getAllByRole('article')).toHaveLength(4)
    for (const project of projects) {
      const article = within(work).getByRole('article', { name: project.name })
      expect(within(article).getByText(project.description)).toBeInTheDocument()
      expect(within(article).getByText('Explore project details')).toBeInTheDocument()
      for (const technology of project.technologies) {
        expect(within(article).getByText(technology, { exact: true })).toBeInTheDocument()
      }
      expect(article.querySelectorAll('a')).toHaveLength(project.links.length)
      for (const link of project.links) {
        expect(within(article).getByRole('link', { name: `${project.name} — ${link.label}` })).toHaveAttribute('href', link.href)
      }
    }
  })

  it('makes both resume tracks explicitly unavailable without fake downloads', () => {
    render(<App />)
    const resume = document.getElementById('resume')!
    const buttons = within(resume).getAllByRole('button', { name: /resume being prepared/i })
    expect(buttons).toHaveLength(2)
    for (const button of buttons) {
      expect(button).toBeDisabled()
      expect(button).toHaveAccessibleDescription('Download will be available when the resume is ready.')
    }
    expect(resume.querySelector('a')).toBeNull()
    expect(document.querySelector('[download]')).toBeNull()
  })

  it('exposes the supplied contact channels and transparent AI-assistance copy', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute('href', `mailto:${profile.email}`)
    expect(screen.getByRole('link', { name: 'GitHub / MasterAerol' })).toHaveAttribute('href', profile.github)
    expect(screen.getByText(/I use ChatGPT and Codex heavily/)).toBeInTheDocument()
    expect(document.body).not.toHaveTextContent(/LinkedIn|OpenAI API|Docker|Resend|Available on Play Store|Launching Soon/)
    expect(screen.getByText('Technical Virtual Assistant')).toBeInTheDocument()
    expect(screen.getByText('Operations Virtual Assistant')).toBeInTheDocument()
  })

  it('keeps the visual boundary decorative and independent of hero content', () => {
    render(<App />)
    expect(document.querySelector('.hero-visual')).toHaveAttribute('aria-hidden', 'true')
    expect(document.querySelector('canvas')).toBeNull()
    expect(screen.getByRole('link', { name: 'View My Work' })).toHaveAttribute('href', '#work')
  })
})
