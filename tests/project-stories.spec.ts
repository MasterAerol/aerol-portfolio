import { test, expect } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

const projectIds = ['opscheck-flow', 'ai-operations-hub', 'pasawise-cse', 'kivo']

async function activate(page: Page, button: Locator) {
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(button).toHaveAttribute('aria-pressed', 'true')
  const panelId = await button.getAttribute('aria-controls')
  await expect(page.locator(`[id="${panelId}"]`)).toBeVisible()
  const style = await button.evaluate(node => ({ outline: getComputedStyle(node).outlineStyle, width: getComputedStyle(node).outlineWidth }))
  expect(style).toEqual({ outline: 'solid', width: '2px' })
  expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44)
}

for (const width of [1440, 1024, 768, 430, 390, 360]) {
  test(`${width}px: all project diagrams, selection states and case-study layout`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#work')
    await expect(page.locator('#work article')).toHaveCount(4)
    const stories = page.locator('.project-story')
    for (let index = 0; index < projectIds.length; index++) {
      const article = stories.nth(index)
      await expect(article).toHaveClass(new RegExp('project-' + projectIds[index]))
      const layout = await article.evaluate(node => {
        const bounds = (selector: string) => {
          const rect = node.querySelector(selector)!.getBoundingClientRect()
          return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom }
        }
        return { intro: bounds('.story-intro'), visual: bounds('figure'), capabilities: bounds('.story-capabilities'), technologies: bounds('.story-technologies'), proof: bounds('.story-proof') }
      })
      if (width >= 1024) {
        if (index % 2 === 0) expect(layout.intro.right).toBeLessThan(layout.visual.x)
        else expect(layout.visual.right).toBeLessThan(layout.intro.x)
      } else {
        expect(layout.intro.bottom).toBeLessThanOrEqual(layout.visual.y)
        expect(layout.visual.bottom).toBeLessThanOrEqual(layout.capabilities.y)
        if (width < 768) {
          expect(layout.capabilities.bottom).toBeLessThanOrEqual(layout.technologies.y)
          expect(layout.technologies.bottom).toBeLessThanOrEqual(layout.proof.y)
        }
      }
      expect(layout.visual.x).toBeGreaterThanOrEqual(0)
      expect(layout.visual.right).toBeLessThanOrEqual(width)
    }
    const ops = page.locator('.project-opscheck-flow')
    await activate(page, ops.getByRole('button', { name: 'Recovery path' }))
    for (const button of await ops.locator('.workflow-path button').all()) await activate(page, button)
    await expect(ops.locator('.diagram-insight')).toContainText('run retained work again')
    await activate(page, ops.getByRole('button', { name: 'Review workflow' }))
    for (const button of await ops.locator('.workflow-path button').all()) await activate(page, button)
    await expect(ops.locator('.diagram-insight')).toContainText('human approval')
    for (const project of projectIds.slice(1)) {
      const article = page.locator('.project-' + project)
      for (const button of await article.locator('figure button').all()) {
        await activate(page, button)
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
        const clipped = await article.locator('button, li, p').evaluateAll(nodes => nodes.filter(node => node.clientWidth && node.scrollWidth > node.clientWidth + 1).map(node => node.textContent))
        expect(clipped).toEqual([])
      }
    }
    await expect(page.locator('#work canvas, #work img, #work video')).toHaveCount(0)
    expect(await page.locator('canvas').count()).toBeLessThanOrEqual(1)
    expect(errors).toEqual([])
  })
}

test('reduced motion gives immediate final states and retains every project interaction', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 360, height: 844 })
  await page.goto('/#work')
  for (const article of await page.locator('.project-story').all()) {
    await article.scrollIntoViewIfNeeded()
    expect(await article.evaluate(node => getComputedStyle(node).animationName)).toBe('none')
    await expect(article.locator('figure')).toBeVisible()
    const lastButton = article.locator('figure button').last()
    await activate(page, lastButton)
    expect(await lastButton.evaluate(node => getComputedStyle(node).transitionDuration)).toBe('0s')
    await expect(article.locator('.diagram-insight')).not.toBeEmpty()
  }
  await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-state', 'reduced-motion')
  await expect(page.locator('canvas')).toHaveCount(0)
})

test('entry reveals occur once and leave project information visible', async ({ page }) => {
  await page.addInitScript(() => {
    const counts: Record<string, number> = {}
    Object.assign(window, { projectEntries: counts })
    document.addEventListener('animationstart', event => {
      if (event.animationName === 'project-enter') {
        const id = (event.target as HTMLElement).getAttribute('aria-labelledby')!
        counts[id] = (counts[id] ?? 0) + 1
      }
    })
  })
  await page.goto('/')
  const story = page.locator('.project-ai-operations-hub')
  await story.scrollIntoViewIfNeeded()
  await expect(story).toHaveAttribute('data-entered', 'true')
  await page.waitForTimeout(550)
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await story.scrollIntoViewIfNeeded()
  const count = await page.evaluate(() => (window as unknown as { projectEntries: Record<string, number> }).projectEntries['ai-operations-hub-title'])
  expect(count).toBe(1)
  expect(await story.evaluate(node => getComputedStyle(node).opacity)).toBe('1')
})

test('real mobile taps update diagram content', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto('/#work')
  const data = page.locator('.project-ai-operations-hub').getByRole('button', { name: /Data/ })
  await data.tap()
  await expect(data).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('#ai-operations-hub-diagram-insight')).toContainText('Supabase')
  const recover = page.locator('.project-pasawise-cse').getByRole('button', { name: /Recover/ })
  await recover.tap()
  await expect(page.locator('#pasawise-cse-diagram-insight')).toContainText('Smart Recovery')
  await context.close()
})
