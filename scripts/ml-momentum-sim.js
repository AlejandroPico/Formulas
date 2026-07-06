export default function mount({root,canvas,controls,readout}){
root.classList.add('sim-wide','calc-wide','ml-momentum-sim');root.style.setProperty('--equation-color','#ea580c');
const ctx=canvas.getContext('2d');let theta=-3.5,vel=0,raf=0;
controls.innerHTML='<label><span>momento γ</span><input id="g" type="range" min="0.50" max="0.98" step="0.04" value="0.90"><output>0.90</output></label><button type="button" id="reset">reiniciar partícula</button>';
const gamma=controls.querySelector('#g'),out=controls.querySelector('output'),reset=controls.querySelector('#reset');
function cost(x){return Math.cos(2*x)*15+x*x*5}function grad(x){return -Math.sin(2*x)*30+x*10}
function size(){const b=canvas.getBoundingClientRect();canvas.width=Math.max(440,Math.floor(b.width||850));canvas.height=Math.max(380,Math.floor(b.height||530));return[canvas.width,canvas.height]}
function draw(){const g=+gamma.value;out.textContent=g.toFixed(2);const gr=grad(theta);vel=g*vel+.025*gr;theta-=vel;const[W,H]=size();ctx.fillStyle='#020617';ctx.fillRect(0,0,W,H);ctx.fillStyle='#e2e8f0';ctx.font='bold 22px sans-serif';ctx.fillText('Descenso de gradiente con momento',24,36);ctx.font='14px monospace';ctx.fillText('v_t = γv_{t−1}+η∇J(θ),   θ ← θ − v_t',24,64);const cx=W/2,cy=H-85,sx=W/9;ctx.strokeStyle='#334155';ctx.lineWidth=1.5;ctx.beginPath();for(let px=0;px<W;px++){const x=(px/W-.5)*8,y=cy-cost(x);if(px)ctx.lineTo(px,y);else ctx.moveTo(px,y)}ctx.stroke();const px=cx+theta*sx,py=cy-cost(theta);ctx.fillStyle='#ea580c';ctx.beginPath();ctx.arc(px,py,8,0,7);ctx.fill();ctx.strokeStyle='#fbbf24';ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-vel*70,py);ctx.stroke();readout.innerHTML='<b>θ='+theta.toFixed(4)+' · v_t='+vel.toFixed(4)+' · ∇J='+gr.toFixed(2)+'</b><br>El momento acumula dirección y ayuda a atravesar valles oscilantes o mínimos locales suaves.';raf=requestAnimationFrame(draw)}
reset.onclick=()=>{theta=-3.5;vel=0};draw();return()=>cancelAnimationFrame(raf);
}
