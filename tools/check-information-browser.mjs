import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {createServer} from './serve.mjs';
import {INFORMATION_LABS} from '../formulas/shared/information-configs.js';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}/Formulas/`,browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[],missing=[],report=[];await mkdir('artifacts/information',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},serviceWorkers:'block'});
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.addInitScript(()=>{localStorage.setItem('formula-theme-mode','notebook');const paint=CanvasRenderingContext2D.prototype.fillRect;CanvasRenderingContext2D.prototype.fillRect=function(...args){this.canvas.__paints=(this.canvas.__paints||0)+1;return paint.apply(this,args);};});
 await page.goto(base);await page.waitForFunction(()=>window.FormulasAtlas?.equations?.length===282);
 const host=()=>page.locator('.learning-lab'),canvas=()=>page.locator('.learning-lab canvas');
 async function range(key,value){await page.locator(`[data-lab-key="${key}"]`).evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},String(value));}
 async function mode(index){await page.locator(`[data-lab-mode="${index}"]`).click();}
 for(const [id,config] of Object.entries(INFORMATION_LABS)){
  if(process.argv.length>2&&!process.argv.slice(2).includes(id))continue;console.log(id);
  await page.evaluate(async id=>{const {openEquationModal}=await import('./scripts/render-dynamic.js');openEquationModal(window.FormulasAtlas.equations.find(e=>e.id===id));},id);
  await page.waitForFunction(()=>document.querySelectorAll('.formula-tooltip-zone').length>0);
  const symbols=await page.locator('.formula-tooltip-zone').evaluateAll(z=>z.map(q=>({symbol:q.dataset.symbol,description:q.dataset.description})));
  assert(symbols.length>=5,`${id}: insufficient symbols`);
  const generic=symbols.filter(s=>/pendiente de revisión|según el contexto|escala, área, energía/.test(s.description));assert.equal(generic.length,0,`${id}: ${JSON.stringify(generic)}`);
  if(id==='general-relativity'||id==='einstein-tensor'){
   assert(symbols.some(s=>s.symbol==='G'&&s.description.startsWith('Componente del tensor de Einstein')),`${id}: indexed G confused with Newton's constant`);
   assert(symbols.some(s=>s.symbol==='R'&&s.description.startsWith('Componente del tensor de Ricci')),`${id}: indexed R confused with scalar`);
   if(id==='general-relativity')assert(symbols.some(s=>s.symbol==='G'&&s.description.startsWith('Constante de gravitación')));
  }
  const symbol=page.locator('.formula-tooltip-zone.is-symbol').last();await symbol.hover();assert(await page.locator('.formula-symbol-popover.visible').count());await symbol.focus();assert((await page.locator('.formula-symbol-popover.visible').innerText()).includes(await symbol.getAttribute('data-description')));
  const tabs=await page.evaluate(id=>window.FormulasAtlas.equations.find(e=>e.id===id).sections.filter(s=>s.type==='markdown').map(s=>s.key),id);
  for(const tab of tabs){
   await page.locator(`[data-target="${tab}"]`).click();await page.waitForFunction(tab=>document.querySelector(`[data-panel="${tab}"]`)?.dataset.loaded==='true',tab);assert((await page.locator(`[data-panel="${tab}"]`).innerText()).length>280,`${id}: ${tab} empty`);
  }
  await page.locator('[data-target="simulacion"]').click();await host().waitFor();await page.locator('.lab-answer').waitFor();
  await page.locator('.lab-answer').fill('9999');await page.locator('.lab-answer-form button').click();assert.equal(await host().evaluate(r=>r.__labState.solved),false);
  await page.locator('[data-lab-hint]').click();assert((await page.locator('.formula-plugin-readout').innerText()).includes(config.missions[0].hint));
  for(const [index,m] of config.missions.entries()){
   if(m.kind==='tune'){await page.locator('[data-lab-check]').click();assert.equal(await host().evaluate(r=>r.__labState.solved),false);for(const [key,value] of Object.entries(m.solution))await range(key,value);await page.locator('[data-lab-check]').click();}
   else if(m.kind==='choice'){await page.locator(`input[name="choice"][value="${m.answer}"]`).check();await page.locator('.lab-answer-form button').click();}
   else {await page.locator('.lab-answer').fill(String(Number(m.answer.toFixed(6))));await page.locator('.lab-answer-form button').click();}
   assert.equal(await host().evaluate(r=>r.__labState.solved),true,`${id}: rejected mission ${index+1}`);assert((await page.locator('.formula-plugin-readout').innerText()).includes(m.explanation));
   if(index<3)await page.locator('[data-lab-next]').click();
  }
  await mode(1);const key=config.controls.find(s=>!s.options).key,spec=config.controls.find(s=>s.key===key);const before=await page.locator('.formula-plugin-readout').innerText();await range(key,config.defaults[key]===spec.min?spec.max:spec.min);assert.notEqual(await page.locator('.formula-plugin-readout').innerText(),before);
  await page.locator('[data-lab-reset]').click();await page.screenshot({path:`artifacts/information/${id}-explore.png`});
  // Keyboard must manipulate the canvas or camera without requiring a pointer.
  if(id==='hydrogen-radial-probability-density')await mode(2); await canvas().focus();const yawBefore=await host().evaluate(r=>r.__labState.yaw),paramsBefore=await host().evaluate(r=>JSON.stringify(r.__labState.exploration));await page.keyboard.press(config.defaults[config.controls[0].key]===config.controls[0].max?'ArrowLeft':'ArrowRight');if([].includes(id)) assert.notEqual(await host().evaluate(r=>r.__labState.yaw),yawBefore); else assert.notEqual(await host().evaluate(r=>JSON.stringify(r.__labState.exploration)),paramsBefore,`${id}: keyboard inert`);
  await page.locator('[data-lab-reset]').click();await mode(2);await page.screenshot({path:`artifacts/information/${id}-demo.png`});
  if([].includes(id)){await mode(id==='hydrogen-radial-probability-density'?2:1);if(id==='gravitational-law')await mode(1);const yaw=await host().evaluate(r=>r.__labState.yaw),box=await canvas().boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+60,box.y+box.height/2+20);await page.mouse.up();assert.notEqual(await host().evaluate(r=>r.__labState.yaw),yaw);}
  await page.locator('[data-lab-reset]').click();
  if(id==='eigenvalues-eigenvectors'){await mode(1);await range('a',0);await range('b',-1);await range('c',1);await range('d',0);assert((await page.locator('.formula-plugin-readout').innerText()).includes('No hay direcciones propias reales'));}
  if(id==='potential-of-hydrogen-ph'){await mode(1);await range('loga',-16);assert((await page.locator('.formula-plugin-readout').innerText()).includes('pH = 16'));}
  if(id==='spacetime-interval'){await mode(1);await range('x',0);await range('ct',0);assert((await page.locator('.formula-plugin-readout').innerText()).includes('Eventos coincidentes'));}
  if(id==='energy-momentum-relation'){await mode(1);await range('mass',0);await range('momentum',0);assert((await page.locator('.formula-plugin-readout').innerText()).includes('indefinido'));}
  if(id==='michaelis-menten-kinetics'){await mode(2);await range('t',20);assert((await page.locator('.formula-plugin-readout').innerText()).includes('A 1 min'));await range('S',0);assert((await page.locator('.formula-plugin-readout').innerText()).includes('producto=0'));}
  await page.locator('[data-lab-reset]').click();
  await mode(1);if(config.timeline){
   const t=await host().evaluate(r=>r.__labState.exploration.t);await page.locator('[data-lab-play]').click();await page.waitForTimeout(250);assert((await host().evaluate(r=>r.__labState.exploration.t))>t);
   await page.locator('[data-lab-play]').click();const paused=await host().evaluate(r=>r.__labState.exploration.t);await page.waitForTimeout(100);assert.equal(await host().evaluate(r=>r.__labState.exploration.t),paused);
   await page.locator('[data-lab-play]').click();await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));delete document.hidden;});const hiddenTime=await host().evaluate(r=>r.__labState.exploration.t);await page.waitForTimeout(100);assert.equal(await host().evaluate(r=>r.__labState.exploration.t),hiddenTime);
   await range('t',19.95);await page.locator('[data-lab-play]').click();await page.waitForTimeout(200);assert.equal(await host().evaluate(r=>r.__labState.exploration.t),20);assert.equal(await page.locator('[data-lab-play]').getAttribute('aria-pressed'),'false');
   await page.locator('[data-lab-reset]').click();await page.locator('[data-lab-play]').click();
  }
  await page.evaluate(()=>{window.previousLab=document.querySelector('.learning-lab');window.previousCanvas=window.previousLab.querySelector('canvas');});await page.locator('[data-target="historia"]').click();assert.equal(await page.evaluate(()=>window.previousLab.__labState.active),false);const paints=await page.evaluate(()=>window.previousCanvas.__paints);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>window.previousCanvas.__paints),paints,`${id}: paint after cleanup`);
  await page.locator('[data-target="simulacion"]').click();await host().waitFor();assert(await host().evaluate(r=>r.__labState.active));
  await page.setViewportSize({width:390,height:844});
  for(const index of [0,1,2]){await mode(index);await host().evaluate(r=>r.scrollTop=0);await page.screenshot({path:`artifacts/information/${id}-mobile-${index}.png`});const bounds=await host().evaluate(r=>{const c=r.querySelector('canvas').getBoundingClientRect(),controls=r.querySelector('.formula-plugin-controls').getBoundingClientRect();return {scroll:r.scrollWidth,width:r.clientWidth,height:c.height,overlap:controls.top<c.bottom-1};});assert(bounds.scroll<=bounds.width+1,`${id}: mobile overflow`);assert(bounds.height>=200,`${id}: small canvas`);assert(!bounds.overlap,`${id}: controls overlap`);await host().evaluate(r=>r.scrollTop=r.scrollHeight);await page.screenshot({path:`artifacts/information/${id}-mobile-controls-${index}.png`});}
  if([].includes(id)){await mode(id==='hydrogen-radial-probability-density'?2:1);
   await host().evaluate(r=>r.scrollTop=0);await canvas().scrollIntoViewIfNeeded();const session=await page.context().newCDPSession(page);await session.send('Emulation.setTouchEmulationEnabled',{enabled:true});const box=await canvas().boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;const yaw=await host().evaluate(r=>r.__labState.yaw);await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+40,y:y+15}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.notEqual(await host().evaluate(r=>r.__labState.yaw),yaw);await session.detach();
  }
  await page.keyboard.press('Escape');await page.setViewportSize({width:1440,height:1000});report.push({id,missions:4,modes:3,symbols:symbols.length,mobile:true,cleanup:true});
 }
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await writeFile(process.argv.length>2?'artifacts/information-browser-focused.json':'artifacts/information-browser-checks.json',JSON.stringify({labs:report,errors,missing},null,2));console.log(JSON.stringify({labs:report.length,missions:report.length*4,errors,missing}));
} catch(error) {const p=browser.contexts()[0]?.pages()[0];if(p)await p.screenshot({path:'artifacts/information-failure.png'});throw error;} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
