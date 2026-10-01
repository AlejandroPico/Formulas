import { circle,trig,identities,vector,arithmetic,geometric,determinant,heron,quadratic,fmt } from './learning-math.js';
const slider=(key,label,min,max,step=1,unit='')=>({key,label,min,max,step,unit});
const mission=(title,story,params,answer,explanation,hint,extra={})=>({title,story,params,answer,explanation,hint,...extra});
const select=(key,label,options)=>({key,label,options});
const identitySelect=select('identity','Identidad',[['sum','Cuadrado de suma'],['difference','Cuadrado de diferencia'],['product','Suma por diferencia']]);
export const LABS = {
 'circle-area':{
  accent:'#1687ad',modes:['Jardines','Explorar','Sectores'],title:'Un radio cambia toda la superficie',description:'Arrastra el extremo del radio o usa los controles. Observa el cambio cuadrático.',demoDescription:'Corta el disco y alterna los sectores. Con más piezas, la silueta se aproxima a un rectángulo de base πr y altura r.',
  defaults:{r:3,pieces:16,spread:1},controls:[slider('r','Radio',0,10,.1,'u')],demoControls:[slider('r','Radio',0,10,.1,'u'),slider('pieces','Sectores',8,64,2),slider('spread','Reordenar',0,1,.01)],
  calculate:p=>circle(p.r), read:p=>{const v=circle(p.r);return `A = π × ${fmt(p.r)}² = ${fmt(v.area)} u² · diámetro = ${fmt(v.diameter)} u. Duplicar el radio multiplica el área por cuatro.`;},
  missions:[
   mission('Un jardín de radio tres','Calcula la superficie de un jardín circular de radio 3 u. Escribe el área, redondeada a dos decimales.',{r:3},9*Math.PI,'A = π × 3² = 9π ≈ 28,27 u².','Eleva el radio al cuadrado antes de multiplicar por π.',{unit:'u²'}),
   mission('Diseña el jardín','Ajusta el radio para conseguir un área de 16π u². Arrastra el radio o usa el control y comprueba el diseño.',{r:2},4,'r = √(16π/π) = 4 u. La raíz recupera una longitud.','Divide el área entre π y busca la raíz positiva.',{kind:'tune',editable:['r'],get:p=>p.r,unit:'u'}),
   mission('Una ampliación','El radio pasa de 2 a 6 u. ¿Por qué factor se multiplica el área?',{r:6},9,'El radio se triplica: el área se multiplica por 3² = 9.','Compara los radios y eleva esa razón al cuadrado.'),
   mission('Del diámetro al área','Un disco tiene diámetro 10 u. Calcula su área.',{r:5},25*Math.PI,'El radio es 5 u: A = 25π ≈ 78,54 u².','El radio es la mitad del diámetro.',{unit:'u²'})
  ]
 },
 'circumference-length':{
  accent:'#ca516d',modes:['Ruta','Rodar','Polígonos'],title:'Una vuelta deja una huella recta',description:'Mueve las vueltas para hacer rodar la rueda sin deslizar. Radio y recorrido comparten escala.',demoDescription:'El polígono inscrito queda por dentro y el circunscrito por fuera. Sus perímetros acotan el borde circular.',
  defaults:{r:1,turns:0,n:12},controls:[slider('r','Radio',.2,3,.1,'u'),slider('turns','Vueltas',0,2,.01)],demoControls:[slider('r','Radio',.2,3,.1,'u'),slider('n','Lados',6,96,2)],calculate:p=>circle(p.r),read:p=>{const v=circle(p.r);return `L = 2π × ${fmt(p.r)} = ${fmt(v.length)} u · ${fmt(p.turns)} vueltas → ${fmt(p.turns*v.length)} u sin deslizamiento.`;},
  missions:[
   mission('Una vuelta completa','La rueda tiene radio 1 u. ¿Cuánto avanza en una vuelta sin deslizar?',{r:1,turns:1},2*Math.PI,'Avance = una circunferencia = 2π ≈ 6,28 u.','Una vuelta recorre 2πr.',{unit:'u'}),
   mission('Llega a la estación','Radio = 1 u. Ajusta las vueltas para avanzar 3π u y comprueba el recorrido.',{r:1,turns:.25},1.5,'Vueltas = 3π/(2π) = 1,5.','Divide la distancia entre la longitud de una vuelta.',{kind:'tune',editable:['turns'],get:p=>p.turns}),
   mission('Una llanta nueva','El diámetro de la rueda es 2 u. ¿Qué longitud de borde tiene?',{r:1,turns:0},2*Math.PI,'L = πd = 2π ≈ 6,28 u.','No confundas el diámetro con el radio.',{unit:'u'}),
   mission('Dos vueltas y media','Una rueda de radio 0,5 u da 2,5 vueltas. Calcula la distancia.',{r:.5,turns:2.5},2.5*Math.PI,'Cada vuelta mide π u; 2,5 vueltas son 2,5π ≈ 7,85 u.','Multiplica el número de vueltas por 2πr.',{unit:'u'})
  ]
 },
 'pythagorean-trig-identity':{
  accent:'#407ed3',modes:['Señales','Explorar','Ondas'],title:'Gira la dirección, conserva la longitud',description:'Arrastra el punto de la circunferencia o ajusta el ángulo. Azul: coseno; coral: seno.',demoDescription:'La línea vertical conecta el ángulo del punto con sus valores en las ondas. Ambas componentes oscilan; la suma de cuadrados no cambia.',
  defaults:{theta:45},controls:[slider('theta','Ángulo',0,360,1,'°')],calculate:p=>trig(p.theta),read:p=>{const v=trig(p.theta);return `cos θ = ${fmt(v.x)} · sin θ = ${fmt(v.y)} · cos² θ + sin² θ = ${fmt(v.squared,6)}. Los signos indican el cuadrante.`;},
  missions:[
   mission('Una coordenada oculta','cos θ = 0,6 y el punto está en el primer cuadrante. ¿Cuánto vale sin θ?',{theta:53.130102},.8,'sin² θ = 1−0,6² = 0,64. En el primer cuadrante, sin θ = +0,8.','Resta el cuadrado del coseno a uno y usa el cuadrante.'),
   mission('Apunta en diagonal','Ajusta el ángulo para que cos θ y sin θ sean positivos e iguales. Comprueba tu dirección.',{theta:20},45,'En el primer cuadrante, la diagonal de iguales componentes está a 45°.','Busca el punto donde la base y la altura del triángulo coincidan.',{kind:'tune',editable:['theta'],get:p=>p.theta,tolerance:1}),
   mission('El signo que falta','cos θ = −0,6 en el tercer cuadrante. ¿Cuánto vale sin θ?',{theta:233.130102},-.8,'El cuadrado del seno es 0,64. En el tercer cuadrante el seno es negativo: −0,8.','La raíz del cuadrado no decide el signo: lo decide el cuadrante.'),
   mission('Una vuelta no cambia la identidad','En θ = 270°, ¿cuánto vale sin² θ + cos² θ?',{theta:270},1,'(−1)² + 0² = 1. El seno puede ser negativo y la identidad sigue siendo cierta.','Eleva las componentes al cuadrado antes de sumar.')
  ]
 },
 'notable-identities':{
  accent:'#bb6550',modes:['Taller','Explorar','Piezas'],title:'Cuatro productos antes de simplificar',description:'Cambia la identidad y los números, incluidos negativos. Compara el producto con su expansión.',demoDescription:'Selecciona una identidad. Con longitudes a ≥ b ≥ 0, las piezas muestran áreas literales; fuera de ese dominio se muestran productos con signo.',
  defaults:{a:5,b:2,identity:'sum'},controls:[identitySelect,slider('a','Primer término a',-6,8,.5),slider('b','Segundo término b',-6,8,.5)],calculate:p=>identities(p.a,p.b,p.identity),read:p=>{const v=identities(p.a,p.b,p.identity);return `${p.identity==='sum'?`(${fmt(p.a)} + ${fmt(p.b)})²`:p.identity==='difference'?`(${fmt(p.a)} − ${fmt(p.b)})²`:`(${fmt(p.a)} + ${fmt(p.b)})(${fmt(p.a)} − ${fmt(p.b)})`} = ${fmt(v.value)} · término cruzado 2ab = ${fmt(v.cross)}.`;},
  missions:[
   mission('La pieza olvidada','En (3+2)², ¿cuánto aporta el término cruzado 2ab?',{a:3,b:2,identity:'sum'},12,'Hay dos rectángulos de área 3×2: 2ab = 12.','El producto ab aparece dos veces.'),
   mission('Construye un cuadrado de siete','Con a = 4, ajusta b ≥ 0 para que (a+b)² = 49.',{a:4,b:1,identity:'sum'},3,'4+b = 7 y b ≥ 0, por tanto b = 3.','La raíz positiva de 49 da el lado del cuadrado.',{kind:'tune',editable:['b'],get:p=>p.b,validate:p=>p.b>=0}),
   mission('Una diferencia negativa','Calcula (3−5)². Escribe el producto completo.',{a:3,b:5,identity:'difference'},4,'(−2)² = 4; también 9−30+25 = 4.','El último término es +b², no −b².'),
   mission('Los productos se cancelan','Calcula (5+2)(5−2).',{a:5,b:2,identity:'product'},21,'a²−b² = 25−4 = 21. Los productos cruzados se cancelan.','Suma por diferencia es diferencia de cuadrados.')
  ]
 },
 'euclidean-norm':{
  accent:'#8569c3',modes:['Navegación','Explorar','Dirección'],title:'La diagonal es más corta que el camino por ejes',description:'Cambia componentes o alterna 2D y 3D. Arrastra para girar la escena 3D; las flechas del teclado también giran la cámara.',demoDescription:'Compara el vector original con su dirección de norma uno. La cámara cambia la vista, no las componentes ni su longitud.',
  defaults:{x:2,y:3,z:6,dimension:3},controls:[select('dimension','Espacio',[[2,'2D'],[3,'3D']]),slider('x','Componente x',-8,8,.5,'u'),slider('y','Componente y',-8,8,.5,'u'),slider('z','Componente z',-12,12,.5,'u')],calculate:p=>vector(p.x,p.y,p.dimension===2?0:p.z),read:p=>{const v=vector(p.x,p.y,p.dimension===2?0:p.z);return `Norma = ${fmt(v.norm)} u · camino por ejes = ${fmt(v.axisPath)} u. ${v.unit?`Dirección unitaria = (${v.unit.map(t=>fmt(t)).join('; ')}).`:'El vector cero no tiene dirección unitaria.'}`;},
  missions:[
   mission('Un desplazamiento plano','El dron se desplaza (3,4,0) u. ¿Cuánto mide la ruta recta?',{x:3,y:4,z:0,dimension:2},5,'√(3²+4²) = 5 u, frente a 7 u recorriendo los ejes.','Suma cuadrados, no componentes.',{unit:'u'}),
   mission('Sube a la plataforma','La base es (3,4) u. Ajusta una altura z ≥ 0 para que la norma sea 13 u.',{x:3,y:4,z:1,dimension:3},12,'z = √(13²−3²−4²) = 12 u.','El desplazamiento horizontal ya mide 5 u.',{kind:'tune',editable:['z'],get:p=>p.z,validate:p=>p.z>=0}),
   mission('Una ruta espacial','Calcula la norma de (2,3,6) u.',{x:2,y:3,z:6,dimension:3},7,'√(4+9+36) = √49 = 7 u.','En 3D también sumas los tres cuadrados.',{unit:'u'}),
   mission('Cambiar de sentido','Calcula la norma de (−3,−4,0) u.',{x:-3,y:-4,z:0,dimension:2},5,'Los cuadrados son 9 y 16: invertir el sentido conserva la longitud.','Una norma nunca es negativa.',{unit:'u'})
  ]
 },
 'arithmetic-progression-sum':{
  accent:'#b38426',modes:['Gradas','Explorar','Parejas'],title:'Cada pareja de extremos suma lo mismo',description:'Las barras son términos, no el acumulado. Cambia el primer término, el salto y la cantidad de términos.',demoDescription:'La segunda fila recorre la sucesión al revés. Cada columna suma a₁+aₙ: dos copias forman n columnas iguales.',
  defaults:{a:3,d:2,n:6},controls:[slider('a','Primer término a₁',-10,10,1,'u'),slider('d','Diferencia d',-4,6,1,'u'),slider('n','Términos n',1,24,1)],calculate:p=>arithmetic(p.a,p.d,p.n),read:p=>{const v=arithmetic(p.a,p.d,p.n);return `aₙ = ${fmt(v.last)} u · Sₙ = ${p.n}(${fmt(p.a)} + ${fmt(v.last)})/2 = ${fmt(v.sum)} u · suma directa = ${fmt(v.direct)} u.`;},
  missions:[
   mission('Cinco filas de asientos','Las filas tienen 4,6,8,10,12 asientos. ¿Cuál es la capacidad total?',{a:4,d:2,n:5},40,'5(4+12)/2 = 40 asientos.','Empareja la primera fila con la última.'),
   mission('Una escalera hasta 55','Primer término 1 y diferencia 1. Ajusta n para que la suma sea 55.',{a:1,d:1,n:4},10,'1+2+…+10 = 10·11/2 = 55.','La suma es n(n+1)/2.',{kind:'tune',editable:['n'],get:p=>p.n,tolerance:0}),
   mission('El último no es el total','Con a₁ = 3, d = 2 y n = 4, ¿cuánto vale a₄?',{a:3,d:2,n:4},9,'Hay tres saltos: a₄ = 3+3·2 = 9.','Entre cuatro términos hay tres saltos.'),
   mission('Una secuencia decreciente','Suma los cinco términos 5,3,1,−1,−3.',{a:5,d:-2,n:5},5,'5(5−3)/2 = 5. Las cantidades negativas restan del acumulado.','La fórmula también admite diferencia negativa.')
  ]
 },
 'geometric-progression-sum':{
  accent:'#258f98',modes:['Cosecha','Explorar','Límite'],title:'El término y el acumulado no crecen igual',description:'Barras: aportes individuales. Línea: sumas parciales. La razón puede ser negativa, cero o uno.',demoDescription:'La línea de límite solo aparece si la serie converge. Con razón negativa, los acumulados pueden acercarse por lados alternos.',
  defaults:{a:8,r:.5,n:8},controls:[slider('a','Primer término a₁',-8,12,1,'u'),slider('r','Razón r',-2,2,.05),slider('n','Términos n',1,24,1)],calculate:p=>geometric(p.a,p.r,p.n),read:p=>{const v=geometric(p.a,p.r,p.n);return `aₙ = ${fmt(v.last)} u · Sₙ = ${fmt(v.sum)} u. ${v.converges?`Límite = ${fmt(v.limit)} u · resto exacto = ${fmt(v.remainder)} u.`:'No hay suma infinita convergente para estos datos.'}`;},
  missions:[
   mission('Cinco cosechas que se duplican','Suma los cinco términos 2,4,8,16,32.',{a:2,r:2,n:5},62,'2(2⁵−1)/(2−1) = 62 u. El último aporte no es el total.','Suma todos los aportes, no solo el último.'),
   mission('Un depósito de quince','Primer aporte 8 u y razón 0,5. Ajusta n para acumular 15 u.',{a:8,r:.5,n:2},4,'8+4+2+1 = 15 u tras cuatro aportes.','Cada aporte es la mitad del anterior.',{kind:'tune',editable:['n'],get:p=>p.n,tolerance:0}),
   mission('La razón especial','a₁ = 3, r = 1 y n = 4. ¿Cuál es la suma finita?',{a:3,r:1,n:4},12,'Todos los términos son 3: S₄ = 4·3 = 12. No dividas entre 1−r.','Si la razón es uno, los términos son iguales.'),
   mission('¿Existe un límite?','Con a₁ = 1 y r = −2, ¿converge la suma infinita?',{a:1,r:-2,n:6},'no','No: |r| = 2 ≥ 1. r < 1 por sí solo no garantiza convergencia.','Comprueba el valor absoluto de la razón.',{kind:'choice',choices:[['yes','Sí, converge'],['no','No converge']]})
  ]
 },
 'determinants-2x2-3x3':{
  accent:'#3c7bb2',modes:['Taller','Geometría','Productos'],title:'Área y volumen con orientación',description:'Edita las entradas de la matriz. Sus columnas son las aristas. En 3D, arrastra para girar; las flechas también giran la cámara.',demoDescription:'Cada producto conserva sus signos. Se suman las contribuciones de la primera familia y se restan las de la segunda. Sarrus solo vale en 3×3.',
  defaults:{dimension:2,m2:[2,1,0,3],m3:[2,1,0,0,3,1,0,0,2]},controls:[],calculate:p=>determinant(p.dimension===2?p.m2:p.m3,p.dimension),read:p=>{const v=determinant(p.dimension===2?p.m2:p.m3,p.dimension);return `det = ${fmt(v.det)} · ${p.dimension===2?'área':'volumen'} = ${fmt(Math.abs(v.det))} ${p.dimension===2?'u²':'u³'}. ${v.det===0?'Columnas dependientes: la figura pierde dimensión.':v.det<0?'Orientación invertida.':'Orientación conservada.'}`;},
  missions:[
   mission('Un paralelogramo inclinado','Matriz con filas (2,1) y (0,3). Calcula su determinante.',{dimension:2,m2:[2,1,0,3]},6,'ad−bc = 2·3−1·0 = 6.','Multiplica las diagonales y resta en el orden correcto.'),
   mission('Construye área ocho','Mantén la primera columna (2,0). Edita la segunda para que det = +8 y comprueba.',{dimension:2,m2:[2,1,0,1]},8,'Con la primera columna (2,0), det = 2d. Cualquier b sirve si d = 4.','La inclinación b no cambia el área si c = 0.',{kind:'tune',editable:['matrix'],get:p=>determinant(p.m2,2).det,lockedCells:[0,2]}),
   mission('Volumen y signo','Matriz diagonal 3×3 con entradas 2,3,−1. Calcula det, incluyendo el signo.',{dimension:3,m3:[2,0,0,0,3,0,0,0,-1]},-6,'2·3·(−1) = −6. El volumen es 6, y la orientación está invertida.','Para una matriz diagonal, multiplica su diagonal.'),
   mission('Dos columnas iguales','La matriz 2×2 tiene filas (1,1) y (2,2). ¿Es invertible?',{dimension:2,m2:[1,1,2,2]},'no','det = 1·2−1·2 = 0. Las columnas iguales son dependientes.','Observa si el paralelogramo conserva área.',{kind:'choice',choices:[['yes','Sí, es invertible'],['no','No es invertible']]})
  ]
 },
 'heron-formula':{
  accent:'#328b6b',modes:['Parcelas','Explorar','Altura'],title:'Comprueba el triángulo antes de medirlo',description:'Cambia los tres lados. La figura se dibuja solo si los datos son posibles; la igualdad triangular produce una línea.',demoDescription:'Arrastra el vértice superior para cambiar dos lados. La altura puede caer fuera de la base. Compara Herón con c×h/2.',
  defaults:{a:5,b:4,c:3},controls:[slider('a','Lado a',.5,15,.1,'u'),slider('b','Lado b',.5,15,.1,'u'),slider('c','Base c',.5,15,.1,'u')],calculate:p=>heron(p.a,p.b,p.c),read:p=>{const v=heron(p.a,p.b,p.c);return v.kind==='invalid'?'Datos imposibles: los lados positivos deben cerrar el triángulo. No se asigna un área inventada.':`s = ${fmt(v.s)} u · A = ${fmt(v.area)} u² · altura = ${fmt(v.height)} u. ${v.kind==='degenerate'?'Figura degenerada: área cero.':`Comprobación c×h/2 = ${fmt(p.c*v.height/2)} u².`}`;},
  missions:[
   mission('Una parcela conocida','Los lados son 3,4 y 5 u. Calcula el área.',{a:3,b:4,c:5},6,'s = 6; A = √(6·3·2·1) = 6 u².','Calcula primero el semiperímetro, no el perímetro.',{unit:'u²'}),
   mission('Una parcela mayor','Los lados son 13,14 y 15 u. Calcula el área.',{a:13,b:14,c:15},84,'s = 21; A = √(21·8·7·6) = 84 u².','Los tres factores restantes son 8,7 y 6.',{unit:'u²'}),
   mission('¿Se puede cerrar?','Los lados son 2,3 y 6 u. Clasifica los datos.',{a:2,b:3,c:6},'invalid','2+3 < 6: no existe ese triángulo.','Compara el mayor lado con la suma de los otros dos.',{kind:'choice',choices:[['valid','Triángulo con área'],['degenerate','Figura degenerada'],['invalid','Datos imposibles']]}),
   mission('Justo en el límite','Los lados son 2,3 y 5 u. Clasifica los datos.',{a:2,b:3,c:5},'degenerate','2+3 = 5: los puntos están alineados y el área es cero.','La igualdad no forma un triángulo con interior.',{kind:'choice',choices:[['valid','Triángulo con área'],['degenerate','Figura degenerada'],['invalid','Datos imposibles']]})
  ]
 },
 'quadratic-formula':{
  accent:'#8065bc',modes:['Dianas','Explorar','Vértice'],title:'Las raíces viven donde la curva vale cero',description:'Cambia a, b y c. El gráfico distingue raíces reales, doble, complejas y casos lineales o constantes.',demoDescription:'Arrastra el vértice para trasladar la parábola conservando a. Las nuevas coordenadas determinan b y c. Con a = 0 no hay vértice parabólico.',
  defaults:{a:1,b:-5,c:6},controls:[slider('a','Coeficiente a',-3,3,.1),slider('b','Coeficiente b',-8,8,.1),slider('c','Coeficiente c',-10,10,.1)],calculate:p=>quadratic(p.a,p.b,p.c),read:p=>{const v=quadratic(p.a,p.b,p.c);return v.kind==='all'?'0 = 0: cualquier x es solución.':v.kind==='none'?'Ecuación constante no nula: no tiene soluciones.':v.kind==='linear'?`a = 0: ecuación lineal, x = ${fmt(v.roots[0])}.`:v.kind==='complex'?`Δ = ${fmt(v.delta)} < 0 · raíces complejas: ${fmt(v.real)} ± ${fmt(v.imaginary)}i · ningún corte real.`:`Δ = ${fmt(v.delta)} · ${v.kind==='double'?'raíz doble':'raíces reales'}: ${v.roots.map(t=>fmt(t)).join('; ')} · vértice (${v.vertex.map(t=>fmt(t)).join('; ')}).`;},
  missions:[
   mission('Dos dianas','Resuelve x²−5x+6 = 0. Escribe las dos raíces separadas por punto y coma.',{a:1,b:-5,c:6},[2,3],'Δ = 1; x = (5±1)/2: 2 y 3. Sustituir ambas da cero.','Busca dos números cuya suma sea 5 y producto 6.',{multiple:true}),
   mission('La curva solo toca','Resuelve x²−4x+4 = 0. Escribe la raíz doble una sola vez.',{a:1,b:-4,c:4},2,'Δ = 0; (x−2)² = 0: raíz doble x = 2.','La parábola toca el eje en su vértice.'),
   mission('Sin cortes reales','Clasifica las soluciones de x²+1 = 0.',{a:1,b:0,c:1},'complex','Δ = −4: las raíces son i y −i; no hay raíces reales.','Un cuadrado real no puede valer −1.',{kind:'choice',choices:[['real','Dos reales'],['double','Una real doble'],['complex','Dos complejas']]}),
   mission('Ya no es una parábola','a = 0, b = 2, c = −6. Resuelve la ecuación.',{a:0,b:2,c:-6},3,'2x−6 = 0: x = 3. La fórmula cuadrática no se aplica porque a = 0.','Resuelve la ecuación lineal que queda.')
  ]
 }
};
