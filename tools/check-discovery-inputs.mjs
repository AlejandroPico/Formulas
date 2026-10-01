import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},serviceWorkers:'block'});
 await page.goto(`http://127.0.0.1:${server.address().port}/Formulas/`);await page.waitForFunction(()=>window.FormulasAtlas?.equations?.length===282);
 async function open(id){await page.evaluate(async id=>{const {openEquationModal}=await import('./scripts/render-dynamic.js');openEquationModal(window.FormulasAtlas.equations.find(e=>e.id===id));},id);await page.locator('[data-target="simulacion"]').click();await page.locator('.learning-lab').waitFor();await page.locator('[data-lab-mode="1"]').click();return page.locator('.learning-lab canvas').boundingBox();}
 async function drag(box,from,to){await page.mouse.move(box.x+from[0],box.y+from[1]);await page.mouse.down();await page.mouse.move(box.x+to[0],box.y+to[1],{steps:12});await page.mouse.up();}
 const state=()=>page.locator('.learning-lab').evaluate(r=>r.__labState.exploration);
 let box=await open('law-of-cosines'),s=Math.min((box.width-90)/3,(box.height-85)/4),cx=box.width/2-1.5*s,cy=box.height/2+2*s;
 await drag(box,[cx,cy-4*s],[cx+2*s,cy-Math.sqrt(12)*s]);let p=await state();assert(Math.abs(p.C-60)<=1);assert(Math.abs(p.a-4)<.15);await page.keyboard.press('Escape');
 box=await open('vietes-formulas');const map=x=>40+(x+6)*(box.width-60)/12,zero=box.height-35-11.9*(box.height-67)/45.9;
 await drag(box,[map(-2),zero],[map(4),zero]);p=await state();assert(Math.abs(p.r-4)<.11);assert.equal(p.s,3);await page.keyboard.press('Escape');
 box=await open('fundamental-theorem-calculus');const map2=x=>40+(x+3.4)*(box.width-60)/6.8;
 await drag(box,[map2(2),box.height/2],[map2(-1),box.height/2]);p=await state();assert(Math.abs(p.x+1)<.06);await page.keyboard.press('Escape');
 box=await open('hookes-law');s=Math.min(box.width*.3,180);await drag(box,[box.width/2+.3*s,box.height*.47],[box.width/2-.2*s,box.height*.47]);p=await state();assert(Math.abs(p.x+.2)<.011);assert((await page.locator('.formula-plugin-readout').innerText()).includes('F resorte = 4'));await page.keyboard.press('Escape');
 box=await open('angle-sum-formulas');const R=Math.min(box.width*.32,(box.height-65)*.39),point=a=>[box.width/2+R*Math.cos(a*Math.PI/180),box.height/2-R*Math.sin(a*Math.PI/180)];await drag(box,point(75),point(-15));p=await state();assert(Math.abs(p.beta+45)<=1);await page.keyboard.press('Escape');
 console.log(JSON.stringify({triangleDrag:true,rootCrossingDrag:true,integralDrag:true,springSignDrag:true,rotationDrag:true}));
}finally{await browser.close();server.close();}
