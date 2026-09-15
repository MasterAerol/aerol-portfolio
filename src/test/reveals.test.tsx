import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RevealEyebrow, RevealHeading } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

function observerHarness(reduced = false) {
  let callback: IntersectionObserverCallback
  let preferenceChanged: (event: MediaQueryListEvent) => void
  const disconnect = vi.fn()
  const observe = vi.fn()
  const Observer = vi.fn(function (this: object, next: IntersectionObserverCallback) { callback = next })
  Observer.prototype.observe = observe
  Observer.prototype.disconnect = disconnect
  vi.stubGlobal('IntersectionObserver', Observer)
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn((_type, listener) => { preferenceChanged = listener }),
    removeEventListener: vi.fn(),
  } as unknown as MediaQueryList)
  return {
    Observer, observe, disconnect,
    enter: () => act(() => callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)),
    reduce: () => act(() => preferenceChanged({ matches: true } as MediaQueryListEvent)),
  }
}

// React selects the prefixed event in jsdom when AnimationEvent is absent.
function endAnimation(node: Element) {
  fireEvent(node, new Event('AnimationEvent' in window ? 'animationend' : 'webkitAnimationEnd', { bubbles: true }))
}

describe('progressive heading reveals', () => {
  it('keeps a complete semantic heading and literal text while waiting for observation', () => {
    observerHarness()
    const title = 'Useful systems. Thoughtfully built.'
    render(<RevealHeading id="about-title" words>{title}</RevealHeading>)
    const heading = screen.getByRole('heading', { name: title, level: 2 })
    expect(heading).toHaveTextContent(title)
    expect(heading.textContent).toBe(title)
    expect(heading).toHaveAttribute('data-reveal-state', 'idle')
    expect(heading).toHaveAttribute('aria-label', title)
    expect(heading.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(heading).not.toHaveAttribute('hidden')
    expect(screen.getAllByRole('heading')).toHaveLength(1)
  })

  it('finishes only after the last staggered word and never replays on another entry', () => {
    const observer = observerHarness()
    render(<RevealHeading words>Clarity first. Then build.</RevealHeading>)
    const heading = screen.getByRole('heading')
    observer.enter()
    expect(heading).toHaveAttribute('data-reveal-state', 'revealing')
    endAnimation(heading.querySelector('.reveal-word')!)
    expect(heading).toHaveAttribute('data-reveal-state', 'revealing')
    endAnimation(heading.querySelector('[data-reveal-last]')!)
    expect(heading).toHaveAttribute('data-reveal-state', 'complete')
    observer.enter()
    expect(heading).toHaveAttribute('data-reveal-state', 'complete')
    expect(observer.disconnect).toHaveBeenCalled()
  })

  it('uses the final static state immediately for reduced motion without observing', () => {
    const observer = observerHarness(true)
    render(<SectionHeading number="01" label="ABOUT" title="Useful systems." id="about-title" />)
    expect(observer.Observer).not.toHaveBeenCalled()
    expect(screen.getByRole('heading')).toHaveAttribute('data-reveal-state', 'complete')
    expect(screen.getByText('ABOUT')).toHaveAttribute('data-reveal-state', 'complete')
  })

  it('consumes an active reveal immediately when reduced motion is enabled', () => {
    const observer = observerHarness()
    render(<RevealHeading>Good work starts with a conversation.</RevealHeading>)
    observer.enter()
    observer.reduce()
    expect(screen.getByRole('heading')).toHaveAttribute('data-reveal-state', 'complete')
    observer.enter()
    expect(screen.getByRole('heading')).toHaveAttribute('data-reveal-state', 'complete')
  })

  for (const failure of ['missing', 'constructor', 'observe'] as const) {
    it(`leaves headings and eyebrows static if IntersectionObserver is ${failure}`, () => {
      if (failure === 'missing') vi.stubGlobal('IntersectionObserver', undefined)
      else {
        vi.stubGlobal('IntersectionObserver', class {
          constructor() { if (failure === 'constructor') throw new Error('Unavailable') }
          observe() { throw new Error('Unavailable') }
          disconnect() {}
        })
      }
      render(<><RevealEyebrow><span>09</span> CONTACT</RevealEyebrow><RevealHeading id="contact-title">Let's build<br />something <span>useful.</span></RevealHeading></>)
      const heading = screen.getByRole('heading')
      expect(heading).toHaveAttribute('data-reveal-state', 'complete')
      expect(heading).toHaveTextContent("Let's buildsomething useful.")
      expect(heading.querySelector('br')).not.toBeNull()
      expect(heading.querySelector(':scope > span')).toHaveTextContent('useful.')
    })
  }

  it('disconnects and removes the preference listener on unmount', () => {
    const observer = observerHarness()
    const { unmount } = render(<RevealHeading>Clarity first.</RevealHeading>)
    unmount()
    expect(observer.disconnect).toHaveBeenCalled()
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener).toHaveBeenCalled()
  })
})
