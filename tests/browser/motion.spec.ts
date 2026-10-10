import { test, expect } from '@playwright/test';

test('motion studies play, settle, replay and cancel when reduced motion changes', async ({ page }) => {
  await page.goto('/motion-study/');
  await page.getByRole('button', { name: 'Play both treatments' }).click();
  await expect.poll(() => page.locator('.motion-study-screen').evaluateAll(es => es.reduce((n,e)=>n+e.getAnimations().length,0))).toBe(2);
  await page.waitForTimeout(1700);
  expect(await page.locator('.motion-study-screen').evaluateAll(es=>es.every(e=>getComputedStyle(e).transform==='none'))).toBe(true);
  await page.getByRole('button', { name: 'Play both treatments' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('.motion-study-screen').evaluateAll(es => es.reduce((n,e)=>n+e.getAnimations().length,0))).toBe(0);
});

test('home depth responds to keyboard and settles without perpetual animation', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.goto('/');
  const link = page.locator('.home-proof a').first();
  await link.focus();
  await page.waitForTimeout(1600);
  const image = link.locator('img');
  expect(await image.evaluate(e=>getComputedStyle(e).transform)).not.toBe('none');
  await page.emulateMedia({ reducedMotion:'reduce' });
  await expect.poll(()=>image.evaluate(e=>getComputedStyle(e).transform)).toBe('none');
  await link.press('Enter');
  await expect(page).toHaveURL(/projects\/labstock/);
});

test('cleared screenshots remain visible with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled:false });
  const page = await context.newPage();
  await page.goto('/');
  const images = page.locator('.home-proof img');
  await expect(images).toHaveCount(3);
  for (const image of await images.all()) {
    await expect(image).toBeVisible();
    expect(await image.evaluate(e=>getComputedStyle(e).opacity)).toBe('1');
  }
  await context.close();
});
