import {softmax} from './machine-math.js';
import {normalCDF} from './spectrum-math.js';
export const gelu=x=>x*normalCDF(x);
export const normalize=(values,gamma=1,beta=0,epsilon=1e-5)=>{const mean=values.reduce((a,b)=>a+b,0)/values.length,variance=values.reduce((a,x)=>a+(x-mean)**2,0)/values.length;return {mean,variance,output:values.map(x=>gamma*(x-mean)/Math.sqrt(variance+epsilon)+beta)};};
export function attention(query,keys,values,mask=false){const scores=keys.map(k=>query.reduce((s,x,i)=>s+x*k[i],0)/Math.sqrt(query.length)),allowed=scores.map((x,i)=>mask&&i===scores.length-1?-Infinity:x),weights=softmax(allowed);return {scores,weights,output:weights.reduce((s,x,i)=>s+x*values[i],0)};}
export const pe=(position,d=4)=>Array.from({length:d},(_,j)=>{const phase=position/10000**(2*Math.floor(j/2)/d);return j%2?Math.cos(phase):Math.sin(phase);});
export const rotate=(a,t)=>[a[0]*Math.cos(t)-a[1]*Math.sin(t),a[0]*Math.sin(t)+a[1]*Math.cos(t)];
export function model(id,p){switch(id){
 case 'batch-normalization':{const values=[-1,0,1,2].map(x=>p.shift+p.scale*x),r=normalize(values,p.gamma,p.beta);const output=p.inference?values.map(x=>p.gamma*x/Math.sqrt(1+1e-5)+p.beta):r.output;return {...r,values,output,value:output[0]};}
 case 'layer-normalization':{const values=[p.a,p.b,p.c],r=normalize(values,p.gamma,p.beta),other=normalize(values.map(x=>x+50),p.gamma,p.beta);return {...r,values,other,value:r.output[0]};}
 case 'gelu-activation-function':return {value:gelu(p.x),probability:normalCDF(p.x),derivative:normalCDF(p.x)+p.x*Math.exp(-p.x*p.x/2)/Math.sqrt(2*Math.PI)};
 case 'scaled-dot-product-attention':case 'cross-attention':{const keys=[[1,0],[0,1],[-1,0]],values=[2,-1,1],query=[p.a,p.b],r=attention(query,keys,values,p.mask);return {...r,query,keys,values,value:r.output};}
 case 'multi-head-attention':{const keys=[[1,0],[0,1],[-1,0]],values=[2,-1,1],otherValues=[0,3,-2],heads=[attention([p.a,p.b],keys,values),attention([p.b,p.a],keys,otherValues)],output=p.w1*heads[0].output+p.w2*heads[1].output;return {heads,keys,values,otherValues,output,value:output};}
 case 'sinusoidal-positional-encoding':{const embedding=pe(p.position);return {embedding,value:embedding[0]};}
 case 'rotary-position-embedding-rope':{const q=rotate([1,0],p.m*p.frequency),k=rotate([.6,.8],p.n*p.frequency),dot=q[0]*k[0]+q[1]*k[1];return {q,k,dot,value:dot};}
 case 'ppo-clipped-objective':{const clipped=Math.max(1-p.epsilon,Math.min(1+p.epsilon,p.ratio)),raw=p.ratio*p.advantage,limited=clipped*p.advantage,value=Math.min(raw,limited);return {value,clipped,raw,limited,oldProbability:.5,newProbability:.5*p.ratio};}
 default:throw new Error(id);
}}
