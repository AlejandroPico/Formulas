import {model,npv,bond,blackScholes} from './economy-math.js';
import {studioScene} from './studio-scene.js';
export function drawEconomy(ctx,w,h,id,p,v){const S=studioScene(ctx,w,h,v),{plot,heading,dot,path,arrow,bars,blue,red,green,line,text,project,samples}=S,q=model(id,p),mode=v.mode;
 if(id==='cobb-douglas-production-function'){
  if(mode===2){const P=project(1.8),coord=(K,L)=>P([2*K/10-1,2*L/10-1,2*q.f(K,L)/(10*p.A)-1]);for(let k=1;k<=10;k++){path(samples(t=>coord(k,1+9*t)),line,1);path(samples(t=>coord(1+9*t,k)),blue,1);}dot(coord(p.K,p.L),red,5);text('K',...coord(10,1),blue,12);text('L',...coord(1,10),blue,12);heading('Capital, trabajo y producción en tres ejes','K,L entre 1 y 10; Y escalada por 10A; malla de producción, no nube de datos');return {rotate:true};}
  const g=plot(1,10,0,Math.max(10,q.f(10,p.L)*1.1),'capital K reducido','producción Y');g.curve(K=>q.f(K,p.L));dot(g.point(p.K,q.output),red);heading('Producto marginal decreciente con trabajo fijo','α∈(0,1); mover K no equivale a escalar K y L conjuntamente');return {};
 }
 if(id==='consumer-lagrangian-constrained-optimization'){
  const xmax=p.budget/p.px,ymax=p.budget/p.py,g=plot(0,xmax,0,ymax,'bienes x','bienes y');path([g.point(0,ymax),g.point(xmax,0)],line,2);g.curve(x=>x===0?NaN:(q.U/x**p.alpha)**(1/(1-p.alpha)));dot(g.point(q.x,q.y),red,5);if(mode===2){g.curve(x=>x===0?NaN:(q.U*.8/x**p.alpha)**(1/(1-p.alpha)),green);}heading('Recta de presupuesto e indiferencia tangente','Óptimo interior bajo preferencias Cobb-Douglas; gasto total M');return {};
 }
 if(id.startsWith('bond-')){
  if(mode===2){bars(q.flows.map((c,i)=>c/(1+p.yield/100)**(i+1)),q.flows.map((_,i)=>'año '+(i+1)));heading('Valor presente de cada flujo, incluido nominal','Último pago suma cupón y nominal; rendimiento efectivo anual');return {};}
  const ymin=Math.min(-2,p.yield-6),ymax=p.yield+6,low=q.priceAt(ymax/100)*.9,high=q.priceAt(ymin/100)*1.1,g=plot(ymin,ymax,low,high,'rendimiento anual (%)','precio (u.m.)');g.curve(y=>q.priceAt(y/100));g.curve(y=>q.price*(1-q.modified*(y-p.yield)/100),red);if(id.includes('convexity'))g.curve(y=>q.price*(1-q.modified*(y-p.yield)/100+q.convexity*((y-p.yield)/100)**2/2),green);dot(g.point(p.yield+p.shock,q.newPrice),blue);heading('Precio exacto y aproximaciones locales','Azul exacto · coral duración · verde convexidad si aparece · tasas en fracción');return {};
 }
 if(id==='net-present-value-npv'||id==='internal-rate-of-return-irr'){
  if(mode===0){bars(q.flows,q.flows.map((_,i)=>'t='+i));heading('Inversión hoy, cobros en sus fechas','Un año por paso; todas las cantidades en una misma unidad monetaria');return {};}
  if(mode===2&&id.startsWith('internal')){const g=plot(0,35,-3,3,'tasa efectiva (%)','VAN (u.m.)');g.curve(x=>npv(q.multipleFlows,x/100));dot(g.point(10,0),red);dot(g.point(20,0),red);heading('Dos raíces para −100,230,−132','Ejemplo independiente del proyecto de controles; TIR 10% y 20%');return {};}
  const max=Math.max(30,q.irr*100+10),g=plot(0,max,Math.min(-p.initial,q.at(max/100))*1.1,Math.max(10,q.at(0))*1.1,'tasa efectiva (%)','VAN (u.m.)');g.curve(x=>q.at(x/100));dot(g.point(p.rate,q.NPV),red);if(q.irr>=0)dot(g.point(q.irr*100,0),green);heading('El cruce de VAN cero define TIR','Flujo convencional tiene raíz única r>−1; puede ser negativa');return {};
 }
 if(id==='kelly-criterion-money-management'){
  if(mode===2){let seed=56789;const paths=[];for(let j=0;j<4;j++){let wealth=1;const pts=[[0,1]];for(let n=1;n<=30;n++){seed=(1664525*seed+1013904223)>>>0;wealth*=seed/2**32<p.p?1+p.odds*p.f:1-p.f;pts.push([n,wealth]);}paths.push(pts);}const max=Math.max(2,...paths.flatMap(a=>a.map(b=>b[1]))),g=plot(0,30,0,max,'número de apuestas','capital / capital inicial');paths.forEach((pts,i)=>path(pts.map(a=>g.point(...a)),[blue,red,green,line][i]));heading('Cuatro series aleatorias reproducibles, mismas hipótesis','f fija; resultado corto varía; crecimiento medio no garantiza una trayectoria');return {};}
  const g=plot(0,.95,-1.5,.5,'fracción f','crecimiento log esperado');g.curve(q.growth);dot(g.point(p.f,q.selected),red);dot(g.point(q.optimal,q.growth(q.optimal)),green);heading('Maximiza un promedio logarítmico bajo supuestos','Verde óptimo restringido; una fracción excesiva puede tener crecimiento negativo');return {};
 }
 if(id==='solow-growth-model-steady-state'){
  if(mode===2){const g=plot(.05,.8,0,Math.max(2,q.consumption*1.5),'ahorro s','consumo estacionario');g.curve(saving=>model(id,{...p,saving}).consumption);dot(g.point(p.saving,q.consumption),red);heading('La regla de oro distingue consumo y capital','Ahorro α maximiza consumo estacionario en esta variante continua');return {};}
  const max=Math.max(10,q.k*1.4),loss=p.delta+p.population+p.technology,g=plot(0,max,0,Math.max(1,loss*max*1.1),'capital por trabajador efectivo','flujo de inversión o pérdida');g.curve(x=>p.saving*x**p.alpha);g.curve(x=>loss*x,red);dot(g.point(q.k,loss*q.k),green);heading('El cruce interior equilibra acumulación','Azul ahorro-producto · coral depreciación+dilución · unidades efectivas');return {};
 }
 if(id==='capital-asset-pricing-model-capm'){
  const g=plot(-1,3,-30,50,'beta sistemática','retorno esperado (%)');g.curve(beta=>model(id,{...p,beta}).expected);dot(g.point(p.beta,q.expected),red);heading('Una relación de retornos esperados, mismo horizonte','Intercepto rf; pendiente prima de mercado; no es retorno realizado');return {};
 }
 if(id==='sharpe-ratio-risk-adjusted-return'){
  if(mode===2){const g=plot(1,30,-12,20,'desviación del período (%)','ratio de Sharpe');g.curve(sigma=>model(id,{...p,sigma}).ratio);dot(g.point(p.sigma,q.ratio),red);heading('Más dispersión cambia el ratio de exceso','Con exceso negativo, comparar solo magnitud de ratio puede confundir');return {};}
  bars([p.mean,p.rf,q.excess,p.sigma],['media','referencia','exceso','σ']);heading('Mismo período para todas las magnitudes','Porcentajes y puntos porcentuales; σ no resume todos los riesgos');return {};
 }
 if(id==='put-call-parity-no-arbitrage'){
  if(mode===2){bars([q.A+p.put,q.B+q.call],['subyacente+put','bono+call']);heading('Mismo valor bajo paridad y dividendos descontados','Si los controles no son primas admisibles, la identidad algebraica no los valida');return {};}
  const g=plot(0,200,0,210,'S al vencimiento','pago final (u.m.)');g.curve(S=>S+Math.max(p.K-S,0));g.curve(S=>p.K+Math.max(S-p.K,0),red);heading('Dos carteras comparten pago max(ST,K)','Las curvas coinciden: subyacente+put y bono+call europeos');return {};
 }
 if(id==='black-scholes-model'||id==='black-scholes-european-put-option'){
  const put=id.includes('put-option'),g=plot(50,150,mode===2?-1.1:0,mode===2?1.1:110,'subyacente S (u.m.)',mode===2?'delta':'prima (u.m.)');g.curve(S=>{const r=blackScholes({...p,S});return mode===2?r.delta===null?NaN:r.delta-(put?Math.exp(-p.dividend/100*p.T):0):put?r.put:r.call;});
  if(mode!==2){g.curve(S=>Math.max(0,put?p.K-S:S-p.K),line);dot(g.point(p.S,q.value),red);}heading(put?'Precio de put europea':'Precio de call europea',mode===2?'Sensibilidad local de precio a S; en el límite de kink puede ser indefinida':'Gris pago inmediato; azul valor temporal del modelo · T y σ cero tratados por límite');return {};
 }
 const mean=-p.value*p.mean/100,sigma=p.value*p.sigma/100,g=plot(mean-4*sigma,mean+4*sigma,0,.45/sigma,'pérdida monetaria (u.m.)','densidad');g.curve(q.lossDensity);path([g.point(q.VaR,0),g.point(q.VaR,.42/sigma)],red);if(mode===2)path([g.point(q.ES,0),g.point(q.ES,.35/sigma)],green);heading('Un cuantil no limita la pérdida máxima','Coral VaR; verde ES si aparece; pérdidas positivas, ganancias negativas');return {};
}
