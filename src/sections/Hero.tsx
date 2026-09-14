import { HeroVisualBoundary } from '../components/HeroVisualBoundary'
import { Icon } from '../components/Icon'
import { profile } from '../data/profile'

export function Hero() {
  return <section id="home" className="hero container" aria-labelledby="hero-title">
    <div className="hero-content">
      <p className="availability"><span aria-hidden="true" />Open to remote opportunities</p>
      <p className="hero-eyebrow eyebrow">SOFTWARE. SYSTEMS. POSSIBILITIES.</p>
      <h1 id="hero-title">JAMES AEROL<br /><span>ILAGAN</span><span className="hero-period">.</span></h1>
      <p className="hero-positioning">{profile.positioning}</p>
      <p className="hero-description">{profile.introduction}</p>
      <div className="hero-actions">
        <a className="button button-primary" href="#work">View My Work<Icon name="arrow-up-right" /></a>
        <a className="button button-secondary" href="#resume">Resume<Icon name="file" /></a>
      </div>
      <div className="hero-links">
        <a href={profile.github}>GitHub<Icon name="arrow-up-right" /></a>
        <a href="#contact">Contact<Icon name="arrow-up-right" /></a>
      </div>
    </div>
    <HeroVisualBoundary />
    <div className="hero-bottom"><span>FROM THE FIRST IDEA TO THE WORKING SYSTEM.</span><a href="#about">Explore the portfolio<Icon name="arrow-down" /></a></div>
  </section>
}
