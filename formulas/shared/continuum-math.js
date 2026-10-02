// Modelos exactos de cada laboratorio. Los controles indican las conversiones.
export const FARADAY=96485.33212, EPSILON=8.8541878128e-12;
export const sigmoid=x=>x>=0?1/(1+Math.exp(-x)):Math.exp(x)/(1+Math.exp(x));
export const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
export const norm=a=>Math.hypot(...a);
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const axial=p=>({area:Math.PI*p.d**2/4,stress:p.F*1000/(Math.PI*p.d**2/4),strain:p.F*1000/(Math.PI*p.d**2/4)/(p.E*1000)});
export const signal=(p,t)=>p.a*Math.cos(2*Math.PI*p.f*t)+p.b*Math.cos(2*Math.PI*3*t+p.phi);
export function spectrum(p,N=64){const values=Array.from({length:N},(_,j)=>signal(p,j/N));return Array.from({length:N/2+1},(_,k)=>{let re=0,im=0;values.forEach((x,j)=>{re+=x*Math.cos(2*Math.PI*k*j/N);im-=x*Math.sin(2*Math.PI*k*j/N);});return {k,re:re/N,im:im/N,amplitude:Math.hypot(re,im)/N*(k===0||k===N/2?1:2),phase:Math.atan2(im,re)};});}
export const carnot=p=>({valid:p.cold<=p.hot,eta:1-p.cold/p.hot,work:p.Q*(1-p.cold/p.hot),reject:p.Q*p.cold/p.hot,entropy:p.cold<=p.hot?0:null});
export function growth(p,gompertz=false,t=p.t){const N=p.N0===0?0:gompertz?p.K*Math.exp(Math.log(p.N0/p.K)*Math.exp(-p.r*t)):p.K/(1+(p.K/p.N0-1)*Math.exp(-p.r*t));return {N,rate:gompertz?(N===0?0:p.r*N*Math.log(p.K/N)):p.r*N*(1-N/p.K)};}
export const ohm=p=>({I:p.V/p.R,P:p.V**2/p.R});
export const green=p=>({area:p.a*p.b,curl:p.omega,circulation:p.omega*p.a*p.b});
export const kinetic=p=>({energy:.5*p.m*p.v**2,momentum:p.m*p.v});
export function inductor(p,t=p.t){const L=p.L/1000,tau=L/p.R,I=p.kind==='release'?p.V/p.R*Math.exp(-t/1000/tau):p.V/p.R*(-Math.expm1(-t/1000/tau));return {L,tau,I,energy:.5*L*I**2,emf:p.kind==='release'?p.R*I:p.V-p.R*I};}
export function cauchy(p){const distance=Math.hypot(p.zx,p.zy);if(Math.abs(distance-p.R)<1e-9)return {kind:'singular',integral:null};const inside=distance<p.R,re=p.zx**2-p.zy**2+p.c,im=2*p.zx*p.zy;return {kind:inside?'interior':'exterior',value:[re,im],integral:inside?[-2*Math.PI*im,2*Math.PI*re]:[0,0]};}
export function induction(p,t=p.t){const a=p.angle*Math.PI/180+p.omega*t,B=p.B+p.rate*t,area=Math.PI*(p.radius/100)**2;return {area,angle:a,B,flux:p.turns*B*area*Math.cos(a),emf:-p.turns*area*(p.rate*Math.cos(a)-B*p.omega*Math.sin(a))};}
export const transformer=p=>({ratio:p.Ns/p.Np,Vs:p.V*p.Ns/p.Np,Is:p.I*p.Np/p.Ns,power:p.V*p.I});
export const divergence=p=>({div:p.ax+p.ay+p.az,volume:p.size**3,flux:(p.ax+p.ay+p.az)*p.size**3,faces:[p.ax,p.ax,p.ay,p.ay,p.az,p.az].map(a=>a*p.size**3/2)});
export function hamilton(p,t=p.t){const omega=Math.sqrt(p.k/p.m),q=p.q0*Math.cos(omega*t)+p.p0/(p.m*omega)*Math.sin(omega*t),momentum=p.p0*Math.cos(omega*t)-p.m*omega*p.q0*Math.sin(omega*t);return {omega,q,p:momentum,H:momentum**2/(2*p.m)+p.k*q*q/2};}
export const gas=p=>({P:p.n*8.314462618*p.T/p.V,PV:p.n*8.314462618*p.T}); // kPa · L = J
export const electrolysis=p=>({Q:p.I*p.t*60,mass:p.eff/100*p.I*p.t*60*p.M/(p.z*FARADAY)});
export function quantum(p,x=p.L/2,t=p.t){const E=n=>Math.PI**2*n*n/(2*p.L**2),psi=n=>Math.sqrt(2/p.L)*Math.sin(n*Math.PI*x/p.L),mix=p.mix/100,a=Math.sqrt(1-mix)*psi(p.n),b=Math.sqrt(mix)*psi(p.n+1),delta=(E(p.n+1)-E(p.n))*t;return {E:E(p.n),mean:(1-mix)*E(p.n)+mix*E(p.n+1),density:a*a+b*b+2*a*b*Math.cos(delta),real:a*Math.cos(E(p.n)*t)+b*Math.cos(E(p.n+1)*t),imag:-a*Math.sin(E(p.n)*t)-b*Math.sin(E(p.n+1)*t)};}
export const electricGauss=p=>({boundary:Math.abs(Math.abs(p.x)-p.R)<1e-9,inside:Math.abs(p.x)<p.R,flux:Math.abs(p.x)<p.R?p.q*1e-9/EPSILON:0});
export const sturm=p=>({lambda:(p.n*Math.PI/p.L)**2,mode:x=>Math.sqrt(2/p.L)*Math.sin(p.n*Math.PI*x/p.L),nodes:p.n-1});
export function pipe(p,y=0){const R=p.R/1000,mu=p.mu/1000,G=p.pressure/p.L,Q=Math.PI*G*R**4/(8*mu),mean=Q/(Math.PI*R**2);return {R,mu,Q,flow:Q*1e6,mean,max:2*mean,velocity:G*(R*R-y*y)/(4*mu),Re:1000*Math.abs(mean)*2*R/mu};}
export const scalar=p=>{const a=[p.ax,p.ay,p.az],b=[p.bx,p.by,p.bz],ab=dot(a,b),den=norm(a)*norm(b);return {a,b,value:ab,angle:den?Math.acos(Math.max(-1,Math.min(1,ab/den)))*180/Math.PI:null,projection:norm(a)?ab/norm(a):null};};
export const bridge=p=>({left:p.V*p.R2/(p.R1+p.R2),right:p.V*p.Rx/(p.R3+p.Rx),voltage:p.V*(p.R2/(p.R1+p.R2)-p.Rx/(p.R3+p.Rx)),balanced:p.R2*p.R3/p.R1});
export const activation=p=>({value:sigmoid(p.x),derivative:sigmoid(p.x)*(1-sigmoid(p.x))});
export const DATA=[[-2,0],[-1,0],[0,1],[1,0],[2,1]];
export function regression(p){const probability=x=>sigmoid(p.w*x+p.b),z=p.w*p.x+p.b;const loss=DATA.reduce((s,[x,y])=>{const z=p.w*x+p.b;return s+Math.max(z,0)-y*z+Math.log1p(Math.exp(-Math.abs(z)));},0)/DATA.length;return {probability,p:probability(p.x),z,loss,prediction:probability(p.x)>=p.threshold/100?1:0};}
export function circuit(p){const parallel=1/(1/p.R1+1/p.R2),I=p.V/(p.Rs+parallel),U=I*parallel;return {parallel,I,U,I1:U/p.R1,I2:U/p.R2,residual:I-U/p.R1-U/p.R2};}
export function channel(p,y=p.H/2){const velocity=p.wall*y/p.H+p.G*y*(p.H-y)/(2*p.mu);return {velocity,mean:p.wall/2+p.G*p.H**2/(12*p.mu),shear:p.mu*p.wall/p.H+p.G*(p.H-2*y)/2,viscous:-p.G};}
export function mechanical(p){const total=.5*p.m*p.v0**2+p.m*9.81*p.h0,potential=p.m*9.81*p.h,kinetic=total-potential;return {total,potential,kinetic,reachable:kinetic>=-1e-9,speed:kinetic>=-1e-9?Math.sqrt(Math.max(0,2*kinetic/p.m)):null,maxHeight:total/(p.m*9.81)};}
export function descent(p,n=p.steps){const x=p.x0*(1-p.eta*p.a)**n,y=p.y0*(1-p.eta*p.b)**n;return {x,y,loss:.5*(p.a*x*x+p.b*y*y),stable:p.eta>0&&p.eta<2/Math.max(p.a,p.b),limit:2/Math.max(p.a,p.b)};}
export function helix(p,t=p.t){const c=Math.cos(t),s=Math.sin(t),den=Math.hypot(p.R,p.b),r=[p.R*c,p.R*s,p.b*t],T=[-p.R*s/den,p.R*c/den,p.b/den],N=[-c,-s,0],B=cross(T,N);return {r,T,N,B,kappa:p.R/(p.R**2+p.b**2),tau:p.b/(p.R**2+p.b**2),radius:(p.R**2+p.b**2)/p.R};}
export const kinetics=(p,second=false,t=p.t)=>{const concentration=second?p.A0/(1+p.k*p.A0*t):p.A0*Math.exp(-p.k*t);return {concentration,rate:p.k*concentration**(second?2:1),half:p.k===0?Infinity:second?1/(p.k*p.A0):Math.LN2/p.k};};
