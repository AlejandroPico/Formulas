export default function mount({root,canvas,controls,readout}){
  root.classList.add('sim-wide','calc-wide','bio-pop-sim');
  root.style.setProperty('--equation-color','#16a34a');
  const ctx=canvas.getContext('2d');
  controls.innerHTML='<label><span>Parámetro didáctico</span><input type="range" min="0" max="1" step="0.01" value="0.5"><output>0.50</output></label>';
  const input=controls.querySelector('input');
  const output=controls.querySelector('output');
  function draw(){
    const v=Number(input.value);output.textContent=v.toFixed(2);
    const b=canvas.getBoundingClientRect();canvas.width=Math.max(440,Math.floor(b.width||850));canvas.height=Math.max(380,Math.floor(b.height||530));
    const W=canvas.width,H=canvas.height;
    ctx.fillStyle='#020617';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#e2e8f0';ctx.font='bold 22px sans-serif';ctx.fillText('Simulación biológica interactiva',24,36);
    ctx.font='14px monospace';ctx.fillText('Módulo base del paquete de biofísica, evolución y epidemiología',24,64);
    const x=70,y=H-80,w=W-150,h=H-160;
    ctx.strokeStyle='#334155';ctx.beginPath();ctx.moveTo(x,y-h);ctx.lineTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();
    ctx.strokeStyle='#16a34a';ctx.lineWidth=3;ctx.beginPath();
    for(let i=0;i<=220;i++){const p=i/220;const yy=y-(0.15+0.75/(1+Math.exp(-12*(p-v))))*h;if(i)ctx.lineTo(x+p*w,yy);else ctx.moveTo(x+p*w,yy)}
    ctx.stroke();
    readout.innerHTML='<b>Simulador base activo.</b><br>El lote está registrado; se puede ampliar visualmente por temas sin romper la carga.';
  }
  input.addEventListener('input',draw);draw();
  return()=>{};
}
