import { LABS } from './learning-configs.js';
import { acceptsAnswer,parseAnswer,fmt } from './learning-math.js';
import { drawLab } from './learning-draw.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function mountLab(id,{root,canvas,controls,readout}) {
  const config=LABS[id]; if(!config)throw new Error('Laboratorio desconocido.');
  root.classList.add('learning-lab','sim-wide','calc-wide');
  root.querySelector('.lab-heading')?.remove();
  const initial=()=>({...structuredClone(config.defaults),...structuredClone(config.missions[0].params)});
  const state=root.__labState ||= {id,mode:0,level:0,score:0,attempts:0,solved:false,hint:false,answer:'',feedback:'',choice:'',params:initial(),exploration:structuredClone(config.defaults),yaw:.7,pitch:.55};
  state.active=true;
  const abort=new AbortController(),on=(target,event,handler)=>target.addEventListener(event,handler,{signal:abort.signal});
  let alive=true,frame=0,geometry={},drag=null,phase=1;
  const ctx=canvas.getContext('2d');
  canvas.tabIndex=0;canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label',`${config.title}. Usa los controles para cambiar valores. En las vistas 3D también puedes girar con las flechas del teclado.`);
  const heading=document.createElement('header'); heading.className='lab-heading';
  heading.innerHTML=`<p class="lab-mode-caption">Tres formas de jugar y aprender</p><nav aria-label="Modos del simulador">${config.modes.map((name,i)=>`<button type="button" data-lab-mode="${i}"><span>${String(i+1).padStart(2,'0')}</span>${escape(name)}</button>`).join('')}</nav><div class="lab-intro"><span data-lab-progress></span><h3></h3><p data-lab-story></p></div>`;
  root.prepend(heading);
  const current=()=>config.missions[state.level];
  const params=()=>state.mode===0?state.params:state.exploration;
  function render() {
    const m=current();
    heading.querySelectorAll('[data-lab-mode]').forEach(button=>{const active=+button.dataset.labMode===state.mode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    heading.querySelector('[data-lab-progress]').textContent=state.mode===0?`MISIÓN ${state.level+1} DE ${config.missions.length} · ${state.score} PUNTOS`:'LABORATORIO LIBRE · CAMBIA, PREDICE, COMPRUEBA';
    heading.querySelector('h3').textContent=state.mode===0?m.title:config.title;
    heading.querySelector('[data-lab-story]').textContent=state.mode===0?m.story:state.mode===2?config.demoDescription:config.description;
    if(state.mode===0&&m.kind!=='tune') {
      const fields=m.kind==='choice'?`<fieldset class="lab-choices"><legend>Elige una respuesta</legend>${m.choices.map(([value,label])=>`<label><input type="radio" name="choice" value="${value}" ${state.choice===value?'checked':''} ${state.solved?'disabled':''} required>${escape(label)}</label>`).join('')}</fieldset>`:`<label class="lab-answer-label">${m.multiple?'Dos raíces, separadas por ;':`Tu respuesta${m.unit?' ('+m.unit+')':''}`}<input class="lab-answer" name="answer" type="text" inputmode="${m.multiple?'text':'decimal'}" value="${escape(state.answer)}" placeholder="${m.multiple?'2 ; 3':'Escribe un número'}" autocomplete="off" ${state.solved?'disabled':''} required><small>${m.multiple?'Se acepta cualquier orden.':'Puedes usar coma decimal y redondear a dos decimales.'}</small></label>`;
      controls.innerHTML=`<form class="lab-answer-form">${fields}<button class="lab-primary" type="submit" ${state.solved?'disabled':''}>Comprobar</button></form>${actions()}`;
    } else {
      controls.innerHTML=controlMarkup()+ (state.mode===0?`<button class="lab-primary" data-lab-check ${state.solved?'disabled':''}>Comprobar diseño</button>${actions()}`:`<div class="lab-free-actions"><button data-lab-reset>Restablecer</button>${state.mode===2&&!['notable-identities','heron-formula','quadratic-formula'].includes(id)?'<button data-lab-animate>Ver el cambio</button>':''}</div>`);
    }
    updateReadout();draw();
  }
  function actions() {return `<div class="lab-actions"><button data-lab-hint ${state.solved?'disabled':''}>Pista</button><button data-lab-next ${state.solved?'':'disabled'}>${state.level===config.missions.length-1?'Volver a jugar':'Siguiente misión →'}</button></div>`;}
  function specs() {return state.mode===2?(config.demoControls||config.controls):config.controls;}
  function controlMarkup() {
    const p=params(),m=current(),challenge=state.mode===0;
    if(id==='determinants-2x2-3x3') {
      const dimension=p.dimension,values=dimension===2?p.m2:p.m3;
      return `<label>Dimensión<select name="dimension" data-lab-key="dimension" ${challenge?'disabled':''}><option value="2" ${dimension===2?'selected':''}>2D · matriz 2×2</option><option value="3" ${dimension===3?'selected':''}>3D · matriz 3×3</option></select></label><fieldset class="lab-matrix" style="--matrix-size:${dimension}"><legend>Filas de la matriz</legend>${values.map((value,index)=>`<label><span class="lab-sr">Fila ${Math.floor(index/dimension)+1}, columna ${index%dimension+1}</span><input type="number" min="-8" max="8" step="0.1" value="${value}" data-lab-cell="${index}" aria-label="Fila ${Math.floor(index/dimension)+1}, columna ${index%dimension+1}" ${(challenge&&(state.solved||m.lockedCells?.includes(index)))?'disabled':''}></label>`).join('')}</fieldset>`;
    }
    return specs().filter(spec=>!(id==='euclidean-norm'&&p.dimension===2&&spec.key==='z')).map(spec=>{
      const disabled=challenge&&(state.solved||!m.editable?.includes(spec.key));
      if(spec.options)return `<label>${escape(spec.label)}<select name="${spec.key}" data-lab-key="${spec.key}" ${disabled?'disabled':''}>${spec.options.map(([value,label])=>`<option value="${value}" ${String(p[spec.key])===String(value)?'selected':''}>${escape(label)}</option>`).join('')}</select></label>`;
      return `<label>${escape(spec.label)}<input type="range" name="${spec.key}" data-lab-key="${spec.key}" min="${spec.min}" max="${spec.max}" step="${spec.step}" value="${p[spec.key]}" ${disabled?'disabled':''}><output data-lab-output="${spec.key}">${fmt(p[spec.key])}${spec.unit?' '+spec.unit:''}</output></label>`;
    }).join('');
  }
  function updateReadout() {
    readout.classList.toggle('is-solved',state.mode===0&&state.solved);
    if(state.mode===0) {
      readout.innerHTML=`<strong>${escape(state.solved?'Misión completada':state.feedback||'Piensa, prueba y comprueba tu respuesta.')}</strong>${state.solved?`<span>${escape(current().explanation)}</span>`:state.hint?`<span>${escape(current().hint)}</span>`:''}`;
    } else {
      try {readout.textContent=config.read(params());}catch(error){readout.textContent=error.message;}
    }
    for(const output of controls.querySelectorAll('[data-lab-output]')){const spec=specs().find(s=>s.key===output.dataset.labOutput);output.textContent=fmt(params()[output.dataset.labOutput])+(spec?.unit?' '+spec.unit:'');}
  }
  function check() {
    if(state.solved||state.mode!==0)return;
    const m=current();let good=false;
    if(m.kind==='choice'){if(!state.choice){state.feedback='Elige una de las respuestas.';updateReadout();return;}good=state.choice===m.answer;}
    else if(m.kind==='tune')good=(!m.validate||m.validate(state.params))&&acceptsAnswer(m.answer,[m.get(state.params)],m.tolerance??.06);
    else {const actual=parseAnswer(state.answer,m.multiple);if(!actual.length){state.feedback='Introduce una respuesta numérica válida.';updateReadout();return;}good=acceptsAnswer(m.answer,actual,m.tolerance??.015);}
    state.attempts++;
    if(good){state.solved=true;state.score+=Math.max(25,100-(state.attempts-1)*15-(state.hint?25:0));state.feedback='';render();controls.querySelector('[data-lab-next]')?.focus({preventScroll:true});animate();}
    else {state.feedback=m.multiple?'Comprueba ambas raíces: deben anular el polinomio.':m.kind==='tune'?'El diseño aún no cumple el objetivo. Ajusta los valores y prueba de nuevo.':'Todavía no coincide. Revisa los datos, el signo y qué magnitud se pide.';updateReadout();}
  }
  function animate() {
    cancelAnimationFrame(frame);const start=performance.now();
    const tick=now=>{if(!alive)return;phase=clamp((now-start)/800,0,1);draw();if(phase<1)frame=requestAnimationFrame(tick);else frame=0;};
    frame=requestAnimationFrame(tick);
  }
  function draw() {
    if(!alive)return;
    const box=canvas.getBoundingClientRect();if(box.width<1||box.height<1)return;
    const dpr=Math.min(2,window.devicePixelRatio||1),width=Math.round(box.width*dpr),height=Math.round(box.height*dpr);
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const style=getComputedStyle(root),val=(key,fallback)=>style.getPropertyValue(key).trim()||fallback;
    try {
      const drawing={...params()};
      if(frame&&state.mode===2){
        if(id==='pythagorean-trig-identity')drawing.theta=(drawing.theta+360*phase)%360;
        if(id==='geometric-progression-sum')drawing.n=Math.max(1,Math.round(drawing.n*phase));
        if(id==='circumference-length')drawing.n=Math.max(6,Math.round(drawing.n*phase));
      }
      geometry=drawLab(ctx,box.width,box.height,id,drawing,{ink:val('--text','#17232c'),muted:val('--muted','#66747e'),line:val('--line','#b4c2c9'),background:val('--panel-solid','#faf9f5'),accent:config.accent,hide:state.mode===0&&!state.solved,mode:state.mode,yaw:state.yaw+(frame&&state.mode===2?Math.PI*2*phase:0),pitch:state.pitch,phase,solved:state.solved,frozen:drag?.layout});
    } catch(error) {geometry={};readout.textContent=error.message;}
  }
  function change(values,fromPointer=false) {
    const p=params(),m=current();
    for(const [key,value] of Object.entries(values)) {
      if(state.mode===0&&(m.kind!=='tune'||state.solved||(!m.editable?.includes(key)&&!(m.editable?.includes('matrix')&&key.startsWith('m')))))continue;
      const spec=specs().find(s=>s.key===key);
      if(Array.isArray(value))p[key]=value.map((v,i)=>m.lockedCells?.includes(i)&&state.mode===0?p[key][i]:clamp(v,-8,8));
      else if(spec&&!spec.options&&fromPointer)p[key]=Number((Math.round(clamp(value,spec.min,spec.max)/spec.step)*spec.step).toFixed(5));
      else p[key]=value;
    }
    state.feedback='';
    if(fromPointer){for(const input of controls.querySelectorAll('[data-lab-key]'))input.value=p[input.dataset.labKey];for(const input of controls.querySelectorAll('[data-lab-cell]'))input.value=p[p.dimension===2?'m2':'m3'][+input.dataset.labCell];}
    updateReadout();draw();
  }
  on(root,'input',event=>{
    const t=event.target;
    if(t.name==='answer'){state.answer=t.value;return;}
    if(t.name==='choice'){state.choice=t.value;return;}
    if(t.dataset.labCell!==undefined){const p=params(),key=p.dimension===2?'m2':'m3',values=p[key].slice();if(t.value.trim()===''||!Number.isFinite(t.valueAsNumber)||Math.abs(t.valueAsNumber)>8){readout.textContent='Cada entrada de la matriz debe ser un número entre −8 y 8.';return;}values[+t.dataset.labCell]=t.valueAsNumber;change({[key]:values});}
    else if(t.dataset.labKey){const key=t.dataset.labKey,spec=specs().find(s=>s.key===key),raw=t.value,value=key==='dimension'||!spec?.options?Number(raw):raw;change({[key]:value});if(key==='dimension')render();}
  });
  on(root,'submit',event=>{if(event.target.matches('.lab-answer-form')){event.preventDefault();check();}});
  on(root,'click',event=>{
    const target=event.target.closest('button');if(!target)return;
    if(target.dataset.labMode!==undefined){state.mode=+target.dataset.labMode;phase=1;cancelAnimationFrame(frame);frame=0;render();}
    else if(target.hasAttribute('data-lab-check'))check();
    else if(target.hasAttribute('data-lab-hint')){state.hint=true;updateReadout();}
    else if(target.hasAttribute('data-lab-next')&&state.solved){const next=(state.level+1)%config.missions.length;if(next===0)state.score=0;Object.assign(state,{level:next,solved:false,hint:false,answer:'',choice:'',attempts:0,feedback:'',params:{...structuredClone(config.defaults),...structuredClone(config.missions[next].params)}});render();}
    else if(target.hasAttribute('data-lab-reset')){state.exploration=structuredClone(config.defaults);state.yaw=.7;state.pitch=.55;phase=1;render();}
    else if(target.hasAttribute('data-lab-animate'))animate();
  });
  on(canvas,'pointerdown',event=>{
    if(!geometry.rotate&&(state.mode===0&&(current().kind!=='tune'||state.solved)))return;
    if(!geometry.rotate&&!geometry.drag)return;
    const rect=canvas.getBoundingClientRect();drag={x:event.clientX,y:event.clientY,yaw:state.yaw,pitch:state.pitch,layout:geometry.layout,apply:geometry.drag,rotate:geometry.rotate};canvas.setPointerCapture(event.pointerId);canvas.focus({preventScroll:true});
    if(drag.apply)change(drag.apply([event.clientX-rect.left,event.clientY-rect.top]),true);
  });
  on(canvas,'pointermove',event=>{if(!drag)return;if(drag.rotate){state.yaw=drag.yaw+(event.clientX-drag.x)*.01;state.pitch=clamp(drag.pitch+(event.clientY-drag.y)*.01,-1.3,1.3);draw();}else if(drag.apply){const rect=canvas.getBoundingClientRect();change(drag.apply([event.clientX-rect.left,event.clientY-rect.top]),true);}});
  const release=()=>{drag=null;draw();};
  on(canvas,'pointerup',release);on(canvas,'pointercancel',release);on(canvas,'lostpointercapture',release);
  on(canvas,'keydown',event=>{
    if(event.key==='Enter'){event.preventDefault();if(state.mode===0)check();return;}
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();
    const sign=['ArrowLeft','ArrowDown'].includes(event.key)?-1:1;
    if(geometry.rotate){if(event.key==='ArrowLeft'||event.key==='ArrowRight')state.yaw+=sign*.1;else state.pitch=clamp(state.pitch+sign*.1,-1.3,1.3);draw();}
    else {const spec=specs().find(s=>!s.options&&(state.mode!==0||current().editable?.includes(s.key)));if(spec)change({[spec.key]:clamp(params()[spec.key]+sign*spec.step,spec.min,spec.max)},true);}
  });
  const resize=new ResizeObserver(draw);resize.observe(canvas);
  const theme=new MutationObserver(draw);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class','style']});theme.observe(document.body,{attributes:true,attributeFilter:['data-theme','class','style']});
  render();
  return ()=>{alive=false;state.active=false;abort.abort();resize.disconnect();theme.disconnect();cancelAnimationFrame(frame);drag=null;};
}
