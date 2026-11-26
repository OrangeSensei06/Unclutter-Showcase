import { test, expect } from '@playwright/test';
const base = '/Unclutter-Showcase/';
test('Home entry, full correction walkthrough, filtering, reset and browser-only network', async ({page})=>{
 const errors:string[]=[], unexpected:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{const u=new URL(r.url());if(u.origin!=='http://127.0.0.1:4173'||!u.pathname.startsWith(base)||['fetch','xhr','websocket'].includes(r.resourceType()))unexpected.push(r.url());});
 await page.setViewportSize({width:1440,height:1000});await page.goto(base);
 await expect(page.getByRole('heading',{name:'Your inbox, in your own words.'})).toBeVisible();
 await page.screenshot({path:'.qa/home.png',fullPage:true});await page.getByRole('main').getByRole('link',{name:'Try It Yourself'}).click();
 await expect(page.getByRole('heading',{name:'All mail',exact:true})).toBeVisible();
 await expect(page.locator('.list-title strong')).toHaveText('50 messages');
 await page.locator('[data-message-id="campus_open_mic"]').click();
 const reader=page.getByRole('article',{name:'Email reader'});await expect(reader).toBeVisible();await page.screenshot({path:'.qa/desktop-reader.png',fullPage:true});
 await expect(reader.getByText('Why this category?')).toBeVisible();
 await expect(reader.getByText(/An optional campus concert is an event/)).toBeVisible();
 await reader.getByLabel('Category',{exact:true}).selectOption('clubs');await reader.getByRole('button',{name:'Save category'}).click();
 await expect(page.getByRole('status')).toContainText('Category changed to Clubs');await expect(reader.locator('.example-category')).toHaveText('Clubs');await expect(reader.getByText(/You chose this category/)).toBeVisible();
 await page.screenshot({path:'.qa/desktop-corrected.png',fullPage:true});
 await page.getByRole('button',{name:'Close email reader'}).click();
 await page.getByRole('navigation',{name:'Categories'}).getByRole('button',{name:/^Clubs/}).click();await expect(page.locator('[data-message-id="campus_open_mic"]')).toBeVisible();
 await page.getByRole('navigation',{name:'Categories'}).getByRole('button',{name:/^All /}).click();
 await page.getByRole('searchbox').fill('counter simulation');await expect(page.locator('.list-title strong')).toHaveText('1 messages');
 await page.getByRole('searchbox').fill('nothing-matches-this-fictional-search');await expect(page.getByText('No messages match this view.')).toBeVisible();await page.getByRole('button',{name:'Clear filters'}).click();
 await page.getByRole('navigation',{name:'Inbox pagination'}).getByRole('button',{name:'Next',exact:true}).click();await expect(page.locator('.pagination>span')).toHaveText('11–20 of 50');
 await page.getByRole('button',{name:'Reset demo',exact:true}).last().click();await expect(page.locator('.list-title strong')).toHaveText('50 messages');
 await page.locator('[data-message-id="campus_music_rehearsal"]').click();await page.getByRole('button',{name:'Close email reader'}).click();await page.getByRole('button',{name:'Unread',exact:true}).click();await expect(page.locator('[data-message-id="campus_music_rehearsal"]')).toHaveCount(0);
 await page.reload();await expect(page.locator('.list-title strong')).toHaveText('50 messages');
 expect(unexpected).toEqual([]);expect(errors).toEqual([]);
});
test('direct static page navigation and accurate accessible architecture table',async({page,request})=>{
 for(const route of ['', 'try/','try/index.html','architecture/','architecture/index.html']){const response=await request.get(base+route);expect(response.status()).toBe(200);await page.goto(base+route);await expect(page.getByRole('main')).toBeVisible();if(route.startsWith('try'))await expect(page.getByRole('heading',{name:'All mail',exact:true})).toBeVisible();else if(route.startsWith('architecture'))await expect(page.getByRole('heading',{name:'When bigger batches stop paying off'})).toBeVisible();}
 await page.goto(base+'architecture/');await expect(page.getByRole('table')).toBeVisible();
 const rows=page.getByRole('table').getByRole('row');await expect(rows).toHaveCount(5);await expect(rows.nth(1)).toContainText('6,633');await expect(rows.nth(2)).toContainText('4,347');await expect(rows.nth(3)).toContainText('4,349');await expect(rows.nth(4)).toContainText('4,349');
 await expect(page.getByText('34.5%',{exact:true})).toBeVisible();await page.screenshot({path:'.qa/architecture.png',fullPage:true});
});
test('mobile navigation, reading, correction, focus, dark mode and reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'try/');
 await expect(page.getByRole('link',{name:'Architecture',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'☰ Navigation'}).click();await expect(page.getByRole('button',{name:'Close navigation'})).toBeFocused();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'☰ Navigation'})).toBeFocused();
 await page.getByRole('button',{name:'☰ Navigation'}).click();await page.getByRole('navigation',{name:'Mailbox views'}).getByRole('button',{name:/Urgent/}).click();await expect(page.getByRole('heading',{name:'Urgent',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Reset demo',exact:true}).last().click();await page.locator('[data-message-id="campus_open_mic"]').click();await expect(page.getByRole('article')).toBeVisible();await expect(page.getByRole('region',{name:'Inbox messages'})).toBeHidden();await expect(page.getByRole('article').getByRole('heading',{level:2})).toBeFocused();
 await page.getByLabel('Category',{exact:true}).selectOption('academics');await page.getByRole('button',{name:'Save category'}).click();await expect(page.getByRole('status')).toContainText('Academics');
 expect(await page.locator('.main').evaluate(e=>e.scrollTop)).toBe(0);await page.screenshot({path:'.qa/mobile-reader.png',fullPage:true});await page.getByRole('button',{name:'Close email reader'}).click();await expect(page.locator('[data-message-id="campus_open_mic"]')).toBeFocused();
 await page.locator('.site-header').getByRole('button',{name:'Switch to dark mode'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.screenshot({path:'.qa/mobile-dark.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('tablet and small mobile page layouts retain the navigation and table',async({page})=>{for(const width of [820,320]){await page.setViewportSize({width,height:900});for(const route of ['','try/','architecture/']){await page.goto(base+route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.getByRole('navigation',{name:'Showcase pages'})).toBeVisible();if(route==='architecture/')await expect(page.getByRole('table')).toBeVisible();}await page.screenshot({path:'.qa/architecture-'+width+'.png',fullPage:true});}});

test('Inbox Desk links, illustrative semantics, keyboard CTA and light/dark mobile layouts',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);await expect(page.getByRole('figure',{name:/An illustrated example/})).toBeVisible();await expect(page.locator('.inbox-desk button')).toHaveCount(0);await expect(page.getByText('Same email. Different rules.')).toBeVisible();await page.getByRole('main').getByRole('link',{name:'Try It Yourself',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('heading',{name:'All mail',exact:true})).toBeVisible();
 await page.goto(base);await page.getByRole('link',{name:'Behind the AI',exact:true}).click();await expect(page.getByRole('heading',{name:'When bigger batches stop paying off'})).toBeVisible();
 for(const name of ['Read about personal categories','Explore the batching research']){await page.goto(base);await page.getByRole('link',{name,exact:true}).click();await expect(page.locator(locationHash(name))).toBeVisible();}
 for(const width of [1440,390,320])for(const theme of ['light','dark']){await page.setViewportSize({width,height:900});await page.goto(base);await page.evaluate(t=>{localStorage.setItem('unclutter-appearance',t);window.dispatchEvent(new Event('unclutter-appearance'));},theme);await expect(page.locator('html')).toHaveAttribute('data-theme',theme);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'.qa/home-'+width+'-'+theme+'.png',fullPage:true});}
});
function locationHash(name:string){return name.startsWith('Read')?'#personal-title':'#budget-title';}

test('authorized mascot decodes and exact favicon bytes work on all static routes',async({page,request})=>{
 const {createHash}=await import('node:crypto');const expected='8b83a598d3ac0c62b11be8a612b33e83d9c7cb82d5cc44affccd0179fe347679';
 for(const route of ['','try/','architecture/']){await page.goto(base+route);const image=page.locator('.site-header .brand-mascot');await expect(image).toBeVisible();await expect(image).toHaveAttribute('src',base+'brand/sleepy-cat.png');expect(await image.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth===1254&&e.naturalHeight===1254)).toBe(true);const href=await page.locator('link[rel="icon"]').getAttribute('href');expect(href).toBe(base+'brand/sleepy-cat.png');const response=await request.get(href!);expect(response.status()).toBe(200);expect(response.headers()['content-type']).toContain('image/png');const bytes=await response.body();expect(bytes.length).toBe(1210492);expect(createHash('sha256').update(bytes).digest('hex')).toBe(expected);await page.reload();await expect(image).toBeVisible();}
});

test('engineering figures remain readable without horizontal scrolling in light and dark',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [1440,390,320])for(const theme of ['light','dark']){await page.setViewportSize({width,height:900});await page.goto(base+'architecture/');await page.evaluate(t=>{localStorage.setItem('unclutter-appearance',t);window.dispatchEvent(new Event('unclutter-appearance'));},theme);await expect(page.locator('html')).toHaveAttribute('data-theme',theme);await expect(page.getByRole('figure',{name:/Figure 1/})).toBeVisible();await expect(page.getByRole('figure',{name:/Figure 2/})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('.eng-map, .eng-flow, .eng-benchmark table').evaluateAll(els=>els.every(e=>e.scrollWidth<=e.clientWidth+1))).toBe(true);await page.screenshot({path:'.qa/engineering-'+width+'-'+theme+'.png',fullPage:true});}
});
