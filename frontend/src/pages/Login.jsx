import { useState } from "react";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
export default function Login() {
=======
export default function Login({ redirectToAdmin = false }) {
>>>>>>> avanceAlejandro/rama_post_certamen_1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
<<<<<<< HEAD
=======
      // Modo profesor (dummy): acepta cualquier credencial y redirige a Admin
      if (redirectToAdmin) {
        if (!email || !password) throw new Error("Completa los campos");
        localStorage.setItem("token", "dummy-prof-token");
        localStorage.setItem("username", email.split("@")[0] || "profesor");
        localStorage.setItem("role", "profesor");
        navigate("/admin");
        return;
      }

>>>>>>> avanceAlejandro/rama_post_certamen_1
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");
      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      if (data.role === "profesor") navigate("/profesor");
      else if (data.role === "admin" || data.role === "administrador") navigate("/admin");
      else navigate("/estudiante");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(1200px_600px_at_80%_10%,#204b86_0%,#163a6a_40%,#0f2b4d_100%)] text-white relative overflow-hidden">
      {/* ← Volver */}
      <a
        href="/login"
        className="absolute top-6 left-6 text-white opacity-80 hover:opacity-100 transition"
      >
        ← Volver
      </a>

      {/* Tarjeta */}
      <section className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-grid w-16 h-16 place-items-center bg-gradient-to-br from-[#3AB6B5] to-[#1E5AA8] text-white font-bold rounded-xl mx-auto mb-3">
            IT
          </div>
          <h2 className="text-3xl font-extrabold text-[#0b1f3a] mb-1">
            Iniciar sesión
          </h2>
          <p className="text-gray-500 text-sm">
            Aprende emprendimiento en equipo
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold">Correo electrónico</label>
            <input
              type="email"
              placeholder="usuario@innovating.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-2 focus:ring-[#1E5AA8] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-2 focus:ring-[#1E5AA8] focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-red-600 bg-red-100 p-2 rounded-lg text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#F68C1F] hover:bg-[#e97a18] text-white py-3 font-bold rounded-lg shadow-lg transition-transform transform hover:-translate-y-[2px] active:translate-y-0"
          >
            Ingresar
          </button>
        </form>

        <footer className="text-center text-gray-500 text-sm mt-6">
          © 2025 Innovating Team
        </footer>
      </section>
    </div>
  );
}
