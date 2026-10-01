import { readFile } from 'node:fs/promises';
const paths = ['catalog','catalog-recent','catalog-lorentz','catalog-quantum','catalog-chemistry','catalog-statistics','catalog-machine-learning','catalog-applied-models','catalog-formula-fixes'];
const original = new Map();
for (const name of paths) for (const eq of JSON.parse(await readFile(`formulas/${name}.json`, 'utf8'))) original.set(eq.id, eq);
const current = JSON.parse(await readFile('formulas/catalog-index.json', 'utf8'));
const changes = [];
for (const eq of current) {
  const prior = original.get(eq.id);
  if (prior?.formula?.length && !eq.originalSource && JSON.stringify(prior.formula) !== JSON.stringify(eq.formula)) changes.push({ id: eq.id, before: prior.formula, after: eq.formula });
}
console.log(JSON.stringify({ originalNative: original.size, changes }, null, 2));
