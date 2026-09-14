(function(){
  const quotes=window.ALGIZ_QUOTES||[["To achieve the extraordinary, you must endure the unreasonable.","Mike Mentzer"]];
  const q=quotes[Math.floor(Math.random()*quotes.length)];
  document.getElementById("q").textContent=q[0];
  document.getElementById("qa").textContent=q[1];

  let S={lifts:[],supps:[],heats:[],gate:false};

  function row(html){ return '<div class="row">'+html+"</div>"; }
  function draw(){
    const score=window.algizReadiness(S);
    document.getElementById("score").textContent=Math.round(score);
    const move=(document.getElementById("move").value||"SQUAT_BB").toUpperCase();
    const swapped=window.algizSwap(move, score);
    document.getElementById("swap").textContent=score<70
      ? ("Master node down. Use "+swapped+" instead of "+move+".")
      : "Master node holds. Keep the compound.";
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
  function persist(){ return window.AlgizVault.save(S); }

  function openApp(){
    document.getElementById("gate").style.display="none";
    document.getElementById("app").style.display="block";
    draw();
  }

  window.AlgizVault.load().then(function(state){
    S=state;
    if(S.gate) openApp();
  });

  const ok=document.getElementById("ok");
  const enter=document.getElementById("enter");
  ok.addEventListener("change", function(){ enter.disabled=!ok.checked; });
  enter.addEventListener("click", function(){
    if(!ok.checked) return;
    S.gate=true;
    persist().then(openApp);
  });
  document.querySelectorAll("nav button").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelectorAll(".panel").forEach(function(p){ p.classList.remove("on"); });
      document.getElementById(b.getAttribute("data-p")).classList.add("on");
    });
  });
  document.getElementById("logLift").onclick=function(){
    S.lifts.push({move:(document.getElementById("move").value||"SQUAT_BB").toUpperCase(),sets:+document.getElementById("sets").value||0,reps:+document.getElementById("reps").value||0,rpe:+document.getElementById("rpe").value||0,kg:+document.getElementById("kg").value||0,at:Date.now()});
    persist().then(draw);
  };
  document.getElementById("logSupp").onclick=function(){
    S.supps.push({comp:document.getElementById("comp").value||"caffeine",mg:+document.getElementById("mg").value||0,hl:+document.getElementById("hl").value||5,at:Date.now()});
    persist().then(draw);
  };
  document.getElementById("logHeat").onclick=function(){
    S.heats.push({type:document.getElementById("amenity").value,mins:+document.getElementById("mins").value||0,at:Date.now()});
    persist().then(draw);
  };
})();
