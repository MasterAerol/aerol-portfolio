import { test, expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import AxeBuilder from '@axe-core/playwright'

const widths = [1440, 1024, 768, 430, 390, 360]

for (const width of widths) {
  test(`${width}px: readable sections, navigation, expanded content, and no overflow`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('JAMES AEROLILAGAN.')
    await expect(page.getByRole('region')).toHaveCount(10)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.locator('.site-header .brand')).toBeInViewport()
    await expect(page.locator('#about .approach-note')).toContainText('I use AI-assisted development')
    await expect(page.locator('.project-opscheck-flow .proof-metrics')).toHaveAttribute('aria-label', '227 tests · 225 passed · 2 intentional skips')
    await expect(page.locator('.project-ai-operations-hub .project-category')).toHaveText('Operations Automation / Workflow Systems')
    await expect(page.locator('.project-kivo .status-badge')).toHaveText('Private Alpha')
    await expect(page.locator('#resume button')).toHaveCount(2)
    for (const button of await page.locator('#resume button').all()) await expect(button).toBeDisabled()
    await expect(page.locator('#resume a, [download]')).toHaveCount(0)

    const layout = await page.evaluate(() => {
      const elements = [...document.querySelectorAll<HTMLElement>('header, main > section, footer')]
      const sections = elements.map(node => {
        const rect = node.getBoundingClientRect()
        return { id: node.id || node.tagName.toLowerCase(), x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height }
      })
      const clippedText = [...document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, p, li, a, button, summary')]
        .filter(node => node.clientWidth > 0 && node.scrollWidth > node.clientWidth + 1)
        .map(node => node.textContent)
      const grids = ['.about-section', '.project-stories', '.capability-grid', '.process-grid', '.skills-section', '.opportunities-section', '.resume-grid', '.education-section']
        .map(selector => ({ selector, columns: getComputedStyle(document.querySelector(selector)!).gridTemplateColumns.split(' ').length }))
      const bodySizes = [...document.querySelectorAll<HTMLElement>('.hero-description, .about-content > p, .project-description')]
        .map(node => parseFloat(getComputedStyle(node).fontSize))
      const targets = [...document.querySelectorAll<HTMLElement>('.site-header a, .menu-toggle, .hero a, .project-links a, summary, .resume-button, .contact-section a')]
        .filter(node => node.getBoundingClientRect().width > 0)
        .map(node => ({ label: node.textContent, height: node.getBoundingClientRect().height, clipped: node.scrollWidth > node.clientWidth + 1 }))
      return { sections, clippedText, grids, bodySizes, targets }
    })
    expect(layout.sections).toHaveLength(12)
    expect(layout.clippedText).toEqual([])
    for (const section of layout.sections) {
      expect(section.x, section.id).toBeGreaterThanOrEqual(0)
      expect(section.x + section.width, section.id).toBeLessThanOrEqual(width + 1)
    }
    expect(layout.bodySizes.every(size => size >= 16)).toBe(true)
    for (const target of layout.targets) {
      expect(target.height, target.label ?? '').toBeGreaterThanOrEqual(44)
      expect(target.clipped, target.label ?? '').toBe(false)
    }
    if (width < 768) {
      for (const grid of layout.grids) {
        expect(grid.columns, grid.selector).toBe(grid.selector === '.process-grid' && width > 380 ? 2 : 1)
      }
      await expect(page.locator('.hero-visual')).toBeVisible()
      for (const card of await page.locator('.project-story').all()) {
        expect((await card.boundingBox())!.width).toBeGreaterThanOrEqual(width - 42)
      }
    }
    await mkdir('.qa/milestone-3/regression', { recursive: true })
    await page.screenshot({ path: `.qa/milestone-3/regression/closed-${width}.png`, fullPage: true, animations: 'disabled' })
    await writeFile(`.qa/milestone-3/regression/layout-${width}.json`, JSON.stringify(layout, null, 2))

    const nav = page.getByRole('navigation', { name: 'Primary navigation' })
    if (width < 768) {
      await expect(nav).toBeHidden()
      await page.getByRole('button', { name: 'Open navigation menu' }).click()
      await expect(nav).toBeVisible()
      await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true')
      for (const link of await nav.getByRole('link').all()) {
        const bounds = (await link.boundingBox())!
        expect(bounds.height).toBeGreaterThanOrEqual(44)
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width)
        await expect(link).toBeInViewport()
      }
      await page.screenshot({ path: `.qa/milestone-3/regression/menu-${width}.png`, animations: 'disabled' })
    }
    await nav.getByRole('link', { name: 'Work', exact: true }).click()
    await expect(page).toHaveURL(/#work$/)
    if (width < 768) await expect(nav).toBeHidden()
    await expect(page.getByRole('heading', { name: 'Built to do something useful.' })).toBeInViewport()
    for (const summary of await page.locator('summary').all()) {
      await summary.click()
      await expect(summary.locator('..')).toHaveAttribute('open', '')
      expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const clippedTechnology = await page.locator('.technology-list li').evaluateAll(nodes => nodes.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent))
    expect(clippedTechnology).toEqual([])
    await expect(page.getByRole('link', { name: 'OpsCheck Flow — Repository' })).toHaveAttribute('href', 'https://github.com/MasterAerol/opscheck-flow')
    await expect(page.getByRole('link', { name: 'aerolilagan2002@gmail.com' })).toHaveAttribute('href', 'mailto:aerolilagan2002@gmail.com')
    await expect(page.getByRole('link', { name: 'GitHub / MasterAerol' })).toHaveAttribute('href', 'https://github.com/MasterAerol')
    expect(errors).toEqual([])
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: `.qa/portfolio-${width}.png`, fullPage: true, animations: 'disabled' })
  })
}

