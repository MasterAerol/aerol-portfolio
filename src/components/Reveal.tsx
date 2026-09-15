import { Fragment, type AnimationEvent, type CSSProperties, type ReactNode } from 'react'
import { useRevealOnce } from '../hooks/useRevealOnce'

type HeadingProps = {
  as?: 'h2' | 'h3' | 'h4'
  id?: string
  children: ReactNode
  words?: boolean
}

export function RevealHeading({ as: Tag = 'h2', id, children, words = false }: HeadingProps) {
  const { ref, state, complete } = useRevealOnce<HTMLHeadingElement>()
  const title = words && typeof children === 'string' ? children : undefined
  const parts = title?.match(/\S+|\s+/g) ?? []
  const wordCount = parts.filter(part => part.trim()).length
  let wordIndex = 0
  const animationEnded = (event: AnimationEvent<HTMLHeadingElement>) => {
    // Word events bubble: consume the reveal only when its final word finishes.
    if (event.target === event.currentTarget || (event.target as HTMLElement).dataset.revealLast === 'true') complete()
  }

  return <Tag ref={ref} id={id} className={title ? 'reveal-heading reveal-words' : 'reveal-heading'} data-reveal-state={state} aria-label={title} onAnimationEnd={animationEnded}>
    {title ? <span aria-hidden="true">{parts.map((part, index) => {
      if (!part.trim()) return <Fragment key={index}>{part}</Fragment>
      const current = wordIndex++
      return <span key={index} className="reveal-word" data-reveal-last={current === wordCount - 1 ? 'true' : undefined} style={{ '--word-delay': `${Math.min(current * 60, 360)}ms` } as CSSProperties}>{part}</span>
    })}</span> : children}
  </Tag>
}

export function RevealEyebrow({ children }: { children: ReactNode }) {
  const { ref, state, complete } = useRevealOnce<HTMLParagraphElement>()
  return <p ref={ref} className="eyebrow reveal-eyebrow" data-reveal-state={state} onAnimationEnd={event => { if (event.target === event.currentTarget) complete() }}>{children}</p>
}
