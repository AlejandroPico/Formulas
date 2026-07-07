const RECENT_BATCHES=[12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];
const VERSION='20260706b';
const loaded=new Map();

function asList(value){return Array.isArray(value)?value.filter(Boolean):[];}
function clean(value){return String(value||'').trim();}
function mdSection(key,label,order,content){return{key,label,type:'markdown',order,content};}
function hasSection(sections,key){return sections.some(section=>section&&section.key===key);}
function formulaSummary(eq){
  const formulas=asList(eq.formula).join('\n\n');
  const explained=asList(eq.formulaText).join('\n');
  return clean(formulas||explained||eq.summary||eq.name||'');
}
function sectionContent(eq,key){
  const section=asList(eq.sections).find(item=>item&&item.key===key);
  return clean(section&&section.content);
}
function normalizeSections(eq){
  if(!eq)return;
  const sections=Array.isArray(eq.sections)?eq.sections:(eq.sections=[]);
  if(!hasSection(sections,'ficha')){
    const interpretation=sectionContent(eq,'interpretacion');
    const limits=sectionContent(eq,'limitaciones');
    const summary=clean(eq.summary)||formulaSummary(eq);
    sections.push(mdSection('ficha','Ficha',65,
      '# Ficha\n\n'+
      '**Nombre:** '+clean(eq.name)+'\n\n'+
      '**Área:** '+clean(eq.field||'Sin área')+'\n\n'+
      '**Nivel:** '+clean(eq.level||'Sin nivel')+'\n\n'+
      '**Resumen:** '+summary+'\n\n'+
      (interpretation?'## Lectura e interpretación\n\n'+interpretation.replace(/^#\s*Interpretaci[oó]n[^\n]*\n*/i,'')+'\n\n':'')+
      (limits?'## Validez y límites\n\n'+limits.replace(/^#\s*Limitaciones[^\n]*\n*/i,''):'')
    ));
  }
  if(!hasSection(sections,'aprendizaje')){
    const prereq=asList(eq.prerequisites).join(', ')||'Conceptos básicos del área correspondiente.';
    const path=asList(eq.learningPath).join(' → ')||'fórmula → significado → simulación';
    const tags=asList(eq.tags).join(', ');
    sections.push(mdSection('aprendizaje','Aprendizaje',75,
      '# Aprendizaje\n\n'+
      '**Prerrequisitos:** '+prereq+'\n\n'+
      '**Ruta sugerida:** '+path+'\n\n'+
      (tags?'**Etiquetas:** '+tags+'\n\n':'')+
      'Abre la simulación, modifica un parámetro cada vez y relaciona el cambio visual con la fórmula simbólica.'
    ));
  }
}
function normalizeCatalog(){
  const items=window.FormulasAtlas&&Array.isArray(window.FormulasAtlas.equations)?window.FormulasAtlas.equations:[];
  items.forEach(eq=>{if(eq&&eq.id&&!eq.folder)eq.folder='formulas/'+eq.id;normalizeSections(eq);});
}
function refresh(){normalizeCatalog();if(window.FormulasAtlas&&window.FormulasAtlas.refresh)window.FormulasAtlas.refresh();}
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
