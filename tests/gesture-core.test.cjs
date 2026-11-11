const assert=require("node:assert/strict");
const {analyze,GestureEngine}=require("../gesture-core.js");
function hand(){const c=[[.5,.9],[.45,.82],[.42,.76],[.4,.7],[.38,.64],[.42,.72],[.4,.6],[.39,.48],[.38,.35],[.5,.7],[.5,.58],[.5,.46],[.5,.34],[.58,.72],[.59,.61],[.6,.52],[.61,.43],[.66,.76],[.68,.67],[.7,.6],[.72,.54]];return c.map(([x,y])=>({x,y,z:0}))}
const open=hand();assert.equal(analyze(open).valid,true);assert.equal(analyze(open).gesture,"OPEN_PALM");assert.equal(analyze([]).valid,false);
const malformed=hand();malformed[8].x=NaN;assert.equal(analyze(malformed).valid,false);
const engine=new GestureEngine();engine.update(open);engine.update(open);assert.equal(engine.update(open).stable,true);
const pinched=hand();pinched[4]={...pinched[8]};const e2=new GestureEngine();e2.update(open);e2.update(open);e2.update(open);e2.update(pinched);e2.update(pinched);const pin=e2.update(pinched);assert.equal(pin.pinch,true);assert.equal(pin.pinchStarted,true);
e2.update(open);e2.update(open);const release=e2.update(open);assert.equal(release.pinch,false);assert.equal(release.pinchEnded,true);e2.reset();assert.equal(e2.cursor,null);
console.log("PASS: landmark validation, open palm, stability, pinch hysteresis, release, reset");
