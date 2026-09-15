import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ResumeRouter } from './ResumeRouter'
import './styles/tokens.css'
import './styles/global.css'
import './styles/sections.css'
import './styles/hero-scene.css'
import './styles/project-stories.css'
import './styles/recruiter-proof.css'
import './styles/resume-pages.css'
import './styles/reveals.css'

createRoot(document.getElementById('root')!).render(<StrictMode><ResumeRouter /></StrictMode>)
