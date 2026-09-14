import { SectionHeading } from '../components/SectionHeading'
import { processSteps } from '../data/content'

export function HowIWork() {
  return <section id="process" className="section container" aria-labelledby="process-title">
    <SectionHeading number="04" label="HOW I WORK" title="Clarity first. Then build." id="process-title" />
    <ol className="process-grid">{processSteps.map((step, index) => <li key={step.title}>
      <span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <h3>{step.title}</h3><p>{step.description}</p>
    </li>)}</ol>
  </section>
}
