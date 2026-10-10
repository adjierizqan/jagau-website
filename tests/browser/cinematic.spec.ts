import {test,expect} from '@playwright/test';
test('film playback, project switching and curated chat remain connected',async({page,browserName})=>{
 await page.goto('/');
 const stage=page.getByRole('region',{name:'LabStock cinematic presentation'});
 await expect(stage).toBeVisible();
 await stage.scrollIntoViewIfNeeded();
 const video=stage.locator('video');
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThan(1);
 if(await video.evaluate((v:HTMLVideoElement)=>v.paused))await stage.getByRole('button',{name:'Play LabStock film'}).click();
 const before=await video.evaluate((v:HTMLVideoElement)=>v.currentTime);
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(before+.2);
 await stage.getByRole('button',{name:'Pause LabStock film'}).click();
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);
 await stage.getByRole('button',{name:'02 SuhuLog'}).click();
 await expect(page.getByRole('region',{name:'SuhuLog cinematic presentation'})).toBeVisible();
 await page.getByRole('button',{name:'Ask about SuhuLog ↗'}).click();
 await expect(page.getByText('JAGAU Guide · curated',{exact:true})).toBeVisible();
 await expect(page.getByRole('region',{name:'SuhuLog cinematic presentation'})).toBeVisible();
 await page.screenshot({path:`artifacts/cinematic-qa/${browserName}-chat.png`});
});
test('reduced motion remains still until explicit play; keyboard switches project',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const stage=page.getByRole('region',{name:'LabStock cinematic presentation'});await stage.scrollIntoViewIfNeeded();
 await expect(stage.locator('video')).toHaveJSProperty('paused',true);
 await stage.getByRole('button',{name:'03 BDRS'}).focus();await page.keyboard.press('Enter');
 const bdrs=page.getByRole('region',{name:'BDRS cinematic presentation'});
 await expect(bdrs.locator('video')).toHaveJSProperty('paused',true);
 await bdrs.getByRole('button',{name:'Play BDRS film'}).click();
 await expect.poll(()=>bdrs.locator('video').evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(.15);
});
test('mobile has no horizontal overflow and exposes film controls',async({page,browserName})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const stage=page.getByRole('region',{name:'LabStock cinematic presentation'});await stage.scrollIntoViewIfNeeded();
 await expect(stage.getByRole('group',{name:'Choose a software presentation'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
 await page.screenshot({path:`artifacts/cinematic-qa/${browserName}-mobile.png`});
});
