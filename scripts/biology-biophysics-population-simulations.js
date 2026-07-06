const topic=new URL(import.meta.url).searchParams.get('topic')||'neuralNernst';
const MAP={neuralNernst:'bio-neural-nernst-sim.js',hodgkin:'bio-hodgkin-huxley-sim.js',replicator:'bio-replicator-sim.js',hardy:'bio-hardy-weinberg-sim.js',gompertz:'bio-gompertz-sim.js',seir:'bio-seir-sim.js',sir:'bio-sir-sim.js'};
export default function mount(args){
  let cleanup=null,disposed=false;
  const file=MAP[topic]||MAP.neuralNernst;
  import('./'+file+'?v=20260705p').then(mod=>{
    if(disposed)return;
    cleanup=mod.default(args);
  }).catch(err=>{
    const {root,canvas,controls,readout}=args;
    root.classList.add('sim-wide','calc-wide','bio-pop-sim');
    const ctx=canvas.getContext('2d');
    controls.innerHTML='';
    const b=canvas.getBoundingClientRect();canvas.width=Math.max(440,Math.floor(b.width||850));canvas.height=Math.max(380,Math.floor(b.height||530));
    ctx.fillStyle='#020617';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#fecaca';ctx.font='bold 20px sans-serif';ctx.fillText('No se pudo cargar el simulador específico',24,38);
    ctx.font='13px monospace';ctx.fillText(String(err&&err.message?err.message:err),24,68);
    readout.innerHTML='<b>Error de carga del simulador específico.</b>';
  });
  return()=>{disposed=true;if(cleanup)cleanup();};
}
