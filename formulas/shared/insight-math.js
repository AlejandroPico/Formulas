// Explicit SI constants; the relativistic laboratory uses ct in length units.
export const C=299792458,G=6.67430e-11,R=8.31446261815324,KB=8.617333262145e-5,A0=.0529177210544,MSUN=1.98847e30,GYR=31557600e9,MPC=3.085677581491367e22;
export const gamma=b=>1/Math.sqrt(1-b*b);
export const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
export const mul=(A,v)=>A.map(r=>dot(r,v));
export const norm=v=>Math.hypot(...v);
export function boost(x,ct,b){const g=gamma(b);return {x:g*(x-b*ct),ct:g*(ct-b*x)};}
export function eigen2(p){const A=[[p.a,p.b],[p.c,p.d]],tr=p.a+p.d,det=p.a*p.d-p.b*p.c,D=tr*tr-4*det;
 if(D< -1e-12)return {A,values:[],vectors:[],complex:true,real:tr/2,imag:Math.sqrt(-D)/2,det,value:tr/2};
 const values=[(tr+Math.sqrt(Math.max(0,D)))/2,(tr-Math.sqrt(Math.max(0,D)))/2];
 const vectors=values.map(l=>{let v=Math.hypot(p.b,l-p.a)>=Math.hypot(l-p.d,p.c)?[p.b,l-p.a]:[l-p.d,p.c];if(norm(v)<1e-12)v=[1,0];return v.map(x=>x/norm(v));});
 const scalar=Math.abs(p.b)+Math.abs(p.c)+Math.abs(p.a-p.d)<1e-12;if(scalar)vectors[1]=[0,1];
 return {A,values,vectors,complex:false,defective:!scalar&&Math.abs(D)<1e-12,det,value:values[0]};
}
export function jacobi3(matrix){const A=matrix.map(r=>r.slice()),V=[[1,0,0],[0,1,0],[0,0,1]];
 for(let k=0;k<40;k++){let i=0,j=1;for(const[a,b]of[[0,2],[1,2]])if(Math.abs(A[a][b])>Math.abs(A[i][j]))[i,j]=[a,b];if(Math.abs(A[i][j])<1e-12)break;
  const angle=.5*Math.atan2(2*A[i][j],A[j][j]-A[i][i]),c=Math.cos(angle),s=Math.sin(angle),ai=A[i][i],aj=A[j][j],b=A[i][j];
  A[i][i]=c*c*ai-2*c*s*b+s*s*aj;A[j][j]=s*s*ai+2*c*s*b+c*c*aj;A[i][j]=A[j][i]=0;
  for(let r=0;r<3;r++){if(r!==i&&r!==j){const x=A[r][i],y=A[r][j];A[r][i]=A[i][r]=c*x-s*y;A[r][j]=A[j][r]=s*x+c*y;}const x=V[r][i],y=V[r][j];V[r][i]=c*x-s*y;V[r][j]=s*x+c*y;}
 }
 const order=[0,1,2].sort((i,j)=>A[j][j]-A[i][i]);return {values:order.map(i=>A[i][i]),vectors:order.map(i=>V.map(r=>r[i]))};
}
export function pca(p){const a=p.angle*Math.PI/180,b=.55,rotate=([x,y,z])=>{const X=Math.cos(b)*x+Math.sin(b)*z,Z=-Math.sin(b)*x+Math.cos(b)*z;return [Math.cos(a)*X-Math.sin(a)*y,Math.sin(a)*X+Math.cos(a)*y,Z];},points=[];
 for(const x of[-1,1])for(const y of[-1,1])for(const z of[-1,1])points.push(rotate([x*p.sx,y*p.sy,z*p.sz]));
 const cov=[0,1,2].map(i=>[0,1,2].map(j=>points.reduce((s,v)=>s+v[i]*v[j],0)/7)),q=jacobi3(cov),total=q.values.reduce((s,x)=>s+x,0),scores=points.map(v=>dot(v,q.vectors[0])),projected=scores.map(s=>q.vectors[0].map(x=>x*s));
 return {...q,points,cov,scores,projected,total,retained:100*q.values[0]/total,error:q.values[1]+q.values[2],value:100*q.values[0]/total};
}
const lc=[.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
export function logGamma(z){if(z<.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);z--;let x=lc[0];for(let i=1;i<lc.length;i++)x+=lc[i]/(z+i);const t=z+7.5;return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x);}
function betaFraction(a,b,x){const tiny=1e-300;let c=1,d=1-(a+b)*x/(a+1);if(Math.abs(d)<tiny)d=tiny;d=1/d;let h=d;
 for(let m=1;m<=200;m++){let aa=m*(b-m)*x/((a+2*m-1)*(a+2*m));for(const term of [aa,-(a+m)*(a+b+m)*x/((a+2*m)*(a+2*m+1))]){d=1+term*d;if(Math.abs(d)<tiny)d=tiny;c=1+term/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;const delta=d*c;h*=delta;if(term!==aa&&Math.abs(delta-1)<3e-14)return h;}}return h;
}
export function betaI(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const scale=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log1p(-x));return x<(a+1)/(a+b+2)?scale*betaFraction(a,b,x)/a:1-scale*betaFraction(b,a,1-x)/b;}
export function studentCDF(t,df){const h=.5*betaI(df/(df+t*t),df/2,.5);return t>=0?1-h:h;}
export function studentQuantile(prob,df){if(prob===.5)return 0;if(prob<.5)return -studentQuantile(1-prob,df);let lo=0,hi=1;while(studentCDF(hi,df)<prob)hi*=2;for(let k=0;k<60;k++){const mid=(lo+hi)/2;if(studentCDF(mid,df)<prob)lo=mid;else hi=mid;}return (lo+hi)/2;}
export const studentDensity=(t,df)=>Math.exp(logGamma((df+1)/2)-logGamma(df/2))/Math.sqrt(df*Math.PI)*(1+t*t/df)**(-(df+1)/2);
export function canonical(p){const energies=[0,p.gap,2*p.gap],deg=[1,1,p.degeneracy],thermal=KB*1000*p.T,weights=energies.map((e,i)=>deg[i]*Math.exp(-e/thermal)),Z=weights.reduce((a,b)=>a+b,0),prob=weights.map(x=>x/Z),U=dot(prob,energies),variance=dot(prob,energies.map(e=>(e-U)**2)),entropy=prob.reduce((s,x,i)=>x===0?s:s-x*Math.log(x/deg[i]),0);return {energies,deg,prob,Z,U,variance,C:variance/thermal**2,entropy,value:100*(1-prob[0])};}
export function substrate(p,time=p.t){const minutes=time/20;if(p.S===0)return 0;let lo=0,hi=p.S;for(let k=0;k<75;k++){const s=(lo+hi)/2,elapsed=(p.S-s+p.Km*Math.log(p.S/s))/p.Vmax;if(elapsed>minutes)lo=s;else hi=s;}return (lo+hi)/2;}
export function circularDensity(rho,n){if(rho<=0)return 0;return Math.exp((2*n+1)*Math.log(2*n)+2*n*Math.log(rho)-2*n*rho-logGamma(2*n+1));}
// Schwarzschild Binet equation in GM/c² units; phi is the display parameter.
export function orbit(p,relativistic=true,maxPhi=.3*p.t){const h=.006,n=Math.ceil(maxPhi/h);let u=1/p.radius,w=0,phi=0,tau=0,status='exterior';const path=[[p.radius,0,0]];
 const acceleration=x=>1/p.L**2-x+(relativistic?3*x*x:0);
 for(let k=0;k<n;k++){const d=Math.min(h,maxPhi-phi),k1=w,l1=acceleration(u),k2=w+d*l1/2,l2=acceleration(u+d*k1/2),k3=w+d*l2/2,l3=acceleration(u+d*k2/2),k4=w+d*l3,l4=acceleration(u+d*k3),next=u+d*(k1+2*k2+2*k3+k4)/6,nextW=w+d*(l1+2*l2+2*l3+l4)/6;
  if(next>=.5){status='horizonte: integración exterior detenida';break;}if(next<=1/200){status='salida de la ventana r≤200';break;}
  tau+=d/(p.L*((u+next)/2)**2);u=next;w=nextW;phi+=d;path.push([Math.cos(phi)/u,Math.sin(phi)/u,0]);
 }
 const energy=Math.sqrt((1-2/p.radius)*(1+p.L*p.L/p.radius**2)),r=1/u;return {path,r,phi,tau,status,energy,L:p.L,radialDerivative:w,value:energy};
}
export function flrw(p){const w=p.w??0,H0=Math.sqrt(8*Math.PI*G*p.rho*1e-26/3),dt=p.t*GYR,z=1+1.5*(1+w)*H0*dt,a=Math.abs(1+w)<1e-10?Math.exp(H0*dt):z**(2/(3*(1+w))),H=Math.abs(1+w)<1e-10?H0:H0/z,rho=p.rho*1e-26*a**(-3*(1+w)),g00=3*(H/C)**2,gii=w*g00,scalar=(1-3*w)*g00;return {a,H,rho,g00,gii,scalar,source:8*Math.PI*G*rho/C**2,value:a};}
export function model(id,p){switch(id){
 case 'eigenvalues-eigenvectors':return eigen2(p);
 case 'principal-component-analysis-pca':return pca(p);
 case 'canonical-ensemble-partition-function':return canonical(p);
 case 'lorentz-transformations':{const q=boost(p.x,p.ct,p.beta);return {...q,value:q.x,gamma:gamma(p.beta),interval:p.x*p.x-p.ct*p.ct,transformed:q.x*q.x-q.ct*q.ct};}
 case 'relativistic-velocity-addition':{const u=(p.u+p.beta)/(1+p.u*p.beta);return {value:u,u,classical:p.u+p.beta};}
 case 'relativistic-length-contraction':return {value:p.L0/gamma(p.beta),L:p.L0/gamma(p.beta),gamma:gamma(p.beta)};
 case 'relativistic-time-dilation':return {value:p.tau*gamma(p.beta),elapsed:p.tau*gamma(p.beta),proper:p.t/gamma(p.beta),gamma:gamma(p.beta)};
 case 'mass-energy-equivalence':return {value:p.mass*1e-9*C*C/1e6,joules:p.mass*1e-9*C*C};
 case 'energy-momentum-relation':{const E=Math.hypot(p.mass,p.momentum),beta=E===0?null:p.momentum/E;return {value:E,E,kinetic:E-p.mass,beta};}
 case 'relativistic-energy-momentum-relation':{const E=p.mass*gamma(p.beta),momentum=E*p.beta,b=boost(momentum,E,p.boost);return {value:E,E,momentum,transformedE:b.ct,transformedP:b.x,invariant:E*E-momentum*momentum};}
 case 'einstein-model-specific-heat':{const x=p.theta/p.T,e=Math.exp(-x),fraction=x*x*e/(-Math.expm1(-x))**2,n=1/Math.expm1(x);return {value:3*R*fraction,fraction,n,U:3*R*p.theta*n};}
 case 't-hypothesis-test':{const t=(p.mean-p.nullMean)/(p.sd/Math.sqrt(p.n)),df=p.n-1,prob=2*studentCDF(-Math.abs(t),df),critical=studentQuantile(1-p.alpha/200,df);return {value:t,t,df,p:prob,critical,se:p.sd/Math.sqrt(p.n),low:p.mean-critical*p.sd/Math.sqrt(p.n),high:p.mean+critical*p.sd/Math.sqrt(p.n),reject:prob<p.alpha/100};}
 case 'spacetime-interval':{const b=boost(p.x,p.ct,p.beta),s=p.x*p.x-p.ct*p.ct;return {value:s,s,transformed:b.x*b.x-b.ct*b.ct,event:b,type:Math.abs(s)<1e-10?'nulo':s<0?'temporal':'espacial',proper:s<0?Math.sqrt(-s):null};}
 case 'hardy-weinberg-equilibrium':{const q=1-p.p;return {value:100*2*p.p*q,q,frequencies:[p.p*p.p,2*p.p*q,q*q]};}
 case 'potential-of-hydrogen-ph':return {value:-p.loga,pH:-p.loga,activity:10**p.loga};
 case 'ionic-product-of-water':return {value:p.pKw-p.pH,pOH:p.pKw-p.pH,neutral:p.pKw/2,aH:10**(-p.pH),aOH:10**(p.pH-p.pKw),Kw:10**(-p.pKw)};
 case 'hill-dose-response-equation':{const f=p.A===0?0:1/(1+(p.EC50/p.A)**p.n);return {value:p.Emax*f,f,response:p.Emax*f};}
 case 'michaelis-menten-kinetics':{const s=substrate(p);return {value:p.Vmax*p.S/(p.Km+p.S),v:p.Vmax*p.S/(p.Km+p.S),occupancy:p.S/(p.Km+p.S),remaining:s,product:p.S-s,instant:p.Vmax*s/(p.Km+s)};}
 case 'hydrogen-ionization-energy':{const ion=13.6/p.n**2;return {value:ion,ion,energy:-ion,kinetic:p.photon>=ion?p.photon-ion:null,threshold:1239.841984/ion};}
 case 'bohr-radius':{const radius=A0*p.n*p.n/p.Z;return {value:radius,radius,energy:-13.6*p.Z*p.Z/p.n**2,radial:rho=>circularDensity(rho,p.n),mean:radius*(2*p.n+1)/(2*p.n)};}
 case 'geodesic-equation-gr':return orbit(p);
 case 'general-relativity':return flrw({...p,w:0});
 case 'einstein-tensor':{const q=flrw(p);return {...q,value:q.g00*1e52};}
 case 'henderson-hasselbalch-equation':{const acid=p.total/(1+10**p.ratio),base=p.total-acid;return {value:p.pKa+p.ratio,pH:p.pKa+p.ratio,acid,base,ratio:10**p.ratio};}
 case 'schwarzschild-metric-time-dilation':{const factor=Math.sqrt(1-1/p.radius),rs=2*G*p.mass*MSUN/(C*C)/1000;return {value:factor,factor,rs,r:rs*p.radius,proper:p.t*factor,redshift:1/factor-1};}
 case 'schwarzschild-radius':{const rs=2*G*p.mass*MSUN/(C*C)/1000;return {value:rs,rs,ratio:p.radius/rs,outside:p.radius>rs};}
 case 'cosmological-constant':{const lambda=p.lambda*1e-52,H=C*Math.sqrt(lambda/3),a=Math.exp(H*p.t*GYR);return {value:H*MPC/1000,H,a,lambda,rho:lambda*C*C/(8*Math.PI*G),horizon:Math.sqrt(3/lambda)/(C*GYR)};}
 case 'variance':{const x=[-2,-1,0,1,2].map(z=>p.mean+p.scale*z),variance=2*p.scale*p.scale;return {value:variance,x,mean:p.mean,variance,sample:variance*5/4,sd:Math.sqrt(variance)};}
 default:throw new Error(`Modelo desconocido: ${id}`);
}}
