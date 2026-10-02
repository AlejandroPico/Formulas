# Significado

Una enzima, un sustrato y producto inicialmente nulo. Compara velocidad inicial con evolución integrada cuasiestacionaria, en la que el sustrato disminuye y el producto crece.

## Qué conserva y qué cambia

Para E+S⇌ES→E+P, el estado cuasiestacionario satisface 0≈k1[E][S]−(k−1+kcat)[ES]. Con enzima total [E]tot=[E]+[ES], resuelve [ES]=[E]tot[S]/(Km+[S]) y v=kcat[ES]. Así Km=(k−1+kcat)/k1; solo bajo equilibrio rápido y kcat pequeño se aproxima a una constante de disociación. Para agotamiento irreversible y parámetros constantes, integra dS/dt=−Vmax S/(Km+S): Vmax t=S0−S+Km ln(S0/S). El código invierte esta ecuación monótona y conserva S+P=S0.

## Primera predicción

Una enzima, un sustrato y producto inicialmente nulo. Compara velocidad inicial con evolución integrada cuasiestacionaria, en la que el sustrato disminuye y el producto crece. Calcula velocidad inicial con los datos iniciales, en mM/min. Velocidad inicial=5 mM/min. v0=Vmax S0/(Km+S0); durante el proceso Vmax t=S0−S+Km ln(S0/S).
