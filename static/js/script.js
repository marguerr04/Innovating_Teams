document.addEventListener('DOMContentLoaded', () => {
  const f = document.getElementById('login-form');
  if(!f) return;
  f.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pwd = document.getElementById('password').value.trim();
    if(email==='profesor@innovating.com' && pwd==='prof123'){ location.href='profesor.html'; return; }
    if(email==='admin@innovating.com' && pwd==='admin123'){ location.href='admin.html'; return; }
    alert('Correo o contraseña incorrectos.');
  });
});

// ---- Prime/Unlock audio once per session ----
function primeAudioOnce(){
  if(localStorage.getItem('audioUnlocked')==='1') return;
  try{
    const a = new Audio('assets/cronometro.mp3');
    a.volume = 0.0;
    const p = a.play();
    if(p && typeof p.then==='function'){
      p.then(()=>{ a.pause(); localStorage.setItem('audioUnlocked','1'); }).catch(()=>{});
    }
  }catch(e){}
}
// Call on first user gesture if needed
window.addEventListener('pointerdown', ()=>primeAudioOnce(), { once:true });
