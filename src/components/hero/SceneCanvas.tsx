import { StrictMode, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createRoot, events, extend } from '@react-three/fiber'
import type { ReconcilerRoot, RootStore } from '@react-three/fiber'
import {
  AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, DirectionalLight,
  ExtrudeGeometry, Group, LineBasicMaterial, LineLoop, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, PointLight, SphereGeometry, WebGLRenderer,
} from 'three'
import { SceneErrorBoundary } from './SceneErrorBoundary'
import type { SceneProps } from './sceneTypes'

// A deliberately small catalogue; no models, texture loaders, controls or effects.
extend({ AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, DirectionalLight,
  ExtrudeGeometry, Group, LineBasicMaterial, LineLoop, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, PointLight, SphereGeometry })

type Props = SceneProps & { children: ReactNode }

/**
 * Own setup so rejected renderer initialization is caught (R3F Canvas 9's
 * asynchronous configure path cannot be caught by a React boundary alone).
 * A fresh canvas per effect keeps StrictMode cleanup isolated from remounts.
 */
export function SceneCanvas(props: Props) {
  const host = useRef<HTMLDivElement>(null)
  const latest = useRef(props)
  const root = useRef<ReconcilerRoot<HTMLCanvasElement> | null>(null)
  const store = useRef<RootStore | null>(null)
  latest.current = props

  useEffect(() => {
    const container = host.current!
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.tabIndex = -1
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    container.appendChild(canvas)
    let cancelled = false
    let renderer: WebGLRenderer | undefined
    let localRoot: ReconcilerRoot<HTMLCanvasElement> | undefined
    const onLost = (event: Event) => {
      event.preventDefault()
      if (!cancelled) latest.current.onFailure()
    }
    canvas.addEventListener('webglcontextlost', onLost)

    const resize = () => {
      const state = store.current?.getState()
      const bounds = container.getBoundingClientRect()
      if (state && bounds.width > 0 && bounds.height > 0 &&
        (state.size.width !== bounds.width || state.size.height !== bounds.height)) {
        state.setSize(bounds.width, bounds.height)
      }
    }
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    observer?.observe(container)
    window.addEventListener('resize', resize)

    async function initialize() {
      try {
        // Check the actual display canvas too: capability can change after probing.
        const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' })
        if (!context) { latest.current.onFailure(); return }
        renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: 'low-power' })
        localRoot = createRoot(canvas)
        root.current = localRoot
        const bounds = container.getBoundingClientRect()
        await localRoot.configure({
          gl: renderer,
          events,
          camera: { position: [0, 0, 8.6], fov: 40, near: 0.1, far: 30 },
          size: { width: bounds.width, height: bounds.height, top: 0, left: 0 },
          // One device pixel per CSS pixel keeps the geometric scene affordable on dense displays.
          dpr: 1,
          frameloop: latest.current.active ? 'always' : 'demand',
          shadows: false,
          onCreated: state => state.events.connect?.(canvas),
        })
        if (cancelled) return
        store.current = localRoot.render(<StrictMode><SceneErrorBoundary onFailure={latest.current.onFailure}>{latest.current.children}</SceneErrorBoundary></StrictMode>)
        const state = store.current.getState()
        state.setFrameloop(latest.current.active ? 'always' : 'demand')
        resize()
      } catch {
        if (!cancelled) latest.current.onFailure()
      }
    }
    void initialize()
    return () => {
      cancelled = true
      observer?.disconnect()
      window.removeEventListener('resize', resize)
      root.current = null
      store.current = null
      localRoot?.unmount()
      renderer?.dispose()
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.remove()
    }
  }, [])

  useEffect(() => {
    const state = store.current?.getState()
    if (!state || !root.current) return
    state.setFrameloop(props.active ? 'always' : 'demand')
    root.current.render(<StrictMode><SceneErrorBoundary onFailure={props.onFailure}>{props.children}</SceneErrorBoundary></StrictMode>)
    state.invalidate()
  }, [props.active, props.compact, props.children, props.onFailure])

  return <div ref={host} className="hero-canvas" />
}
