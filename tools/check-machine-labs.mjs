import assert from 'node:assert/strict';
import * as M from '../formulas/shared/machine-math.js';
import {MACHINE_LABS as LABS} from '../formulas/shared/machine-configs.js';
let checks=0;const near=(a,b,t=1e-7)=>{assert(Number.isFinite(a)&&Math.abs(a-b)<t*Math.max(1,Math.abs(b)),`${a} != ${b}`);checks++;};const q=(id,p={})=>M.model(id,{...LABS[id].defaults,...p});
for(const separation of [1,3,4])for(const spread of [.5,1,2]){const r=q('k-means-clustering',{separation,spread,iterations:8});near(r.SSE,4*spread*spread);r.costs.slice(1).forEach((x,i)=>assert(x<=r.costs[i]+1e-9));}
near(q('dbscan-density-based-clustering').clusters,0);near(q('dbscan-density-based-clustering',{epsilon:.7}).clusters,2);near(q('dbscan-density-based-clustering',{epsilon:.7}).noise,2);near(q('dbscan-density-based-clustering',{epsilon:3}).clusters,1);
near(q('bellman-equation',{iterations:20}).V[0],1.34);near(q('bellman-equation',{gamma:0,iterations:20}).V[0],-.5);
near(q('q-learning-off-policy-td-control').value,2.3);near(q('sarsa-temporal-difference-control').value,-.4);for(const id of ['q-learning-off-policy-td-control','sarsa-temporal-difference-control'])near(q(id,{terminal:1}).value,.5);
for(const theta of [-3,0,3]){const h=1e-5,p=M.sigmoid(theta);for(const action of [0,1]){const lp=t=>Math.log(action?M.sigmoid(t):1-M.sigmoid(t));near((lp(theta+h)-lp(theta-h))/(2*h),action-p);}}
for(const z of [[1,0,-1],[1001,1000,999],[-1001,-1000,-999]]){const p=M.softmax(z);near(p.reduce((a,b)=>a+b),1);near(p[0]/p[1],Math.exp(z[0]-z[1]));}
near(q('gradient-descent-with-momentum').value,(2.7**2+4*1.2**2)/2);
for(const algorithm of ['momentum','rmsprop','adam']){const p={x0:3,y0:2,curvature:4,eta:.1,beta:.9,beta2:.9,steps:2},r=M.optimize(p,algorithm);if(algorithm==='adam'){near(r.path[1][0],2.9);near(r.path[1][1],1.9);}if(algorithm==='rmsprop')near(r.path[1][0],3-.1/Math.sqrt(.1));if(algorithm==='momentum'){near(r.path[2][0],2.16);near(r.path[2][1],0);}assert(r.records.length===2);}
for(const error of [-3,-1,0,1,3]){const r=q('regression-loss-functions-mse-mae-huber',{prediction:1+error});near(r.mse,error*error);near(r.mae,Math.abs(error));near(r.huber,Math.abs(error)<=1?error*error/2:Math.abs(error)-.5);}
assert.equal(q('relu-activation-function',{x:0}).derivative,null);
for(const x of [-2,0,1,2])for(const w of [-1,.5,2]){const p={...LABS.backpropagation.defaults,x,w},r=M.model('backpropagation',p),h=1e-5;for(const [key,gradient]of [['w','dw'],['b','db'],['v','dv']])near((M.model('backpropagation',{...p,[key]:p[key]+h}).loss-M.model('backpropagation',{...p,[key]:p[key]-h}).loss)/(2*h),r[gradient]);}
near(q('rbf-kernel-radial-basis-function',{x:0}).value,1);near(q('rbf-kernel-radial-basis-function').value,Math.exp(-1));near(q('maximum-margin-support-vector-machine').value,.125);assert.equal(q('maximum-margin-support-vector-machine',{wx:0}).margin,null);
for(const d of [0,.85,.95]){const r=q('pagerank-network-authority-algorithm',{damping:d,iterations:30});near(r.r.reduce((a,b)=>a+b),1);for(let j=0;j<4;j++)near(r.transition.reduce((s,row)=>s+row[j],0),1);if(d===0)r.r.forEach(x=>near(x,.25));}near(q('pagerank-network-authority-algorithm').value,40.9375);
for(const[id,c]of Object.entries(LABS)){for(const control of c.controls)for(const value of [control.min,control.max])assert(Number.isFinite(q(id,{[control.key]:value}).value),`${id}:${control.key}`);for(const m of c.missions)if(m.kind!=='choice')assert(Number.isFinite(m.answer));}
console.log(JSON.stringify({labs:Object.keys(LABS).length,checks}));
