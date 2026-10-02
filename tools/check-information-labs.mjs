import assert from 'node:assert/strict';
import * as M from '../formulas/shared/information-math.js';
import {INFORMATION_LABS as LABS} from '../formulas/shared/information-configs.js';
import {drawInformation} from '../formulas/shared/information-draw.js';
let checks=0;
const near=(a,b,t=1e-8)=>{assert(Number.isFinite(a)&&Number.isFinite(b));assert(Math.abs(a-b)<t*Math.max(1,Math.abs(b)),`${a} != ${b}`);checks++;};
const q=(id,p={})=>M.model(id,{...LABS[id].defaults,...p});
for(const k of [0,1,5,10]){const r=q('maximum-likelihood-estimation',{k});near(r.value,k/10);near(r.relative(r.value),1);for(const p of [.01,.4,.99])assert(r.relative(p)<=1+1e-12);}
near(M.quantile(.975),1.959963984540054,2e-6);near(q('confidence-interval',{n:100}).margin,q('confidence-interval',{n:25}).margin/2);
for(const a of [-.9,0,.5])for(const theta of [.2,1,2]){const z=M.zResponse(a,1.5,theta);let re=0,im=0;for(let n=0;n<100;n++){re+=(a/1.5)**n*Math.cos(n*theta);im-=(a/1.5)**n*Math.sin(n*theta);}near(re,z.re);near(im,z.im);near(z.magnitude,Math.hypot(z.re,z.im));assert(z.roc);}
assert(!q('z-transform',{a:.9,radius:.5}).roc);near(q('z-transform',{a:0}).value,1);
near(q('shannon-hartley-capacity',{db:0,bandwidth:1}).value,1);near(q('shannon-hartley-capacity',{bandwidth:2}).value,2*q('shannon-hartley-capacity').value);
for(const p of [0,.2,.5,.8,1])for(const r of [.01,.3,.9,.99]){const c=q('cross-entropy-loss',{p,q:r});near(c.loss,c.irreducible+c.divergence);assert(c.divergence>=-1e-12);near(M.entropy(p),M.entropy(1-p));}
near(M.entropy(0),0);near(M.entropy(.5),1);near(M.entropy(1),0);
near(q('differential-entropy',{sigma:2}).h-q('differential-entropy',{sigma:1}).h,1);assert(q('differential-entropy',{sigma:.1}).h<0);
for(const p of [.05,.5,.95])for(const noise of [0,.1,.5]){
 const r=q('mutual-information',{p,noise});near(r.joint.reduce((a,b)=>a+b,0),1);let I=0;
 const px=[1-p,p],py=[1-r.y,r.y];r.joint.forEach((x,i)=>{if(x>0)I+=x*Math.log2(x/(px[Math.floor(i/2)]*py[i%2]));});near(I,r.I);assert(r.I>=-1e-12&&r.I<=r.HX+1e-12);
}
near(q('language-model-perplexity').value,Math.sqrt(8));near(q('language-model-perplexity',{a:1,b:1,c:1,d:1}).value,1);
for(const p of [.01,.2,.5,.99])for(const r of [.01,.4,.99]){const j=q('jensen-shannon-divergence',{p,q:r});near(j.js,q('jensen-shannon-divergence',{p:r,q:p}).js);assert(j.js>=-1e-12&&j.js<=1);near(j.js,M.entropy((p+r)/2)-(M.entropy(p)+M.entropy(r))/2);}
near(q('kullback-leibler-divergence',{p:.5,q:.5}).value,0);assert.equal(q('kullback-leibler-divergence',{p:0}).reverse,Infinity);
near(q('aic-bic-information-criteria').aic,46);near(q('aic-bic-information-criteria').bic,40+3*Math.log(100));
near(q('tf-idf-term-frequency-inverse-document-frequency').value,3*Math.log(10));near(q('tf-idf-term-frequency-inverse-document-frequency',{df:100}).value,0);
for(const [id,c]of Object.entries(LABS)){const tune=c.missions[1];assert(Math.abs(tune.get(c.defaults)-tune.answer)>tune.tolerance,`${id}: tune already solved`);near(tune.get({...c.defaults,...tune.solution}),tune.answer);
 for(const control of c.controls)for(const x of [control.min,control.max]){const p={...c.defaults,[control.key]:x};assert(Number.isFinite(q(id,p).value));const ctx=new Proxy({measureText:s=>({width:String(s).length*6})},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});for(let mode=0;mode<3;mode++)drawInformation(ctx,640,360,id,p,{mode,yaw:.5,pitch:.3,accent:'#397d91',ink:'#333333',line:'#cccccc',muted:'#666666',background:'#ffffff',hide:false});checks+=4;}}
console.log(JSON.stringify({informationLabs:Object.keys(LABS).length,checks}));
