import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {circle,trig,identities,vector,arithmetic,geometric,determinant,heron,quadratic,parseAnswer,acceptsAnswer} from '../formulas/shared/learning-math.js';
import {LABS} from '../formulas/shared/learning-configs.js';
const near=(a,b,tol=1e-9)=>assert(Math.abs(a-b)<tol,`${a} ≠ ${b}`);
for(let r=0;r<=10;r+=.25){near(circle(r*2).area,4*circle(r).area);near(circle(r*2).length,2*circle(r).length);}
assert.throws(()=>circle(-1));assert.throws(()=>circle(NaN));
for(let theta=-720;theta<=720;theta++){near(trig(theta).squared,1);}
for(let a=-6;a<=6;a++)for(let b=-6;b<=6;b++){
 near(identities(a,b,'sum').value,a*a+2*a*b+b*b);near(identities(a,b,'difference').value,a*a-2*a*b+b*b);near(identities(a,b,'product').value,(a+b)*(a-b));
 const v=vector(a,b,2);near(v.norm*v.norm,a*a+b*b+4);near(Math.hypot(...v.unit),1);
}
assert.equal(vector(0,0,0).unit,null);near(vector(-3,-4).norm,5);
let sequenceCases=0;
for(let a=-4;a<=4;a++)for(let n=1;n<=24;n++){
 for(let d=-3;d<=3;d++){const v=arithmetic(a,d,n);near(v.sum,v.terms.reduce((s,t)=>s+t,0));sequenceCases++;}
 for(const r of [-2,-1,-.95,-.5,0,.5,.95,.999999999,1,1.000000001,1.5,2]){
  const v=geometric(a,r,n);const direct=Array.from({length:n},(_,k)=>a*r**k).reduce((s,t)=>s+t,0);near(v.sum,direct,1e-7*Math.max(1,Math.abs(direct)));
  assert.equal(v.converges,a===0||Math.abs(r)<1);if(v.limit!==null)near(v.limit-v.sum,v.remainder,1e-8*Math.max(1,Math.abs(v.limit)));sequenceCases++;
 }
}
assert.throws(()=>arithmetic(1,1,0));assert.throws(()=>geometric(1,1,1.5));
near(determinant([2,1,0,3],2).det,6);near(determinant([2,0,0,0,3,0,0,0,-1],3).det,-6);
// Independent permutation expansion checks Sarrus on many non-diagonal signed matrices.
const permutations=[[0,1,2,1],[0,2,1,-1],[1,0,2,-1],[1,2,0,1],[2,0,1,1],[2,1,0,-1]];
for(let seed=0;seed<200;seed++){
 const m=Array.from({length:9},(_,i)=>((seed*(i+3)+i*i+7)%11)-5);
 const independent=permutations.reduce((s,[i,j,k,sign])=>s+sign*m[i]*m[3+j]*m[6+k],0);
 near(determinant(m,3).det,independent);
 const swapped=[m[1],m[0],m[2],m[4],m[3],m[5],m[7],m[6],m[8]];
 near(determinant(swapped,3).det,-independent);
}
for(let x=-4;x<=4;x++)for(let h=1;h<=10;h++){
 const a=Math.hypot(x-5,h),b=Math.hypot(x,h),v=heron(a,b,5);near(v.area,5*h/2);near(v.height,h);
 near(heron(b,a,5).area,v.area);near(heron(a*2,b*2,10).area,4*v.area);
}
assert.equal(heron(2,3,6).kind,'invalid');assert.equal(heron(2,3,5).kind,'degenerate');near(heron(13,14,15).area,84);assert.equal(heron(0,2,2).kind,'invalid');
assert(heron(1,1,1.999999999).area>0);
for(const a of [-3,-1,.0000001,1,3])for(let x1=-5;x1<=5;x1++)for(let x2=-5;x2<=5;x2++){
 const b=-a*(x1+x2),c=a*x1*x2,v=quadratic(a,b,c);
 // Check generated roots instead of relying on the same formula as the implementation.
 for(const root of v.roots)near(a*root*root+b*root+c,0,1e-8);
 if(x1!==x2){assert.equal(v.kind,'real');near(v.roots[0],Math.min(x1,x2));near(v.roots[1],Math.max(x1,x2));}
}
assert.equal(quadratic(1,0,1).kind,'complex');near(quadratic(1,0,1).imaginary,1);
assert.equal(quadratic(1,2,1).kind,'double');assert.deepEqual(quadratic(0,2,-6).roots,[3]);assert.equal(quadratic(0,0,0).kind,'all');assert.equal(quadratic(0,0,2).kind,'none');
const stable=quadratic(1,1e8,1);near(stable.roots[1],-1e-8,1e-16);
assert.deepEqual(parseAnswer('3,5'),[3.5]);assert.deepEqual(parseAnswer('3 ; 2',true),[3,2]);assert.deepEqual(parseAnswer(''),[]);assert.deepEqual(parseAnswer('2 ; nope',true),[]);
assert.deepEqual(parseAnswer('2 ; ',true),[]);assert.deepEqual(parseAnswer(' ; 3',true),[]);assert.deepEqual(parseAnswer('−3'),[-3]);
assert(acceptsAnswer([2,3],[3,2]));assert(!acceptsAnswer([2,3],[2]));assert(!acceptsAnswer(0,[NaN]));
const exact={
 'circle-area':[Math.PI*9,4,9,Math.PI*25],
 'circumference-length':[2*Math.PI,1.5,2*Math.PI,2.5*Math.PI],
 'pythagorean-trig-identity':[.8,45,-.8,1],
 'notable-identities':[12,3,4,21],
 'euclidean-norm':[5,12,7,5],
 'arithmetic-progression-sum':[40,10,9,5],
 'geometric-progression-sum':[62,4,12,'no'],
 'determinants-2x2-3x3':[6,8,-6,'no'],
 'heron-formula':[6,84,'invalid','degenerate'],
 'quadratic-formula':[[2,3],2,'complex',3]
};
for(const [id,config] of Object.entries(LABS)){
 assert.deepEqual(config.missions.map(m=>m.answer),exact[id],`${id}: incorrect mission answers`);
 for(const file of ['formula.tex','significado.md','historia.md','derivacion.md','usos.md','ficha.md','aprendizaje.md','unidades.md'])assert((await readFile(`formulas/${id}/${file}`,'utf8')).length>(file==='formula.tex'?20:300));
 const meta=JSON.parse(await readFile(`formulas/${id}/meta.json`,'utf8'));assert(Object.keys(meta.symbolGlossary).length>5);
}
console.log(JSON.stringify({formulas:Object.keys(LABS).length,missions:40,sequenceCases,domains:'passed',orientation:'passed',stableRoots:'passed',content:'passed'},null,2));
