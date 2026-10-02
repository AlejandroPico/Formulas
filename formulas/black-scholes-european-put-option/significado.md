# Significado

Black–Scholes–Merton europeo con volatilidad, tipos y dividendo continuo constantes. Se tratan T=0 y σ=0 mediante límites correctos; no se afirma que el mercado real siga este modelo.

## Qué conserva y qué cambia

Bajo el modelo de difusión lognormal con volatilidad constante, replicación continua y mercado ideal, la valoración neutral al riesgo descuenta el pago europeo. Integrar bajo la ley lognormal produce términos de normal acumulada con d1 y d2. El dividendo continuo descuenta la parte de subyacente por e⁻ᑫᵀ. La fórmula de put y call respeta paridad. En T=0 se usa pago final; para σ=0 se usa el límite determinista descontado, evitando divisiones por cero.

## Primera predicción

Black–Scholes–Merton europeo con volatilidad, tipos y dividendo continuo constantes. Se tratan T=0 y σ=0 mediante límites correctos; no se afirma que el mercado real siga este modelo. Calcula prima put con los datos iniciales en u.m.. Prima put=5,5735 u.m.. d1=[ln(S/K)+(r−q+σ²/2)T]/(σ√T), d2=d1−σ√T; descuentos continuos.
