import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as M from '../formulas/shared/frontier-math.js';
import {FRONTIER_LABS} from '../formulas/shared/frontier-configs.js';
const near=(a,b,tol=1e-8)=>assert(Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b)),`${a} ≠ ${b}`);
let cases=0;
for(const P of [0,100,1000])for(const r of [0,3,10])for(const n of [1,4,12,365])for(const t of [0,1,2,20]){const v=M.capital({P,r,n:String(n),t});near(v.A,P*(1+r/100/n)**(n*t));assert(v.A<=v.continuous+1e-8);cases++;}
for(const fn of ['square','sin','abs'])for(const x of [-2,-.5,0,.5,2])for(const h of [.001,.1,1])for(const side of ['left','right']){const v=M.derivative({fn,x,h,side});near(v.secant,(M.FUNCTIONS[fn].f(x+v.dx)-M.FUNCTIONS[fn].f(x))/v.dx);cases++;}assert.equal(M.derivative({fn:'abs',x:0,h:.1}).tangent,null);assert.throws(()=>M.derivative({fn:'square',x:0,h:0}));
for(const m1 of [.5,1,3])for(const m2 of [.5,2,4])for(const v1 of [-3,0,4])for(const v2 of [-2,0,3])for(const e of [0,.5,1]){const p={m1,m2,v1,v2,e,t:0},v=M.collision(p);near(v.pAfter,v.momentum);near(v.u2-v.u1,e*(v1-v2));near(v.lost,.5*m1*m2/(m1+m2)*(1-e*e)*(v1-v2)**2);assert(v.lost>=-1e-10);if(Number.isFinite(v.tc)){const l=M.collision({...p,t:v.tc-1e-7}),r=M.collision({...p,t:v.tc+1e-7});near(l.x1,r.x1,1e-6);near(l.x2,r.x2,1e-6);}cases++;}
for(const m of [.5,2,5])for(const g of [1,9.81,20])for(const H of [0,5,20])for(let t=0;t<=20;t+=.5){const v=M.potential({m,g,H,t});near(v.U+v.K,v.total);assert(v.height>=0);cases++;}
for(const M0 of [.5,1,3])for(const a of [.3,1,3])for(const e of [0,.3,.8])for(let t=0;t<=20;t+=.4){const v=M.orbit({M:M0,a,e,t}),mu=M.G*M0*M.SOLAR_MASS;near(v.speed*v.speed/2+v.phi,v.energy);near(v.energy,-mu/(2*a*M.AU));assert(v.r>=a*(1-e)-1e-10&&v.r<=a*(1+e)+1e-10);cases++;}
for(const angle of [-180,-90,0,45,180])for(const m of [1,2,10]){const v=M.newton({m,F:6,angle,t:2,v0:1});near(Math.hypot(v.ax,v.ay),6/m);near(v.x,2+2*v.ax);near(v.y,2*v.ay);cases++;}
for(let theta=-360;theta<=720;theta+=5){const v=M.polar({r:5,theta});near(Math.hypot(v.x,v.y),5);const e=M.complex({theta});near(e.re**2+e.im**2,1);cases++;}assert.equal(M.polar({r:0,theta:30}).angle,null);
for(const fn of ['exp','cos','log'])for(const a of [.2,1,2])for(const b of [.2,1,2]){const v=M.parts({fn,a,b});near(v.value,v.direct);near(M.parts({fn,a:b,b:a}).value,-v.value);cases++;}assert.throws(()=>M.parts({fn:'log',a:0,b:1}));
for(const T0 of [0,20,80])for(const ambient of [10,20,100])for(let t=0;t<=20;t+=.5){const p={h:10,A:.2,C:1200,T0,ambient,t},v=M.cooling(p);near(v.T,ambient+(T0-ambient)*Math.exp(-t/10));assert(v.T>=Math.min(T0,ambient)-1e-8&&v.T<=Math.max(T0,ambient)+1e-8);cases++;}
for(const fn of ['exp','sin','log'])for(const a of [-.5,0,1])for(let n=0;n<=12;n++)for(const x of [-.9,0,.5,2]){const v=M.series({fn,a,n,x});near(M.series({fn,a,n,x:a}).polynomial,M.SERIES[fn].f(a));assert(Math.abs(v.error)<=v.bound+1e-7);cases++;}assert(!M.series({fn:'log',a:0,n:12,x:2}).inside);assert.equal(M.series({fn:'log',a:0,n:2,x:-1}).actual,null);
for(let a=1;a<=8;a++)for(let b=a;b<=20;b++){const v=M.eulerMaclaurin({fn:'square',a,b,order:1}),sumSquares=n=>n*(n+1)*(2*n+1)/6;near(v.approx,sumSquares(b)-sumSquares(a-1));near(v.error,0);cases++;}
for(const K of [0,2,10])for(const pump of [0,1,10])for(const A2 of [.002,.005,.02]){const p={A1:.01,A2,Q:.01,p1:30,z1:1,z2:2,K,pump},v=M.flow(p);near(v.residual,0);near(v.p2,30+500*(v.v1*v.v1-v.v2*v.v2)/1000+9.81*(1-2+pump-v.loss));cases++;}
for(const rho2 of [100,500,1000])for(const A2 of [.002,.005,.02]){const v=M.continuity({A1:.01,A2,v1:1,rho1:1000,rho2});near(rho2*A2*v.v2,10);near(v.Q2,v.mass/rho2);cases++;}
for(const C of [1,10,20])for(const V of [0,4,10])for(const R of [.1,1,2])for(const kind of ['charge','discharge'])for(let t=0;t<=20;t+=.5){const v=M.capacitor({C,V,R,kind,t});near(v.U,.5*C*v.voltage*v.voltage);near(v.source+v.initial,v.U+v.heat);assert(v.U>=0&&v.heat>=0);cases++;}
// Independently differentiate analytic solutions to verify both wave equations.
for(const kind of ['travel','standing'])for(const x of [.3,1,4])for(const t of [.1,.3,1]){const p={A:1,c:2,lambda:4,t,kind},h=1e-4,f=(x,t)=>M.wave1D({...p,t},x).u,dtt=(f(x,t+h)-2*f(x,t)+f(x,t-h))/h**2,dxx=(f(x+h,t)-2*f(x,t)+f(x-h,t))/h**2;near(dtt,4*dxx,2e-6);cases++;}
for(const m of [1,2,5])for(const n of [1,3]){const p={A:.1,c:2,Lx:2,Ly:3,m,n,t:.3};for(const [x,y] of [[0,1],[2,1],[1,0],[1,3]])near(M.membrane(p,x,y).u,0);const h=1e-4,x=.3,y=.8,t=.3,f=(x,y,t)=>M.membrane({...p,t},x,y).u,center=f(x,y,t),dtt=(f(x,y,t+h)-2*center+f(x,y,t-h))/h**2,lap=(f(x+h,y,t)+f(x-h,y,t)+f(x,y+h,t)+f(x,y-h,t)-4*center)/h**2;near(dtt,4*lap,3e-6);cases++;}
for(const kind of ['tip','uniform'])for(const L of [1,2,4])for(const I of [10,100,500]){const p={P:100,L,E:200,I,kind},v=M.beam(p),zero=M.beam(p,0),end=M.beam(p,L);near(zero.w,0);near(zero.slope,0);near(end.moment,0);near(end.w,v.tip);near(M.beam({...p,I:I*2}).tip,v.tip/2);near(M.beam({...p,L:2*L}).tip,v.tip*(kind==='tip'?8:16));const h=1e-4,x=L/3,d2=(M.beam(p,x+h).w-2*M.beam(p,x).w+M.beam(p,x-h).w)/h**2;near(d2*v.rigidity,M.beam(p,x).moment,2e-6);cases++;}
const numericalAnswers={
 'compound-interest-exponential-capital-growth':[1210,1082.43216], 'derivative-as-limit':[5,1], 'linear-momentum-conservation':[5,0], 'gravitational-potential-energy':[100,100], 'gravitational-law':[20,24], 'newton-second-law':[2,1], 'polar-coordinates':[5,-5], 'integration-by-parts':[1,-1], 'newton-law-of-cooling-convection':[120,600], 'taylor-series':[Math.E,1.5], 'maclaurin-series':[2.5,5/6], 'euler-maclaurin-summation':[30,.5], 'bernoulli-equation':[2,4/19.62], 'bernoulli-equation-real-fluid':[8/19.62,9.81], 'continuity-equation':[2,10], 'capacitor-stored-energy':[80,320], 'one-dimensional-wave-equation':[.5,2], 'wave-equation':[Math.SQRT1_2,3], 'euler-identity':[-1,1], 'euler-bernoulli-beam-bending':[4/3,200]
};
assert.equal(Object.keys(FRONTIER_LABS).length,20);
for(const [id,c] of Object.entries(FRONTIER_LABS)) {
 assert.equal(c.missions.length,4);assert.equal(c.modes.length,3);near(c.missions[0].answer,numericalAnswers[id][0]);near(c.missions[3].answer,numericalAnswers[id][1]);
 const m=c.missions[1],start={...c.defaults,...m.params},solved={...start,...m.solution};assert(Math.abs(m.get(start)-m.answer)>m.tolerance,`${id}: starts solved`);near(m.get(solved),m.answer);
 for(const [key,value] of Object.entries(m.solution)){const spec=c.controls.find(s=>s.key===key);assert(value>=spec.min&&value<=spec.max);near((value-spec.min)/spec.step,Math.round((value-spec.min)/spec.step));}
 for(const key of ['significado','historia','derivacion','usos','ficha','aprendizaje','unidades'])assert((await readFile(`formulas/${id}/${key}.md`,'utf8')).length>350,`${id}: short ${key}`);
 const meta=JSON.parse(await readFile(`formulas/${id}/meta.json`,'utf8'));assert.equal(meta.simulatorVersion,2);assert(Object.keys(meta.symbolGlossary).length>40);
}
console.log(JSON.stringify({frontierLabs:20,missions:80,independentCases:cases}));
