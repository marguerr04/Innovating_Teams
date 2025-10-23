
import React from "react";

export default function Stats() {
  return (
    <section className="view">
      <div className="card">
        <h2 className="title">Estadísticas</h2>
        <p className="subtitle">Métricas simuladas de la plataforma.</p>

        <div className="grid kpi">
          <div className="tile">Usuarios activos: <b>1,548</b></div>
          <div className="tile">Juegos en progreso: <b>15</b></div>
          <div className="tile">Uptime: <b>99.2%</b></div>
        </div>
      </div>
    </section>
  );
}
