import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {createServer} from './serve.mjs';
import {LABS} from '../formulas/shared/learning-configs.js';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}/Formulas/`;
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[],missing=[],report=[];await mkdir('artifacts/labs',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},serviceWorkers:'block'});
 page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)missing.push(response.url());});
 await page.addInitScript(()=>{
  localStorage.setItem('formula-theme-mode','notebook');
  const fillRect=CanvasRenderingContext2D.prototype.fillRect;
  CanvasRenderingContext2D.prototype.fillRect=function(...args){this.canvas.__paintCount=(this.canvas.__paintCount||0)+1;return fillRect.apply(this,args);};
 });
 await page.goto(base);await page.waitForFunction(()=>window.FormulasAtlas?.equations?.length===282);
 async function open(id){await page.evaluate(async id=>{const {openEquationModal}=await import('./scripts/render-dynamic.js');openEquationModal(window.FormulasAtlas.equations.find(e=>e.id===id));},id);}
 async function range(key,value){const input=page.locator(`[data-lab-key="${key}"]`);await input.evaluate((input,value)=>{input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));},String(value));}
 async function mode(index){await page.locator(`[data-lab-mode="${index}"]`).click();}
 const tune={'circle-area':['r',4],'circumference-length':['turns',1.5],'pythagorean-trig-identity':['theta',45],'notable-identities':['b',3],'euclidean-norm':['z',12],'arithmetic-progression-sum':['n',10],'geometric-progression-sum':['n',4]};
 for(const [id,config] of Object.entries(LABS)) {
  await open(id);await page.waitForFunction(()=>document.querySelectorAll('.formula-tooltip-zone').length>0);
  const descriptions=await page.locator('.formula-tooltip-zone').evaluateAll(zones=>zones.map(z=>({symbol:z.dataset.symbol,description:z.dataset.description})));
  assert(descriptions.length>5,`${id}: too few symbols`);
  assert(!descriptions.some(z=>/pendiente de revisión|según el contexto/.test(z.description)),`${id}: generic symbol: ${JSON.stringify(descriptions.filter(z=>/pendiente de revisión|según el contexto/.test(z.description)))}`);
  if(id==='determinants-2x2-3x3')assert(descriptions.some(z=>z.symbol==='i'&&z.description.includes('tercera fila')));
  if(id==='euclidean-norm')assert(descriptions.some(z=>z.symbol==='x'&&z.description.startsWith('Vector x completo')));
  const symbol=page.locator('.formula-tooltip-zone.is-symbol').first();
  await symbol.hover();assert(await page.locator('.formula-symbol-popover.visible').count());
  await symbol.focus();assert((await page.locator('.formula-symbol-popover.visible').innerText()).includes(await symbol.getAttribute('data-description')));
  for(const tab of ['significado','historia','derivacion','usos','ficha','aprendizaje','unidades']){
   await page.locator(`[data-target="${tab}"]`).click();await page.waitForFunction(tab=>document.querySelector(`[data-panel="${tab}"]`)?.dataset.loaded==='true',tab);
   assert((await page.locator(`[data-panel="${tab}"]`).innerText()).length>280,`${id}: empty ${tab}`);
  }
  if(id==='arithmetic-progression-sum')for(const tab of ['derivacion-alternativa','ficha-tecnica']){
   const target=page.locator(`[data-target="${tab}"]`);assert.equal(await target.count(),1);await target.click();await page.waitForFunction(tab=>document.querySelector(`[data-panel="${tab}"]`)?.dataset.loaded==='true',tab);assert((await page.locator(`[data-panel="${tab}"]`).innerText()).length>300);
  }
  await page.locator('[data-target="simulacion"]').click();await page.locator('.learning-lab').waitFor();await page.locator('.lab-answer').waitFor();
  assert.equal(await page.locator('[data-lab-mode]').count(),3);
  await page.locator('.lab-answer').fill('999');await page.locator('.lab-answer-form button').click();assert.equal(await page.locator('.learning-lab').evaluate(root=>root.__labState.solved),false);
  await page.locator('[data-lab-hint]').click();assert((await page.locator('.formula-plugin-readout').innerText()).includes(config.missions[0].hint));
  for(const [index,mission] of config.missions.entries()){
   if(mission.kind==='tune'){
    await page.locator('[data-lab-check]').click();assert.equal(await page.locator('.learning-lab').evaluate(root=>root.__labState.solved),false,`${id}: initial design already solved`);
    if(id==='determinants-2x2-3x3')await page.locator('[data-lab-cell="3"]').fill('4');else await range(...tune[id]);
    await page.locator('[data-lab-check]').click();
   }else if(mission.kind==='choice'){await page.locator(`input[name="choice"][value="${mission.answer}"]`).check();await page.locator('.lab-answer-form button').click();}
   else {await page.locator('.lab-answer').fill(Array.isArray(mission.answer)?mission.answer.join(' ; '):String(Number(mission.answer.toFixed(2))));await page.locator('.lab-answer-form button').click();}
   assert.equal(await page.locator('.learning-lab').evaluate(root=>root.__labState.solved),true,`${id}: mission ${index+1} rejected`);
   if(index<config.missions.length-1)await page.locator('[data-lab-next]').click();
  }
  await mode(1);await page.screenshot({path:`artifacts/labs/${id}-explore.png`});
  const controls=page.locator('[data-lab-key]');
  if(await controls.count()){const key=await controls.first().getAttribute('data-lab-key');if(key!=='identity'&&key!=='dimension'){const before=await page.locator('.formula-plugin-readout').innerText();await range(key,key==='theta'?110:key==='a'?2:key==='r'?2.5:5);assert.notEqual(await page.locator('.formula-plugin-readout').innerText(),before);}}
  if(id==='euclidean-norm') {
   const before=await page.locator('.learning-lab').evaluate(root=>root.__labState.yaw);
   const box=await page.locator('canvas.formula-plugin-canvas').boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+60,box.y+box.height/2+20);await page.mouse.up();
   assert.notEqual(await page.locator('.learning-lab').evaluate(root=>root.__labState.yaw),before);await page.locator('canvas').last().focus();await page.keyboard.press('ArrowRight');
   await range('x',0);await range('y',0);await range('z',0);assert((await page.locator('.formula-plugin-readout').innerText()).includes('no tiene dirección'));
  }
  if(id==='geometric-progression-sum') {
   await range('r',1);assert((await page.locator('.formula-plugin-readout').innerText()).includes('No hay suma infinita'));
   await range('r',-.5);assert((await page.locator('.formula-plugin-readout').innerText()).includes('Límite'));
   await range('a',0);await range('r',1);assert((await page.locator('.formula-plugin-readout').innerText()).includes('resto exacto = 0'));
  }
  if(id==='heron-formula') {await range('a',2);await range('b',3);await range('c',6);assert((await page.locator('.formula-plugin-readout').innerText()).includes('imposibles'));await range('c',5);assert((await page.locator('.formula-plugin-readout').innerText()).includes('degenerada'));await page.locator('[data-lab-reset]').click();}
  if(id==='quadratic-formula') {
   await range('a',0);assert((await page.locator('.formula-plugin-readout').innerText()).includes('lineal'));
   await range('b',0);await range('c',0);assert((await page.locator('.formula-plugin-readout').innerText()).includes('cualquier x'));
   await range('c',1);assert((await page.locator('.formula-plugin-readout').innerText()).includes('no tiene soluciones'));await page.locator('[data-lab-reset]').click();
  }
  if(id==='determinants-2x2-3x3')await page.locator('[data-lab-key="dimension"]').selectOption('3');
  if(id!=='determinants-2x2-3x3')await page.locator('[data-lab-reset]').click();
  await mode(2);await page.screenshot({path:`artifacts/labs/${id}-demo.png`});
  const animate=page.locator('[data-lab-animate]');if(await animate.count())await animate.click();
  // Switching tabs must stop even an animation that is still running.
  await page.evaluate(()=>{window.checkedHost=document.querySelector('.learning-lab');window.checkedCanvas=window.checkedHost.querySelector('canvas');});
  await page.locator('[data-target="historia"]').click();assert.equal(await page.evaluate(()=>window.checkedHost.__labState.active),false);
  const paints=await page.evaluate(()=>window.checkedCanvas.__paintCount);await page.waitForTimeout(120);assert.equal(await page.evaluate(()=>window.checkedCanvas.__paintCount),paints,`${id}: paint after unmount`);
  await page.locator('[data-target="simulacion"]').click();await page.locator('.learning-lab').waitFor();assert.equal(await page.locator('.learning-lab').evaluate(root=>root.__labState.active),true);
  await page.setViewportSize({width:390,height:844});
  for(const index of [0,1,2]) {
   await mode(index);const bounds=await page.locator('.learning-lab').evaluate(root=>({width:root.getBoundingClientRect().width,scrollWidth:root.scrollWidth,canvas:root.querySelector('canvas').getBoundingClientRect().toJSON(),controls:root.querySelector('.formula-plugin-controls').getBoundingClientRect().toJSON(),readout:root.querySelector('.formula-plugin-readout').getBoundingClientRect().toJSON(),buttons:[...root.querySelectorAll('nav button')].map(b=>b.getBoundingClientRect().toJSON())}));
   assert(bounds.scrollWidth<=bounds.width+1,`${id}: mobile overflow`);assert(bounds.canvas.height>=200,`${id}: canvas collapsed`);assert(bounds.readout.top>=bounds.controls.bottom-1,`${id}: feedback overlaps controls`);assert(bounds.buttons.every(b=>b.width>70&&b.height>=38),`${id}: modes hidden`);
   await page.screenshot({path:`artifacts/labs/${id}-mobile-${index}.png`});
   await page.locator('.learning-lab').evaluate(root=>root.scrollTop=root.scrollHeight);
   await page.screenshot({path:`artifacts/labs/${id}-mobile-controls-${index}.png`});
   await page.locator('.learning-lab').evaluate(root=>root.scrollTop=0);
  }
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.checkedHost.__labState.active),false);
  await page.setViewportSize({width:1440,height:1000});report.push({id,missions:config.missions.length,symbols:descriptions.length,allTabs:true,mobile:true,cleanup:true});
 }
 assert(await page.evaluate(()=>window.FormulasAtlas.equations.every(eq=>new Set(eq.sections.map(s=>s.key)).size===eq.sections.length)),'Duplicate section identifiers');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 await writeFile('artifacts/learning-browser-checks.json',JSON.stringify({report,errors,missing},null,2));console.log(JSON.stringify({checked:report.length,missions:40,errors,missing,report},null,2));
}catch(error){const page=browser.contexts()[0]?.pages()[0];if(page){await page.screenshot({path:'artifacts/labs/failure.png'});console.log(JSON.stringify({errors,missing,state:await page.locator('.learning-lab').evaluateAll(roots=>roots.map(r=>r.__labState))},null,2));}throw error;}
finally{await browser.close();server.close();}
