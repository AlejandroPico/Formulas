import {model,expansion} from './cosmos-math.js';
import {studioScene} from './studio-scene.js';
export function drawCosmos(ctx,w,h,id,p,v){const S=studioScene(ctx,w,h,v),{plot,heading,dot,arrow,path,bars,project,blue,red,line}=S,q=model(id,p),mode=v.mode;
 if(id==='cosmological-equation-of-state'){
  if(mode===2){bars([q.ratio,q.pressure,q.ratio*q.accelerationFactor],['ρ/ρ0','p/(ρ0c²)','ρ+3p/c²']);heading('La presión también gravita','Última barra en unidades ρ0; un factor negativo favorece aceleración');return {};}
  const max=Math.max(2,.5**(-3*(1+p.w))),g=plot(.5,4,0,max,'a/a0','ρ/ρ0');g.curve(a=>model(id,{...p,a}).ratio);dot(g.point(p.a,q.ratio),red);heading('Cómo se diluye un fluido homogéneo','Materia a⁻³ · radiación a⁻⁴ · vacío constante');return {};
 }
 if(id==='friedmann-equations'){
  if(mode===2){bars([p.matter/q.a**3,q.curvature/q.a**2,p.vacuum],['materia','curvatura','vacío']);heading('Contribuciones firmadas a H²/H0²','No son Ω normalizados de esta época; su suma da H²/H0²');return {};}
  const full=expansion({...p,t:20}),g=plot(0,20,0,Math.max(2,full.a*1.05),'t futuro (Gyr)','a(t)');path(full.points.map(x=>g.point(...x)),blue);dot(g.point(q.time,q.a),red);heading('Un reloj futuro, desde la época de referencia','Rama expansiva; retorno detiene integración; sin radiación');return {};
 }
 if(id==='critical-density-parameter'){
  if(mode===2){bars([p.density,q.critical/1e-26],['ρtotal','ρcrit']);heading('La referencia crece como H²','Densidades en 10⁻²⁶ kg/m³; las barras no representan materia y vacío separados');return {};}
  const g=plot(50,90,0,2,'H (km/s/Mpc)','ρcrit (10⁻²⁶ kg/m³)');g.curve(H0=>model(id,{...p,H0}).critical/1e-26);dot(g.point(p.H0,q.critical/1e-26),red);path([g.point(50,p.density),g.point(90,p.density)],blue);heading('Compara una densidad con H','Punto: densidad crítica; horizontal: densidad total elegida');return {};
 }
 if(id==='cosmological-redshift'){
  if(mode===2){const g=plot(.1,2,0,Math.max(2000,q.lambda*1.1),'aemit','λobs (nm)');g.curve(emit=>model(id,{...p,emit}).lambda);dot(g.point(p.emit,q.lambda),red);heading('La longitud de onda conserva λ/a','Emisión y observación son épocas distintas de la misma onda');return {};}
  const g=plot(0,3000,-1.3,1.3,'distancia ilustrativa (nm)','fase');g.curve(x=>Math.sin(2*Math.PI*x/p.lambda),blue);g.curve(x=>Math.sin(2*Math.PI*x/q.lambda),red);heading('Onda emitida y onda observada','Azul emisión · coral observación · amplitudes de fase ilustrativas');return {};
 }
 if(mode===0||mode===1){const P=project(2);for(const x of[-1,0,1])for(const y of[-1,0,1])for(const z of[-1,0,1]){const a=[x,y,z];dot(P(a),line,3);if(x||y||z)arrow(P(a),P(a.map(e=>e*1.35)),blue);}heading('Recesión proporcional a separación comóvil','Red 3D a una época; flechas de escala ilustrativa · gira cámara');return {rotate:true};}
 const g=plot(0,6000,0,540000,'distancia propia (Mpc)','vrec (km/s)');g.curve(distance=>model(id,{...p,distance}).value);dot(g.point(p.distance,q.value),red);path([g.point(0,299792.458),g.point(6000,299792.458)],line);heading('Una ley instantánea, no una ley Doppler','Horizontal c como referencia local; distancia propia simultánea');return {};
}
