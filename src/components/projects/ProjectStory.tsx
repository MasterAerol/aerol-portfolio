import { useEffect, useRef, useState } from 'react'
import type { Project } from '../../types/project'
import { Icon } from '../Icon'
import { ProjectDiagram } from './ProjectVisuals'

export function ProjectStory({ project, index }: { project: Project; index: number }) {
  const article = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect() }
    }, { threshold: 0.08 })
    if (article.current) observer.observe(article.current)
    return () => observer.disconnect()
  }, [])
  const number = String(index + 1).padStart(2, '0')
  const diagramId = `${project.id}-diagram`
  return <article ref={article} className={`project-story project-${project.id} ${index % 2 ? 'story-reversed' : ''}`} aria-labelledby={`${project.id}-title`} data-entered={entered}>
    <div className="story-intro">
      <div className="story-meta"><span className="story-number">PROJECT {number}</span><p className="project-category">{project.category}</p></div>
      {project.status && <span className={`status-badge ${project.id === 'kivo' ? 'status-alpha' : ''}`}>{project.status}</span>}
      <h3 id={`${project.id}-title`}>{project.name}</h3>
      {project.tagline && <p className="project-tagline">{project.tagline}</p>}
      <p className="project-description">{project.description}</p>
      <div className="story-narrative"><h4>{project.story.headline}</h4><p>{project.story.purpose}</p></div>
    </div>
    <figure className={`project-visual visual-${project.story.visual.kind}`} aria-labelledby={`${diagramId}-title`}>
      <figcaption>
        <p className="diagram-kicker"><span aria-hidden="true">{number} / </span>SYSTEM DIAGRAM</p>
        <h4 id={`${diagramId}-title`}>{project.story.visual.title}</h4>
        <p>{project.story.visual.description}</p>
      </figcaption>
      <ProjectDiagram visual={project.story.visual} id={diagramId} />
    </figure>
    <div className="story-body">
      <div className="story-capabilities"><h4>Implemented capabilities</h4><ul>{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul></div>
      <div className="story-technologies"><h4>Technologies & systems</h4><ul className="technology-list" aria-label={`${project.name} technologies and systems`}>{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></div>
      <div className="story-proof">
        <h4>Proof & validation</h4>
        {project.evidence.metrics ? <dl className="proof-metrics" aria-label={project.evidence.summary}>{project.evidence.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl> : <p className="evidence-summary">{project.evidence.summary}</p>}
        {project.evidence.checks && <ul className="proof-checks" aria-label={project.id === 'opscheck-flow' ? 'Cross-platform CI' : 'Private-alpha implementation evidence'}>{project.evidence.checks.map(check => <li key={check}>{check}</li>)}</ul>}
        <details className="project-details"><summary><span>Validation notes<span className="sr-only"> for {project.name}</span></span><span className="details-plus" aria-hidden="true">+</span></summary><div className="project-detail-body">{project.evidence.details.map(detail => <p key={detail}>{detail}</p>)}</div></details>
      </div>
      {project.links.length > 0 && <div className="project-links">{project.links.map(link => <a key={link.href} href={link.href} aria-label={`${project.name} — ${link.label}`}>{link.label}<Icon name="arrow-up-right" /></a>)}</div>}
    </div>
  </article>
}
