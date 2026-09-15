import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { readFileSync, readdirSync } from 'node:fs'
import { SelectedWork } from '../sections/SelectedWork'
import { Resume } from '../sections/Resume'
import { Contact } from '../sections/Contact'
import { projects } from '../data/projects'
import { profile } from '../data/profile'

const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
afterEach(() => {
  if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor)
  else Reflect.deleteProperty(navigator, 'clipboard')
})
function mockClipboard(value: unknown) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value })
}

describe('recruiter proof and readiness', () => {
  it('distinguishes release, built work and private alpha with visible evidence labels', () => {
    render(<SelectedWork />)
    for (const status of ['Released — v0.1.0', 'Built / Workflow Prototype', 'Built / Web Application', 'Private Alpha', 'In Development']) expect(screen.getByText(status)).toBeVisible()
    expect(screen.getAllByText('Verified QA')).toHaveLength(2)
    expect(screen.getAllByText('Implementation + QA')).toHaveLength(2)
    expect(screen.getByText('Open-source release with cross-platform automated validation.')).toBeVisible()
    expect(screen.getByText('CI environments')).toHaveTextContent('4 CI environments')
    expect(document.getElementById('work')).not.toHaveTextContent(/production.proven|enterprise.grade|OpenAI API|Docker|Resend|AWS|Kubernetes|Stripe|public users|bank integration|cloud sync|PasaWise CE/)
    for (const project of projects) expect(within(screen.getByRole('article', { name: project.name })).getByText(project.evidence.note)).toBeVisible()
  })

  it('offers only the two supplied public project CTAs with meaningful names and indicators', () => {
    render(<SelectedWork />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    for (const [name, href] of [
      ['OpsCheck Flow — View Repository', 'https://github.com/MasterAerol/opscheck-flow'],
      ['OpsCheck Flow — View v0.1.0 Release', 'https://github.com/MasterAerol/opscheck-flow/releases/tag/v0.1.0'],
    ]) {
      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('href', href)
      expect(link).not.toHaveAttribute('target')
      expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('keeps absent approved media and resumes out of the UI', () => {
    render(<><SelectedWork /><Resume /></>)
    // There are no approved product screenshots or PDFs in public assets.
    const assets = readdirSync('public', { recursive: true }).map(String)
    expect(assets.filter(path => /\.(pdf|png|jpe?g|webp|avif|mp4)$/i.test(path))).toEqual([])
    expect(document.querySelector('#work img, #work video, .media-gallery, [download], a[href$=".pdf"]')).toBeNull()
    const resume = within(document.getElementById('resume')!)
    for (const button of resume.getAllByRole('button')) {
      expect(button).toBeDisabled()
      expect(button).toHaveAccessibleName(/resume being prepared/i)
      expect(button).toHaveAccessibleDescription('Download will be available when the resume is ready.')
    }
  })

  it('labels the four selected projects as project experience rather than employment', () => {
    render(<Resume />)
    expect(screen.getByRole('heading', { name: 'Selected Project Experience' })).toBeVisible()
    expect(screen.getAllByRole('listitem').map(node => node.textContent)).toEqual(projects.map(project => project.name))
    expect(document.getElementById('resume')).not.toHaveTextContent(/Professional Experience|Paid Employment|employer|certification|Udemy/)
  })

  it('copies the verified email and announces success without blocking alerts', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    mockClipboard({ writeText })
    const alert = vi.spyOn(window, 'alert')
    render(<Contact />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy email' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Email copied.'))
    expect(writeText).toHaveBeenCalledWith('aerolilagan2002@gmail.com')
    expect(alert).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute('href', `mailto:${profile.email}`)
    expect(screen.getByRole('link', { name: 'GitHub / MasterAerol' })).toHaveAttribute('href', profile.github)
    expect(document.getElementById('contact')).not.toHaveTextContent(/LinkedIn/)
  })

  for (const state of ['unavailable', 'rejected']) {
    it(`keeps contact usable when clipboard is ${state}`, async () => {
      mockClipboard(state === 'unavailable' ? undefined : { writeText: vi.fn().mockRejectedValue(new Error('Denied')) })
      render(<Contact />)
      fireEvent.click(screen.getByRole('button', { name: 'Copy email' }))
      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copy unavailable. Select the address above or use the email link.'))
      expect(screen.getByRole('button', { name: 'Copy email' })).toBeEnabled()
      expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute('href', `mailto:${profile.email}`)
    })
  }

  it('provides exact professional metadata, truthful Person data and the existing brand favicon', () => {
    const html = new DOMParser().parseFromString(readFileSync('index.html', 'utf8'), 'text/html')
    const title = 'James Aerol Ilagan — Software, Automation & Operations'
    const description = 'Portfolio of James Aerol Ilagan showcasing software development, workflow automation, systems engineering, and digital product work.'
    expect(html.title).toBe(title)
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) expect(html.querySelector(selector)?.getAttribute('content')).toBe(description)
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) expect(html.querySelector(selector)?.getAttribute('content')).toBe(title)
    expect(html.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary')
    expect(html.querySelector('link[rel="canonical"], meta[property="og:url"], meta[property="og:image"], meta[name="twitter:site"], meta[name="twitter:creator"]')).toBeNull()
    const person = JSON.parse(html.querySelector('script[type="application/ld+json"]')!.textContent!)
    expect(person).toEqual({
      '@context': 'https://schema.org', '@type': 'Person', name: profile.name,
      sameAs: [profile.github],
      knowsAbout: ['Software Development', 'Workflow Automation', 'Python', 'TypeScript', 'React', 'Supabase', 'Cloudflare Workers'],
    })
    const favicon = html.querySelector('link[rel="icon"]')?.getAttribute('href')
    expect(favicon).toBe('/favicon.svg')
    const svg = new DOMParser().parseFromString(readFileSync('public/favicon.svg', 'utf8'), 'image/svg+xml')
    expect(svg.querySelector('parsererror')).toBeNull()
    expect(svg.querySelector('circle')?.getAttribute('fill')).toBe('#55d4ee')
  })
})
