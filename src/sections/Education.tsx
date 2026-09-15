import { education } from '../data/education'
import { SectionHeading } from '../components/SectionHeading'

export function Education() {
  return <section id="education" className="section container education-section" aria-labelledby="education-title">
    <SectionHeading number="08" label="EDUCATION" title="A foundation in problem-solving." id="education-title" />
    <div className="education-content">
      <span className="education-year">{education.years}</span>
      <h3>{education.degree}</h3>
      <p>{education.major}</p>
      <p className="education-school">{education.school}</p>
    </div>
  </section>
}
