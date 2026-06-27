export const pluginPolishedEquations = [
  {
    id: "continuity-equation",
    name: "Ecuación de continuidad",
    author: "Mecánica de fluidos clásica",
    year: 1755,
    field: "Fluidos",
    level: "Bachillerato",
    color: "#5fa0ff",
    formula: [
      String.raw`A_1v_1=A_2v_2`,
      String.raw`Q=Av`,
      String.raw`\frac{\partial \rho}{\partial t}+\nabla\cdot(\rho\mathbf{u})=0`,
      String.raw`\nabla\cdot\mathbf{u}=0\quad(\rho=\mathrm{cte})`
    ],
    summary: "Expresa conservación de masa en un flujo: si cambia el área disponible, la velocidad debe compensarlo para mantener el caudal.",
    meaning: "La ecuación de continuidad dice que la masa no aparece ni desaparece dentro de un flujo ordinario. En una tubería o canal ideal, si el fluido es incompresible y el régimen es estacionario, el caudal Q permanece constante: A·v no cambia entre dos secciones. Por eso, al estrecharse un conducto, la velocidad aumenta; al ensancharse, la velocidad disminuye. Su forma diferencial es más general: relaciona la variación temporal de la densidad con la divergencia del flujo de masa. En lenguaje físico, es una ley local de conservación aplicada a fluidos.",
    variables: ["A: área de la sección transversal", "v: velocidad media del flujo", "Q: caudal volumétrico", "ρ: densidad", "u: campo de velocidades", "∇·: divergencia", "A₁,A₂: secciones de entrada y salida", "v₁,v₂: velocidades en cada sección"],
    history: "La continuidad nace de la idea general de conservación de materia y se formaliza dentro de la mecánica de fluidos y la mecánica continua. Su versión elemental, A₁v₁=A₂v₂, aparece en hidráulica, tuberías y canales como una regla práctica para fluidos incompresibles. La versión diferencial se convirtió en una pieza estructural de las ecuaciones de Euler y Navier-Stokes, donde acompaña a las ecuaciones de cantidad de movimiento.",
    uses: ["Hidráulica", "Tuberías", "Canales", "Aerodinámica", "Navier-Stokes", "Medición de caudal"],
    useDetails: [
      { title: "Hidráulica", text: "Permite relacionar secciones y velocidades en canales, boquillas, compuertas y conducciones. Es la primera comprobación de balance antes de añadir pérdidas, presión o energía." },
      { title: "Tuberías", text: "Si una tubería se estrecha, la ecuación predice el aumento de velocidad en la zona estrecha. Esa lectura se combina después con Bernoulli para estudiar variaciones de presión." },
      { title: "Canales", text: "En canales abiertos ayuda a interpretar cómo cambia la velocidad cuando varía la profundidad o la anchura de la sección mojada." },
      { title: "Aerodinámica", text: "En flujos de aire, la continuidad se usa junto a compresibilidad y ecuaciones de estado para entender difusores, toberas y variaciones de velocidad." },
      { title: "Navier-Stokes", text: "La ecuación de continuidad proporciona la conservación de masa que debe cumplir cualquier solución físicamente aceptable de Navier-Stokes." }
    ],
    derivation: "Toma un volumen de control con una entrada y una salida. En régimen estacionario, la masa que entra por unidad de tiempo debe igualar a la masa que sale. El flujo másico es ρAv. Si el fluido es incompresible, ρ es la misma en ambas secciones, por lo que ρA₁v₁=ρA₂v₂ se reduce a A₁v₁=A₂v₂. En forma local se considera un volumen diferencial: la variación de densidad dentro del volumen más el flujo neto de masa que sale por sus caras debe sumar cero. Eso produce ∂ρ/∂t+∇·(ρu)=0. Si ρ es constante, queda ∇·u=0.",
    simulation: "flow"
  },
  {
    id: "newton-second-law",
    name: "Segunda ley de Newton",
    author: "Isaac Newton",
    year: 1687,
    field: "Mecánica clásica",
    level: "ESO",
    color: "#5d5af6",
    formula: [String.raw`\mathbf{F}_{\mathrm{net}}=m\mathbf{a}`, String.raw`\mathbf{F}=\frac{d\mathbf{p}}{dt}`, String.raw`\mathbf{p}=m\mathbf{v}`],
    summary: "Relaciona fuerza neta, masa y aceleración: la dinámica cambia cuando una fuerza desequilibra el estado de movimiento.",
    meaning: "La segunda ley no dice simplemente que una fuerza mueve un cuerpo; dice que la fuerza neta cambia su momento. En el caso de masa constante, ese cambio se expresa como F=ma. La masa mide la resistencia inercial a cambiar de velocidad: con la misma fuerza, una masa grande acelera menos que una pequeña. La aceleración apunta en la dirección de la fuerza neta, no necesariamente en la dirección de la velocidad. Por eso esta ley es el núcleo de la dinámica clásica: permite pasar de una descripción de trayectorias a una explicación causal mediante interacciones.",
    variables: ["Fnet: fuerza neta o resultante", "m: masa inercial", "a: aceleración", "p: momento lineal", "v: velocidad", "d/dt: derivada temporal", "N: newton, unidad de fuerza"],
    history: "Newton formuló sus leyes del movimiento en los Principia de 1687. La segunda ley articuló la relación entre fuerzas y cambios de movimiento y dio a la mecánica una estructura matemática predictiva. En formulación moderna, F=dp/dt es más general que F=ma, porque permite tratar sistemas donde cambia la masa o aparece una descripción relativista mediante momento. Para velocidades cotidianas y masa constante, F=ma sigue siendo una de las ecuaciones más útiles de toda la física.",
    uses: ["Dinámica", "Ingeniería", "Robótica", "Vehículos", "Estructuras", "Simulación física"],
    useDetails: [
      { title: "Dinámica", text: "Permite calcular aceleraciones a partir de fuerzas conocidas y, al integrar, obtener velocidades y posiciones." },
      { title: "Ingeniería", text: "Se usa para dimensionar motores, actuadores, frenos, impactos, cargas y respuestas mecánicas de sistemas." },
      { title: "Robótica", text: "Relaciona pares, fuerzas, masas y aceleraciones en brazos, móviles y manipuladores." },
      { title: "Vehículos", text: "Permite estimar aceleración, frenada, tracción y efectos de masa, rozamiento y resistencia aerodinámica." },
      { title: "Simulación física", text: "Los motores de física integran fuerzas para actualizar aceleraciones, velocidades y posiciones de cuerpos." }
    ],
    derivation: "La formulación moderna parte del momento lineal p=mv. Newton relaciona la fuerza neta con la tasa de cambio del momento: F=dp/dt. Si la masa es constante, entonces dp/dt=d(mv)/dt=m·dv/dt. Como dv/dt es la aceleración, queda F=ma. Esta deducción aclara el alcance de la fórmula: F=ma es el caso más familiar, pero la idea profunda es que una fuerza neta modifica el momento del sistema.",
    simulation: "gravity"
  },
  {
    id: "taylor-series",
    name: "Serie de Taylor",
    author: "Brook Taylor",
    year: 1715,
    field: "Análisis",
    level: "Universidad inicial",
    color: "#7b61ff",
    formula: [String.raw`f(x)=\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}(x-a)^n`, String.raw`\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\frac{x^7}{7!}+\cdots`, String.raw`P_N(x)=\sum_{n=0}^{N}\frac{f^{(n)}(a)}{n!}(x-a)^n`],
    summary: "Aproxima una función mediante un polinomio construido con sus derivadas en un punto.",
    meaning: "La serie de Taylor traduce comportamiento local en una expresión algebraica. Si una función es suficientemente regular, sus derivadas en un punto contienen información sobre pendiente, curvatura y cambios de orden superior. Con esos datos se construye un polinomio que imita la función cerca del centro de expansión. Cuantos más términos se añaden, mejor suele ser la aproximación en una región más amplia, aunque la convergencia depende de la función y del punto. La serie es una herramienta puente entre cálculo diferencial, aproximación numérica y análisis de funciones.",
    variables: ["f: función original", "a: centro de expansión", "x: punto donde se evalúa", "f⁽ⁿ⁾(a): derivada n-ésima en a", "n!: factorial", "P_N: polinomio de Taylor truncado", "N: grado de aproximación"],
    history: "Brook Taylor publicó su fórmula en 1715, aunque ideas relacionadas aparecieron antes en trabajos de Newton, Gregory y otros matemáticos del cálculo temprano. Con el tiempo, las series de Taylor se convirtieron en una herramienta central para aproximar funciones, resolver ecuaciones diferenciales, estudiar convergencia y construir métodos numéricos. La serie de Maclaurin es el caso particular centrado en a=0.",
    uses: ["Aproximación", "Métodos numéricos", "Física", "Ingeniería", "Cálculo simbólico", "Ecuaciones diferenciales"],
    useDetails: [
      { title: "Aproximación", text: "Permite reemplazar funciones complicadas por polinomios manejables cerca de un punto." },
      { title: "Métodos numéricos", text: "Muchos algoritmos usan truncamientos de Taylor para estimar errores, diseñar integradores y aproximar funciones elementales." },
      { title: "Física", text: "Se usa para linealizar sistemas cerca del equilibrio, aproximar potenciales y estudiar pequeñas oscilaciones." },
      { title: "Ingeniería", text: "Ayuda a simplificar modelos no lineales cuando las variaciones son pequeñas alrededor de un régimen de operación." },
      { title: "Ecuaciones diferenciales", text: "Las soluciones por series expresan funciones desconocidas como polinomios infinitos determinados por recurrencias." }
    ],
    derivation: "Se busca un polinomio P(x)=c₀+c₁(x-a)+c₂(x-a)²+... que coincida con la función y con sus derivadas en x=a. Primero P(a)=c₀ debe igualar f(a). Al derivar, P'(a)=c₁ debe igualar f'(a). La segunda derivada da P''(a)=2c₂, por lo que c₂=f''(a)/2!. En general, la derivada n-ésima en a produce n!cₙ=f⁽ⁿ⁾(a). Por tanto, cₙ=f⁽ⁿ⁾(a)/n!, y al sustituir se obtiene la serie de Taylor. El truncamiento en grado N produce el polinomio de Taylor P_N.",
    simulation: "wave"
  },
  {
    id: "wave-equation",
    name: "Ecuación de onda",
    author: "D'Alembert",
    year: 1746,
    field: "Ondas",
    level: "Bachillerato",
    color: "#5fa0ff",
    formula: [String.raw`\frac{\partial^2 u}{\partial t^2}=c^2\nabla^2u`, String.raw`\frac{\partial^2 u}{\partial t^2}=c^2\frac{\partial^2 u}{\partial x^2}`, String.raw`u(x,t)=f(x-ct)+g(x+ct)`],
    summary: "Describe cómo se propagan perturbaciones en cuerdas, sonido, luz, agua, sólidos y campos.",
    meaning: "La ecuación de onda afirma que la aceleración temporal de una perturbación es proporcional a su curvatura espacial. Si una cuerda está curvada en un punto, la tensión genera una aceleración que tiende a enderezarla; esa corrección local se propaga como una onda. El parámetro c fija la velocidad de propagación. La solución unidimensional ideal puede verse como la suma de dos perfiles que viajan sin deformarse en sentidos opuestos. Esa idea explica pulsos, reflexión, interferencia, modos normales y resonancia.",
    variables: ["u: desplazamiento o amplitud", "t: tiempo", "x: posición", "c: velocidad de propagación", "∇²: laplaciano", "f,g: perfiles viajeros", "u_tt: segunda derivada temporal", "u_xx: segunda derivada espacial"],
    history: "La ecuación de onda apareció en el estudio de cuerdas vibrantes durante el siglo XVIII, con contribuciones de D'Alembert, Euler y Bernoulli. Su importancia creció al convertirse en lenguaje común para acústica, elasticidad, electromagnetismo, óptica y física matemática. Más tarde, el análisis de Fourier permitió descomponer ondas en modos y frecuencias, ampliando enormemente su poder técnico.",
    uses: ["Acústica", "Cuerdas", "Sismología", "Electromagnetismo", "Óptica", "Simulación numérica"],
    useDetails: [
      { title: "Acústica", text: "Modela la propagación de presión sonora en aire y otros medios, bajo aproximaciones lineales." },
      { title: "Cuerdas", text: "Describe vibraciones de cuerdas tensas, modos normales y frecuencias de instrumentos." },
      { title: "Sismología", text: "Sirve como base para estudiar ondas sísmicas en medios elásticos, con modelos más complejos para capas terrestres." },
      { title: "Electromagnetismo", text: "En el vacío, las ecuaciones de Maxwell conducen a ecuaciones de onda para los campos eléctrico y magnético." },
      { title: "Simulación numérica", text: "Los esquemas de diferencias finitas permiten propagar pulsos, estudiar reflexión y visualizar estabilidad numérica." }
    ],
    derivation: "Para una cuerda tensa se toma un pequeño segmento. La tensión actúa en sus extremos y, para pequeñas pendientes, la fuerza vertical neta es proporcional a la curvatura espacial del desplazamiento. Por la segunda ley de Newton, esa fuerza neta debe igualar masa por aceleración. Al dividir por la densidad lineal se obtiene u_tt=c²u_xx, donde c² es la razón entre tensión y densidad lineal. En varias dimensiones, la curvatura espacial se expresa mediante el laplaciano ∇²u.",
    simulation: "wave"
  }
];
