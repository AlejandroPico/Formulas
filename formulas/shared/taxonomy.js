import {TAG_VOCABULARY} from './tag-vocabulary.js';
export const taxonomyKey=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s*\/\s*/g,' y ').replace(/\s+/g,' ');
const dictionary=groups=>new Map(groups.flatMap(([canonical,...aliases])=>[canonical,...aliases].map(v=>[taxonomyKey(v),canonical])));
const fields=dictionary([
 ['Álgebra','Algebra'],['Álgebra lineal','Algebra lineal'],['Álgebra vectorial','Algebra vectorial'],['Álgebra y polinomios','Algebra y polinomios'],
 ['Geometría diferencial','Geometria diferencial'],['Análisis numérico','Analisis numerico'],['Análisis armónico','Analisis armonico'],['Mecánica analítica','Mecanica analitica'],
 ['Mecánica de fluidos','Fluidos'],['Aprendizaje automático','Machine Learning'],['Aprendizaje profundo','Deep Learning'],['Aprendizaje por refuerzo','Reinforcement Learning'],
 ['Estadística y aprendizaje automático','Estadística / Machine Learning'],['Electrotecnia / Corriente alterna','Electrotecnia / AC'],
 ['Transformers / Aprendizaje profundo','Transformers / Deep Learning'],['Aprendizaje automático / Agrupamiento','Machine Learning / Clustering'],
 ['Aprendizaje automático / Clasificación','Machine Learning / Clasificación'],['Aprendizaje automático / Núcleos','Machine Learning / Kernels'],
 ['Aprendizaje automático / Estadística robusta','Machine Learning / Estadística robusta'],['Álgebra lineal / Aprendizaje automático','Álgebra lineal / Machine Learning']
]);
const levels=dictionary([['ESO'],['ESO y Bachillerato','ESO/Bachillerato'],['Bachillerato'],['Bachillerato y universidad inicial','Bachillerato/Universidad inicial'],['Universidad inicial'],['Universidad intermedia'],['Universidad'],['Universidad avanzada','Avanzado']]);
const tags=dictionary([
 ['álgebra'],['álgebra lineal'],['álgebra vectorial'],['análisis'],['análisis numérico'],['análisis matemático'],['análisis armónico'],['estadística'],['probabilidad'],
 ['aprendizaje automático','machine learning','ml'],['aprendizaje profundo','deep learning'],['aprendizaje por refuerzo','reinforcement learning'],
 ['mecánica'],['mecánica clásica'],['mecánica de fluidos','fluidos'],['mecánica de sólidos'],['mecánica cuántica'],['mecánica analítica'],
 ['ecuaciones diferenciales','edp'],['advección'],['difusión'],['conservación'],['conservación de masa'],['electrónica'],['electrostática'],['electromagnetismo'],
 ['cálculo'],['cálculo diferencial'],['cálculo integral'],['cálculo vectorial'],['derivación'],['integración'],['optimización'],['clasificación'],['regresión'],
 ['información'],['geometría'],['geometría plana'],['geometría esférica'],['trigonometría'],['térmica'],['cinética'],['química'],['señales'],['función'],
 ['oscilación'],['oscilaciones'],['simetría'],['interpolación'],['inferencia bayesiana','bayes'],['potencial eléctrico'],['campo eléctrico'],['Navier–Stokes','navier-stokes','navier stokes']
]);
const workflow=new Set(['simulacion','aprendizaje','revision completa']);
export function canonicalField(v){return fields.get(taxonomyKey(v))||String(v||'Sin área').trim();}
export function canonicalLevel(v){return levels.get(taxonomyKey(v))||String(v||'Sin nivel').trim();}
export function canonicalTags(values){const result=new Map();for(const value of values||[]){const key=taxonomyKey(value);if(!key||workflow.has(key))continue;const label=tags.get(key)||TAG_VOCABULARY[key]||String(value).trim().toLowerCase().replace(/\s+/g,' ');if(!result.has(taxonomyKey(label)))result.set(taxonomyKey(label),label);}return [...result.values()];}
export function canonicalMetadata(meta){return {...meta,field:canonicalField(meta.field),level:canonicalLevel(meta.level),tags:canonicalTags(meta.tags)};}
