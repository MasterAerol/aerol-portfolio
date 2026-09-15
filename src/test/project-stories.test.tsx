import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectedWork } from '../sections/SelectedWork'
import { projects } from '../data/projects'

const names = ['OpsCheck Flow', 'AI Operations Automation Hub', 'PasaWise CSE', 'Kivo — Life Organizer']

describe('interactive project stories', () => {
  it('renders four ordered case studies with visible narratives and distinct diagrams', () => {
    render(<SelectedWork />)
    const stories = screen.getAllByRole('article')
    expect(stories.map(story => within(story).getByRole('heading', { level: 3 }).textContent)).toEqual(names)
    expect(document.querySelectorAll('.project-card, canvas, img, video')).toHaveLength(0)
    expect(document.querySelectorAll('.project-visual')).toHaveLength(4)
    for (const [index, story] of stories.entries()) {
      expect(within(story).getByText(projects[index].story.purpose)).toBeVisible()
      expect(within(story).getByText('Implemented capabilities')).toBeVisible()
      expect(within(story).getByText('Proof & validation')).toBeVisible()
    }
  })

  it('shows exact OpsCheck proof, release status, and all supplied CI environments', () => {
    render(<SelectedWork />)
    const ops = within(screen.getByRole('article', { name: names[0] }))
    const metrics = ops.getByLabelText('227 tests · 225 passed · 2 intentional skips')
    expect([...metrics.querySelectorAll('dd')].map(node => node.textContent)).toEqual(['227', '225', '0', '2'])
    expect([...metrics.querySelectorAll('dt')].map(node => node.textContent)).toEqual(['tests', 'passed', 'failed', 'intentional Windows symlink skips'])
    for (const label of ['Ubuntu Python 3.10', 'Ubuntu Python 3.12', 'Ubuntu Python 3.14', 'Windows Python 3.12']) expect(ops.getByText(label)).toBeVisible()
    expect(ops.getByText('Released — v0.1.0')).toBeVisible()
  })

  it('supports worker recovery and replay using Enter and Space', async () => {
    const user = userEvent.setup()
    render(<SelectedWork />)
    const ops = within(screen.getByRole('article', { name: names[0] }))
    expect(ops.getByRole('button', { name: 'Quality worker' })).toBeVisible()
    expect(ops.getByText('Human decision: revise or complete')).toBeVisible()
    const recovery = ops.getByRole('button', { name: 'Recovery path' })
    recovery.focus()
    await user.keyboard('{Enter}')
    expect(recovery).toHaveAttribute('aria-pressed', 'true')
    for (const label of ['Worker', 'Lease / heartbeat', 'Failure', 'Retry / backoff', 'Dead letter', 'Replay']) expect(ops.getByRole('button', { name: label })).toBeVisible()
    const replay = ops.getByRole('button', { name: 'Replay' })
    replay.focus()
    await user.keyboard(' ')
    expect(replay).toHaveAttribute('aria-pressed', 'true')
    expect(document.getElementById(replay.getAttribute('aria-controls')!)).toHaveTextContent('run retained work again')
  })

  it('selects Workspace, Data, and Automation and exposes the supplied layer features', async () => {
    const user = userEvent.setup()
    render(<SelectedWork />)
    const hub = within(screen.getByRole('article', { name: names[1] }))
    for (const label of ['Workspace', 'Data', 'Automation']) {
      const button = hub.getByRole('button', { name: new RegExp(label) })
      button.focus()
      await user.keyboard('{Enter}')
      expect(button).toHaveAttribute('aria-pressed', 'true')
      expect(document.getElementById(button.getAttribute('aria-controls')!)).toHaveTextContent(label)
    }
    expect(document.querySelector('#ai-operations-hub-diagram-insight')).toHaveTextContent('n8n')
    expect(document.querySelector('#ai-operations-hub-diagram-insight')).toHaveTextContent('Google Sheets')
  })

  it('connects Learn, Practice, Measure, and Recover to factual features', async () => {
    const user = userEvent.setup()
    render(<SelectedWork />)
    const study = within(screen.getByRole('article', { name: names[2] }))
    for (const [stage, feature] of [['Learn', 'Lesson reader'], ['Practice', 'Subject assessments'], ['Measure', 'Weak areas'], ['Recover', 'Smart Recovery']]) {
      const button = study.getByRole('button', { name: new RegExp(stage) })
      await user.click(button)
      expect(button).toHaveAttribute('aria-pressed', 'true')
      expect(document.getElementById(button.getAttribute('aria-controls')!)).toHaveTextContent(feature)
    }
  })

  it('keeps Kivo private-alpha evidence and all five implemented concepts', async () => {
    const user = userEvent.setup()
    render(<SelectedWork />)
    const article = screen.getByRole('article', { name: names[3] })
    const kivo = within(article)
    expect(kivo.getByText('Private Alpha')).toBeVisible()
    expect(kivo.getByLabelText('596 automated tests')).toBeVisible()
    for (const label of ['Today', 'PETSA', 'SAAN KO', 'Search', 'Add']) {
      const button = kivo.getByRole('button', { name: label })
      await user.click(button)
      expect(button).toHaveAttribute('aria-pressed', 'true')
    }
    expect(article).not.toHaveTextContent(/Play Store|Launching soon|596 passed|bank integration|app\.kivo/)
    expect([...article.querySelectorAll('.technology-list li')].map(node => node.textContent)).toEqual(['Android', 'Capacitor'])
  })

  it('renders only verified technology content and supplied external links', () => {
    render(<SelectedWork />)
    for (const project of projects) {
      const article = screen.getByRole('article', { name: project.name })
      const technologies = article.querySelector('.technology-list')!
      expect([...technologies.querySelectorAll('li')].map(node => node.textContent)).toEqual(project.technologies)
      expect(technologies).not.toHaveTextContent(/OpenAI API|Docker|Resend|AWS|Kubernetes/)
      expect(article.querySelectorAll('a')).toHaveLength(project.links.length)
      for (const link of project.links) expect(within(article).getByRole('link', { name: `${project.name} — ${link.label}` })).toHaveAttribute('href', link.href)
    }
  })

  it('uses native buttons, unique controlled panels, and decorative SVG connectors', () => {
    render(<SelectedWork />)
    for (const svg of document.querySelectorAll('figure svg')) {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('focusable', 'false')
    }
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveAttribute('aria-pressed')
      expect(document.querySelectorAll(`[id="${button.getAttribute('aria-controls')}"]`)).toHaveLength(1)
    }
  })
})
