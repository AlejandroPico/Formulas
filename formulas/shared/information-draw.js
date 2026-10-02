import {model,entropy,kl,zResponse} from './information-math.js';
import {studioScene} from './studio-scene.js';
export function drawInformation(ctx,w,h,id,p,v){const S=studioScene(ctx,w,h,v),{plot,heading,dot,path,arrow,bars,blue,red,green,line,text}=S,q=model(id,p),mode=v.mode;
 if(id==='maximum-likelihood-estimation'){
  if(mode===2){bars([q.k,p.n-q.k],['éxitos','fallos']);heading('Datos observados, no probabilidades de un parámetro','L omite el factor combinatorio constante respecto a p');return {};}
  const g=plot(0,1,0,1.1,'probabilidad candidata','L/Lmáx');g.curve(q.relative);dot(g.point(p.candidate,q.relative(p.candidate)),red);dot(g.point(q.mle,1),green);heading('Una curva de verosimilitud, con máximo visible','Verde p̂=k/n; coral candidato; no es densidad posterior');return {};
 }
 if(id==='confidence-interval'){
  if(mode===2){const min=p.truth-5*p.sigma/Math.sqrt(p.n),max=p.truth+5*p.sigma/Math.sqrt(p.n),g=plot(min,max,0,40,'media y límites','muestra repetida');path([g.point(p.truth,0),g.point(p.truth,40)],line);q.means.forEach((x,i)=>{const color=Math.abs(x-p.truth)<=q.margin?blue:red;path([g.point(x-q.margin,i+.5),g.point(x+q.margin,i+.5)],color,1);dot(g.point(x,i+.5),color,2);});heading('40 intervalos de muestras reproducibles','Coral no cubre μ; cobertura nominal no exige exactamente 95% en 40 muestras');return {};}
  const span=Math.max(4,q.margin*1.4),g=plot(p.mean-span,p.mean+span,0,1,'unidad de la variable','intervalo');path([g.point(q.low,.5),g.point(q.high,.5)],blue,4);dot(g.point(p.mean,.5),blue);path([g.point(p.truth,.2),g.point(p.truth,.8)],red);text('μ de referencia',...g.point(p.truth,.95),red,11);heading('Centro observado y margen de incertidumbre','σ poblacional conocida; n mayor reduce margen como 1/√n');return {};
 }
 if(id==='z-transform'){
  if(mode===2){bars(Array.from({length:12},(_,n)=>q.sequence(n)),Array.from({length:12},(_,n)=>String(n)));heading('Secuencia causal de soporte n≥0','x[n]=aⁿu[n]; signo alternante para a<0; a=0 es impulso');return {};}
  const g=plot(-2.3,2.3,-2.3,2.3,'Re z','Im z',true);for(const r of [1,Math.abs(p.a)])path(S.samples(t=>g.point(r*Math.cos(2*Math.PI*t),r*Math.sin(2*Math.PI*t))),r===1?line:red,1);dot(g.point(p.a,0),red,5);dot(g.point(p.radius*Math.cos(p.angle*Math.PI/180),p.radius*Math.sin(p.angle*Math.PI/180)),blue,5);heading(q.roc?'Punto de evaluación dentro de la ROC causal':'Punto fuera de ROC: continuación racional','Coral polo y borde excluido · círculo gris unidad · ROC exterior al polo');return {};
 }
 if(id==='shannon-hartley-capacity'){
  const g=plot(-10,30,0,mode===2?10:p.bandwidth*10,'S/N (dB)',mode===2?'bit/s/Hz':'Mbit/s');g.curve(db=>model(id,{...p,db})[mode===2?'efficiency':'capacity']);dot(g.point(p.db,mode===2?q.efficiency:q.capacity),red);heading('Capacidad logarítmica para ruido gaussiano','dB se convierte a razón lineal antes de usar log2(1+S/N)');return {};
 }
 if(id==='cross-entropy-loss'||id==='kullback-leibler-divergence'||id==='jensen-shannon-divergence'){
  if(mode===0){bars([p.p,1-p.p,p.q,1-p.q],['p(1)','p(0)','q(1)','q(0)']);heading('Dos fuentes binarias con distribuciones completas','Cada par suma uno; p y q tienen papeles distintos en KL y entropía cruzada');return {};}
  const isjs=id.startsWith('jensen'),g=plot(.01,.99,0,isjs?1:5,'probabilidad q',isjs?'JS (bits)':id.startsWith('cross')?'H(p,q) (nats)':'KL (nats)');g.curve(x=>model(id,{...p,q:x}).value);dot(g.point(p.q,q.value),red);
  if(mode===2){if(id.startsWith('kullback'))g.curve(x=>kl(x,p.p),green);else if(id.startsWith('cross'))g.curve(x=>kl(p.p,x),green);else g.curve(x=>Math.sqrt(model(id,{...p,q:x}).value),green);}
  heading(isjs?'Una mezcla simétrica y una raíz métrica':'La posición del mínimo depende del objetivo',mode===2?(isjs?'Verde raíz de JS; unidad distinta de la divergencia':id.startsWith('cross')?'Verde KL; diferencia constante igual a H(p)':'Verde orden KL inverso; no coincide en general'):'El mínimo se alcanza en q=p; base y dirección están fijadas');return {};
 }
 if(id==='shannon-entropy'){
  if(mode===0){bars([p.p,1-p.p],['símbolo 1','símbolo 0']);heading('Probabilidades de una fuente binaria','Sorpresa individual no equivale a frecuencia: un símbolo raro sorprende más');return {};}
  const g=plot(0,1,0,1.1,'p del símbolo 1','H (bits/símbolo)');g.curve(entropy);dot(g.point(p.p,q.h),red);heading('Máximo un bit por símbolo binario','p=0 o 1 produce fuente determinista, H=0');return {};
 }
 if(id==='differential-entropy'){
  if(mode===2){const g=plot(.1,3,-2,4,'σ en la coordenada de referencia','h (bits)');g.curve(sigma=>model(id,{...p,sigma}).h);dot(g.point(p.sigma,q.h),red);heading('La reescala cambia la entropía diferencial','Puede ser negativa; aumentar σ por dos añade un bit');return {};}
  const g=plot(p.mean-4*p.sigma,p.mean+4*p.sigma,0,.45/p.sigma,'x en unidad de referencia','densidad f(x)');g.curve(q.density);heading('Área uno, altura dependiente de anchura','Mover la media conserva h; cambiar σ modifica escala y h');return {};
 }
 if(id==='mutual-information'){
  if(mode===0||mode===2){bars(q.joint,['X0,Y0','X0,Y1','X1,Y0','X1,Y1']);heading('Distribución conjunta de entrada y salida','Probabilidades suman uno; inversión independiente de la entrada');return {};}
  const g=plot(0,.5,0,1.1,'probabilidad de inversión ε','información mutua (bits)');g.curve(noise=>model(id,{...p,noise}).I);dot(g.point(p.noise,q.I),red);heading('Información que conserva un canal binario','Con ε=1/2 la información es cero; con p equilibrada alcanza capacidad');return {};
 }
 if(id==='language-model-perplexity'){
  if(mode===2){bars(q.probs.map(x=>-Math.log2(x)),['token 1','token 2','token 3','token 4']);heading('Sorpresas condicionadas, en bits por token','Promediar sorpresa y exponenciar, no promediar inversas de probabilidad');return {};}
  bars(q.probs,['token 1','token 2','token 3','token 4']);heading('Probabilidad del token observado en cada contexto','Estas cuatro probabilidades no son categorías de una sola distribución');return {};
 }
 if(id==='aic-bic-information-criteria'){
  if(mode===2){const g=plot(20,500,0,70,'n observaciones','penalización');g.curve(n=>p.k*Math.log(n));g.curve(()=>2*p.k,green);dot(g.point(p.n,q.penaltyB),red);heading('Penalizaciones de AIC y BIC','Azul k ln n · verde 2k; log-verosimilitud de los mismos datos');return {};}
  bars([q.fit,q.penaltyA,q.penaltyB,q.aic,q.bic],['−2lnL','2k','k ln n','AIC','BIC']);heading('Descompón ajuste y coste de complejidad','No son probabilidades; menor valor favorece dentro de comparaciones válidas');return {};
 }
 if(mode===0){bars([p.tf,q.df,p.N],['TF','df','N']);heading('Apariciones y documentos son conteos distintos','TF en un documento; df cuenta documentos del corpus con el término');return {};}
 const g=plot(1,p.N,0,Math.max(1,p.tf*Math.log(p.N)),'df documentos','peso TF-IDF');g.curve(df=>model(id,{...p,df}).weight);dot(g.point(q.df,q.weight),red);heading('La rareza depende del corpus','Conteo bruto y log natural; sin suavizado ni normalización de longitud');return {};
}
