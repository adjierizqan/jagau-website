import { test, expect } from '@playwright/test';

for (const [width, height] of [[1440,900],[768,1024],[390,844]]) for (const theme of ['light','dark'] as const) {
  test(`evidence-led home and Indonesian studio summary ${width} ${theme}`, async ({page}) => {
    await page.setViewportSize({width,height});
    await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});
    await page.addInitScript(value=>localStorage.setItem('aw-theme',value),theme);
    await page.goto('/');
    // Real product evidence and the curated conversation share the homepage.
    const preview=page.locator('.home-start .evidence-space');
    await expect(preview).toHaveCount(1);
    const layout=await page.evaluate(()=>{
      const preview=document.querySelector('.home-start .evidence-space')!.getBoundingClientRect();
      const composer=document.querySelector('.home-guide')!.getBoundingClientRect();
      return {previewWidth:preview.width,previewTop:preview.top,previewLeft:preview.left,composerRight:composer.right,composerBottom:composer.bottom};
    });
    expect(layout.previewWidth).toBeGreaterThan(width===390?300:width===1440?450:400);
    if(width>=1000) expect(layout.composerRight).toBeLessThan(layout.previewLeft);
    else expect(layout.composerBottom).toBeLessThan(layout.previewTop);
    await expect(page.locator('.evidence-context')).toContainText('Real application screens · synthetic demo data');
    await expect(page.locator('.home-positioning')).toContainText('Curated answers · no live AI');
    if(width<760) await page.getByRole('button',{name:'Open navigation',exact:true}).click();
    await page.locator('.aw-primary-nav').getByRole('button',{name:'Studio',exact:true}).click();
    const summary=page.locator('.studio-language summary');
    await summary.focus();await page.keyboard.press('Enter');
    await expect(page.locator('.studio-language p[lang="id"]')).toBeVisible();
    await expect(page.locator('.studio-language')).toContainText('Adjie Rizqan');
    await expect(page.locator('.studio-approach')).toContainText('workbook, sheet and row');
    await expect(page.locator('.studio-systems')).toContainText('In progress · release not verified');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await page.locator('main').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  });
}
