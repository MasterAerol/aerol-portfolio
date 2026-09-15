import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { ResumeRouter } from '../ResumeRouter'
import { profile } from '../data/profile'

const businessEmail = 'aerolilagan00@gmail.com'
const formerEmail = 'aerolilagan2002@gmail.com'
const linkedin = 'https://www.linkedin.com/in/aerol-ilagan-762830435'

describe('approved public contact channels', () => {
  it('shares the exact approved email and two canonical public profiles', () => {
    expect(profile.email).toBe(businessEmail)
    expect(profile.github).toBe('https://github.com/MasterAerol')
    expect(profile.linkedin).toBe(linkedin)
    expect(new URL(profile.linkedin).search).toBe('')
  })

  for (const route of ['/', '/resume/software', '/resume/operations', '/resume/general-va']) {
    it(`keeps ${route} contact links accessible, current, and free of tracking`, () => {
      render(<ResumeRouter pathname={route} />)
      expect(document.body).toHaveTextContent(businessEmail)
      expect(document.body).not.toHaveTextContent(formerEmail)
      expect(document.querySelectorAll(`a[href="mailto:${businessEmail}"]`)).toHaveLength(1)
      expect(document.querySelector(`a[href*="${formerEmail}"]`)).toBeNull()
      const links = screen.getAllByRole('link', { name: 'LinkedIn — Aerol Ilagan' })
      expect(links).toHaveLength(route === '/' ? 2 : 1)
      for (const link of links) {
        expect(link).toHaveAttribute('href', linkedin)
        // Follow the existing social links' same-tab behavior.
        expect(link).not.toHaveAttribute('target')
        expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
        expect(new URL(link.getAttribute('href')!).search).toBe('')
      }
      if (route === '/') {
        expect(links[0].closest('.hero-links')).not.toBeNull()
        expect(links[1].closest('#contact')).not.toBeNull()
      }
    })
  }

  it('keeps the no-JavaScript contact and Person metadata aligned', () => {
    const html = new DOMParser().parseFromString(readFileSync('index.html', 'utf8'), 'text/html')
    const fallback = html.querySelector('noscript')!
    expect(fallback.textContent).toContain(businessEmail)
    expect(fallback.innerHTML).toContain(`mailto:${businessEmail}`)
    expect(fallback.innerHTML).not.toContain(formerEmail)
    expect(fallback.innerHTML).toContain(linkedin)
    const person = JSON.parse(html.querySelector('script[type="application/ld+json"]')!.textContent!)
    expect(person.url).toBe('https://aerol-portfolio.master-course.workers.dev/')
    expect(person.sameAs).toEqual([profile.github, linkedin])
  })
})
