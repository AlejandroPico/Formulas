export default function mount({root,canvas,controls,readout}){
root.classList.add('sim-wide','calc-wide','bio-hardy-sim');root.style.setProperty('--equation-color','#06b6d4');
const ctx=canvas.getContext('2d');controls.innerHTML='<label><span>frecuencia alélica p = F(A)</span><input id="p" type="range" min="0" max="1" step="0.01" value="0.60"><output>0.60</output></label>';
const pIn=controls.querySelector('#p'),out=controls.querySelector('output');
function size(){const b=canvas.getBoundingClientRect();canvas.width=Math.max(440,Math.floor(b.width||850));canvas.height=Math.max(380,Math.floor(b.height||530));return[canvas.width,canvas.height]}
function badge(t,x,y,c){ctx.font='12px monospace';ctx.fillStyle='rgba(15,23,42,.9)';ctx.fillRect(x-5,y-15,ctx.measureText(t).width+10,22);ctx.fillStyle=c;ctx.fillText(t,x,y)}
function bar(x,y,w,l,v,c){ctx.fillStyle='#1e293b';ctx.fillRect(x+100,y,w,28);ctx.fillStyle=c;ctx.fillRect(x+100,y,w*v,28);badge(l,x+12,y+19,c);badge((v*100).toFixed(1)+'%',x+108+w*v,y+19,'#e2e8f0')}
function pie(cx,cy,r,p){ctx.fillStyle='#2563eb';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+p*2*Math.PI);ctx.closePath();ctx.fill();ctx.fillStyle='#dc2626';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2+p*2*Math.PI,1.5*Math.PI);ctx.closePath();ctx.fill();badge('p / q',cx-18,cy+4,'#fff')}
function draw(){const p=+pIn.value,q=1-p,AA=p*p,Aa=2*p*q,aa=q*q;out.textContent=p.toFixed(2);const[W,H]=size();ctx.fillStyle='#020617';ctx.fillRect(0,0,W,H);ctx.fillStyle='#e2e8f0';ctx.font='bold 22px sans-serif';ctx.fillText('Hardy-Weinberg: frecuencias genotípicas',24,36);ctx.font='14px monospace';ctx.fillText('p + q = 1 ; p² + 2pq + q² = 1',24,64);const x=65,y=125,w=W*.43;bar(x,y,w,'AA = p²',AA,'#2563eb');bar(x,y+58,w,'Aa = 2pq',Aa,'#eab308');bar(x,y+116,w,'aa = q²',aa,'#dc2626');pie(W*.73,H*.46,72,p);badge('Alelo A: p',W*.66,H*.69,'#93c5fd');badge('Alelo a: q',W*.66,H*.75,'#fecaca');readout.innerHTML='<b>p='+p.toFixed(2)+' · q='+q.toFixed(2)+'</b><br>AA='+AA.toFixed(3)+' · Aa='+Aa.toFixed(3)+' · aa='+aa.toFixed(3)+' · suma='+(AA+Aa+aa).toFixed(3)}
pIn.oninput=draw;draw();return()=>{};
}
