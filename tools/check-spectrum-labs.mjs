import assert from 'node:assert/strict';
import * as M from '../formulas/shared/spectrum-math.js';
import {SPECTRUM_LABS as LABS} from '../formulas/shared/spectrum-configs.js';
import {drawSpectrum} from '../formulas/shared/spectrum-draw.js';
const near=(a,b,tol=1e-8)=>assert(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const q=(id,changes={})=>M.model(id,{...LABS[id].defaults,...changes});
assert.equal(Object.keys(LABS).length,52);
const known={
 'clausius-clapeyron-equation':101.325,'frenet-serret-formulas':.8,'first-law-thermodynamics':150,'shear-stress-cizalladura':50,'cauchy-riemann':2,'stokes-drag-law':.0471238898038469,'beer-lambert-law':.2,'geodesic-equation':.75,'riemannian-metric':Math.sqrt(3),'stokes-theorem':Math.PI,'advection-diffusion-equation':1,'darcy-weisbach-pipe-head-loss':.03*200/(2*9.81),'cayley-hamilton-theorem':3,'maxwell-boltzmann-speed-distribution':Math.sqrt(2*8.31446261815324*300/.028),'ampere-maxwell-law':1.6,'chemical-equilibrium-constant-kc':1/3,'dynamic-chemical-equilibrium':0,'electromagnetic-wave-equation':10,'maxwell-equations':10,'magnetic-gauss-law':0,'wohler-sn-fatigue-curve':Math.log10(9765625),'thermodynamic-maxwell-relations':831.446261815324,'van-der-waals-equation-of-state':.0831446261815324*300/(1-.04267)-3.592,'singular-value-decomposition-svd':3,'gibbs-free-energy':5,'gibbs-free-energy-spontaneity':5,'boltzmann-entropy':Math.log(252),'stefan-boltzmann-law':.8*5.670374419e-8*(400**4-300**4),'power-factor-triangle':460*Math.sqrt(3)/2,'ac-ohms-law-impedance':2.4,'mohr-circle-2d-stress-transformation':50+Math.sqrt(1800),'helmholtz-free-energy':70,'reynolds-number':2000,'poynting-vector':100/(2*376.730313668),'series-rlc-resonance':1/(2*Math.PI*.001),'balanced-three-phase-power':6,'neuronal-nernst-reversal-potential':8.31446261815324*310.15/96485.33212*Math.log(.05)*1000,'arrhenius-equation':100000*Math.exp(-20000/(8.31446261815324*300)),'nernst-equation':1.1,'manning-open-channel-flow':2/.02*.5**(2/3)*Math.sqrt(.001),'price-elasticity-of-demand':-2/3,'linear-supply-demand-equilibrium':30,'complex-ac-impedance':10/Math.hypot(10,20*Math.PI-500/Math.PI),'wiens-displacement-law':.965923985,'pearson-correlation':1/Math.sqrt(2),'lorentz-force':1,'lienard-wiechert-potentials':1/Math.sqrt(1.75),'z-hypothesis-test':1,'covariance':2,'spectral-decomposition':3,'planck-law':2*6.62607015e-34*299792458**2/(1e-6)**5/Math.expm1(6.62607015e-34*299792458/(1e-6*1.380649e-23*3000))*1e-6};
for(const [id,value] of Object.entries(known))near(q(id).value,value);
near(q('riemann-zeta-function').sum,1.625132733621529);
const integrate=(f,a,b,n=6000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3;};
let checks=52;
for(const T of[100,300,1000])for(const mass of[2,28,100]){const d=q('maxwell-boltzmann-speed-distribution',{T,mass});near(integrate(d.density,0,d.rms*8),1,1e-7);near(integrate(v=>v*v*d.density(v),0,d.rms*8),d.rms*d.rms,1e-7);checks+=2;}
for(const D of[0,.05,.5])for(const t of[0,5,20]){const d=q('advection-diffusion-equation',{D,t});near(integrate(d.density,d.center-10*d.width,d.center+10*d.width),1,1e-7);near(integrate(x=>(x-d.center)**2*d.density(x),d.center-10*d.width,d.center+10*d.width),d.variance,1e-7);checks+=2;}
for(const radius of[.5,1,2])for(const pitch of[-1,0,1]){const p={...LABS['frenet-serret-formulas'].defaults,radius,pitch,t:7},d=M.helix(p),dsdt=.3*Math.hypot(radius,pitch),h=1e-5,before=M.helix(p,p.t-h),after=M.helix(p,p.t+h);for(const key of['T','N','B']){near(M.norm(d[key]),1);for(let i=0;i<3;i++)near((after[key][i]-before[key][i])/(2*h*dsdt),d['d'+key][i],1e-6);}near(M.dot(d.T,d.N),0);near(M.dot(d.N,d.B),0);near(M.dot(d.T,d.B),0);checks+=15;}
for(const B of[-2,0,1])for(const charge of[-1,0,1])for(const t of[0,5,20]){const p={...LABS['lorentz-force'].defaults,B,q:charge,t},d=M.lorentz(p),h=1e-5,before=M.lorentz(p,t-h),after=M.lorentz(p,t+h);near(d.energy,.5*p.m*p.v*p.v);near((after.vx-before.vx)/(2*h),d.Fx/p.m,1e-5);near((after.vy-before.vy)/(2*h),d.Fy/p.m,1e-5);checks+=3;}
for(const beta of[-.8,0,.8])for(const x of[-2,.1,2]){const p={beta,x,y:1},d=M.model('lienard-wiechert-potentials',p);near(d.distance,Math.hypot(x-d.source,1));near(d.source,-beta*d.delay);near(d.potential,1/(d.distance*d.kappa));checks+=3;}
for(const a of[-3,0,2])for(const b of[-1,0,1])for(const c of[-1,0,2])for(const d of[-2,0,3]){const p={a,b,c,d},r=M.svd(p);for(let i=0;i<2;i++)for(let j=0;j<2;j++)near(r.reconstruction[i][j],r.A[i][j],1e-6);near(M.norm(r.U[0]),1);near(M.norm(r.U[1]),1);near(M.dot(r.U[0],r.U[1]),0,1e-6);near(Math.hypot(...r.A.flat().map((x,i)=>x-r.rank1.flat()[i])),r.s[1],1e-6);const ch=M.model('cayley-hamilton-theorem',p);ch.residual.flat().forEach(x=>near(x,0));checks+=12;}
for(const angle of[-90,-30,0,40,90]){const m=q('mohr-circle-2d-stress-transformation',{angle});near(m.sx+m.sy,100);near((m.sx-m.mid)**2+m.tau*m.tau,m.r*m.r);checks+=2;}
for(const s of[1.1,2,3,5])for(const N of[10,50,200]){const d=q('riemann-zeta-function',{s,N}),truth=s===2?Math.PI**2/6:s===3?1.202056903159594:s===5?1.03692775514337:null;if(truth!==null){assert(truth>=d.sum+d.lower-1e-12&&truth<=d.sum+d.bound+1e-12);checks++;}}
for(const t of[0,5,20]){const d=q('dynamic-chemical-equilibrium',{t});near(d.A+d.B,2);assert(d.A>=0&&d.B>=0);checks+=2;}
near(q('nernst-equation',{quotient:10}).E,1.1-.059159349686/2,1e-8);
assert.equal(q('pearson-correlation',{slope:0,noise:0}).r,null);
assert.equal(q('chemical-equilibrium-constant-kc',{B:2}).quotient,null);
assert.equal(q('lienard-wiechert-potentials',{x:0,y:0}).singular,true);
assert.equal(q('price-elasticity-of-demand',{price:50}).elasticity,null);
near(q('covariance',{offset:5}).value,q('covariance').value);
near(q('ampere-maxwell-law',{r:5}).B,4);
near(q('stefan-boltzmann-law',{T:300}).net,0);
near(q('series-rlc-resonance',{f:q('series-rlc-resonance').f0}).I,1);
near(q('spectral-decomposition',{a:1,b:0,d:1}).values[1],1);
const ctx=new Proxy({}, {get:(o,k)=>k in o?o[k]:(...args)=>{if(['moveTo','lineTo','arc','fillRect'].includes(k))for(const x of args.filter(x=>typeof x==='number'))assert(Number.isFinite(x),`Nonfinite ${k}`);},set:(o,k,x)=>{assert(x!==undefined,`Undefined ${k}`);o[k]=x;return true;}});
for(const[id,c]of Object.entries(LABS)){
 for(const mission of c.missions){if(mission.kind==='tune'){near(mission.get({...c.defaults,...mission.params,...mission.solution}),mission.answer);assert(Math.abs(mission.get({...c.defaults,...mission.params})-mission.answer)>.02);for(const[key,value]of Object.entries(mission.solution)){const control=c.controls.find(x=>x.key===key);assert(value>=control.min&&value<=control.max);}}else if(mission.kind!=='choice')assert(Number.isFinite(mission.answer));checks++;}
 for(const spec of c.controls){for(const value of spec.options?spec.options.map(x=>x[0]):[spec.min,spec.max]){const p={...c.defaults,[spec.key]:value};for(const mode of[0,1,2])drawSpectrum(ctx,390,220,id,p,{mode,accent:c.accent,ink:'#222222',line:'#cccccc',muted:'#666666',background:'#ffffff',yaw:.7,pitch:.55,hide:false});checks+=3;}}
}
// Complementary circuit views must reach their own renderer, rather than the triangle branch.
for(const [id,expected] of [['power-factor-triangle','El desfase modifica el promedio de v·i'],['ac-ohms-law-impedance','Tensión de referencia y corriente con fase'],['clausius-clapeyron-equation','1000/T (K⁻¹)']]){
 const labels=[],scene=new Proxy(ctx,{get:(o,k)=>k==='fillText'?(s)=>labels.push(s):o[k]});
 drawSpectrum(scene,390,220,id,LABS[id].defaults,{mode:2,accent:LABS[id].accent,ink:'#222222',line:'#cccccc',muted:'#666666',background:'#ffffff',yaw:.7,pitch:.55,hide:false});
 assert(labels.includes(expected),`${id}: complementary view unreachable`);checks++;
}
console.log(JSON.stringify({spectrumLabs:52,missions:208,independentChecks:checks}));
