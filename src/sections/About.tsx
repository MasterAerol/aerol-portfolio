import { SectionHeading } from '../components/SectionHeading'

export function About() {
  return <section id="about" className="section container about-section" aria-labelledby="about-title">
    <SectionHeading number="01" label="ABOUT" title="Useful systems. Thoughtfully built." id="about-title" />
    <div className="about-content">
      <p className="lead">I'm Aerol, a software builder focused on useful systems, automation, and digital products.</p>
      <p>I like understanding how a workflow really works, finding where the friction is, and turning that into software.</p>
      <div className="approach-note">
        <span className="eyebrow">AI-ASSISTED. HUMAN-REVIEWED.</span>
        <p>I use ChatGPT and Codex heavily for implementation, debugging, QA, and iteration. My work also involves defining requirements, product decisions, architecture, milestone planning, testing, Git/GitHub, and reviewing generated work.</p>
      </div>
    </div>
  </section>
}
