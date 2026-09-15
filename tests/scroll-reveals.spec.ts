import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const linkedin = 'https://www.linkedin.com/in/aerol-ilagan-762830435'
const email = 'aerolilagan00@gmail.com'

for (const width of [1440, 1024, 768, 430, 412, 390, 375, 360]) {
  test(`${width}px: reveals preserve heading layout and contact access`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.locator('.hero h1')).toBeVisible()
    expect(await page.locator('.hero h1').evaluate(node => getComputedStyle(node).animationName)).toBe('none')

    // Compare with the original unsplit text in the same typography and width.
    const wrapping = await page.locator('.reveal-words').evaluateAll(nodes => nodes.map(node => {
      const original = node as HTMLElement
      const plain = original.cloneNode(false) as HTMLElement
      plain.removeAttribute('id')
      plain.removeAttribute('aria-label')
      plain.className = ''
      plain.textContent = original.textContent
      plain.style.position = 'absolute'
      plain.style.width = `${original.getBoundingClientRect().width}px`
      original.parentElement!.append(plain)
      const difference = Math.abs(original.getBoundingClientRect().height - plain.getBoundingClientRect().height)
      plain.remove()
      return { text: original.textContent, difference }
    }))
    for (const heading of wrapping) expect(heading.difference, heading.text ?? '').toBeLessThanOrEqual(1)

    for (const selector of ['#about-title', '#capabilities-title', '#contact-title']) {
      const heading = page.locator(selector)
      await heading.scrollIntoViewIfNeeded()
      await expect(heading).toHaveAttribute('data-reveal-state', 'complete')
      expect(await heading.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true)
      expect(await heading.evaluate(node => getComputedStyle(node).transform)).toBe('none')
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
    const links = page.getByRole('link', { name: 'LinkedIn — Aerol Ilagan' })
    await expect(links).toHaveCount(2)
    for (const link of await links.all()) await expect(link).toHaveAttribute('href', linkedin)
    const contact = page.locator('#contact')
    await expect(contact.getByRole('link', { name: email })).toHaveAttribute('href', `mailto:${email}`)
    const social = contact.getByRole('link', { name: 'LinkedIn — Aerol Ilagan' })
    await social.focus()
    expect(await social.evaluate(node => getComputedStyle(node).outlineStyle)).toBe('solid')
    expect((await social.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    await mkdir('.qa/pre-v1-contact-and-motion', { recursive: true })
    await page.screenshot({ path: `.qa/pre-v1-contact-and-motion/contact-${width}.png` })
  })
}

test('desktop words stagger gently, finish once, and never move body copy', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const heading = page.locator('#opportunities-title')
  await heading.scrollIntoViewIfNeeded()
  const words = heading.locator('.reveal-word')
  const delays = await words.evaluateAll(nodes => nodes.map(node => parseInt((node as HTMLElement).style.getPropertyValue('--word-delay'))))
  expect(delays.slice(0, 4)).toEqual([0, 60, 120, 180])
  expect(Math.max(...delays)).toBeLessThanOrEqual(360)
  await expect(heading).toHaveAttribute('data-reveal-state', 'complete')
  await page.locator('#about-title').scrollIntoViewIfNeeded()
  await heading.scrollIntoViewIfNeeded()
  expect(await heading.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0)
  const bodyAnimation = await page.locator('.project-description, .story-narrative p, .technology-list li').evaluateAll(nodes => nodes.filter(node => getComputedStyle(node).animationName !== 'none').map(node => node.textContent))
  expect(bodyAnimation).toEqual([])
})

test('reduced motion is immediately static and switching it on consumes active reveals', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const node of await page.locator('[data-reveal-state]').all()) {
    await expect(node).toHaveAttribute('data-reveal-state', 'complete')
  }
  expect(await page.locator('.reveal-heading, .reveal-eyebrow, .reveal-word').evaluateAll(nodes => nodes.every(node => {
    const style = getComputedStyle(node)
    return style.animationName === 'none' && style.transform === 'none' && style.opacity === '1'
  }))).toBe(true)
  await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-state', 'reduced-motion')
  await expect(page.locator('canvas')).toHaveCount(0)

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.reload()
  const heading = page.locator('#opportunities-title')
  await heading.scrollIntoViewIfNeeded()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(heading).toHaveAttribute('data-reveal-state', 'complete')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  expect(await heading.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0)
})

test('absent or undelivered intersection observation never hides semantic headings', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeObserver = window.IntersectionObserver
    window.IntersectionObserver = class extends NativeObserver {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        super(options?.rootMargin === '0px 0px -6% 0px' ? () => {} : callback, options)
      }
    }
  })
  await page.goto('/')
  const heading = page.getByRole('heading', { name: 'Good work starts with a conversation.', level: 2 })
  await heading.scrollIntoViewIfNeeded()
  await expect(heading).toHaveAttribute('data-reveal-state', 'idle')
  await expect(heading).toBeVisible()
  expect(await heading.locator('.reveal-word').evaluateAll(nodes => nodes.every(node => getComputedStyle(node).opacity === '1'))).toBe(true)
  await page.addInitScript(() => Object.defineProperty(window, 'IntersectionObserver', { value: undefined, configurable: true }))
  await page.reload()
  await expect(page.locator('#opportunities-title')).toHaveAttribute('data-reveal-state', 'complete')
})

test('no-JavaScript fallback exposes the approved email and LinkedIn', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(baseURL!)
  await expect(page.getByRole('link', { name: email })).toHaveAttribute('href', `mailto:${email}`)
  await expect(page.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', linkedin)
  await context.close()
})

for (const variant of ['software', 'operations', 'general-va']) {
  test(`${variant} resume stays static and exposes approved contact profiles`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 })
    await page.goto(`/resume/${variant}`)
    await expect(page.locator('[data-reveal-state], .reveal-word')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'LinkedIn — Aerol Ilagan' })).toHaveAttribute('href', linkedin)
    await expect(page.locator(`a[href="mailto:${email}"]`)).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
  })
}
