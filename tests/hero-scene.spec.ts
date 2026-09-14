import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

declare global {
  interface Window {
    __heroQA: { frames: number; sizes: number; failDraw: boolean; times: number[] }
  }
}

async function instrument(page: Page) {
  await page.addInitScript(() => {
    window.__heroQA = { frames: 0, sizes: 0, failDraw: false, times: [] }
    const clear = WebGL2RenderingContext.prototype.clear
    WebGL2RenderingContext.prototype.clear = function (mask) {
      if (this.canvas instanceof HTMLCanvasElement && this.canvas.isConnected) {
        if (window.__heroQA.failDraw) throw new Error('Simulated draw failure')
        window.__heroQA.frames++
        window.__heroQA.times.push(performance.now())
      }
      return clear.call(this, mask)
    }
    new MutationObserver(records => {
      window.__heroQA.sizes += records.filter(record => record.target instanceof HTMLCanvasElement).length
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ['width', 'height'] })
  })
}

async function ready(page: Page) {
  await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-state', 'ready')
  await expect(page.locator('.hero-visual canvas')).toBeVisible()
}

async function intactHero(page: Page) {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('JAMES AEROLILAGAN.')
  for (const [label, href] of [['View My Work', '#work'], ['Resume', '#resume'], ['GitHub', 'https://github.com/MasterAerol'], ['Contact', '#contact']]) {
    await expect(page.locator('.hero').getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href)
  }
}

test('real scene renders, stays decorative, pauses offscreen and avoids resize loops', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await instrument(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await ready(page)
  await intactHero(page)
  await expect(page.locator('.hero-visual')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.locator('canvas')).toHaveAttribute('tabindex', '-1')
  const initialFrames = await page.evaluate(() => window.__heroQA.frames)
  await expect.poll(() => page.evaluate(() => window.__heroQA.frames)).toBeGreaterThan(initialFrames + 3)
  const initialSizes = await page.evaluate(() => window.__heroQA.sizes)
  await page.waitForTimeout(300)
  expect(await page.evaluate(() => window.__heroQA.sizes)).toBe(initialSizes)
  await page.locator('.hero').getByRole('link', { name: 'Contact', exact: true }).focus()
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('CANVAS')
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-active', 'false')
  await page.waitForTimeout(300)
  const pausedFrames = await page.evaluate(() => window.__heroQA.frames)
  await page.waitForTimeout(250)
  expect(await page.evaluate(() => window.__heroQA.frames)).toBe(pausedFrames)
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-active', 'true')
  await expect.poll(() => page.evaluate(() => window.__heroQA.frames)).toBeGreaterThan(pausedFrames + 3)
  expect(errors).toEqual([])
})

test('high-density screens cap desktop and mobile DPR at 1', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 })
  const page = await context.newPage()
  await page.goto('/')
  await ready(page)
  const ratio = () => page.locator('canvas').evaluate(canvas => (canvas as HTMLCanvasElement).width / canvas.getBoundingClientRect().width)
  expect(await ratio()).toBeGreaterThan(0.99)
  expect(await ratio()).toBeLessThanOrEqual(1)
  await page.setViewportSize({ width: 360, height: 900 })
  await expect.poll(ratio).toBeLessThanOrEqual(1)
  await ready(page)
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
  await context.close()
})

test('reduced motion skips the scene download and safely switches between static and live', async ({ page }) => {
  const errors: string[] = []
  const requests: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('request', request => requests.push(request.url()))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-state', 'reduced-motion')
  await expect(page.getByTestId('scene-fallback')).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  expect(requests.filter(url => /HeroScene|react-three|three[.]js/.test(url))).toEqual([])
  await intactHero(page)
  for (let iteration = 0; iteration < 2; iteration++) {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await ready(page)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.getByTestId('scene-fallback')).toBeVisible()
    await expect(page.locator('canvas')).toHaveCount(0)
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await ready(page)
  // Covers delayed R3F cleanup from the prior canvas mounts.
  await page.waitForTimeout(800)
  await ready(page)
  expect(errors).toEqual([])
})

for (const mode of ['unavailable', 'initialization', 'drawing', 'context-loss'] as const) {
  test(`graceful ${mode} fallback preserves all hero HTML`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    if (mode === 'unavailable' || mode === 'initialization') {
      await page.addInitScript(failure => {
        const getContext = HTMLCanvasElement.prototype.getContext
        HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
          if (type === 'webgl2' && (failure === 'unavailable' || this.isConnected)) return null
          return Reflect.apply(getContext, this, [type, ...args])
        } as typeof getContext
      }, mode)
    } else {
      await instrument(page)
    }
    await page.goto('/')
    if (mode === 'drawing' || mode === 'context-loss') {
      await ready(page)
      if (mode === 'drawing') await page.evaluate(() => { window.__heroQA.failDraw = true })
      else await page.locator('canvas').evaluate(canvas => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })))
    }
    await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-state', 'fallback')
    await expect(page.getByTestId('scene-fallback')).toBeVisible()
    await expect(page.locator('canvas')).toHaveCount(0)
    await intactHero(page)
    expect(errors).toEqual([])
  })
}

test('project hover is restrained and clears when switching to mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await ready(page)
  const bounds = (await page.locator('canvas').boundingBox())!
  let hovered = false
  for (const x of [0.89, 0.91, 0.87, 0.93, 0.85]) {
    for (const y of [0.58, 0.56, 0.6, 0.54, 0.62, 0.52, 0.64]) {
      await page.mouse.move(bounds.x + bounds.width * x, bounds.y + bounds.height * y)
      hovered = await page.locator('canvas').evaluate(canvas => canvas.style.cursor === 'crosshair')
      if (hovered) break
    }
    if (hovered) break
  }
  expect(hovered).toBe(true)
  await page.setViewportSize({ width: 390, height: 900 })
  await expect(page.locator('.hero-visual')).toHaveClass(/has-coarse-pointer/)
  await expect.poll(() => page.locator('canvas').evaluate(canvas => canvas.style.cursor)).toBe('')
  await expect(page.locator('.hero-visual a, .hero-visual button')).toHaveCount(0)
})

test('mobile canvas permits touch scrolling and leaves every CTA clear', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto('/')
  await ready(page)
  const visual = (await page.locator('.hero-visual').boundingBox())!
  for (const link of await page.locator('.hero a').all()) {
    const bounds = (await link.boundingBox())!
    if ((await link.textContent())?.includes('Explore')) continue
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(visual.y)
  }
  expect(await page.locator('canvas').evaluate(canvas => getComputedStyle(canvas).touchAction)).toContain('pan-y')
  const session = await context.newCDPSession(page)
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 710 }] })
  for (const y of [680, 650, 610, 570, 530, 490]) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] })
    await page.waitForTimeout(20)
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100)
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
  await context.close()
})
