import type { Project } from '../types/project'
import { Icon } from './Icon'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className={`project-card project-${project.id}`} aria-labelledby={`${project.id}-title`}>
    <div className="project-meta">
      <span className="project-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <p className="project-category">{project.category}</p>
      {project.status && <span className={`status-badge ${project.id === 'kivo' ? 'status-alpha' : ''}`}>{project.status}</span>}
    </div>
    <h3 id={`${project.id}-title`}>{project.name}</h3>
    {project.tagline && <p className="project-tagline">{project.tagline}</p>}
    <p className="project-description">{project.description}</p>
    <ul className="technology-list" aria-label={`${project.name} technologies and systems`}>
      {project.technologies.map(technology => <li key={technology}>{technology}</li>)}
    </ul>
    <div className="project-bottom">
      {project.evidence && <p className="evidence-summary"><span aria-hidden="true">↳</span>{project.evidence.summary}</p>}
      <details className="project-details">
        <summary><span>Explore project details<span className="sr-only"> for {project.name}</span></span><span className="details-plus" aria-hidden="true">+</span></summary>
        <div className="project-detail-body">
          <h4>What it does</h4>
          <ul>{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
          {project.evidence && <div className="project-evidence"><h4>Validation evidence</h4>{project.evidence.details.map(detail => <p key={detail}>{detail}</p>)}</div>}
        </div>
      </details>
      {project.links.length > 0 && <div className="project-links">
        {project.links.map(link => <a key={link.href} href={link.href} aria-label={`${project.name} — ${link.label}`}>{link.label}<Icon name="arrow-up-right" /></a>)}
      </div>}
    </div>
  </article>
}
