import * as M from './quantum-math.js';
import {studioScene} from './studio-scene.js';
export function drawQuantum(ctx,w,h,id,p,v){
 const S=studioScene(ctx,w,h,v),{blue,red,green,ink,line,muted,path,text,dot,arrow,heading,plot,samples,project,sphere,bars,fmt}=S,q=M.model(id,p),mode=v.mode;
 const curve=(g,f,point,color=blue)=>{g.curve(f,color);if(point&&point.every(Number.isFinite))dot(g.point(...point),red);};
 const matrix=(a,b,c,d,title,footer)=>{for(const [x,y,s]of[[w*.3,h*.36,a],[w*.7,h*.36,b],[w*.3,h*.62,c],[w*.7,h*.62,d]])text(v.hide?'?':s,x,y,ink,w<500?12:17);path([[w*.13,h*.26],[w*.13,h*.7]],line,1);path([[w*.87,h*.26],[w*.87,h*.7]],line,1);heading(title,footer);};
 if(id==='bose-einstein-distribution'||id==='fermi-dirac-distribution'){
  const bose=id.startsWith('bose'),min=bose?.1:-4,max=bose?5:4,ymax=bose?Math.max(2,q.occupation(min)*1.1):1.1,g=plot(min,max,0,ymax,'ε/ε0','ocupación por estado');curve(g,q.occupation,[p.energy,q.n]);if(mode===2){if(bose)g.curve(e=>Math.exp(-(e-p.mu)/p.T),green);else g.curve(e=>e<p.mu?1:e===p.mu?.5:0,green);}heading(bose?'Varios bosones pueden compartir un estado':'La exclusión limita cada estado',mode===2?(bose?'Verde: aproximación diluida; precisa ε−μ≫kBT':'Verde: límite T→0; escalón alrededor de μ'):'Ocupación media por estado; no densidad de estados');return {};
 }
 if(id==='de-broglie-relation'){
  if(mode===2){const g=plot(1,1000,0,1.3,'K (eV)','λ (nm)');curve(g,K=>M.model(id,{K}).lambda,[p.K,q.lambda]);heading('Cuadruplicar K divide λ por dos','Relación no relativista; energía del electrón, no energía de un fotón');return {};}
  const g=plot(0,1,-1.2,1.2,'x (nm)','fase ilustrativa');g.curve(x=>Math.cos(2*Math.PI*x/q.lambda));heading('Ondas de materia con distintas longitudes','Amplitud de fase ilustrativa; no posición ni densidad del electrón');return {};
 }
 if(id==='quantum-commutator'){
  if(mode===2){matrix('i·'+fmt(q.coefficient),'0','0','−i·'+fmt(q.coefficient),'AB−BA: parte imaginaria firmada','Coeficiente imaginario; matriz antihermítica, no observable hermítico');return {};}
  const a=p.angle*Math.PI/180,g=plot(-1.4,1.4,-1.4,1.4,'Re','Im',true);arrow(g.point(0,0),g.point(Math.cos(a),Math.sin(a)),blue);arrow(g.point(0,0),g.point(Math.cos(a),-Math.sin(a)),red);arrow(g.point(Math.cos(a),-Math.sin(a)),g.point(Math.cos(a),Math.sin(a)),green);heading('El orden cambia el producto','Azul AB (entrada 00) · coral BA · verde su diferencia');return {};
 }
 if(id==='canonical-commutation-relation'){
  bars(q.diagonal,Array.from({length:8},(_,i)=>'|'+i+'⟩'));if(mode===2)dot([w*(p.n+.5)/8,h*.24],red,5);heading('El borde compensa la traza del conmutador','Ocho estados: siete entradas +1 y la última −7 · el espacio exacto es infinito');return {};
 }
 if(id==='creation-annihilation-operators'||id==='quantum-harmonic-oscillator'){
  const creation=id.startsWith('creation'),n=creation?(q.next??0):p.n,omega=creation?1:p.omega;
  if(mode===0){for(let j=0;j<=Math.max(6,n+1);j++){const y=h-68-j*(h-130)/Math.max(6,n+1);path([[w*.2,y],[w*.76,y]],j===(creation?p.n:n)?red:line,j===(creation?p.n:n)?3:1);text('|'+j+'⟩',w*.13,y-4,muted,10);}if(creation&&q.next!==null)arrow([w*.85,h-68-p.n*(h-130)/Math.max(6,n+1)],[w*.85,h-68-q.next*(h-130)/Math.max(6,n+1)],blue);heading(creation?'El operador cambia el número del estado':'Niveles igualmente separados',creation?(q.next===null?'a|0⟩=0; no existe un estado normalizado con n=−1':'La amplitud √n no es una probabilidad de salida'):'E0=ħω/2; el cero de energía no elimina anchura');return {};}
  const span=Math.max(5,Math.sqrt(2*n+1)/Math.sqrt(omega)*1.25),g=plot(-span,span,0,1,'x reducido','|ψ|²');curve(g,creation?q.density:q.density);if(mode===2&&!creation){path([g.point(-q.turning,0),g.point(-q.turning,.9)],red,1);path([g.point(q.turning,0),g.point(q.turning,.9)],red,1);}heading('Densidad del estado, con sus nodos',mode===2?'Coral: retornos clásicos; la densidad cuántica tiene colas fuera':'∫|ψ|²dx=1 si existe salida normalizable');return {};
 }
 if(id==='hydrogen-radial-probability-density'){
  if(mode===2){const pts=[];for(let j=1;j<=28;j++){const r=j*.35/p.Z,N=Math.round(q.density(r)*45);for(let k=0;k<N;k++){const z=1-2*(k+.5)/N,a=k*2.3999632297,t=Math.sqrt(1-z*z);pts.push([r*t*Math.cos(a),r*t*Math.sin(a),r*z]);}}const P=project(12/p.Z);pts.forEach(x=>dot(P(x),blue,2));dot(P([0,0,0]),red,3);heading('Capas radiales; orientación promediada','Puntos ilustrativos; 2p promediado sobre m · no órbitas · gira cámara');return {rotate:true};}
  const xmax=Math.max(16/p.Z,p.r*1.05),g=plot(0,xmax,0,Math.max(.4,p.Z*.6),'r/a0','P reducida');curve(g,q.density,[p.r,q.value]);if(q.node!==null)path([g.point(q.node,0),g.point(q.node,.3*p.Z)],red,1);heading(['1s sin nodo interior','2s con nodo radial','2p sin nodo radial interior'][p.state],'P=r²|R|², por intervalo radial · no confundir con densidad por volumen');return {};
 }
 if(id==='klein-gordon-equation'||id==='dirac-equation'){
  const dirac=id==='dirac-equation';if(dirac&&mode===1){const r=sphere([q.r,q.r.map(x=>-x)],['E+','E−']);heading('Espinores de las dos ramas del Hamiltoniano','Bloch del espinor 1+1; no espín espacial completo de Dirac 3+1');return r;}
  if(!dirac&&mode!==2){const g=plot(-12,12,-1.5,1.5,'x reducido','Re φ');g.curve(q.field);heading('Interferencia de dos modos exactos','Campo real φ; no |ψ|² ni densidad de probabilidad positiva definida');return {};}
  const g=plot(-3,3,dirac?-4:0,4,'p o k reducido','E o ω');g.curve(x=>Math.hypot(x,p.mass));if(dirac)g.curve(x=>-Math.hypot(x,p.mass),red);dot(g.point(dirac?p.momentum:p.k,dirac?q.E:q.omega),green);heading(dirac?'Dos ramas separadas por la masa':'Frecuencia relativista y límite luminoso',dirac?'E±=±√(p²+m²), ħ=c=1; no proceso de creación de pares':'vg=k/ω≤1; vf=ω/k≥1 no es velocidad de una señal');return {};
 }
 if(id==='schrodinger-equation'||id==='infinite-potential-well'||id==='time-independent-schrodinger-equation'){
  const stationary=id.startsWith('time-independent'),box=id!=='schrodinger-equation';
  if(mode===2&&!stationary){bars(q.prob,['nivel 1','nivel 2']);heading('Pesos constantes, interferencia cambiante','La energía media conserva pesos; una fase no cambia ocupaciones');return {};}
  const L=box?p.L:2*Math.PI,span=box?Math.max(4,4/p.L):1,g=plot(0,L,mode===1?-Math.sqrt(span):0,mode===1?Math.sqrt(span):span,box?'x/Lref':'x reducido',mode===1?'amplitud compleja':'|ψ|²');
  if(mode===1){g.curve(x=>stationary?q.psi(x):q.amplitude(x)[0]);if(!stationary)g.curve(x=>q.amplitude(x)[1],red);}else g.curve(q.density);
  if(box)for(const x of[0,L])path([g.point(x,mode===1?-Math.sqrt(span):0),g.point(x,mode===1?Math.sqrt(span):span)],line,1);
  heading(stationary?'Un autoestado cumple ambas paredes':'Superposición que conserva la norma',mode===1?'Azul parte real · coral imaginaria; las amplitudes pueden tener signo':box?'Paredes de Dirichlet: ψ(0)=ψ(L)=0 · no trayectoria':'Anillo periódico 2π; interferencia exacta de dos modos');return {};
 }
 const spin=['born-rule','pauli-equation','von-neumann-equation','pauli-matrices','spin-half-bloch-sphere','mixed-state-bloch-sphere','quantum-fidelity'];
 if(spin.includes(id)){
  if(mode!==2){const vectors=id==='quantum-fidelity'?[q.r,q.s]:[q.r,...(q.detector?[q.detector]:q.axis?[q.axis]:[])],r=sphere(vectors,id==='quantum-fidelity'?['ρ','σ']:['estado','medida']);heading('Dirección y mezcla en el espacio de estados','La cámara cambia perspectiva; la esfera representa un qubit · gira o usa flechas');return r;}
  if(q.eigen){bars(q.eigen,['λ+','λ−']);heading('Autovalores no negativos y traza uno','La rotación unitaria cambia orientación; los autovalores permanecen fijos');}
  else if(q.prob!==undefined){bars([q.prob,1-q.prob],['P+','P−']);heading('Resultados de una medición proyectiva','Probabilidades de conjunto; no resultado garantizado de una medición');}
  else {const g=plot(0,180,0,1.1,'ángulo (°)','F cuadrada');g.curve(angle=>M.model(id,{...p,angle}).F);dot(g.point(p.angle,q.F),red);heading('Mezcla y orientación determinan fidelidad','Se usa F cuadrada; para dos estados puros F=cos²(θ/2)');}return {};
 }
 if(id==='density-matrix'){
  if(mode===1){const r=sphere([q.r],['ρ']);heading('Positividad equivale a pertenecer a la bola','|r|≤1; superficie pura, interior mixto; no se trata de coordenadas espaciales');return r;}
  if(mode===2){bars(q.eigen,['λ+','λ−']);heading('El espectro distingue pureza de mezcla','Ambos autovalores suman uno; la entropía usa la convención en bits');return {};}
  const off=fmt(q.r[0]/2)+' '+(q.r[1]>=0?'−':'+')+' '+fmt(Math.abs(q.r[1]/2))+'i';matrix(fmt(p.p),off,fmt(q.r[0]/2)+' '+(q.r[1]>=0?'+':'−')+' '+fmt(Math.abs(q.r[1]/2))+'i',fmt(1-p.p),'Poblaciones y coherencias de una matriz física','Fuera de la diagonal: conjugados; traza uno y autovalores no negativos');return {};
 }
 if(id==='heisenberg-uncertainty-principle'){
  if(mode===2){const span=Math.max(3,p.sigma*2,q.dp*2),g=plot(-span,span,-span,span,'x','p',true);path(samples(t=>{const a=t*2*Math.PI,x=2*p.sigma*Math.cos(a),y=2*p.chirp/p.sigma*Math.cos(a)+Math.sin(a)/p.sigma;return g.point(x,y);}),blue);heading('Elipse de covarianza del estado gaussiano','Contorno de Wigner gaussiano; no trayectoria clásica ni valores simultáneos');return {};}
  const g=plot(-6,6,0,1,'x o p reducido','densidad');g.curve(q.density);g.curve(q.momentum,red);heading('Anchura en x y anchura en p','Azul posición · coral impulso; ħ=1, chirp altera correlación y Δp');return {};
 }
 if(id==='von-neumann-entanglement-entropy'){
  if(mode===0){bars(q.prob,['00','01','10','11']);heading('Una pareja pura con resultados correlacionados','Probabilidades conjuntas en z; el estado conserva coherencia entre 00 y 11');return {};}
  if(mode===2){matrix(fmt(p.p),'0','0',fmt(1-p.p),'Estado de un qubit tras trazar el otro','La matriz reducida pierde coherencia local; el estado total sigue puro');return {};}
  const g=plot(0,1,0,1.1,'peso p','S(A) (bits)');curve(g,M.binaryEntropy,[p.p,q.entropy]);heading('Entropía local, entrelazamiento del estado puro','Máximo un bit en p=1/2; S(AB)=0 para esta familia');return {};
 }
 if(id==='path-integral'){
  if(mode===2){const g=plot(-2.2,2.2,-2.2,2.2,'Re A','Im A',true),a=[Math.cos(q.s1),Math.sin(q.s1)],b=[q.real,q.imag];arrow(g.point(0,0),g.point(...a),blue);arrow(g.point(...a),g.point(...b),red);arrow(g.point(0,0),g.point(...b),green);heading('Sumar fasores antes de tomar el módulo','Azul camino 1 · coral camino 2 · verde amplitud total');return {};}
  if(mode===0){const g=plot(-3.5,3.5,-1,p.distance+1,'x','distancia',true),a=g.point(0,-.7),b=g.point(p.x,p.distance);for(const slit of[-p.spacing/2,p.spacing/2])path([a,g.point(slit,0),b],blue);dot(b,red);heading('Dos caminos coherentes hacia una pantalla','Paraxial: acciones cuadráticas; amplitud relativa del segundo camino ajustable');return {drag:xy=>({x:Math.max(-3,Math.min(3,g.unpoint(xy)[0]))})};}
  const g=plot(-3,3,0,1.1,'posición en pantalla','intensidad relativa');curve(g,x=>M.model(id,{...p,x}).intensity,[p.x,q.intensity]);heading('Franjas por términos cruzados de amplitud','Ilustra dos caminos; no calcula la integral funcional completa');return {drag:xy=>({x:Math.max(-3,Math.min(3,g.unpoint(xy)[0]))})};
 }
 throw new Error('Quantum drawing '+id);
}
