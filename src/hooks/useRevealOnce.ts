import { useCallback, useEffect, useRef, useState } from 'react'

type RevealState = 'idle' | 'revealing' | 'complete'

/** Text is visible while idle; only a successful viewport entry adds animation. */
export function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [state, setState] = useState<RevealState>('idle')
  const complete = useCallback(() => setState('complete'), [])

  useEffect(() => {
    let active = true
    let consumed = false
    let observer: IntersectionObserver | undefined
    const motion = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : undefined
    const settle = () => {
      consumed = true
      observer?.disconnect()
      if (active) complete()
    }
    const preferenceChanged = (event: MediaQueryListEvent) => {
      if (event.matches) settle()
    }
    motion?.addEventListener?.('change', preferenceChanged)

    if (!ref.current || !motion || motion.matches || typeof IntersectionObserver === 'undefined') {
      settle()
    } else {
      try {
        observer = new IntersectionObserver(entries => {
          if (active && !consumed && entries.some(entry => entry.isIntersecting)) {
            consumed = true
            observer?.disconnect()
            setState('revealing')
          }
        }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' })
        observer.observe(ref.current)
      } catch {
        settle()
      }
    }
    return () => {
      active = false
      observer?.disconnect()
      motion?.removeEventListener?.('change', preferenceChanged)
    }
  }, [complete])

  return { ref, state, complete }
}
