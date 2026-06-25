export const equations = [
  {
    id: "newton-gravitation",
    name: "Ley de gravitación universal",
    author: "Isaac Newton",
    year: 1687,
    field: "Mecánica clásica",
    level: "Bachillerato",
    color: "#77d9ff",
    formula: [
      String.raw`\mathbf{F}_{12}=-G\frac{m_1m_2}{r^2}\,\hat{\mathbf r}`,
      String.raw`\Phi(r)=-\frac{GM}{r}`,
      String.raw`\mathbf{g}=-\nabla\Phi`
    ],
    summary: "Describe la atracción gravitatoria entre dos masas y convirtió el cielo y la Tierra en un único problema mecánico.",
    meaning: "La fuerza gravitatoria aumenta con el producto de las masas y disminuye con el cuadrado de la distancia. Su forma potencial permite expresar campos y órbitas con mayor generalidad.",
    variables: ["F: fuerza gravitatoria", "G: constante de gravitación universal", "m₁ y m₂: masas de los cuerpos", "r: distancia entre los centros de masa", "Φ: potencial gravitatorio"],
    history: "Publicada en los Principia, unificó la física terrestre de Galileo con la astronomía de Kepler.",
    uses: ["Órbitas planetarias", "Satélites artificiales", "Mecánica celeste", "Estimación de masas astronómicas"],
    derivation: "Puede leerse como una síntesis entre la aceleración centrípeta de una órbita y la tercera ley de Kepler, generalizada a cualquier par de masas.",
    simulation: "gravity"
  },
  {
    id: "euler-identity",
    name: "Identidad de Euler",
    author: "Leonhard Euler",
    year: 1748,
    field: "Matemáticas",
    level: "Universidad inicial",
    color: "#d6a8ff",
    formula: [
      String.raw`e^{ix}=\cos x+i\sin x`,
      String.raw`e^{i\pi}+1=0`
    ],
    summary: "Relaciona cinco constantes fundamentales en una sola igualdad: e, i, π, 1 y 0.",
    meaning: "La identidad famosa es el caso x=π de la fórmula completa de Euler, que conecta exponenciales complejas con seno y coseno.",
    variables: ["e: base de los logaritmos naturales", "i: unidad imaginaria", "π: razón entre circunferencia y diámetro", "1 y 0: identidades multiplicativa y aditiva"],
    history: "Condensa el desarrollo del análisis complejo y de las series infinitas del siglo XVIII.",
    uses: ["Números complejos", "Señales", "Transformadas", "Física ondulatoria"],
    derivation: "Sale al comparar las series de Taylor de eˣ, seno y coseno al sustituir x por iθ.",
    simulation: "complex"
  },
  {
    id: "fourier-transform",
    name: "Transformada de Fourier",
    author: "Joseph Fourier",
    year: 1822,
    field: "Matemáticas",
    level: "Universidad",
    color: "#8cf0c8",
    formula: [
      String.raw`\hat f(\xi)=\int_{-\infty}^{\infty} f(x)e^{-2\pi i x\xi}\,dx`,
      String.raw`f(x)=\int_{-\infty}^{\infty}\hat f(\xi)e^{2\pi i x\xi}\,d\xi`,
      String.raw`\int |f(x)|^2\,dx=\int |\hat f(\xi)|^2\,d\xi`
    ],
    summary: "Descompone una señal en frecuencias, como si cualquier forma fuera una mezcla de ondas puras.",
    meaning: "Permite pasar del dominio espacial o temporal al dominio frecuencial, invertir la representación y conservar energía bajo condiciones estándar.",
    variables: ["f(x): señal original", "ξ: frecuencia", "e^{-2πixξ}: oscilación compleja", "f̂(ξ): contenido frecuencial"],
    history: "Nació del estudio de la conducción del calor y acabó convirtiéndose en una infraestructura matemática universal.",
    uses: ["Procesamiento de imagen", "Audio digital", "Telecomunicaciones", "Difracción y óptica"],
    derivation: "Parte de representar funciones periódicas como sumas de senos y cosenos; el límite continuo lleva a la integral transformada.",
    simulation: "wave"
  },
  {
    id: "maxwell-equations",
    name: "Ecuaciones de Maxwell",
    author: "James Clerk Maxwell",
    year: 1865,
    field: "Electromagnetismo",
    level: "Universidad",
    color: "#ffd37a",
    formula: [
      String.raw`\nabla\cdot\mathbf{E}=\frac{\rho}{\varepsilon_0}`,
      String.raw`\nabla\cdot\mathbf{B}=0`,
      String.raw`\nabla\times\mathbf{E}=-\frac{\partial\mathbf{B}}{\partial t}`,
      String.raw`\nabla\times\mathbf{B}=\mu_0\mathbf{J}+\mu_0\varepsilon_0\frac{\partial\mathbf{E}}{\partial t}`
    ],
    summary: "Unifican electricidad, magnetismo y luz en un único marco de campos.",
    meaning: "Explican cómo las cargas generan campos eléctricos, por qué no hay monopolos magnéticos clásicos, cómo un campo magnético variable induce electricidad y cómo la luz surge como onda electromagnética.",
    variables: ["E: campo eléctrico", "B: campo magnético", "ρ: densidad de carga", "J: densidad de corriente", "ε₀ y μ₀: constantes del vacío"],
    history: "Maxwell reorganizó leyes previas de Gauss, Faraday y Ampère, añadiendo la corriente de desplazamiento.",
    uses: ["Radio", "Antenas", "Óptica", "Electrónica", "Telecomunicaciones"],
    derivation: "Al combinar las leyes en el vacío aparece una ecuación de onda cuya velocidad coincide con la velocidad de la luz.",
    simulation: "field"
  },
  {
    id: "boltzmann-entropy",
    name: "Entropía de Boltzmann",
    author: "Ludwig Boltzmann",
    year: 1877,
    field: "Termodinámica",
    level: "Universidad inicial",
    color: "#ff9fb2",
    formula: [
      String.raw`S=k_B\ln\Omega`,
      String.raw`S=-k_B\sum_i p_i\ln p_i`,
      String.raw`S=-k_B\operatorname{Tr}(\rho\ln\rho)`
    ],
    summary: "Conecta la entropía macroscópica con microestados, distribuciones de probabilidad y estados estadísticos.",
    meaning: "Cuantos más estados microscópicos compatibles con lo que vemos a gran escala, mayor es la entropía.",
    variables: ["S: entropía", "kᴮ: constante de Boltzmann", "Ω: número de microestados compatibles", "pᵢ: probabilidad", "ρ: matriz densidad"],
    history: "Fundó la interpretación estadística de la termodinámica y dio sentido microscópico a la irreversibilidad.",
    uses: ["Gases", "Física estadística", "Información", "Materia condensada"],
    derivation: "Se exige que la entropía sea aditiva para sistemas independientes; el logaritmo convierte productos de microestados en sumas.",
    simulation: "particles"
  },
  {
    id: "planck-law",
    name: "Ley de Planck",
    author: "Max Planck",
    year: 1900,
    field: "Física cuántica",
    level: "Universidad",
    color: "#ffb86b",
    formula: [
      String.raw`B_\nu(T)=\frac{2h\nu^3}{c^2}\frac{1}{e^{h\nu/k_BT}-1}`,
      String.raw`B_\lambda(T)=\frac{2hc^2}{\lambda^5}\frac{1}{e^{hc/(\lambda k_BT)}-1}`,
      String.raw`E=h\nu`
    ],
    summary: "Describe la radiación de un cuerpo negro y abrió la puerta a la cuantización de la energía.",
    meaning: "La radiancia puede expresarse por frecuencia o por longitud de onda, y solo encaja con los datos si la energía se intercambia en cuantos.",
    variables: ["Bν/Bλ: radiancia espectral", "h: constante de Planck", "ν: frecuencia", "λ: longitud de onda", "c: velocidad de la luz", "T: temperatura", "kᴮ: constante de Boltzmann"],
    history: "Resolvió la catástrofe ultravioleta y marcó el inicio de la teoría cuántica.",
    uses: ["Astrofísica", "Temperatura estelar", "Radiación térmica", "Cosmología"],
    derivation: "Combina modos electromagnéticos de una cavidad con osciladores de energía cuantizada E = hν.",
    simulation: "spectrum"
  },
  {
    id: "einstein-relativity",
    name: "Equivalencia masa-energía",
    author: "Albert Einstein",
    year: 1905,
    field: "Relatividad",
    level: "Bachillerato",
    color: "#9cc9ff",
    formula: [
      String.raw`E_0=mc^2`,
      String.raw`E^2=(pc)^2+(mc^2)^2`,
      String.raw`E=\gamma mc^2`,
      String.raw`K=(\gamma-1)mc^2`
    ],
    summary: "Afirma que la masa es una forma concentrada de energía y se completa con la relación energía-momento.",
    meaning: "E=mc² es el caso de reposo. En movimiento aparece el momento relativista y el factor de Lorentz.",
    variables: ["E₀: energía en reposo", "E: energía total", "p: momento", "m: masa", "c: velocidad de la luz", "γ: factor de Lorentz", "K: energía cinética"],
    history: "Surge en el contexto de la relatividad especial, donde espacio, tiempo, energía y momento se reorganizan.",
    uses: ["Física nuclear", "Astrofísica", "Energía de enlace", "Partículas elementales"],
    derivation: "Puede obtenerse al analizar el cuadrimomento relativista y separar la energía en reposo del término cinético.",
    simulation: "energy"
  },
  {
    id: "schrodinger-equation",
    name: "Ecuación de Schrödinger",
    author: "Erwin Schrödinger",
    year: 1926,
    field: "Física cuántica",
    level: "Universidad",
    color: "#8cf0c8",
    formula: [
      String.raw`i\hbar\frac{\partial}{\partial t}\Psi(\mathbf r,t)=\hat H\Psi(\mathbf r,t)`,
      String.raw`\hat H=-\frac{\hbar^2}{2m}\nabla^2+V(\mathbf r,t)`,
      String.raw`\hat H\psi_n=E_n\psi_n`
    ],
    summary: "Describe la evolución temporal y los estados estacionarios de un sistema cuántico.",
    meaning: "La función de onda codifica amplitudes de probabilidad. El Hamiltoniano determina tanto la evolución como los niveles de energía.",
    variables: ["Ψ: función de onda", "i: unidad imaginaria", "ℏ: constante reducida de Planck", "Ĥ: Hamiltoniano", "V: potencial", "Eₙ: energía"],
    history: "Dio una formulación ondulatoria de la mecánica cuántica y explicó niveles atómicos discretos.",
    uses: ["Átomos", "Química cuántica", "Túnel cuántico", "Nanotecnología"],
    derivation: "Sustituye las magnitudes clásicas de energía y momento por operadores aplicados a una onda compleja.",
    simulation: "quantum"
  },
  {
    id: "dirac-equation",
    name: "Ecuación de Dirac",
    author: "Paul Dirac",
    year: 1928,
    field: "Física cuántica",
    level: "Avanzado",
    color: "#c7a6ff",
    formula: [
      String.raw`(i\hbar\gamma^\mu\partial_\mu-mc)\psi=0`,
      String.raw`i\hbar\frac{\partial\psi}{\partial t}=\left(c\boldsymbol{\alpha}\cdot\mathbf p+\beta mc^2\right)\psi`
    ],
    summary: "Combina mecánica cuántica y relatividad especial para partículas de espín 1/2.",
    meaning: "Predice de forma natural el espín del electrón y la existencia de antipartículas.",
    variables: ["γμ: matrices gamma", "∂μ: derivada espaciotemporal", "m: masa", "ψ: espinor de Dirac", "α y β: matrices de Dirac"],
    history: "Fue una de las grandes síntesis teóricas del siglo XX y anticipó el positrón.",
    uses: ["Física de partículas", "Antimateria", "Electrones relativistas", "Teoría cuántica de campos"],
    derivation: "Busca una ecuación lineal en derivadas temporales y espaciales que al cuadrado reproduzca la relación relativista energía-momento.",
    simulation: "spinor"
  },
  {
    id: "navier-stokes",
    name: "Navier-Stokes",
    author: "Claude-Louis Navier y George Stokes",
    year: 1845,
    field: "Fluidos",
    level: "Avanzado",
    color: "#77d9ff",
    formula: [
      String.raw`\frac{\partial\rho}{\partial t}+\nabla\cdot(\rho\mathbf u)=0`,
      String.raw`\rho\left(\frac{\partial\mathbf u}{\partial t}+\mathbf u\cdot\nabla\mathbf u\right)=-\nabla p+\mu\nabla^2\mathbf u+\mathbf f`,
      String.raw`\nabla\cdot\mathbf u=0\quad(\rho=\mathrm{cte})`
    ],
    summary: "Modela el movimiento de fluidos viscosos junto con la conservación de masa.",
    meaning: "Equilibra continuidad, inercia, presión, viscosidad y fuerzas externas para describir la velocidad de un fluido en cada punto.",
    variables: ["ρ: densidad", "u: velocidad del fluido", "p: presión", "μ: viscosidad", "f: fuerzas externas"],
    history: "Creció a partir de la mecánica continua y es esencial para entender turbulencia, aerodinámica y meteorología.",
    uses: ["Aerodinámica", "Meteorología", "Océanos", "Sangre y biofluidos", "Ingeniería"],
    derivation: "Es la segunda ley de Newton aplicada a un volumen diferencial de fluido, añadiendo conservación de masa y términos de presión y viscosidad.",
    simulation: "flow"
  }
];
