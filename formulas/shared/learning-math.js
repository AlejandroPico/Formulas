// Pure calculations used by the interactive laboratories and their independent checks.
const finite = (...values) => { if (!values.every(Number.isFinite)) throw new RangeError('Introduce números finitos.'); };
const count = n => { if (!Number.isInteger(n) || n < 1 || n > 10000) throw new RangeError('El número de términos debe ser un entero de 1 a 10 000.'); };
export const fmt = (value, digits = 3) => Number.isFinite(value) ? Number(value.toFixed(digits)).toLocaleString('es-ES', { maximumFractionDigits: digits }) : '—';
export function circle(r) { finite(r); if (r < 0) throw new RangeError('Un radio no puede ser negativo.'); return { area: Math.PI*r*r, length: 2*Math.PI*r, diameter: 2*r }; }
export function trig(degrees) { finite(degrees); const angle = degrees*Math.PI/180, x = Math.cos(angle), y = Math.sin(angle); return { x, y, squared: x*x+y*y }; }
export function identities(a,b,identity='sum') { finite(a,b); const cross = 2*a*b; return { cross, value: identity==='sum' ? (a+b)**2 : identity==='difference' ? (a-b)**2 : a*a-b*b }; }
export function vector(x,y,z=0) { finite(x,y,z); const norm = Math.hypot(x,y,z); return { norm, unit: norm ? [x/norm,y/norm,z/norm] : null, axisPath: Math.abs(x)+Math.abs(y)+Math.abs(z) }; }
export function arithmetic(a,d,n) { finite(a,d,n); count(n); const terms = Array.from({length:n},(_,k)=>a+k*d); const last = terms.at(-1); return { terms, last, sum: n*(a+last)/2, direct: terms.reduce((s,t)=>s+t,0) }; }
export function geometric(a,r,n) {
  finite(a,r,n); count(n);
  const terms = []; const partial = []; let term=a, sum=0, correction=0;
  for(let k=0;k<n;k++) { terms.push(term); const adjusted=term-correction, next=sum+adjusted; correction=(next-sum)-adjusted; sum=next; partial.push(sum); term*=r; }
  if(!Number.isFinite(sum)) throw new RangeError('La suma supera el rango numérico disponible.');
  const limit = a===0 ? 0 : Math.abs(r)<1 ? a/(1-r) : null;
  return { terms, partial, sum, last:terms.at(-1), limit, remainder:a===0?0:limit===null ? null : a*r**n/(1-r), converges:limit!==null };
}
export function determinant(m,dimension) {
  finite(...m); if(m.length!==dimension*dimension || ![2,3].includes(dimension)) throw new RangeError('Usa una matriz 2×2 o 3×3.');
  if(dimension===2) { const [a,b,c,d]=m; return {positive:[a*d],negative:[b*c],det:a*d-b*c}; }
  const [a,b,c,d,e,f,g,h,i]=m, positive=[a*e*i,b*f*g,c*d*h],negative=[c*e*g,a*f*h,b*d*i];
  return { positive,negative,det:positive.reduce((s,t)=>s+t,0)-negative.reduce((s,t)=>s+t,0) };
}
export function heron(a,b,c) {
  finite(a,b,c); if(Math.min(a,b,c)<=0) return {kind:'invalid',area:null,s:(a+b+c)/2};
  const [large,mid,small]=[a,b,c].sort((x,y)=>y-x), gap=small-(large-mid), s=(a+b+c)/2;
  if(gap<0) return {kind:'invalid',area:null,s};
  // Kahan's ordered factorization avoids cancellation from s - the longest side.
  const area=.25*Math.sqrt((large+(mid+small))*gap*(small+(large-mid))*(large+(mid-small)));
  const x=(b*b+c*c-a*a)/(2*c), height=2*area/c;
  return { kind:gap===0?'degenerate':'valid', area, s, x, height };
}
export function quadratic(a,b,c) {
  finite(a,b,c);
  if(a===0) return b!==0 ? {kind:'linear',roots:[-c/b]} : {kind:c===0?'all':'none',roots:[]};
  const scale=Math.max(Math.abs(a),Math.abs(b),Math.abs(c)), A=a/scale,B=b/scale,C=c/scale;
  const D=B*B-4*A*C, delta=b*b-4*a*c, vertex=[-B/(2*A), -D*scale/(4*A)];
  if(D<0) return {kind:'complex',delta,vertex,roots:[],real:-B/(2*A),imaginary:Math.sqrt(-D)/(2*Math.abs(A))};
  if(D===0) return {kind:'double',delta,vertex,roots:[-B/(2*A)]};
  const q=-.5*(B+(B>=0?1:-1)*Math.sqrt(D)), roots=[q/A,C/q].sort((x,y)=>x-y);
  return {kind:'real',delta,vertex,roots};
}
export function parseAnswer(text,multiple=false) {
  const raw=String(text).trim().split(multiple?/\s*;\s*/:/$^/);
  if(!raw.length||raw.some(part=>!part.trim()))return [];
  const parts=raw.map(t=>Number(t.replace(',','.').replace('−','-')));
  return parts.every(Number.isFinite) ? parts : [];
}
export function acceptsAnswer(expected,actual,tolerance=.015) {
  const wanted=(Array.isArray(expected)?expected:[expected]).slice().sort((a,b)=>a-b);
  const got=actual.slice().sort((a,b)=>a-b);
  return wanted.length===got.length && got.every((value,index)=>Number.isFinite(value)&&Math.abs(value-wanted[index])<=tolerance);
}
