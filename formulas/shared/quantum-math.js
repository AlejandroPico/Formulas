export const HBAR=1.054571817e-34,H=6.62607015e-34,ME=9.1093837139e-31,EV=1.602176634e-19;
export const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
export const binaryEntropy=p=>p<=0||p>=1?0:-p*Math.log2(p)-(1-p)*Math.log2(1-p);
export const polar=(theta,phi=0,r=1)=>{const t=theta*Math.PI/180,f=phi*Math.PI/180;return [r*Math.sin(t)*Math.cos(f),r*Math.sin(t)*Math.sin(f),r*Math.cos(t)];};
export function hermite(n,x){let a=1,b=2*x;if(n===0)return a;for(let k=2;k<=n;k++){const c=2*x*b-2*(k-1)*a;a=b;b=c;}return b;}
export const factorial=n=>{let x=1;for(let i=2;i<=n;i++)x*=i;return x;};
export const oscillator=(n,x,omega=1)=>Math.pow(omega/Math.PI,.25)*hermite(n,Math.sqrt(omega)*x)*Math.exp(-omega*x*x/2)/Math.sqrt(2**n*factorial(n));
export const radial=(state,r)=>state===0?4*r*r*Math.exp(-2*r):state===1?r*r*(2-r)**2*Math.exp(-r)/8:r**4*Math.exp(-r)/24;
export const well=(n,x,L)=>x<0||x>L?0:Math.sqrt(2/L)*Math.sin(n*Math.PI*x/L);
export function wave(p,box=false){const n=p.n||1,L=p.L||1,weight=p.mix??p.p??.5,phase=p.phase*Math.PI/180,time=p.t??0,k1=box?n*Math.PI/L:1,k2=box?(n+1)*Math.PI/L:2,E1=k1*k1/2,E2=k2*k2/2,a=Math.sqrt(1-weight),b=Math.sqrt(weight),u=x=>box?well(n,x,L):1/Math.sqrt(2*Math.PI),v=x=>box?well(n+1,x,L):1/Math.sqrt(2*Math.PI);
 const amplitude=x=>{const t1=(box?0:k1*x)-E1*time,t2=(box?0:k2*x)-E2*time+phase;return [a*u(x)*Math.cos(t1)+b*v(x)*Math.cos(t2),a*u(x)*Math.sin(t1)+b*v(x)*Math.sin(t2)];};
 return {amplitude,density:x=>{const z=amplitude(x);return z[0]*z[0]+z[1]*z[1];},energy:(1-weight)*E1+weight*E2,E1,E2,prob:[1-weight,weight]};
}
export function model(id,p){switch(id){
 case 'bose-einstein-distribution':{const x=(p.energy-p.mu)/p.T,n=1/Math.expm1(x);return {value:n,n,boltzmann:Math.exp(-x),occupation:e=>1/Math.expm1((e-p.mu)/p.T)};}
 case 'fermi-dirac-distribution':{const n=1/(Math.exp((p.energy-p.mu)/p.T)+1);return {value:n,n,occupation:e=>1/(Math.exp((e-p.mu)/p.T)+1)};}
 case 'de-broglie-relation':{const momentum=Math.sqrt(2*ME*p.K*EV),lambda=H/momentum*1e9;return {value:lambda,lambda,momentum,v:momentum/ME};}
 case 'quantum-commutator':{const c=2*Math.sin(p.angle*Math.PI/180);return {value:c,coefficient:c,norm:Math.abs(c),AB:[Math.cos(p.angle*Math.PI/180),c/2],BA:[Math.cos(p.angle*Math.PI/180),-c/2]};}
 case 'creation-annihilation-operators':{const next=p.n+(p.raise?1:-1),amplitude=Math.sqrt(p.n+(p.raise?1:0));return {value:amplitude,amplitude,next:next<0?null:next,density:x=>next<0?0:oscillator(next,x)**2};}
 case 'quantum-harmonic-oscillator':return {value:p.omega*(p.n+.5),energy:p.omega*(p.n+.5),density:x=>oscillator(p.n,x,p.omega)**2,turning:Math.sqrt(2*(p.n+.5)/p.omega)};
 case 'canonical-commutation-relation':return {value:p.n===7?-7:1,diagonal:[1,1,1,1,1,1,1,-7],number:p.n,boundary:p.n===7};
 case 'hydrogen-radial-probability-density':{const density=r=>p.Z*radial(p.state,p.Z*r);return {value:density(p.r),density,mean:(p.state===0?1.5:p.state===1?6:5)/p.Z,node:p.state===1?2/p.Z:null};}
 case 'klein-gordon-equation':{const omega=Math.hypot(p.k,p.mass),disp=k=>Math.hypot(k,p.mass),d=.15;return {value:omega,omega,group:p.k/omega,phase:omega/p.k,field:x=>(Math.cos((p.k-d)*x-disp(p.k-d)*p.t)+Math.cos((p.k+d)*x-disp(p.k+d)*p.t))/Math.sqrt(2)};}
 case 'schrodinger-equation':{const q=wave(p);return {...q,value:q.energy};}
 case 'time-independent-schrodinger-equation':return {value:p.n*p.n/(p.L*p.L),energy:p.n*p.n*Math.PI**2/(2*p.L*p.L),density:x=>well(p.n,x,p.L)**2,psi:x=>well(p.n,x,p.L),n:p.n};
 case 'infinite-potential-well':{const q=wave(p,true);return {...q,value:q.energy/(Math.PI**2/2)};}
 case 'born-rule':{const r=[2*Math.sqrt(p.p*(1-p.p))*Math.cos(p.phi*Math.PI/180),2*Math.sqrt(p.p*(1-p.p))*Math.sin(p.phi*Math.PI/180),2*p.p-1],detector=polar(p.detector),prob=(1+dot(r,detector))/2;return {value:100*prob,prob,r,detector};}
 case 'pauli-equation':{const r=polar(p.theta,p.phi-p.omega*p.t*180/Math.PI);return {value:-p.omega*Math.cos(p.theta*Math.PI/180)/2,r,energy:-p.omega*r[2]/2,prob:(1+r[2])/2};}
 case 'von-neumann-equation':{const r=polar(p.theta,p.phi+p.omega*p.t*180/Math.PI,p.radius);return {value:(1+p.radius*p.radius)/2,r,purity:(1+p.radius*p.radius)/2,eigen:[(1+p.radius)/2,(1-p.radius)/2]};}
 case 'pauli-matrices':{const r=polar(p.theta),axis=polar(p.axis),expectation=dot(r,axis);return {value:expectation,r,axis,prob:(1+expectation)/2};}
 case 'density-matrix':{const c=p.coherence*Math.sqrt(p.p*(1-p.p)),r=[2*c*Math.cos(p.phi*Math.PI/180),2*c*Math.sin(p.phi*Math.PI/180),2*p.p-1],length=Math.hypot(...r),eigen=[(1+length)/2,(1-length)/2];return {value:p.p*p.p+(1-p.p)**2+2*c*c,r,c,eigen,entropy:binaryEntropy(eigen[0]),purity:(1+length*length)/2};}
 case 'heisenberg-uncertainty-principle':{const dp=Math.sqrt(1+4*p.chirp*p.chirp)/(2*p.sigma);return {value:dp,dp,product:p.sigma*dp,covariance:p.chirp,density:x=>Math.exp(-x*x/(2*p.sigma*p.sigma))/(Math.sqrt(2*Math.PI)*p.sigma),momentum:k=>Math.exp(-k*k/(2*dp*dp))/(Math.sqrt(2*Math.PI)*dp)};}
 case 'dirac-equation':{const E=Math.hypot(p.momentum,p.mass),r=[p.momentum/E,0,p.mass/E];return {value:E,E,r,group:p.momentum/E,spinor:[Math.sqrt((E+p.mass)/(2*E)),Math.sign(p.momentum)*Math.sqrt((E-p.mass)/(2*E))]};}
 case 'von-neumann-entanglement-entropy':return {value:binaryEntropy(p.p),entropy:binaryEntropy(p.p),prob:[p.p,0,0,1-p.p],purity:p.p*p.p+(1-p.p)**2,concurrence:2*Math.sqrt(p.p*(1-p.p))};
 case 'spin-half-bloch-sphere':{const r=polar(p.theta,p.phi),detector=polar(p.detector),prob=(1+dot(r,detector))/2;return {value:100*prob,r,detector,prob};}
 case 'mixed-state-bloch-sphere':{const r=polar(p.theta,p.phi,p.radius),eigen=[(1+p.radius)/2,(1-p.radius)/2];return {value:(1+p.radius*p.radius)/2,r,eigen,entropy:binaryEntropy(eigen[0])};}
 case 'quantum-fidelity':{const r=[0,0,p.a],s=polar(p.angle,0,p.b),F=(1+dot(r,s)+Math.sqrt(Math.max(0,(1-p.a*p.a)*(1-p.b*p.b))))/2;return {value:F,F,r,s};}
 case 'path-integral':{const s1=Math.PI*(p.x-p.spacing/2)**2/(p.lambda*p.distance),s2=Math.PI*(p.x+p.spacing/2)**2/(p.lambda*p.distance),real=Math.cos(s1)+p.ratio*Math.cos(s2),imag=Math.sin(s1)+p.ratio*Math.sin(s2),intensity=(real*real+imag*imag)/(1+p.ratio)**2;return {value:intensity,intensity,s1,s2,real,imag,fringe:p.lambda*p.distance/p.spacing};}
 default:throw new Error('Quantum model '+id);
}}
