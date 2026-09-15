import { SectionHeading } from '../components/SectionHeading'
import { Icon } from '../components/Icon'
import { projects } from '../data/projects'
import { resumeTracks } from '../data/content'

export function Resume() {
  return <section id="resume" className="section container" aria-labelledby="resume-title">
    <SectionHeading number="07" label="RESUME" title="Two paths. The same thoughtful approach." id="resume-title" />
    <div className="resume-summary">
      <div><h3>Focus</h3><p>Software Development · Automation · Operations Systems</p></div>
      <div><h3>Selected Project Experience</h3><ul>{projects.map(project => <li key={project.id}>{project.name}</li>)}</ul></div>
    </div>
    <div className="resume-grid">{resumeTracks.map(track => <article className="resume-card" key={track.id}>
      <Icon name="file" /><h3>{track.title}</h3><p>{track.description}</p>
      <a className="button resume-button" href={track.path} aria-describedby={`${track.id}-note`} aria-label={`${track.title} — View Resume`}>View Resume<Icon name="arrow-up-right" /></a>
      <p className="resume-note" id={`${track.id}-note`}>Print / Save as PDF from the resume page.</p>
    </article>)}</div>
  </section>
}
