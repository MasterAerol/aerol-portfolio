import { SectionHeading } from '../components/SectionHeading'
import { ProjectStory } from '../components/projects/ProjectStory'
import { projects } from '../data/projects'

export function SelectedWork() {
  return <section id="work" className="section container" aria-labelledby="work-title">
    <div className="section-intro">
      <SectionHeading number="02" label="SELECTED WORK" title="Built to do something useful." id="work-title" />
      <p>Four systems, from the problem they address to the workflows and evidence behind them.</p>
    </div>
    <div className="project-stories">{projects.map((project, index) => <ProjectStory key={project.id} project={project} index={index} />)}</div>
  </section>
}
