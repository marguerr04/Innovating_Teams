import React, { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  // 1. Referencias a los nodos del DOM que el script necesita
  const layerRef = useRef(null);
  const tplsRef = useRef(null);

  // 2. El useEffect con [] se ejecuta UNA VEZ (como DOMContentLoaded)
  useEffect(() => {
    // --- 3. PEGA AQUÍ TODA LA LÓGICA DE TU <script> ---
    // (Copiado de tu index.html)

    const WORDS = ["Innovar","Crear","Emprender","Prototipar","Iterar","Colaborar","Construir","Presentar","Validar"];
    const COLORS = ["var(--c1)","var(--c2)","var(--c3)"]; // Colores de tu root CSS
    const SPEED_MIN = 16;
    const SPEED_MAX = 24;

    // Usa las 'refs' de React en lugar de 'getElementById'
    const layer = layerRef.current;
    const tpls = tplsRef.current;
    
    // Guard clause en caso de que los refs no estén listos
    if (!layer || !tpls) return; 

    function randColor(){ return COLORS[Math.floor(Math.random()*COLORS.length)]; }

    function createItem(kind){
      let el;
      if(kind === "circle" || kind === "square"){
        el = tpls.querySelector('[data-type="'+kind+'"]').cloneNode(true);
        el.style.setProperty('--col', randColor());
      }else if(kind === "triangle"){
        el = document.createElement('div');
        el.className = "item triangle";
        const size = 60;
        el.style.borderLeft = (size*0.55) + "px solid transparent";
        el.style.borderRight = (size*0.55) + "px solid transparent";
        el.style.borderBottom = size + "px solid " + (randColor());
        el.dataset.w = (size).toString();
        el.dataset.h = (size).toString();
      }else if(kind === "word"){
        el = tpls.querySelector('[data-type="word"]').cloneNode(true);
        el.textContent = WORDS[Math.floor(Math.random()*WORDS.length)];
      }else if(kind === "icon-joy" || kind === "icon-pad"){
        el = tpls.querySelector('[data-type="'+kind+'"]').cloneNode(true);
      }
      return el;
    }

    const N_SHAPES = 18;
    const N_WORDS = 8;
    const N_JOY = 2;
    const N_PAD = 2;

    const kindsShapes = ["circle","square","triangle"];
    const items = [];
    function add(kind){
      const el = createItem(kind);
      layer.appendChild(el);
      const rect = el.getBoundingClientRect();
      const w = rect.width || parseInt(el.dataset.w || 56);
      const h = rect.height || parseInt(el.dataset.h || 56);
      // Asegura que los items no se generen fuera de la pantalla
      const x = Math.random()*(window.innerWidth - w);
      const y = Math.random()*(window.innerHeight - h);
      const speed = SPEED_MIN + Math.random()*(SPEED_MAX-SPEED_MIN);
      const angle = Math.random()*Math.PI*2;
      const vx = Math.cos(angle)*speed;
      const vy = Math.sin(angle)*speed;
      items.push({el,x,y,vx,vy,w,h});
    }

    for(let i=0;i<N_SHAPES;i++){
      add(kindsShapes[Math.floor(Math.random()*kindsShapes.length)]);
    }
    for(let i=0;i<N_WORDS;i++) add("word");
    for(let i=0;i<N_JOY;i++) add("icon-joy");
    for(let i=0;i<N_PAD;i++) add("icon-pad");

    function collide(a,b){
      return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
    }
    function resolveCollision(a,b){
      const tvx = a.vx, tvy = a.vy;
      a.vx = b.vx; a.vy = b.vy;
      b.vx = tvx;  b.vy = tvy;
      const overlapX = (a.x < b.x) ? (a.x + a.w - b.x) : (b.x + b.w - a.x);
      const overlapY = (a.y < b.y) ? (a.y + a.h - b.y) : (b.y + b.h - a.y);
      if (overlapX < overlapY){
        const s = overlapX/2 + 0.5;
        if (a.x < b.x){ a.x -= s; b.x += s; } else { a.x += s; b.x -= s; }
      } else {
        const s = overlapY/2 + 0.5;
        if (a.y < b.y){ a.y -= s; b.y += s; } else { a.y += s; b.y -= s; }
      }
    }

    // Variable para el requestAnimationFrame
    let animFrameId;

    function step(t){
      if(!step.last) step.last = t;
      const dt = Math.min(0.05, (t - step.last)/1000);
      step.last = t;
      const W = window.innerWidth, H = window.innerHeight;

      for(const it of items){
        it.x += it.vx * dt; it.y += it.vy * dt;
        if(it.x <= 0){ it.x = 0; it.vx = Math.abs(it.vx); }
        if(it.x + it.w >= W){ it.x = W - it.w; it.vx = -Math.abs(it.vx); }
        if(it.y <= 0){ it.y = 0; it.vy = Math.abs(it.vy); }
        if(it.y + it.h >= H){ it.y = H - it.h; it.vy = -Math.abs(it.vy); }
      }
      for(let i=0;i<items.length;i++){
        for(let j=i+1;j<items.length;j++){
          const a = items[i], b = items[j];
          if(collide(a,b)) resolveCollision(a,b);
        }
      }
      for(const it of items){
        it.el.style.transform = 'translate('+it.x+'px,'+it.y+'px)';
      }
      animFrameId = requestAnimationFrame(step);
    }
    animFrameId = requestAnimationFrame(step);

    // --- FIN DE LA LÓGICA PEGADA ---
    
    // Función de limpieza: se ejecuta cuando el componente se desmonta
    return () => {
      cancelAnimationFrame(animFrameId); // Detiene la animación
      // Limpia las figuras creadas para evitar duplicados
      if (layer) {
        layer.innerHTML = ''; 
      }
    };
    
  }, []); // El array vacío [] asegura que este script se ejecute solo una vez.

  return (
    <>
      {/* 4. El HTML de tu index.html, usando refs */}
      <div className="layer" id="layer" ref={layerRef}></div>

      <div id="tpls" className="tpl" ref={tplsRef}>
        <div data-type="circle" className="item circle"></div>
        <div data-type="square" className="item square"></div>
        <div data-type="triangle" className="item triangle" data-w="70" data-h="60"></div>
        <div data-type="word" className="item word">Innovar</div>
        
        {/* 5. CORRECCIÓN: Usa las imágenes .jpg que subiste (asumiendo que están en /public/) */}
        <img data-type="icon-joy" className="item" src="/joystick.png" style={{width:'56px',height:'56px'}}/>
        <img data-type="icon-pad" className="item" src="/gamepad.png" style={{width:'56px',height:'56px'}}/>
      </div>
    </>
  );
}