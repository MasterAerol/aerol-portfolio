import type { Project } from '../../types/project'
import { Icon } from '../Icon'

export function ProjectStatus({ project }: { project: Project }) {
  return <div className="project-status">
    <span className={`status-badge status-${project.statusTone}`}>{project.status}</span>
    {project.statusDetail && <span className="status-detail">{project.statusDetail}</span>}
  </div>
}

export function ProjectLinks({ project }: { project: Project }) {
  if (!project.links.length) return null
  return <div className="project-links">{project.links.map(link => <a key={link.href} href={link.href} aria-label={`${project.name} — ${link.label}`}>{link.label}<Icon name="arrow-up-right" /></a>)}</div>
}

export function ProjectProof({ project }: { project: Project }) {
  const { evidence } = project
  return <div className="story-proof">
    <div className="proof-heading"><h4>Proof & validation</h4><span className="proof-kind">{evidence.label}</span></div>
    {evidence.metrics ? <dl className="proof-metrics" aria-label={evidence.summary}>{evidence.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl> : <p className="evidence-summary">{evidence.summary}</p>}
    {evidence.checks && <div className="proof-environments">
      <p className="proof-check-label">{evidence.checksLabel === 'CI environments' && <span>{evidence.checks.length} </span>}{evidence.checksLabel}</p>
      <ul className="proof-checks" aria-label={evidence.checksLabel}>{evidence.checks.map(check => <li key={check}>{check}</li>)}</ul>
    </div>}
    <p className="evidence-note">{evidence.note}</p>
    <ProjectLinks project={project} />
    <details className="project-details"><summary><span>Validation notes<span className="sr-only"> for {project.name}</span></span><span className="details-plus" aria-hidden="true">+</span></summary><div className="project-detail-body">{evidence.details.map(detail => <p key={detail}>{detail}</p>)}</div></details>
  </div>
}
