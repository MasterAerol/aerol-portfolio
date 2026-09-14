import { SectionHeading } from '../components/SectionHeading'
import { skillGroups } from '../data/content'

export function Skills() {
  return <section id="skills" className="section container skills-section" aria-labelledby="skills-title">
    <SectionHeading number="05" label="SKILLS" title="The tools behind the work." id="skills-title" />
    <div className="skills-list">{skillGroups.map(group => <div className="skill-group" key={group.name}>
      <h3>{group.name}</h3>
      <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
    </div>)}</div>
  </section>
}
