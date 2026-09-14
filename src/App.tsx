import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { SelectedWork } from './sections/SelectedWork'
import { Capabilities } from './sections/Capabilities'
import { HowIWork } from './sections/HowIWork'
import { Skills } from './sections/Skills'
import { Opportunities } from './sections/Opportunities'
import { Resume } from './sections/Resume'
import { Education } from './sections/Education'
import { Contact } from './sections/Contact'

export function App() {
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header />
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <About />
      <SelectedWork />
      <Capabilities />
      <HowIWork />
      <Skills />
      <Opportunities />
      <Resume />
      <Education />
      <Contact />
    </main>
    <Footer />
  </>
}
