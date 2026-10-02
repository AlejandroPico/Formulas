import {fmt} from './learning-math.js';
export const control=(key,label,min,max,step=.1,unit='')=>({key,label,min,max,step,unit});
export const clock=()=>control('t','Reloj de exploración',0,20,.01);
export const number=x=>x===null?'indefinido':x===Infinity?'∞':x===-Infinity?'−∞':!Number.isFinite(x)?'fuera del dominio':x!==0&&(Math.abs(x)<.001||Math.abs(x)>=1e6)?x.toExponential(4):fmt(x,4);
export function makeStudio(entry,model){
 const {id,title,modes,description,defaults,controls,label,unit='',key,target,rule,correct,wrong,timeline=false}=entry;
 const calc=p=>model(id,p),initial=calc(defaults).value,changed=calc({...defaults,[key]:target}).value,spec=controls.find(s=>s.key===key);
 if(!Number.isFinite(initial)||!Number.isFinite(changed))throw new Error('Invalid mission '+id);
 return {title,modes,description,demoDescription:entry.demoDescription||description,defaults,controls,accent:'#397d91',animate:false,timeline,
 read:p=>`${controls.map(c=>`${c.label}=${number(p[c.key])}${c.unit?' '+c.unit:''}`).join(' · ')}. ${label}=${number(calc(p).value)} ${unit}. ${entry.read(p,calc(p))}`,
 missions:[
 {title:entry.firstTitle||'Predice antes de medir',story:`${description} Calcula ${label.toLowerCase()} con los datos iniciales${unit?' en '+unit:''}.`,answer:initial,tolerance:.015,hint:rule,explanation:`${label}=${number(initial)} ${unit}. ${rule}`,params:{}},
 {title:entry.tuneTitle||'Construye el objetivo',kind:'tune',editable:[key],solution:{[key]:target},get:p=>calc(p).value,answer:changed,tolerance:entry.tuneTolerance??.006,story:`Ajusta ${spec.label.toLowerCase()} hasta obtener ${label.toLowerCase()}=${number(changed)} ${unit}.`,hint:`${rule} Modifica ${spec.label.toLowerCase()} y conserva los demás datos.`,explanation:`${spec.label}=${target} ${spec.unit||''}. ${rule}`,params:{}},
 {title:'Distingue el modelo',kind:'choice',story:entry.question||'¿Qué interpretación es correcta?',choices:entry.reverseChoices?[['no',wrong],['yes',correct]]:[['yes',correct],['no',wrong]],answer:'yes',hint:rule,explanation:correct,params:{}},
 {title:entry.lastTitle||'Comprueba una nueva predicción',story:`Ahora ${spec.label.toLowerCase()}=${target} ${spec.unit||''}. Calcula ${label.toLowerCase()}${unit?' en '+unit:''} y explica el cambio.`,answer:changed,tolerance:.015,hint:rule,explanation:`Resultado=${number(changed)} ${unit}. ${rule}`,params:{[key]:target}}
 ]};
}
