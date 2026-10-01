export const G=6.67430e-11, AU=149597870700, SOLAR_MASS=1.98847e30, YEAR=365.25*86400;
export const rad=d=>d*Math.PI/180;
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const positive=(...xs)=>{if(xs.some(x=>!Number.isFinite(x)||x<=0))throw new RangeError('Las magnitudes de escala deben ser positivas y finitas.');};
export function capital({P,r,n,t,inflation=0}) {
 n=Number(n);
 positive(n);if(P<0||t<0||1+r/100/n<=0||1+inflation/100<=0)throw new RangeError('Capital, plazo o tasa fuera del dominio.');
 const A=P*Math.exp(n*t*Math.log1p(r/100/n));
 return {A,interest:A-P,simple:P*(1+r*t/100),continuous:P*Math.exp(r*t/100),real:A/(1+inflation/100)**t,effective:100*Math.expm1(n*Math.log1p(r/100/n))};
}
export const FUNCTIONS={square:{f:x=>x*x,d:x=>2*x},sin:{f:Math.sin,d:Math.cos},abs:{f:Math.abs,d:x=>x===0?null:Math.sign(x)}};
export function derivative({fn,x,h,side='right'}) {
 const f=FUNCTIONS[fn];positive(h);const dx=(side==='left'?-1:1)*h;
 // Algebraic forms avoid cancellation when h is tiny.
 const secant=fn==='square'?2*x+dx:fn==='sin'?2*Math.cos(x+dx/2)*Math.sin(dx/2)/dx:(Math.abs(x+dx)-Math.abs(x))/dx;
 return {value:f.f(x),next:f.f(x+dx),dx,secant,tangent:f.d(x),left:fn==='abs'&&x===0?-1:f.d(x),right:fn==='abs'&&x===0?1:f.d(x)};
}
export function collision({m1,m2,v1,v2,e,t=0}) {
 positive(m1,m2);if(e<0||e>1)throw new RangeError('La restitución debe estar entre cero y uno.');
 const momentum=m1*v1+m2*v2,cm=momentum/(m1+m2),u1=cm-m2*e*(v1-v2)/(m1+m2),u2=cm+m1*e*(v1-v2)/(m1+m2);
 const closing=v1-v2,tc=closing>0?8/closing:Infinity,after=t>=tc;
 // Centres initially at −4 and +4; ideal point carts meet at the same position.
 const at=-4+v1*tc,x1=after?at+u1*(t-tc):-4+v1*t,x2=after?at+u2*(t-tc):4+v2*t;
 const K0=.5*(m1*v1*v1+m2*v2*v2),K1=.5*(m1*u1*u1+m2*u2*u2);
 return {momentum,cm,u1,u2,tc,after,x1,x2,K0,K1,lost:K0-K1,pAfter:m1*u1+m2*u2};
}
export function potential({m,g,H,t=0}) {
 positive(m,g);if(H<0)throw new RangeError('La altura no puede ser negativa.');
 const impact=Math.sqrt(2*H/g),tau=Math.min(t,impact),height=Math.max(0,H-.5*g*tau*tau),speed=g*tau;
 return {U:m*g*height,K:.5*m*speed*speed,total:m*g*H,height,speed,impact,landed:t>=impact};
}
export function orbit({M,a,e=0,t=0}) {
 positive(M,a);if(e<0||e>=1)throw new RangeError('Esta órbita elíptica requiere 0 ≤ e < 1.');
 const mu=G*M*SOLAR_MASS,axis=a*AU,period=2*Math.PI*Math.sqrt(axis**3/mu)/YEAR,mean=2*Math.PI*(t/period%1);
 let E=mean;for(let j=0;j<20;j++){const step=(E-e*Math.sin(E)-mean)/(1-e*Math.cos(E));E-=step;if(Math.abs(step)<1e-13)break;}
 const x=a*(Math.cos(E)-e),y=a*Math.sqrt(1-e*e)*Math.sin(E),r=Math.hypot(x,y),acceleration=mu/(r*AU)**2,speed=Math.sqrt(mu*(2/(r*AU)-1/axis));
 return {x,y,r,period,acceleration,speed,phi:-mu/(r*AU),energy:-mu/(2*axis)};
}
export function newton({m,F,angle,t,v0=1}) {
 positive(m);const ax=F*Math.cos(rad(angle))/m,ay=F*Math.sin(rad(angle))/m;
 return {ax,ay,a:Math.abs(F)/m,x:v0*t+.5*ax*t*t,y:.5*ay*t*t,vx:v0+ax*t,vy:ay*t};
}
export function polar({r,theta}) {if(r<0)throw new RangeError('El laboratorio usa radio no negativo.');return {x:r*Math.cos(rad(theta)),y:r*Math.sin(rad(theta)),angle:r===0?null:Math.atan2(r*Math.sin(rad(theta)),r*Math.cos(rad(theta)))*180/Math.PI};}
export const PARTS={
 exp:{u:x=>x,v:Math.exp,du:()=>1,dv:Math.exp,primitive:x=>(x-1)*Math.exp(x),remainder:Math.exp,label:'x·eˣ'},
 cos:{u:x=>x,v:Math.sin,du:()=>1,dv:Math.cos,primitive:x=>x*Math.sin(x)+Math.cos(x),remainder:x=>-Math.cos(x),label:'x·cos x'},
 log:{u:Math.log,v:x=>x,du:x=>1/x,dv:()=>1,primitive:x=>x*Math.log(x)-x,remainder:x=>x,label:'ln x'}
};
export function parts({fn,a,b}) {if(fn==='log'&&Math.min(a,b)<=0)throw new RangeError('ln x requiere límites positivos.');const f=PARTS[fn],boundary=f.u(b)*f.v(b)-f.u(a)*f.v(a),remainder=f.remainder(b)-f.remainder(a);return {boundary,remainder,value:boundary-remainder,direct:f.primitive(b)-f.primitive(a)};}
export function cooling({h,A,C,T0,ambient,t,L=.01,k=200}) {positive(h,A,C,L,k);const tau=C/(h*A),T=ambient+(T0-ambient)*Math.exp(-t*60/tau);return {T,power:h*A*(T-ambient),tau,Bi:h*L/k,energy:C*(T0-T)};}
function factorial(n){let v=1;for(let j=2;j<=n;j++)v*=j;return v;}
export const SERIES={exp:{f:Math.exp,coefficient:(a,j)=>Math.exp(a)/factorial(j)},sin:{f:Math.sin,coefficient:(a,j)=>Math.sin(a+j*Math.PI/2)/factorial(j)},log:{f:Math.log1p,coefficient:(a,j)=>j===0?Math.log1p(a):((-1)**(j+1))/(j*(1+a)**j)}};
export function series({fn,a=0,n,x}) {
 if(!Number.isInteger(n)||n<0||n>30)throw new RangeError('El grado debe ser entero entre 0 y 30.');if(fn==='log'&&a<=-1)throw new RangeError('El centro está fuera del dominio logarítmico.');
 const f=SERIES[fn],terms=Array.from({length:n+1},(_,j)=>f.coefficient(a,j)*(x-a)**j),polynomial=terms.reduce((s,v)=>s+v,0),actual=fn==='log'&&x<=-1?null:f.f(x),inside=fn!=='log'||Math.abs(x-a)<1+a;
 const bound=fn==='exp'?Math.exp(Math.max(a,x))*Math.abs(x-a)**(n+1)/factorial(n+1):fn==='sin'?Math.abs(x-a)**(n+1)/factorial(n+1):actual===null?null:Math.abs(x-a)**(n+1)/((n+1)*(1+Math.min(a,x))**(n+1));
 return {terms,polynomial,actual,error:actual===null?null:actual-polynomial,bound,inside,radius:fn==='log'?1+a:Infinity};
}
export const SUM_FUNCTIONS={
 square:{f:x=>x*x,integral:x=>x**3/3,d:x=>2*x,d3:()=>0},
 exp:{f:x=>Math.exp(-x),integral:x=>-Math.exp(-x),d:x=>-Math.exp(-x),d3:x=>-Math.exp(-x)},
 log:{f:Math.log,integral:x=>x*Math.log(x)-x,d:x=>1/x,d3:x=>2/x**3}
};
export function eulerMaclaurin({fn,a,b,order}) {if(!Number.isInteger(a)||!Number.isInteger(b)||b<a||order<0||order>2||(fn==='log'&&a<=0))throw new RangeError('Límites enteros ordenados y dominio válido requeridos.');const f=SUM_FUNCTIONS[fn];let sum=0;for(let j=a;j<=b;j++)sum+=f.f(j);const integral=f.integral(b)-f.integral(a),endpoints=(f.f(a)+f.f(b))/2,c2=(f.d(b)-f.d(a))/12,c4=-(f.d3(b)-f.d3(a))/720,approx=integral+endpoints+(order>=1?c2:0)+(order>=2?c4:0);return {sum,integral,endpoints,c2,c4,approx,error:sum-approx};}
export function flow({A1,A2,Q,p1,z1,z2,rho=1000,K=0,pump=0,alpha1=1,alpha2=1}) {positive(A1,A2,rho);const g=9.81,v1=Q/A1,v2=Q/A2,loss=K*v2*v2/(2*g),head1=p1*1000/(rho*g)+alpha1*v1*v1/(2*g)+z1,p2=rho*g*(head1+pump-loss-z2-alpha2*v2*v2/(2*g))/1000,head2=p2*1000/(rho*g)+alpha2*v2*v2/(2*g)+z2;return {v1,v2,loss,p2,head1,head2,residual:head1+pump-loss-head2};}
export function continuity({A1,A2,v1,rho1=1000,rho2=1000}) {positive(A1,A2,rho1,rho2);const mass=rho1*A1*v1,v2=mass/(rho2*A2);return {mass,v2,Q1:A1*v1,Q2:A2*v2};}
export function capacitor({C,V,R=1,t=0,kind='charge'}) {positive(C,R);const tau=R*C,z=Math.exp(-t/tau),voltage=kind==='charge'?V*(-Math.expm1(-t/tau)):V*z,current=(kind==='charge'?1:-1)*V*z/R;const U=.5*C*voltage*voltage,heat=.5*C*V*V*(-Math.expm1(-2*t/tau)),source=kind==='charge'?C*V*V*(-Math.expm1(-t/tau)):0;return {voltage,Q:C*voltage,U,current,tau,heat,source,initial:kind==='charge'?0:.5*C*V*V};}
export function wave1D({A,c,lambda,t,kind='travel'},x) {positive(c,lambda);const k=2*Math.PI/lambda,omega=k*c,u=kind==='standing'?A*Math.sin(k*x)*Math.cos(omega*t):A*Math.sin(k*(x-c*t));return {u,frequency:c/lambda,period:lambda/c,omega,k,velocity:kind==='standing'?-A*omega*Math.sin(k*x)*Math.sin(omega*t):-A*omega*Math.cos(k*(x-c*t))};}
export function membrane({A,c,Lx,Ly,m,n,t},x=0,y=0) {positive(c,Lx,Ly,m,n);const omega=c*Math.PI*Math.hypot(m/Lx,n/Ly),shape=Math.sin(m*Math.PI*x/Lx)*Math.sin(n*Math.PI*y/Ly);return {u:A*shape*Math.cos(omega*t),frequency:omega/(2*Math.PI),omega,nodes:(m-1)+(n-1)};}
export function complex({theta}) {const angle=rad(theta);return {re:Math.cos(angle),im:Math.sin(angle),modulus:1,angle};}
export function beam({P,L,E,I,kind='tip'},x=L) {positive(L,E,I);const rigidity=E*1e9*I*1e-8,distributed=kind==='uniform',w=distributed?P*x*x*(6*L*L-4*L*x+x*x)/(24*rigidity):P*x*x*(3*L-x)/(6*rigidity),slope=distributed?P*x*(3*L*L-3*L*x+x*x)/(6*rigidity):P*x*(2*L-x)/(2*rigidity),moment=distributed?P*(L-x)**2/2:P*(L-x),load=distributed?P*L:P,tip=distributed?P*L**4/(8*rigidity):P*L**3/(3*rigidity);return {w,slope,moment,load,tip,rigidity,small:Math.abs(tip/L)<.05};}
