import { useState } from 'react'
import { RevealEyebrow, RevealHeading } from '../components/Reveal'
import { Icon } from '../components/Icon'
import { profile } from '../data/profile'

export function Contact() {
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'unavailable'>('idle')
  async function copyEmail() {
    setCopyState('copying')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(profile.email)
      setCopyState('copied')
    } catch {
      setCopyState('unavailable')
    }
  }
  return <section id="contact" className="contact-section container" aria-labelledby="contact-title">
    <RevealEyebrow><span>09</span> CONTACT</RevealEyebrow>
    <RevealHeading id="contact-title">Let's build<br />something <span>useful.</span></RevealHeading>
    <div className="contact-bottom">
      <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Icon name="arrow-up-right" /></a>
      <div className="contact-socials">
        <a className="contact-github" href={profile.github}><Icon name="github" />GitHub / MasterAerol<Icon name="arrow-up-right" /></a>
        <a className="contact-linkedin" href={profile.linkedin} aria-label="LinkedIn — Aerol Ilagan"><Icon name="linkedin" />LinkedIn — Aerol Ilagan<Icon name="arrow-up-right" /></a>
      </div>
    </div>
    <div className="contact-copy">
      <button className="copy-email" type="button" onClick={copyEmail} disabled={copyState === 'copying'} aria-describedby="copy-email-status">Copy email</button>
      <p id="copy-email-status" role="status">{copyState === 'copied' ? 'Email copied.' : copyState === 'unavailable' ? 'Copy unavailable. Select the address above or use the email link.' : copyState === 'copying' ? 'Copying email…' : ''}</p>
    </div>
  </section>
}
