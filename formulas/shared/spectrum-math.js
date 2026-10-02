// SI constants; display conversions are explicit in each laboratory.
export const R=8.31446261815324,F=96485.33212,C=299792458,K=1.380649e-23,H=6.62607015e-34,NA=6.02214076e23,SIGMA=5.670374419e-8;
export const rad=a=>a*Math.PI/180;
export const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const norm=a=>Math.hypot(...a);
export const mul=(A,x)=>A.map(row=>dot(row,x));
export function eigen(a,b,d){const mid=(a+d)/2,gap=Math.hypot((a-d)/2,b),theta=.5*Math.atan2(2*b,a-d),c=Math.cos(theta),s=Math.sin(theta);return {values:[mid+gap,mid-gap],vectors:[[c,s],[-s,c]],theta};}
export function svd(p){const A=[[p.a,p.b],[p.c,p.d]],q=eigen(p.a*p.a+p.c*p.c,p.a*p.b+p.c*p.d,p.b*p.b+p.d*p.d),s=q.values.map(x=>Math.sqrt(Math.max(0,x))),V=q.vectors,U=V.map((x,i)=>s[i]>1e-12?mul(A,x).map(y=>y/s[i]):null);if(!U[0])U[0]=[1,0];if(!U[1])U[1]=[-U[0][1],U[0][0]];const rank1=U[0].map(x=>V[0].map(y=>s[0]*x*y)),reconstruction=A.map((row,i)=>row.map((_,j)=>s.reduce((z,v,k)=>z+v*U[k][i]*V[k][j],0)));return {A,U,V,s,rank1,reconstruction,error:s[1]};}
export const comb=(n,k)=>{let x=1;for(let j=1;j<=Math.min(k,n-k);j++)x=x*(n-j+1)/j;return x;};
export function stats(p){const x=[-2,-1,0,1,2],noise=[1,-2,0,2,-1],y=x.map((x,i)=>p.slope*x+p.noise*noise[i]+p.offset),mx=0,my=p.offset,cov=dot(x,y)/5,vx=dot(x,x)/5,vy=y.reduce((s,z)=>s+(z-my)**2,0)/5;return {x,y,mx,my,cov,vx,vy,r:vy>1e-14?cov/Math.sqrt(vx*vy):null};}
export function normalCDF(z){if(z===0)return .5;const x=Math.abs(z)/Math.sqrt(2),t=1/(1+.3275911*x),erf=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return .5*(1+Math.sign(z)*erf);}
export function radiation(T,lambda){const l=lambda*1e-6,x=H*C/(l*K*T);return x>700?0:2*H*C*C/(l**5*Math.expm1(x))*1e-6;}// per micrometre, W/(m² sr µm)
export function helix(p,t=p.t){const u=.3*t,c=Math.cos(u),s=Math.sin(u),l=Math.hypot(p.radius,p.pitch),T=[-p.radius*s/l,p.radius*c/l,p.pitch/l],N=[-c,-s,0],B=cross(T,N),k=p.radius/l**2,tau=p.pitch/l**2;return {r:[p.radius*c,p.radius*s,p.pitch*u],T,N,B,k,tau,dT:N.map(x=>k*x),dN:T.map((x,i)=>-k*x+tau*B[i]),dB:N.map(x=>-tau*x)};}
export function lorentz(p,t=p.t){const qm=p.q/p.m,o=qm*p.B,v=p.v;let x,y,vx,vy;if(Math.abs(o)<1e-12){vx=v+qm*p.E*t;vy=0;x=v*t+.5*qm*p.E*t*t;y=0;}else{const drift=p.E/p.B,a=o*t;vx=v*Math.cos(a)+drift*Math.sin(a);vy=-drift+drift*Math.cos(a)-v*Math.sin(a);x=v*Math.sin(a)/o+drift*(1-Math.cos(a))/o;y=-drift*t+drift*Math.sin(a)/o+v*(Math.cos(a)-1)/o;}return {x,y,vx,vy,Fx:p.q*(p.E+vy*p.B),Fy:-p.q*vx*p.B,speed:Math.hypot(vx,vy),energy:.5*p.m*(vx*vx+vy*vy),radius:o?Math.abs(v/o):null};}// q µC, m mg: q/m has SI numerical value; force µN, energy µJ
export function model(id,p){
 switch(id){
 case 'clausius-clapeyron-equation':{const P=101.325*Math.exp(-p.L*1000/R*(1/p.T-1/373.15));return {value:P,pressure:P,slope:P*p.L*1000/(R*p.T*p.T)};}
 case 'frenet-serret-formulas':{const q=helix(p);return {...q,value:q.k};}
 case 'first-law-thermodynamics':return {value:p.Q-p.W,U:p.Q-p.W,temperature:300+(p.Q-p.W)/(2.5*R)};
 case 'shear-stress-cizalladura':return {value:p.force*1000/p.area,stress:p.force*1000/p.area,gamma:p.force/(p.area*p.G)};
 case 'cauchy-riemann':return {value:2*p.alpha,residual:2*p.alpha,u:p.x*p.x-p.y*p.y+p.alpha*p.x,v:2*p.x*p.y-p.alpha*p.y,ux:2*p.x+p.alpha,vy:2*p.x-p.alpha,uy:-2*p.y,vx:2*p.y};
 case 'stokes-drag-law':{const force=6*Math.PI*p.mu*1e-3*p.radius*1e-3*p.speed*1e-3;return {value:force*1e6,force:force*1e6,Re:2*p.radius*p.speed/p.mu};}
 case 'beer-lambert-law':{const A=p.epsilon*p.concentration*1e-3*p.length;return {value:A,A,T:10**(-A),transmission:100*10**(-A)};}
 case 'geodesic-equation':{const theta=.15*p.t,a=rad(p.angle);return {value:p.radius*theta,length:p.radius*theta,theta,r:[p.radius*Math.cos(theta),p.radius*Math.sin(theta)*Math.cos(a),p.radius*Math.sin(theta)*Math.sin(a)]};}
 case 'riemannian-metric':{const a=rad(p.angle),c=Math.cos(a),s=Math.sin(a),g11=p.a*c*c+p.b*s*s,g22=p.a*s*s+p.b*c*c,g12=(p.a-p.b)*c*s,length=Math.sqrt(g11*p.dx*p.dx+2*g12*p.dx*p.dy+g22*p.dy*p.dy);return {value:length,length,g11,g22,g12};}
 case 'stokes-theorem':{const flux=p.omega*Math.PI*p.radius**2*Math.cos(rad(p.tilt));return {value:flux,flux};}
 case 'advection-diffusion-equation':{const variance=p.width**2+2*p.D*p.t,center=p.speed*p.t,density=x=>Math.exp(-((x-center)**2)/(2*variance))/Math.sqrt(2*Math.PI*variance);return {value:Math.sqrt(variance),variance,width:Math.sqrt(variance),center,density};}
 case 'darcy-weisbach-pipe-head-loss':{const Re=1000*p.speed*(p.diameter/1000)/.001,friction=p.mode==='auto'?(Re===0?0:Re<2300?64/Re:.25/Math.log10(p.rough/(3.7*p.diameter)+5.74/Re**.9)**2):p.friction,head=friction*p.length/(p.diameter/1000)*p.speed**2/(2*9.81);return {value:head,head,Re,friction,pressure:1000*9.81*head/1000,transition:Re>=2300&&Re<=4000};}
 case 'cayley-hamilton-theorem':{const A=[[p.a,p.b],[p.c,p.d]],trace=p.a+p.d,det=p.a*p.d-p.b*p.c,square=A.map(row=>[row[0]*p.a+row[1]*p.c,row[0]*p.b+row[1]*p.d]),residual=square.map((row,i)=>row.map((v,j)=>v-trace*A[i][j]+(i===j?det:0)));return {value:det,A,trace,det,square,residual};}
 case 'riemann-zeta-function':{let sum=0,product=1;for(let n=1;n<=p.N;n++)sum+=n**(-p.s);for(let n=2;n<=p.N;n++){let prime=true;for(let k=2;k*k<=n;k++)if(n%k===0){prime=false;break;}if(prime)product/=1-n**(-p.s);}return {value:sum,sum,product,bound:p.N**(1-p.s)/(p.s-1),lower:(p.N+1)**(1-p.s)/(p.s-1)};}
 case 'maxwell-boltzmann-speed-distribution':{const mass=p.mass/(1000*NA),scale=Math.sqrt(K*p.T/mass),density=v=>Math.sqrt(2/Math.PI)*v*v/scale**3*Math.exp(-v*v/(2*scale*scale));return {value:Math.sqrt(2)*scale,peak:Math.sqrt(2)*scale,mean:Math.sqrt(8/Math.PI)*scale,rms:Math.sqrt(3)*scale,density};}
 case 'ampere-maxwell-law':{const fraction=Math.min(1,(p.r/p.radius)**2),B=2e-7*p.I*fraction/(p.r*.01);return {value:B*1e6,B:B*1e6,displacement:p.I*fraction};}
 case 'chemical-equilibrium-constant-kc':{const eq=p.total*p.K/(1+p.K),A=p.total-p.B;return {value:A>0?p.B/A:null,quotient:A>0?p.B/A:null,A,B:p.B,equilibrium:eq,direction:A>0?(p.B/A<p.K?'directa':p.B/A>p.K?'inversa':'equilibrio'):'inversa'};}
 case 'dynamic-chemical-equilibrium':{const eq=p.total*p.kf/(p.kf+p.kr),B=eq+(p.B0-eq)*Math.exp(-(p.kf+p.kr)*p.t),A=p.total-B;return {value:B,B,A,forward:p.kf*A,reverse:p.kr*B,eq,K:p.kf/p.kr};}
 case 'electromagnetic-wave-equation':case 'maxwell-equations':case 'poynting-vector':{const phase=2*Math.PI*(p.x/p.lambda-p.t/5),E=p.amplitude*Math.cos(phase),B=E/C,instant=E*E/(376.730313668),mean=p.amplitude**2/(2*376.730313668);return {value:id==='poynting-vector'?mean:E,E,B,instant,mean,phase};}
 case 'magnetic-gauss-law':return {value:0,flux:0,top:p.B*p.area,bottom:-p.B*p.area};
 case 'wohler-sn-fatigue-curve':{const N=(p.stress/p.A)**(1/p.b);return {value:Math.log10(N),N,logN:Math.log10(N)};}
 case 'thermodynamic-maxwell-relations':return {value:R/(p.volume*.001),dPdT:R/(p.volume*.001),dSdV:R/(p.volume*.001),P:R*p.T/(p.volume*.001)/1000};
 case 'van-der-waals-equation-of-state':{const b=.04267,a=3.592,V=p.volume,pressure=.0831446261815324*p.T/(V-b)-a/V**2,ideal=.0831446261815324*p.T/V,slope=-.0831446261815324*p.T/(V-b)**2+2*a/V**3;return {value:pressure,pressure,ideal,slope,unstable:slope>0,critical:8*a/(27*.0831446261815324*b)};}
 case 'singular-value-decomposition-svd':{const q=svd(p);return {...q,value:q.s[0]};}
 case 'gibbs-free-energy':return {value:p.enthalpy-p.T*p.entropy/1000,G:p.enthalpy-p.T*p.entropy/1000,critical:p.entropy!==0?1000*p.enthalpy/p.entropy:null};
 case 'gibbs-free-energy-spontaneity':{const standard=p.enthalpy-p.T*p.entropy/1000,G=standard+R*p.T*Math.log(p.quotient)/1000;return {value:G,G,standard,K:Math.exp(-standard*1000/(R*p.T))};}
 case 'boltzmann-entropy':{const W=comb(p.N,p.left);return {value:Math.log(W),W,entropy:Math.log(W)};}
 case 'stefan-boltzmann-law':{const emitted=p.emissivity*p.area*SIGMA*p.T**4,net=p.emissivity*p.area*SIGMA*(p.T**4-p.ambient**4);return {value:net,net,emitted};}
 case 'power-factor-triangle':{const S=p.V*p.I,phi=rad(p.phi);return {value:S*Math.cos(phi),P:S*Math.cos(phi),Q:S*Math.sin(phi),S,pf:Math.cos(phi)};}
 case 'ac-ohms-law-impedance':{const magnitude=Math.hypot(p.R,p.X),I=p.V/magnitude;return {value:I,I,magnitude,angle:Math.atan2(p.X,p.R)*180/Math.PI,P:I*I*p.R,Q:I*I*p.X};}
 case 'mohr-circle-2d-stress-transformation':{const mid=(p.sx+p.sy)/2,r=Math.hypot((p.sx-p.sy)/2,p.tau),t=2*rad(p.angle),sx=mid+(p.sx-p.sy)/2*Math.cos(t)+p.tau*Math.sin(t),tau=-(p.sx-p.sy)/2*Math.sin(t)+p.tau*Math.cos(t);return {value:mid+r,mid,r,first:mid+r,second:mid-r,sx,sy:2*mid-sx,tau};}
 case 'helmholtz-free-energy':return {value:p.U-p.T*p.S/1000,A:p.U-p.T*p.S/1000};
 case 'reynolds-number':{const Re=p.rho*p.speed*(p.diameter/1000)/(p.mu/1000);return {value:Re,Re,regime:Re<2300?'laminar':Re<=4000?'transición':'turbulento'};}
 case 'series-rlc-resonance':case 'complex-ac-impedance':{const omega=2*Math.PI*p.f,L=p.L*.001,cap=p.C*1e-6,XL=omega*L,XC=1/(omega*cap),X=XL-XC,magnitude=Math.hypot(p.R,X),I=p.V/magnitude,f0=1/(2*Math.PI*Math.sqrt(L*cap));return {value:id==='series-rlc-resonance'?f0:I,f0,XL,XC,X,magnitude,I,angle:Math.atan2(X,p.R)*180/Math.PI,Q:2*Math.PI*f0*L/p.R,VR:I*p.R,VL:I*XL,VC:I*XC};}
 case 'balanced-three-phase-power':{const angle=rad(p.phi),S=Math.sqrt(3)*p.V*p.I;return {value:S*Math.cos(angle)/1000,P:S*Math.cos(angle)/1000,Q:S*Math.sin(angle)/1000,S:S/1000};}
 case 'neuronal-nernst-reversal-potential':return {value:R*p.T/(Number(p.z)*F)*Math.log(p.out/p.inside)*1000,E:R*p.T/(Number(p.z)*F)*Math.log(p.out/p.inside)*1000};
 case 'arrhenius-equation':{const rate=p.A*Math.exp(-p.Ea*1000/(R*p.T));return {value:rate,rate,log:Math.log(p.A)-p.Ea*1000/(R*p.T)};}
 case 'nernst-equation':return {value:p.standard-R*p.T/(p.n*F)*Math.log(p.quotient),E:p.standard-R*p.T/(p.n*F)*Math.log(p.quotient)};
 case 'manning-open-channel-flow':{const area=p.width*p.depth,wetted=p.width+2*p.depth,Rh=area/wetted,v=Rh**(2/3)*Math.sqrt(p.slope)/p.rough;return {value:area*v,flow:area*v,area,wetted,Rh,v};}
 case 'price-elasticity-of-demand':{const quantity=p.a-p.b*p.price,e=quantity>0?-p.b*p.price/quantity:null;return {value:e,quantity,elasticity:e,revenue:p.price*quantity};}
 case 'linear-supply-demand-equilibrium':{const price=(p.a-p.c)/(p.b+p.d),quantity=p.a-p.b*price;return {value:price,price,quantity,valid:price>=0&&quantity>=0,qd:p.a-p.b*p.price,qs:p.c+p.d*p.price};}
 case 'wiens-displacement-law':return {value:2897.771955/p.T,peak:2897.771955/p.T};
 case 'pearson-correlation':case 'covariance':{const q=stats(p);return {...q,value:id==='covariance'?q.cov:q.r};}
 case 'lorentz-force':{const q=lorentz(p);return {...q,value:Math.hypot(q.Fx,q.Fy)};}
 case 'lienard-wiechert-potentials':{const beta=p.beta,den=Math.sqrt(p.x*p.x+(1-beta*beta)*p.y*p.y);if(den<1e-12)return {value:null,singular:true};const delay=(beta*p.x+den)/(1-beta*beta),source=-beta*delay,kappa=den/delay;return {value:1/den,potential:1/den,delay,source,kappa,distance:delay,singular:false};}
 case 'z-hypothesis-test':{const se=p.sigma/Math.sqrt(p.n),z=(p.mean-p.nullMean)/se,probability=2*normalCDF(-Math.abs(z));return {value:z,z,se,p:probability,reject:probability<p.alpha/100};}
 case 'spectral-decomposition':{const q=eigen(p.a,p.b,p.d);return {...q,value:q.values[0],A:[[p.a,p.b],[p.b,p.d]]};}
 case 'planck-law':return {value:radiation(p.T,p.lambda),radiance:radiation(p.T,p.lambda),peak:2897.771955/p.T,photon:H*C/(p.lambda*1e-6)};
 default:throw new Error(`Missing model: ${id}`);
 }
}
