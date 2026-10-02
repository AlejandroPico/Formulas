import assert from 'node:assert/strict';
import * as M from '../formulas/shared/quantum-math.js';
import {QUANTUM_LABS as LABS} from '../formulas/shared/quantum-configs.js';
import {drawQuantum} from '../formulas/shared/quantum-draw.js';
let checks=0;
const near=(a,b,t=1e-8)=>{assert(Number.isFinite(a)&&Number.isFinite(b));assert(Math.abs(a-b)<t*Math.max(1,Math.abs(b)),`${a} != ${b}`);checks++;};
const q=(id,p={})=>M.model(id,{...LABS[id].defaults,...p});
const integrate=(f,a,b,n=6000)=>{const h=(b-a)/n;let sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);return sum*h/3;};
// Independent normalizations and expectation values, including nodes and scaling.
for(let n=0;n<=6;n++)for(const omega of [.5,1,2]){
 near(integrate(x=>M.oscillator(n,x,omega)**2,-16,16),1);
 near(integrate(x=>x*x*M.oscillator(n,x,omega)**2,-16,16),(n+.5)/omega);
}
for(const state of [0,1,2])for(const Z of [1,2,3]){
 const r=q('hydrogen-radial-probability-density',{state,Z});near(integrate(r.density,0,70/Z),1);
 near(integrate(x=>x*r.density(x),0,70/Z),[1.5,6,5][state]/Z);
 if(state===1)near(r.density(2/Z),0);
}
for(const L of [.5,1,3])for(const n of [1,2,5])for(const mix of [0,.3,1])for(const t of [0,.7,20]){
 const p={L,n,mix,phase:73,t},box=q('infinite-potential-well',p);
 near(integrate(box.density,0,L),1);near(box.density(0),0);near(box.density(L),0);
 near(box.energy,Math.PI**2/(2*L*L)*((1-mix)*n*n+mix*(n+1)**2));
 const ring=q('schrodinger-equation',p);near(integrate(ring.density,0,2*Math.PI),1);near(ring.energy,.5+1.5*mix);
}
for(const K of [1,100,1000]){const r=q('de-broglie-relation',{K});near(r.lambda*r.momentum/M.H/1e9,1);near(r.momentum*r.momentum/(2*M.ME*M.EV),K);}
near(q('bose-einstein-distribution').value,1/(Math.E-1));near(q('fermi-dirac-distribution').value,1/(Math.E+1));
for(const T of [.1,.5,2]){near(q('fermi-dirac-distribution',{T,energy:0,mu:0}).value,.5);for(const e of [-2,0,2])near(q('fermi-dirac-distribution',{T,energy:e}).value+q('fermi-dirac-distribution',{T,energy:-e}).value,1);}
for(const angle of [-180,-30,0,30,90,180]){const a=angle*Math.PI/180;
 // AB and BA independently multiply the Pauli off-diagonal entries.
 near(q('quantum-commutator',{angle}).value,Math.sin(a)-(-Math.sin(a)));
}
// Finite truncated ladder operators have a boundary correction, not an exact identity.
for(let n=0;n<8;n++){const aa=n<7?n+1:0,ad=n;near(q('canonical-commutation-relation',{n}).value,aa-ad);}
near(q('canonical-commutation-relation').diagonal.reduce((a,b)=>a+b,0),0);
assert.equal(q('creation-annihilation-operators',{n:0,raise:0}).next,null);
near(q('creation-annihilation-operators',{n:0,raise:0}).value,0);
for(const sigma of [.5,1,2])for(const chirp of [-2,0,2]){
 const r=q('heisenberg-uncertainty-principle',{sigma,chirp});near(integrate(r.density,-15,15),1);near(integrate(r.momentum,-30,30),1);
 near(sigma*sigma*r.dp*r.dp-chirp*chirp,.25);assert(r.product>=.5);
}
for(const p of [0,.2,.7,1])for(const c of [0,.5,1]){
 const r=q('density-matrix',{p,coherence:c,phi:57});near(r.eigen.reduce((a,b)=>a+b,0),1);assert(r.eigen.every(x=>x>=-1e-12));near(r.purity,r.eigen.reduce((a,b)=>a+b*b,0));
 near(q('born-rule',{p,detector:0}).prob,p);
 near(q('von-neumann-entanglement-entropy',{p}).entropy,M.binaryEntropy(p));
}
for(const radius of [0,.6,1])for(const t of [0,.6,20]){
 const r=q('von-neumann-equation',{radius,t});near(Math.hypot(...r.r),radius);near(r.value,(1+radius*radius)/2);
 const p=q('pauli-equation',{theta:90,phi:0,omega:1,t});near(p.r[0],Math.cos(t));near(p.r[1],-Math.sin(t));
 const v=q('von-neumann-equation',{radius,theta:90,phi:0,omega:1,t});near(v.r[0],radius*Math.cos(t));near(v.r[1],radius*Math.sin(t));
}
for(const momentum of [-3,-1,0,1,3])for(const mass of [.2,1,3]){
 const r=q('dirac-equation',{momentum,mass}),[a,b]=r.spinor;near(a*a+b*b,1);near(mass*a+momentum*b,r.E*a);near(momentum*a-mass*b,r.E*b);assert(Math.abs(r.group)<=1);
}
for(const k of [.2,1,3])for(const mass of [0,1,3]){
 const r=q('klein-gordon-equation',{k,mass,t:.7}),dx=1e-4,dt=1e-4,x=.8;
 const tt=(q('klein-gordon-equation',{k,mass,t:.7+dt}).field(x)-2*r.field(x)+q('klein-gordon-equation',{k,mass,t:.7-dt}).field(x))/(dt*dt);
 const xx=(r.field(x+dx)-2*r.field(x)+r.field(x-dx))/(dx*dx);near(tt-xx+mass*mass*r.field(x),0,1e-5);
}
near(q('quantum-fidelity',{a:1,b:1,angle:180}).value,0);near(q('quantum-fidelity',{a:0,b:0}).value,1);
for(const a of [0,.4,1])for(const b of [0,.8,1])for(const angle of [0,73,180]){const f=q('quantum-fidelity',{a,b,angle}).value;assert(f>=0&&f<=1);near(f,q('quantum-fidelity',{a:b,b:a,angle}).value);}
near(q('path-integral',{x:.6}).value,0);near(q('path-integral',{ratio:0,x:1}).value,1);
for(const [id,config] of Object.entries(LABS)){
 const t=config.missions[1];assert(Math.abs(t.get(config.defaults)-t.answer)>t.tolerance,`${id}: already solved tune`);
 near(t.get({...config.defaults,...t.solution}),t.answer);assert.equal(config.missions[2].answer,'yes');
 for(const control of config.controls)for(const x of [control.min,control.max]){
  const p={...config.defaults,[control.key]:x};assert(Number.isFinite(q(id,p).value),`${id}: nonfinite boundary`);
  const ctx=new Proxy({measureText:s=>({width:String(s).length*6})},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
  for(let mode=0;mode<3;mode++)drawQuantum(ctx,640,360,id,p,{mode,yaw:.6,pitch:.3,accent:'#397d91',ink:'#333333',line:'#cccccc',muted:'#666666',background:'#ffffff',hide:false});
  checks+=4;
 }
}
console.log(JSON.stringify({quantumLabs:Object.keys(LABS).length,checks}));
