import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {triangle,triangleASA,trianglesSSA,angles,viete,choose,binomial,harmonic,pendulum,pendulumPeriod,accumulation,CURVES,chain,product,quotient,hooke,planeStress,rad} from '../formulas/shared/discovery-math.js';
import {DISCOVERY_LABS} from '../formulas/shared/discovery-configs.js';
const near=(a,b,tolerance=1e-8)=>assert(Math.abs(a-b)<=tolerance*Math.max(1,Math.abs(a),Math.abs(b)),`${a} differs from ${b}`);
let cases=0;
for(let a=1;a<=8;a++)for(let b=1;b<=8;b++)for(let C=1;C<180;C+=3){
 const t=triangle(a,b,C);assert(t.valid);near(t.c,Math.hypot(a*Math.cos(rad(C))-b,a*Math.sin(rad(C))));near(t.A+t.B+C,180);near(a/Math.sin(rad(t.A)),b/Math.sin(rad(t.B)));near(t.c/Math.sin(rad(C)),2*t.R);near(t.ratio,Math.tan(rad((t.A-t.B)/2))/Math.tan(rad((t.A+t.B)/2)));cases++;
}
near(triangle(1,1,.000001).c,rad(.000001),1e-12);assert(!triangle(1,1,180).valid);assert(!triangleASA(1,90,90).valid);
assert.equal(trianglesSSA(4,6,30).length,2);assert.equal(trianglesSSA(3,6,30).length,1);assert.equal(trianglesSSA(2.9,6,30).length,0);assert.equal(trianglesSSA(4,3,120).length,1);assert.equal(trianglesSSA(3,4,120).length,0);
for(const t of trianglesSSA(4,6,30)){near(t.a,4);near(t.b,6);near(t.A,30);assert(t.C>0);}
for(let a=-360;a<=360;a+=3)for(const b of [-180,-45,0,30,90,180]){const v=angles(a,b);near(v.sin,Math.sin(rad(a+b)));near(v.cos,Math.cos(rad(a+b)));near(v.sin*v.sin+v.cos*v.cos,1);if(v.tan!==null)near(v.tan,Math.sin(rad(a+b))/Math.cos(rad(a+b)));cases++;}
assert.equal(angles(45).tan,null);assert.equal(angles(30,60).tan,null);
for(let r=-5;r<=5;r+=.5)for(let s=-5;s<=5;s+=.5)for(const kind of ['real','complex']){
 const v=viete({r,s,a:2,kind});if(kind==='real'){near(v.evaluate(r),0);near(v.evaluate(s),0);}else{near(2*(r*r-s*s)+v.b*r+v.c,0);near(4*r*s+v.b*s,0);}cases++;
}
for(let n=0;n<=10;n++)for(const a of [-2,0,.5,3])for(const b of [-3,-1,0,2]){
 let coefficients=[1];for(let j=0;j<n;j++){const next=Array(coefficients.length+1).fill(0);coefficients.forEach((c,k)=>{next[k]+=c*a;next[k+1]+=c*b;});coefficients=next;}
 const v=binomial(a,b,n);v.terms.forEach((t,k)=>near(t.value,coefficients[k]));near(v.sum,(a+b)**n);near(v.terms.reduce((s,t)=>s+t.coefficient,0),2**n);cases++;
}
assert.equal(choose(10,11),0);assert.equal(choose(0,0),1);assert.throws(()=>binomial(1,1,1.5));
for(const A of [0,.5,2])for(const m of [.5,1,4])for(const k of [1,4,20])for(let t=0;t<20;t+=.2){
 const p={A,m,k,t,phi:37},v=harmonic(p),h=1e-5;near(v.U+v.K,v.energy);near(v.acc,-k/m*v.x);near((harmonic({...p,t:t+h}).x-harmonic({...p,t:t-h}).x)/(2*h),v.v,1e-7);near(harmonic({...p,t:t+v.T}).x,v.x);cases++;
}
near(pendulumPeriod(1,9.81,90).exact/pendulumPeriod(1,9.81,90).small,1.1803405990160962,1e-12);
near(pendulumPeriod(1,9.81,0).error,0);assert.throws(()=>pendulumPeriod(1,9.81,180));
for(const amplitude of [0,1,10,60,90,150]){
 const periods=pendulumPeriod(1,9.81,amplitude);near(pendulumPeriod(4,9.81,amplitude).exact,2*periods.exact);
 for(let j=0;j<=100;j++){const q=pendulum({L:1,g:9.81,amplitude,t:j*periods.exact/100});near(q.energy,9.81*(1-Math.cos(rad(amplitude))),2e-6);assert(Math.abs(q.theta)<=rad(amplitude)+1e-9);cases++;}
 const mid=pendulum({L:1,g:9.81,amplitude,t:periods.exact/4});near(mid.theta,0,1e-7);
}
for(const curve of Object.keys(CURVES))for(const a of [-2,0,2])for(let x=-3;x<=3;x+=.25){
 const q=accumulation({curve,a,x,h:.0001,n:80});const steps=4000,dx=(x-a)/steps;let numeric=0;for(let j=0;j<steps;j++)numeric+=CURVES[curve].f(a+(j+.5)*dx)*dx;near(q.value,numeric,2e-6);near(q.slope,CURVES[curve].f(x));near(q.secant,q.slope,.001);cases++;
}
for(let x=-2;x<=2;x+=.1){
 for(const family of ['cube-square','sin-square','exp-linear']){const p={family,x,scale:1.5,h:.2},v=chain(p),h=1e-5;near(v.derivative,(v.evaluate(x+h)-v.evaluate(x-h))/(2*h),1e-7);near(v.derivative,v.outer*v.inner);cases++;}
 const v=product({x});near(v.derivative,3*x*x+4*x+1);near(v.derivative,v.first+v.second);
 for(const shift of [-2,0,1,2]){const q=quotient({x,shift});if(q.valid){const h=1e-6;near(q.derivative,(q.evaluate(x+h)-q.evaluate(x-h))/(2*h),2e-6);near(q.derivative,q.first+q.second);}cases++;}
}
assert(!quotient({x:-1,shift:1}).valid);near(hooke({k:20,x:-.2}).force,4);near(hooke({k:20,x:.5}).energy,2.5);assert(!hooke({k:20,x:.8}).valid);
for(const E of [20000,200000])for(const nu of [-.5,0,.3,.49])for(const sx of [-200,0,100])for(const sy of [-100,0,150])for(const tau of [-100,0,80]){
 const q=planeStress({E,nu,sx,sy,tau}),D=E/(1-nu*nu);near(D*(q.ex+nu*q.ey),sx);near(D*(q.ey+nu*q.ex),sy);near(q.G*q.gamma,tau);near(q.gamma,2*q.exy);near(q.ez,-nu*(sx+sy)/E);assert(q.energy>=-1e-12);near(q.principal[0]+q.principal[1],sx+sy);near(q.principal[0]*q.principal[1],sx*sy-tau*tau);cases++;
}
assert.throws(()=>planeStress({E:1,nu:.5,sx:0,sy:0,tau:0}));
const expected={
 'law-of-cosines':[5,90,'larger',6],'law-of-sines':[8,30,2,4],'law-of-tangents':[.25,3,'negative',3],'vietes-formulas':[-1,4,20,3],'double-angle-formulas':[Math.sqrt(3)/2,45,-.5,'no'],'angle-sum-formulas':[1,60,1,(Math.sqrt(6)+Math.sqrt(2))/4],'simple-harmonic-motion':[1,9,2,2],'simple-pendulum-small-angle':[2*Math.PI/Math.sqrt(9.81),4,2,'exact'],'binomial-theorem':[3,10,81,3],'fundamental-theorem-calculus':[2,3,-1,-2],'chain-rule':[24,0,0,2],'product-rule':[8,0,5,'sum'],'quotient-rule':[.5,0,-1,-.25],'hookes-law':[-6,.5,2.5,4],'generalized-hooke-law-plane-stress':[500,30,'no',500]
};
assert.equal(Object.keys(DISCOVERY_LABS).length,15);
for(const [id,config] of Object.entries(DISCOVERY_LABS)){
 assert.equal(config.missions.length,4);assert.equal(config.modes.length,3);
 for(const [index,m] of config.missions.entries()){
  const answer=m.kind==='tune'?m.get({...config.defaults,...m.params,...m.solution}):m.answer;
  if(typeof answer==='number')near(answer,expected[id][index]);else assert.equal(answer,expected[id][index]);
  if(m.kind==='tune'){assert(Math.abs(m.get({...config.defaults,...m.params})-m.answer)>m.tolerance);near(answer,m.answer);}
 }
 const dir=`formulas/${id}`,meta=JSON.parse(await readFile(`${dir}/meta.json`,'utf8'));assert.equal(meta.simulatorVersion,2);assert(Object.keys(meta.symbolGlossary).length>20);
 for(const file of (await readdir(dir)).filter(f=>f.endsWith('.md')))assert((await readFile(`${dir}/${file}`,'utf8')).length>350,`${id}/${file} incomplete`);
}
console.log(JSON.stringify({discoveryLabs:15,missions:60,independentCases:cases,domains:true,energy:true,content:true}));
