import { expect, test } from '@playwright/test'

test('desktop studio gallery, FAQ, portrait request and enquiry', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect(
    page.getByRole('heading', { name: /Little portraits/ }),
  ).toBeVisible()
  await page.screenshot({
    path: 'test-results/studio-desktop.png',
    fullPage: true,
  })

  await page.getByRole('button', { name: 'Pets', exact: true }).click()
  await expect(page.locator('.gallery-piece')).toHaveCount(1)
  await page.locator('.gallery-piece').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Make one yours' }).click()
  await expect(
    page.getByRole('button', { name: /A furry friend/ }),
  ).toHaveAttribute('aria-pressed', 'true')
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Make it personal', exact: true })
    .click()
  await page
    .getByRole('textbox', { name: 'Your name', exact: true })
    .fill('Browser Portrait Test')
  await page
    .getByRole('textbox', { name: 'Email address', exact: true })
    .fill('browser-test@example.com')
  await page
    .getByRole('textbox', { name: 'Your little details' })
    .fill('A portrait of our beloved dog.')
  await page.locator('input[name="consent"]').check()
  await page.getByRole('button', { name: 'Request my portrait' }).click()
  await expect(page.locator('.reference-number')).toHaveText(/^YS-/)
  await expect(
    page.getByText('No payment has been taken', { exact: false }),
  ).toBeVisible()
  await page.screenshot({ path: 'test-results/studio-request.png' })
  await page.getByRole('button', { name: 'Back to the studio' }).click()

  await page.getByText('How do custom portraits work?', { exact: true }).click()
  await expect(page.locator('.faq-list details').first()).toHaveAttribute(
    'open',
    '',
  )
  await page
    .getByRole('button', { name: 'Let’s draw a crowd', exact: true })
    .click()
  await page
    .getByRole('textbox', { name: 'Your name', exact: true })
    .fill('Browser Event Test')
  await page
    .getByRole('textbox', { name: 'Email address', exact: true })
    .fill('event-test@example.com')
  await page.getByLabel('Event date', { exact: true }).fill('2099-06-20')
  await page
    .getByRole('textbox', { name: 'Where’s the party?' })
    .fill('Melbourne, Carlton Gardens')
  await page.locator('input[name="consent"]').check()
  await page.getByRole('button', { name: 'Send a little hello' }).click()
  await expect(page.locator('.reference-number')).toHaveText(/^YS-/)
  await expect(
    page.getByRole('heading', { name: 'Let’s make it memorable.' }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('mobile navigation, layout and form fit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({
    path: 'test-results/studio-mobile.png',
    fullPage: true,
  })
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByRole('navigation')).toBeVisible()
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Live illustration', exact: true })
    .click()
  await expect(page.getByRole('navigation')).not.toBeVisible()
  await page
    .getByRole('button', { name: 'Let’s draw a crowd', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  expect(
    await page
      .locator('dialog')
      .evaluate((dialog) => dialog.scrollWidth <= dialog.clientWidth),
  ).toBe(true)
  await page.screenshot({ path: 'test-results/studio-mobile-form.png' })
  await page.keyboard.press('Escape')
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
  }
})
