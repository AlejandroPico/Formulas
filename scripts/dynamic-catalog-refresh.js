const RECENT_BATCHES=[12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
const VERSION='20260705y';
const loaded=new Map();
function normalizeFolders(){
  const items=window.FormulasAtlas&&Array.isArray(window.FormulasAtlas.equations)?window.FormulasAtlas.equations:[];
  items.forEach(eq=>{if(eq&&eq.id&&!eq.folder)eq.folder='formulas/'+eq.id;});
}
function refresh(){normalizeFolders();if(window.FormulasAtlas&&window.FormulasAtlas.refresh)window.FormulasAtlas.refresh();}
function loadRecentBatches(){
  RECENT_BATCHES.forEach(function(n){
    if(loaded.get(n)===VERSION)return;
    import('./latest-formula-batch-'+n+'.js?v='+VERSION).then(function(){loaded.set(n,VERSION);refresh();}).catch(function(){loaded.delete(n);});
  });
}
function pulse(){loadRecentBatches();refresh();}
window.addEventListener('formulas:catalog-ready',function(){[0,600,1400,2600,4200,7000].forEach(function(t){setTimeout(pulse,t);});});
document.addEventListener('DOMContentLoaded',function(){[250,1200,2800,5200].forEach(function(t){setTimeout(pulse,t);});});
window.addEventListener('formulas:catalog-mutated',function(){setTimeout(pulse,80);});
setTimeout(pulse,9000);
