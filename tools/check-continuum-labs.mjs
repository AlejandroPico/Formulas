import assert from 'node:assert/strict';
import * as M from '../formulas/shared/continuum-math.js';
import {CONTINUUM_LABS} from '../formulas/shared/continuum-configs.js';
let checks=0;const near=(a,b,tol=1e-8)=>{checks++;assert(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} != ${b}`);};
assert.equal(Object.keys(CONTINUUM_LABS).length,33);
for(const [id,c] of Object.entries(CONTINUUM_LABS)){assert.equal(c.modes.length,3);assert.equal(c.missions.length,4);const t=c.missions[1],p={...c.defaults,...t.params};assert(Math.abs(t.get(p)-t.answer)>t.tolerance,`${id}: tuning starts solved`);near(t.get({...p,...t.solution}),t.answer);for(const [key,value] of Object.entries(t.solution)){const spec=c.controls.find(s=>s.key===key);assert(spec&&value>=spec.min&&value<=spec.max);near((value-spec.min)/spec.step,Math.round((value-spec.min)/spec.step));}assert(c.missions[0].answer!==9999);}
near(M.axial({F:10,d:20,E:200}).stress,100/Math.PI);near(M.axial({F:-10,d:20,E:200}).strain,-1/(2000*Math.PI));
for(const f of [1,2,5,12]){const p={a:1,b:0,f,phi:0},s=M.spectrum(p);near(s[f].amplitude,1);near(s.filter(q=>q.k!==f).reduce((a,q)=>a+q.amplitude,0),0);}
near(M.spectrum({a:1,b:1,f:3,phi:Math.PI})[3].amplitude,0);near(M.spectrum({a:1,b:.5,f:1,phi:Math.PI/2})[3].phase,Math.PI/2);
for(const hot of [300,500,800])for(const cold of [100,200,300]){const p={hot,cold,Q:1000},q=M.carnot(p);near(q.work+q.reject,1000);near(-p.Q/hot+q.reject/cold,0);}
assert(!M.carnot({hot:300,cold:400,Q:100}).valid);
for(const gompertz of [false,true])for(const N0 of [1,10,100,150]){const p={N0,K:100,r:.2,t:3},q=M.growth(p,gompertz);near(M.growth(p,gompertz,0).N,N0);const dt=1e-5;near((M.growth(p,gompertz,3+dt).N-M.growth(p,gompertz,3-dt).N)/(2*dt),q.rate,1e-6);if(N0>100)assert(q.N< N0&&q.N>100);}
assert.equal(M.growth({N0:0,K:100,r:.2,t:10}).N,0);
for(const V of [-12,0,12]){const q=M.ohm({V,R:6});near(q.P,V*q.I);assert(q.P>=0);}
near(M.green({omega:2,a:2,b:1}).circulation,4);near(M.kinetic({m:2,v:-3}).energy,9);
const rl={V:10,R:10,L:100,t:0,kind:'charge'};near(M.inductor(rl).I,0);near(M.inductor({...rl,kind:'release'}).I,1);near(M.inductor(rl,10).I,1-Math.exp(-1));near(M.inductor({...rl,kind:'release'},10).energy,.05*Math.exp(-2));
assert.equal(M.cauchy({R:1,zx:1,zy:0,c:1}).kind,'singular');assert.deepEqual(M.cauchy({R:1,zx:2,zy:0,c:1}).integral,[0,0]);near(M.cauchy({R:2,zx:1,zy:1,c:0}).integral[0],-4*Math.PI);
const ind={B:1,rate:.03,angle:30,omega:.8,radius:10,turns:10,t:2},dt=1e-5;near(M.induction(ind).emf,-(M.induction(ind,2+dt).flux-M.induction(ind,2-dt).flux)/(2*dt),1e-6);
const tr=M.transformer({Np:100,Ns:200,V:12,I:2});near(tr.Vs*tr.Is,tr.power);
for(const size of [1,2,3]){const q=M.divergence({ax:1,ay:-1,az:2,size});near(q.faces.reduce((s,x)=>s+x,0),q.flux);near(q.flux,2*size**3);}
for(let t=0;t<=20;t+=.2){const p={m:2,k:3,q0:1,p0:2,t},q=M.hamilton(p);near(q.H,2.5);near((M.hamilton(p,t+dt).q-M.hamilton(p,t-dt).q)/(2*dt),q.p/p.m,1e-6);near((M.hamilton(p,t+dt).p-M.hamilton(p,t-dt).p)/(2*dt),-p.k*q.q,1e-6);}
near(M.gas({n:1,T:300,V:10}).P,249.43387854);near(M.electrolysis({I:2,t:10,M:63.546,z:2,eff:100}).mass,.39516473,1e-6);
for(const mix of [0,25,50,100])for(const t of [0,1,3]){const p={L:2,n:1,mix,t};let sum=0;for(let j=0;j<2000;j++)sum+=M.quantum(p,(j+.5)*2/2000).density*2/2000;near(sum,1);near(M.quantum(p,0).density,0);near(M.quantum(p,2).density,0);near(M.quantum(p).mean,(1-mix/100)*Math.PI**2/8+mix/100*Math.PI**2/2);}
near(M.quantum({L:2,n:1,mix:0,t:3},.4).density,M.quantum({L:2,n:1,mix:0,t:0},.4).density);
assert(M.electricGauss({q:1,R:1,x:1}).boundary);near(M.electricGauss({q:1,R:1,x:2}).flux,0);near(M.electricGauss({q:-2,R:1,x:0}).flux,-225.881813474);
for(const n of [1,2,3]){const q=M.sturm({L:2,n});near(q.mode(0),0);near(q.mode(2),0);near(q.lambda,n*n*Math.PI**2/4);}let orthogonal=0;for(let j=0;j<1000;j++){const x=(j+.5)*2/1000;orthogonal+=M.sturm({L:2,n:1}).mode(x)*M.sturm({L:2,n:2}).mode(x)*2/1000;}near(orthogonal,0);
const pp={R:2,mu:10,pressure:100,L:1},pipe=M.pipe(pp);near(M.pipe(pp,.002).velocity,0);near(pipe.max,2*pipe.mean);near(M.pipe({...pp,R:4}).Q,16*pipe.Q);let flow=0;for(let j=0;j<2000;j++){const r=(j+.5)*pipe.R/2000;flow+=M.pipe(pp,r).velocity*2*Math.PI*r*pipe.R/2000;}near(flow,pipe.Q,1e-10);
assert.equal(M.scalar({ax:0,ay:0,az:0,bx:1,by:0,bz:0}).angle,null);near(M.scalar({ax:1,ay:2,az:3,bx:-1,by:0,bz:2}).value,5);
near(M.bridge({V:10,R1:100,R2:200,R3:150,Rx:300}).voltage,0);
for(const x of [-1000,-10,0,10,1000]){near(M.sigmoid(x)+M.sigmoid(-x),1);assert(Number.isFinite(M.sigmoid(x)));}
const reg=M.regression({w:1,b:0,x:0,threshold:50});near(reg.p,.5);assert.equal(reg.prediction,1);assert(Number.isFinite(M.regression({w:1000,b:1000,x:1,threshold:50}).loss));
for(const R1 of [1,4,10])for(const R2 of [1,4,10]){const p={V:12,Rs:2,R1,R2},q=M.circuit(p);near(q.I1+q.I2,q.I);near(p.V-p.Rs*q.I-R1*q.I1,0);}
for(const wall of [-1,0,1]){const p={G:2,mu:1,H:1,wall};near(M.channel(p,0).velocity,0);near(M.channel(p,1).velocity,wall);let sum=0;for(let i=0;i<1000;i++)sum+=M.channel(p,(i+.5)/1000).velocity/1000;near(sum,M.channel(p).mean,1e-6);}
assert(!M.mechanical({m:2,v0:0,h0:1,h:2}).reachable);near(M.mechanical({m:2,v0:0,h0:2,h:0}).speed,Math.sqrt(39.24));
assert(M.descent({a:1,b:2,x0:2,y0:1,eta:.2,steps:5}).stable);assert(!M.descent({a:1,b:2,x0:2,y0:1,eta:1.2,steps:5}).stable);near(M.descent({a:1,b:2,x0:2,y0:1,eta:.25,steps:1}).x,1.5);
for(const b of [-1,0,.5,1])for(const t of [0,1,4]){const q=M.helix({R:1,b,t});near(M.norm(q.T),1);near(M.norm(q.N),1);near(M.norm(q.B),1);near(M.dot(q.T,q.N),0);near(M.dot(q.T,q.B),0);near(M.dot(q.N,q.B),0);near(q.kappa*q.radius,1);near(q.tau,b/(1+b*b));}
for(const second of [false,true]){const p={A0:1,k:.1,t:0},q=M.kinetics(p,second);near(M.kinetics(p,second,q.half).concentration,.5);assert.equal(M.kinetics({...p,k:0},second,20).half,Infinity);assert.equal(M.kinetics({...p,k:0},second,20).concentration,1);}
console.log(JSON.stringify({continuumLabs:33,missions:132,independentChecks:checks}));
