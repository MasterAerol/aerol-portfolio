import { SectionHeading } from '../components/SectionHeading'
import { Icon } from '../components/Icon'
import { capabilities } from '../data/content'

export function Capabilities() {
  return <section id="capabilities" className="section container" aria-labelledby="capabilities-title">
    <SectionHeading number="03" label="WHAT I CAN HELP WITH" title="A builder's mindset. Beyond the code." id="capabilities-title" />
    <div className="capability-grid">
      {capabilities.map(capability => <article className="capability" key={capability.title}>
        <div className="capability-icon"><Icon name={capability.icon} /></div>
        <h3>{capability.title}</h3>
        <p>{capability.description}</p>
        <ul>{capability.items.map(item => <li key={item}>{item}</li>)}</ul>
      </article>)}
    </div>
  </section>
}
