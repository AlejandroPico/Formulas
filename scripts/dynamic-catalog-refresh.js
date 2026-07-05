const RECENT_BATCHES=[12,13,14,15,16,17,18];
const VERSION='20260705i';
const loaded=new Map();
const refresh=()=>window.FormulasAtlas?.refresh?.();
function loadRecentBatches(){
  RECENT_BATCHES.forEach(n=>{
    if(loaded.get(n)===VERSION)return;
    import(`./latest-formula-batch-${n}.js?v=${VERSION}`)
      .then(()=>{loaded.set(n,VERSION);refresh();})
      .catch(err=>{loaded.delete(n);console.warn(`No se pudo cargar latest-formula-batch-${n}`,err);});
  });
}
function pulse(){loadRecentBatches();refresh()}
window.addEventListener('formulas:catalog-ready',()=>[0,600,1400,2600,4200,7000].forEach(t=>setTimeout(pulse,t)));
document.addEventListener('DOMContentLoaded',()=>[250,1200,2800,5200].forEach(t=>setTimeout(pulse,t)));
setTimeout(pulse,9000);
