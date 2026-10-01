export const rad=x=>x*Math.PI/180, deg=x=>x*180/Math.PI;
const clamp=x=>Math.max(-1,Math.min(1,x));
export function triangle(a,b,C) {
 if(!(a>0&&b>0&&C>0&&C<180))return {valid:false};
 const c=Math.hypot(a-b,2*Math.sqrt(a*b)*Math.sin(rad(C)/2));
 const A=deg(Math.atan2(a*Math.sin(rad(C)),b-a*Math.cos(rad(C))));
 const B=180-C-A,area=a*b*Math.sin(rad(C))/2;
 return {valid:true,a,b,c,A,B,C,area,R:c/(2*Math.sin(rad(C))),ratio:(a-b)/(a+b)};
}
export function triangleASA(a,A,B) {
 if(!(a>0&&A>0&&B>0&&A+B<180))return {valid:false};
 const C=180-A-B,b=a*Math.sin(rad(B))/Math.sin(rad(A)),c=a*Math.sin(rad(C))/Math.sin(rad(A));
 return {...triangle(a,b,C),A,B,C};
}
export function trianglesSSA(a,b,A) {
 if(!(a>0&&b>0&&A>0&&A<180))return [];
 const s=b*Math.sin(rad(A))/a;if(s>1+1e-12)return [];
 const first=s>=1-1e-12?90:deg(Math.asin(clamp(s))),angles=first===90?[first]:[first,180-first];
 return angles.filter(B=>B>0&&A+B<180-1e-9).map(B=>triangleASA(a,A,B));
}
export function angles(alpha,beta=alpha) {
 const a=rad(alpha),b=rad(beta),s1=Math.sin(a)*Math.cos(b),s2=Math.cos(a)*Math.sin(b),c1=Math.cos(a)*Math.cos(b),c2=-Math.sin(a)*Math.sin(b);
 return {s1,s2,c1,c2,sin:s1+s2,cos:c1+c2,tan:Math.abs(Math.cos(a+b))<1e-10?null:Math.tan(a+b)};
}
export function viete({r,s,a,kind='real'}) {
 const sum=kind==='complex'?2*r:r+s,product=kind==='complex'?r*r+s*s:r*s;
 return {sum,product,b:-a*sum,c:a*product,discriminant:a*a*(sum*sum-4*product),evaluate:x=>a*(x*x-sum*x+product)};
}
export function choose(n,k) {
 if(!Number.isInteger(n)||n<0||!Number.isInteger(k)||k<0||k>n)return 0;
 k=Math.min(k,n-k);let value=1;for(let j=1;j<=k;j++)value=value*(n-j+1)/j;return Math.round(value);
}
export function binomial(a,b,n) {
 if(!Number.isInteger(n)||n<0||n>20)throw new Error('El exponente debe ser un entero entre 0 y 20.');
 const terms=Array.from({length:n+1},(_,k)=>({k,coefficient:choose(n,k),value:choose(n,k)*a**(n-k)*b**k}));
 return {terms,sum:terms.reduce((s,t)=>s+t.value,0),direct:(a+b)**n};
}
export function harmonic({A,m,k,phi=0,t=0}) {
 const omega=Math.sqrt(k/m),phase=omega*t+rad(phi),x=A*Math.cos(phase),v=-A*omega*Math.sin(phase),acc=-omega*omega*x;
 return {omega,T:2*Math.PI/omega,x,v,acc,U:k*x*x/2,K:m*v*v/2,energy:k*A*A/2};
}
export function pendulumPeriod(L,g,amplitude) {
 if(!(L>0&&g>0&&Math.abs(amplitude)<180))throw new Error('Longitud y gravedad positivas; amplitud menor de 180°.');
 let a=1,b=Math.cos(rad(Math.abs(amplitude))/2);
 for(let j=0;j<20&&Math.abs(a-b)>1e-15;j++){const next=(a+b)/2;b=Math.sqrt(a*b);a=next;}
 const small=2*Math.PI*Math.sqrt(L/g),exact=small/a;
 return {small,exact,error:100*(exact/small-1)};
}
const trajectories=new Map(),PENDULUM_STEPS=4096;
export function pendulum({L,g,amplitude,t=0}) {
 const periods=pendulumPeriod(L,g,amplitude),key=`${L}:${g}:${amplitude}`;
 let trace=trajectories.get(key);
 if(!trace){
  const steps=PENDULUM_STEPS,dt=periods.exact/steps,f=(theta,velocity)=>[velocity,-g/L*Math.sin(theta)];
  let theta=rad(amplitude),velocity=0;trace=[[theta,velocity]];
  for(let j=0;j<steps;j++){
   const a=f(theta,velocity),b=f(theta+dt*a[0]/2,velocity+dt*a[1]/2),c=f(theta+dt*b[0]/2,velocity+dt*b[1]/2),d=f(theta+dt*c[0],velocity+dt*c[1]);
   theta+=dt*(a[0]+2*b[0]+2*c[0]+d[0])/6;velocity+=dt*(a[1]+2*b[1]+2*c[1]+d[1])/6;trace.push([theta,velocity]);
  }
  if(trajectories.size>=12)trajectories.delete(trajectories.keys().next().value);trajectories.set(key,trace);
 }
 const index=((t%periods.exact)+periods.exact)%periods.exact/periods.exact*PENDULUM_STEPS,j=Math.floor(index),fraction=index-j;
 const theta=trace[j][0]*(1-fraction)+trace[j+1][0]*fraction,velocity=trace[j][1]*(1-fraction)+trace[j+1][1]*fraction;
 return {...periods,theta,velocity,linear:rad(amplitude)*Math.cos(Math.sqrt(g/L)*t),energy:L*L*velocity*velocity/2+g*L*(1-Math.cos(theta))};
}
export const CURVES={
 linear:{label:'f(t) = t',f:x=>x,F:x=>x*x/2},
 square:{label:'f(t) = t² − 1',f:x=>x*x-1,F:x=>x*x*x/3-x},
 sine:{label:'f(t) = sin t',f:Math.sin,F:x=>-Math.cos(x)}
};
export function accumulation({curve,a,x,n=12,h=.2}) {
 const {f,F}=CURVES[curve],step=(x-a)/n;
 const rectangles=Array.from({length:n},(_,i)=>({left:a+i*step,right:a+(i+1)*step,height:f(a+(i+.5)*step)}));
 return {value:F(x)-F(a),slope:f(x),secant:(F(x+h)-F(x))/h,approx:rectangles.reduce((s,r)=>s+(r.right-r.left)*r.height,0),rectangles};
}
export function chain({family,x,scale=1,h=.2}) {
 let g,dg,f,df;
 if(family==='sin-square'){g=z=>scale*z*z;dg=z=>2*scale*z;f=Math.sin;df=Math.cos;}
 else if(family==='exp-linear'){g=z=>scale*z;dg=()=>scale;f=Math.exp;df=Math.exp;}
 else {g=z=>scale*z*z+1;dg=z=>2*scale*z;f=u=>u*u*u;df=u=>3*u*u;}
 const evaluate=z=>f(g(z)),u=g(x),outer=df(u),inner=dg(x);
 return {u,outer,inner,value:evaluate(x),derivative:outer*inner,secant:(evaluate(x+h)-evaluate(x))/h,evaluate};
}
export function product({x,offset=2,bias=1,h=.2}) {
 const f=x+offset,g=x*x+bias,df=1,dg=2*x,evaluate=z=>(z+offset)*(z*z+bias);
 return {f,g,df,dg,first:df*g,second:f*dg,derivative:df*g+f*dg,value:f*g,secant:(evaluate(x+h)-evaluate(x))/h,cross:df*dg*h*h,evaluate};
}
export function quotient({x,shift=1,h=.2}) {
 const f=x*x+1,g=x+shift,df=2*x,dg=1,evaluate=z=>Math.abs(z+shift)<1e-10?NaN:(z*z+1)/(z+shift);
 if(Math.abs(g)<1e-10)return {valid:false,f,g,df,dg,evaluate};
 return {valid:true,f,g,df,dg,first:df/g,second:-f*dg/(g*g),derivative:(df*g-f*dg)/(g*g),value:f/g,secant:(evaluate(x+h)-evaluate(x))/h,secantCrossesPole:g*(g+h)<=0,evaluate};
}
export function hooke({k,x,limit=.75}) {return {force:-k*x,external:k*x,energy:k*x*x/2,valid:Math.abs(x)<=limit};}
export function planeStress({E,nu,sx,sy,tau,gain=1}) {
 if(!(E>0&&nu>-1&&nu<.5))throw new Error('E positivo y −1 < ν < 0,5 para elasticidad isotrópica estable.');
 // Inputs use MPa throughout. Engineering shear gamma = 2 epsilon_xy.
 const ex=(sx-nu*sy)/E,ey=(sy-nu*sx)/E,ez=-nu*(sx+sy)/E,G=E/(2*(1+nu)),gamma=tau/G;
 const mean=(sx+sy)/2,radius=Math.hypot((sx-sy)/2,tau),angle=.5*Math.atan2(2*tau,sx-sy);
 const drawingGain=Math.min(gain,.6/Math.max(1e-12,Math.abs(ex)+Math.abs(gamma/2),Math.abs(ey)+Math.abs(gamma/2),Math.abs(ez)));
 return {ex,ey,ez,G,gamma,exy:gamma/2,principal:[mean+radius,mean-radius],angle,drawingGain,energy:(sx*ex+sy*ey+tau*gamma)/2};
}
