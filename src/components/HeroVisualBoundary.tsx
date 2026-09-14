import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { SceneFallback } from './hero/SceneFallback'
import { SceneErrorBoundary } from './hero/SceneErrorBoundary'
import { supportsWebGL } from './hero/sceneSupport'
import type { SceneColors } from './hero/sceneTypes'

const HeroScene = lazy(() => import('./hero/HeroScene'))

function useMediaQuery(query: string, initial: boolean) {
  const [matches, setMatches] = useState(initial)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

/** The HTML hero remains independent of this optional, lazy WebGL enhancement. */
export function HeroVisualBoundary() {
  const container = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0, inside: false })
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', true)
  const compact = useMediaQuery('(max-width: 767px)', false)
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)', false) && !compact
  const [supported, setSupported] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const [colors, setColors] = useState<SceneColors>({
    graphite: '#101417', surface: '#151b20', white: '#f1f4f5', accent: '#55d4ee', line: '#a4adb5',
  })
  const onReady = useCallback(() => setReady(true), [])
  const onFailure = useCallback(() => { setFailed(true); setReady(false) }, [])

  useEffect(() => {
    if (reducedMotion) {
      setReady(false)
      pointer.current = { x: 0, y: 0, inside: false }
      return
    }
    setSupported(supportsWebGL())
    const styles = getComputedStyle(document.documentElement)
    setColors({
      graphite: styles.getPropertyValue('--surface').trim() || '#101417',
      surface: styles.getPropertyValue('--surface-raised').trim() || '#151b20',
      white: styles.getPropertyValue('--text').trim() || '#f1f4f5',
      accent: styles.getPropertyValue('--accent').trim() || '#55d4ee',
      line: styles.getPropertyValue('--muted').trim() || '#a4adb5',
    })
  }, [reducedMotion])

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    const observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 })
      : null
    if (container.current) observer?.observe(container.current)
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const animate = supported && !reducedMotion && !failed
  const active = animate && visible && pageVisible
  const state = failed ? 'fallback' : reducedMotion ? 'reduced-motion' : animate ? ready ? 'ready' : 'loading' : 'fallback'

  return <div ref={container} className={`hero-visual hero-visual-3d ${finePointer ? 'has-fine-pointer' : 'has-coarse-pointer'}`} aria-hidden="true" data-scene-state={state} data-scene-active={active}
    onPointerMove={event => {
      if (!finePointer || !active || event.pointerType !== 'mouse') return
      pointer.current.inside = true
      const bounds = event.currentTarget.getBoundingClientRect()
      pointer.current.x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1))
      pointer.current.y = Math.max(-1, Math.min(1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1))
    }}
    onPointerLeave={() => { pointer.current.x = 0; pointer.current.y = 0; pointer.current.inside = false }}
    onPointerCancel={() => { pointer.current.x = 0; pointer.current.y = 0; pointer.current.inside = false }}>
    {(!ready || !animate) && <SceneFallback />}
    {animate && <SceneErrorBoundary onFailure={onFailure}>
      <Suspense fallback={null}>
        <HeroScene active={active} compact={compact} finePointer={finePointer} colors={colors} pointer={pointer} onReady={onReady} onFailure={onFailure} />
      </Suspense>
    </SceneErrorBoundary>}
    <span className="visual-caption">IDEAS → SYSTEMS → PRODUCTS</span>
    <span className="visual-axis">AEROL / CORE</span>
  </div>
}
