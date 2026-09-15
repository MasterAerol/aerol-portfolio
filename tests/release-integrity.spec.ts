import { expect, test } from '@playwright/test'

const publicLinks = [
  'https://github.com/MasterAerol',
  'https://github.com/MasterAerol/opscheck-flow',
  'https://github.com/MasterAerol/opscheck-flow/releases/tag/v0.1.0',
  'mailto:aerolilagan2002@gmail.com',
]
const titles = {
  '/': 'James Aerol Ilagan — Software, Automation & Operations',
  '/resume/software': 'James Aerol Ilagan — Software Developer Resume',
  '/resume/operations': 'James Aerol Ilagan — AI Operations & Technical VA Resume',
}
for (const [route, title] of Object.entries(titles)) {
  test(`${route}: production links, landmarks, metadata, assets and console remain valid`, async ({ page }) => {
    const errors: string[] = [], warnings: string[] = [], failures: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text())
      if (message.type() === 'warning') warnings.push(message.text())
    })
    page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`) })
    await page.goto(route)
    await page.reload()
    await expect(page).toHaveTitle(title)
    await expect(page.getByRole('main')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    if (route === '/') await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-state', 'ready')
    else await expect(page.locator('canvas')).toHaveCount(0)
    await expect(page.locator('body')).not.toContainText(/OpenAI API|Docker|Resend|\bAWS\b|Kubernetes|Stripe|enterprise.grade|production.proven|thousands of users|\bclients\b|\bcustomers\b|Professional Experience|Employment History|Play Store|launching soon|PasaWise CE/i)

    const integrity = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(node => node.id)
      return {
        duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
        missingControls: [...document.querySelectorAll('[aria-controls]')].flatMap(node => (node.getAttribute('aria-controls') ?? '').split(' ').filter(id => !document.getElementById(id))),
        links: [...document.querySelectorAll('a')].map(link => ({ href: link.getAttribute('href'), label: link.getAttribute('aria-label') || link.textContent?.trim() })),
        missingLocalHashes: [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash),
      }
    })
    expect(integrity.duplicateIds).toEqual([])
    expect(integrity.missingControls).toEqual([])
    expect(integrity.missingLocalHashes).toEqual([])
    for (const link of integrity.links) {
      expect(link.label).toBeTruthy()
      expect(link.href).toBeTruthy()
      expect(link.href).not.toBe('#')
      if (!link.href!.startsWith('#')) expect([...publicLinks, '/resume/software', '/resume/operations', '/#resume']).toContain(link.href)
    }
    await expect(page.locator('[download], a[href*="linkedin"], a[href$=".pdf"], link[rel="canonical"], meta[property="og:url"]')).toHaveCount(0)
    const favicon = await page.request.get('/favicon.svg')
    expect(favicon.ok()).toBe(true)
    expect(favicon.headers()['content-type']).toContain('image/svg+xml')
    expect(await favicon.text()).toContain('#55d4ee')
    expect(failures).toEqual([])
    expect(errors).toEqual([])
    if (warnings.length) await test.info().attach('browser-warnings', { body: warnings.join('\n'), contentType: 'text/plain' })
    // Chromium's software GPU can warn during compositor readback; retain it in the report.
    expect(warnings.filter(warning => !/^\[\.WebGL-[^\]]+\]GL Driver Message .*GPU stall due to ReadPixels/.test(warning))).toEqual([])
  })
}
