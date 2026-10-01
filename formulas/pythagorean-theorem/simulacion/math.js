export const TOLERANCE = 0.02;
export function hypotenuse(a, b) {
  if (![a, b].every(value => Number.isFinite(value) && value >= 0)) throw new RangeError('Longitudes no negativas y finitas');
  return Math.hypot(a, b);
}
export function missingLeg(c, known) {
  if (![c, known].every(Number.isFinite) || known <= 0 || c <= known) throw new RangeError('La hipotenusa debe superar al cateto positivo');
  return Math.sqrt((c - known) * (c + known));
}
export function distance(p, q) { return hypotenuse(Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1])); }
export const MISSIONS = [
  { a: 3, b: 4, missing: 'c', title: 'El primer salto', story: 'Dos islas están separadas 3 u en horizontal y 4 u en vertical. Construye el puente directo.' },
  { a: 5, b: 12, missing: 'c', title: 'La otra orilla', story: 'El camino en dos tramos mide 5 u y 12 u. ¿Cuánto mide el puente diagonal?' },
  { a: 6, b: 6, missing: 'c', title: 'La diagonal inesperada', story: 'Los dos desplazamientos miden 6 u. La respuesta ya no es entera: redondea a dos decimales.' },
  { a: 6, b: 8, missing: 'a', title: 'Recupera el tramo', story: 'La diagonal mide 10 u y el tramo vertical 8 u. Reconstruye el tramo horizontal que falta.' },
  { a: 5, b: 12, missing: 'b', title: 'La subida', story: 'La diagonal mide 13 u y el tramo horizontal 5 u. Calcula el tramo vertical.' },
  { a: 6, b: 8, missing: 'd', title: 'Lee el mapa', story: 'Viaja de (−2, 1) a (4, 9). Calcula la distancia en línea recta, no el recorrido por los ejes.', points: [[-2, 1], [4, 9]] }
];
export function solution(mission) {
  const c = hypotenuse(mission.a, mission.b);
  if (mission.missing === 'a') return missingLeg(c, mission.b);
  if (mission.missing === 'b') return missingLeg(c, mission.a);
  return mission.points ? distance(...mission.points) : c;
}
export function accepts(mission, value) { return Number.isFinite(value) && value > 0 && Math.abs(value - solution(mission)) <= TOLERANCE + Number.EPSILON * 16; }
