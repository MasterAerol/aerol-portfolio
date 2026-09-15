import { useEffect, useRef, useState } from 'react'
import type { Project } from '../../types/project'
import { ProjectProof, ProjectStatus } from './ProjectProof'
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
      <ProjectStatus project={project} />
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
      <ProjectProof project={project} />
    </div>
  </article>
}
