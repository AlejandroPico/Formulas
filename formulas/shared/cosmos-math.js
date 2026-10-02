export const G=6.67430e-11,MPC=3.085677581491367e22,YEAR=31557600,C=299792.458;
export function expansion(p){
 const om=p.matter,ol=p.vacuum,ok=1-om-ol,H=p.H0*1000/MPC*YEAR*1e9;
 const rate=a=>H*Math.sqrt(Math.max(0,om/a+ok+ol*a*a));
 let a=1,t=0,turnaround=false,points=[[0,1]],step=.025;
 // Future expanding branch. A recollapse boundary is a stopping event.
 while(t<p.t-1e-12){const dt=Math.min(step,p.t-t),k1=rate(a),k2=rate(a+k1*dt/2),k3=rate(a+k2*dt/2),k4=rate(a+k3*dt),b=a+dt*(k1+2*k2+2*k3+k4)/6;
  if(om/b+ok+ol*b*b<=1e-10){turnaround=true;break;}a=b;t+=dt;points.push([t,a]);
 }
 const E2=om/a**3+ok/a**2+ol;
 return {a,time:t,points,turnaround,H:p.H0*Math.sqrt(Math.max(0,E2)),q:E2>1e-12?(.5*om/a**3-ol)/E2:null,curvature:ok};
}
export function model(id,p){switch(id){
 case 'cosmological-equation-of-state':{const ratio=p.a**(-3*(1+p.w));return {value:ratio,ratio,pressure:p.w*ratio,accelerationFactor:1+3*p.w};}
 case 'friedmann-equations':{const r=expansion(p);return {...r,value:r.H};}
 case 'critical-density-parameter':{const critical=3*(p.H0*1000/MPC)**2/(8*Math.PI*G),omega=p.density*1e-26/critical;return {value:omega,omega,critical};}
 case 'cosmological-redshift':{const z=p.now/p.emit-1,lambda=p.lambda*p.now/p.emit;return {value:lambda,z,lambda,scale:p.now/p.emit};}
 case 'hubble-law':{const velocity=p.H0*p.distance;return {value:velocity,velocity,ratio:velocity/C,time:MPC/(p.H0*1000)/YEAR/1e9};}
 default:throw new Error(id);
}}
