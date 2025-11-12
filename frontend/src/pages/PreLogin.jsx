// src/pages/PreLogin.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
<<<<<<< HEAD
=======
import { PiStudentBold, PiChalkboardTeacherBold } from "react-icons/pi";
import { GrUserAdmin } from "react-icons/gr";
>>>>>>> avanceAlejandro/rama_post_certamen_1

export default function PreLogin() {
  const navigate = useNavigate();

  useEffect(() => {
<<<<<<< HEAD
    // 🌊 Movimiento sutil del fondo dinámico
=======
    // Fondo animado suave
>>>>>>> avanceAlejandro/rama_post_certamen_1
    const root = document.documentElement;
    let t = 0;
    const anim = () => {
      t += 0.0025;
<<<<<<< HEAD
      const x1 = Math.sin(t) * 10;
      const y1 = Math.cos(t) * 8;
      root.style.setProperty("--x1", `${x1}%`);
      root.style.setProperty("--y1", `${y1}%`);
=======
      root.style.setProperty("--x1", `${Math.sin(t) * 10}%`);
      root.style.setProperty("--y1", `${Math.cos(t) * 8}%`);
>>>>>>> avanceAlejandro/rama_post_certamen_1
      requestAnimationFrame(anim);
    };
    anim();
  }, []);

  return (
<<<<<<< HEAD
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
=======
    <div className="relative min-h-screen flex items-center justify-center bg-[radial-gradient(1200px_600px_at_calc(80%+var(--x1,0%))_calc(10%+var(--y1,0%)),#204b86_0%,#163a6a_40%,#0f2b4d_100%)] text-white overflow-hidden">
      {/* Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute w-[50vw] h-[50vw] bg-gradient-to-br from-[#1E5AA8] to-[#3AB6B5] rounded-full blur-[100px] opacity-25 -top-[15vh] -left-[10vw] animate-pulse"></div>
        <div className="absolute w-[70vw] h-[70vw] bg-gradient-to-br from-[#0f2b4d] to-[#1E5AA8] rounded-full blur-[160px] opacity-30 -bottom-[20vh] -right-[15vw] animate-pulse"></div>
      </div>

      <main className="relative z-10 px-4 w-full">
        <header className="grid place-items-center gap-3 text-center">
          <div className="grid place-items-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#3AB6B5] to-[#1E5AA8] rounded-2xl font-extrabold shadow-[0_8px_20px_rgba(58,182,181,0.35)]">
            IT
          </div>
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight drop-shadow-lg select-none transition-transform duration-200 ease-out hover:scale-[1.02]">
            Mision <span className="text-[#FFD700]">Emprende</span>
          </h1>
          <p className="text-white/90 max-w-xl text-lg sm:text-xl font-medium leading-relaxed select-none transition-transform duration-200 ease-out hover:scale-[1.015]">
>>>>>>> avanceAlejandro/rama_post_certamen_1
            Aprende emprendimiento en equipo · gana tokens y feedback
          </p>
        </header>

<<<<<<< HEAD
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
=======
        <section className="mt-10 max-w-lg sm:max-w-xl mx-auto space-y-4">
          <ButtonBig
            onClick={() => navigate("/estudiante")}
            bg="bg-[#3AB6B5]"
            icon={
              <IconBubble>
                <PiStudentBold className="text-2xl sm:text-3xl" />
              </IconBubble>
            }
            label="Ingresar como Estudiante"
          />

          <ButtonBig
            onClick={() => navigate("/login/profesor")}
            bg="bg-[#F68C1F]"
            icon={
              <IconBubble>
                <PiChalkboardTeacherBold className="text-2xl sm:text-3xl" />
              </IconBubble>
            }
            label="Ingresar como Profesor"
          />

          <ButtonBig
            onClick={() => navigate("/login/administrador")}
            bg="bg-[#1E5AA8]"
            icon={
              <IconBubble>
                <GrUserAdmin className="text-2xl sm:text-3xl" />
              </IconBubble>
            }
            label="Ingresar como Administrador"
          />

          <p className="text-sm text-white/80 pt-1 text-center">
>>>>>>> avanceAlejandro/rama_post_certamen_1
            ¿Nuevo? Ingresa con credenciales demo en la opción Profesor / Administrador
          </p>
        </section>

<<<<<<< HEAD
        <footer className="mt-10 text-white/70 text-sm">
          © 2025 Innovating Team
=======
        <footer className="mt-10 text-white/70 text-sm text-center">
          © 2025 Mision Emprende
>>>>>>> avanceAlejandro/rama_post_certamen_1
        </footer>
      </main>
    </div>
  );
}
<<<<<<< HEAD
=======

/* --- componentes reutilizables --- */
function IconBubble({ children }) {
  return (
    <span className="shrink-0 grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
      {children}
    </span>
  );
}

function ButtonBig({ icon, label, onClick, bg }) {
  return (
    <button
      onClick={onClick}
      className={`group w-full ${bg} text-white rounded-2xl shadow-lg
      hover:brightness-110 focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-white/70 transition px-5 sm:px-6 py-4 sm:py-5
      transform hover:scale-[1.02] active:scale-[0.99] duration-150 ease-out`}
    >
      <div className="flex items-center gap-4 sm:gap-5 w-full">
        {icon}
        <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none flex-1 text-center
        transition-transform duration-150 group-hover:scale-[1.02]">
          {label}
        </span>
        <span className="opacity-0 group-hover:opacity-100 transition text-2xl pr-1">
          →
        </span>
      </div>
    </button>
  );
}
>>>>>>> avanceAlejandro/rama_post_certamen_1
