const assert=require("node:assert/strict");
const {analyze,GestureEngine}=require("../gesture-core.js");
function makeHand(){const p=Array.from({length:21},()=>({x:.5,y:.5,z:0}));const c=[[.5,.9],[.45,.82],[.42,.76],[.4,.7],[.38,.64],[.42,.72],[.4,.6],[.39,.48],[.38,.35],[.5,.7],[.5,.58],[.5,.46],[.5,.34],[.58,.72],[.59,.61],[.6,.52],[.61,.43],[.66,.76],[.68,.67],[.7,.6],[.72,.54]];c.forEach((v,i)=>p[i]={x:v[0],y:v[1],z:0});return p}
const hand=makeHand();assert.equal(analyze(hand).valid,true);assert.equal(analyze([]).valid,false);assert.equal(analyze(hand).gesture,"OPEN_PALM");
const engine=new GestureEngine();engine.update(hand);engine.update(hand);const stable=engine.update(hand);assert.equal(stable.stable,true);assert.ok(stable.cursor.x>=0&&stable.cursor.x<=1);
engine.update(null);engine.update(null);engine.update(null);assert.equal(engine.update(null).valid,false);
console.log("AuraGestureCore tests: PASS");