import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {canonicalField,canonicalLevel,canonicalTags,taxonomyKey} from '../formulas/shared/taxonomy.js';
const catalog=JSON.parse(await readFile('formulas/catalog-index.json','utf8'));
// The catalog exceeds Node's default 1 MiB child-process output limit.
const previous=JSON.parse(execFileSync('git',['show','HEAD:formulas/catalog-index.json'],{encoding:'utf8',maxBuffer:64*1024*1024}));
const spellings={field:new Map(),level:new Map(),tags:new Map()};
for(const entry of catalog){
 const source=JSON.parse(await readFile(`${entry.folder}/meta.json`,'utf8'));
 assert.equal(entry.field,canonicalField(source.field));assert.equal(entry.level,canonicalLevel(source.level));assert.deepEqual(entry.tags,canonicalTags(source.tags));
 assert.equal(new Set(entry.tags.map(taxonomyKey)).size,entry.tags.length,`${entry.id}: duplicated tag`);
 assert(!entry.tags.some(tag=>['simulacion','revision completa','aprendizaje'].includes(taxonomyKey(tag))),`${entry.id}: workflow is not a topic`);
 for(const [kind,values] of [['field',[entry.field]],['level',[entry.level]],['tags',entry.tags]])for(const label of values){const key=taxonomyKey(label),old=spellings[kind].get(key);assert(!old||old===label,`${kind}: ${old} / ${label}`);spellings[kind].set(key,label);}
 const old=previous.find(e=>e.id===entry.id);assert.equal(entry.createdAt,old.createdAt,`${entry.id}: creation date changed`);
}
assert.equal(canonicalField('Mecanica analitica'),'Mecánica analítica');assert.equal(canonicalField('Fluidos'),'Mecánica de fluidos');
assert.equal(canonicalLevel('Bachillerato/Universidad inicial'),'Bachillerato y universidad inicial');assert.equal(canonicalLevel('Universidad avanzada'),'Universidad avanzada');
assert.deepEqual(canonicalTags(['estadistica','estadística','Simulación','machine learning','Aprendizaje automático']),['estadística','aprendizaje automático']);
assert.notEqual(catalog.find(e=>e.id==='continuity-equation').name,catalog.find(e=>e.id==='continuity-equation-fluid').name);
assert(!catalog.find(e=>e.id==='fourier-heat-conduction-1d-steady').tags.includes('mosfet'));
console.log(JSON.stringify({taxonomy:true,creationDatesPreserved:catalog.length,disciplines:spellings.field.size,levels:spellings.level.size,conceptTags:spellings.tags.size}));
