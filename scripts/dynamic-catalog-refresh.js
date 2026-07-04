const refresh=()=>window.FormulasAtlas?.refresh?.();
window.addEventListener('formulas:catalog-ready',()=>[0,350,900,1800,3200].forEach(t=>setTimeout(refresh,t)));
document.addEventListener('DOMContentLoaded',()=>[250,1000,2200,4200].forEach(t=>setTimeout(refresh,t)));
setTimeout(refresh,5000);
