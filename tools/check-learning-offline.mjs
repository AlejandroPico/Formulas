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
 const open=(id='circle-area')=>page.evaluate(async id=>{const {openEquationModal}=await import('./scripts/render-dynamic.js');openEquationModal(window.FormulasAtlas.equations.find(e=>e.id===id));},id);
 for(const id of ['simple-pendulum-small-angle','generalized-hooke-law-plane-stress','wave-equation','bayes-theorem','poisson-equation','incompressible-navier-stokes-equation','hamiltonian-operator','curve-curvature']){await open(id);await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').waitFor();await page.locator('[data-lab-mode="2"]').click();await page.keyboard.press('Escape');}
 await open();await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').waitFor();
 await page.locator('[data-lab-mode="2"]').click();await page.waitForTimeout(300);
 assert((await page.evaluate(()=>caches.keys())).includes('formulas-pwa-7'));
 await context.setOffline(true);await page.keyboard.press('Escape');await page.reload();
 await page.waitForFunction(()=>window.FormulasAtlas?.equations?.length===282);await open();await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').waitFor();
 await page.locator('.lab-answer').fill('28,27');await page.locator('.lab-answer-form button').click();
 assert.equal(await page.locator('.learning-lab').evaluate(root=>root.__labState.solved),true);
 await page.locator('[data-lab-mode="2"]').click();assert.equal(await page.locator('[data-lab-key="pieces"]').count(),1);
 await page.keyboard.press('Escape');await open('simple-pendulum-small-angle');await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').waitFor();await page.locator('[data-lab-mode="1"]').click();await page.locator('[data-lab-play]').click();await page.waitForTimeout(200);assert((await page.locator('.learning-lab').evaluate(r=>r.__labState.exploration.t))>0);
 await page.keyboard.press('Escape');await open('generalized-hooke-law-plane-stress');await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').waitFor();await page.locator('[data-lab-mode="2"]').click();const yaw=await page.locator('.learning-lab').evaluate(r=>r.__labState.yaw);await page.locator('.learning-lab canvas').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('.learning-lab').evaluate(r=>r.__labState.yaw),yaw);
 await page.keyboard.press('Escape');await open('wave-equation');await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').waitFor();await page.locator('[data-lab-mode="2"]').click();await page.locator('[data-lab-play]').click();await page.waitForTimeout(200);assert((await page.locator('.learning-lab').evaluate(r=>r.__labState.exploration.t))>0);const membraneYaw=await page.locator('.learning-lab').evaluate(r=>r.__labState.yaw);await page.locator('.learning-lab canvas').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('.learning-lab').evaluate(r=>r.__labState.yaw),membraneYaw);
 await page.keyboard.press('Escape');await open('bayes-theorem');await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').fill('170');await page.locator('.lab-answer-form button').click();assert(await page.locator('.learning-lab').evaluate(r=>r.__labState.solved));
 await page.keyboard.press('Escape');await open('poisson-equation');await page.locator('[data-target="simulacion"]').click();await page.locator('[data-lab-mode="2"]').click();const surfaceYaw=await page.locator('.learning-lab').evaluate(r=>r.__labState.yaw);await page.locator('.learning-lab canvas').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('.learning-lab').evaluate(r=>r.__labState.yaw),surfaceYaw);
 await page.keyboard.press('Escape');await open('incompressible-navier-stokes-equation');await page.locator('[data-target="simulacion"]').click();await page.locator('[data-lab-mode="1"]').click();await page.locator('[data-lab-play]').click();await page.waitForTimeout(200);assert(await page.locator('.learning-lab').evaluate(r=>r.__labState.exploration.t>0));
 await page.keyboard.press('Escape');await open('hamiltonian-operator');await page.locator('[data-target="simulacion"]').click();await page.locator('.lab-answer').fill('4');await page.locator('.lab-answer-form button').click();assert(await page.locator('.learning-lab').evaluate(r=>r.__labState.solved));await page.locator('[data-lab-mode="2"]').click();await page.locator('[data-lab-play]').click();await page.waitForTimeout(200);assert(await page.locator('.learning-lab').evaluate(r=>r.__labState.exploration.t>0));
 await page.keyboard.press('Escape');await open('curve-curvature');await page.locator('[data-target="simulacion"]').click();await page.locator('[data-lab-mode="2"]').click();const curveYaw=await page.locator('.learning-lab').evaluate(r=>r.__labState.yaw);await page.locator('.learning-lab canvas').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('.learning-lab').evaluate(r=>r.__labState.yaw),curveYaw);
 console.log(JSON.stringify({offlineReload:true,offlineMission:true,offlineDemo:true,offlinePhysics:true,offline3D:true,offlineMembrane:true,offlineBayes:true,offlinePoisson:true,offlineVortex:true,offlineQuantum:true,offlineCurve:true,cacheVersion:7}));
}finally{await browser.close();server.close();}
