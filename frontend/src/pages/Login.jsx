// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json();
      localStorage.setItem("token", data.token);

      // Redirige a la app de estudiante
      navigate("/estudiante");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E5AA8] to-[#183f72] text-white">
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-grid w-16 h-16 place-items-center bg-gradient-to-br from-[#3AB6B5] to-[#1E5AA8] text-white font-bold rounded-xl">
            IT
          </div>
          <h1 className="text-3xl font-extrabold mt-3">
            Innovating <span className="text-[#FFD700]">Team</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Aprende emprendimiento en equipo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold">Correo electrónico</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-2 focus:ring-[#1E5AA8] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="font-semibold">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-2 focus:ring-[#1E5AA8] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-600 bg-red-100 p-2 rounded-lg text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#3AB6B5] hover:bg-[#329d9c] text-white py-3 font-bold rounded-lg shadow-md"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          © 2025 Innovating Team
        </p>
      </div>
    </div>
  );
}
