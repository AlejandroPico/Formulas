import {model,lv,epidemic,hh} from './life-math.js';
import {studioScene} from './studio-scene.js';
export function drawLife(ctx,w,h,id,p,v){const S=studioScene(ctx,w,h,v),{plot,heading,dot,path,arrow,bars,blue,red,green,line,text}=S,q=model(id,p),mode=v.mode;
 if(id==='born-haber-cycle'){
  if(mode===2){bars([...q.steps,q.lattice,p.formation],['sub','½D','IE','EA','red','ΔHf']);heading('Entalpías firmadas, misma referencia','La suma de las primeras cinco debe ser la entalpía de formación');return {};}
  const vals=[...q.cumulative,p.formation],min=Math.min(...vals)-100,max=Math.max(...vals)+100,g=plot(0,5,min,max,'paso del ciclo','H relativa (kJ/mol)');path(vals.map((y,i)=>g.point(i,y)),blue);vals.forEach((y,i)=>dot(g.point(i,y),i===5?red:blue));heading('Subir y bajar hasta cerrar el ciclo','Metal y X2 → átomos → iones gaseosos → cristal; datos hipotéticos');return {};
 }
 if(id==='debye-huckel-limiting-law'){
  const g=plot(0,.01,mode===2?-1:0,mode===2?0:1.1,'I (mol/kg)',mode===2?'log10 γ':'γ');g.curve(I=>model(id,{...p,I})[mode===2?'log':'gamma']);dot(g.point(p.I,mode===2?q.log:q.gamma),red);heading('Carga al cuadrado, efecto de fuerza iónica','Agua a 25 °C; ley límite muy diluida y convención individual');return {};
 }
 if(id==='lotka-volterra-equations'||id==='competitive-lotka-volterra-model'){
  const comp=id.startsWith('competitive'),full=lv({...p,t:20},comp);
  if(mode===2){const xmax=comp?2:Math.max(5,...full.points.map(a=>a[1]))*1.1,ymax=comp?2:Math.max(5,...full.points.map(a=>a[2]))*1.1,g=plot(0,xmax,0,ymax,comp?'especie 1 / K1':'presa x',comp?'especie 2 / K2':'depredador y');path(full.points.map(a=>g.point(a[1],a[2])),blue);dot(g.point(...q.state),red);
   if(comp){g.curve(x=>p.alpha===0?NaN:(1-x)/p.alpha,green);g.curve(x=>1-p.beta*x,red);}else{path([g.point(q.equilibrium[0],0),g.point(q.equilibrium[0],ymax)],green);path([g.point(0,q.equilibrium[1]),g.point(xmax,q.equilibrium[1])],red);}heading('Trayectoria y nulclinas','Tiempo reducido; nulclina significa derivada cero, no equilibrio por sí sola');return {};}
  const max=Math.max(1,...full.points.flatMap(a=>a.slice(1)))*1.1,g=plot(0,20,0,max,'tiempo reducido','población escalada');for(let k=1;k<=2;k++)path(full.points.map(a=>g.point(a[0],a[k])),k===1?blue:red);dot(g.point(p.t,q.state[0]),blue);dot(g.point(p.t,q.state[1]),red);heading(comp?'Competencia limitada por capacidad':'Ciclos del modelo ideal','Azul primera población · coral segunda; integración RK4');return {};
 }
 if(id==='sir-epidemic-model'||id==='seir-epidemic-model'){
  const seir=id.startsWith('seir'),full=epidemic({...p,t:20},seir),colors=[blue,...(seir?[green]:[]),red,'#8f7b47'],labels=seir?['S','E','I','R']:['S','I','R'];
  if(mode===2){bars(q.state,labels);heading('La suma permanece en uno','Fracciones de una población cerrada; expuesto latente no infeccioso en SEIR');return {};}
  const g=plot(0,100,0,1,'tiempo (días)','fracción de población');for(let k=1;k<=q.state.length;k++)path(full.points.map(a=>g.point(a[0],a[k])),colors[k-1]);q.state.forEach((x,i)=>dot(g.point(p.t*5,x),colors[i]));heading(seir?'La latencia desplaza la curva infecciosa':'Susceptibles, infecciosos y recuperados',labels.map((x,i)=>x+': '+['azul','verde','coral','ocre'][seir?i:i===0?0:i+1]).join(' · ')+' · ejemplo ficticio');return {};
 }
 if(id==='fisher-kpp-diffusion-equation'){
  if(mode===2){const g=plot(.2,2,0,4.5,'difusión D','velocidad reducida');g.curve(D=>5*Math.sqrt(D*p.rate/6));g.curve(D=>2*Math.sqrt(D*p.rate),green);dot(g.point(p.D,q.speed),red);heading('Velocidad exacta particular y mínima','Azul esta familia · verde mínimo KPP para frentes seleccionados');return {};}
  const center=q.speed*p.t,g=plot(center-12,center+12,0,1,'x reducido','u');g.curve(q.density);if(p.x>=center-12&&p.x<=center+12)dot(g.point(p.x,q.value),red);heading('Ventana móvil que acompaña un frente exacto','Posición x en el sistema original; densidad en [0,1]; dominio infinito');return {};
 }
 if(id==='one-compartment-pharmacokinetics'){
  const g=plot(0,12,0,p.amount/p.volume*1.1,'tiempo (h)','C (mg/L)');g.curve(time=>model(id,{...p,time}).C);dot(g.point(p.time,q.C),red);if(mode===2)path([g.point(q.halfLife,0),g.point(q.halfLife,p.amount/p.volume/2)],green);heading('Eliminación lineal desde un bolo hipotético','Volumen aparente constante; sin absorción; semivida y AUC analíticas');return {};
 }
 if(id==='goldman-hodgkin-katz-equation'){
  if(mode===2){bars([p.Ko,p.PNa*p.Nao,p.PCl*p.Cli,p.Ki,p.PNa*p.Nai,p.PCl*p.Clo],['Ko','Na o','Cl i','Ki','Na i','Cl o']);heading('Cloruro cambia de lado en el cociente','Aportes ponderados por permeabilidad relativa; concentraciones en mM');return {};}
  const g=plot(1,20,-120,20,'K exterior (mM)','V interior−exterior (mV)');g.curve(Ko=>model(id,{...p,Ko}).V);dot(g.point(p.Ko,q.V),red);heading('De permeabilidad y concentración a potencial','Campo constante y corriente neta cero; datos hipotéticos');return {};
 }
 if(id==='monod-microbial-growth-model'){
  if(mode===2){const g=plot(0,10,0,p.max*1.1,'S (g/L)','μ (h⁻¹)');g.curve(S=>model(id,{...p,S}).mu);dot(g.point(p.S,q.mu),red);heading('Saturación de una tasa específica','S=KS da μmax/2; sustrato se mantiene constante en el experimento');return {};}
  const end=Math.min(6,Math.log(20)/Math.max(.01,q.mu)),g=plot(0,end,0,Math.max(2,q.growth(end)*1.1),'tiempo (h)','X/X0');g.curve(q.growth);heading('Crecimiento con suministro constante de sustrato','Ventana temporal adaptada; no es un cultivo cerrado con agotamiento');return {};
 }
 if(id==='hodgkin-huxley-action-potential'){
  const g=plot(0,50,mode===2?0:-85,mode===2?1:60,'tiempo (ms)',mode===2?'compuerta':'V (mV)');
  if(mode===2)for(let k=2;k<=4;k++)path(q.points.map(a=>g.point(a[0],a[k])),[blue,red,green][k-2]);else {path(q.points.map(a=>g.point(a[0],a[1])),blue);dot(g.point(p.t*2.5,q.now[0]),red);}
  heading(mode===2?'Compuertas m,h,n entre cero y uno':'Un pulso puede producir múltiples disparos',mode===2?'Azul m · coral h · verde n · axón clásico a 6,3 °C':'Pulso 5–30 ms; sin cable espacial ni temperatura variable');return {};
 }
 if(id==='replicator-equation-evolutionary-game-theory'){
  if(mode===2){const max=Math.max(.2,Math.abs(q.derivative(.25)),Math.abs(q.derivative(.75))),g=plot(0,1,-max,max,'frecuencia x','dx/dt');g.curve(q.derivative);dot(g.point(p.x,q.value),red);heading('El signo de la ventaja cambia la frecuencia','En x=0 o x=1 no aparecen estrategias ausentes sin mutación');return {};}
  const {points}=model(id,{...p,t:20}),g=plot(0,20,0,1,'tiempo reducido','frecuencia x');path(points.map(a=>g.point(...a)),blue);dot(g.point(p.t,q.state[0]),red);heading('Selección relativa, frecuencias conservadas','x+(1−x)=1; pagos no equivalen a unidades de dinero');return {};
 }
 if(id==='voltage-gain-decibels'){
  if(mode===2){const g=plot(.1,10,-25,45,'razón de amplitud','dB');g.curve(x=>20*Math.log10(x));dot(g.point(q.gain,q.db),red);heading('Duplicar amplitud suma 6,0206 dB','Potencia usa 10log; RMS positivo y razones adimensionales');return {};}
  const max=Math.max(p.input,p.out)*1.6,g=plot(0,2,-max,max,'ciclos ilustrativos','V');g.curve(x=>Math.SQRT2*p.input*Math.sin(2*Math.PI*x));g.curve(x=>Math.SQRT2*p.out*Math.sin(2*Math.PI*x),red);heading('RMS y amplitud de dos ondas en fase','Azul entrada · coral salida · escala pico=√2·RMS; frecuencia ilustrativa');return {};
 }
 if(id==='shockley-diode-equation'){
  const min=-.2,max=mode===2?.6:Math.max(.2,p.V+.05),top=Math.max(.1,model(id,{...p,V:max}).I),g=plot(min,max,-p.Is*2,top,'V ánodo−cátodo (V)','I (µA)');g.curve(V=>model(id,{...p,V}).I);if(p.V<=max)dot(g.point(p.V,q.I),red);heading('Exponencial directa, saturación inversa ideal','Is constante con temperatura; sin ruptura ni resistencia serie');return {};
 }
 const g=plot(0,5,0,Math.max(1,p.k*Math.max(0,p.Vgs-p.threshold)**2/2*1.15),'VDS (V)','ID (mA)');g.curve(Vds=>model(id,{...p,Vds}).I);dot(g.point(p.Vds,q.I),red);heading('Tres regiones con unión continua','Corte · triodo · saturación ideal; umbral VDS=VGS−VT');return {};
}
