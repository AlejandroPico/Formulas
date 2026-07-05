const RECENT_BATCHES=[12,13,14,15,16];
const VERSION='20260705f';
const loaded=new Set();
const refresh=()=>window.FormulasAtlas?.refresh?.();
function loadRecentBatches(){
  RECENT_BATCHES.forEach(n=>{
    if(loaded.has(n))return;
    loaded.add(n);
    import(`./latest-formula-batch-${n}.js?v=${VERSION}`).catch(err=>console.warn(`No se pudo cargar latest-formula-batch-${n}`,err));
  });
}
function pulse(){loadRecentBatches();refresh()}
window.addEventListener('formulas:catalog-ready',()=>[0,600,1400,2600,4200].forEach(t=>setTimeout(pulse,t)));
document.addEventListener('DOMContentLoaded',()=>[250,1200,2800].forEach(t=>setTimeout(pulse,t)));
setTimeout(pulse,6000);
