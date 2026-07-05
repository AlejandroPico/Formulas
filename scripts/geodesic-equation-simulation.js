const DEFAULTS={curv:55,impact:-45,speed:3.4};
export default function mount({root,canvas,controls,readout}){
  root.classList.add('sim-wide','calc-wide','geodesic-deep-sim');
  root.style.setProperty('--equation-color','#38bdf8');
  Object.assign(readout.style,{overflow:'visible',maxHeight:'none',color:'#e2e8f0',lineHeight:'1.35'});
  const ctx=canvas.getContext('2d');
  const state={...DEFAULTS};
  let raf=0,phase=0,lastPath=[];
  controls.innerHTML='';
  addSlider('curv','curvatura Γ',0,100,1,state.curv,'%');
  addSlider('impact','parámetro de impacto',-95,95,5,state.impact,'');
  addSlider('speed','velocidad inicial',1.8,5.2,.1,state.speed,'');
  function addSlider(key,label,min,max,step,value,suffix){
    const el=document.createElement('label');
    el.innerHTML=`<span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output>${fmt(value,step)}${suffix}</output>`;
    controls.appendChild(el);
    const input=el.querySelector('input'),out=el.querySelector('output');
    input.addEventListener('input',()=>{state[key]=+input.value;out.textContent=fmt(state[key],step)+suffix;draw()});
  }
  function size(){const b=canvas.getBoundingClientRect();canvas.width=Math.max(420,Math.floor(b.width||820));canvas.height=Math.max(360,Math.floor(b.height||520));return[canvas.width,canvas.height]}
  function draw(){const[W,H]=size();ctx.fillStyle='#020617';ctx.fillRect(0,0,W,H);header(W,H);const geo=compute(W,H);lastPath=geo.path;drawWarpedGrid(W,H,geo.mass.x,geo.mass.y,geo.k);drawReferenceLine(geo);drawMass(geo.mass.x,geo.mass.y,geo.k);drawPath(geo.path,'#38bdf8',4);drawTangents(geo.path,H);drawParticle(geo.path);drawPanels(W,H,geo);readout.innerHTML=summary(geo)}
  function header(W,H){ctx.fillStyle='#e2e8f0';ctx.font='bold 23px sans-serif';ctx.fillText('Ecuación geodésica: recta local en geometría curva',24,34);ctx.font='15px monospace';ctx.fillText('d²xμ/ds² + Γμαβ (dxα/ds)(dxβ/ds) = 0',24,62)}
  function compute(W,H){const k=state.curv/100,mass={x:W*.58,y:H*.55},start={x:54,y:H*.55+state.impact},path=[],straight=[];let x=start.x,y=start.y,vx=state.speed,vy=0;let closest=1e9;for(let i=0;i<260;i++){straight.push({x:start.x+i*state.speed*.78,y:start.y});const dx=x-mass.x,dy=y-mass.y,r2=dx*dx+dy*dy+380,rr=Math.sqrt(r2);closest=Math.min(closest,rr);const a=-k*5200/(r2*rr);vx+=a*dx*.16;vy+=a*dy*.16;x+=vx*.72;y+=vy*.72;path.push({x,y,vx,vy});if(x>W-25||y<82||y>H-24)break}const p0=path[8]||path[0],p1=path[path.length-10]||path[path.length-1];const ang0=Math.atan2((path[18]||p0).y-p0.y,(path[18]||p0).x-p0.x);const ang1=Math.atan2(p1.y-(path[path.length-24]||p1).y,p1.x-(path[path.length-24]||p1).x);const def=(ang1-ang0)*180/Math.PI;return{k,mass,start,path,straight,closest,deflection:def,term:k*state.speed*state.speed}}
  function drawWarpedGrid(W,H,cx,cy,k){ctx.save();ctx.strokeStyle='rgba(148,163,184,.28)';ctx.lineWidth=1;for(let j=-9;j<=9;j++){ctx.beginPath();for(let x=20;x<=W-20;x+=12){const dy=j*22,dx=x-cx,r=Math.sqrt(dx*dx+dy*dy),sink=k*74*Math.exp(-r*.015),y=cy+dy+sink;if(x===20)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()}for(let i=-12;i<=12;i++){ctx.beginPath();for(let y=88;y<=H-28;y+=12){const dx=i*28,dy=y-cy,r=Math.sqrt(dx*dx+dy*dy),pull=k*24*Math.exp(-r*.014),x=cx+dx+(dx>0?pull:-pull);if(y===88)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()}ctx.restore()}
  function drawReferenceLine(g){ctx.save();ctx.setLineDash([7,7]);ctx.strokeStyle='rgba(226,232,240,.45)';ctx.lineWidth=2;ctx.beginPath();g.straight.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.setLineDash([]);badge('gris: trayectoria plana Γ=0',g.start.x+18,g.start.y-16,'#cbd5e1');ctx.restore()}
  function drawMass(x,y,k){const r=18+22*k;const grad=ctx.createRadialGradient(x,y,4,x,y,r+58);grad.addColorStop(0,'#0f172a');grad.addColorStop(.38,'rgba(56,189,248,.30)');grad.addColorStop(1,'rgba(56,189,248,0)');ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,r+58,0,7);ctx.fill();ctx.fillStyle='#030712';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.strokeStyle='#38bdf8';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r+2,0,7);ctx.stroke();badge('masa / curvatura',x-r-25,y+r+24,'#93c5fd')}
  function drawPath(path,col,w){ctx.save();ctx.shadowColor=col;ctx.shadowBlur=12;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();path.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore()}
  function drawTangents(path,H){ctx.save();for(let i=38;i<path.length-1;i+=44){const p=path[i],q=path[i+1],ang=Math.atan2(q.y-p.y,q.x-p.x);arrow(p.x,p.y,Math.cos(ang)*30,Math.sin(ang)*30,'#f59e0b','')}badge('flechas amarillas: rectitud local',38,Math.max(230,H-92),'#fbbf24');ctx.restore()}
  function drawParticle(path){if(!path.length)return;phase=(phase+.008)%1;const p=path[Math.min(path.length-1,Math.floor(phase*(path.length-1)))];ctx.fillStyle='#ef4444';ctx.beginPath();ctx.arc(p.x,p.y,7,0,7);ctx.fill();ctx.strokeStyle='#fecaca';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,12,0,7);ctx.stroke()}
  function drawPanels(W,H,g){const x=W*.64,y=92,w=W*.32;box(x,y,w,148,'#0f172a','#334155');ctx.fillStyle='#e2e8f0';ctx.font='bold 14px sans-serif';ctx.fillText('Qué hace la ecuación',x+14,y+24);ctx.font='12px monospace';ctx.fillText('1) sin Γ: recta gris',x+14,y+52);ctx.fillText('2) con Γ: recta local',x+14,y+75);ctx.fillText('3) vista global: curva',x+14,y+98);ctx.fillText('4) no es fuerza añadida:',x+14,y+121);ctx.fillText('   es geometría',x+14,y+139);const bx=W*.64,by=y+168;bar(bx,by,w,'Γ',g.k,'#38bdf8',1);bar(bx,by+36,w,'Γ·v²',g.term,'#f59e0b',28);bar(bx,by+72,w,'desvío °',Math.abs(g.deflection),'#ef4444',90);box(24,82,W*.36,92,'rgba(15,23,42,.82)','#334155');ctx.fillStyle='#e2e8f0';ctx.font='13px monospace';ctx.fillText('Lectura de la fórmula:',40,108);ctx.fillText('aceleración coordenada + término geométrico = 0',40,132);ctx.fillStyle='#93c5fd';ctx.fillText('x¨ compensa Γ·x˙·x˙ para conservar caída libre',40,156)}
  function summary(g){return `<b>Γ=${g.k.toFixed(2)} · v=${state.speed.toFixed(1)} · impacto=${state.impact.toFixed(0)} · desvío≈${g.deflection.toFixed(1)}°</b><br><span style="display:block;color:#e2e8f0;font-size:.92em;line-height:1.35;">Gris: espacio plano. Azul: geodésica. Amarillo: tangente local; avanza recto localmente en geometría curvada.</span>`}
  function box(x,y,w,h,fill,stroke){ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h)}
  function bar(x,y,w,t,val,col,max){ctx.fillStyle='#1e293b';ctx.fillRect(x,y,w,24);ctx.fillStyle=col;ctx.fillRect(x,y,w*Math.max(0,Math.min(1,val/max)),24);ctx.fillStyle='#e2e8f0';ctx.font='12px monospace';ctx.fillText(`${t}: ${Number(val).toFixed(2)}`,x+8,y+16)}
  function arrow(x,y,dx,dy,col,txt){ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.stroke();const a=Math.atan2(dy,dx);ctx.beginPath();ctx.moveTo(x+dx,y+dy);ctx.lineTo(x+dx-8*Math.cos(a-.45),y+dy-8*Math.sin(a-.45));ctx.lineTo(x+dx-8*Math.cos(a+.45),y+dy-8*Math.sin(a+.45));ctx.closePath();ctx.fill();if(txt)label(txt,x+dx+8,y+dy-8,col)}
  function label(t,x,y,col){ctx.fillStyle=col;ctx.font='12px monospace';ctx.fillText(t,x,y)}
  function badge(t,x,y,col){ctx.font='12px monospace';const pad=6,w=ctx.measureText(t).width+pad*2;ctx.fillStyle='rgba(15,23,42,.88)';ctx.fillRect(x-pad,y-15,w,22);ctx.strokeStyle='rgba(148,163,184,.35)';ctx.strokeRect(x-pad,y-15,w,22);ctx.fillStyle=col;ctx.fillText(t,x,y)}
  function fmt(v,step){return step<1?(+v).toFixed(1):(+v).toFixed(0)}
  const ro=new ResizeObserver(draw);ro.observe(root);draw();raf=requestAnimationFrame(loop);function loop(){draw();raf=requestAnimationFrame(loop)}
  return()=>{cancelAnimationFrame(raf);ro.disconnect()}
}
