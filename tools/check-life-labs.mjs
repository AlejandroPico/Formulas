import assert from 'node:assert/strict';
import * as M from '../formulas/shared/life-math.js';
import {LIFE_LABS as LABS} from '../formulas/shared/life-configs.js';
import {drawLife} from '../formulas/shared/life-draw.js';
let checks=0;
const near=(a,b,t=1e-8)=>{assert(Number.isFinite(a)&&Number.isFinite(b));assert(Math.abs(a-b)<t*Math.max(1,Math.abs(b)),`${a} != ${b}`);checks++;};
const q=(id,p={})=>M.model(id,{...LABS[id].defaults,...p});
near(q('born-haber-cycle').value,-800);near(q('born-haber-cycle').steps.reduce((a,b)=>a+b,0)+q('born-haber-cycle').lattice,-400);
near(q('debye-huckel-limiting-law',{I:0}).value,1);near(q('debye-huckel-limiting-law',{z:-2}).value,q('debye-huckel-limiting-law',{z:2}).value);
near(Math.log10(q('debye-huckel-limiting-law',{I:.004}).value),2*Math.log10(q('debye-huckel-limiting-law',{I:.001}).value));
for(const beta of [0,.3,.8])for(const gamma of [.05,.4])for(const seir of [false,true]){
 const id=seir?'seir-epidemic-model':'sir-epidemic-model',r=q(id,{beta,gamma,t:20});
 for(const row of r.points){near(row.slice(1).reduce((a,b)=>a+b,0),1);assert(row.slice(1).every(x=>x>=-1e-12));}
 if(!seir&&beta>0){const constant=.99+.01-gamma/beta*Math.log(.99);near(r.state[0]+r.state[1]-gamma/beta*Math.log(r.state[0]),constant,1e-6);}
 if(!seir&&beta===0)near(r.state[1],.01*Math.exp(-gamma*100));
}
const lv=q('lotka-volterra-equations',{t:20});near(lv.invariant(lv.state),lv.invariant(lv.initial),1e-7);
const eq=q('lotka-volterra-equations',{prey:2,predator:2,t:20});near(eq.state[0],2);near(eq.state[1],2);
assert.equal(q('competitive-lotka-volterra-model',{alpha:1,beta:1}).equilibrium,null);
for(const alpha of [0,.5,1,2])for(const beta of [0,.5,1,2]){const r=q('competitive-lotka-volterra-model',{alpha,beta,t:20});assert(r.state.every(x=>x>=0&&x<=1));}
for(const D of [.2,1,2])for(const rate of [.2,1,2]){
 const p={D,rate,x:1,t:.3},r=q('fisher-kpp-diffusion-equation',p),h=1e-4,u=r.value;
 const ut=(q('fisher-kpp-diffusion-equation',{...p,t:p.t+h}).value-q('fisher-kpp-diffusion-equation',{...p,t:p.t-h}).value)/(2*h);
 const uxx=(r.density(p.x+h)-2*u+r.density(p.x-h))/(h*h);near(ut,D*uxx+rate*u*(1-u),1e-6);assert(r.speed>2*Math.sqrt(D*rate));
}
const pk=q('one-compartment-pharmacokinetics');near(q('one-compartment-pharmacokinetics',{time:pk.halfLife}).value,5);near(pk.auc,50);
near(q('goldman-hodgkin-katz-equation',{PNa:0,PCl:0}).value,8.314462618*310/96485.33212*Math.log(5/140)*1000);
near(q('monod-microbial-growth-model',{S:0}).value,0);near(q('monod-microbial-growth-model',{S:2,K:2}).value,.5);
near(M.gates(-40).m[0],1);near(M.gates(-55).n[0],.1);
for(const current of [0,10,20]){const r=q('hodgkin-huxley-action-potential',{current,t:20});assert(r.points.every(a=>a[1]>-100&&a[1]<70));assert(r.points.every(a=>a.slice(2).every(g=>g>=0&&g<=1)));if(current===0)assert(r.peak< -60);else assert(r.peak>20);}
const rep=q('replicator-equation-evolutionary-game-theory',{a:2,b:2,c:1,d:1,x:.4,t:3});near(rep.state[0],1/(1+(1/.4-1)*Math.exp(-3)));
near(q('replicator-equation-evolutionary-game-theory',{x:0,t:20}).state[0],0);near(q('replicator-equation-evolutionary-game-theory',{x:1,t:20}).state[0],1);
near(q('voltage-gain-decibels').value,20*Math.log10(2));near(q('shockley-diode-equation',{V:0}).value,0);near(q('shockley-diode-equation',{V:-10}).value,-.01);
near(q('ideal-mosfet-quadratic-model',{Vgs:0}).value,0);near(q('ideal-mosfet-quadratic-model',{Vds:0}).value,0);
near(q('ideal-mosfet-quadratic-model',{Vds:2-1e-7}).value,q('ideal-mosfet-quadratic-model',{Vds:2}).value);
for(const [id,c]of Object.entries(LABS)){
 const tune=c.missions[1];assert(Math.abs(tune.get(c.defaults)-tune.answer)>tune.tolerance);near(tune.get({...c.defaults,...tune.solution}),tune.answer);
 for(const control of c.controls)for(const x of [control.min,control.max]){const p={...c.defaults,[control.key]:x};assert(Number.isFinite(q(id,p).value));const ctx=new Proxy({measureText:s=>({width:String(s).length*6})},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});for(let mode=0;mode<3;mode++)drawLife(ctx,640,360,id,p,{mode,yaw:.5,pitch:.3,accent:'#397d91',ink:'#333333',line:'#cccccc',muted:'#666666',background:'#ffffff',hide:false});checks+=4;}
}
console.log(JSON.stringify({lifeLabs:Object.keys(LABS).length,checks}));
