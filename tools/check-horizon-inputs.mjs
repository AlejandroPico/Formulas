import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)('playwright'),server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},serviceWorkers:'block'});await page.goto(`http://127.0.0.1:${server.address().port}/Formulas/`);await page.waitForFunction(()=>window.FormulasAtlas?.equations?.length===282);
 const host=()=>page.locator('.learning-lab'),canvas=()=>page.locator('.learning-lab canvas');
 async function open(id){await page.evaluate(async id=>{const {openEquationModal}=await import('./scripts/render-dynamic.js');openEquationModal(window.FormulasAtlas.equations.find(e=>e.id===id));},id);await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').waitFor();await page.locator('[data-lab-mode="1"]').click();}
 const point=(b,x,y,xmin,xmax,ymin,ymax)=>({x:b.x+38+(b.width-63)*(x-xmin)/(xmax-xmin),y:b.y+b.height-37-(b.height-79)*(y-ymin)/(ymax-ymin)});
 async function drag(a,b){await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();}
 const read=()=>host().evaluate(r=>r.__labState.exploration);
 await open('lagrange-interpolation');let box=await canvas().boundingBox();await drag(point(box,0,0,-2,2,-6,6),point(box,0,2,-2,2,-6,6));assert(Math.abs((await read()).y1-2)<.15);await page.keyboard.press('Escape');
 await open('mean-squared-error');box=await canvas().boundingBox();await drag(point(box,0,1,-2.5,2.5,-6,11),point(box,0,2,-2.5,2.5,-6,11));assert(Math.abs((await read()).intercept-2)<.2);await page.keyboard.press('Escape');
 await open('coulomb-point-charge-field');box=await canvas().boundingBox();await drag(point(box,1,0,-3,3,-3,3),point(box,0,2,-3,3,-3,3));let p=await read();assert(Math.abs(p.x)<.15&&Math.abs(p.y-2)<.15);await page.keyboard.press('Escape');
 await open('hyperbolic-tangent-activation');box=await canvas().boundingBox();await drag(point(box,1,Math.tanh(1),-5,5,-3.2,3.2),point(box,0,0,-5,5,-3.2,3.2));assert(Math.abs((await read()).x)<.15);await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});await open('lagrange-interpolation');await host().evaluate(r=>r.scrollTop=0);box=await canvas().boundingBox();const a=point(box,0,0,-2,2,-6,6),b=point(box,0,1.5,-2,2,-6,6),session=await page.context().newCDPSession(page);await session.send('Emulation.setTouchEmulationEnabled',{enabled:true});await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[b]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert(Math.abs((await read()).y1-1.5)<.15);await session.detach();
 console.log(JSON.stringify({mouseInterpolation:true,mouseRegression:true,mouseElectricField:true,mouseActivation:true,touchInterpolation:true}));
}finally{await browser.close();server.close();}