test('keyboard navigation, visible focus, skip link, disclosures and mobile focus exit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await page.getByRole('button', { name: 'Open navigation menu' }).focus()
  await page.keyboard.press('Enter')
  const toggle = page.getByRole('button', { name: /navigation menu/ })
  await page.keyboard.press('Tab')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toBeFocused()
  const focusStyle = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement!)
    return { outline: style.outlineStyle, width: style.outlineWidth }
  })
  expect(focusStyle.outline).toBe('solid')
  expect(focusStyle.width).toBe('2px')
  await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused()
  await expect(page.getByRole('navigation')).toBeHidden()
  await page.keyboard.press('Enter')
  for (let i = 0; i < 6; i++) await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'View My Work' })).toBeFocused()
  await expect(page.getByRole('navigation')).toBeHidden()
  const details = page.locator('summary').first()
  await details.focus()
  await page.keyboard.press('Enter')
  await expect(details.locator('..')).toHaveAttribute('open', '')
})

test('mobile menu scrolls within a short landscape viewport', async ({ page }) => {
  await page.setViewportSize({ width: 740, height: 320 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  const nav = page.getByRole('navigation')
  expect(await nav.evaluate(node => getComputedStyle(node).overflowY)).toBe('auto')
  expect((await nav.boundingBox())!.y + (await nav.boundingBox())!.height).toBeLessThanOrEqual(321)
  await nav.getByRole('link', { name: 'Contact', exact: true }).click()
  await expect(page).toHaveURL(/#contact$/)
})

test('mobile menu closes on outside click and desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  await page.locator('.hero-description').click()
  await expect(page.getByRole('navigation')).toBeHidden()
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  await page.setViewportSize({ width: 1024, height: 900 })
  await expect(page.getByRole('navigation')).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByRole('navigation')).toBeHidden()
})

test('reduced motion retains complete usable content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')
  expect(await page.locator('.button-primary').evaluate(node => getComputedStyle(node).transitionDuration)).toBe('0s')
  await expect(page.getByRole('region')).toHaveCount(10)
  await page.getByRole('link', { name: 'View My Work' }).click()
  await expect(page.getByRole('heading', { name: 'Built to do something useful.' })).toBeInViewport()
})

test('200% text enlargement does not create horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.addStyleTag({ content: 'html { font-size: 200%; }' })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  await page.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true }).click()
  await expect(page).toHaveURL(/#contact$/)
})

for (const width of [1440, 390]) {
  test(`${width}px accessibility audit including expanded project details`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.querySelectorAll('details').forEach(node => { node.open = true }))
    if (width < 768) await page.getByRole('button', { name: 'Open navigation menu' }).click()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    expect(results.violations).toEqual([])
  })
}
