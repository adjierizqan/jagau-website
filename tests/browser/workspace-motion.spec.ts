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

test('words and controls have independent choreography, then settle', async ({page}) => {
 await page.goto('/');
 const headline=page.locator('.home-conversation h2');
 await expect(headline).toContainText('Software for');
 await expect(headline.locator('.motion-word')).toHaveCount(5);
 await page.getByRole('button',{name:'Replay motion ↻'}).click();
 await expect.poll(()=>headline.evaluate(el=>{
  const words=Array.from(el.querySelectorAll('.motion-word'));
  return new Set(words.map(word=>getComputedStyle(word).transform)).size;
 })).toBeGreaterThan(1);
 await expect.poll(()=>page.locator('.aw-stage').evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running'||a.pending).length)).toBe(0);
 await expect(page.getByRole('textbox',{name:'Ask about JAGAU or founder work'})).toBeEditable();
});

test('reduced motion keeps all real words readable and cancels choreography',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.getByRole('button',{name:'Replay motion ↻'})).toBeHidden();
 const words=page.locator('.home-conversation h2 .motion-word');
 await expect(words.first()).toHaveCSS('opacity','1');
 await expect(words.first()).toHaveCSS('transform','none');
 expect(await words.evaluateAll(elements=>elements.flatMap(el=>el.getAnimations()).length)).toBe(0);
 await page.locator('.aw-primary-nav').getByRole('button',{name:'Studio',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Studio',exact:true})).toBeVisible();
});
