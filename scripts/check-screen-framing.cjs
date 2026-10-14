const {chromium}=require('../../Aniro/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
const base=process.argv[2]||'http://127.0.0.1:3320',root=path.resolve(__dirname,'..'),report=[];
(async()=>{const browser=await chromium.launch({executablePath:'F:/AniroBuild/playwright/chromium-1228/chrome-win64/chrome.exe'});try{
for(const language of ['ar','en'])for(const viewport of [{width:320,height:640},{width:390,height:844},{width:768,height:1024},{width:1024,height:768},{width:1440,height:900}]){
 const page=await browser.newPage({viewport,reducedMotion:'reduce'});await page.addInitScript(language=>localStorage.setItem('aniro-site-language',language),language);await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.locator('#daily').scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.hero-screen>img,.azkar-feature figure>img,.utility-image')].every(image=>image.complete&&image.naturalWidth>0));
 if(await page.locator('.prayer-detail,.hero-side,img[src*="-detail.webp"]').count())throw Error('Detached crop still present');
 const screens=await page.locator('.hero-screen>img,.azkar-feature figure>img,.utility-image').evaluateAll(images=>images.map(image=>{
  const r=image.getBoundingClientRect(),css=getComputedStyle(image),ancestors=[];
  for(let parent=image.parentElement;parent&&parent!==document.body;parent=parent.parentElement){const s=getComputedStyle(parent),p=parent.getBoundingClientRect();ancestors.push({name:parent.className,overflowX:s.overflowX,overflowY:s.overflowY,rotate:s.rotate,left:p.left,right:p.right,top:p.top,bottom:p.bottom});}
  return{src:image.getAttribute('src'),left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,sourceRatio:image.naturalWidth/image.naturalHeight,renderedRatio:r.width/r.height,fit:css.objectFit,rotate:css.rotate,ancestors};
 }));
 if(screens.length!==4)throw Error('Expected Home, Azkar, Tasbeeh, and Qibla');
 for(const screen of screens){if(Math.abs(screen.sourceRatio-screen.renderedRatio)>.004||screen.fit!=='contain')throw Error('Stretched screenshot '+screen.src);if(screen.left<-.5||screen.right>viewport.width+.5)throw Error('Screen outside page '+screen.src);if(screen.rotate!=='none')throw Error('Rotated screenshot');for(const ancestor of screen.ancestors){if(ancestor.rotate!=='none')throw Error('Rotated screen container');if(['hidden','clip','auto','scroll'].includes(ancestor.overflowY)&&(screen.top<ancestor.top-.5||screen.bottom>ancestor.bottom+.5))throw Error('Vertically clipped '+screen.src+' in '+ancestor.name);if(['hidden','clip'].includes(ancestor.overflowX)&&(screen.left<ancestor.left-.5||screen.right>ancestor.right+.5))throw Error('Horizontally clipped '+screen.src);}}
 const overlaps=await page.locator('.utility-feature').evaluateAll(items=>items.map(item=>{const copy=item.querySelector('.utility-copy').getBoundingClientRect(),image=item.querySelector('.utility-image').getBoundingClientRect();return Math.min(copy.right,image.right)-Math.max(copy.left,image.left)>1&&Math.min(copy.bottom,image.bottom)-Math.max(copy.top,image.top)>1;}));if(overlaps.some(Boolean))throw Error('Copy overlaps screenshot');
 report.push({language,viewport,screens,copyOverlap:false});await page.close();
}
fs.mkdirSync(path.join(root,'.codex-run'),{recursive:true});fs.writeFileSync(path.join(root,'.codex-run/screen-framing.json'),JSON.stringify({base,checks:report},null,2));console.log('All four product screens are complete, upright, unstretched, and unclipped in 10 language/viewport checks.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exit(1);});
