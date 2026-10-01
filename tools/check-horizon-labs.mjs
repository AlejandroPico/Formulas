import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as M from '../formulas/shared/horizon-math.js';
import {HORIZON_LABS} from '../formulas/shared/horizon-configs.js';
const near=(a,b,tol=1e-7)=>{assert(Number.isFinite(a)&&Number.isFinite(b));assert(Math.abs(a-b)<tol*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);};
let cases=0;
for(const a of [-2,0,2])for(const b of [-1,0,3])for(const c of [-4,0,4]){const p={a,b,c,d:1},v=M.cramer(p);if(a!==b){near(a*v.x+v.y,c);near(b*v.x+v.y,1);}else assert.equal(v.x,null);cases++;}
assert.equal(M.cramer({a:1,b:1,c:2,d:2}).kind,'coincidentes');assert.equal(M.cramer({a:1,b:1,c:2,d:3}).kind,'paralelas');
for(const input of [0,2,5])for(const output of [0,3,5])for(const t of [0,5,20]){const v=M.mass({input,output,initial:100,t,ax:2,ay:-2});near(v.value,100+(input-output)*t);assert(v.value>=0);near(v.div,0);cases++;}
for(const m of [.5,1,3])for(const k of [0,1,15])for(const a of [-2,0,2]){const p={m,k,a},v=M.action(p);near(v.S,M.integrate(x=>v.kinetic(x)-v.potential(x),0,1),1e-6);near(M.action({...p,a:-a}).S,v.S);cases++;}
for(const a of [-2,0,2])for(const b of [-1,0,2]){const p={a,b,rho:1000},v=M.euler(p);near(v.gradient,-1000*(b+a*a));cases++;}
for(const prior of [0,1,50,100])for(const hit of [0,20,100])for(const f of [0,20,100]){const v=M.bayes({prior,hit,false:f});near(v.evidence,v.tp+v.fp);if(v.evidence){near(v.posterior*v.evidence,prior/100*hit/100);assert(v.posterior>=0&&v.posterior<=1);}else assert.equal(v.posterior,null);cases++;}
for(const l1 of [0,20,100])for(const l2 of [0,50,100])for(const l3 of [0,80,100]){const p={p1:1,p2:2,p3:3,l1,l2,l3},v=M.multiclass(p);near(v.prior.reduce((a,b)=>a+b,0),1);if(v.posterior)near(v.posterior.reduce((a,b)=>a+b,0),1);else near(v.evidence,0);cases++;}assert.equal(M.multiclass({p1:0,p2:0,p3:0,l1:50,l2:50,l3:50}).posterior,null);
for(let j=0;j<30;j++){const A=[j/10-1,Math.sin(j),Math.cos(j)],B=[Math.cos(j/2),j/20,1],C=M.cross(A,B);near(M.dot(A,C),0);near(M.dot(B,C),0);near(M.norm(C)**2,M.dot(A,A)*M.dot(B,B)-M.dot(A,B)**2);M.cross(B,A).forEach((x,i)=>near(x,-C[i]));cases++;}
for(const a of [30,60,90,120])for(const b of [30,60,90,120])for(const c of [30,60,90,120]){const v=M.sphere({a,b,c,R:2});if(v.valid){const [A,B,C]=v.vertices,angle=(a,b,c)=>{const u=M.cross(a,b),v=M.cross(a,c);return Math.acos(M.clamp(M.dot(u,v)/M.norm(u)/M.norm(v),-1,1));};near(v.E,angle(A,B,C)+angle(B,A,C)+angle(C,A,B)-Math.PI,1e-6);near(v.area,4*v.E);v.vertices.forEach(q=>near(M.norm(q),1));}cases++;}assert(!M.sphere({a:150,b:150,c:150,R:1}).valid);
for(const a of [-2,0,2])for(const s of [-1,1,3,5]){const v=M.laplace({a,s,T:4});near(v.partial,M.integrate(v.weighted,0,4),1e-6);if(s>a)near(v.partial+Math.exp(-(s-a)*4)/(s-a),v.value);else assert.equal(v.value,null);cases++;}
for(const q of [-2,0,2])for(const r of [.5,1,2]){const v=M.electric({q,q2:3,x:r,y:0});near(v.F,3e-9*v.E);near(v.V,M.COULOMB*q*1e-9/r);const h=1e-5,grad=(M.electric({q,q2:3,x:r+h,y:0}).V-M.electric({q,q2:3,x:r-h,y:0}).V)/(2*h);near(-grad,v.E,1e-6);cases++;}assert(!M.electric({q:0,q2:0,x:0,y:0}).valid);
for(const y0 of [-2,0,2])for(const y1 of [-1,1])for(const y2 of [-3,3])for(const x of [-1,0,1,2]){const p={y0,y1,y2,x},v=M.lagrange(p);near(v.basis.reduce((a,b)=>a+b,0),1);if(x>=-1&&x<=1)near(v.value,[y0,y1,y2][x+1]);cases++;}
for(const A of [0,1,3])for(const B of [0,1,3])for(const offset of [-2,0,2]){const v=M.parseval({A,B,offset});near(v.energy,v.spectral);near(v.energy,32*(offset*offset+(A*A+B*B)/2));cases++;}
for(const a of [.5,2,4])for(const b of [1,2,3])for(const t of [-1,0,.25,1,3,7]){const p={a,b,A:2,B:-1,t},v=M.convolution(p);near(v.value,M.convolution({...p,a:b,b:a},t).value);const steps=20000,dx=8/steps;let sum=0;for(let i=0;i<steps;i++)sum+=v.f((i+.5)*dx)*v.g(t-(i+.5)*dx)*dx;near(v.value,sum,2e-3);cases++;}
for(const c of [-2,0,2])for(const cfl of [.1,.5,1])for(const t of [0,.1,2,20]){const v=M.advect({c,cfl,t});near(v.mass,v.initial);assert(v.u.every(x=>x>=-1e-12&&x<=1+1e-12));cases++;}
for(const r of [-3,-1,0,1,2]){const v=M.ruffini({b:-6,c:11,d:-6,r});for(const x of [-2,0,1,3])near(v.P(x),(x-r)*v.Q(x)+v.remainder);cases++;}
for(const kind of ['regular','outlier']){const v=M.fit({kind,slope:0,intercept:0}),optimal=M.fit({kind,slope:v.beta,intercept:v.alpha});near(optimal.residuals.reduce((a,b)=>a+b,0),0);near(optimal.residuals.reduce((a,b,i)=>a+b*v.data[i][0],0),0);assert(optimal.mse<v.mse);near(optimal.rmse**2,optimal.mse);cases++;}
for(const x of [-3,-1,0,1,3]){near(M.cdf(x)+M.cdf(-x),1);near(M.cdf(x)-M.cdf(-10),M.integrate(z=>M.pdf(z),-10,x,2048),3e-7);cases++;}
for(const a of [.25,1,4])for(const b of [.5,1,4]){const v=M.gauss({a,b});near(v.partial,M.integrate(v.curve,-b,b,2048),6e-7);near(v.total,M.integrate(v.curve,-12,12,4096),1e-6);assert(v.tail>=0);cases++;}
for(const n of [1,4,16,100])for(const p of [5,50,95]){const v=M.central({n,p}),total=v.dist.reduce((a,b)=>a+b,0),mean=v.dist.reduce((a,b,k)=>a+b*k,0),variance=v.dist.reduce((a,b,k)=>a+b*(k-mean)**2,0);near(total,1);near(mean,n*p/100);near(variance,n*p/100*(1-p/100));near(v.bars.reduce((a,b)=>a+b[1]/v.sd,0),1);cases++;}
for(const w of [-3,0,3])for(const x of [-5,0,5]){const p={w,x,b:1},v=M.activation(p),h=1e-5;near(v.gradient,(M.activation(p,x+h).y-M.activation(p,x-h).y)/(2*h),1e-6);assert(v.derivative>=0&&v.derivative<=1);cases++;}
for(const A of [-2,0,2])for(const x of [-1,-.3,0,.8,1])for(const y of [-1,0,.7,1]){const p={A},v=M.poisson(p,x,y),h=1e-4,lap=(M.poisson(p,x+h,y).u+M.poisson(p,x-h,y).u+M.poisson(p,x,y+h).u+M.poisson(p,x,y-h).u-4*v.u)/h**2;near(lap,v.source,1e-6);if(Math.abs(x)===1||Math.abs(y)===1)near(v.u,0);cases++;}
for(const k of [.2,1,5])for(const hot of [0,20,80])for(const cold of [0,20,80]){const p={k,hot,cold,L:2,area:.5},v=M.conduction(p);near(v.power,(hot-cold)/v.resistance);near(M.conduction(p,0).T,hot);near(M.conduction(p,2).T,cold);cases++;}
// Numerically differentiate velocity/pressure, independently of the analytic implementation.
for(const U of [.5,1,2])for(const nu of [0,.1,.5])for(const t of [0,1,5])for(const [x,y] of [[.3,.7],[1,2]]){const p={U,nu,t},h=1e-4,v=M.vortex(p,x,y),xp=M.vortex(p,x+h,y),xm=M.vortex(p,x-h,y),yp=M.vortex(p,x,y+h),ym=M.vortex(p,x,y-h),tp=M.vortex({...p,t:t+h},x,y),tm=M.vortex({...p,t:t-h},x,y);near((xp.u-xm.u+yp.v-ym.v)/(2*h),0);for(const key of ['u','v']){const local=(tp[key]-tm[key])/(2*h),conv=v.u*(xp[key]-xm[key])/(2*h)+v.v*(yp[key]-ym[key])/(2*h),grad=key==='u'?(xp.pressure-xm.pressure)/(2*h):(yp.pressure-ym.pressure)/(2*h),lap=(xp[key]+xm[key]+yp[key]+ym[key]-4*v[key])/h**2;near(local+conv,-grad+nu*lap,2e-6);}cases++;}
for(const alpha of [.02,.1,.5])for(const L of [1,2,4])for(const t of [0,1,20]){const p={alpha,L,t,A:20,B:10,base:20},x=L*.3,h=1e-4,v=M.heat(p,x),dtt=(M.heat(p,x,t+h).T-M.heat(p,x,t-h).T)/(2*h),dxx=(M.heat(p,x+h).T-2*v.T+M.heat(p,x-h).T)/h**2;near(dtt,alpha*dxx,5e-6);near(M.heat(p,0).T,20);near(M.heat(p,L).T,20);cases++;}
assert.equal(Object.keys(HORIZON_LABS).length,27);
for(const [id,c] of Object.entries(HORIZON_LABS)){
 assert.equal(c.missions.length,4);assert.equal(c.modes.length,3);
 for(const s of c.controls){const value=c.defaults[s.key];if(!s.options){assert(value>=s.min&&value<=s.max,`${id}:${s.key} default out of range`);near((value-s.min)/s.step,Math.round((value-s.min)/s.step));}}
 const tune=c.missions[1],before={...c.defaults,...tune.params},after={...before,...tune.solution};assert(Math.abs(tune.get(before)-tune.answer)>tune.tolerance,`${id} begins solved`);near(tune.get(after),tune.answer);
 for(const key of ['significado','historia','derivacion','usos','ficha','aprendizaje','unidades'])assert((await readFile(`formulas/${id}/${key}.md`,'utf8')).length>200,`${id}: ${key}`);
 const meta=JSON.parse(await readFile(`formulas/${id}/meta.json`,'utf8'));assert.equal(meta.simulatorVersion,2);assert(meta.tags.length>=3);
}
console.log(JSON.stringify({horizonLabs:27,missions:108,independentCases:cases}));
