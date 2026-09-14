import { SectionHeading } from '../components/SectionHeading'
import { Icon } from '../components/Icon'
import { opportunities } from '../data/content'

export function Opportunities() {
  return <section id="opportunities" className="section container opportunities-section" aria-labelledby="opportunities-title">
    <div>
      <SectionHeading number="06" label="OPEN TO OPPORTUNITIES" title="Good work starts with a conversation." id="opportunities-title" />
      <p>Open to remote opportunities where I can build, automate, support, and keep learning.</p>
      <a className="text-link" href="#contact">Let's talk<Icon name="arrow-up-right" /></a>
    </div>
    <ul className="opportunity-list">{opportunities.map(role => <li key={role}><span aria-hidden="true">↗</span>{role}</li>)}</ul>
  </section>
}
