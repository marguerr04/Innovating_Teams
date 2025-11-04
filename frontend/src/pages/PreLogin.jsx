// src/pages/PreLogin.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PreLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🌊 Movimiento sutil del fondo dinámico
    const root = document.documentElement;
    let t = 0;
    const anim = () => {
      t += 0.0025;
      const x1 = Math.sin(t) * 10;
      const y1 = Math.cos(t) * 8;
      root.style.setProperty("--x1", `${x1}%`);
      root.style.setProperty("--y1", `${y1}%`);
      requestAnimationFrame(anim);
    };
    anim();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[radial-gradient(1200px_600px_at_calc(80%+var(--x1,0%))_calc(10%+var(--y1,0%)),#204b86_0%,#163a6a_40%,#0f2b4d_100%)] text-white overflow-hidden transition-all duration-1000">
      {/* Resplandos difuminados */}
      <div className="absolute inset-0">
        <div className="absolute w-[50vw] h-[50vw] bg-gradient-to-br from-[#1E5AA8] to-[#3AB6B5] rounded-full blur-[100px] opacity-25 top-[-15vh] left-[-10vw] animate-pulse"></div>
        <div className="absolute w-[70vw] h-[70vw] bg-gradient-to-br from-[#0f2b4d] to-[#1E5AA8] rounded-full blur-[160px] opacity-30 bottom-[-20vh] right-[-15vw] animate-pulse"></div>
      </div>

      {/* Contenido principal */}
      <main className="relative text-center z-10 px-4">
        <header className="grid place-items-center gap-3">
          <div className="grid place-items-center w-16 h-16 bg-gradient-to-br from-[#3AB6B5] to-[#1E5AA8] rounded-2xl font-extrabold shadow-[0_8px_20px_rgba(58,182,181,0.35)]">
            IT
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            Innovating <span className="text-[#FFD700]">Team</span>
          </h1>
          <p className="text-white/90">
            Aprende emprendimiento en equipo · gana tokens y feedback
          </p>
        </header>

        <section className="mt-10 space-y-4 max-w-sm mx-auto">
          <button
            onClick={() => navigate("/estudiante")}
            className="block w-full bg-[#3AB6B5] text-white font-bold py-3 rounded-xl shadow-lg hover:brightness-110 transition-all duration-200"
          >
            Ingresar como Alumno
          </button>

          <button
            onClick={() => navigate("/auth")}
            className="block w-full bg-[#F68C1F] text-white font-bold py-3 rounded-xl shadow-lg hover:brightness-110 transition-all duration-200"
          >
            Profesor / Administrador
          </button>

          <p className="text-sm text-white/80 mt-2">
            ¿Nuevo? Ingresa con credenciales demo en la opción Profesor / Administrador
          </p>
        </section>

        <footer className="mt-10 text-white/70 text-sm">
          © 2025 Innovating Team
        </footer>
      </main>
    </div>
  );
}
