import { auditWidths } from './viewports'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const orders = {
  'general-va': ['AI Operations Automation Hub', 'PasaWise CSE'],
  software: ['OpsCheck Flow', 'PasaWise CSE', 'AI Operations Automation Hub', 'Kivo — Life Organizer'],
  operations: ['AI Operations Automation Hub', 'OpsCheck Flow', 'PasaWise CSE', 'Kivo — Life Organizer'],
}
for (const variant of ['software', 'operations', 'general-va'] as const) {
  for (const width of auditWidths) {
    test(`${variant} resume ${width}px: accessible content, route refresh and print control`, async ({ page }) => {
      const errors: string[] = [], sceneRequests: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('request', request => { if (/HeroScene|@react-three|three\.module/.test(request.url())) sceneRequests.push(request.url()) })
      await page.addInitScript(() => { window.print = () => Object.assign(window, { printCalled: true }) })
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/resume/${variant}`)
      await page.reload()
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('James Aerol Ilagan')
      await expect(page.locator('.resume-project h3')).toHaveText(orders[variant])
      await expect(page.locator('canvas, .hero-visual, .site-header, [download], a[href$=".pdf"]')).toHaveCount(0)
      if (variant !== 'general-va') await expect(page.getByRole('link', { name: /OpsCheck Flow Repository:/ })).toHaveAttribute('href', 'https://github.com/MasterAerol/opscheck-flow')
      await expect(page.getByRole('link', { name: /Email James Aerol/ })).toHaveAttribute('href', 'mailto:aerolilagan00@gmail.com')
      await expect(page.getByRole('link', { name: 'LinkedIn — Aerol Ilagan' })).toHaveAttribute('href', 'https://www.linkedin.com/in/aerol-ilagan-762830435')
      const clipped = await page.locator('p, li, h1, h2, h3, a, button, dd').evaluateAll(nodes => nodes.filter(el => el.clientWidth && el.scrollWidth > el.clientWidth + 1).map(el => el.textContent))
      expect(clipped).toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
      expect(await page.locator('.resume-project li').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16)
      for (const control of await page.locator('a:not(.skip-link), button').all()) {
        expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44)
      }
      const print = page.getByRole('button', { name: 'Print / Save as PDF' })
      await print.focus()
      expect(await print.evaluate(el => getComputedStyle(el).outlineWidth)).toBe('3px')
      await page.keyboard.press('Enter')
      expect(await page.evaluate(() => (window as unknown as { printCalled: boolean }).printCalled)).toBe(true)
      await expect(page.locator('.resume-continuation')).toBeHidden()
      expect(sceneRequests).toEqual([])
      expect(errors).toEqual([])
    })
  }

  test(`${variant}: A4 print styling hides controls and preserves all facts`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/resume/${variant}`)
    await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' })
    for (const control of await page.locator('.resume-toolbar, .skip-link').all()) await expect(control).toBeHidden()
    await expect(page.locator('.resume-continuation')).toBeVisible()
    await expect(page.getByRole('article')).toHaveCount(orders[variant].length)
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(255, 255, 255)')
    expect(await page.locator('.resume-next-page').evaluate(el => getComputedStyle(el).breakBefore)).toBe('page')
    expect(await page.locator('.resume-document').evaluate(el => getComputedStyle(el).boxShadow)).toBe('none')
    await expect(page.locator('canvas, .menu-toggle')).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Completed Training' })).toContainText('40-hour training · December 2023')
  })

  test(`${variant}: mobile accessibility, reduced motion and 200% text`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`/resume/${variant}`)
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    expect(result.violations).toEqual([])
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Skip to resume' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('main')).toBeFocused()
  })
}

test('portfolio resumes open real HTML routes and provide a return path', async ({ page }) => {
  for (const [label, route] of [['Software / Developer Resume — View Resume', '/resume/software'], ['AI Operations / Technical VA Resume — View Resume', '/resume/operations'], ['General VA / Data Entry / Admin Resume — View Resume', '/resume/general-va']]) {
    await page.goto('/#resume')
    await page.getByRole('link', { name: label }).click()
    await expect(page).toHaveURL(new RegExp(route + '$'))
    await expect(page.getByRole('button', { name: 'Print / Save as PDF' })).toBeVisible()
    await page.getByRole('link', { name: 'Back to Portfolio' }).click()
    await expect(page).toHaveURL(/\/#resume$/)
    await expect(page.locator('.hero-visual')).toBeVisible()
  }
})
