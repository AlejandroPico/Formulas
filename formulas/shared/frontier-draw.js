import * as M from './frontier-math.js';
import {fmt} from './learning-math.js';
const blue='#428cb2',coral='#cc745d',green='#4a9477',tau=2*Math.PI;
let membraneMesh={key:'',points:[],envelope:[]};
export function drawFrontier(ctx,w,h,id,p,v) {
 const {ink,muted,line,background,accent,hide,mode}=v,small=w<600;
 ctx.clearRect(0,0,w,h);ctx.fillStyle=background;ctx.fillRect(0,0,w,h);
 const text=(s,x,y,c=ink,size=small?11:13,align='center')=>{ctx.fillStyle=c;ctx.font=`${size}px system-ui,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(s,x,y);};
 const path=(ps,c=accent,width=2,fill=null,close=false)=>{ctx.beginPath();ps.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));if(close)ctx.closePath();ctx.strokeStyle=c;ctx.lineWidth=width;if(fill){ctx.fillStyle=fill;ctx.fill();}ctx.stroke();};
 const dot=(q,c=accent,r=5)=>{ctx.beginPath();ctx.arc(...q,r,0,tau);ctx.fillStyle=c;ctx.fill();};
 const circle=(q,r,c=line)=>{ctx.beginPath();ctx.arc(...q,r,0,tau);ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.stroke();};
 const arrow=(a,b,c=accent)=>{path([a,b],c);const angle=Math.atan2(b[1]-a[1],b[0]-a[0]);path([[b[0]-7*Math.cos(angle-.4),b[1]-7*Math.sin(angle-.4)],b,[b[0]-7*Math.cos(angle+.4),b[1]-7*Math.sin(angle+.4)]],c);};
 const footer=(a,b='')=>{text(a,w/2,h-(b?30:15),muted,small?10:12);if(b)text(b,w/2,h-13,muted,small?10:12);};
 const legend=(labels)=>labels.forEach(([s,c],j)=>text(s,(j+.5)*w/labels.length,16,c,small?10:12));
 function plot({xmin=0,xmax=5,ymin=0,ymax=5,left=40,right=w-22,top=40,bottom=h-62}={}){
  const sx=(right-left)/(xmax-xmin),sy=(bottom-top)/(ymax-ymin),point=(x,y)=>[left+(x-xmin)*sx,bottom-(y-ymin)*sy];
  const axes=()=>{if(ymin<=0&&ymax>=0)path([point(xmin,0),point(xmax,0)],line,1);if(xmin<=0&&xmax>=0)path([point(0,ymin),point(0,ymax)],line,1);};axes();
  const curve=(fn,c=accent,width=2)=>{ctx.save();ctx.beginPath();ctx.rect(left,top,right-left,bottom-top);ctx.clip();let ps=[];for(let j=0;j<=240;j++){const x=xmin+(xmax-xmin)*j/240,y=fn(x);if(!Number.isFinite(y)){if(ps.length>1)path(ps,c,width);ps=[];}else ps.push(point(x,y));}if(ps.length>1)path(ps,c,width);ctx.restore();};
  text(fmt(xmin),left,bottom+13,muted,10);text(fmt(xmax),right,bottom+13,muted,10);text(fmt(ymax),left-4,top,muted,10,'right');text(fmt(ymin),left-4,bottom,muted,10,'right');
  return {point,curve,unpoint:([x,y])=>[xmin+(x-left)/sx,ymin+(bottom-y)/sy],layout:{xmin,xmax,ymin,ymax,left,right,top,bottom}};
 }
 function bars(values,labels,colors=[blue,coral,green],{top=50,bottom=h-55}={}) {
  const max=Math.max(1e-9,...values.map(Math.abs)),zero=values.some(x=>x<0)?(top+bottom)/2:bottom,scale=(values.some(x=>x<0)?(bottom-top)/2:bottom-top)/max;
  path([[24,zero],[w-24,zero]],line,1);
  values.forEach((x,j)=>{const cx=(j+.5)*w/values.length,bw=Math.min(60,w/values.length*.45);ctx.fillStyle=colors[j%colors.length]+'44';ctx.fillRect(cx-bw/2,Math.min(zero,zero-x*scale),bw,Math.abs(x*scale));path([[cx-bw/2,zero-x*scale],[cx+bw/2,zero-x*scale]],colors[j%colors.length],3);text(labels[j],cx,bottom+18,colors[j%colors.length],small?10:12);if(!hide)text(fmt(x,3),cx,top-13,colors[j%colors.length],small?10:12);});
 }
 function project3D(scale=1){const cy=Math.cos(v.yaw),sy=Math.sin(v.yaw),sp=Math.sin(v.pitch),cp=Math.cos(v.pitch);return ([x,y,z])=>[w/2+scale*(cy*x-sy*y),h/2+scale*(sp*(sy*x+cy*y)-cp*z)];}
 function fit3D(points){const raw=project3D();let dx=.01,dy=.01;for(const q of points){const point=raw(q);dx=Math.max(dx,Math.abs(point[0]-w/2));dy=Math.max(dy,Math.abs(point[1]-h/2));}return project3D(Math.min((w-70)/(2*dx),(h-110)/(2*dy)));}
 if(id==='compound-interest-exponential-capital-growth') {
  const end=M.capital({...p,t:20}),ymax=Math.max(end.A,end.continuous,p.P)*1.08,g=plot({xmax:20,ymax});
  g.curve(x=>M.capital({...p,t:x}).simple,muted);g.curve(x=>M.capital({...p,t:x}).A,blue);g.curve(x=>M.capital({...p,t:x}).continuous,coral);
  if(mode===2)g.curve(x=>M.capital({...p,t:x}).real,green);
  legend(mode===2?[['Compuesto',blue],['Simple',muted],['Valor real',green]]:[['Compuesto',blue],['Simple',muted],['Continuo',coral]]);
  const amount=M.capital(p).A;dot(g.point(p.t,amount),blue);path([g.point(p.t,0),g.point(p.t,amount)],line,1);
  footer('Tiempo en años · capital en euros',mode===2?'Inflación constante: euros del momento inicial':'Curvas interpoladas; se liquidan n intereses por año');return {};
 }
 if(id==='derivative-as-limit') {
  const d=M.derivative(p),f=M.FUNCTIONS[p.fn],xmin=-4,xmax=4,g=plot({xmin,xmax,ymin:p.fn==='square'?-.5:-2,ymax:p.fn==='square'?16:4,...v.frozen});g.curve(f.f,blue);
  const A=g.point(p.x,d.value),B=g.point(p.x+d.dx,d.next);g.curve(x=>d.value+d.secant*(x-p.x),coral,1.5);
  if(d.tangent!==null)g.curve(x=>d.value+d.tangent*(x-p.x),green,1.5);else if(mode===2){g.curve(x=>x<0?-x:NaN,green);}
  dot(A,blue);dot(B,coral);text('x',A[0],Math.min(h-55,A[1]+18),blue);text('x+h',B[0],Math.max(28,B[1]-15),coral);
  legend([['Función',blue],['Secante',coral],['Tangente',green]]);footer('Acerca el punto coral; h ≠ 0',d.tangent===null?'En el vértice, −1 y +1 no coinciden':'Una secante aproxima una pendiente local');
  return {layout:g.layout,drag:q=>{const [x]=g.unpoint(q),dx=x-p.x;return {h:Math.max(.001,Math.abs(dx)),side:dx<0?'left':'right'};}};
 }
 if(id==='linear-momentum-conservation') {
  const d=M.collision(p);if(mode===2){bars([d.K0,d.K1,d.lost],['K inicial [J]','K final [J]','Disipada [J]']);footer('Momento conservado · energía cinética no siempre');return {};}
  // Fixed world window over the full playback: positions stay continuous at collision.
  const ends=[M.collision({...p,t:0}),M.collision({...p,t:20})],xs=ends.flatMap(z=>[z.x1,z.x2]),min=Math.min(-8,...xs)-2,max=Math.max(8,...xs)+2,x=q=>30+(q-min)/(max-min)*(w-60),floor=h*.58;
  path([[22,floor+18],[w-22,floor+18]],line,1);for(const [xx,m,speed,c,label] of [[d.x1,p.m1,d.after?d.u1:p.v1,blue,'1'],[d.x2,p.m2,d.after?d.u2:p.v2,coral,'2']]){const width=20+8*Math.sqrt(m);ctx.fillStyle=c+'33';ctx.fillRect(x(xx)-width/2,floor-14,width,28);path([[x(xx)-width/2,floor-14],[x(xx)+width/2,floor-14]],c,3);text(label,x(xx),floor,c);if(Math.abs(speed)>1e-9)arrow([x(xx),floor-32],[x(xx)+Math.sign(speed)*Math.min(60,Math.abs(speed)*15),floor-32],c);}
  legend([['Carro 1',blue],['Carro 2',coral]]);footer(Number.isFinite(d.tc)?d.after?'Después del choque':'Antes del choque':'No se aproximan: no chocarán','Carritos puntuales · flechas de velocidad con signo');return {};
 }
 if(id==='gravitational-potential-energy') {
  const d=M.potential(p);if(mode===2){bars([d.U,d.K,d.total],['U [J]','K [J]','U+K [J]']);footer(d.landed?'Estado límite anterior al primer impacto':'La energía cambia de forma, no de total');return {};}
  const bottom=h-68,top=45,scale=(bottom-top)/20,x=w*.38,y=bottom-d.height*scale;
  path([[28,bottom],[w-28,bottom]],line,2);path([[x,top],[x,bottom]],line,1);ctx.setLineDash([4,4]);path([[x,p.H* -scale+bottom],[w*.7,p.H* -scale+bottom]],line,1);ctx.setLineDash([]);dot([x,y],blue,10+Math.sqrt(p.m));arrow([x+25,y],[x+25,Math.min(bottom,y+Math.min(70,d.speed*4))],coral);
  text('H inicial',w*.7,p.H* -scale+bottom-13,muted);text('U ↘  ·  K ↗',w*.72,h*.55,green);footer('Referencia U=0: línea del suelo',d.landed?'Caída detenida justo antes del contacto':'La flecha muestra la velocidad descendente');return {};
 }
 if(id==='gravitational-law') {
  if(mode===2){const d=M.orbit(p),peri=M.orbit({...p,t:0}),low=peri.phi/1e6*1.1,high=peri.speed**2/2e6*1.1,g=plot({xmax:1,ymin:low,ymax:high});
   const at=x=>M.orbit({...p,t:x*d.period});g.curve(x=>at(x).speed**2/2e6,blue);g.curve(x=>at(x).phi/1e6,coral);g.curve(()=>d.energy/1e6,green);
   const phase=(p.t/d.period)%1;dot(g.point(phase,d.speed**2/2e6),blue);dot(g.point(phase,d.phi/1e6),coral);legend([['K/m',blue],['Potencial Φ',coral],['Total / masa',green]]);footer('Fracción de una órbita · energía en MJ/kg','Rapidez y potencial cambian; el total es constante');return {};
  }
  const d=M.orbit(p),points=Array.from({length:181},(_,j)=>{const E=j*tau/180;return [p.a*(Math.cos(E)-p.e),p.a*Math.sqrt(1-p.e*p.e)*Math.sin(E),0];}),proj=fit3D(points),star=proj([0,0,0]),planet=proj([d.x,d.y,0]);
  path(points.map(proj),line);
  dot(star,'#c59543',9);dot(planet,blue,7);arrow(planet,[planet[0]+(star[0]-planet[0])*.35,planet[1]+(star[1]-planet[1])*.35],coral);
  const centre=proj([-p.a*p.e,0,0]);dot(centre,muted,2);text('Foco',star[0],star[1]+22,'#b5893b');text('Órbita elíptica',w/2,18,blue);
  footer(mode===2?'K/m + Φ = energía específica constante':'La aceleración apunta hacia la estrella','Gira con ratón, tacto o flechas · 1 s de juego = 1 año');return {rotate:true};
 }
 if(id==='newton-second-law') {
  const end=M.newton({...p,t:20}),xs=[0,end.x],ys=[0,end.y],pad=5,g=plot({xmin:Math.min(...xs)-pad,xmax:Math.max(...xs)+pad,ymin:Math.min(...ys)-pad,ymax:Math.max(...ys)+pad});
  path(Array.from({length:101},(_,j)=>{const z=M.newton({...p,t:j/5});return g.point(z.x,z.y);}),line);
  const d=M.newton(p),pt=g.point(d.x,d.y);dot(pt,blue,8);if(p.F>0)arrow(pt,[pt[0]+Math.cos(M.rad(p.angle))*p.F*5,pt[1]-Math.sin(M.rad(p.angle))*p.F*5],coral);
  legend([['Trayectoria',blue],['Fuerza neta',coral]]);footer('Posición en metros · velocidad inicial horizontal',p.F===0?'F=0: conserva velocidad; no exige reposo':'Fuerza y velocidad no tienen que ser paralelas');return {};
 }
 if(id==='polar-coordinates'||id==='euler-identity') {
  const euler=id==='euler-identity',d=euler?M.complex(p):M.polar(p),r=euler?1:p.r,theta=p.theta,cx=w/2,cy=h/2,scale=Math.min(w-75,h-105)/(2*(euler?1.15:8));
  if(euler&&mode===2){const g=plot({xmin:0,xmax:4*Math.PI,ymin:-1.3,ymax:1.3});g.curve(Math.cos,blue);g.curve(Math.sin,coral);const a=M.rad(theta);if(a>=0&&a<=4*Math.PI){dot(g.point(a,d.re),blue);dot(g.point(a,d.im),coral);}legend([['Real = cos θ',blue],['Imaginaria = sin θ',coral]]);footer('θ en radianes · módulo constante uno');return {};}
  path([[25,cy],[w-25,cy]],line,1);path([[cx,35],[cx,h-52]],line,1);circle([cx,cy],r*scale,line);
  const point=[cx+(euler?d.re:d.x)*scale,cy-(euler?d.im:d.y)*scale];if(r>0)arrow([cx,cy],point,blue);dot(point,coral,6);
  ctx.setLineDash([4,4]);path([[point[0],cy],point,[cx,point[1]]],coral,1);ctx.setLineDash([]);
  text(euler?'Re':'x',w-25,cy-12,muted);text(euler?'Im':'y',cx+14,38,muted);legend([[euler?'Círculo unitario':'Radar polar',blue]]);
  footer(euler?'e^(iθ) = cos θ + i sin θ':r===0?'Origen: el ángulo geométrico no está definido':'Radio y ángulo reconstruyen x e y','Arrastra el punto · controles en grados');
  return {layout:{cx,cy,scale},drag:([x,y])=>{const f=v.frozen||{cx,cy,scale},dx=(x-f.cx)/f.scale,dy=(f.cy-y)/f.scale;return {theta:Math.atan2(dy,dx)*180/Math.PI,...euler?{}:{r:Math.hypot(dx,dy)}};}};
 }
 if(id==='integration-by-parts') {
  let d;try{d=M.parts(p);}catch(e){text('ln x necesita límites positivos',w/2,h/2);return {};}
  if(mode===2){bars([d.boundary,d.remainder,d.value],['Borde','Restante','Original']);footer('Integral original = borde − restante','Las contribuciones tienen signo');return {};}
  const f=M.PARTS[p.fn],g=plot({xmin:0,xmax:3,ymin:-5,ymax:p.fn==='exp'?62:5,...v.frozen}),fn=x=>p.fn==='log'&&x<=0?NaN:f.u(x)*f.dv(x);g.curve(fn,blue);
  const pts=Array.from({length:80},(_,j)=>{const x=p.a+(p.b-p.a)*j/79;return g.point(x,fn(x));});path([g.point(p.a,0),...pts,g.point(p.b,0)],blue,1,blue+'22',true);
  for(const [x,label] of [[p.a,'a'],[p.b,'b']]){dot(g.point(x,0),coral);text(label,g.point(x,0)[0],g.point(x,0)[1]+18,coral);}
  legend([['Integrando',blue],['Intervalo orientado',coral]]);footer('Arrastra b · intercambia los límites',p.b<p.a?'Límites invertidos: signo opuesto':'Área firmada, no solo área geométrica');return {layout:g.layout,drag:q=>({b:g.unpoint(q)[0]})};
 }
 if(id==='newton-law-of-cooling-convection') {
  const d=M.cooling(p);if(mode===2){const min=Math.min(p.T0,p.ambient)-5,max=Math.max(p.T0,p.ambient)+5,g=plot({xmax:20,ymin:min,ymax:max});g.curve(t=>M.cooling({...p,t}).T,blue);path([g.point(0,p.ambient),g.point(20,p.ambient)],coral,1);dot(g.point(p.t,d.T),blue);legend([['Temperatura [°C]',blue],['Ambiente',coral]]);footer('Tiempo en minutos · acercamiento exponencial','τ=C/(hA), no tiempo hasta igualdad exacta');return {};}
  const cx=w*.35,cy=h*.5,color=d.T>=p.ambient?coral:blue;ctx.fillStyle=color+'22';ctx.fillRect(cx-35,cy-45,70,90);path([[cx-35,cy-45],[cx+35,cy-45],[cx+35,cy+45],[cx-35,cy+45]],color,2,null,true);text('Pieza',cx,cy,color);text('Ambiente',w*.76,cy-42,muted);
  if(Math.abs(d.power)>1e-9)for(let j=-1;j<=1;j++){const a=[cx+45,cy+j*25],b=[w*.78,cy+j*25];arrow(d.power>=0?a:b,d.power>=0?b:a,color);}else text('Sin flujo neto',w*.76,cy,muted);
  if(!hide)text(`${fmt(d.T)} °C`,cx,cy+67,color);footer(d.Bi<.1?'Temperatura uniforme: Bi<0,1':'Bi≥0,1: el modelo uniforme merece revisión','Flechas de calor: salen en enfriamiento, entran en calentamiento');return {};
 }
 if(id==='taylor-series'||id==='maclaurin-series') {
  const d=M.series(p);if(mode===2&&id==='maclaurin-series'){const n=d.terms.length,max=Math.max(.01,...d.terms.map(Math.abs)),cy=h/2,space=(w-50)/n;path([[25,cy],[w-25,cy]],line,1);d.terms.forEach((term,j)=>{const x=25+(j+.5)*space,y=cy-term/max*(h*.28);path([[x,cy],[x,y]],term>=0?blue:coral,Math.min(18,space*.6));text(String(j),x,h-52,muted,10);});footer('Orden del término · azul positivo, coral negativo','El signo de los términos controla la cancelación');return {};}
  const g=plot({xmin:-1.2,xmax:3.2,ymin:p.fn==='exp'?-.5:-4,ymax:p.fn==='exp'?26:4});g.curve(x=>p.fn==='log'&&x<=-1?NaN:M.SERIES[p.fn].f(x),blue);g.curve(x=>M.series({...p,x}).polynomial,coral);dot(g.point(p.a,M.SERIES[p.fn].f(p.a)),green);if(d.actual!==null)path([g.point(p.x,d.actual),g.point(p.x,d.polynomial)],green,2);legend([['Función',blue],['Polinomio',coral],['Centro / error',green]]);footer('El polinomio iguala derivadas en el centro',p.fn==='log'?`Intervalo abierto: −1 < x < ${fmt(1+2*p.a)}`:'Un grado finito conserva un resto');return {};
 }
 if(id==='euler-maclaurin-summation') {
  let d;try{d=M.eulerMaclaurin(p);}catch(e){text('El último entero debe ser ≥ el primero',w/2,h/2);return {};}
  if(mode===2){bars([d.integral,d.endpoints,d.c2,d.c4],['Integral','Extremos','B₂','B₄']);footer('Aproximación: añade las correcciones seleccionadas','El residuo compara con la suma discreta');return {};}
  const f=M.SUM_FUNCTIONS[p.fn].f,xmin=Math.max(0,p.a-.5),xmax=p.b+.5,max=Math.max(.1,f(p.a),f(p.b)),g=plot({xmin,xmax,ymax:max*1.15});g.curve(f,blue);for(let j=p.a;j<=p.b;j++){const a=g.point(j,0),b=g.point(j,f(j));path([a,b],coral,3);dot(b,coral,3);}legend([['Función continua',blue],['Sumandos discretos',coral]]);footer('Enteros: la suma incluye ambos extremos','La integral y la suma son objetos distintos');return {};
 }
 if(['bernoulli-equation','bernoulli-equation-real-fluid','continuity-equation'].includes(id)) {
  const continuity=id==='continuity-equation',d=continuity?M.continuity(p):M.flow(p);
  if(mode===2&&!continuity){bars([d.head1,p.pump||0,d.loss,d.head2],['H₁ [m]','Bomba [m]','Pérdida [m]','H₂ [m]']);footer('H₁ + bomba − pérdida = H₂','α=1 en este laboratorio · presiones manométricas');return {};}
  const cy=h*.48,height1=25+120*p.A1/.02,height2=25+120*p.A2/.02,x1=w*.3,x2=w*.7;
  path([[20,cy-height1/2],[x1,cy-height1/2],[x2,cy-height2/2],[w-20,cy-height2/2]],blue,2);path([[20,cy+height1/2],[x1,cy+height1/2],[x2,cy+height2/2],[w-20,cy+height2/2]],blue,2);
  for(const [x,height,speed,rho] of [[x1,height1,continuity?p.v1:d.v1,continuity?p.rho1:1000],[x2,height2,d.v2,continuity?p.rho2:1000]]){
   for(let j=0;j<8;j++){const phase=(j/8+(p.t||0)*speed*.2)%1;dot([x-32+phase*64,cy+Math.sin(j*2.4)*height*.25],blue,continuity?2+Math.sqrt(rho/1000):3);}
   arrow([x-25,cy],[x+25,cy],coral);text(x===x1?'Estación 1':'Estación 2',x,cy+Math.max(height1,height2)/2+25,muted);
  }
  legend([[continuity?'Balance de masa':'Conducto esquemático',blue],['Velocidad media',coral]]);
  if(continuity&&mode===2)footer('Tamaño de los puntos: densidad local','Caudal másico igual · caudal volumétrico puede cambiar');else footer(continuity?'ρ₁A₁v₁ = ρ₂A₂v₂':id==='bernoulli-equation-real-fluid'?'La pérdida resta carga · la bomba la añade':'Presión + rapidez + altura: balance de energía','Animación ilustrativa; geometría del conducto sin escala');return {};
 }
 if(id==='capacitor-stored-energy') {
  const d=M.capacitor(p);if(mode===2){bars([d.initial+d.source,d.U,d.heat],['Disponible [µJ]','Guardada [µJ]','Calor [µJ]']);footer('Energía disponible = almacenada + calor',p.kind==='charge'?'La fuente continúa entregando energía':'Descarga: disponible = energía inicial');return {};}
  const x1=w*.2,x2=w*.8,y1=h*.28,y2=h*.68,xc=w*.55;path([[x1,y2],[x1,y1],[xc-22,y1]],line,2);path([[xc+22,y1],[x2,y1],[x2,y2],[x1,y2]],line,2);
  path([[xc-22,y1-24],[xc-22,y1+24]],blue,4);path([[xc+22,y1-24],[xc+22,y1+24]],coral,4);
  if(p.kind==='charge'){path([[x1-14,(y1+y2)/2-6],[x1+14,(y1+y2)/2-6]],blue,3);path([[x1-7,(y1+y2)/2+6],[x1+7,(y1+y2)/2+6]],blue,3);text('Fuente',x1,(y1+y2)/2+28,blue);}else text('Sin fuente',x1,(y1+y2)/2+28,muted);
  const rx=w*.55;ctx.fillStyle=background;ctx.fillRect(rx-27,y2-10,54,20);path([[rx-25,y2-8],[rx+25,y2-8],[rx+25,y2+8],[rx-25,y2+8]],muted,2,null,true);text('R',rx,y2+22,muted);text('C',xc,y1-37,blue);
  const fraction=p.V?d.voltage/p.V:0;for(let j=0;j<Math.round(7*fraction);j++){const y=y1-20+j*6;text('+',xc-31,y,blue,10);text('−',xc+31,y,coral,10);}if(!hide)text(`${fmt(d.voltage)} V`,xc,(y1+y2)/2,ink);
  footer('RC ideal · no hay fugas ni ruptura dieléctrica','1 s de juego = 1 ms del circuito');return {};
 }
 if(id==='one-dimensional-wave-equation') {
  const g=plot({xmax:12,ymin:-2.4,ymax:2.4});g.curve(x=>M.wave1D(p,x).u,blue);const d=M.wave1D(p,1);dot(g.point(1,d.u),coral,6);ctx.setLineDash([4,4]);path([g.point(1,-2.2),g.point(1,2.2)],line,1);ctx.setLineDash([]);
  if(mode===2){g.curve(x=>p.A/2*Math.sin(tau/p.lambda*(x-p.c*p.t)),green,1);g.curve(x=>p.A/2*Math.sin(tau/p.lambda*(x+p.c*p.t)),coral,1);}legend([['Señal',blue],['Punto fijo x=1 m',coral]]);footer('x en metros · desplazamiento en u',p.kind==='standing'?'Nodos quietos: ondas opuestas se superponen':'La forma viaja; la marca oscila verticalmente');return {};
 }
 if(id==='wave-equation') {
  const N=28,key=[p.A,p.Lx,p.Ly,p.m,p.n].join(':');
  if(membraneMesh.key!==key){const points=[],envelope=[];for(let i=0;i<=N;i++)for(let j=0;j<=N;j++){const x=p.Lx*i/N-p.Lx/2,y=p.Ly*j/N-p.Ly/2,z=p.A*Math.sin(p.m*Math.PI*i/N)*Math.sin(p.n*Math.PI*j/N)*4;points.push([x,y,z]);envelope.push([x,y,z],[x,y,-z]);}membraneMesh={key,points,envelope};}
  const proj=fit3D(membraneMesh.envelope),phase=Math.cos(M.membrane(p).omega*p.t),sample=(i,j)=>{const [x,y,z]=membraneMesh.points[i*(N+1)+j];return proj([x,y,z*phase]);};
  // Wire mesh only: no depth-obscuring opaque panels. The four physical edges stay fixed.
  for(let j=0;j<=N;j++)path(Array.from({length:N+1},(_,i)=>sample(i,j)),j%7===0?blue:line,j%7===0?1.4:.6);
  for(let i=0;i<=N;i++)path(Array.from({length:N+1},(_,j)=>sample(i,j)),i%7===0?blue:line,i%7===0?1.4:.6);
  for(let i=1;i<p.m;i++){const x=p.Lx*i/p.m;path([proj([x-p.Lx/2,-p.Ly/2,0]),proj([x-p.Lx/2,p.Ly/2,0])],coral,2);}
  for(let j=1;j<p.n;j++){const y=p.Ly*j/p.n;path([proj([-p.Lx/2,y-p.Ly/2,0]),proj([p.Lx/2,y-p.Ly/2,0])],coral,2);}
  legend([['Membrana',blue],['Líneas nodales',coral]]);footer('Arrastra para girar · flechas para la cámara','Bordes fijos · altura amplificada ×4');return {rotate:true};
 }
 if(id==='euler-bernoulli-beam-bending') {
  const d=M.beam(p),gain=Math.min(5000,Math.abs(d.tip)>1e-12?.2*p.L/Math.abs(d.tip):200),g=plot({xmax:p.L,ymin:-p.L*.32,ymax:p.L*.05});
  g.curve(x=>-M.beam(p,x).w*gain,blue,3);path([g.point(0,-p.L*.28),g.point(0,p.L*.04)],muted,5);for(let j=0;j<6;j++){const a=g.point(0,-p.L*.27+j*p.L*.05);path([[a[0]-12,a[1]+10],a],muted,1);}
  if(p.P>0){if(p.kind==='tip'){const end=g.point(p.L,-d.tip*gain);arrow([end[0],end[1]-40],end,coral);}else for(let j=1;j<=8;j++){const x=p.L*j/8,pt=g.point(x,-M.beam(p,x).w*gain);arrow([pt[0],pt[1]-25],pt,coral);}}
  if(mode===2){const maxMoment=M.beam(p,0).moment||1;path(Array.from({length:81},(_,i)=>{const x=p.L*i/80;return g.point(x,-M.beam(p,x).moment/maxMoment*p.L*.17);}),green,2);
   const x=(p.station??.5)*p.L,z=M.beam(p,x),a=Math.max(0,x-p.L*.1),b=Math.min(p.L,x+p.L*.1);dot(g.point(x,-z.w*gain),blue,5);path([g.point(a,-(z.w+z.slope*(a-x))*gain),g.point(b,-(z.w+z.slope*(b-x))*gain)],coral,2);
  }
  legend(mode===2?[['Elástica',blue],['Carga / tangente',coral],['Momento',green]]:[['Elástica amplificada',blue],['Carga',coral]]);footer(`Desplazamiento amplificado ×${fmt(gain,0)}`,'Empotramiento: w(0)=w′(0)=0 · extremo libre');return {};
 }
 throw new Error('No existe una escena para esta fórmula.');
}
