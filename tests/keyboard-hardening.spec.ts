import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

async function visibleMainFocus(control: Locator) {
  await expect(control).toBeFocused()
  await expect.poll(async () => control.evaluate(node => {
    const bounds = node.getBoundingClientRect()
    const header = document.querySelector('.site-header')!.getBoundingClientRect()
    const style = getComputedStyle(node)
    const outlineExtent = Math.max(0, parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset))
    return bounds.top - outlineExtent >= header.bottom && bounds.bottom + outlineExtent <= innerHeight &&
      bounds.left - outlineExtent >= 0 && bounds.right + outlineExtent <= innerWidth &&
      style.outlineStyle === 'solid' && parseFloat(style.outlineWidth) >= 2
  })).toBe(true)
}

async function keyboardNode(page: Page, button: Locator, label: string) {
  await expect(button.locator('.diagram-node-label')).toHaveText(label)
  await visibleMainFocus(button)
  await page.keyboard.press('Enter')
  await expect(button).toHaveAttribute('aria-pressed', 'true')
  const panelId = await button.getAttribute('aria-controls')
  await expect(page.locator(`[id="${panelId}"] .insight-label`)).toHaveText(label)
  await expect(button).toBeFocused()
  await page.keyboard.press('Tab')
}

const reviewNodes = ['Event', 'Idempotency', 'Queue', 'Worker claim', 'Workflow', 'Quality worker', 'Change worker', 'Verifier', 'Briefing', 'Human approval', 'Revise', 'Complete']
const recoveryNodes = ['Worker', 'Lease / heartbeat', 'Failure', 'Retry / backoff', 'Dead letter', 'Replay']
const laterProjects = [
  { id: 'ai-operations-hub', labels: ['Workspace', 'Data', 'Automation'] },
  { id: 'pasawise-cse', labels: ['Learn', 'Practice', 'Measure', 'Recover'] },
  { id: 'kivo', labels: ['Today', 'PETSA', 'SAAN KO', 'Search', 'Add'] },
]

for (const width of [1440, 390]) {
  for (const path of ['review', 'recovery'] as const) {
    test(`${width}px: sequential keyboard traversal through ${path} and every project control`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      // Establish a single starting point; every subsequent move uses actual Tab order.
      await page.getByRole('link', { name: 'View My Work', exact: true }).focus()
      await page.keyboard.press('Enter')
      await page.keyboard.press('Tab')

      const ops = page.locator('.project-opscheck-flow')
      const review = ops.getByRole('button', { name: 'Review workflow', exact: true })
      await visibleMainFocus(review)
      await page.keyboard.press('Enter')
      await expect(review).toHaveAttribute('aria-pressed', 'true')
      await page.keyboard.press('Tab')
      const recovery = ops.getByRole('button', { name: 'Recovery path', exact: true })
      await visibleMainFocus(recovery)
      if (path === 'recovery') {
        await page.keyboard.press('Space')
        await expect(recovery).toHaveAttribute('aria-pressed', 'true')
      }
      await page.keyboard.press('Tab')
      const labels = path === 'review' ? reviewNodes : recoveryNodes
      for (let index = 0; index < labels.length; index++) {
        await keyboardNode(page, ops.locator('.diagram-node').nth(index), labels[index])
      }
      for (const [name, href] of [
        ['OpsCheck Flow — View Repository', 'https://github.com/MasterAerol/opscheck-flow'],
        ['OpsCheck Flow — View v0.1.0 Release', 'https://github.com/MasterAerol/opscheck-flow/releases/tag/v0.1.0'],
      ]) {
        const link = ops.getByRole('link', { name, exact: true })
        await visibleMainFocus(link)
        await expect(link).toHaveAttribute('href', href)
        await page.keyboard.press('Tab')
      }
      const opsDisclosure = ops.locator('summary')
      await visibleMainFocus(opsDisclosure)
      await page.keyboard.press('Enter')
      await expect(ops.locator('details')).toHaveAttribute('open', '')
      await page.keyboard.press('Tab')

      for (const project of laterProjects) {
        const article = page.locator(`.project-${project.id}`)
        for (let index = 0; index < project.labels.length; index++) {
          await keyboardNode(page, article.locator('.diagram-node').nth(index), project.labels[index])
        }
        const disclosure = article.locator('summary')
        await visibleMainFocus(disclosure)
        await page.keyboard.press('Space')
        await expect(article.locator('details')).toHaveAttribute('open', '')
        await page.keyboard.press('Tab')
      }
      const opportunityLink = page.getByRole('link', { name: "Let's talk", exact: true })
      await visibleMainFocus(opportunityLink)
      await expect(opportunityLink).toHaveAttribute('href', '#contact')
      await page.keyboard.press('Tab')
      await visibleMainFocus(page.getByRole('link', { name: 'Software / Developer Resume — View Resume' }))
      await page.keyboard.press('Tab')
      await visibleMainFocus(page.getByRole('link', { name: 'AI Operations / Technical VA Resume — View Resume' }))
    })
  }
}

test('mobile menu keyboard selection continues from the destination', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: /navigation menu/ })
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'About', exact: true })).toBeFocused()
  await page.keyboard.press('Tab')
  const work = page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true })
  await expect(work).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#work$/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('navigation')).toBeHidden()
  await page.keyboard.press('Tab')
  await visibleMainFocus(page.getByRole('button', { name: 'Review workflow', exact: true }))
})

test('Shift+Tab exits the mobile menu without trapping or hiding focused links', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: /navigation menu/ })
  await toggle.focus()
  await page.keyboard.press('Space')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'About', exact: true })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(toggle).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('link', { name: 'Aerol — home', exact: true })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('navigation')).toBeHidden()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await page.keyboard.press('Tab')
  await visibleMainFocus(page.getByRole('link', { name: 'View My Work', exact: true }))
})

test('a live hero survives repeated desktop and mobile resizing without replacing its canvas', async ({ page }) => {
  const errors: string[] = [], warnings: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); if (message.type() === 'warning') warnings.push(message.text()) })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-state', 'ready')
  const originalCanvas = await page.locator('canvas').elementHandle()
  for (const width of [767, 768, 360, 1920, 375, 1280, 430, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-state', 'ready')
    await expect(page.locator('canvas')).toHaveCount(1)
    await expect.poll(() => page.locator('canvas').evaluate(canvas => {
      const bounds = canvas.getBoundingClientRect()
      const bitmap = canvas as HTMLCanvasElement
      return Math.abs(bitmap.width - bounds.width) < 1 && Math.abs(bitmap.height - bounds.height) < 1
    })).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
  }
  expect(await page.evaluate(canvas => document.querySelector('canvas') === canvas, originalCanvas)).toBe(true)
  await expect(page.getByRole('link', { name: 'View My Work', exact: true })).toBeVisible()
  expect(errors).toEqual([])
  if (warnings.length) await test.info().attach('browser-warnings', { body: warnings.join('\n'), contentType: 'text/plain' })
  expect(warnings.filter(warning => !/^\[\.WebGL-[^\]]+\]GL Driver Message .*GPU stall due to ReadPixels/.test(warning))).toEqual([])
})
