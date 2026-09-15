import { useEffect } from 'react'
import { Icon } from '../components/Icon'
import type { ResumeContent } from '../types/resume'

export function ResumePage({ resume }: { resume: ResumeContent }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = resume.title
    return () => { document.title = previousTitle }
  }, [resume.title])
  return <div className="resume-page">
    <a className="skip-link screen-only" href="#resume-document">Skip to resume</a>
    <nav className="resume-toolbar screen-only" aria-label="Resume actions">
      <a href="/#resume">Back to Portfolio</a>
      <button type="button" onClick={() => window.print()}>Print / Save as PDF</button>
    </nav>
    <main className="resume-document" id="resume-document" tabIndex={-1}>
      <header className="resume-identity">
        <h1>{resume.identity.name}</h1>
        <p className="resume-target-label">Target role</p>
        <p className="resume-headline">{resume.headline}</p>
        <p className="resume-focus">{resume.focus}</p>
        <div className="resume-contact">
          <a href={`mailto:${resume.identity.email}`} aria-label={`Email ${resume.identity.name}: ${resume.identity.email}`}>{resume.identity.email}</a>
          <a href={resume.identity.github} aria-label={`GitHub profile: ${resume.identity.github.replace('https://', '')}`}>{resume.identity.github.replace('https://', '')}</a>
          <a href={resume.identity.linkedin} aria-label="LinkedIn — Aerol Ilagan"><Icon name="linkedin" /><span>LinkedIn — Aerol Ilagan</span></a>
        </div>
      </header>
      <section className="resume-section" aria-labelledby="resume-summary-heading">
        <h2 id="resume-summary-heading">Summary</h2>
        <p>{resume.summary}</p>
      </section>
      <section className="resume-section" aria-labelledby="resume-projects-heading">
        <h2 id="resume-projects-heading">Selected Project Experience</h2>
        <div className="resume-projects">{resume.projects.map((project, index) => <article className={`resume-project ${index === 2 ? 'resume-next-page' : ''}`} key={project.id} aria-labelledby={`resume-${project.id}`}>
          {index === 2 && <p className="print-only resume-continuation">{resume.identity.name} · {resume.headline} · continued</p>}
          <div className="resume-project-heading"><h3 id={`resume-${project.id}`}>{project.name}</h3><p>{project.status}{project.statusDetail && ` / ${project.statusDetail}`}</p></div>
          <p className="resume-project-category">{project.resume.category}</p>
          <ul>{project.resume[resume.variant].map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
          <p className="resume-evidence"><strong>Validation:</strong> {project.evidence.metrics ? project.evidence.metrics.map(metric => `${metric.value} ${metric.label}`).join(' · ') : project.evidence.summary}</p>
          {project.links.length > 0 && <div className="resume-project-links">{project.links.slice(0, 1).map(link => <a key={link.href} href={link.href} aria-label={`${project.name} Repository: ${link.href.replace('https://', '')}`}><span>Repository: </span>{link.href.replace('https://', '')}</a>)}</div>}
        </article>)}</div>
      </section>
      <section className="resume-section" aria-labelledby="resume-skills-heading">
        <h2 id="resume-skills-heading">Skills</h2>
        <dl className="resume-skills">{resume.skills.map(group => <div key={group.name}><dt>{group.name}</dt><dd>{group.items.join(' · ')}</dd></div>)}</dl>
        <p className="resume-disclosure">{resume.disclosure}</p>
      </section>
      <div className="resume-credentials">
        <section className="resume-section" aria-labelledby="resume-education-heading">
          <h2 id="resume-education-heading">Education</h2>
          <h3>{resume.education.degree}</h3><p>{resume.education.major}</p>
          <p>{resume.education.school} · {resume.education.years}</p>
        </section>
        <section className="resume-section" aria-labelledby="resume-training-heading">
          <h2 id="resume-training-heading">Completed Training</h2>
          <h3>{resume.training.title}</h3><p>{resume.training.provider}</p>
          <p>{resume.training.duration} · {resume.training.date}</p>
        </section>
      </div>
    </main>
  </div>
}
