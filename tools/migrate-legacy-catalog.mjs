// One-time, offline migration of the batches formerly executed by index.html.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
const atlas = { equations: [], refresh() {} };
const callbacks = [];
const context = {
  window: { FormulasAtlas: atlas, addEventListener() {}, dispatchEvent() {}, setTimeout(fn) { callbacks.push(fn); }, clearTimeout() {} },
  document: { querySelector() { return null; }, addEventListener() {} },
  CustomEvent: class {}, setTimeout(fn) { callbacks.push(fn); }, console
};
// Separate scopes mirror ES modules, while preserving the shared runtime atlas.
const order = [7,8,9,10,11,12,13,14,15,16,17,25,26,27,28,29,30,31,32,18,19,20,21,22,23,24];
const origins = new Map();
for (const batch of order) {
  const origin = `scripts/latest-formula-batch-${batch}.js`;
  const source = (await readFile(origin, 'utf8')).replace(/^import\(.*$/gm, '');
  vm.runInNewContext(`(() => { ${source}\n })()`, context, { timeout: 2000 });
  for (const eq of atlas.equations) if (!origins.has(eq.id)) origins.set(eq.id, origin);
}
for (const fn of callbacks.splice(0)) fn();
const normalizer = (await readFile('scripts/dynamic-catalog-refresh.js', 'utf8')).split('async function loadRecentBatchesOnce')[0];
vm.runInNewContext(`${normalizer}\nnormalizeCatalog();`, context, { timeout: 2000 });
const migrated = [];
for (const eq of atlas.equations) {
  const folder = `formulas/${eq.id}`;
  await mkdir(`${folder}/simulacion`, { recursive: true });
  const { sections, simulationModule, simulationStylePath, ...metadata } = eq;
  metadata.legacySource = 'runtime-batch-migration';
  metadata.originalSource = origins.get(eq.id);
  metadata.createdAt = execFileSync('git', ['log', '--reverse', '--diff-filter=A', '--format=%aI', '--', metadata.originalSource], { encoding: 'utf8' }).trim().split('\n')[0]?.slice(0, 10) || null;
  await writeFile(`${folder}/meta.json`, JSON.stringify(metadata, null, 2) + '\n');
  await writeFile(`${folder}/formula.tex`, eq.formula.join('\n\n') + '\n');
  for (const section of sections) {
    if (section.type === 'markdown' && section.content) {
      await writeFile(`${folder}/${section.key}.md`, section.content + '\n');
    }
  }
  if (simulationModule) {
    // Keep the working legacy widget lazy; only its location is normalized here.
    const target = simulationModule.replace(/^scripts\//, '../../../scripts/');
    await writeFile(`${folder}/simulacion/index.js`, `export { default } from ${JSON.stringify(target)};\n`);
    const legacy = await readFile(simulationModule.split('?')[0], 'utf8');
    if (!/export default/.test(legacy)) {
      const named = legacy.match(/export (?:function|const) (\w+)/)?.[1];
      if (!named) throw new Error(`No mount export: ${simulationModule}`);
      await writeFile(`${folder}/simulacion/index.js`, `export { ${named} as default } from ${JSON.stringify(target)};\n`);
    }
  }
  migrated.push(eq.id);
}
await writeFile('tools/legacy-migration.json', JSON.stringify({ count: migrated.length, ids: migrated }, null, 2) + '\n');
console.log(`Migrated ${migrated.length} runtime entries into formula folders.`);
