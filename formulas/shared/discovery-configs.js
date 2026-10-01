import {triangle,triangleASA,trianglesSSA,angles,viete,binomial,choose,harmonic,pendulum,accumulation,chain,product,quotient,hooke,planeStress,deg,rad} from './discovery-math.js';
import {fmt} from './learning-math.js';
const slider=(key,label,min,max,step=1,unit='')=>({key,label,min,max,step,unit});
const select=(key,label,options)=>({key,label,options});
const mission=(title,story,params,answer,explanation,hint,extra={})=>({title,story,params,answer,explanation,hint,...extra});
const tune=(editable,get,solution,tolerance=.04)=>({kind:'tune',editable,get,solution,tolerance});
const choice=(choices)=>({kind:'choice',choices});
const sides=[slider('a','Lado a',.5,10,.1,'u'),slider('b','Lado b',.5,10,.1,'u'),slider('C','Ángulo C',5,175,1,'°')];
const triangleRead=p=>{const v=triangle(p.a,p.b,p.C);return `c = ${fmt(v.c)} u · A = ${fmt(v.A)}° · B = ${fmt(v.B)}° · área = ${fmt(v.area)} u². ${p.C===90?'El término de corrección es cero: Pitágoras.':p.C<90?'Coseno positivo: c² es menor que a²+b².':'Coseno negativo: c² es mayor que a²+b².'}`;};
const derivativeRead=v=>`Valor = ${fmt(v.value)} · derivada = ${fmt(v.derivative)} · secante = ${fmt(v.secant)}.`;
export const DISCOVERY_LABS={
 'law-of-cosines':{
  accent:'#c57443',modes:['Rescate','Explorar','Proyección'],title:'Dos rutas y una distancia directa',description:'Arrastra el vértice móvil para cambiar a y C. El lado c une los extremos de las dos rutas.',demoDescription:'La proyección a cos C y la altura a sin C reconstruyen la distancia. También funcionan cuando la proyección es negativa.',defaults:{a:4,b:3,C:90},controls:sides,read:triangleRead,
  missions:[
   mission('Un rescate en ángulo recto','Dos rutas desde el campamento miden 4 y 3 u y forman 90°. ¿Qué distancia separa sus extremos?',{a:4,b:3,C:90},5,'c² = 4²+3²−2·4·3·cos90° = 25; c = 5 u.','Con 90° desaparece el coseno.',{unit:'u'}),
   mission('Abre la ruta','a = 4 y b = 3. Ajusta C para que la distancia sea 5 u.',{C:40},90,'La distancia de 5 u corresponde a C = 90°: el caso de Pitágoras.','Busca un ángulo cuyo coseno sea cero.',tune(['C'],p=>p.C,{C:90},.5)),
   mission('Una apertura mayor','Al abrir C desde 90° a 120°, con a y b fijos, ¿qué ocurre con c?',{C:120},'larger','cos120° es negativo: restarlo añade una contribución positiva a c².','Observa el signo del coseno.',choice([['larger','Aumenta'],['same','No cambia'],['smaller','Disminuye']])),
   mission('Una diagonal equilátera','a = b = 6 u y C = 60°. Calcula c.',{a:6,b:6,C:60},6,'c² = 36+36−72·0,5 = 36: c = 6 u.','cos60° = 0,5.',{unit:'u'})]
 },
 'law-of-sines':{
  accent:'#388899',modes:['Balizas','Explorar','Dos rutas'],title:'Un lado y su ángulo viajan juntos',description:'Ajusta dos ángulos y el lado a. Cada lado dividido por el seno opuesto vale el diámetro de la circunferencia.',demoDescription:'Con a, b y A conocidos puede haber cero, uno o dos triángulos. Las dos rutas se dibujan juntas cuando ambas son posibles.',defaults:{a:4,A:30,B:60,b:6},controls:[slider('a','Lado a',.5,10,.1,'u'),slider('A','Ángulo A',5,150,1,'°'),slider('B','Ángulo B',5,150,1,'°')],demoControls:[slider('a','Lado a',.5,10,.1,'u'),slider('b','Lado b',.5,10,.1,'u'),slider('A','Ángulo A',5,150,1,'°')],
  read:p=>{const v=triangleASA(p.a,p.A,p.B);return v.valid?`b = ${fmt(v.b)} u · c = ${fmt(v.c)} u · C = ${fmt(v.C)}° · 2R = ${fmt(2*v.R)} u.`:'Ángulos imposibles: A y B deben sumar menos de 180°.';},demoRead:p=>{const v=trianglesSSA(p.a,p.b,p.A);return `${v.length} ${v.length===1?'triángulo posible':'triángulos posibles'}. ${v.map((t,i)=>`Ruta ${i+1}: B = ${fmt(t.B)}°, C = ${fmt(t.C)}°, c = ${fmt(t.c)} u`).join(' · ')||'El lado a no alcanza la otra ruta.'}`;},
  missions:[
   mission('La segunda baliza','a = 4 u, A = 30° y B = 90°. Calcula el lado b.',{B:90},8,'b = 4·sin90°/sin30° = 8 u.','Cada lado se empareja con su ángulo opuesto.',{unit:'u'}),
   mission('Balizas simétricas','A = 30°. Ajusta B para que b = a.',{B:60},30,'En un triángulo, lados iguales tienen ángulos opuestos iguales.','A y B deben coincidir; su suma debe seguir siendo menor de 180°.',tune(['B'],p=>p.B,{B:30},.5)),
   mission('Dos rutas reales','a = 4, b = 6, A = 30°. ¿Cuántos triángulos no degenerados admiten esos datos?',{B:48.590378},2,'sin B = 0,75: B ≈ 48,59° o 131,41°. Ambos dejan C positivo.','Comprueba el ángulo del arco seno y su suplementario.'),
   mission('El círculo común','a = 4 u y A = 30°. ¿Cuánto vale R?',{},4,'2R = 4/0,5 = 8 u, por tanto R = 4 u.','El cociente lado/seno es 2R, no R.',{unit:'u'})]
 },
 'law-of-tangents':{
  accent:'#967444',modes:['Equilibrio','Explorar','Semiángulos'],title:'La diferencia de lados tiene un signo',description:'Arrastra el vértice o cambia los lados. Compara diferencias normalizadas sin perder el signo.',demoDescription:'La semisuma y la semidiferencia de A y B relacionan las dos tangentes. El caso a = b sigue siendo válido: ambas razones valen cero.',defaults:{a:5,b:3,C:60},controls:sides,
  read:p=>{const v=triangle(p.a,p.b,p.C),right=Math.tan(rad((v.A-v.B)/2))/Math.tan(rad((v.A+v.B)/2));return `(a−b)/(a+b) = ${fmt(v.ratio,5)} · razón de tangentes = ${fmt(right,5)} · A−B = ${fmt(v.A-v.B)}°.`;},
  missions:[
   mission('Diferencia normalizada','a = 5 y b = 3. Calcula (a−b)/(a+b).',{},.25,'(5−3)/(5+3) = 2/8 = 0,25.','Resta arriba y suma abajo.'),
   mission('Equilibra las dos rutas','Con b = 3, cambia a para conseguir A = B.',{a:5},3,'a = b = 3: A = B y ambas razones valen cero.','Iguala las longitudes opuestas.',tune(['a'],p=>p.a,{a:3})),
   mission('El signo angular','a = 3 y b = 5. ¿Qué signo tiene A−B?',{a:3,b:5},'negative','El lado menor tiene el ángulo opuesto menor: A−B < 0.','La razón izquierda también cambia de signo.',choice([['negative','Negativo'],['zero','Cero'],['positive','Positivo']])),
   mission('Reconstruye la razón','Si (a−b)/(a+b) = 0,5, ¿cuánto vale a/b?',{a:6,b:2},3,'a−b = 0,5a+0,5b; 0,5a = 1,5b; a/b = 3.','Despeja a/b conservando los signos.')]
 },
 'vietes-formulas':{
  accent:'#7160a8',modes:['Cerraduras','Explorar','Complejas'],title:'Las raíces escriben el polinomio',description:'Arrastra las raíces sobre el eje. Cambia a para comprobar que escalar el polinomio conserva sus raíces.',demoDescription:'Explora pares conjugados r ± si. La curva puede no cortar el eje real y, aun así, Viète sigue relacionando las dos raíces complejas con b y c.',defaults:{r:-2,s:3,a:1,kind:'real'},controls:[slider('r','Raíz 1',-5,5,.1),slider('s','Raíz 2',-5,5,.1),slider('a','Coeficiente a',.5,3,.1)],demoControls:[slider('r','Parte real',-3,3,.1),slider('s','Parte imaginaria |s|',0,3,.1),slider('a','Coeficiente a',.5,3,.1)],demoParams:p=>({...p,kind:'complex'}),
  read:p=>{const v=viete(p);return `Suma = ${fmt(v.sum)} · producto = ${fmt(v.product)} · b = ${fmt(v.b)} · c = ${fmt(v.c)} · Δ = ${fmt(v.discriminant)}. ${p.kind==='complex'&&p.s!==0?'Raíces conjugadas, sin cortes reales.':'Las raíces se cuentan con multiplicidad.'}`;},
  missions:[
   mission('Una cerradura con dos claves','Las raíces son −2 y 3, con a = 1. ¿Qué coeficiente b necesitas?',{},-1,'La suma es 1 y b = −a·suma = −1.','Recuerda el signo menos de −b/a.'),
   mission('Construye la segunda clave','La primera raíz es −2. Ajusta la segunda para conseguir producto −8.',{s:1},4,'(−2)·4 = −8; la suma es 2, así que el polinomio es x²−2x−8.','Divide el producto objetivo entre −2.',tune(['s'],p=>p.s,{s:4})),
   mission('Un polinomio escalado','Las raíces son 2 y 5 y a = 2. ¿Cuánto vale c?',{r:2,s:5,a:2},20,'c/a = 2·5 = 10; c = 20.','El producto da c/a, no c.'),
   mission('Una clave repetida','Una cuadrática tiene suma de raíces 6 y producto 9. ¿Cuál es la raíz doble?',{r:3,s:3},3,'(x−3)² tiene suma 6 y producto 9. La raíz 3 se cuenta dos veces.','Busca dos valores iguales cuya suma sea seis.')]
 },
 'double-angle-formulas':{
  accent:'#5d7eb3',modes:['Frecuencias','Explorar','Ondas'],title:'Una vuelta, dos oscilaciones',description:'Arrastra la dirección θ. El segundo radio gira el doble; sus componentes no son el doble de las primeras.',demoDescription:'Compara sin θ y sin 2θ en el mismo eje angular. Doblar el argumento duplica la frecuencia, conservando amplitud uno.',defaults:{theta:30},controls:[slider('theta','Ángulo θ',-180,360,1,'°')],
  read:p=>{const v=angles(p.theta);return `sin 2θ = ${fmt(v.sin)} · cos 2θ = ${fmt(v.cos)} · tan 2θ ${v.tan===null?'no está definida':`= ${fmt(v.tan)}`}. Seno y coseno siguen entre −1 y 1.`;},
  missions:[
   mission('Una señal al doble','θ = 30°. ¿Cuánto vale sin 2θ?',{},Math.sqrt(3)/2,'sin60° = √3/2 ≈ 0,87. También 2·sin30°·cos30°.','Duplica el ángulo; no el resultado del seno.'),
   mission('Una señal máxima','Ajusta θ entre 0° y 90° para que sin 2θ sea uno.',{theta:10},45,'2θ = 90°, luego θ = 45°.','La segunda dirección debe señalar hacia arriba.',{...tune(['theta'],p=>p.theta,{theta:45},.5),validate:p=>p.theta>=0&&p.theta<=90}),
   mission('El signo del doble','θ = 60°. Calcula cos 2θ.',{theta:60},-.5,'cos120° = −0,5; el radio doble entra en el segundo cuadrante.','cos²60°−sin²60° = 1/4−3/4.'),
   mission('Una tangente especial','θ = 45°. ¿Está definida tan 2θ?',{theta:45},'no','tan90° no está definida porque cos90° = 0.','La tangente divide seno entre coseno.',choice([['no','No está definida'],['zero','Vale cero'],['one','Vale uno']]))]
 },
 'angle-sum-formulas':{
  accent:'#498b73',modes:['Rumbos','Explorar','Componentes'],title:'Gira una dirección y después otra',description:'Arrastra la dirección final para cambiar β. α marca el primer giro y α+β el resultado.',demoDescription:'Los dos segmentos de cada color muestran las contribuciones de la rotación: cos α cos β y −sin α sin β en horizontal; sin α cos β y cos α sin β en vertical.',defaults:{alpha:30,beta:45},controls:[slider('alpha','Primer giro α',-180,180,1,'°'),slider('beta','Segundo giro β',-180,180,1,'°')],
  read:p=>{const v=angles(p.alpha,p.beta);return `Total = ${fmt(p.alpha+p.beta)}° · sin = ${fmt(v.sin)} · cos = ${fmt(v.cos)} · tan ${v.tan===null?'no definida':`= ${fmt(v.tan)}`}. Los términos conservan su signo.`;},
  missions:[
   mission('Giros encadenados','α = 30° y β = 60°. Calcula sin(α+β).',{beta:60},1,'sin90° = 1. La identidad combina productos, no sin30°+sin60°.','Suma primero los ángulos para comprobar el resultado.'),
   mission('Un rumbo de 90°','Con α = 30°, ajusta β para dirigir el radio hacia 90°.',{beta:10},60,'α+β = 30°+60° = 90°.','Resta el primer giro al objetivo.',tune(['beta'],p=>p.beta,{beta:60},.5)),
   mission('Deshaz el giro','α = 45° y β = −45°. Calcula cos(α+β).',{alpha:45,beta:-45},1,'Los giros se cancelan y cos0° = 1.','Un giro negativo actúa en sentido contrario.'),
   mission('Un rumbo de 75°','Calcula sin75° usando α = 30° y β = 45°.',{},(Math.sqrt(6)+Math.sqrt(2))/4,'sin75° = (√6+√2)/4 ≈ 0,97.','Usa 1/2, √3/2 y √2/2 en los dos productos.')]
 },
 'simple-harmonic-motion':{
  accent:'#3e899f',modes:['Sintonía','Explorar','Energía'],title:'El resorte intercambia energía',description:'Reproduce, pausa o recorre el tiempo. Compara posición, velocidad y aceleración; sus máximos no ocurren a la vez.',demoDescription:'La energía potencial y la cinética se intercambian sin pérdidas. El punto recorre una elipse en el espacio posición–velocidad.',defaults:{A:1,m:1,k:4,phi:0,t:0},timeline:true,controls:[slider('A','Amplitud',0,2,.05,'m'),slider('m','Masa',.5,4,.1,'kg'),slider('k','Rigidez',1,20,.1,'N/m'),slider('phi','Fase inicial',-180,180,1,'°'),slider('t','Tiempo',0,20,.05,'s')],
  read:p=>{const v=harmonic(p);return `t = ${fmt(p.t)} s · x = ${fmt(v.x)} m · v = ${fmt(v.v)} m/s · a = ${fmt(v.acc)} m/s² · T = ${fmt(v.T)} s · U+K = ${fmt(v.energy)} J.`;},
  missions:[
   mission('El primer instante','A = 1 m, k = 4 N/m, m = 1 kg y fase cero. ¿Cuál es x(0)?',{},1,'cos0 = 1: x(0) = A = 1 m. La velocidad inicial es cero.','El cuerpo se suelta desde un extremo.',{unit:'m'}),
   mission('Sintoniza la frecuencia','Con m = 1 kg, ajusta k para que ω = 3 rad/s.',{k:4},9,'ω² = k/m: k = 1·3² = 9 N/m.','Eleva la frecuencia al cuadrado.',tune(['k'],p=>p.k,{k:9})),
   mission('Rapidez al pasar por el centro','A = 1 m y ω = 2 rad/s. ¿Cuál es la rapidez máxima?',{t:Math.PI/4},2,'|v|max = Aω = 2 m/s. En el centro toda la energía es cinética.','La velocidad es −Aω sin(ωt+φ).',{unit:'m/s'}),
   mission('Más masa, misma rigidez','Si multiplicas la masa por cuatro sin cambiar k, ¿por qué factor se multiplica T?',{m:4},2,'T = 2π√(m/k): √4 = 2.','La masa está dentro de una raíz.')]
 },
 'simple-pendulum-small-angle':{
  accent:'#b78344',modes:['Relojes','Explorar','Comparar'],title:'Dos péndulos, dos aproximaciones',description:'Azul: solución de ángulo pequeño. Coral: péndulo no lineal. Reproduce o cambia el tiempo para ver cómo se separan.',demoDescription:'Aumenta la amplitud para comparar el periodo pequeño con el periodo no lineal. La longitud del hilo y la gravedad son iguales en ambos.',defaults:{L:1,g:9.81,amplitude:10,t:0},timeline:true,controls:[slider('L','Longitud',.2,4,.05,'m'),slider('g','Gravedad',1,20,.01,'m/s²'),slider('amplitude','Amplitud',0,150,1,'°'),slider('t','Tiempo',0,20,.05,'s')],
  read:p=>{const v=pendulum(p);return `T pequeño = ${fmt(v.small)} s · T no lineal = ${fmt(v.exact)} s · aumento = ${fmt(v.error)} % · θ no lineal = ${fmt(deg(v.theta))}°. ${v.error>1?'La diferencia de periodos supera el 1 %.':'La diferencia de periodos no supera el 1 %.'}`;},
  missions:[
   mission('Un péndulo de un metro','L = 1 m y g = 9,81 m/s². Calcula el periodo para ángulos pequeños.',{},2*Math.PI/Math.sqrt(9.81),'T = 2π√(1/9,81) ≈ 2,01 s.','La amplitud no aparece en la aproximación.',{unit:'s'}),
   mission('Un reloj de π segundos','Usa g = 16 m/s². Ajusta L para que T pequeño = π s.',{g:16,L:.5},4,'L = g(T/2π)² = 16·(1/2)² = 4 m.','Despeja L elevando el cociente al cuadrado.',tune(['L'],p=>p.L,{L:4})),
   mission('Cuatro veces más largo','Si L se multiplica por cuatro con g fijo, ¿por qué factor cambia T pequeño?',{L:4},2,'T depende de √L: el periodo se duplica.','No es una relación lineal.'),
   mission('Una oscilación de 90°','¿Qué periodo es mayor con amplitud de 90°?',{amplitude:90},'exact','El periodo no lineal es mayor; la aproximación pequeña subestima la duración.','Compara las dos oscilaciones y sus periodos.',choice([['exact','El no lineal'],['linear','El pequeño'],['same','Son iguales']]))]
 },
 'binomial-theorem':{
  accent:'#8b679b',modes:['Combinaciones','Explorar','Pascal'],title:'Elegir posiciones crea coeficientes',description:'Cada barra es un término con su signo. El exponente n es entero; para n = 0 la suma contiene un único término uno.',demoDescription:'El triángulo de Pascal construye cada coeficiente sumando los dos superiores. Selecciona n y k para resaltar una posición y contar sus elecciones.',defaults:{a:2,b:1,n:4,k:2},controls:[slider('a','Valor a',-3,3,.1),slider('b','Valor b',-3,3,.1),slider('n','Exponente n',0,10,1)],demoControls:[slider('n','Fila n',0,10,1),slider('k','Elecciones k',0,10,1)],
  read:p=>{const v=binomial(p.a,p.b,p.n);return `Suma de ${p.n+1} términos = ${fmt(v.sum)} · (${fmt(p.a)}+${fmt(p.b)})^${p.n} = ${fmt(v.direct)} · C(${p.n}, ${p.k}) = ${choose(p.n,p.k)}${p.k>p.n?' (k fuera de la fila)':''}.`;},
  missions:[
   mission('Tres elecciones','En (a+b)³, ¿cuál es el coeficiente del término a²b?',{n:3},3,'Hay tres posiciones posibles para elegir b una sola vez.','Calcula C(3,1).'),
   mission('Una fila con diez caminos','Ajusta n para que C(n,2) = 10.',{n:3},10,'C(5,2) = 5·4/2 = 10.','Busca n(n−1)/2 = 10.',tune(['n'],p=>choose(p.n,2),{n:5},.001)),
   mission('Una potencia completa','Calcula (2+1)⁴ sumando sus contribuciones.',{},81,'16+32+24+8+1 = 81 = 3⁴.','Incluye los términos de k = 0 y k = 4.'),
   mission('Un signo alterno','En (a−b)³, ¿cuál es el coeficiente con signo del término ab²?',{a:1,b:-1,n:3},3,'Dos elecciones de −b dan signo positivo: +3ab².','El signo es (−1)^k y aquí k = 2.')]
 },
 'fundamental-theorem-calculus':{
  accent:'#3b8b7b',modes:['Depósitos','Explorar','Rectángulos'],title:'Acumular y medir la tasa',description:'Arrastra x. Las áreas bajo el eje son negativas; la integral conserva el sentido desde a hasta x.',demoDescription:'Compara rectángulos de punto medio con la integral exacta. Cambia n y el incremento h para observar aproximación de área y secante de la acumulación.',defaults:{curve:'linear',a:0,x:2,n:12,h:.2},controls:[select('curve','Tasa',[['linear','t'],['square','t² − 1'],['sine','sin t']]),slider('a','Origen a',-3,3,.1),slider('x','Límite x',-3,3,.05)],demoControls:[select('curve','Tasa',[['linear','t'],['square','t² − 1'],['sine','sin t']]),slider('a','Origen a',-3,3,.1),slider('x','Límite x',-3,3,.05),slider('n','Rectángulos',2,80,1),slider('h','Incremento h',.02,.8,.02)],
  read:p=>{const v=accumulation(p);return `Integral = ${fmt(v.value)} · tasa f(x) = ${fmt(v.slope)} · secante = ${fmt(v.secant)} · rectángulos = ${fmt(v.approx)}. Área con signo, no área geométrica total.`;},
  missions:[
   mission('La entrada de un depósito','La tasa es f(t) = t, desde 0 hasta 2. ¿Cuánto se acumula?',{},2,'∫₀² t dt = [t²/2]₀² = 2.','Es un triángulo de base 2 y altura 2.'),
   mission('Consigue cuatro y media','f(t) = t y a = 0. Ajusta x para acumular 4,5 unidades.',{x:1},3,'x²/2 = 4,5 da x = 3 en el intervalo positivo.','Busca el extremo cuya mitad del cuadrado sea 4,5.',tune(['x'],p=>p.x,{x:3})),
   mission('Una tasa negativa','f(t) = t²−1, a = 0 y x = 0. ¿Cuál es la derivada de la acumulación en x = 0?',{curve:'square',x:0},-1,'A′(0) = f(0) = −1. La acumulación disminuye cuando la tasa es negativa.','La derivada devuelve la altura de la curva, no el área.'),
   mission('Recorrer al revés','f(t) = t. Calcula la integral desde a = 2 hasta x = 0.',{a:2,x:0},-2,'Invertir los límites cambia el signo: ∫₂⁰ t dt = −2.','La orientación también forma parte de la integral.')]
 },
 'chain-rule':{
  accent:'#7471b4',modes:['Engranajes','Explorar','Sensibilidad'],title:'Dos transformaciones, una pendiente',description:'Mueve x sobre la curva compuesta. La sensibilidad exterior se evalúa en g(x), y después se multiplica por la interior.',demoDescription:'La cadena x → u → y muestra dos pendientes locales. Reduce h para comparar la secante de la función compuesta con el producto exacto.',defaults:{family:'cube-square',x:1,scale:1,h:.2},controls:[select('family','Composición',[['cube-square','(s x² + 1)³'],['sin-square','sin(s x²)'],['exp-linear','exp(s x)']]),slider('x','Entrada x',-2,2,.05),slider('scale','Escala s',.5,2,.1)],demoControls:[select('family','Composición',[['cube-square','(s x² + 1)³'],['sin-square','sin(s x²)'],['exp-linear','exp(s x)']]),slider('x','Entrada x',-2,2,.05),slider('scale','Escala s',.5,2,.1),slider('h','Incremento h',.02,.5,.02)],read:p=>{const v=chain(p);return `${derivativeRead(v)} Exterior = ${fmt(v.outer)} · interior = ${fmt(v.inner)} · u = ${fmt(v.u)}.`;},
  missions:[
   mission('Dos engranajes','y = (x²+1)³. Calcula y′ en x = 1.',{},24,'Exterior: 3·2² = 12. Interior: 2·1 = 2. Total: 24.','Calcula primero u = x²+1.'),
   mission('Detén la sensibilidad interior','y = (x²+1)³. Ajusta x para anular g′(x).',{x:1},0,'g′(x) = 2x; en x = 0 la derivada total es cero.','Busca donde la transformación cuadrática se aplana.',tune(['x'],p=>p.x,{x:0})),
   mission('Una función anidada','y = sin(x²). Calcula y′ en x = 0.',{family:'sin-square',x:0},0,'y′ = cos(x²)·2x; en cero el factor interior vale cero.','No olvides el factor 2x.'),
   mission('Una escala exponencial','y = exp(2x). Calcula y′ en x = 0.',{family:'exp-linear',scale:2,x:0},2,'y′ = exp(2x)·2; exp0 = 1.','La escala interior también se deriva.')]
 },
 'product-rule':{
  accent:'#bc7959',modes:['Superficies','Explorar','Dos aportes'],title:'Un producto cambia por dos caminos',description:'f(x) = x + o y g(x) = x² + b. Arrastra x y observa la curva producto y sus dos contribuciones con signo.',demoDescription:'Con factores positivos, las bandas del rectángulo muestran incrementos exactos. Con factores negativos, usa las contribuciones algebraicas y la secante: no hay un área física negativa.',defaults:{x:1,offset:2,bias:1,h:.2},controls:[slider('x','Entrada x',-2,3,.05),slider('offset','Desplazamiento o',0,3,.1),slider('bias','Constante b',0,3,.1)],demoControls:[slider('x','Entrada x',-2,3,.05),slider('offset','Desplazamiento o',0,3,.1),slider('bias','Constante b',0,3,.1),slider('h','Incremento h',.02,.5,.02)],read:p=>{const v=product(p);return `${derivativeRead(v)} f′g = ${fmt(v.first)} · fg′ = ${fmt(v.second)}.`;},
  missions:[
   mission('Dos lados variables','f = x+2 y g = x²+1. Calcula (fg)′ en x = 1.',{},8,'f′g = 2 y fg′ = 3·2 = 6; total 8.','Suma los dos aportes, no multipliques las derivadas.'),
   mission('Un aporte nulo','Ajusta x para anular g′ = 2x.',{x:1},0,'En x = 0, g′ = 0. Aun así (fg)′ = f′g = 1.','Anular una contribución no siempre anula la derivada total.',tune(['x'],p=>p.x,{x:0})),
   mission('Un factor que pasa por cero','f = x+2 y g = x²+1. Calcula (fg)′ en x = −2.',{x:-2},5,'f = 0, así que fg′ = 0; f′g = 1·5 = 5.','Que el producto valga cero no obliga a que su pendiente sea cero.'),
   mission('El error habitual','¿Cuál es la regla correcta?',{},'sum','Cada factor puede cambiar mientras el otro actúa como escala.','La variación de un producto tiene dos aportes.',choice([['sum','f′g + fg′'],['multiply','f′g′'],['one','Solo f′g']]))]
 },
 'quotient-rule':{
  accent:'#528f9e',modes:['Razones','Explorar','Dos efectos'],title:'Una razón puede tener un hueco',description:'f(x) = x²+1 y g(x) = x+s. Arrastra x; la curva se interrumpe en x = −s, donde el cociente no está definido.',demoDescription:'Compara f′/g y −fg′/g². Sus signos dependen de los valores: un denominador que crece no siempre hace que la razón disminuya.',defaults:{x:1,shift:1,h:.2},controls:[slider('x','Entrada x',-3,3,.05),slider('shift','Desplazamiento s',-2,2,.1)],demoControls:[slider('x','Entrada x',-3,3,.05),slider('shift','Desplazamiento s',-2,2,.1),slider('h','Incremento h',.02,.5,.02)],
  read:p=>{const v=quotient(p);return v.valid?`${derivativeRead(v)} Numerador: ${fmt(v.first)} · denominador: ${fmt(v.second)}. ${v.secantCrossesPole?'El incremento cruza el polo: la secante no representa una pendiente local.':Math.abs(p.x+p.shift)<.2?'Muy cerca del polo: gran sensibilidad.':''}`:'Cociente y derivada no definidos: g(x) = 0. El hueco no se rellena con cero.';},
  missions:[
   mission('Una razón instantánea','y = (x²+1)/(x+1). Calcula y′ en x = 1.',{},.5,'(2·2−2·1)/2² = 2/4 = 0,5.','Resta los productos y divide entre g².'),
   mission('Una pendiente objetivo','Con s = 1, ajusta x a cero para observar una pendiente −1.',{x:1},0,'En x = 0: (0·1−1·1)/1² = −1.','El aporte del numerador se anula.',tune(['x'],p=>p.x,{x:0})),
   mission('El punto prohibido','Con s = 1, ¿en qué x deja de estar definido el cociente?',{},-1,'g(x) = x+1 = 0 en x = −1. Allí no se aplica la regla.','Resuelve la ecuación del denominador.'),
   mission('Otra razón','Con s = 2, calcula y′ en x = 0.',{shift:2,x:0},-.25,'(0·2−1·1)/2² = −1/4.','El denominador se eleva al cuadrado.')]
 },
 'hookes-law':{
  accent:'#508b71',modes:['Calibración','Explorar','Trabajo'],title:'La fuerza apunta hacia el equilibrio',description:'Arrastra el extremo del resorte. Estirar y comprimir invierten la fuerza restauradora. La fuerza externa de equilibrio tiene el signo opuesto.',demoDescription:'El área bajo F externa = kx es el trabajo almacenado. El límite marcado delimita el rango de calibración: fuera de él la extrapolación lineal no está validada.',defaults:{k:20,x:.3,limit:.75},controls:[slider('k','Rigidez k',5,100,1,'N/m'),slider('x','Desplazamiento x',-.9,.9,.01,'m'),slider('limit','Rango calibrado |x|',.2,.8,.05,'m')],
  read:p=>{const v=hooke(p);return `F resorte = ${fmt(v.force)} N · F externa = ${fmt(v.external)} N · U = ${fmt(v.energy)} J. ${v.valid?'Dentro del rango lineal calibrado.':'Fuera del rango calibrado: predicción ideal extrapolada, no validada.'}`;},
  missions:[
   mission('Un resorte estirado','k = 20 N/m y x = +0,3 m. Calcula la fuerza del resorte.',{},-6,'F = −20·0,3 = −6 N: apunta hacia el equilibrio.','Se pide la fuerza restauradora, con signo.',{unit:'N'}),
   mission('Una fuerza de −10 N','Con k = 20 N/m, ajusta x para obtener F = −10 N.',{x:.1},.5,'x = −F/k = 0,5 m.','La fuerza negativa corresponde a estiramiento positivo.',tune(['x'],p=>p.x,{x:.5},.006)),
   mission('El trabajo almacenado','k = 20 N/m y x = 0,5 m. ¿Cuánta energía almacena?',{x:.5},2.5,'U = kx²/2 = 20·0,25/2 = 2,5 J.','El trabajo es el área triangular bajo la fuerza externa.',{unit:'J'}),
   mission('Un resorte comprimido','k = 20 N/m y x = −0,2 m. Calcula la fuerza del resorte.',{x:-.2},4,'F = −20·(−0,2) = +4 N. La fuerza sigue buscando el equilibrio.','Dos signos negativos producen uno positivo.',{unit:'N'})]
 },
 'generalized-hooke-law-plane-stress':{
  accent:'#6a7d9d',modes:['Materiales','Explorar','Placa 3D'],title:'Estirar en x también cambia y y z',description:'La malla muestra deformación amplificada. Tracción azul, compresión coral; el cortante inclina la malla. E y las tensiones usan MPa.',demoDescription:'Gira la placa con ratón, dedo o flechas. Las caras z están libres de tensión, pero el espesor cambia por Poisson. La amplificación visual nunca cambia los valores físicos.',defaults:{E:200000,nu:.3,sx:100,sy:0,tau:0,gain:100},controls:[slider('E','Módulo E',20000,240000,1000,'MPa'),slider('nu','Poisson ν',-.5,.49,.01),slider('sx','Tensión σx',-200,200,1,'MPa'),slider('sy','Tensión σy',-200,200,1,'MPa'),slider('tau','Cortante τxy',-100,100,1,'MPa'),slider('gain','Amplificación',1,100,1,'×')],
  read:p=>{const v=planeStress(p);return `εx = ${fmt(v.ex*1e6)} με · εy = ${fmt(v.ey*1e6)} με · εz = ${fmt(v.ez*1e6)} με · γxy = ${fmt(v.gamma*1e6)} μrad · σ principales del plano = ${v.principal.map(x=>fmt(x)).join(', ')} MPa. Dibujo ×${fmt(v.drawingGain)}${v.drawingGain<p.gain?' (amplificación limitada para evitar invertir la malla)':''}; pequeñas deformaciones.`;},
  missions:[
   mission('Una placa traccionada','E = 200 000 MPa, ν = 0,3, σx = 100 MPa, σy = τxy = 0. Calcula εx en microdeformaciones.',{},500,'εx = 100/200000 = 0,0005 = 500 με.','Multiplica la deformación adimensional por un millón.',{unit:'με'}),
   mission('Compensa la contracción','Con σx = 100 MPa y ν = 0,3, ajusta σy para anular εy.',{sy:0},30,'εy = (σy−0,3·100)/E = 0 exige σy = 30 MPa.','La tensión transversal debe compensar el efecto Poisson.',tune(['sy'],p=>p.sy,{sy:30},.1)),
   mission('Un espesor libre','En tensión plana, ¿es obligatorio que εz sea cero?',{},'no','σz = 0 no implica εz = 0: εz = −ν(σx+σy)/E.','Distingue tensión plana de deformación plana.',choice([['no','No; puede cambiar'],['yes','Sí, siempre'],['unknown','Solo depende del cortante']])),
   mission('El factor dos del cortante','Si γxy = 1000 μrad, ¿cuánto vale εxy en microdeformaciones?',{tau:200000/(2*1.3)*.001},500,'La deformación ingenieril γxy = 2εxy; εxy = 500 με.','El tensor usa la mitad del cortante ingenieril.',{unit:'με'})]
 }
};
