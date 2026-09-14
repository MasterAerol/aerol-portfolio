import { Icon } from '../components/Icon'
import { profile } from '../data/profile'

export function Contact() {
  return <section id="contact" className="contact-section container" aria-labelledby="contact-title">
    <p className="eyebrow"><span>09</span> CONTACT</p>
    <h2 id="contact-title">Let's build<br />something <span>useful.</span></h2>
    <div className="contact-bottom">
      <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Icon name="arrow-up-right" /></a>
      <a className="contact-github" href={profile.github}><Icon name="github" />GitHub / MasterAerol<Icon name="arrow-up-right" /></a>
    </div>
  </section>
}
