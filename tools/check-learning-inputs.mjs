import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from './serve.mjs';
import {heron} from '../formulas/shared/learning-math.js';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900},serviceWorkers:'block'});
 await page.goto(`http://127.0.0.1:${server.address().port}/Formulas/`);await page.waitForFunction(()=>window.FormulasAtlas?.equations?.length===282);
 const canvas=page.locator('.learning-lab canvas'),state=()=>page.locator('.learning-lab').evaluate(root=>root.__labState);
 async function open(id,mode=1){await page.evaluate(async id=>{const {openEquationModal}=await import('./scripts/render-dynamic.js');openEquationModal(window.FormulasAtlas.equations.find(e=>e.id===id));},id);await page.locator('[data-target="simulacion"]').click();await page.locator('[data-lab-mode="1"]').waitFor();await page.locator(`[data-lab-mode="${mode}"]`).click();}
 async function drag(a,b){await page.mouse.move(...a);await page.mouse.down();await page.mouse.move(...b,{steps:6});await page.mouse.up();}
 await open('circle-area');let box=await canvas.boundingBox(),s=Math.min((box.width-70)/(2.2*4),(box.height-90)/(2.2*4));
 await drag([box.x+box.width/2+3*s,box.y+box.height/2],[box.x+box.width/2+4*s,box.y+box.height/2]);assert.equal((await state()).exploration.r,4);
 await canvas.focus();await page.keyboard.press('ArrowLeft');assert.equal((await state()).exploration.r,3.9);await page.keyboard.press('Escape');
 await open('pythagorean-trig-identity');box=await canvas.boundingBox();const R=Math.min(box.width*.34,box.height*.32),cx=box.x+box.width/2,cy=box.y+box.height/2;
 await drag([cx+R/Math.sqrt(2),cy-R/Math.sqrt(2)],[cx,cy-R]);assert.equal((await state()).exploration.theta,90);await page.keyboard.press('Escape');
 await open('heron-formula',2);box=await canvas.boundingBox();s=Math.min((box.width-80)/3,(box.height-85)/4);const ox=box.x+(box.width-3*s)/2,oy=box.y+box.height-45;
 await drag([ox,oy-4*s],[ox+s,oy-3*s]);let p=(await state()).exploration;assert(Math.abs(heron(p.a,p.b,p.c).area-4.5)<.05);await page.keyboard.press('Escape');
 await open('quadratic-formula',2);box=await canvas.boundingBox();s=Math.min((box.width-80)/10,(box.height-70)/10);const x0=box.x+box.width/2,y0=box.y+box.height/2;
 await drag([x0+2.5*s,y0+.25*s],[x0+s,y0-2*s]);p=(await state()).exploration;assert.equal(p.b,-2);assert.equal(p.c,3);await page.keyboard.press('Escape');
 // Real touch events exercise pointer capture instead of synthetic DOM events.
 await open('euclidean-norm');box=await canvas.boundingBox();const before=await state(),session=await page.context().newCDPSession(page);
 await session.send('Emulation.setTouchEmulationEnabled',{enabled:true});
 const touch={x:box.x+box.width/2,y:box.y+box.height/2};
 await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch]});
 await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touch.x+35,y:touch.y+15}]});
 await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const after=await state();assert.notEqual(after.yaw,before.yaw);assert.deepEqual(after.exploration,before.exploration);await session.detach();
 console.log(JSON.stringify({radiusDrag:true,angleDrag:true,triangleDrag:true,vertexDrag:true,keyboard:true,touch3D:true}));
}finally{await browser.close();server.close();}
