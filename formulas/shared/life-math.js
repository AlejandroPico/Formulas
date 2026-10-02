export function rk4(f,y0,end,step=.02){let y=y0.slice(),t=0,points=[[0,...y]];while(t<end-1e-12){const h=Math.min(step,end-t),a=f(t,y),b=f(t+h/2,y.map((x,i)=>x+h*a[i]/2)),c=f(t+h/2,y.map((x,i)=>x+h*b[i]/2)),d=f(t+h,y.map((x,i)=>x+h*c[i]));y=y.map((x,i)=>x+h*(a[i]+2*b[i]+2*c[i]+d[i])/6);t+=h;if(!y.every(Number.isFinite))throw new Error('ODE divergence');points.push([t,...y]);}return {state:y,points};}
export function epidemic(p,seir=false){const i=.01,e=seir?.02:0,y0=seir?[1-i-e,e,i,0]:[1-i,i,0];const f=seir?(_,y)=>[-p.beta*y[0]*y[2],p.beta*y[0]*y[2]-p.sigma*y[1],p.sigma*y[1]-p.gamma*y[2],p.gamma*y[2]]:(_,y)=>[-p.beta*y[0]*y[1],p.beta*y[0]*y[1]-p.gamma*y[1],p.gamma*y[1]];return {...rk4(f,y0,p.t*5,.05),R0:p.beta/p.gamma,derivative:f(0,y0)};}
export function lv(p,competitive=false){const f=competitive?(_,y)=>[p.r1*y[0]*(1-y[0]-p.alpha*y[1]),p.r2*y[1]*(1-y[1]-p.beta*y[0])]:(_,y)=>[p.a*y[0]-p.b*y[0]*y[1],p.d*y[0]*y[1]-p.c*y[1]];const initial=competitive?[.4,.6]:[p.prey,p.predator];return {...rk4(f,initial,p.t,.01),f,initial};}
const vtrap=x=>Math.abs(x)<1e-6?1-x/2:x/Math.expm1(x);
export function gates(V){return {m:[vtrap(-(V+40)/10),4*Math.exp(-(V+65)/18)],h:[.07*Math.exp(-(V+65)/20),1/(1+Math.exp(-(V+35)/10))],n:[.1*vtrap(-(V+55)/10),.125*Math.exp(-(V+65)/80)]};}
export const currents=([V,m,h,n])=>[120*m**3*h*(V-50),36*n**4*(V+77),.3*(V+54.387)];
export function hh(p){const rates=gates(-65),initial=[-65,...['m','h','n'].map(k=>rates[k][0]/(rates[k][0]+rates[k][1]))],net=currents(initial).reduce((a,b)=>a+b,0);
 const f=(t,y)=>{const g=gates(y[0]),I=t>=5&&t<30?p.current:0;return [I-currents(y).reduce((a,b)=>a+b,0),...['m','h','n'].map((k,i)=>g[k][0]*(1-y[i+1])-g[k][1]*y[i+1])];};
 const r=rk4(f,initial,50,.01),index=Math.min(r.points.length-1,Math.round(p.t*2.5/.01));return {...r,now:r.points[index].slice(1),initialRate:p.current-net,peak:Math.max(...r.points.map(x=>x[1]))};
}
export function model(id,p){switch(id){
 case 'born-haber-cycle':{const steps=[p.sublimation,p.dissociation/2,p.ionization,p.affinity],lattice=p.formation-steps.reduce((a,b)=>a+b,0);return {value:lattice,lattice,steps,cumulative:steps.reduce((a,x)=>(a.push((a.at(-1)||0)+x),a),[0])};}
 case 'debye-huckel-limiting-law':{const log=-p.A*p.z*p.z*Math.sqrt(p.I),gamma=10**log;return {value:gamma,gamma,log};}
 case 'lotka-volterra-equations':{const r=lv(p);return {...r,value:p.c/p.d,equilibrium:[p.c/p.d,p.a/p.b],invariant:y=>p.d*y[0]-p.c*Math.log(y[0])+p.b*y[1]-p.a*Math.log(y[1])};}
 case 'competitive-lotka-volterra-model':{const r=lv(p,true),den=1-p.alpha*p.beta;return {...r,value:p.r1*.4*(1-.4-p.alpha*.6),equilibrium:Math.abs(den)>1e-10?[(1-p.alpha)/den,(1-p.beta)/den]:null};}
 case 'sir-epidemic-model':case 'seir-epidemic-model':{const r=epidemic(p,id.startsWith('seir'));return {...r,value:r.R0};}
 case 'fisher-kpp-diffusion-equation':{const speed=5*Math.sqrt(p.D*p.rate/6),density=x=>1/(1+Math.exp(Math.sqrt(p.rate/(6*p.D))*(x-speed*p.t)))**2;return {value:density(p.x),speed,density};}
 case 'one-compartment-pharmacokinetics':{const k=p.clearance/p.volume,C=p.amount/p.volume*Math.exp(-k*p.time),auc=p.amount/p.clearance;return {value:C,C,k,halfLife:Math.LN2/k,auc};}
 case 'goldman-hodgkin-katz-equation':{const inside=p.Ki+p.PNa*p.Nai+p.PCl*p.Clo,outside=p.Ko+p.PNa*p.Nao+p.PCl*p.Cli,V=8.314462618*p.T/96485.33212*Math.log(outside/inside)*1000;return {value:V,V,inside,outside};}
 case 'monod-microbial-growth-model':{const mu=p.max*p.S/(p.K+p.S);return {value:mu,mu,growth:t=>p.X0*Math.exp(mu*t),doubling:mu===0?null:Math.LN2/mu};}
 case 'hodgkin-huxley-action-potential':{const r=hh(p);return {...r,value:r.initialRate};}
 case 'replicator-equation-evolutionary-game-theory':{const fitness=x=>[p.a*x+p.b*(1-x),p.c*x+p.d*(1-x)],derivative=x=>{const [a,b]=fitness(x);return x*(1-x)*(a-b);},r=rk4((_,y)=>[derivative(y[0])],[p.x],p.t,.02);return {...r,value:derivative(p.x),fitness,derivative};}
 case 'voltage-gain-decibels':{const gain=p.out/p.input,db=20*Math.log10(gain);return {value:db,db,gain};}
 case 'shockley-diode-equation':{const thermal=8.617333262145e-5*p.T,I=p.Is*Math.expm1(p.V/(p.n*thermal));return {value:I,I,thermal};}
 case 'ideal-mosfet-quadratic-model':{const over=p.Vgs-p.threshold,sat=p.Vds>=over,I=over<=0?0:sat?p.k*over**2/2:p.k*(over*p.Vds-p.Vds**2/2);return {value:I,I,over,region:over<=0?'corte':sat?'saturación':'triodo'};}
 default:throw new Error(id);
}}
