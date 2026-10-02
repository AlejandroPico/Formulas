import {normalCDF} from './spectrum-math.js';
export {normalCDF};
export const entropy=p=>p<=0||p>=1?0:-p*Math.log2(p)-(1-p)*Math.log2(1-p);
export const kl=(p,q)=> (p===0?0:p*Math.log(p/q))+(p===1?0:(1-p)*Math.log((1-p)/(1-q)));
export function quantile(p){if(p<=0)return -Infinity;if(p>=1)return Infinity;let lo=-10,hi=10;for(let k=0;k<60;k++){const m=(lo+hi)/2;if(normalCDF(m)<p)lo=m;else hi=m;}return (lo+hi)/2;}
export function likelihood(k,n,p){if(p===0)return k===0?0:-Infinity;if(p===1)return k===n?0:-Infinity;return k*Math.log(p)+(n-k)*Math.log1p(-p);}
export function zResponse(a,r,theta){const re=r*Math.cos(theta),im=r*Math.sin(theta),den=(re-a)**2+im*im;return {re:(re*(re-a)+im*im)/den,im:-a*im/den,magnitude:r/Math.sqrt(den),roc:r>Math.abs(a)};}
export function model(id,p){switch(id){
 case 'maximum-likelihood-estimation':{const k=Math.min(p.k,p.n),mle=k/p.n;return {value:mle,mle,k,log:likelihood(k,p.n,p.candidate),relative:x=>Math.exp(likelihood(k,p.n,x)-likelihood(k,p.n,mle))};}
 case 'confidence-interval':{const z=quantile((1+p.confidence)/2),margin=z*p.sigma/Math.sqrt(p.n);let seed=76543;const uniform=()=>{seed=(1664525*seed+1013904223)>>>0;return (seed+.5)/2**32;},means=Array.from({length:40},()=>p.truth+p.sigma/Math.sqrt(p.n)*Math.sqrt(-2*Math.log(uniform()))*Math.cos(2*Math.PI*uniform()));return {value:margin,margin,z,low:p.mean-margin,high:p.mean+margin,means,covered:means.filter(x=>Math.abs(x-p.truth)<=margin).length};}
 case 'z-transform':{const response=zResponse(p.a,p.radius,p.angle*Math.PI/180);return {...response,value:response.magnitude,sequence:n=>p.a**n};}
 case 'shannon-hartley-capacity':{const snr=10**(p.db/10),capacity=p.bandwidth*Math.log2(1+snr);return {value:capacity,capacity,snr,efficiency:Math.log2(1+snr)};}
 case 'cross-entropy-loss':{const loss=-p.p*Math.log(p.q)-(1-p.p)*Math.log1p(-p.q);return {value:loss,loss,divergence:kl(p.p,p.q),irreducible:entropy(p.p)*Math.LN2};}
 case 'shannon-entropy':{const h=entropy(p.p);return {value:h,h,surprise:[p.p===0?null:-Math.log2(p.p),p.p===1?null:-Math.log2(1-p.p)]};}
 case 'differential-entropy':{const h=Math.log2(p.sigma*Math.sqrt(2*Math.PI*Math.E));return {value:h,h,density:x=>Math.exp(-((x-p.mean)**2)/(2*p.sigma*p.sigma))/(Math.sqrt(2*Math.PI)*p.sigma)};}
 case 'mutual-information':{const y=p.p*(1-p.noise)+(1-p.p)*p.noise,I=entropy(y)-entropy(p.noise),joint=[(1-p.p)*(1-p.noise),(1-p.p)*p.noise,p.p*p.noise,p.p*(1-p.noise)];return {value:I,I,y,joint,HX:entropy(p.p),HY:entropy(y),conditional:entropy(p.noise)};}
 case 'language-model-perplexity':{const probs=[p.a,p.b,p.c,p.d],h=-probs.reduce((s,x)=>s+Math.log(x),0)/4;return {value:Math.exp(h),h,probs,perplexity:Math.exp(h),bits:h/Math.LN2};}
 case 'kullback-leibler-divergence':return {value:kl(p.p,p.q),reverse:kl(p.q,p.p)};
 case 'jensen-shannon-divergence':{const m=(p.p+p.q)/2,js=(kl(p.p,m)+kl(p.q,m))/(2*Math.LN2);return {value:js,js,mixture:m,distance:Math.sqrt(Math.max(0,js))};}
 case 'aic-bic-information-criteria':{const aic=2*p.k-2*p.log,bic=p.k*Math.log(p.n)-2*p.log;return {value:bic,aic,bic,fit:-2*p.log,penaltyA:2*p.k,penaltyB:p.k*Math.log(p.n)};}
 case 'tf-idf-term-frequency-inverse-document-frequency':{const df=Math.min(p.df,p.N),idf=Math.log(p.N/df),weight=p.tf*idf;return {value:weight,idf,df,weight};}
 default:throw new Error(id);
}}
