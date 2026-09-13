window.ALGIZ_SWAPS={
  SQUAT_BB:"HACK_SQUAT",
  DEADLIFT_CONV:"RDL_MACHINE",
  BENCH_BB:"CHEST_PRESS_MACHINE",
  OHP_BB:"SHOULDER_PRESS_MACHINE",
  ROW_BB:"CHEST_SUPPORTED_ROW"
};
window.algizReadiness=function(state){
  const now=Date.now();
  const drain=(state.lifts||[]).reduce(function(n,x){ return n+(Number(x.rpe)||0)*0.8+(Number(x.sets)||0)*0.4; },0);
  const supp=(state.supps||[]).reduce(function(n,x){
    const t=(now-x.at)/36e5;
    const hl=Math.max(0.5, Number(x.hl)||5);
    return n+Math.max(0,(Number(x.mg)||0)/100)*Math.pow(0.5,t/hl);
  },0);
  const heat=(state.heats||[]).reduce(function(n,x){
    const rate=x.type==="SAUNA"?0.18:x.type==="STEAM_ROOM"?0.14:0.1;
    return n+(Number(x.mins)||0)*rate;
  },0);
  return Math.max(0, Math.min(100, 100-drain+supp+heat));
};
window.algizSwap=function(code, score){
  if(score>=70) return code;
  return window.ALGIZ_SWAPS[code]||code;
};
