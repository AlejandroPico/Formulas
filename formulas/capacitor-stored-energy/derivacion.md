# Derivación

Para añadir una carga dq a una placa que ya tiene q, el trabajo diferencial es dU=Vdq=(q/C)dq. Integra de cero a Q: U=Q²/(2C); sustituye Q=CV y obtienes ½CV² y ½QV. En el circuito de carga, la ley de tensiones da RC·dVc/dt+Vc=Vs con Vc(0)=0; la solución es Vs(1−e^(−t/RC)). Integrar i²R produce el calor acumulado y permite verificar que energía suministrada=U+calor. En descarga, Vc=V₀e^(−t/RC) y la energía inicial se reparte entre U y calor.

## Comprobación

C=10 µF y V=4 V almacenan 80 µJ; a 8 V almacenan 320 µJ. En carga RC desde cero a fuente constante, la fuente acaba entregando CVs²: la mitad se almacena y la otra mitad se disipa en la resistencia ideal.

Comprueba las hipótesis antes de trasladar el resultado a otro sistema: Condensador lineal ideal con C>0. Para el proceso RC, R>0, fuente constante y condición inicial declarada. Sin fugas ni ruptura dieléctrica.
