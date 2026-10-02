# Limitaciones

η>0, β y β2 menores que uno, ε=10⁻⁸; operaciones componente a componente. La escala del paso y memoria afectan estabilidad y no garantizan descenso en cada iteración. Parámetros, gradientes y pérdida usan unidades reducidas; en RMSProp el control β de primera memoria no interviene.

El laboratorio deriva F=(x²+κy²)/2 exactamente: g=(x,κy). Adam combina media exponencial de gradiente y cuadrado, corrige su sesgo por inicialización en cero y divide componente a componente. No es AdamW y no añade regularización. El recorrido contiene iteraciones reales, no una interpolación animada; las curvas muestran el paisaje y las barras el último gradiente y paso.

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
