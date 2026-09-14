import { Icon } from './Icon'

export function Footer() {
  return <footer className="site-footer">
    <div className="container footer-inner">
      <a href="#home" className="brand" aria-label="Aerol — return home">AEROL<span>.</span></a>
      <p>© {new Date().getFullYear()} James Aerol Ilagan</p>
      <a className="back-to-top" href="#home">Back to top<Icon name="arrow-up-right" /></a>
    </div>
  </footer>
}
