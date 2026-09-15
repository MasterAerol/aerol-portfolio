import { App } from './App'
import { resumeTracks } from './data/content'
import { resumes } from './data/resume'
import { ResumePage } from './pages/ResumePage'

export function ResumeRouter({ pathname = window.location.pathname }: { pathname?: string }) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  const track = resumeTracks.find(track => track.path === normalized)
  return track ? <ResumePage resume={resumes[track.variant]} /> : <App />
}
