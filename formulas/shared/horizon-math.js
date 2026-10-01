// Pure models. Distances, time and amplitudes use the units stated in each lab.
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const norm=a=>Math.hypot(...a);
export const integrate=(f,a,b,n=512)=>{let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+(b-a)*i/n);return s*(b-a)/(3*n);};
export function cramer(p){const D=p.a-p.b;return {D,x:Math.abs(D)<1e-10?null:(p.c-p.d)/D,y:Math.abs(D)<1e-10?null:(p.a*p.d-p.b*p.c)/D,kind:Math.abs(D)<1e-10?(p.c===p.d?'coincidentes':'paralelas'):'única'};}
export function mass(p){return {rate:p.input-p.output,value:p.initial+(p.input-p.output)*p.t,div:p.ax+p.ay};}
export function action(p){const T=1,m=p.m,k=p.k,a=p.a;return {S:a*a*(m*Math.PI**2-k)/4,critical:k===m*Math.PI**2,residual:x=>a*(k-m*Math.PI**2)*Math.sin(Math.PI*x),path:x=>a*Math.sin(Math.PI*x),kinetic:x=>.5*m*(a*Math.PI*Math.cos(Math.PI*x))**2,potential:x=>.5*k*(a*Math.sin(Math.PI*x))**2,T};}
export function euler(p,x=1){return {local:p.b,convective:p.a*p.a*x,acc:p.b+p.a*p.a*x,gradient:-p.rho*(p.b+p.a*p.a*x)};}
export function bayes(p){const prior=p.prior/100,tp=prior*p.hit/100,fp=(1-prior)*p.false/100,evidence=tp+fp;return {tp,fp,evidence,posterior:evidence===0?null:tp/evidence};}
export function multiclass(p){const prior=[p.p1,p.p2,p.p3],likelihood=[p.l1,p.l2,p.l3],total=prior.reduce((a,b)=>a+b,0);const weights=prior.map((v,i)=>total? v/total*likelihood[i]/100:0),evidence=weights.reduce((a,b)=>a+b,0);return {prior:prior.map(v=>total?v/total:0),weights,evidence,posterior:evidence?weights.map(v=>v/evidence):null};}
export function vector(p){const A=[p.ax,p.ay,p.az],B=[p.bx,p.by,p.bz],C=cross(A,B);return {A,B,C,area:norm(C),volume:dot(C,[0,0,1])};}
export function sphere(p){const sides=[p.a,p.b,p.c].map(x=>x*Math.PI/180),s=sides.reduce((x,y)=>x+y)/2;const valid=s<Math.PI&&sides.every(x=>x>0&&x<Math.PI&&x<s);if(!valid)return {valid:false};const E=4*Math.atan(Math.sqrt(Math.tan(s/2)*sides.reduce((prod,x)=>prod*Math.tan((s-x)/2),1)));const [a,b,c]=sides,az=(Math.cos(a)-Math.cos(b)*Math.cos(c))/(Math.sin(b)*Math.sin(c));return {valid:true,E,area:E*p.R*p.R,vertices:[[0,0,1],[Math.sin(c),0,Math.cos(c)],[Math.sin(b)*clamp(az,-1,1),Math.sin(b)*Math.sqrt(Math.max(0,1-az*az)),Math.cos(b)]]};}
export function laplace(p){const d=p.s-p.a;return {valid:d>0,value:d>0?1/d:null,f:t=>Math.exp(p.a*t),weighted:t=>Math.exp(-d*t),partial:d===0?p.T:-Math.expm1(-d*p.T)/d};}
export const COULOMB=8.9875517923e9;
export function electric(p){const r=Math.hypot(p.x,p.y),valid=r>1e-8,q=p.q*1e-9,q2=p.q2*1e-9;return {valid,r,E:valid?COULOMB*q/r**2:null,V:valid?COULOMB*q/r:null,F:valid?COULOMB*q*q2/r**2:null,Ex:valid?COULOMB*q*p.x/r**3:null,Ey:valid?COULOMB*q*p.y/r**3:null};}
export function lagrange(p,x=p.x){const nodes=[[-1,p.y0],[0,p.y1],[1,p.y2]],basis=[x*(x-1)/2,1-x*x,x*(x+1)/2];return {nodes,basis,value:dot(basis,nodes.map(q=>q[1]))};}
export function signal(p,t){return p.offset+p.A*Math.cos(t)+p.B*Math.sin(2*t);}
export function parseval(p){const N=32,samples=Array.from({length:N},(_,i)=>signal(p,2*Math.PI*i/N)),spectrum=Array.from({length:N},(_,k)=>{let re=0,im=0;for(let n=0;n<N;n++){re+=samples[n]*Math.cos(2*Math.PI*k*n/N);im-=samples[n]*Math.sin(2*Math.PI*k*n/N);}return (re*re+im*im)/N;});return {samples,spectrum,energy:samples.reduce((s,x)=>s+x*x,0),spectral:spectrum.reduce((s,x)=>s+x,0),mean:p.offset**2+(p.A**2+p.B**2)/2};}
export function convolution(p,t=p.t){const low=Math.max(0,t-p.b),high=Math.min(p.a,t),overlap=Math.max(0,high-low);return {low,high,overlap,value:p.A*p.B*overlap,f:x=>x>=0&&x<=p.a?p.A:0,g:x=>x>=0&&x<=p.b?p.B:0};}
export const wrap=(x,L)=>((x%L)+L)%L;
export const pulse=x=>Math.exp(-(((wrap(x+5,10)-5)/.8)**2));
export function advect(p){const N=80,dx=10/N,c=p.c,cfl=p.cfl,dt=c===0?1:cfl*dx/Math.abs(c);let u=Array.from({length:N},(_,i)=>pulse(i*dx-3)),initial=u.reduce((a,b)=>a+b,0)*dx;const steps=Math.floor(p.t/dt),fraction=(p.t-steps*dt)/dt;for(let n=0;n<=steps;n++){const f=(n===steps?fraction:1)*cfl;if(c===0)break;u=u.map((v,i)=>v-f*(v-u[(i+(c>0?-1:1)+N)%N]));}return {u,dx,initial,mass:u.reduce((a,b)=>a+b,0)*dx,exact:x=>pulse(x-3-c*p.t),dt,steps};}
export function ruffini(p){const coefficients=[1,p.b,p.c,p.d],synthetic=[1];for(let i=1;i<4;i++)synthetic.push(coefficients[i]+p.r*synthetic[i-1]);return {coefficients,synthetic,remainder:synthetic[3],P:x=>((x+p.b)*x+p.c)*x+p.d,Q:x=>(x+synthetic[1])*x+synthetic[2]};}
export const points=kind=>kind==='outlier'?[[-2,-3],[-1,-1],[0,1],[1,3],[2,9]]:[[-2,-3],[-1,-1],[0,2],[1,3],[2,4]];
export function fit(p){const data=points(p.kind),n=data.length,mx=data.reduce((s,[x])=>s+x,0)/n,my=data.reduce((s,[,y])=>s+y,0)/n,Sxx=data.reduce((s,[x])=>s+(x-mx)**2,0),beta=data.reduce((s,[x,y])=>s+(x-mx)*(y-my),0)/Sxx,alpha=my-beta*mx,residuals=data.map(([x,y])=>y-(p.slope*x+p.intercept)),mse=dot(residuals,residuals)/n;return {data,beta,alpha,mse,rmse:Math.sqrt(mse),residuals,predict:x=>p.slope*x+p.intercept,optimal:x=>beta*x+alpha};}
// Abramowitz–Stegun 7.1.26: absolute erf error < 1.5e-7.
export function erf(x){const sign=Math.sign(x),z=Math.abs(x),t=1/(1+.3275911*z);return sign*(1-(((((1.061405429*t-1.453152027)*t+1.421413741)*t-.284496736)*t+.254829592)*t)*Math.exp(-z*z));}
export const pdf=(x,mu=0,sigma=1)=>Math.exp(-.5*((x-mu)/sigma)**2)/(sigma*Math.sqrt(2*Math.PI));
export const cdf=(x,mu=0,sigma=1)=>(1+erf((x-mu)/(sigma*Math.SQRT2)))/2;
export function normal(p){return {prob:cdf(p.b,p.mu,p.sigma)-cdf(p.a,p.mu,p.sigma),peak:pdf(p.mu,p.mu,p.sigma),z:(p.x-p.mu)/p.sigma,density:x=>pdf(x,p.mu,p.sigma)};}
export function gauss(p){const total=Math.sqrt(Math.PI/p.a),partial=Math.sqrt(Math.PI/p.a)*erf(Math.sqrt(p.a)*p.b);return {total,partial,tail:Math.max(0,total-partial),curve:x=>Math.exp(-p.a*x*x)};}
export function binomial(n,p){let dist=[1];for(let j=0;j<n;j++){const next=Array(dist.length+1).fill(0);dist.forEach((v,i)=>{next[i]+=v*(1-p);next[i+1]+=v*p;});dist=next;}return dist;}
export function central(p){const prob=p.p/100,n=Math.round(p.n),sd=Math.sqrt(n*prob*(1-prob)),dist=binomial(n,prob);return {dist,mean:n*prob,sd,se:Math.sqrt(prob*(1-prob)/n),bars:dist.map((v,k)=>[(k-n*prob)/sd,v*sd])};}
export function activation(p,x=p.x){const z=p.w*x+p.b,y=Math.tanh(z),derivative=1-y*y;return {z,y,derivative,gradient:p.w*derivative};}
export function poisson(p,x=0,y=0){const u=p.A*(1-x*x)*(1-y*y);return {u,source:-2*p.A*(2-x*x-y*y),Ex:2*p.A*x*(1-y*y),Ey:2*p.A*y*(1-x*x)};}
export function conduction(p,x=0){const q=p.k*(p.hot-p.cold)/p.L;return {flux:q,power:q*p.area,resistance:p.L/(p.k*p.area),T:p.hot+(p.cold-p.hot)*x/p.L};}
export function vortex(p,x=0,y=0){const d=Math.exp(-2*p.nu*p.t),u=p.U*Math.sin(x)*Math.cos(y)*d,v=-p.U*Math.cos(x)*Math.sin(y)*d,pressure=p.U*p.U/4*(Math.cos(2*x)+Math.cos(2*y))*d*d,omega=2*p.U*Math.sin(x)*Math.sin(y)*d;return {u,v,pressure,omega,decay:d,energy:p.U*p.U/4*d*d};}
export function heat(p,x=0,t=p.t){const k=Math.PI/p.L,first=p.A*Math.sin(k*x)*Math.exp(-p.alpha*k*k*t),third=p.B*Math.sin(3*k*x)*Math.exp(-9*p.alpha*k*k*t);return {T:p.base+first+third,first,third,tau:1/(p.alpha*k*k)};}
