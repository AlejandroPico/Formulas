import assert from 'node:assert/strict';
import * as M from '../formulas/shared/cosmos-math.js';
import {COSMOS_LABS as LABS} from '../formulas/shared/cosmos-configs.js';
import {drawCosmos} from '../formulas/shared/cosmos-draw.js';
let checks=0;
const near=(a,b,t=1e-7)=>{assert(Number.isFinite(a)&&Number.isFinite(b));assert(Math.abs(a-b)<t*Math.max(1,Math.abs(b)),`${a} != ${b}`);checks++;};
const q=(id,p={})=>M.model(id,{...LABS[id].defaults,...p});
for(const a of [.5,1,3]){near(q('cosmological-equation-of-state',{a,w:0}).value,a**-3);near(q('cosmological-equation-of-state',{a,w:1/3}).value,a**-4);near(q('cosmological-equation-of-state',{a,w:-1}).value,1);}
const H=70*1000/M.MPC*M.YEAR*1e9;
for(const t of [0,5,20]){
 const dust=q('friedmann-equations',{matter:1,vacuum:0,t}),vacuum=q('friedmann-equations',{matter:0,vacuum:1,t}),milne=q('friedmann-equations',{matter:0,vacuum:0,t});
 near(dust.a,(1+1.5*H*t)**(2/3));near(dust.q,.5);near(vacuum.a,Math.exp(H*t));near(vacuum.q,-1);near(milne.a,1+H*t);near(milne.q,0);
}
near(q('critical-density-parameter',{H0:80}).critical/q('critical-density-parameter',{H0:40}).critical,4);
near(q('critical-density-parameter').critical,9.20387392297252e-27,1e-35);
near(q('cosmological-redshift').value,1000);near(q('cosmological-redshift',{emit:2,now:1}).z,-.5);near(q('hubble-law').value,7000);
for(const [id,c]of Object.entries(LABS)){const tune=c.missions[1];assert(Math.abs(tune.get(c.defaults)-tune.answer)>tune.tolerance);near(tune.get({...c.defaults,...tune.solution}),tune.answer);
 for(const control of c.controls)for(const x of [control.min,control.max]){const p={...c.defaults,[control.key]:x};assert(Number.isFinite(q(id,p).value));const ctx=new Proxy({measureText:s=>({width:String(s).length*6})},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});for(let mode=0;mode<3;mode++)drawCosmos(ctx,640,360,id,p,{mode,yaw:.5,pitch:.3,accent:'#397d91',ink:'#333333',line:'#cccccc',muted:'#666666',background:'#ffffff',hide:false});checks+=4;}}
console.log(JSON.stringify({cosmosLabs:Object.keys(LABS).length,checks}));
