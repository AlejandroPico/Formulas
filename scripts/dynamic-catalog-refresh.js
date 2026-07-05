const refresh=()=>window.FormulasAtlas?.refresh?.();
window.addEventListener('formulas:catalog-ready',()=>[0,900,2400].forEach(t=>setTimeout(refresh,t)));
document.addEventListener('DOMContentLoaded',()=>[600,1800].forEach(t=>setTimeout(refresh,t)));
setTimeout(refresh,4200);
