import assert from 'node:assert/strict';
import * as M from '../formulas/shared/network-math.js';
import {NETWORK_LABS as LABS} from '../formulas/shared/network-configs.js';
let checks=0;const near=(a,b,t=1e-7)=>{assert(Number.isFinite(a)&&Math.abs(a-b)<t*Math.max(1,Math.abs(b)),`${a} != ${b}`);checks++;};const q=(id,p={})=>M.model(id,{...LABS[id].defaults,...p});
near(M.normalize([1,2,3]).mean,2);near(M.normalize([1,2,3]).variance,2/3);M.normalize([2,2,2],2,1).output.forEach(x=>near(x,1));
for(const shift of [-50,0,50]){const r=M.normalize([shift+1,shift+2,shift+3]);near(r.output[0],-1/Math.sqrt(2/3+1e-5));near(r.output.reduce((a,b)=>a+b),0);}
near(q('batch-normalization',{scale:0}).value,0);near(q('batch-normalization',{inference:1}).value,-1/Math.sqrt(1+1e-5));
near(M.gelu(0),0);near(M.gelu(1),.841344746,1e-7);near(M.gelu(-1),-.158655254,1e-7);for(const x of [-3,-1,1,3])near(M.gelu(x)-M.gelu(-x),x);
const keys=[[1,0],[0,1],[-1,0]],values=[2,-1,1];for(const query of [[0,0],[1,0],[3,-3]])for(const mask of [false,true]){const r=M.attention(query,keys,values,mask);near(r.weights.reduce((a,b)=>a+b),1);assert(r.output>=-1&&r.output<=2);if(mask)near(r.weights[2],0);if(query.every(x=>x===0)&&!mask)near(r.output,2/3);}
near(q('multi-head-attention',{w1:1,w2:0}).value,q('multi-head-attention').heads[0].output);
for(const position of [0,1,10,50]){const r=M.pe(position);near(r[0]**2+r[1]**2,1);near(r[2]**2+r[3]**2,1);near(r[2],Math.sin(position/100));}
for(const m of [0,1,5])for(const n of [0,3,12]){const r=q('rotary-position-embedding-rope',{m,n});near(Math.hypot(...r.q),1);near(Math.hypot(...r.k),1);near(r.dot,.6*Math.cos(n-m)-.8*Math.sin(n-m));near(r.dot,q('rotary-position-embedding-rope',{m:m+2,n:n+2}).dot);}
near(q('ppo-clipped-objective').value,2.4);near(q('ppo-clipped-objective',{ratio:.5,advantage:2}).value,1);near(q('ppo-clipped-objective',{ratio:.5,advantage:-2}).value,-1.6);near(q('ppo-clipped-objective',{ratio:1.5,advantage:-2}).value,-3);
for(const[id,c]of Object.entries(LABS)){for(const control of c.controls)for(const value of [control.min,control.max])assert(Number.isFinite(q(id,{[control.key]:value}).value),`${id}:${control.key}`);for(const m of c.missions)if(m.kind!=='choice')assert(Number.isFinite(m.answer));}
console.log(JSON.stringify({labs:Object.keys(LABS).length,checks}));
