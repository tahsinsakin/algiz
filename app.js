(function(){
  const KEY="algiz-v0";
  const quotes=[
    ["To achieve the extraordinary, you must endure the unreasonable.","Mike Mentzer"],
    ["You must welcome the pain.","Tom Platz"],
    ["The impediment to action advances action.","Marcus Aurelius"]
  ];
  const q=quotes[Math.floor(Math.random()*quotes.length)];
  document.getElementById("q").textContent=q[0];
  document.getElementById("qa").textContent=q[1];
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY))||{lifts:[],supps:[],heats:[]}; }catch(e){ return {lifts:[],supps:[],heats:[]}; } }
  function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
  let S=load();
  const ok=document.getElementById("ok");
  const enter=document.getElementById("enter");
  ok.addEventListener("change", function(){ enter.disabled=!ok.checked; });
  enter.addEventListener("click", function(){
    if(!ok.checked) return;
    document.getElementById("gate").style.display="none";
    document.getElementById("app").style.display="block";
    draw();
  });
  document.querySelectorAll("nav button").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelectorAll(".panel").forEach(function(p){ p.classList.remove("on"); });
      document.getElementById(b.getAttribute("data-p")).classList.add("on");
    });
  });
  function row(html){ return '<div class="row">'+html+"</div>"; }
  function draw(){
    const score=window.algizReadiness(S);
    document.getElementById("score").textContent=Math.round(score);
    const move=(document.getElementById("move").value||"SQUAT_BB").toUpperCase();
    const swapped=window.algizSwap(move, score);
    document.getElementById("swap").textContent=score<70?("Master node down. Use "+swapped+" not "+move+"."):"Master node holds. Keep the compound.";
    document.getElementById("lifts").innerHTML=S.lifts.slice().reverse().slice(0,8).map(function(x){
      return row(x.move+" · "+x.sets+"x"+x.reps+" @ RPE "+x.rpe);
    }).join("");
    document.getElementById("supps").innerHTML=S.supps.slice().reverse().slice(0,8).map(function(x){
      return row(x.comp+" · "+x.mg+"mg · t½ "+x.hl+"h");
    }).join("");
    document.getElementById("heats").innerHTML=S.heats.slice().reverse().slice(0,8).map(function(x){
      return row(x.type+" · "+x.mins+" min");
    }).join("");
  }
  document.getElementById("logLift").onclick=function(){
    S.lifts.push({move:(document.getElementById("move").value||"SQUAT_BB").toUpperCase(),sets:+document.getElementById("sets").value||0,reps:+document.getElementById("reps").value||0,rpe:+document.getElementById("rpe").value||0,kg:+document.getElementById("kg").value||0,at:Date.now()});
    save(S); draw();
  };
  document.getElementById("logSupp").onclick=function(){
    S.supps.push({comp:document.getElementById("comp").value||"caffeine",mg:+document.getElementById("mg").value||0,hl:+document.getElementById("hl").value||5,at:Date.now()});
    save(S); draw();
  };
  document.getElementById("logHeat").onclick=function(){
    S.heats.push({type:document.getElementById("amenity").value,mins:+document.getElementById("mins").value||0,at:Date.now()});
    save(S); draw();
  };
})();
