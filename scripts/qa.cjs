const {chromium}=require('../../Aniro/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
const base=process.argv[2]||'http://127.0.0.1:3320',output=path.resolve(__dirname,'../.codex-run');fs.mkdirSync(output,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:'F:/AniroBuild/playwright/chromium-1228/chrome-win64/chrome.exe'}),errors=[],report=[],mediaRequests=[];try{
for(const language of ['ar','en'])for(const width of [320,390,768,1024,1440]){
 const height=width>=1024?800:844,context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
 await context.addInitScript(language=>localStorage.setItem('aniro-site-language',language),language);
 await context.route('https://raw.githubusercontent.com/**/version.json',route=>route.fulfill({json:JSON.parse(fs.readFileSync(path.resolve(__dirname,'../release.json'),'utf8'))}));
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\.(mp4|webm|m3u8)(?:[?#]|$)/.test(r.url()))mediaRequests.push(r.url());});await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.locator('[data-version]').waitFor();
 await page.waitForFunction(()=>document.querySelector('[data-version]').textContent==='v6.15');
 const hero=await page.evaluate(()=>({lang:document.documentElement.lang,dir:document.documentElement.dir,width:innerWidth,scroll:document.documentElement.scrollWidth,cta:document.querySelector('.hero-actions').getBoundingClientRect().bottom,headline:document.querySelector('h1').getBoundingClientRect().bottom}));
 if(hero.lang!==language||hero.scroll>width||hero.cta>height)throw Error('Hero or overflow '+JSON.stringify(hero));
 for(const anchor of await page.locator('[data-download]').all())if(!/\/its3li\/Aniro\/releases\/download\/v6.15\/aniro-v6.15.apk$/.test(await anchor.getAttribute('href')))throw Error('Wrong APK link');
 for(const name of ['quran','listen','tafseer','reciters']){await page.locator('[data-feature='+name+']').click();await page.waitForFunction(()=>{const image=document.getElementById('feature-screen');return image.complete&&image.naturalWidth>0;});if(await page.locator('[role=tab][aria-selected=true]').count()!==1)throw Error('Broken feature tabs');}
 await page.locator('[data-feature=quran]').click();await page.locator('[data-feature=quran]').focus();await page.keyboard.press(language==='ar'?'ArrowLeft':'ArrowRight');if(await page.locator('[role=tab][aria-selected=true]').getAttribute('data-feature')!=='listen')throw Error('Tab keyboard navigation');
 if(width<768){await page.locator('#menu-toggle').click();if(await page.locator('#menu-toggle').getAttribute('aria-expanded')!=='true')throw Error('Menu did not open');await page.locator('#mobile-nav a[href="#install"]').click();if(await page.locator('#menu-toggle').getAttribute('aria-expanded')!=='false')throw Error('Menu did not close');}
 const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>i.getAttribute('src')&&i.complete&&!i.naturalWidth).map(i=>i.src));if(broken.length)throw Error('Broken images '+JSON.stringify(broken));
 if(await page.locator('video, audio, dialog, [data-open-movie]').count())throw Error('Unexpected media UI');await page.screenshot({path:path.join(output,language+'-'+width+'.png'),fullPage:true});
 report.push({language,width,hero,features:'passed',downloads:'v6.15',keyboard:'passed',brokenImages:broken});await context.close();
}
const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'}),page=await context.newPage();await page.goto(base);
await page.route('https://raw.githubusercontent.com/**/version.json',route=>route.abort());await page.reload();await page.waitForFunction(()=>document.querySelector('[data-version]').textContent==='v6.15');await page.route('**/release.json',route=>route.fulfill({json:{versionCode:21,versionName:'6.15',apkUrl:'https://example.invalid/file.apk'}}));await page.reload();await page.waitForFunction(()=>document.querySelector('[data-download]').href==='https://github.com/its3li/Aniro/releases/latest');
await page.goto(base+'/privacy.html');if(!await page.getByText('BigDataCloud',{exact:false}).count())throw Error('Missing privacy content');await context.close();
if(errors.length||mediaRequests.length)throw Error(JSON.stringify({errors,mediaRequests}));fs.writeFileSync(path.join(output,'qa.json'),JSON.stringify({report,errors,mediaRequests,releaseFallback:'passed',mediaRemoved:true},null,2));console.log('10 viewport/language checks; tabs, downloads, keyboard, menu, media removal, and release fallback passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
