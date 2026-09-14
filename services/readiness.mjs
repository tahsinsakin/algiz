#!/usr/bin/env node
/** Local readiness microservice. Not medical. */
import http from "node:http";

const SWAPS={
  SQUAT_BB:"HACK_SQUAT",
  DEADLIFT_CONV:"RDL_MACHINE",
  BENCH_BB:"CHEST_PRESS_MACHINE",
  OHP_BB:"SHOULDER_PRESS_MACHINE",
  ROW_BB:"CHEST_SUPPORTED_ROW"
};

export function readiness(state, now=Date.now()){
  const drain=(state.lifts||[]).reduce((n,x)=>n+(Number(x.rpe)||0)*0.8+(Number(x.sets)||0)*0.4,0);
  const supp=(state.supps||[]).reduce((n,x)=>{
    const t=(now-x.at)/36e5;
    const hl=Math.max(0.5, Number(x.hl)||5);
    return n+Math.max(0,(Number(x.mg)||0)/100)*Math.pow(0.5,t/hl);
  },0);
  const heat=(state.heats||[]).reduce((n,x)=>{
    const rate=x.type==="SAUNA"?0.18:x.type==="STEAM_ROOM"?0.14:0.1;
    return n+(Number(x.mins)||0)*rate;
  },0);
  const score=Math.max(0, Math.min(100, 100-drain+supp+heat));
  return {score, drain, supp, heat, swaps: SWAPS, down: score<70};
}

const port=process.env.PORT||8787;
if(import.meta.url===`file://${process.argv[1]}`){
  http.createServer((req,res)=>{
    if(req.method!=="POST" || req.url!=="/readiness"){
      res.writeHead(404); res.end("not found"); return;
    }
    let body="";
    req.on("data", c=> body+=c);
    req.on("end", ()=>{
      try{
        const out=readiness(JSON.parse(body||"{}"));
        res.writeHead(200,{"content-type":"application/json"});
        res.end(JSON.stringify(out));
      }catch(e){
        res.writeHead(400); res.end("bad json");
      }
    });
  }).listen(port, ()=> console.log("algiz readiness :"+port));
}
