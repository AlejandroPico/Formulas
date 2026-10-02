import {normalCDF,quantile} from './information-math.js';
export const npv=(flows,rate)=>flows.reduce((sum,x,t)=>sum+x/(1+rate)**t,0);
export function irr(flows){let lo=-.999,hi=1000;const left=npv(flows,lo),right=npv(flows,hi);if(left*right>0)return null;for(let i=0;i<120;i++){const mid=(lo+hi)/2;if(npv(flows,mid)>0)lo=mid;else hi=mid;}return (lo+hi)/2;}
export function bond(p){const y=p.yield/100,flows=Array.from({length:p.n},(_,i)=>p.face*p.coupon/100+(i===p.n-1?p.face:0)),price=flows.reduce((s,c,i)=>s+c/(1+y)**(i+1),0),mac=flows.reduce((s,c,i)=>s+(i+1)*c/(1+y)**(i+1),0)/price,modified=mac/(1+y),convexity=flows.reduce((s,c,i)=>s+(i+1)*(i+2)*c/(1+y)**(i+3),0)/price;
 const priceAt=y=>flows.reduce((s,c,i)=>s+c/(1+y)**(i+1),0),dy=p.shock/100;
 return {price,mac,modified,convexity,flows,priceAt,newPrice:priceAt(y+dy),linear:price*(1-modified*dy),quadratic:price*(1-modified*dy+convexity*dy*dy/2)};
}
export function blackScholes(p){const {S,K,T}=p,r=p.rate/100,q=p.dividend/100,s=p.volatility/100,A=S*Math.exp(-q*T),B=K*Math.exp(-r*T);
 if(T===0||s===0){const call=Math.max(0,A-B),put=Math.max(0,B-A);return {call,put,d1:null,d2:null,delta:A===B?null:Math.exp(-q*T)*(A>B?1:0),gamma:null,vega:null,A,B};}
 const d1=(Math.log(S/K)+(r-q+s*s/2)*T)/(s*Math.sqrt(T)),d2=d1-s*Math.sqrt(T),call=A*normalCDF(d1)-B*normalCDF(d2),put=B*normalCDF(-d2)-A*normalCDF(-d1),phi=Math.exp(-d1*d1/2)/Math.sqrt(2*Math.PI);
 return {call,put,d1,d2,delta:Math.exp(-q*T)*normalCDF(d1),gamma:Math.exp(-q*T)*phi/(S*s*Math.sqrt(T)),vega:A*phi*Math.sqrt(T)/100,A,B};
}
export function model(id,p){switch(id){
 case 'cobb-douglas-production-function':{const output=p.A*p.K**p.alpha*p.L**(1-p.alpha);return {value:output,output,MPK:p.alpha*output/p.K,MPL:(1-p.alpha)*output/p.L,f:(K,L)=>p.A*K**p.alpha*L**(1-p.alpha)};}
 case 'consumer-lagrangian-constrained-optimization':{const x=p.alpha*p.budget/p.px,y=(1-p.alpha)*p.budget/p.py,U=x**p.alpha*y**(1-p.alpha);return {value:x,x,y,U,lambda:U/p.budget,utility:(a,b)=>a**p.alpha*b**(1-p.alpha)};}
 case 'bond-duration-interest-rate-sensitivity':{const r=bond(p);return {...r,value:r.modified};}
 case 'bond-convexity-second-order-duration':{const r=bond(p);return {...r,value:r.convexity};}
 case 'net-present-value-npv':case 'internal-rate-of-return-irr':{const flows=[-p.initial,...Array(p.n).fill(p.cash)],rate=irr(flows),value=id==='net-present-value-npv'?npv(flows,p.rate/100):rate*100;return {value,flows,irr:rate,NPV:npv(flows,p.rate/100),at:r=>npv(flows,r),multipleFlows:[-100,230,-132]};}
 case 'kelly-criterion-money-management':{const raw=p.p-(1-p.p)/p.odds,optimal=Math.max(0,Math.min(1,raw)),growth=f=>f===1&&p.p<1?-Infinity:p.p*Math.log1p(p.odds*f)+(1-p.p)*Math.log1p(-f);return {value:100*optimal,raw,optimal,growth,selected:growth(p.f)};}
 case 'solow-growth-model-steady-state':{const loss=p.delta+p.population+p.technology,k=(p.saving/loss)**(1/(1-p.alpha)),output=k**p.alpha,consumption=(1-p.saving)*output,golden=(p.alpha/loss)**(1/(1-p.alpha));return {value:k,k,output,consumption,golden,flow:x=>p.saving*x**p.alpha-loss*x};}
 case 'capital-asset-pricing-model-capm':{const expected=p.rf+p.beta*(p.market-p.rf);return {value:expected,expected,premium:p.beta*(p.market-p.rf)};}
 case 'sharpe-ratio-risk-adjusted-return':{const ratio=(p.mean-p.rf)/p.sigma;return {value:ratio,ratio,excess:p.mean-p.rf};}
 case 'put-call-parity-no-arbitrage':{const A=p.S*Math.exp(-p.dividend/100*p.T),B=p.K*Math.exp(-p.rate/100*p.T),call=p.put+A-B;return {value:call,call,A,B,gap:p.observed-call};}
 case 'black-scholes-model':case 'black-scholes-european-put-option':{const r=blackScholes(p);return {...r,value:id==='black-scholes-model'?r.call:r.put};}
 case 'parametric-value-at-risk-var':{const z=quantile(p.confidence),VaR=p.value*(z*p.sigma-p.mean)/100,ES=p.value*(p.sigma*Math.exp(-z*z/2)/(Math.sqrt(2*Math.PI)*(1-p.confidence))-p.mean)/100;return {value:VaR,VaR,ES,z,lossDensity:x=>{const mu=-p.value*p.mean/100,s=p.value*p.sigma/100;return Math.exp(-((x-mu)**2)/(2*s*s))/(Math.sqrt(2*Math.PI)*s);}};}
 default:throw new Error(id);
}}
