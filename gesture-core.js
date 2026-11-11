(function(root){
"use strict";
const CONNECTIONS=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)}
function palmScale(p){return Math.max(.035,dist(p[5],p[17]))}
function fingerExtended(p,tip,pip,mcp){const wrist=p[0];return dist(p[tip],wrist)>dist(p[pip],wrist)*1.12 && dist(p[tip],p[mcp])>dist(p[pip],p[mcp])*.92}
function analyze(landmarks,previous){
 if(!Array.isArray(landmarks)||landmarks.length!==21||landmarks.some(p=>!p||![p.x,p.y,p.z].every(Number.isFinite)))return {valid:false,reason:"invalid-landmarks"};
 const p=landmarks,scale=palmScale(p),pinchRatio=dist(p[4],p[8])/scale;
 const pinch=previous&&previous.pinch?pinchRatio<.43:pinchRatio<.31;
 const extended={thumb:dist(p[4],p[5])/scale>.72,index:fingerExtended(p,8,6,5),middle:fingerExtended(p,12,10,9),ring:fingerExtended(p,16,14,13),pinky:fingerExtended(p,20,18,17)};
 const count=Object.values(extended).filter(Boolean).length;let gesture="UNKNOWN";
 if(pinch)gesture="PINCH";else if(extended.index&&!extended.middle&&!extended.ring&&!extended.pinky)gesture="POINT";else if(extended.index&&extended.middle&&!extended.ring&&!extended.pinky)gesture="VICTORY";else if(count>=4)gesture="OPEN_PALM";else if(count===0||(!extended.index&&!extended.middle&&!extended.ring&&!extended.pinky))gesture="FIST";
 return {valid:true,gesture,confidence:gesture==="UNKNOWN"?.35:clamp(.62+Math.abs(pinchRatio-.37)*.7,.62,.98),pinch,pinchRatio,extended,scale,cursor:{x:clamp(1-p[8].x,0,1),y:clamp(p[8].y,0,1)},landmarks:p};
}
class GestureEngine{constructor(){this.state={pinch:false};this.cursor=null;this.candidate="";this.candidateFrames=0;this.missing=0}
 update(landmarks){if(!landmarks){this.missing++;if(this.missing>3){this.state={pinch:false};this.candidate="";this.candidateFrames=0}return {valid:false,missing:true,release:this.missing===1}}
 this.missing=0;const r=analyze(landmarks,this.state);if(!r.valid)return r;
 if(!this.cursor)this.cursor={...r.cursor};else{this.cursor.x+=.34*(r.cursor.x-this.cursor.x);this.cursor.y+=.34*(r.cursor.y-this.cursor.y)}
 if(r.gesture===this.candidate)this.candidateFrames++;else{this.candidate=r.gesture;this.candidateFrames=1}
 const stable=this.candidateFrames>=3,was=this.state.pinch;if(stable)this.state.pinch=r.pinch;
 return {...r,cursor:{...this.cursor},stable,stableFrames:this.candidateFrames,pinch:this.state.pinch,pinchStarted:!was&&this.state.pinch,pinchEnded:was&&!this.state.pinch}}
 reset(){this.state={pinch:false};this.cursor=null;this.candidate="";this.candidateFrames=0;this.missing=0}}
root.AuraGestureCore={CONNECTIONS,dist,analyze,GestureEngine};
})(globalThis);
