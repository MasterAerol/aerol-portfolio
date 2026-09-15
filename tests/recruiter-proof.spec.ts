import { auditWidths } from './viewports'
import { test, expect } from '@playwright/test'

for (const width of auditWidths) {
  test(`${width}px: proof, statuses, resume and copy-email remain readable and usable`, async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { Object.assign(window, { copiedEmail: text }) } } }))
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    for (const status of ['Released — v0.1.0', 'Built / Workflow Prototype', 'Built / Web Application', 'Private Alpha', 'In Development']) await expect(page.getByText(status, { exact: true })).toBeVisible()
    await expect(page.locator('.project-opscheck-flow .proof-check-label')).toHaveText('4 CI environments')
    for (const proof of await page.locator('.story-proof').all()) {
      await proof.scrollIntoViewIfNeeded()
      const result = await proof.evaluate(node => {
        const rect = node.getBoundingClientRect()
        const clipped = [...node.querySelectorAll('p, li, a, dt, dd')].filter(el => el.clientWidth && el.scrollWidth > el.clientWidth + 1).map(el => el.textContent)
        return { left: rect.left, right: rect.right, clipped }
      })
      expect(result.left).toBeGreaterThanOrEqual(0)
      expect(result.right).toBeLessThanOrEqual(width)
      expect(result.clipped).toEqual([])
    }
    for (const link of await page.locator('.project-links a').all()) {
      await link.focus()
      expect(await link.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid')
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    }
    await expect(page.locator('#resume [download], #resume a[href$=".pdf"], #work img, #work video')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Selected Project Experience' })).toBeVisible()
    const copy = page.getByRole('button', { name: 'Copy email' })
    await copy.focus()
    expect(await copy.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid')
    expect((await copy.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toHaveText('Email copied.')
    expect(await page.evaluate(() => (window as unknown as { copiedEmail: string }).copiedEmail)).toBe('aerolilagan00@gmail.com')
    await expect(page.getByRole('link', { name: 'GitHub / MasterAerol' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
  })
}

for (const mode of ['missing', 'denied']) {
  test(`copy email gracefully handles ${mode} clipboard on narrow mobile`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
    await context.addInitScript(mode => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mode === 'missing' ? undefined : { writeText: async () => { throw new Error('Permission denied') } } }), mode)
    const page = await context.newPage()
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/#contact')
    await page.getByRole('button', { name: 'Copy email' }).tap()
    await expect(page.getByRole('status')).toHaveText('Copy unavailable. Select the address above or use the email link.')
    await expect(page.getByRole('link', { name: 'aerolilagan00@gmail.com' })).toHaveAttribute('href', 'mailto:aerolilagan00@gmail.com')
    expect(await page.getByRole('status').evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
    expect(errors).toEqual([])
    await context.close()
  })
}

test('metadata, favicon, unknown paths and invalid anchors remain usable on refresh', async ({ page, request }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/unknown/path#unmatched-anchor')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('JAMES AEROLILAGAN.')
  await page.reload()
  await expect(page.locator('#work article')).toHaveCount(4)
  await expect(page).toHaveTitle('James Aerol Ilagan — Software, Automation & Operations')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Portfolio of James Aerol Ilagan showcasing software development, workflow automation, systems engineering, and digital product work.')
  const person = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? '')
  expect(person.sameAs).toEqual(['https://github.com/MasterAerol', 'https://www.linkedin.com/in/aerol-ilagan-762830435'])
  expect(person.url).toBe('https://aerol-portfolio.master-course.workers.dev/')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://aerol-portfolio.master-course.workers.dev/')
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://aerol-portfolio.master-course.workers.dev/')
  const favicon = await request.get('/favicon.svg')
  expect(favicon.ok()).toBe(true)
  expect(favicon.headers()['content-type']).toContain('image/svg+xml')
  expect(errors).toEqual([])
})
