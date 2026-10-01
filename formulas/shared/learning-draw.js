import { circle,trig,identities,vector,arithmetic,geometric,determinant,heron,quadratic,fmt } from './learning-math.js';
const TAU=2*Math.PI;
export function drawLab(ctx,w,h,id,p,view) {
  const {ink,muted,line,accent,background,hide,mode,yaw,pitch,phase=1}=view;
  ctx.clearRect(0,0,w,h); ctx.fillStyle=background; ctx.fillRect(0,0,w,h);
  const coral='#ce6d59',blue='#4d8db8',green='#409176';
  const text=(str,x,y,color=ink,size=14,align='center')=>{ctx.fillStyle=color;ctx.font=`${size}px system-ui, sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(str,x,y);};
  const path=(points,color=ink,width=2,fill=null,closed=false)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(closed)ctx.closePath();ctx.strokeStyle=color;ctx.lineWidth=width;if(fill){ctx.fillStyle=fill;ctx.fill();}ctx.stroke();};
  const dot=(x,y,color=accent,r=5)=>{ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=color;ctx.fill();};
  const disk=(x,y,r,fill=null,stroke=accent,width=2)=>{ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill();}ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();};
  const arrow=(a,b,color=accent)=>{path([a,b],color,2.5);const angle=Math.atan2(b[1]-a[1],b[0]-a[0]);path([[b[0]-10*Math.cos(angle-.4),b[1]-10*Math.sin(angle-.4)],b,[b[0]-10*Math.cos(angle+.4),b[1]-10*Math.sin(angle+.4)]],color,2.5);};
  const alpha=color=>color+'22';
  function plane(span=10) {
    const s=view.frozen?.s||Math.min((w-80)/(2*span),(h-70)/(2*span)),cx=w/2,cy=h/2;
    path([[25,cy],[w-25,cy]],line,1);path([[cx,25],[cx,h-25]],line,1);
    text('x',w-18,cy-13,muted,12);text('y',cx+14,18,muted,12);text('0',cx-12,cy+15,muted,11);
    const step=span<=6?1:Math.ceil(span/5);
    for(let t=step;t<span;t+=step)for(const sign of [-1,1]){const v=t*sign;path([[cx+v*s,cy-3],[cx+v*s,cy+3]],line,1);text(fmt(v),cx+v*s,cy+15,muted,10);path([[cx-3,cy-v*s],[cx+3,cy-v*s]],line,1);text(fmt(v),cx-12,cy-v*s,muted,10);}
    const point=(x,y)=>[cx+x*s,cy-y*s];
    return {s,cx,cy,point,layout:{s},unpoint:(x,y)=>[(x-cx)/s,(cy-y)/s]};
  }
  function scene(points) {
    const rotate=([x,y,z])=>{const u=x*Math.cos(yaw)-y*Math.sin(yaw),v=x*Math.sin(yaw)+y*Math.cos(yaw);return [u,v*Math.sin(pitch)-z*Math.cos(pitch),v*Math.cos(pitch)+z*Math.sin(pitch)];};
    const rotated=points.map(rotate); const xs=rotated.map(q=>q[0]),ys=rotated.map(q=>q[1]);
    const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
    const s=Math.min((w-110)/Math.max(5,xmax-xmin),(h-80)/Math.max(5,ymax-ymin));
    const cx=w/2-(xmin+xmax)*s/2,cy=h/2-(ymin+ymax)*s/2;
    const project=q=>{const r=rotate(q);return [cx+r[0]*s,cy+r[1]*s,r[2]];};
    return project;
  }
  if(id==='circle-area') {
    const R=Math.max(0,p.r),reference=Math.max(4,R),s=view.frozen?.s||Math.min((w-70)/((mode===2?3.5:2.2)*reference),(h-90)/((mode===2?1.2:2.2)*reference)),radius=R*s;
    if(mode===2) {
      const n=p.pieces,delta=TAU/n,half=n/2,t=p.spread*phase;
      const base=half*2*radius*Math.sin(delta/2),cx=w/2,cy=h/2;
      for(let i=0;i<n;i++) {
        const points=[],odd=i%2,slot=Math.floor(i/2);
        const targetX=cx-base/2+(slot+.5)*2*radius*Math.sin(delta/2)+(odd?radius*Math.sin(delta/2):0);
        const targetY=cy+(odd?-radius/2:radius/2);
        const rotation=(odd?Math.PI/2:-Math.PI/2)-(i+.5)*delta;
        const tx=cx*(1-t)+targetX*t,ty=cy*(1-t)+targetY*t;
        points.push([tx,ty]);
        for(let k=0;k<=12;k++){const a=i*delta+k*delta/12+rotation*t;points.push([tx+radius*Math.cos(a),ty+radius*Math.sin(a)]);}
        path(points,odd?blue:accent,1,alpha(odd?blue:accent),true);
      }
      if(t>.9) {text('base → πr',w/2,cy+radius/2+27,muted,13);text('altura → r',w/2,22,muted,13);}
      text(`${n} sectores · área conservada${hide?'':` = ${fmt(circle(R).area)} u²`}`,w/2,h-16,ink,13);
      return {};
    }
    const cx=w/2,cy=h/2;
    disk(cx,cy,radius,alpha(accent));path([[cx,cy],[cx+radius,cy]],accent,2);dot(cx,cy,ink,3);dot(cx+radius,cy,accent,7);
    text(`r = ${fmt(R)} u`,cx+radius/2,cy+20,ink,13);
    if(!hide)text(`A = ${fmt(circle(R).area)} u²`,cx,cy-radius-20,ink,16);
    if(view.solved && radius>25) {for(let j=0;j<7;j++){const a=j*2.39996;const rr=radius*.65*Math.sqrt(j/7);dot(cx+rr*Math.cos(a),cy+rr*Math.sin(a),green,5);} }
    return {drag:([x,y])=>({r:Math.hypot(x-cx,y-cy)/s}),handle:[cx+radius,cy],layout:{s}};
  }
  if(id==='circumference-length') {
    if(mode===2) {
      const n=p.n,R=Math.min(w,h)*.29,cx=w/2,cy=h/2;
      const poly=radius=>Array.from({length:n},(_,i)=>[cx+radius*Math.cos(i*TAU/n-Math.PI/2),cy+radius*Math.sin(i*TAU/n-Math.PI/2)]);
      path(poly(R/Math.cos(Math.PI/n)),coral,1.5,null,true);disk(cx,cy,R,null,ink,1);path(poly(R),accent,1.5,null,true);
      text(`${n} lados`,cx,cy,ink,18);
      text(`Dentro: ${fmt(2*n*p.r*Math.sin(Math.PI/n))} u`,w/2,h-39,accent,13);
      text(`Borde: ${fmt(2*Math.PI*p.r)} u · fuera: ${fmt(2*n*p.r*Math.tan(Math.PI/n))} u`,w/2,h-17,coral,12);
      return {};
    }
    // Fixed scale while rolling: the circle and its travelled distance share units.
    const turns=view.solved&&mode===0?p.turns*phase:p.turns,maxTurns=Math.max(2,p.turns),s=(w-65)/(p.r*(2+maxTurns*TAU)),R=p.r*s,ground=h*.7,x0=28+R,cx=x0+turns*TAU*R,cy=ground-R;
    path([[20,ground],[w-20,ground]],line,1);path([[x0,ground+9],[cx,ground+9]],accent,4);
    disk(cx,cy,R,alpha(accent),ink,2);const a=Math.PI/2+turns*TAU;const tip=[cx+R*Math.cos(a),cy+R*Math.sin(a)];path([[cx,cy],tip],accent,2);dot(...tip,accent,4);
    text('salida',x0,ground+34,muted,12);
    text(`${fmt(turns)} vueltas`,w/2,28,ink,16);
    if(!hide)text(`avance = ${fmt(turns*TAU*p.r)} u`,w/2,h-18,ink,14);
    return {drag:([x])=>({turns:(x-x0)/(TAU*R)}),handle:[cx,cy]};
  }
  if(id==='pythagorean-trig-identity') {
    const wave=mode===2,R=Math.min(w*(wave?.2:.34),h*.32),cx=wave?w*.24:w/2,cy=h/2;
    path([[cx-R-18,cy],[cx+R+18,cy]],line,1);path([[cx,cy-R-18],[cx,cy+R+18]],line,1);
    disk(cx,cy,R,null,line,1.5);const v=trig(p.theta),px=cx+R*v.x,py=cy-R*v.y;
    path([[cx,cy],[px,py]],ink,2);path([[cx,cy],[px,cy]],blue,3);path([[px,cy],[px,py]],coral,3);dot(px,py,accent,7);
    text(w<500?'cos':'cos θ',cx,cy+R+22,blue,13);text(w<500?'sin':'sin θ',cx,cy-R-22,coral,13);
    if(!hide)text(`(${fmt(v.x)} ; ${fmt(v.y)})`,cx,h-16,ink,13);
    if(wave) {
      const left=w*.53,right=w-25,sx=(right-left)/360,sy=R*.72;
      path([[left,cy],[right,cy]],line,1);
      for(const [fn,col] of [[Math.cos,blue],[Math.sin,coral]])path(Array.from({length:181},(_,i)=>[left+i*2*sx,cy-fn(i*2*Math.PI/180)*sy]),col,2);
      const x=left+p.theta*sx;path([[x,cy-sy-12],[x,cy+sy+12]],muted,1);dot(x,cy-v.x*sy,blue);dot(x,cy-v.y*sy,coral);
      text('0°',left,cy+sy+25,muted,11);text('360°',right-8,cy+sy+25,muted,11);
    }
    return {drag:([x,y])=>({theta:(Math.atan2(cy-y,x-cx)*180/Math.PI+360)%360}),handle:[px,py]};
  }
  if(id==='notable-identities') {
    const {a,b,identity}=p;
    if(a<0||b<0||(identity!=='sum'&&b>a)) {
      const vals=identity==='sum'?[a*a,a*b,a*b,b*b]:identity==='difference'?[a*a,-a*b,-a*b,b*b]:[a*a,-a*b,a*b,-b*b];
      const cols=[accent,blue,coral,green],step=w/4;
      vals.forEach((v,i)=>{text(`${v>=0?'+':'−'}${fmt(Math.abs(v))}`,step*(i+.5),h*.45,cols[i],w<500?21:34);text(['a·a',identity==='sum'?'a·b':'a·(−b)',identity==='difference'?'(−b)·a':'b·a',identity==='product'?'b·(−b)':identity==='difference'?'(−b)·(−b)':'b·b'][i],step*(i+.5),h*.6,muted,13);});
      text('Productos algebraicos con signo · no son longitudes negativas',w/2,h-25,muted,w<500?10:13);
      return {};
    }
    const side=Math.min(w-70,h-70),s=side/Math.max(a+b,1),A=a*s,B=b*s,x=(w-(a+b)*s)/2,y=(h-(a+b)*s)/2;
    const rect=(rx,ry,rw,rh,color,label)=>{ctx.fillStyle=alpha(color);ctx.fillRect(rx,ry,rw,rh);ctx.strokeStyle=color;ctx.lineWidth=1;ctx.strokeRect(rx,ry,rw,rh);if(rw>32&&rh>22)text(label,rx+rw/2,ry+rh/2,color,14);};
    if(identity==='sum') {rect(x,y,A,A,accent,'a²');rect(x+A,y,B,A,blue,'ab');rect(x,y+A,A,B,blue,'ab');rect(x+A,y+A,B,B,coral,'b²');}
    else if(identity==='difference') {
      const sx=(w-A)/2,sy=(h-A)/2;
      rect(sx,sy,A,A,accent,'');rect(sx+A-B,sy,B,A,coral,'−ab');rect(sx,sy+A-B,A,B,coral,'−ab');rect(sx+A-B,sy+A-B,B,B,green,'+b²');
      rect(sx,sy,A-B,A-B,accent,'(a−b)²');
    } else {
      const sx=(w-A)/2,sy=(h-A)/2;rect(sx,sy,A,A,accent,'a²');rect(sx+A-B,sy+A-B,B,B,coral,'−b²');
      text('a² − b² = (a+b)(a−b)',w/2,h-16,ink,13);
    }
    if(!hide&&identity!=='product')text(`valor = ${fmt(identities(a,b,identity).value)}`,w/2,h-16,ink,13);
    return {};
  }
  if(id==='euclidean-norm') {
    const z=p.dimension===2?0:p.z, v=vector(p.x,p.y,z),isUnit=mode===2;
    if(p.dimension===2) {
      const plot=plane(Math.max(4,Math.abs(p.x),Math.abs(p.y))+1),o=plot.point(0,0),q=plot.point(p.x,p.y);
      path([o,plot.point(p.x,0),q],line,2);arrow(o,q,accent);dot(...q,accent,6);
      if(isUnit&&v.unit)arrow(o,plot.point(v.unit[0],v.unit[1]),green);
      text(`x = ${fmt(p.x)} · y = ${fmt(p.y)}`,w/2,h-17,muted,13);
      return {drag:([x,y])=>{const [px,py]=plot.unpoint(x,y);return {x:px,y:py};},handle:q,layout:plot.layout};
    }
    const endpoints=[[0,0,0],[p.x,0,0],[p.x,p.y,0],[p.x,p.y,z]],extent=Math.max(3,Math.abs(p.x),Math.abs(p.y),Math.abs(z));
    const axes=[[extent,0,0],[0,extent,0],[0,0,extent]],project=scene([...endpoints,...axes,...axes.map(q=>q.map(t=>-t))]);
    const o=project([0,0,0]); axes.forEach((q,i)=>{path([project(q.map(t=>-t)),project(q)],line,1);text(['x','y','z'][i],...project(q).slice(0,2),[blue,green,coral][i],13);});
    for(let i=1;i<endpoints.length;i++)path([project(endpoints[i-1]),project(endpoints[i])],line,2);
    const q=project([p.x,p.y,z]);arrow(o,q,accent);dot(q[0],q[1],accent,7);
    // A small drone marker sits at the actual endpoint of the spatial displacement.
    if(mode===0){const marker=view.solved?projDrone(phase):q;path([[marker[0]-10,marker[1]-5],[marker[0]+10,marker[1]+5]],accent,2);path([[marker[0]-10,marker[1]+5],[marker[0]+10,marker[1]-5]],accent,2);}
    function projDrone(t){return project([p.x*t,p.y*t,z*t]);}
    if(isUnit&&v.unit) {arrow(o,project(v.unit),green);text('verde: dirección de norma 1',w/2,h-16,green,12);}
    else text(`(${fmt(p.x)} ; ${fmt(p.y)} ; ${fmt(z)}) · arrastra para girar`,w/2,h-16,muted,12);
    return {rotate:true};
  }
  if(id==='arithmetic-progression-sum'||id==='geometric-progression-sum') {
    const ar=id==='arithmetic-progression-sum',v=ar?arithmetic(p.a,p.d,p.n):geometric(p.a,p.r,p.n),pair=ar&&mode===2;
    const vals=ar?v.terms:[...v.terms,...v.partial,...(mode===2&&v.limit!==null?[v.limit]:[])];
    const max=Math.max(1,...vals),min=Math.min(0,...vals),top=40,bottom=h-(pair?55:35),scale=(bottom-top)/(max-min),zero=bottom+min*scale,step=(w-65)/p.n;
    path([[28,zero],[w-20,zero]],line,1);text('0',15,zero,muted,11);
    v.terms.forEach((term,i)=>{const x=32+(i+.5)*step,y=zero-term*scale;
      ctx.fillStyle=alpha(term<0?coral:accent);ctx.fillRect(x-step*.3,Math.min(y,zero),step*.6,Math.max(1,Math.abs(y-zero)));ctx.strokeStyle=term<0?coral:accent;ctx.lineWidth=1;ctx.strokeRect(x-step*.3,Math.min(y,zero),step*.6,Math.max(1,Math.abs(y-zero)));
      if(p.n<=12){if(!hide)text(fmt(term,2),x,y+(term>=0?-10:10),ink,11);text(String(i+1),x,h-16,muted,11);}
    });
    if(!ar) {
      path(v.partial.map((t,i)=>[32+(i+.5)*step,zero-t*scale]),blue,2.5);
      v.partial.forEach((t,i)=>dot(32+(i+.5)*step,zero-t*scale,blue,3));
      if(mode===2&&v.limit!==null){ctx.setLineDash([5,5]);path([[28,zero-v.limit*scale],[w-20,zero-v.limit*scale]],green,1.5);ctx.setLineDash([]);text(`limite = ${fmt(v.limit)}`,w-24,zero-v.limit*scale-13,green,12,'right');}
      text(ar?'':'barras: términos · azul: acumulados',w/2,18,muted,12);
    }
    if(pair) {
      if(v.terms.every(t=>t>=0)) {
        const S=p.a+v.last,ps=(h-85)/Math.max(S,1),base=h-40;
        ctx.clearRect(0,0,w,h);ctx.fillStyle=background;ctx.fillRect(0,0,w,h);
        v.terms.forEach((term,i)=>{const x=32+i*step,y=base-term*ps,other=v.terms[p.n-1-i];ctx.fillStyle=alpha(accent);ctx.fillRect(x,y,step*.8,term*ps);ctx.strokeStyle=accent;ctx.strokeRect(x,y,step*.8,term*ps);ctx.fillStyle=alpha(blue);ctx.fillRect(x,y-other*ps*phase,step*.8,other*ps*phase);ctx.strokeStyle=blue;ctx.strokeRect(x,y-other*ps*phase,step*.8,other*ps*phase);});
        text(`Cada columna: a₁ + aₙ = ${fmt(S)}`,w/2,20,ink,14);text('dos copias → 2Sₙ = n(a₁+aₙ)',w/2,h-16,muted,13);
      } else {
        const pairs=Array.from({length:Math.ceil(p.n/2)},(_,i)=>`${fmt(v.terms[i])} + ${fmt(v.terms[p.n-1-i])} = ${fmt(p.a+v.last)}`);
        text(pairs.slice(0,3).join('    ·    '),w/2,18,ink,w<500?10:13);text('Con signos, la igualdad sigue siendo algebraica',w/2,h-16,muted,12);
      }
    }
    return {};
  }
  if(id==='determinants-2x2-3x3') {
    const dim=p.dimension,m=dim===2?p.m2:p.m3,v=determinant(m,dim);
    if(mode===2) {
      const labels=dim===2?['ad','bc']:['aei','bfg','cdh','ceg','afh','bdi']; const vals=[...v.positive,...v.negative];
      const cols=dim===2?2:3,rows=dim===2?1:2,sx=w/(cols+1),sy=(h-50)/(rows+1);
      vals.forEach((t,i)=>{const col=i%cols,row=Math.floor(i/cols),positive=i<v.positive.length; text(`${positive?'+':'−'} (${fmt(t)})`,sx*(col+1),sy*(row+1),positive?accent:coral,w<500?18:27);text(labels[i],sx*(col+1),sy*(row+1)+28,muted,14);});
      text(`Σ positivos − Σ negativos = ${fmt(v.det)}`,w/2,h-20,ink,14);return {};
    }
    if(dim===2) {
      const [a,b,c,d]=m,pts=[[0,0],[a,c],[a+b,c+d],[b,d]],span=Math.max(3,...pts.flat().map(Math.abs))+1,plot=plane(span),o=plot.point(0,0),q=plot.point(b,d);
      path(pts.map(([x,y])=>plot.point(x,y)),accent,2,alpha(accent),true);arrow(o,plot.point(a,c),blue);arrow(o,q,coral);dot(...q,coral,6);
      text('azul: columna 1 · coral: columna 2',w/2,h-16,muted,12);
      return {drag:([x,y])=>{const [b,d]=plot.unpoint(x,y);return {m2:[a,b,c,d]};},handle:q,layout:plot.layout};
    }
    const a=[m[0],m[3],m[6]],b=[m[1],m[4],m[7]],c=[m[2],m[5],m[8]];
    const pts=Array.from({length:8},(_,mask)=>a.map((t,i)=>(mask&1?t:0)+(mask&2?b[i]:0)+(mask&4?c[i]:0)));
    const proj=scene(pts),faces=[[0,1,3,2],[4,5,7,6],[0,1,5,4],[2,3,7,6],[0,2,6,4],[1,3,7,5]];
    faces.sort((f,g)=>f.reduce((s,i)=>s+proj(pts[i])[2],0)-g.reduce((s,i)=>s+proj(pts[i])[2],0));
    for(const face of faces)path(face.map(i=>proj(pts[i])),accent,1,alpha(accent),true);
    const o=proj([0,0,0]);[a,b,c].forEach((q,i)=>{const end=proj(q);arrow(o,end,[blue,green,coral][i]);text(`c${i+1}`,end[0]+10,end[1]-10,[blue,green,coral][i],12);});
    text('Columnas → aristas · arrastra para girar',w/2,h-16,muted,12);return {rotate:true};
  }
  if(id==='heron-formula') {
    const v=heron(p.a,p.b,p.c);
    if(v.kind==='invalid'){text('Estos lados no cierran un triángulo',w/2,h/2-16,coral,w<500?15:21);text(`${fmt(Math.max(p.a,p.b,p.c))} > suma de los otros dos`,w/2,h/2+18,muted,13);return {};}
    const xmin=Math.min(0,v.x),xmax=Math.max(p.c,v.x),s=view.frozen?.s||Math.min((w-80)/Math.max(1,xmax-xmin),(h-85)/Math.max(2,v.height)),ox=view.frozen?.ox??((w-(xmax-xmin)*s)/2-xmin*s),oy=h-45;
    const P=[ox,oy],Q=[ox+p.c*s,oy],T=[ox+v.x*s,oy-v.height*s];
    path([P,Q,T],accent,2,alpha(accent),true);dot(...T,accent,7);
    text(`c = ${fmt(p.c)}`,w/2,oy+22,ink,13);
    text(`a = ${fmt(p.a)}`,(Q[0]+T[0])/2+15,(Q[1]+T[1])/2,coral,12);text(`b = ${fmt(p.b)}`,(P[0]+T[0])/2-15,(P[1]+T[1])/2,blue,12);
    if(mode===2){ctx.setLineDash([4,4]);path([T,[T[0],oy]],muted,1.5);path([[Math.min(T[0],P[0]),oy],[Math.max(T[0],Q[0]),oy]],line,1);ctx.setLineDash([]);text(`h = ${fmt(v.height)}`,T[0]+32,(T[1]+oy)/2,muted,12);}
    if(!hide)text(`A = ${fmt(v.area)} u²`,w/2,20,ink,16);
    return {drag:([x,y])=>{const px=(x-ox)/s,py=Math.max(0,(oy-y)/s);return {a:Math.hypot(px-p.c,py),b:Math.hypot(px,py)};},handle:T,layout:{s,ox}};
  }
  if(id==='quadratic-formula') {
    const v=quadratic(p.a,p.b,p.c),span=Math.min(24,Math.max(5,...v.roots.map(Math.abs),...(v.vertex?[Math.abs(v.vertex[0])+2]:[])));
    const plot=plane(span),curve=Array.from({length:241},(_,i)=>{const x=-span+2*span*i/240;return plot.point(x,p.a*x*x+p.b*x+p.c);});
    ctx.save();ctx.beginPath();ctx.rect(20,20,w-40,h-40);ctx.clip();path(curve,accent,2.5);ctx.restore();
    for(const r of v.roots){const q=plot.point(r,0);if(q[0]>20&&q[0]<w-20){dot(...q,green,6);if(!hide)text(fmt(r),q[0],q[1]+19,green,12);}}
    if(v.vertex){const q=plot.point(...v.vertex);if(q[0]>=20&&q[0]<=w-20&&q[1]>=20&&q[1]<=h-20){dot(...q,coral,7);if(mode===2)text('vértice',q[0],q[1]-18,coral,12);}}
    text(`y = ${fmt(p.a)}x² + (${fmt(p.b)})x + (${fmt(p.c)})`,w/2,15,muted,w<500?11:13);
    if(mode===2&&v.vertex)text(`y = ${fmt(p.a)}(x − (${fmt(v.vertex[0])}))² + (${fmt(v.vertex[1])})`,w/2,h-14,ink,w<500?11:13);
    return v.vertex?{drag:([x,y])=>{const [vx,vy]=plot.unpoint(x,y);return {b:-2*p.a*vx,c:p.a*vx*vx+vy};},handle:plot.point(...v.vertex),layout:plot.layout}:{};
  }
  return {};
}
