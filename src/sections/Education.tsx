import { SectionHeading } from '../components/SectionHeading'

export function Education() {
  return <section id="education" className="section container education-section" aria-labelledby="education-title">
    <SectionHeading number="08" label="EDUCATION" title="A foundation in problem-solving." id="education-title" />
    <div className="education-content">
      <span className="education-year">2021–2025</span>
      <h3>Bachelor of Science in Civil Engineering</h3>
      <p>Major in Structural Engineering</p>
      <p className="education-school">Notre Dame of Marbel University</p>
    </div>
  </section>
}
