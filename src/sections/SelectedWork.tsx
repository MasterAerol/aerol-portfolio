import { SectionHeading } from '../components/SectionHeading'
import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../data/projects'

export function SelectedWork() {
  return <section id="work" className="section container" aria-labelledby="work-title">
    <div className="section-intro">
      <SectionHeading number="02" label="SELECTED WORK" title="Built to do something useful." id="work-title" />
      <p>From durable workflow systems to everyday tools. A closer look at what I've been building.</p>
    </div>
    <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
  </section>
}
