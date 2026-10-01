import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { hypotenuse, missingLeg, distance, MISSIONS, solution, accepts } from '../formulas/pythagorean-theorem/simulacion/math.js';
import './check-learning-labs.mjs';
assert.equal(hypotenuse(3, 4), 5);
assert.equal(missingLeg(13, 5), 12);
assert.equal(distance([-2, 1], [4, 9]), 10);
assert.equal(distance([4, 9], [-2, 1]), 10);
assert.equal(distance([2, 3], [2, 3]), 0);
assert.equal(hypotenuse(0, 4), 4);
assert.throws(() => missingLeg(4, 5));
assert.throws(() => hypotenuse(-1, 2));
assert.throws(() => hypotenuse(NaN, 2));
for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) {
  const c = hypotenuse(a, b);
  assert(Math.abs(c * c - a * a - b * b) < 1e-10);
  assert(Math.abs(missingLeg(c, b) - a) < 1e-10);
  assert.equal(hypotenuse(a * 2, b * 2), c * 2);
}
for (const mission of MISSIONS) {
  assert(accepts(mission, Number(solution(mission).toFixed(2))));
  assert(!accepts(mission, solution(mission) + .03));
  assert(!accepts(mission, NaN)); assert(!accepts(mission, -5));
}
const catalog = JSON.parse(await readFile('formulas/catalog-index.json', 'utf8'));
assert.equal(new Set(catalog.map(eq => eq.id)).size, catalog.length);
const migration = JSON.parse(await readFile('tools/legacy-migration.json', 'utf8'));
for (const id of migration.ids) assert(catalog.some(eq => eq.id === id), `Lost migrated formula ${id}`);
const names = new Map(); const duplicates = [];
for (const eq of catalog) {
  const name = eq.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (names.has(name)) duplicates.push([names.get(name), eq.id]);
  names.set(name, eq.id);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(eq.createdAt || ''), `Missing creation provenance: ${eq.id}`);
  for (const section of eq.sections) await access(`${eq.folder}/${section.file}`);
  const tex = (await readFile(`${eq.folder}/formula.tex`, 'utf8')).trim().split(/\n\s*\n/g).map(block => block.trim());
  assert.deepEqual(eq.formula, tex, `${eq.id}: stale formula index`);
}
const pythagoras = catalog.find(eq => eq.id === 'pythagorean-theorem');
assert.equal(pythagoras.formula.length, 3);
assert(pythagoras.sections.some(section => section.file === 'aprendizaje.md'));
assert(pythagoras.sections.some(section => section.file === 'unidades.md'));
console.log(JSON.stringify({ formulas: catalog.length, migrated: migration.count, duplicateNames: duplicates, mathematics: 'passed' }, null, 2));
