import { mkdir } from 'node:fs/promises'
import { test, expect } from '@playwright/test'

for (const width of [430, 412, 390, 375, 360, 1440]) {
  test(`${width}px: three resume choices and expanded opportunities fit the approved layout`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('.opportunity-list li')).toHaveCount(8)
    for (const role of ['General Virtual Assistant', 'Data Entry / Administrative Support', 'Research / Documentation Support']) {
      await expect(page.locator('.opportunity-list')).toContainText(role)
    }
    const cards = page.locator('.resume-card')
    await expect(cards).toHaveCount(3)
    const links = page.locator('.resume-card a')
    expect(await links.evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))).toEqual(['/resume/software', '/resume/operations', '/resume/general-va'])
    for (const card of await cards.all()) {
      expect((await card.boundingBox())!.width).toBeGreaterThanOrEqual(290)
      const link = card.getByRole('link')
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    }
    expect(await page.locator('.resume-card, .resume-card h3, .resume-card p, .opportunity-list li').evaluateAll(nodes => nodes.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent))).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
    await mkdir('.qa/pre-v1-general-va/screenshots', { recursive: true })
    await page.locator('#resume').screenshot({ path: `.qa/pre-v1-general-va/screenshots/resume-choices-${width}.png` })
    await page.locator('#opportunities').screenshot({ path: `.qa/pre-v1-general-va/screenshots/opportunities-${width}.png` })
    await page.getByRole('link', { name: 'General VA / Data Entry / Admin Resume — View Resume' }).click()
    await expect(page).toHaveURL(/\/resume\/general-va$/)
    await expect(page).toHaveTitle('James Aerol Ilagan — General VA & Data Entry Resume')
    await page.screenshot({ path: `.qa/pre-v1-general-va/screenshots/general-va-${width}.png`, fullPage: true })
  })
}
