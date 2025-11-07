
(function(){
  const overlay = document.getElementById("tokenOverlay");
  const subtitle = document.getElementById("tokenSubtitle");
  const btnContinue = document.getElementById("btnContinue");
  const audioEl = document.getElementById("tokenSfx");
  const laneLeft = document.getElementById("laneLeft");
  const laneRight = document.getElementById("laneRight");

  function textForPhase(n){
    if(n===1) return "Felicidades, fueron el primer equipo en terminar. Han ganado 4 tokens.";
    if(n>=2 && n<=4) return "Han ganado 1 token por completar la fase.";
    if(n===5) return "Aún no han recibido feedback, por lo tanto no se pueden asignar tokens.";
    return "—";
  }

  // ------- Robust Audio Engine (WebAudio + HTMLAudio fallback) -------
  class AudioEngine {
    constructor(url, element){
      this.url = url;
      this.element = element;
      this.ctx = null;
      this.buffer = null;
      this.ready = false;
    }
    async init(){
      try{
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
        const res = await fetch(this.url);
        const arr = await res.arrayBuffer();
        this.buffer = await this.ctx.decodeAudioData(arr);
        this.ready = true;
      }catch(e){
        // WebAudio might fail on file://; fallback to <audio>
        this.ready = false;
      }
    }
    async play(){
      if (this.ctx && this.buffer){
        if (this.ctx.state === "suspended"){
          try{ await this.ctx.resume(); }catch{}
        }
        const src = this.ctx.createBufferSource();
        src.buffer = this.buffer;
        src.connect(this.ctx.destination);
        src.start(0);
        return;
      }
      // Fallback
      try{
        this.element.currentTime = 0;
        await this.element.play();
      }catch(e){
        // As last resort: enable on first gesture
        const once = async () => {
          try{ this.element.currentTime = 0; await this.element.play(); }
          finally { document.removeEventListener("pointerdown", once); }
        };
        document.addEventListener("pointerdown", once, { once:true });
      }
    }
  }

  const engine = new AudioEngine("assets/token-sound.mp3", audioEl);
  // Initialize ASAP to be ready for phase 1
  window.addEventListener("DOMContentLoaded", () => engine.init());

  // ----------------- Confetti (lateral) -----------------
  const COLORS = ["#ffffff","#f7d778","#f79ac0","#96d6ff","#8df0d2","#b39cff"];
  const SHAPES = [
    {w:8, h:12, r:"2px"}, {w:10,h:10, r:"50%"}, {w:12,h:5,  r:"2px"}
  ];
  function gradientBg(){
    const a = COLORS[(Math.random()*COLORS.length)|0];
    const b = COLORS[(Math.random()*COLORS.length)|0];
    return `linear-gradient(${Math.random()*360|0}deg, ${a}, ${b})`;
  }

  function makeConfetti(side){
    const el = document.createElement("div");
    el.className = "confetti";
    const s = SHAPES[(Math.random()*SHAPES.length)|0];
    el.style.setProperty("--w", s.w+"px");
    el.style.setProperty("--h", s.h+"px");
    el.style.setProperty("--radius", s.r);
    el.style.setProperty("--bg", gradientBg());
    const yStart = (10 + Math.random()*70) + "vh";
    el.style.setProperty("--yStart", yStart);
    if (side === "left"){
      el.style.setProperty("--fromX", "-14vw");
      const x = (5 + Math.random()*25) + "vw";
      el.style.setProperty("--x", x);
      el.style.setProperty("--driftX", (15 + Math.random()*10) + "vw");
    } else {
      el.style.setProperty("--fromX", "14vw");
      const x = (-5 - Math.random()*25) + "vw";
      el.style.setProperty("--x", x);
      el.style.setProperty("--driftX", (-15 - Math.random()*10) + "vw");
    }
    el.style.setProperty("--lift", (-6 - Math.random()*10) + "vh");
    el.style.setProperty("--inDur", (0.35 + Math.random()*0.35).toFixed(2) + "s");
    el.style.setProperty("--downDur", (2.4 + Math.random()*2.2).toFixed(2) + "s");
    el.style.setProperty("--spinDur", (1 + Math.random()*1.4).toFixed(2) + "s");
    el.style.animationDelay = (Math.random()*0.3).toFixed(2) + "s";
    return el;
  }
  function launchConfettiLateral(){
    laneLeft.innerHTML = "";
    laneRight.innerHTML = "";
    const count = 120;
    for(let i=0;i<count;i++){
      laneLeft.appendChild(makeConfetti("left"));
      laneRight.appendChild(makeConfetti("right"));
    }
    setTimeout(()=>{ laneLeft.innerHTML=""; laneRight.innerHTML=""; }, 5000);
  }

  // ----------------- Public API -----------------
  window.showTokensOverlay = function(phase, opts){
    const options = opts || {};
    subtitle.textContent = (function(n){
      if(n===1) return "Felicidades, fueron el primer equipo en terminar. Han ganado 4 tokens.";
      if(n>=2 && n<=4) return "Han ganado 1 token por completar la fase.";
      if(n===5) return "Aún no han recibido feedback, por lo tanto no se pueden asignar tokens.";
      return "—";
    })(phase);

    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden","false");

    // Phase-1 reliable sound
    engine.play();
    launchConfettiLateral();

    function onContinue(){
      overlay.classList.add("hidden");
      overlay.setAttribute("aria-hidden","true");
      btnContinue.removeEventListener("click", onContinue);
      if (typeof options.onContinue === "function") options.onContinue();
    }
    btnContinue.addEventListener("click", onContinue);
  };
})();
