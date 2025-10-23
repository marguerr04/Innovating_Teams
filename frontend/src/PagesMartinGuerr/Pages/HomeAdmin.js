// src/pages/Home.jsx
import React from "react";

export default function Home() {
  return (
    <>
      <h1>
        Bienvenida <span className="highlight">Administrador</span>
      </h1>

      <section className="view show">
        <div className="grid kpi">
          <div className="tile">🧑‍💻 Gestiona usuarios y juegos</div>
          <div className="tile">👤 Actualiza tu perfil</div>
          <div className="tile">📊 Explora estadísticas</div>
        </div>
      </section>
    </>
  );
}
