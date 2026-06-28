export const completedEquations = [
  {
    id: "bayes-theorem",
    name: "Teorema de Bayes",
    author: "Thomas Bayes",
    year: 1763,
    field: "Probabilidad",
    level: "Universidad inicial",
    color: "#5fa0ff",
    formula: [
      String.raw`P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)}`,
      String.raw`P(A_i\mid B)=\frac{P(B\mid A_i)P(A_i)}{\sum_j P(B\mid A_j)P(A_j)}`,
      String.raw`p(\theta\mid D)=\frac{p(D\mid\theta)p(\theta)}{p(D)}`
    ],
    summary: "Actualiza probabilidades con evidencia, tanto en forma discreta como paramétrica.",
    meaning: "Relaciona probabilidad previa, verosimilitud, evidencia y probabilidad posterior.",
    variables: ["Aᵢ: hipótesis", "B/D: evidencia o datos", "θ: parámetro", "P/p: probabilidad"],
    history: "Base de la inferencia bayesiana moderna.",
    uses: ["IA", "Diagnóstico", "Estadística", "Toma de decisiones"],
    derivation: "Sale de igualar P(A∩B)=P(A|B)P(B)=P(B|A)P(A) y normalizar sobre hipótesis.",
    simulation: "particles"
  },
  {
    id: "normal-distribution",
    name: "Distribución normal",
    author: "Gauss y Laplace",
    year: 1809,
    field: "Estadística",
    level: "Bachillerato",
    color: "#8cf0c8",
    formula: [
      String.raw`f(x)=\frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{(x-\mu)^2}{2\sigma^2}}`,
      String.raw`Z=\frac{X-\mu}{\sigma}`,
      String.raw`X\sim\mathcal{N}(\mu,\sigma^2)`
    ],
    summary: "Modelo central de variabilidad alrededor de una media, con estandarización incluida.",
    meaning: "Describe datos donde muchos efectos pequeños se suman y permite comparar valores mediante puntuaciones Z.",
    variables: ["μ: media", "σ: desviación típica", "X: variable", "Z: variable tipificada"],
    history: "Se consolidó con errores de medida y teoría límite central.",
    uses: ["Estadística", "Medición", "Riesgo", "Control de calidad"],
    derivation: "Aparece como límite de sumas normalizadas de variables independientes.",
    simulation: "particles"
  },
  {
    id: "ideal-gas-law",
    name: "Ley de los gases ideales",
    author: "Clapeyron",
    year: 1834,
    field: "Termodinámica",
    level: "Bachillerato",
    color: "#ffb36b",
    formula: [
      String.raw`PV=nRT`,
      String.raw`PV=Nk_BT`,
      String.raw`pV^\gamma=\mathrm{cte}\quad(\mathrm{adiab\acute atico})`
    ],
    summary: "Relaciona presión, volumen, cantidad y temperatura, con forma molecular y caso adiabático ideal.",
    meaning: "Resume el comportamiento macroscópico de gases diluidos y conecta moles con partículas.",
    variables: ["P/p: presión", "V: volumen", "n: moles", "N: partículas", "R/kB: constantes", "T: temperatura", "γ: índice adiabático"],
    history: "Sintetiza leyes previas de Boyle, Charles y Avogadro.",
    uses: ["Química", "Motores", "Meteorología", "Laboratorio"],
    derivation: "Sale del promedio estadístico de partículas libres en un recipiente.",
    simulation: "particles"
  },
  {
    id: "heisenberg-uncertainty",
    name: "Principio de incertidumbre",
    author: "Werner Heisenberg",
    year: 1927,
    field: "Física cuántica",
    level: "Universidad",
    color: "#7b61ff",
    formula: [
      String.raw`\Delta x\,\Delta p\geq\frac{\hbar}{2}`,
      String.raw`\Delta A\,\Delta B\geq\frac{1}{2}|\langle[\hat A,\hat B]\rangle|`,
      String.raw`\Delta E\,\Delta t\gtrsim\frac{\hbar}{2}`
    ],
    summary: "Limita la precisión simultánea de pares de observables incompatibles.",
    meaning: "No es un fallo de medida, sino una consecuencia de la estructura algebraica de los estados cuánticos.",
    variables: ["Δx: dispersión de posición", "Δp: dispersión de momento", "A/B: observables", "[A,B]: conmutador"],
    history: "Uno de los principios centrales de la mecánica cuántica.",
    uses: ["Átomos", "Túnel", "Óptica cuántica", "Información cuántica"],
    derivation: "Se obtiene de la desigualdad de Cauchy-Schwarz aplicada a operadores no conmutativos.",
    simulation: "quantum"
  },
  {
    id: "lorentz-force",
    name: "Fuerza de Lorentz",
    author: "Hendrik Lorentz",
    year: 1895,
    field: "Electromagnetismo",
    level: "Bachillerato",
    color: "#5fa0ff",
    formula: [
      String.raw`\mathbf{F}=q(\mathbf{E}+\mathbf{v}\times\mathbf{B})`,
      String.raw`\frac{d\mathbf{p}}{dt}=q(\mathbf{E}+\mathbf{v}\times\mathbf{B})`,
      String.raw`\mathbf{F}=q\mathbf{E}\quad(\mathbf v=0)`
    ],
    summary: "Fuerza sobre una carga en campos eléctricos y magnéticos, con forma dinámica relativista.",
    meaning: "El campo eléctrico acelera cargas y el magnético curva trayectorias de cargas en movimiento.",
    variables: ["q: carga", "E: campo eléctrico", "v: velocidad", "B: campo magnético", "p: momento"],
    history: "Clave para conectar campos electromagnéticos y movimiento de cargas.",
    uses: ["Motores", "Aceleradores", "Plasmas", "Sensores"],
    derivation: "Es la forma local de interacción entre carga y campo electromagnético.",
    simulation: "field"
  },
  {
    id: "einstein-field-equations",
    name: "Relatividad general de Einstein",
    author: "Albert Einstein",
    year: 1915,
    field: "Relatividad general",
    level: "Avanzado",
    color: "#d69a2d",
    formula: [
      String.raw`R_{\mu\nu}-\frac{1}{2}Rg_{\mu\nu}+\Lambda g_{\mu\nu}=\frac{8\pi G}{c^4}T_{\mu\nu}`,
      String.raw`G_{\mu\nu}=R_{\mu\nu}-\frac{1}{2}Rg_{\mu\nu}`,
      String.raw`\frac{d^2x^\mu}{d\tau^2}+\Gamma^\mu_{\alpha\beta}\frac{dx^\alpha}{d\tau}\frac{dx^\beta}{d\tau}=0`,
      String.raw`ds^2=g_{\mu\nu}dx^\mu dx^\nu`
    ],
    summary: "Relaciona curvatura, métrica, constante cosmológica, energía-momento y movimiento geodésico.",
    meaning: "La materia curva el espacio-tiempo y esa curvatura guía el movimiento de cuerpos y luz.",
    variables: ["Rμν: tensor de Ricci", "R: escalar de curvatura", "gμν: métrica", "Λ: constante cosmológica", "Tμν: energía-momento", "Γ: conexión"],
    history: "Fundamento matemático de la relatividad general.",
    uses: ["Agujeros negros", "Cosmología", "GPS", "Ondas gravitacionales"],
    derivation: "Surge al buscar ecuaciones covariantes que reduzcan a Newton en campos débiles y conserven energía-momento.",
    simulation: "gravity"
  },
  {
    id: "friedmann-equation",
    name: "Ecuaciones de Friedmann",
    author: "Alexander Friedmann",
    year: 1922,
    field: "Cosmología",
    level: "Avanzado",
    color: "#c973ff",
    formula: [
      String.raw`H^2=\left(\frac{\dot a}{a}\right)^2=\frac{8\pi G}{3}\rho-\frac{kc^2}{a^2}+\frac{\Lambda c^2}{3}`,
      String.raw`\frac{\ddot a}{a}=-\frac{4\pi G}{3}\left(\rho+\frac{3p}{c^2}\right)+\frac{\Lambda c^2}{3}`,
      String.raw`\dot\rho+3H\left(\rho+\frac{p}{c^2}\right)=0`
    ],
    summary: "Sistema cosmológico que describe expansión, aceleración y conservación de energía en un universo FLRW.",
    meaning: "La tasa de expansión depende de densidad, presión, curvatura y constante cosmológica.",
    variables: ["H: parámetro de Hubble", "a: factor de escala", "ρ: densidad", "p: presión", "k: curvatura", "Λ: constante cosmológica"],
    history: "Base de la cosmología relativista moderna.",
    uses: ["Cosmología", "Big Bang", "Materia oscura", "Energía oscura"],
    derivation: "Sale de aplicar relatividad general a la métrica FLRW.",
    simulation: "energy"
  }
];
