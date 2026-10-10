import {test,expect} from '@playwright/test';

test('selected work preserves cleared screenshot evidence and animates real copy',async({page})=>{
 await page.goto('/');
 const first=page.locator('.home-project').first();
 await expect(first.locator('img')).toHaveAttribute('src',/^\/projects\/labstock\//);
 await first.scrollIntoViewIfNeeded();
 await expect(first.locator('h3')).toContainText('LabStock');
 await first.focus();
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/\/projects\/labstock\/$/);
 await expect(page.getByRole('heading',{name:'About the evidence'})).toBeAttached();
});

test('workspace navigation motion finishes and reduced motion is immediate',async({page})=>{
 await page.goto('/');
 await page.locator('.aw-primary-nav').getByRole('button',{name:'Studio',exact:true}).click();
 await expect(page.locator('main h1')).toHaveText('Studio');
 await expect.poll(()=>page.locator('main').evaluate(el=>el.getAnimations().length)).toBe(0);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('.aw-primary-nav').getByRole('button',{name:'Home',exact:true}).click();
 expect(await page.locator('main').evaluate(el=>el.getAnimations().length)).toBe(0);
 await expect(page.getByRole('textbox',{name:'Ask about JAGAU or founder work'})).toBeVisible();
});
