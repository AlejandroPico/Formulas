# Derivación

Para J=(ax²+by²)/2, el gradiente es (ax,by). Cada actualización da xk+1=(1−ηa)xk y yk+1=(1−ηb)yk. Por tanto xk=(1−ηa)^k x0 y análogamente y. Convergencia para cualquier punto inicial requiere |1−ηa|<1 y |1−ηb|<1, equivalente a 0<η<2/max(a,b). En el límite pueden aparecer oscilaciones sin decaimiento.

## Comprueba el resultado

J=x²/2 y x=2. ¿Cuánto vale ∂J/∂x? El gradiente es x=2.

## Condiciones necesarias

a,b>0, paso constante y gradiente exacto. La cota escrita es para esta cuadrática; en funciones generales exige condiciones adicionales. Los valores fuera de la ventana gráfica se conservan en el cálculo, no se recortan para fingir estabilidad.
