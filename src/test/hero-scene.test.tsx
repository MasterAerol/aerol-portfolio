import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffect } from 'react'
import { Hero } from '../sections/Hero'
import { projectNodes } from '../components/hero/projectNodes'
import { projects } from '../data/projects'
import { supportsWebGL } from '../components/hero/sceneSupport'
import type { SceneProps } from '../components/hero/sceneTypes'

const scene = vi.hoisted(() => ({ renders: 0, failRender: false, props: null as SceneProps | null }))
vi.mock('../components/hero/sceneSupport', () => ({ supportsWebGL: vi.fn() }))
vi.mock('../components/hero/HeroScene', () => ({
  default: function MockScene(props: SceneProps) {
    scene.renders++
    scene.props = props
    useEffect(() => props.onReady(), [props.onReady])
    if (scene.failRender) throw new Error('Simulated scene render failure')
    return <canvas data-testid="animated-scene" data-active={props.active} tabIndex={-1} />
  },
}))

type MediaEntry = { matches: boolean; listeners: Set<() => void> }
let media: Map<string, MediaEntry>
const reducedQuery = '(prefers-reduced-motion: reduce)'
const fineQuery = '(hover: hover) and (pointer: fine)'

function changeMedia(query: string, matches: boolean) {
  act(() => {
    const entry = media.get(query)!
    entry.matches = matches
    entry.listeners.forEach(listener => listener())
  })
}

beforeEach(() => {
  scene.renders = 0
  scene.failRender = false
  scene.props = null
  vi.mocked(supportsWebGL).mockReset().mockReturnValue(true)
  media = new Map()
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false })
  vi.mocked(window.matchMedia).mockImplementation(query => {
    if (!media.has(query)) media.set(query, { matches: query === fineQuery, listeners: new Set() })
    const entry = media.get(query)!
    return {
      get matches() { return entry.matches }, media: query, onchange: null,
      addEventListener: (_event: string, listener: EventListenerOrEventListenerObject) => entry.listeners.add(listener as () => void),
      removeEventListener: (_event: string, listener: EventListenerOrEventListenerObject) => entry.listeners.delete(listener as () => void),
      addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
    }
  })
})
afterEach(() => {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false })
})

describe('optional interactive hero', () => {
  it('references exactly the four approved projects without duplicating names', () => {
    expect(projectNodes.map(node => node.id)).toEqual(['opscheck-flow', 'ai-operations-hub', 'pasawise-cse', 'kivo'])
    expect(projectNodes.map(node => node.name)).toEqual(projects.map(project => project.name))
    expect(projectNodes.map(node => node.glyph)).toEqual(['O', 'AI', 'P', 'K'])
    expect(new Set(projectNodes.map(node => node.id)).size).toBe(4)
  })

  it('keeps the approved hero HTML and every CTA with an animated enhancement', async () => {
    render(<Hero />)
    await screen.findByTestId('animated-scene')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('JAMES AEROLILAGAN.')
    expect(screen.getByText('Software Developer · AI Automation · Operations')).toBeInTheDocument()
    expect(screen.getByText('I build reliable software, automate repetitive work, and turn ideas into working products.')).toBeInTheDocument()
    expect(screen.getByText('Open to remote opportunities')).toBeInTheDocument()
    for (const [label, href] of [['View My Work','#work'],['Resume','#resume'],['GitHub','https://github.com/MasterAerol'],['Contact','#contact']]) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href)
    }
    expect(document.querySelector('.hero-visual')).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses the static visual without probing or mounting WebGL in reduced motion', async () => {
    media.set(reducedQuery, { matches: true, listeners: new Set() })
    render(<Hero />)
    expect(screen.getByTestId('scene-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('animated-scene')).not.toBeInTheDocument()
    expect(supportsWebGL).not.toHaveBeenCalled()
    expect(scene.renders).toBe(0)
    expect(screen.getByRole('link', { name: 'View My Work' })).toBeInTheDocument()
  })

  it('responds to reduced-motion preference changes without losing content', async () => {
    render(<Hero />)
    await screen.findByTestId('animated-scene')
    changeMedia(reducedQuery, true)
    await waitFor(() => expect(screen.queryByTestId('animated-scene')).not.toBeInTheDocument())
    expect(screen.getByTestId('scene-fallback')).toBeInTheDocument()
    changeMedia(reducedQuery, false)
    await screen.findByTestId('animated-scene')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('keeps the static identity and hero links when WebGL is unavailable', () => {
    vi.mocked(supportsWebGL).mockReturnValue(false)
    render(<Hero />)
    expect(screen.getByTestId('scene-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('animated-scene')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })

  it('returns to the fallback after a renderer failure', async () => {
    render(<Hero />)
    await screen.findByTestId('animated-scene')
    act(() => scene.props!.onFailure())
    await waitFor(() => expect(screen.queryByTestId('animated-scene')).not.toBeInTheDocument())
    expect(screen.getByTestId('scene-fallback')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('isolates React scene render errors from the portfolio', async () => {
    scene.failRender = true
    const expectedError = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<Hero />)
    await waitFor(() => expect(document.querySelector('.hero-visual')).toHaveAttribute('data-scene-state', 'fallback'))
    expect(screen.getByTestId('scene-fallback')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resume' })).toBeInTheDocument()
    expectedError.mockRestore()
  })

  it('pauses a mounted scene while the document is hidden', async () => {
    render(<Hero />)
    const canvas = await screen.findByTestId('animated-scene')
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
    fireEvent(document, new Event('visibilitychange'))
    await waitFor(() => expect(canvas).toHaveAttribute('data-active', 'false'))
    expect(screen.getByTestId('animated-scene')).toBe(canvas)
  })

  it('stores bounded pointer targets without triggering React renders', async () => {
    render(<Hero />)
    await screen.findByTestId('animated-scene')
    const boundary = document.querySelector('.hero-visual')!
    vi.spyOn(boundary, 'getBoundingClientRect').mockReturnValue(new DOMRect(100,100,400,300))
    const renders = scene.renders
    const move = new MouseEvent('pointermove', { bubbles: true, clientX: 700, clientY: 600 })
    Object.defineProperty(move, 'pointerType', { value: 'mouse' })
    fireEvent(boundary, move)
    expect(scene.props!.pointer.current).toEqual({ x: 1, y: -1, inside: true })
    expect(scene.renders).toBe(renders)
    fireEvent.pointerLeave(boundary)
    expect(scene.props!.pointer.current).toEqual({ x: 0, y: 0, inside: false })
  })
})
