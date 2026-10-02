import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)('playwright'),server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/Formulas/`);await page.waitForFunction(()=>window.FormulasAtlas?.equations?.length===282);
 const cases=[['cauchy-integral-formula','zx'],['logistic-sigmoid-function','x'],['logistic-regression-sigmoid-function','x']];
 for(const [id,key] of cases){
  await page.evaluate(async id=>{const {openEquationModal}=await import('./scripts/render-dynamic.js');openEquationModal(window.FormulasAtlas.equations.find(e=>e.id===id));},id);
  await page.locator('[data-target="simulacion"]').click();await page.locator('.learning-lab').waitFor();await page.locator('[data-lab-mode="1"]').click();
  const root=page.locator('.learning-lab'),canvas=page.locator('.learning-lab canvas'),before=await root.evaluate((r,key)=>r.__labState.exploration[key],key),box=await canvas.boundingBox();
  await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.8,box.y+box.height*.4);await page.mouse.up();assert.notEqual(await root.evaluate((r,key)=>r.__labState.exploration[key],key),before);
  await page.locator('[data-lab-reset]').click();await page.setViewportSize({width:390,height:844});await root.evaluate(r=>r.scrollTop=0);const mobile=await canvas.boundingBox(),session=await page.context().newCDPSession(page);await session.send('Emulation.setTouchEmulationEnabled',{enabled:true});const previous=await root.evaluate((r,key)=>r.__labState.exploration[key],key),x=mobile.x+mobile.width*.5,y=mobile.y+mobile.height*.5;
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+mobile.width*.2,y:y-20}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.notEqual(await root.evaluate((r,key)=>r.__labState.exploration[key],key),previous);await session.detach();
  await page.keyboard.press('Escape');await page.setViewportSize({width:1280,height:900});
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({mouseDrags:3,touchDrags:3,errors}));
}finally{await browser.close();server.close();}
