# Suma geométrica

**Entrada** · a₁ real, razón r real y n entero positivo.

**Término** · aₙ = a₁rⁿ⁻¹. Para n = 1 se interpreta como a₁, también si r = 0.

**Suma finita** · a₁(1−rⁿ)/(1−r) si r ≠ 1; na₁ si r = 1.

**Suma infinita** · para a₁ ≠ 0, converge si y solo si |r| < 1. Si a₁ = 0, todos los términos son cero.

**Precisión** · cerca de r = 1, restar cantidades casi iguales puede perder precisión. El simulador suma sus términos con compensación para su rango de trabajo.

**Control** · r = 0 debe devolver a₁; r = 1 debe devolver na₁.
