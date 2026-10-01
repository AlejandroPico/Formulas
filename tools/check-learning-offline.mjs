import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}/Formulas/`;
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const context=await browser.newContext({serviceWorkers:'allow',viewport:{width:1280,height:900}}),page=await context.newPage();
 await page.goto(base);await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
 await page.reload();await page.waitForFunction(()=>window.FormulasAtlas?.equations?.length===282);
 const open=()=>page.evaluate(async()=>{const {openEquationModal}=await import('./scripts/render-dynamic.js');openEquationModal(window.FormulasAtlas.equations.find(e=>e.id==='circle-area'));});
 await open();await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').waitFor();
 await page.locator('[data-lab-mode="2"]').click();await page.waitForTimeout(300);
 assert((await page.evaluate(()=>caches.keys())).includes('formulas-pwa-3'));
 await context.setOffline(true);await page.keyboard.press('Escape');await page.reload();
 await page.waitForFunction(()=>window.FormulasAtlas?.equations?.length===282);await open();await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').waitFor();
 await page.locator('.lab-answer').fill('28,27');await page.locator('.lab-answer-form button').click();
 assert.equal(await page.locator('.learning-lab').evaluate(root=>root.__labState.solved),true);
 await page.locator('[data-lab-mode="2"]').click();assert.equal(await page.locator('[data-lab-key="pieces"]').count(),1);
 console.log(JSON.stringify({offlineReload:true,offlineMission:true,offlineDemo:true,cacheVersion:3}));
}finally{await browser.close();server.close();}
