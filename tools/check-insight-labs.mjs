import assert from 'node:assert/strict';
import * as M from '../formulas/shared/insight-math.js';
import {INSIGHT_LABS as LABS} from '../formulas/shared/insight-configs.js';
import {drawInsight} from '../formulas/shared/insight-draw.js';
let checks=0;
const near=(a,b,tol=1e-9)=>{assert(Number.isFinite(a)&&Number.isFinite(b));assert(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} != ${b}`);checks++;};
const q=(id,patch={})=>M.model(id,{...LABS[id].defaults,...patch});
const integrate=(f,a,b,n=10000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3;};
const known={'eigenvalues-eigenvectors':3,'principal-component-analysis-pca':400/5.25,'canonical-ensemble-partition-function':34.415988090422054,'lorentz-transformations':-.25,'relativistic-velocity-addition':15/17,'relativistic-length-contraction':4,'relativistic-time-dilation':5,'mass-energy-equivalence':89.87551787368177,'energy-momentum-relation':Math.sqrt(13),'relativistic-energy-momentum-relation':1.25,'einstein-model-specific-heat':22.964718547684424,'t-hypothesis-test':2,'spacetime-interval':-3,'hardy-weinberg-equilibrium':42,'potential-of-hydrogen-ph':3,'ionic-product-of-water':7,'hill-dose-response-equation':50,'michaelis-menten-kinetics':5,'hydrogen-ionization-energy':13.6,'bohr-radius':.0529177210544,'geodesic-equation-gr':Math.sqrt(.9*(1+20.25/400)),'general-relativity':1.5711501902472953,'einstein-tensor':5.599192931002465,'henderson-hasselbalch-equation':4.76,'schwarzschild-metric-time-dilation':Math.SQRT1_2,'schwarzschild-radius':2.9533393820668783,'cosmological-constant':53.40852951358969,'variance':2};
assert.equal(Object.keys(LABS).length,28);for(const[id,x]of Object.entries(known))near(q(id).value,x);
// Algebraic identities independent of the eigensolver and projected coordinates.
for(const a of[-3,0,3])for(const b of[-2,0,2])for(const c of[-2,0,2])for(const d of[-3,0,3]){
 const r=M.eigen2({a,b,c,d});if(r.complex){near(r.real*2,a+d);near(r.real*r.real+r.imag*r.imag,a*d-b*c);}else r.values.forEach((l,i)=>{near((a-l)*(d-l)-b*c,0);r.vectors[i].forEach((x,j)=>near(M.mul(r.A,r.vectors[i])[j],l*x));});
}
assert(M.eigen2({a:1,b:1,c:0,d:1}).defective);assert(M.eigen2({a:0,b:-1,c:1,d:0}).complex);
for(const sx of[.2,1,4])for(const sy of[.2,2,4])for(const sz of[.2,.5,4])for(const angle of[-90,0,31,90]){
 const r=M.pca({sx,sy,sz,angle}),truth=[sx*sx,sy*sy,sz*sz].sort((a,b)=>b-a).map(x=>8*x/7);
 truth.forEach((x,i)=>near(r.values[i],x));for(let i=0;i<3;i++){near(M.norm(r.vectors[i]),1);M.mul(r.cov,r.vectors[i]).forEach((x,j)=>near(x,r.values[i]*r.vectors[i][j]));}
 near(r.points.reduce((s,x,i)=>s+M.norm(x.map((z,j)=>z-r.projected[i][j]))**2,0)/7,r.error);
}
for(const beta of[-.95,-.6,0,.6,.95])for(const x of[-3,0,3])for(const ct of[-3,0,3]){
 const b=M.boost(x,ct,beta),back=M.boost(b.x,b.ct,-beta);near(back.x,x);near(back.ct,ct);near(b.x*b.x-b.ct*b.ct,x*x-ct*ct);
 near(q('relativistic-length-contraction',{beta}).value*M.gamma(beta),5);near(q('relativistic-time-dilation',{beta}).value/M.gamma(beta),4);
 for(const u of[-1,-.7,0,.7,1]){const speed=q('relativistic-velocity-addition',{beta,u}).u;assert(Math.abs(speed)<=1+1e-12);near((speed-beta)/(1-speed*beta),u);}
}
for(const beta of[-.95,0,.95])for(const boost of[-.9,0,.9])for(const mass of[.1,1,5]){
 const r=q('relativistic-energy-momentum-relation',{beta,boost,mass});near(r.E*r.E-r.momentum*r.momentum,mass*mass);near(r.transformedE*r.transformedE-r.transformedP*r.transformedP,mass*mass);assert(r.transformedE>0);
}
assert.equal(q('energy-momentum-relation',{mass:0,momentum:0}).beta,null);near(q('energy-momentum-relation',{mass:0,momentum:-3}).beta,-1);
// Thermodynamic fluctuation formula checked against dU/dT.
for(const T of[100,300,1000])for(const gap of[10,100])for(const degeneracy of[1,5]){
 const p={T,gap,degeneracy},r=M.canonical(p),h=.001;near(r.prob.reduce((s,x)=>s+x,0),1);near((M.canonical({...p,T:T+h}).U-M.canonical({...p,T:T-h}).U)/(2*h),r.C*M.KB*1000,1e-7);
 near(r.entropy,r.prob.reduce((s,x,i)=>s-x*Math.log(x/r.deg[i]),0));
}
near(q('einstein-model-specific-heat',{T:1e8,theta:300}).value,3*M.R,1e-9);assert(q('einstein-model-specific-heat',{T:10,theta:800}).value<1e-27);
for(const T of[100,400,1000]){const h=.001;near((q('einstein-model-specific-heat',{T:T+h}).U-q('einstein-model-specific-heat',{T:T-h}).U)/(2*h),q('einstein-model-specific-heat',{T}).value,1e-7);}
// Student df=1 is exactly Cauchy; compare tabulated critical values and quadrature.
for(const t of[-10,-2,0,.5,3,20])near(M.studentCDF(t,1),.5+Math.atan(t)/Math.PI,1e-12);
near(M.studentQuantile(.975,10),2.2281388519649385,1e-10);near(M.studentQuantile(.975,1),12.706204736432095,1e-10);
for(const df of[1,2,10,99])for(const t of[.1,1,4]){near(integrate(x=>M.studentDensity(x,df),-t,t),2*M.studentCDF(t,df)-1,1e-9);near(M.studentCDF(M.studentQuantile(.95,df),df),.95);}
near(q('t-hypothesis-test',{mean:0}).p,1);assert(q('t-hypothesis-test',{mean:3}).reject);
for(const p of[0,.1,.5,.9,1]){const r=q('hardy-weinberg-equilibrium',{p});near(r.frequencies.reduce((s,x)=>s+x,0),1);near(r.frequencies[0]+r.frequencies[1]/2,p);}
for(const pKw of[12,14,16]){const r=q('ionic-product-of-water',{pKw,pH:pKw/2});near(r.aH/r.aOH,1);near(Math.log10(r.aH*r.aOH),-pKw);near(r.neutral,pKw/2);}
near(q('potential-of-hydrogen-ph',{loga:-16}).pH,16);
for(const ratio of[-2,0,2]){const r=q('henderson-hasselbalch-equation',{ratio});near(r.acid+r.base,20);near(r.base/r.acid,10**ratio);near(r.pH,4.76+ratio);}
for(const n of[.5,1,4]){near(q('hill-dose-response-equation',{n,A:2}).value,50);near(q('hill-dose-response-equation',{n,A:0}).value,0);}
for(const S of[0,.1,2,10])for(const Km of[.5,5])for(const t of[0,5,20]){
 const p={S,Km,Vmax:10,t},s=M.substrate(p),r=q('michaelis-menten-kinetics',p);near(s+r.product,S);assert(s>=0&&s<=S);if(S>0)near((S-s+Km*Math.log(S/s))/10,t/20,1e-8);if(t===0)near(s,S);
}
for(const n of[1,2,6]){near(q('hydrogen-ionization-energy',{n}).ion*n*n,13.6);near(integrate(x=>M.circularDensity(x,n),0,25),1,1e-8);near(integrate(x=>x*M.circularDensity(x,n),0,25),(2*n+1)/(2*n),1e-8);assert(M.circularDensity(1,n)>M.circularDensity(.9,n));assert(M.circularDensity(1,n)>M.circularDensity(1.1,n));}
assert.equal(q('hydrogen-ionization-energy',{photon:0}).kinetic,null);
// Circular Schwarzschild geodesics: L²=r²/(r−3), r>6. General orbits conserve E².
for(const radius of[7,12,20]){const L=radius/Math.sqrt(radius-3),r=M.orbit({radius,L,t:20});near(r.r,radius,1e-8);near(r.tau,r.phi*radius*radius/L,1e-8);}
for(const radius of[6,10,20,30])for(const L of[3.2,4.5,7])for(const t of[1,10,20]){
 const r=M.orbit({radius,L,t}),u=1/r.r,E2=(1-2*u)*(1+L*L*u*u)+(L*r.radialDerivative)**2;near(E2,r.energy*r.energy,1e-7);assert(r.r>2);assert(r.path.flat().every(Number.isFinite));
}
assert(M.orbit({radius:6,L:3.2,t:20}).status.includes('horizonte'));
for(const w of[-1,-.5,0,1/3,1])for(const rho of[1,3,10])for(const t of[0,10,20]){
 const r=M.flrw({w,rho,t});near(r.g00*1e52,r.source*1e52);near((-r.g00+3*r.gii)*1e52,-r.scalar*1e52);near(r.rho*r.a**(3*(1+w)),rho*1e-26,1e-12);
}
for(const radius of[1.05,2,10]){const r=q('schwarzschild-metric-time-dilation',{radius,t:12});near(r.proper,12*r.factor);near((1+r.redshift)*r.factor,1);}
for(const lambda of[.1,1,4]){const r=q('cosmological-constant',{lambda,t:0}),r1=q('cosmological-constant',{lambda,t:1});near(r.a,1);near(Math.log(r1.a),r.H*M.GYR);near(r.horizon*r.H*M.GYR,1);}
for(const mean of[-5,0,5])for(const scale of[0,.5,3]){const r=q('variance',{mean,scale});near(r.x.reduce((s,x)=>s+x,0)/5,mean);near(r.x.reduce((s,x)=>s+(x-mean)**2,0)/5,r.variance);near(r.sample,r.variance*1.25);}
const ctx=new Proxy({}, {get:(o,k)=>k in o?o[k]:(...args)=>{if(['moveTo','lineTo','arc','fillRect'].includes(k))for(const x of args.filter(x=>typeof x==='number'))assert(Number.isFinite(x),`Nonfinite ${k}`);if(k==='arc')assert(args[2]>=0);},set:(o,k,x)=>{assert(x!==undefined,`Undefined ${k}`);o[k]=x;return true;}});
const view={accent:'#397d91',ink:'#222222',line:'#cccccc',muted:'#666666',background:'#ffffff',yaw:.7,pitch:.55,hide:false};
for(const[id,c]of Object.entries(LABS)){
 for(const mission of c.missions){if(mission.kind==='tune'){near(mission.get({...c.defaults,...mission.solution}),mission.answer);assert(Math.abs(mission.get(c.defaults)-mission.answer)>mission.tolerance,`${id}: initially solved tune`);for(const[key,x]of Object.entries(mission.solution)){const s=c.controls.find(x=>x.key===key);assert(x>=s.min&&x<=s.max);}}else if(mission.kind!=='choice')assert(Number.isFinite(mission.answer));checks++;}
 const states=[c.defaults,Object.fromEntries(c.controls.map(s=>[s.key,s.min])),Object.fromEntries(c.controls.map(s=>[s.key,s.max])),...c.controls.flatMap(s=>[s.min,s.max].map(x=>({...c.defaults,[s.key]:x})))];
 for(const p of states)for(const mode of[0,1,2]){drawInsight(ctx,390,240,id,p,{...view,mode});checks++;}
}
for(const id of['principal-component-analysis-pca','bohr-radius','geodesic-equation-gr','general-relativity','schwarzschild-radius','cosmological-constant'])assert(drawInsight(ctx,390,240,id,LABS[id].defaults,{...view,mode:1}).rotate);
for(const[id,mode,label]of[['schwarzschild-metric-time-dilation',1,'Reloj lejano'],['cosmological-constant',2,'Un horizonte físico constante, un alcance comóvil menor']]){
 const labels=[],scene=new Proxy(ctx,{get:(o,k)=>k==='fillText'?(s)=>labels.push(s):o[k]});drawInsight(scene,390,240,id,LABS[id].defaults,{...view,mode});assert(labels.includes(label));
}
console.log(JSON.stringify({insightLabs:28,missions:112,independentChecks:checks}));
