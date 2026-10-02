import assert from 'node:assert/strict';
import * as M from '../formulas/shared/economy-math.js';
import {ECONOMY_LABS as LABS} from '../formulas/shared/economy-configs.js';
import {drawEconomy} from '../formulas/shared/economy-draw.js';
let checks=0;
const near=(a,b,t=1e-8)=>{assert(Number.isFinite(a)&&Number.isFinite(b));assert(Math.abs(a-b)<t*Math.max(1,Math.abs(b)),`${a} != ${b}`);checks++;};
const q=(id,p={})=>M.model(id,{...LABS[id].defaults,...p});
for(const alpha of [.2,.5,.8]){const r=q('cobb-douglas-production-function',{alpha});near(r.f(8,18),2*r.output);near(r.MPK*4+r.MPL*9,r.output);}
for(const alpha of [.1,.4,.9]){const r=q('consumer-lagrangian-constrained-optimization',{alpha});near(2*r.x+5*r.y,100);near(alpha*r.U/r.x/2,(1-alpha)*r.U/r.y/5);}
for(const n of [1,5,10])for(const coupon of [0,5,10])for(const y of [0,5,15]){
 const r=q('bond-duration-interest-rate-sensitivity',{n,coupon,yield:y}),rate=y/100,h=1e-4;
 near(-(r.priceAt(rate+h)-r.priceAt(rate-h))/(2*h)/r.price,r.modified,2e-6);
 near((r.priceAt(rate+h)-2*r.price+r.priceAt(rate-h))/(h*h)/r.price,r.convexity,2e-6);
 if(coupon===0){near(r.mac,n);near(r.modified,n/(1+rate));}if(coupon===y)near(r.price,100);
}
for(const cash of [10,30,100])for(const initial of [50,100,200])for(const n of [3,5,10]){const r=q('internal-rate-of-return-irr',{cash,initial,n});near(M.npv(r.flows,r.irr),0,1e-7);}
near(M.npv([-100,230,-132],.1),0);near(M.npv([-100,230,-132],.2),0);
near(q('net-present-value-npv',{rate:0}).value,50);
for(const p of [.2,.6,.9])for(const odds of [.5,1,3]){const r=q('kelly-criterion-money-management',{p,odds});for(const f of [0,.1,.3,.8,.95])assert(r.growth(r.optimal)>=r.growth(f)-1e-12);}
for(const saving of [.05,.2,.8]){const r=q('solow-growth-model-steady-state',{saving});near(r.flow(r.k),0);}
near(q('capital-asset-pricing-model-capm',{beta:0}).value,2);near(q('capital-asset-pricing-model-capm',{beta:1}).value,8);
near(q('sharpe-ratio-risk-adjusted-return').value,.5);near(q('put-call-parity-no-arbitrage').value,6+100-100*Math.exp(-.05));
const option=LABS['black-scholes-model'].defaults;
near(M.blackScholes(option).call,10.450583572185565,1e-6);near(M.blackScholes(option).put,5.573526022256971,2e-6);
for(const S of [50,100,150])for(const T of [0,.5,3])for(const volatility of [0,20,60]){
 const r=M.blackScholes({...option,S,T,volatility});near(r.call-r.put,r.A-r.B);assert(r.call>=-1e-10&&r.put>=-1e-10);assert(r.call<=r.A+1e-8&&r.put<=r.B+1e-8);
 if(T===0){near(r.call,Math.max(S-100,0));near(r.put,Math.max(100-S,0));}
 if(T>0&&volatility>0){const d=.01;near((M.blackScholes({...option,S:S+d,T,volatility}).call-M.blackScholes({...option,S:S-d,T,volatility}).call)/(2*d),r.delta,2e-5);}
}
near(q('parametric-value-at-risk-var').value,1000*(1.6448536269514722*.02-.01),3e-6);assert(q('parametric-value-at-risk-var').ES>q('parametric-value-at-risk-var').VaR);
assert(q('parametric-value-at-risk-var',{mean:3,sigma:.5}).value<0);
for(const [id,c]of Object.entries(LABS)){const tune=c.missions[1];assert(Math.abs(tune.get(c.defaults)-tune.answer)>tune.tolerance);near(tune.get({...c.defaults,...tune.solution}),tune.answer);
 for(const control of c.controls)for(const x of [control.min,control.max]){const p={...c.defaults,[control.key]:x};assert(Number.isFinite(q(id,p).value));const ctx=new Proxy({measureText:s=>({width:String(s).length*6})},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});for(let mode=0;mode<3;mode++)drawEconomy(ctx,640,360,id,p,{mode,yaw:.5,pitch:.3,accent:'#397d91',ink:'#333333',line:'#cccccc',muted:'#666666',background:'#ffffff',hide:false});checks+=4;}}
console.log(JSON.stringify({economyLabs:Object.keys(LABS).length,checks}));
