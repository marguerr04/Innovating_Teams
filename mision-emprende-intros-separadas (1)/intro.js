(function(){
  const bg=document.getElementById("bg");
  const card=document.getElementById("card");
  const badge=document.getElementById("badge");
  const title=document.getElementById("title");
  const lead=document.getElementById("lead");
  const desc=document.getElementById("desc");
  const skip=document.getElementById("skipBtn");
  const bar=document.getElementById("bar");
  const note=document.getElementById("doneNote");
  const phase=+document.body.dataset.phase;
  const habilidad=document.body.dataset.habilidad;
  const lema=document.body.dataset.lema;
  const texto=document.body.dataset.texto;

  function animateIn(){
    bg.classList.remove("bg-in"); card.classList.remove("card-in");
    badge.classList.remove("badge-in"); title.classList.remove("title-in");
    lead.classList.remove("text-in"); desc.classList.remove("text-in");
    requestAnimationFrame(()=>{
      bg.classList.add("bg-in");
      setTimeout(()=>{
        card.classList.add("card-in");
        requestAnimationFrame(()=>{
          badge.classList.add("badge-in");
          setTimeout(()=>title.classList.add("title-in"),120);
          setTimeout(()=>{lead.style.setProperty("--delay",".26s"); lead.classList.add("text-in");},120);
          setTimeout(()=>{desc.style.setProperty("--delay",".36s"); desc.classList.add("text-in");},160);
        });
      },240);
    });
  }

  function finish(reason){
    // Notifica y mantiene UI visible (sin pantalla negra)
    const detail={phase, reason};
    window.dispatchEvent(new CustomEvent("intro:done", {detail}));
    if (typeof window.misionEmprendeIntroDone==="function") {
      try{ window.misionEmprendeIntroDone(detail); } catch(e){}
    }
    skip.disabled=true;
    note.textContent="Intro finalizada ("+ (reason==="auto"?"automática":"saltada") +"). Puedes cerrar esta ventana o continuar en el juego.";
  }

  // Pinta contenido
  document.getElementById("badgeText").textContent=`Fase ${phase} de 5`;
  title.textContent=`En esta fase trabajaremos la habilidad: ${habilidad}`;
  lead.textContent=lema;
  desc.textContent=texto;

  // Timer 30s
  const totalMs=30000;
  const start=performance.now();
  let rafId=null, timeoutId=null;
  function tick(now){
    const r=Math.min(1,(now-start)/totalMs);
    bar.style.width=(r*100).toFixed(2)+"%";
    if(r<1) rafId=requestAnimationFrame(tick);
  }
  rafId=requestAnimationFrame(tick);
  timeoutId=setTimeout(()=>finish("auto"), totalMs);
  skip.addEventListener("click", ()=>finish("skip"));
  animateIn();
})();