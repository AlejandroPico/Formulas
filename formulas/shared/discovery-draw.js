import {triangle,triangleASA,trianglesSSA,angles,viete,binomial,choose,harmonic,pendulum,pendulumPeriod,accumulation,CURVES,chain,product,quotient,hooke,planeStress,rad,deg} from './discovery-math.js';
import {fmt} from './learning-math.js';
const TAU=2*Math.PI,blue='#4b8dbc',coral='#ca715d',green='#459278';
export function drawDiscovery(ctx,w,h,id,p,v) {
 const {ink,muted,line,accent,background,hide,mode}=v,compact=w<600;
 ctx.clearRect(0,0,w,h);ctx.fillStyle=background;ctx.fillRect(0,0,w,h);
 const text=(s,x,y,color=ink,size=13,align='center')=>{ctx.fillStyle=color;ctx.font=`${size}px system-ui,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(s,x,y);};
 const path=(pts,color=ink,width=2,fill=null,closed=false)=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(closed)ctx.closePath();ctx.strokeStyle=color;ctx.lineWidth=width;if(fill){ctx.fillStyle=fill;ctx.fill();}ctx.stroke();};
 const dot=(q,color=accent,r=5)=>{ctx.beginPath();ctx.arc(q[0],q[1],r,0,TAU);ctx.fillStyle=color;ctx.fill();};
 const arrow=(a,b,color=accent)=>{path([a,b],color,2);const t=Math.atan2(b[1]-a[1],b[0]-a[0]);path([[b[0]-8*Math.cos(t-.4),b[1]-8*Math.sin(t-.4)],b,[b[0]-8*Math.cos(t+.4),b[1]-8*Math.sin(t+.4)]],color,2);};
 const circle=(q,r,color=accent)=>{ctx.beginPath();ctx.arc(q[0],q[1],r,0,TAU);ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.stroke();};
 const footer=s=>text(s,w/2,h-12,muted,compact?10:12);
 function plot(fn,{xmin=-3,xmax=3,ymin=-3,ymax=3,left=40,top=32,right=w-20,bottom=h-35}={}) {
  const sx=(right-left)/(xmax-xmin),sy=(bottom-top)/(ymax-ymin),point=(x,y)=>[left+(x-xmin)*sx,bottom-(y-ymin)*sy];
  ctx.save();ctx.beginPath();ctx.rect(left,top,right-left,bottom-top);ctx.clip();
  if(ymin<=0&&ymax>=0)path([point(xmin,0),point(xmax,0)],line,1);
  if(xmin<=0&&xmax>=0)path([point(0,ymin),point(0,ymax)],line,1);
  const curve=(f,color=accent)=>{let points=[];for(let j=0;j<=300;j++){const x=xmin+(xmax-xmin)*j/300,y=f(x);if(!Number.isFinite(y)||Math.abs(y)>Math.max(Math.abs(ymin),Math.abs(ymax))*8){if(points.length>1)path(points,color,2);points=[];}else points.push(point(x,y));}if(points.length>1)path(points,color,2);};
  if(fn)curve(fn);ctx.restore();
  text(fmt(xmin),left,bottom+13,muted,10);text(fmt(xmax),right,bottom+13,muted,10);text(fmt(ymax),left-7,top,muted,10,'right');text(fmt(ymin),left-7,bottom,muted,10,'right');
  return {point,curve,xmin,xmax,ymin,ymax,left,top,right,bottom,sx,sy,unpoint:([x,y])=>[xmin+(x-left)/sx,ymin+(bottom-y)/sy],layout:{xmin,xmax,ymin,ymax,left,top,right,bottom}};
 }
 function contributions(values,labels,y=h-62) {
  const max=Math.max(1,...values.map(Math.abs)),length=Math.min(w*.32,160),cx=w/2;
  values.forEach((value,i)=>{const yy=y+i*24,color=i?coral:blue;path([[cx,yy],[cx+length*value/max,yy]],color,8);text(labels[i]+(hide?'':` = ${fmt(value)}`),15,yy,color,compact?10:12,'left');});
 }
 function triangleScene(t,extra=false,alternate=[]) {
  if(!t.valid){text('Los datos no forman un triángulo',w/2,h/2);return {};}
  // Vertex C at origin, A=(b,0), B=(a cos C,a sin C). Labels pair each angle with its opposite side.
  const coords=[[0,0],[t.b,0],[t.a*Math.cos(rad(t.C)),t.a*Math.sin(rad(t.C))]];
  const alt=alternate.map(q=>[[0,0],[q.b,0],[q.a*Math.cos(rad(q.C)),q.a*Math.sin(rad(q.C))]]);
  let circleData=null;
  if(id==='law-of-sines'&&mode!==2){const ox=t.b/2,oy=(t.a*t.a-t.b*coords[2][0])/(2*coords[2][1]);circleData=[ox,oy,t.R];}
  const all=[...coords,...alt.flat()];if(circleData){const [x,y,R]=circleData;all.push([x-R,y-R],[x+R,y+R]);}
  const xs=all.map(q=>q[0]),ys=all.map(q=>q[1]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
  const s=v.frozen?.s||Math.min((w-90)/Math.max(2,xmax-xmin),(h-85)/Math.max(2,ymax-ymin)),cx=v.frozen?.cx??(w/2-(xmin+xmax)*s/2),cy=v.frozen?.cy??(h/2+(ymin+ymax)*s/2);
  const point=q=>[cx+q[0]*s,cy-q[1]*s],screen=coords.map(point);
  if(circleData){circle(point(circleData),circleData[2]*s,line);dot(point(circleData),muted,3);}
  alt.forEach(a=>{ctx.setLineDash([5,4]);path(a.map(point),coral,2,null,true);ctx.setLineDash([]);});
  path(screen,accent,2.5,accent+'15',true);screen.forEach(q=>dot(q,accent));
  const names=['C','A','B'];screen.forEach((q,i)=>text(`${names[i]}${hide?'':` ${fmt(t[names[i]])}°`}`,q[0]+(i===1?15:-12),q[1]+(i===2?-17:20),ink,compact?11:13));
  const edges=[[0,1,'b'],[0,2,'a'],[1,2,'c']];edges.forEach(([i,j,name])=>{const q=[(screen[i][0]+screen[j][0])/2,(screen[i][1]+screen[j][1])/2],secret=hide&&(name==='c'||id==='law-of-sines'&&name==='b');text(name+(secret?'':` = ${fmt(t[name])}`),q[0]+(name==='a'?-15:0),q[1]+(name==='b'?17:-13),name==='c'?coral:muted,compact?11:13);});
  if(extra&&id==='law-of-cosines'){const foot=point([coords[2][0],0]);ctx.setLineDash([4,4]);path([screen[2],foot],blue,1.5);ctx.setLineDash([]);dot(foot,blue,3);text(`a cos C = ${fmt(coords[2][0])}`,foot[0],Math.min(h-34,foot[1]+37),blue,compact?10:12);}
  if(extra&&id==='law-of-tangents'){text(`(A+B)/2 = ${fmt((t.A+t.B)/2)}°`,w/2,15,blue,12);footer(`(A−B)/2 = ${fmt((t.A-t.B)/2)}°`);}
  return {layout:{s,cx,cy},drag:([x,y])=>{const xx=(x-cx)/s,yy=Math.max(.1,(cy-y)/s);return {a:Math.hypot(xx,yy),C:deg(Math.atan2(yy,xx))};}};
 }
 if(id==='law-of-cosines'||id==='law-of-tangents')return triangleScene(triangle(p.a,p.b,p.C),mode===2);
 if(id==='law-of-sines') {
  if(mode===2){const ts=trianglesSSA(p.a,p.b,p.A);if(!ts.length){text('Ningún triángulo posible',w/2,h/2,coral,17);footer('El lado a no alcanza a cerrar el triángulo.');return {};}
   triangleScene(ts[0],false,ts.slice(1));text(`${ts.length} ${ts.length===1?'ruta':'rutas'} · a, b y A iguales`,w/2,14,ink,13);footer(ts.length===2?'Trazo coral: solución suplementaria de B.':'Los ángulos deben dejar C positivo.');return {};
  }
  const t=triangleASA(p.a,p.A,p.B);if(!t.valid){text('A + B debe ser menor de 180°',w/2,h/2,coral,15);return {};}
  triangleScene(t);footer(hide?'Lado a ↔ ángulo A · lado b ↔ B':`a/sin A = b/sin B = c/sin C = ${fmt(2*t.R)}`);return {};
 }
 if(id==='double-angle-formulas'||id==='angle-sum-formulas') {
  const alpha=p.theta??p.alpha,beta=p.theta??p.beta,t=rad(alpha),sum=rad(alpha+beta),values=angles(alpha,beta);
  if(mode===2&&id==='double-angle-formulas'){
   const g=plot(x=>Math.sin(rad(x)),{xmin:-180,xmax:360,ymin:-1.25,ymax:1.25});ctx.save();ctx.beginPath();ctx.rect(g.left,g.top,g.right-g.left,g.bottom-g.top);ctx.clip();g.curve(x=>Math.sin(2*rad(x)),coral);path([g.point(alpha,-1.25),g.point(alpha,1.25)],line,1);dot(g.point(alpha,Math.sin(t)),blue);dot(g.point(alpha,values.sin),coral);ctx.restore();text('sin θ',w*.3,13,accent);text('sin 2θ',w*.7,13,coral);return {layout:g.layout,drag:q=>({theta:g.unpoint(q)[0]})};
  }
  const R=Math.min(w*.32,(h-65)*.39),origin=[w/2,h/2],point=(x,y)=>[origin[0]+R*x,origin[1]-R*y];circle(origin,R,line);path([point(-1.2,0),point(1.2,0)],line,1);path([point(0,-1.2),point(0,1.2)],line,1);
  const a=point(Math.cos(t),Math.sin(t)),b=point(values.cos,values.sin);arrow(origin,a,blue);arrow(origin,b,coral);dot(b,coral,7);
  ctx.beginPath();ctx.arc(...origin,R*.55,-t,-sum,beta>0);ctx.strokeStyle=green;ctx.lineWidth=2;ctx.stroke();
  if(mode===2){const first=point(values.c1,values.s1);arrow(origin,first,blue);arrow(first,b,green);text('Primer aporte',w*.25,16,blue,11);text('Segundo aporte',w*.75,16,green,11);}
  else {text(`α${id==='double-angle-formulas'?' = θ':''} = ${fmt(alpha)}°`,w*.27,16,blue,12);text(`${id==='double-angle-formulas'?'2θ':'α+β'} = ${fmt(alpha+beta)}°`,w*.75,16,coral,12);}
  footer(hide?'Predice las componentes de la dirección final.':`cos = ${fmt(values.cos)} · sin = ${fmt(values.sin)}`);
  return {drag:([x,y])=>{let angle=deg(Math.atan2(origin[1]-y,x-origin[0]));if(id==='double-angle-formulas')return {theta:angle};return {beta:((angle-alpha+540)%360)-180};}};
 }
 if(id==='vietes-formulas') {
  const values=viete(p),xmin=-6,xmax=6,max=Math.max(8,Math.abs(values.evaluate(-3)),Math.abs(values.evaluate(3)));
  if(p.kind==='complex'){
   text(`r ± si = ${fmt(p.r)} ± ${fmt(p.s)}i`,w/2,14,ink,13);
   if(!compact)plot(values.evaluate,{xmin,xmax,ymin:-Math.min(max*.35,20),ymax:Math.min(max,80),right:w*.48});
   const g=plot(null,{xmin:-4,xmax:4,ymin:-4,ymax:4,left:compact?40:w*.57,right:w-25,top:40,bottom:h-40}),a=g.point(p.r,p.s),b=g.point(p.r,-p.s),o=g.point(0,0);
   ctx.setLineDash([4,4]);path([a,b],line,1);ctx.setLineDash([]);arrow(o,a,blue);arrow(o,b,coral);dot(a,blue,6);dot(b,coral,6);text('Re',g.right,g.point(0,0)[1]-12,muted,11);text('Im',g.point(0,0)[0]+12,g.top,muted,11);footer(p.s===0?'Una raíz real doble.':'Dos raíces conjugadas; ningún corte real.');return {};
  }
  const g=plot(values.evaluate,{xmin,xmax,ymin:-Math.min(max*.35,20),ymax:Math.min(max,80),...(v.frozen||{})});
  dot(g.point(p.r,0),blue,7);dot(g.point(p.s,0),coral,7);text(`x₁ = ${fmt(p.r)}`,g.point(p.r,0)[0],g.point(p.r,0)[1]-17,blue,11);text(`x₂ = ${fmt(p.s)}`,g.point(p.s,0)[0],g.point(p.s,0)[1]+19,coral,11);text(hide?'Raíces → suma y producto':`${fmt(p.a)}x² ${values.b<0?'−':'+'} ${fmt(Math.abs(values.b))}x ${values.c<0?'−':'+'} ${fmt(Math.abs(values.c))}`,w/2,13,ink,13);
  let selected=null;return {layout:g.layout,drag:q=>{const x=g.unpoint(q)[0];selected??=Math.abs(x-p.r)<Math.abs(x-p.s)?'r':'s';return {[selected]:x};}};
 }
 if(id==='binomial-theorem') {
  if(mode===2){const n=p.n,dy=Math.min((h-45)/(n+1),27),dx=Math.min((w-35)/(n+1),45),top=20;
   for(let row=0;row<=n;row++)for(let k=0;k<=row;k++){const x=w/2+(k-row/2)*dx,y=top+row*dy,selected=row===n&&k===p.k; if(selected){ctx.fillStyle=accent+'22';ctx.fillRect(x-dx*.45,y-dy*.4,dx*.9,dy*.8);}text(String(choose(row,k)),x,y,selected?accent:row===n?ink:muted,compact?10:12);}
   footer(p.k>n?'k está fuera de esta fila.':`Fila ${n} · posición ${p.k}: ${choose(n,p.k)} elecciones`);return {};
  }
  const b=binomial(p.a,p.b,p.n),max=Math.max(1,...b.terms.map(t=>Math.abs(t.value))),zero=h*.52,scale=(h-85)*.43/max,dx=(w-60)/b.terms.length;
  path([[25,zero],[w-15,zero]],line,1);
  b.terms.forEach((t,j)=>{const x=35+(j+.5)*dx,y=zero-t.value*scale;ctx.fillStyle=t.value>=0?blue:coral;ctx.fillRect(x-dx*.32,Math.min(y,zero),dx*.64,Math.max(1,Math.abs(y-zero)));text(`k=${j}`,x,h-34,muted,10);if(!hide&&(!compact||b.terms.length<=6))text(fmt(t.value),x,y+(t.value>=0?-12:12),ink,10);});
  text(hide?'Cada barra representa un término':`(${fmt(p.a)} + ${fmt(p.b)})^${p.n} = ${fmt(b.sum)}`,w/2,15,ink,14);footer('Azul: contribución positiva · coral: negativa');return {};
 }
 if(id==='simple-harmonic-motion') {
  const q=harmonic(p),cx=w/2,sy=h*.35,scale=Math.min(w*.18,130);
  if(mode===2){
   if(p.A===0){dot([w/2,h/2],accent,6);text('Amplitud cero: permanece en equilibrio',w/2,18,ink,compact?11:14);footer('Energía total = 0 J · sin órbita de fase');return {};}
   const R=Math.min(w*.29,h*.3),origin=[w/2,h*.43];circle(origin,R,line);const ex=R,ey=R*.7;
   ctx.beginPath();ctx.ellipse(...origin,ex,ey,0,0,TAU);ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.stroke();
   const point=[origin[0]+ex*(p.A? q.x/p.A:0),origin[1]-ey*(p.A? q.v/(p.A*q.omega):0)];dot(point,coral,7);text('x / A',origin[0]+ex+15,origin[1],muted,11);text('v / Aω',origin[0],origin[1]-ey-13,muted,11);text('Espacio de fases',w/2,13,ink,13);
   const total=q.energy||1,barw=Math.min(w-70,400),y=h-45;ctx.fillStyle=blue;ctx.fillRect((w-barw)/2,y,barw*q.U/total,8);ctx.fillStyle=coral;ctx.fillRect((w-barw)/2+barw*q.U/total,y,barw*q.K/total,8);footer(`U ${fmt(q.U)} J · K ${fmt(q.K)} J · total ${fmt(q.energy)} J`);return {};
  }
  const end=[cx+q.x*scale,sy],anchor=[45,sy],start=[60,sy];path([[45,sy-35],[45,sy+35]],line,3);
  const coils=Array.from({length:25},(_,j)=>[start[0]+(end[0]-30-start[0])*j/24,sy+(j===0||j===24?0:(j%2?11:-11))]);path(coils,accent,2);ctx.fillStyle=accent+'33';ctx.fillRect(end[0]-23,sy-23,46,46);path([[end[0]-23,sy-23],[end[0]+23,sy-23],[end[0]+23,sy+23],[end[0]-23,sy+23]],accent,2,null,true);
  ctx.setLineDash([4,4]);path([[cx,sy-45],[cx,sy+40]],line,1);ctx.setLineDash([]);text('equilibrio',cx,sy+53,muted,10);text(`t = ${fmt(p.t)} s`,w/2,14,ink,13);
  if(!hide&&Math.abs(q.v)>1e-8)arrow([end[0],sy-36],[end[0]+Math.max(-65,Math.min(65,q.v*22)),sy-36],coral);
  const g=plot(t=>harmonic({...p,t}).x,{xmin:0,xmax:2*q.T,ymin:-Math.max(.2,p.A*1.2),ymax:Math.max(.2,p.A*1.2),top:h*.65,bottom:h-30,left:40,right:w-20});dot(g.point(p.t%g.xmax,q.x),coral,4);return {};
 }
 if(id==='simple-pendulum-small-angle') {
  const q=pendulum(p),length=Math.min(h*.53,w*.2),top=37,centers=[w*.27,w*.73];
  [q.linear,q.theta].forEach((theta,i)=>{const origin=[centers[i],top],point=[origin[0]+length*Math.sin(theta),top+length*Math.cos(theta)],color=i?coral:blue;ctx.setLineDash([3,5]);path([origin,[origin[0],top+length]],line,1);ctx.setLineDash([]);path([origin,point],color,2);dot(origin,ink,3);dot(point,color,10);text(i?'No lineal':'Ángulo pequeño',origin[0],17,color,compact?11:13);});
  if(mode===2&&!hide){const g=plot(a=>pendulumPeriod(p.L,p.g,a).error,{xmin:0,xmax:150,ymin:0,ymax:80,top:h*.73,bottom:h-32});dot(g.point(p.amplitude,q.error),coral,5);text('Aumento del periodo (%)',w/2,h*.69,muted,11);}
  else footer(hide?'Predice el periodo antes de comprobar.':`t = ${fmt(p.t)} s · diferencia de periodo ${fmt(q.error)} %`);return {};
 }
 if(id==='fundamental-theorem-calculus') {
  const q=accumulation(p),curve=CURVES[p.curve],span=p.curve==='square'?10:3.5,g=plot(null,{xmin:-3.4,xmax:3.4,ymin:p.curve==='square'?-2:-3.5,ymax:span,top:30,bottom:h-42});
  ctx.save();ctx.beginPath();ctx.rect(g.left,g.top,g.right-g.left,g.bottom-g.top);ctx.clip();
  if(mode===2){for(const r of q.rectangles){const a=g.point(r.left,0),b=g.point(r.right,r.height);ctx.fillStyle=(r.height*(r.right-r.left)>=0?blue:coral)+'33';ctx.fillRect(Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]));}}
  else {const lo=Math.min(p.a,p.x),hi=Math.max(p.a,p.x);for(let j=0;j<120;j++){const a=lo+(hi-lo)*j/120,b=lo+(hi-lo)*(j+1)/120,y=curve.f((a+b)/2);path([g.point(a,0),g.point(a,y),g.point(b,y),g.point(b,0)],(y*(p.x-p.a)>=0?blue:coral)+'11',0,(y*(p.x-p.a)>=0?blue:coral)+'22',true);}}
  g.curve(curve.f,accent);path([g.point(p.x,g.ymin),g.point(p.x,g.ymax)],coral,1);dot(g.point(p.x,q.slope),coral,6);ctx.restore();text(curve.label,w*.27,14,accent,12);text(hide?'Área con signo':`A(x) = ${fmt(q.value)}`,w*.74,14,ink,12);footer(`a = ${fmt(p.a)} · x = ${fmt(p.x)}${hide?'':` · A′(x) = ${fmt(q.slope)}`}`);return {layout:g.layout,drag:z=>({x:g.unpoint(z)[0]})};
 }
 if(['chain-rule','product-rule','quotient-rule'].includes(id)) {
  const q=id==='chain-rule'?chain(p):id==='product-rule'?product(p):quotient(p),valid=q.valid!==false;
  if(id==='product-rule'&&mode===2&&q.f>0&&q.g>0&&q.f+p.h>0&&q.g+2*p.x*p.h+p.h*p.h>0){
   const df=p.h,dg=2*p.x*p.h+p.h*p.h,nextg=q.g+dg,scale=Math.min((w-95)/(q.f+df),(h-150)/Math.max(q.g,nextg)),left=(w-(q.f+df)*scale)/2,bottom=h-105;
   const rect=(x,y,width,height,color)=>{ctx.fillStyle=color+'33';ctx.fillRect(left+x*scale,bottom-(y+height)*scale,width*scale,height*scale);};
   rect(0,0,q.f,q.g,accent);rect(q.f,0,df,q.g,blue);rect(0,Math.min(q.g,nextg),q.f,Math.abs(dg),green);rect(q.f,Math.min(q.g,nextg),df,Math.abs(dg),coral);
   path([[left,bottom],[left+q.f*scale,bottom],[left+q.f*scale,bottom-q.g*scale],[left,bottom-q.g*scale]],accent,1.5,null,true);
   ctx.setLineDash([4,4]);path([[left,bottom],[left+(q.f+df)*scale,bottom],[left+(q.f+df)*scale,bottom-nextg*scale],[left,bottom-nextg*scale]],muted,1,null,true);ctx.setLineDash([]);
   text(`f = ${fmt(q.f)} · Δf = ${fmt(df)}`,w/2,16,blue,compact?11:13);text(`g = ${fmt(q.g)} · Δg = ${fmt(dg)}`,w/2,35,green,compact?11:13);
   contributions([q.first,q.second],['f′g','fg′']);footer(`Esquina ΔfΔg = ${fmt(df*dg,4)} · h = ${fmt(p.h)}`);return {};
  }
  const local=valid?Math.max(3,Math.abs(q.value)*.9):5,ycenter=valid?q.value:0;
  const g=plot(null,{xmin:p.x-2,xmax:p.x+2,ymin:ycenter-local,ymax:ycenter+local,top:mode===2?(compact?55:40):30,bottom:mode===2?h-105:h-42,...(v.frozen||{})});
  ctx.save();ctx.beginPath();ctx.rect(g.left,g.top,g.right-g.left,g.bottom-g.top);ctx.clip();
  if(id==='quotient-rule'){
   const pole=-p.shift;g.curve(x=>Math.abs(x-pole)<.025?NaN:q.evaluate(x),accent);
   if(pole>=g.xmin&&pole<=g.xmax){ctx.setLineDash([4,4]);path([g.point(pole,g.ymin),g.point(pole,g.ymax)],coral,1);ctx.setLineDash([]);}
  }else g.curve(q.evaluate,accent);
  if(valid){dot(g.point(p.x,q.value),coral,6);if(!hide){path([g.point(p.x-.5,q.value-.5*q.derivative),g.point(p.x+.5,q.value+.5*q.derivative)],blue,2);const sec=q.evaluate(p.x+p.h);if(Number.isFinite(sec)&&!q.secantCrossesPole)path([g.point(p.x,q.value),g.point(p.x+p.h,sec)],coral,1.5);}}
  ctx.restore();
  text(id==='chain-rule'?'Composición':id==='product-rule'?'Producto f · g':'Cociente f / g',w/2,13,ink,13);
  if(mode===2){if(id==='chain-rule'){text(`x = ${fmt(p.x)} → u = ${fmt(q.u)} → y = ${fmt(q.value)}`,w/2,compact?37:28,muted,compact?10:12);contributions([q.inner,q.outer],['g′(x)','f′(u)']);}else if(valid)contributions([q.first,q.second],id==='product-rule'?['f′g','fg′']:['f′/g','−fg′/g²']);}
  footer(valid?(hide?'Predice la pendiente en el punto.':q.secantCrossesPole?'El incremento cruza el polo: secante omitida.':`Azul: tangente ${fmt(q.derivative)} · coral: secante ${fmt(q.secant)}`):'g(x) = 0: punto fuera del dominio.');return {layout:g.layout,drag:z=>({x:g.unpoint(z)[0]})};
 }
 if(id==='hookes-law') {
  const q=hooke(p),cx=w/2,s=Math.min(w*.3,180),y=mode===2?h*.3:h*.47,end=cx+p.x*s;
  const points=Array.from({length:29},(_,j)=>[35+(end-30-35)*j/28,y+(j===0||j===28?0:j%2?12:-12)]);path(points,accent,2);path([[35,y-32],[35,y+32]],line,3);dot([end,y],q.valid?accent:coral,11);
  ctx.setLineDash([4,4]);path([[cx,y-40],[cx,y+40]],line,1);ctx.setLineDash([]);arrow([end,y-28],[end+Math.max(-70,Math.min(70,q.force*4)),y-28],coral);text(hide?'Fuerza hacia el equilibrio':`F = ${fmt(q.force)} N`,w/2,16,coral,13);text(`x = ${fmt(p.x)} m`,end,y+30,ink,12);
  if(mode===2){const g=plot(z=>p.k*z,{xmin:-1,xmax:1,ymin:-p.k,ymax:p.k,top:h*.56,bottom:h-35});path([g.point(0,0),g.point(p.x,0),g.point(p.x,p.k*p.x)],blue,1,blue+'22',true);text('F externa = kx',w/2,h*.53,blue,11);}footer(q.valid?'Dentro del rango calibrado':'Extrapolación fuera del rango calibrado');return {drag:([x])=>({x:(x-cx)/s})};
 }
 if(id==='generalized-hooke-law-plane-stress') {
  const q=planeStress(p),gain=q.drawingGain,ex=q.ex*gain,ey=q.ey*gain,ez=q.ez*gain,shear=q.exy*gain;
  const transform=([x,y,z])=>[x*(1+ex)+y*shear,y*(1+ey)+x*shear,z*(1+ez)];
  if(mode===2){
   const rotate=([x,y,z])=>{const u=x*Math.cos(v.yaw)-y*Math.sin(v.yaw),a=x*Math.sin(v.yaw)+y*Math.cos(v.yaw);return [u,a*Math.sin(v.pitch)-z*Math.cos(v.pitch),a*Math.cos(v.pitch)+z*Math.sin(v.pitch)];};
   const scale=Math.min(w*.23,h*.38),origin=[w/2,h*.48],project=q=>{const r=rotate(q);return [origin[0]+r[0]*scale,origin[1]+r[1]*scale,r[2]];};
   const base=[[-1,-1,-.12],[1,-1,-.12],[1,1,-.12],[-1,1,-.12],[-1,-1,.12],[1,-1,.12],[1,1,.12],[-1,1,.12]],deformed=base.map(transform);
   const faces=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]].map(face=>({face,depth:face.reduce((sum,i)=>sum+project(deformed[i])[2],0)/4})).sort((a,b)=>a.depth-b.depth);
   faces.forEach(({face})=>path(face.map(i=>project(deformed[i])),accent,1.3,accent+'22',true));
   for(let j=-1;j<=1.001;j+=.25){path([project(transform([j,-1,.12])),project(transform([j,1,.12]))],line,1);path([project(transform([-1,j,.12])),project(transform([1,j,.12]))],line,1);}
   const a=project(transform([1,0,0])),b=project(transform([0,1,0]));arrow(a,project(transform([1+(p.sx>=0?.5:-.5),0,0])),p.sx>=0?blue:coral);arrow(b,project(transform([0,1+(p.sy>=0?.5:-.5),0])),p.sy>=0?blue:coral);
   text('Caras z libres · espesor variable',w/2,16,ink,compact?12:14);footer(`Gira la placa · deformación ×${fmt(gain)}`);return {rotate:true};
  }
  const scale=Math.min(w*.26,h*.32),origin=[w/2,h*.48],project=([x,y])=>[origin[0]+x*scale,origin[1]-y*scale];
  ctx.setLineDash([4,4]);path([[-1,-1],[1,-1],[1,1],[-1,1]].map(project),line,1,null,true);ctx.setLineDash([]);
  for(let j=-1;j<=1.001;j+=.25){path([transform([j,-1,0]),transform([j,1,0])].map(project),accent,1.3);path([transform([-1,j,0]),transform([1,j,0])].map(project),accent,1.3);}
  for(const sign of [-1,1]){const a=project(transform([sign,0,0])),b=project(transform([0,sign,0]));if(p.sx)arrow(a,[a[0]+sign*Math.sign(p.sx)*35,a[1]],p.sx>0?blue:coral);if(p.sy)arrow(b,[b[0],b[1]-sign*Math.sign(p.sy)*35],p.sy>0?blue:coral);if(p.tau)arrow(project(transform([sign,.5,0])),project(transform([sign,.5+sign*Math.sign(p.tau)*.35,0])),green);}
  text('Malla deformada · referencia discontinua',w/2,14,muted,compact?10:13);footer(hide?`Dibujo amplificado ×${fmt(gain)}`:`εx ${fmt(q.ex*1e6)} με · εy ${fmt(q.ey*1e6)} με · ×${fmt(gain)}`);return {};
 }
 return {};
}
