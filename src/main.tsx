import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/tokens.css'
import './styles/global.css'
import './styles/sections.css'
import './styles/hero-scene.css'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
