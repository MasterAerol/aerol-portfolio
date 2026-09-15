import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { ResumeRouter } from '../ResumeRouter'
import { resumes } from '../data/resume'
import { opportunities, resumeTracks } from '../data/content'
import { education, training } from '../data/education'

describe('General VA resume and opportunity expansion', () => {
  it('renders the direct and trailing-slash route with its target, focus and project-based summary', () => {
    const { rerender } = render(<ResumeRouter pathname="/resume/general-va" />)
    expect(document.title).toBe('James Aerol Ilagan — General VA & Data Entry Resume')
    expect(screen.getByText('General Virtual Assistant')).toBeVisible()
    expect(screen.getByText('Data Entry · Administrative Support · Research')).toBeVisible()
    const summary = screen.getByRole('region', { name: 'Summary' })
    expect(summary).toHaveTextContent('Civil Engineering graduate transitioning into remote support work')
    expect(summary).toHaveTextContent('project-based experience managing independent digital projects')
    expect(summary).toHaveTextContent('detail-oriented and repetitive tasks')
    rerender(<ResumeRouter pathname="/resume/general-va/" />)
    expect(screen.getByRole('heading', { name: 'Selected Project Experience' })).toBeVisible()
  })

  it('uses only the two relevant real projects, with explicit independent/personal context', () => {
    render(<ResumeRouter pathname="/resume/general-va" />)
    const articles = screen.getAllByRole('article')
    expect(articles.map(article => within(article).getByRole('heading').textContent)).toEqual(['AI Operations Automation Hub', 'PasaWise CSE'])
    expect(articles[0]).toHaveTextContent('Independent / project-based work')
    expect(articles[0]).toHaveTextContent('Google Sheets, n8n automation, authenticated data handling')
    expect(articles[1]).toHaveTextContent('Personal Project')
    expect(articles[1]).toHaveTextContent('quality checks on desktop and mobile')
    for (const article of articles) expect(within(article).getAllByRole('listitem')).toHaveLength(3)
    expect(Object.keys(resumes['general-va'].projectExperience)).toEqual(resumes['general-va'].projects.map(project => project.id))
  })

  it('excludes employment claims, unsupported processing and unpracticed admin skills', () => {
    render(<ResumeRouter pathname="/resume/general-va" />)
    expect(document.body).not.toHaveTextContent(/OpenAI API|Docker|Resend|AI processing|live LLM|paid model|client operations|professional experience|work experience|employment history|experienced Virtual Assistant|professional VA|years of VA experience|client management|executive assistant|calendar management|inbox management|email management|CRM management|bookkeeping|payroll|social media management|customer support|cold calling|appointment setting|lead generation|Amazon VA|Shopify management|expert.level/i)
  })

  it('uses exactly the approved skill groups and shared verified education/training', () => {
    expect(resumes['general-va'].skills).toEqual([
      { name: 'Administrative & Data', items: ['Data entry', 'Spreadsheet organization', 'Web research', 'Documentation', 'Information organization', 'Quality checking'] },
      { name: 'AI & Productivity', items: ['ChatGPT', 'Codex', 'AI-assisted research', 'AI-assisted documentation', 'Troubleshooting', 'Process improvement'] },
      { name: 'Workflow Tools', items: ['Google Sheets', 'Google Drive', 'n8n', 'Structured task tracking', 'Workflow testing'] },
      { name: 'Technical Foundation', items: ['Python fundamentals', 'Git / GitHub', 'Basic web systems', 'APIs', 'Databases'] },
    ])
    render(<ResumeRouter pathname="/resume/general-va" />)
    for (const value of Object.values(education)) expect(screen.getByRole('region', { name: 'Education' })).toHaveTextContent(value)
    for (const value of Object.values(training)) expect(screen.getByRole('region', { name: 'Completed Training' })).toHaveTextContent(value)
    expect(document.querySelector('canvas, .reveal-heading, .reveal-word, [download]')).toBeNull()
  })

  it('adds three opportunity targets and the third resume without changing hero positioning', () => {
    expect(opportunities).toEqual([
      'Junior Software Developer', 'AI Automation / AI Operations', 'Technical Virtual Assistant',
      'General Virtual Assistant', 'Data Entry / Administrative Support', 'Research / Documentation Support',
      'Operations Virtual Assistant', 'Workflow / Process Automation',
    ])
    expect(resumeTracks.map(track => track.path)).toEqual(['/resume/software', '/resume/operations', '/resume/general-va'])
    render(<ResumeRouter pathname="/" />)
    const region = screen.getByRole('region', { name: /Good work starts with a conversation/ })
    for (const role of opportunities) expect(within(region).getByText(role, { exact: true })).toBeVisible()
    expect(screen.getByText('Software Developer · AI Automation · Operations')).toBeVisible()
  })

  for (const variant of ['software', 'operations'] as const) {
    it(`preserves every existing ${variant} project bullet and category`, () => {
      render(<ResumeRouter pathname={`/resume/${variant}`} />)
      for (const project of resumes[variant].projects) {
        const article = screen.getByRole('article', { name: project.name })
        expect(article).toHaveTextContent(project.resume.category)
        expect(within(article).getAllByRole('listitem').map(item => item.textContent)).toEqual(project.resume[variant])
      }
      expect(screen.getByRole('region', { name: 'Summary' })).toHaveTextContent(resumes[variant].summary)
    })
  }
})
