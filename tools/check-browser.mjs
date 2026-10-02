import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from './serve.mjs';
const reviewCount=Object.keys(JSON.parse(await (await import('node:fs/promises')).readFile('formulas/revisions.json','utf8')).reviews).length;
const { chromium } = createRequire(import.meta.url)('playwright');
const server = createServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/Formulas/`;
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [], requests = [], missing = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block' });
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  page.on('response', response => { if (response.status() >= 400) missing.push([response.status(), response.url()]); });
  await page.addInitScript(() => localStorage.setItem('formula-theme-mode', 'notebook'));
  const start = Date.now();
  await page.goto(base);
  await page.waitForFunction(() => window.FormulasAtlas?.equations?.length > 200);
  const indexMs = Date.now() - start;
  await page.waitForFunction(() => document.querySelectorAll('.equation-card.is-sized').length >= 24);
  const rendered = await page.locator('.equation-card').count();
  assert(rendered < 282, 'Should only render nearby batches');
  assert(!requests.some(url => /latest-formula-batch-/.test(url)), 'Legacy batches loaded at startup');
  assert(!requests.some(url => /\/simulacion\//.test(url)), 'Simulator loaded at startup');
  await page.locator('#searchToggle').click();
  await page.locator('#searchInput').fill('escalera');
  await page.waitForFunction(() => document.querySelector('.equation-card[aria-label="Abrir ficha de Teorema de Pitágoras"]'));
  assert(requests.some(url => /search-index.json/.test(url)), 'Full-text search index was not loaded');
  await page.locator('#searchClear').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/atlas-desktop.png', fullPage: false });
  await page.evaluate(async () => {
    const { openEquationModal } = await import('./scripts/render-dynamic.js');
    openEquationModal(window.FormulasAtlas.equations.find(eq => eq.id === 'pythagorean-theorem'));
  });
  await page.waitForFunction(() => document.querySelector('.formula-tooltip-zone[data-symbol="c"]'));
  const c = page.locator('.formula-tooltip-zone[data-symbol="c"]').first();
  assert((await c.getAttribute('data-description')).startsWith('Hipotenusa:'));
  for (const symbol of ['2', '(', ')', '=', '+', '−']) assert(await page.locator(`.formula-tooltip-zone[data-symbol="${symbol}"]`).count(), `No tooltip for ${symbol}`);
  await c.hover();
  await page.screenshot({ path: 'artifacts/pythagoras-symbols.png' });
  for (const key of ['significado', 'historia', 'derivacion', 'usos', 'ficha', 'aprendizaje', 'unidades']) {
    await page.locator(`[data-target="${key}"]`).click();
    await page.waitForFunction(key => document.querySelector(`[data-panel="${key}"]`)?.dataset.loaded === 'true', key);
    assert((await page.locator(`[data-panel="${key}"]`).innerText()).length > 300);
  }
  await page.locator('[data-target="simulacion"]').click();
  await page.locator('.pyth-answer-form').waitFor();
  await page.screenshot({ path: 'artifacts/pythagoras-game.png' });
  await page.locator('.pyth-answer-form input').fill('7');
  await page.locator('.pyth-answer-form button').click();
  assert((await page.locator('.formula-plugin-readout').innerText()).includes('demasiado larga'));
  for (const [index, answer] of ['5', '13', '8.49', '6', '12', '10'].entries()) {
    await page.locator('.pyth-answer-form input').fill(answer);
    await page.locator('.pyth-answer-form button').click();
    assert(await page.locator('[data-next]').isEnabled());
    if (index < 5) await page.locator('[data-next]').click();
  }
  assert((await page.locator('.formula-plugin-readout').innerText()).includes('todas las islas'));
  await page.locator('[data-mode="areas"]').click();
  await page.screenshot({ path: 'artifacts/pythagoras-areas.png' });
  await page.locator('[data-mode="explore"]').click();
  await page.locator('input[name="a"]').fill('8');
  await page.locator('input[name="a"]').dispatchEvent('input');
  assert((await page.locator('.formula-plugin-readout').innerText()).includes('64'));
  await page.locator('[data-preset]').click();
  const vertex = await page.locator('.formula-plugin-canvas').evaluate(canvas => {
    const r = canvas.getBoundingClientRect();
    const scale = Math.min((r.width - 128) / 3, (r.height - 60) / 4);
    return { x: r.left + (r.width - 3 * scale) / 2 + 3 * scale, y: r.top + (r.height - 4 * scale) / 2 + 4 * scale, scale };
  });
  await page.mouse.move(vertex.x, vertex.y); await page.mouse.down();
  await page.mouse.move(vertex.x + vertex.scale / 2, vertex.y); await page.mouse.up();
  assert.equal(await page.locator('.pyth-game').evaluate(root => root.__pythState.a), 3.5);
  await page.locator('.formula-plugin-canvas').focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.pyth-game').evaluate(root => root.__pythState.a), 3.6);
  await page.keyboard.press('Escape');
  assert(!await page.locator('#equationModal').evaluate(node => node.open));
  await page.locator('#filterToggle').click({ modifiers: ['Alt'] });
  assert.equal(await page.locator('#introducedFirstButton').count(), 0);
  assert.equal(await page.locator('[data-admin-action="catalog"], [data-admin-action="validator"], [data-admin-action="reviews"]').count(), 0);
  assert.equal(await page.locator('#sortSelect option[value="introduced-desc"]').count(), 1);
  const previousSort = await page.locator('#sortSelect').inputValue();
  await page.locator('#sortSelect').selectOption('introduced-desc');
  await page.waitForTimeout(200);
  const newestDate = await page.evaluate(() => window.FormulasAtlas.equations.map(e => e.createdAt || '').sort().at(-1));
  assert.equal(await page.evaluate(() => document.querySelector('#equationGrid').__equations[0].createdAt), newestDate);
  await page.locator('#sortSelect').selectOption(previousSort);
  await page.locator('[data-admin-action="inventory"]').click();
  assert.equal(await page.locator('#catalogIntroducedOrder').count(), 0);
  const sourceMetadata=JSON.parse(await (await import('node:fs/promises')).readFile('formulas/catalog-index.json','utf8')).map(({id,field,level,tags})=>({id,field,level,tags})).sort((a,b)=>a.id.localeCompare(b.id));
  const loadedMetadata=await page.evaluate(()=>window.FormulasAtlas.equations.map(({id,field,level,tags})=>({id,field,level,tags})).sort((a,b)=>a.id.localeCompare(b.id)));
  assert.deepEqual(loadedMetadata,sourceMetadata,'The browser must preserve canonical authored labels and levels');
  await page.locator('[data-catalog-tab="coverage"]').click();
  assert((await page.locator('[data-view="coverage"]').innerText()).includes('Cobertura por etiquetas'));
  const coverageHeaders=await page.locator('[data-view="coverage"] h3').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().top));
  assert.equal(new Set(coverageHeaders).size,1,'All three coverage categories should be visible together on desktop');
  await page.screenshot({path:'artifacts/coverage-desktop.png'});
  await page.locator('[data-view="coverage"] details').first().locator('summary').click();
  assert(await page.locator('[data-view="coverage"] details').first().getAttribute('open')!==null);
  await page.locator('[data-catalog-tab="reviews"]').click();
  await page.locator('[data-view="reviews"].active').waitFor();
  assert.equal(await page.locator('[data-view="reviews"] .review-done').count(), reviewCount);
  assert.equal(await page.locator('[data-view="reviews"] .review-pending').count(), 282-reviewCount);
  await page.locator('[data-review-filter]').selectOption('reviewed');
  assert.equal(await page.locator('[data-view="reviews"] tbody tr:not([hidden])').count(), reviewCount);
  await page.locator('[data-review-filter]').selectOption('pending');
  assert.equal(await page.locator('[data-view="reviews"] tbody tr:not([hidden])').count(), 282-reviewCount);
  await page.locator('[data-review-filter]').selectOption('all');
  await page.screenshot({ path: 'artifacts/reviews-desktop.png' });
  await page.locator('[data-catalog-search]').fill('pitagoras');
  assert.equal(await page.locator('[data-view="reviews"] tbody tr:not([hidden])').count(), 1);
  await page.locator('.catalog-close').click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.equation-card').first().click();
  await page.locator('[data-target="simulacion"]').click();
  await page.locator('.pyth-answer-form').waitFor();
  await page.screenshot({ path: 'artifacts/pythagoras-mobile.png' });
  const bounds = await page.locator('.pyth-game').evaluate(root => ({ width: root.getBoundingClientRect().width, scrollWidth: root.scrollWidth, canvas: root.querySelector('canvas').getBoundingClientRect().toJSON() }));
  assert(bounds.scrollWidth <= bounds.width + 1, 'Mobile horizontal overflow');
  assert(bounds.canvas.height >= 200, 'Mobile canvas collapsed');
  await page.locator('.pyth-game').evaluate(root => root.scrollTop = root.scrollHeight);
  await page.screenshot({ path: 'artifacts/pythagoras-mobile-controls.png' });
  const noOverlap = await page.locator('.pyth-game').evaluate(root => root.querySelector('.formula-plugin-readout').getBoundingClientRect().top >= root.querySelector('.formula-plugin-controls').getBoundingClientRect().bottom);
  assert(noOverlap, 'Mobile controls overlap feedback');
  const simulatorImports = await page.evaluate(async () => {
    const failed = [];
    for (const eq of window.FormulasAtlas.equations) {
      try {
        const module = await import(new URL(eq.simulationModule, document.baseURI).href);
        if (!Object.values(module).some(value => typeof value === 'function')) failed.push({ id: eq.id, error: 'No mount function' });
      } catch (error) { failed.push({ id: eq.id, error: error.message }); }
    }
    return { checked: window.FormulasAtlas.equations.length, failed };
  });
  assert.deepEqual(simulatorImports.failed, []);
  const latexAudit = await page.evaluate(async () => {
    const warnings = [];
    for (const eq of window.FormulasAtlas.equations) for (const formula of eq.formula) {
      const svg = await window.MathJax.tex2svgPromise(formula);
      const error = svg.querySelector('[data-mml-node="merror"], [data-mjx-error], [fill="red"], [stroke="red"]');
      const unknown = Array.from(svg.querySelectorAll('[data-mml-node="mtext"]')).find(node => /\\[a-zA-Z]+/.test(node.textContent));
      if (error || unknown) warnings.push({ id: eq.id, formula, error: (error || unknown).textContent });
    }
    return warnings;
  });
  assert.deepEqual(latexAudit, [], 'Visible LaTeX error or unknown command');
  assert.deepEqual(errors, []);
  assert.deepEqual(missing, []);
  const report = { indexMs, initiallyRendered: rendered, catalogCount: 282, errors, missing, mobile: bounds, simulatorImports, latexAudit, checked: ['full-text search', 'symbols', 'all tabs', 'six missions', 'invalid answer', 'areas', 'exploration', 'Escape cleanup', 'reviews search', 'mobile'] };
  await writeFile('artifacts/browser-checks.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  const page = browser.contexts()[0]?.pages()[0];
  if (page) {
    await page.screenshot({ path: 'artifacts/browser-failure.png' });
    console.log(JSON.stringify({ errors, missing, failedRequests: requests.filter(url => /mathjax/.test(url)), state: await page.evaluate(() => ({ mathjax: Boolean(window.MathJax?.typesetPromise), svg: document.querySelectorAll('.modal-formula svg').length, zones: document.querySelectorAll('.formula-tooltip-zone').length, formula: document.querySelector('.modal-formula')?.innerHTML.slice(0, 500) })) }, null, 2));
  }
  throw error;
} finally { await browser.close(); server.close(); }
