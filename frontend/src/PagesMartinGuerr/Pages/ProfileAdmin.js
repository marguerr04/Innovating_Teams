
import React from "react";

export default function ProfileAdmin() {
  return (
    <section className="view">
      <div className="card" style={{ maxWidth: 880 }}>
        <h2 className="title">Editar perfil</h2>


        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="grid-2">
            <div className="field">
              <label>Institución</label>
              <input placeholder="Ej: UDD" />
            </div>
            <div className="field">
              <label>Cargo</label>
              <input placeholder="Ej: Coordinador" />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Nombre</label>
              <input />
            </div>
            <div className="field">
              <label>Correo electrónico</label>
              <input type="email" />
            </div>
          </div>

          <div className="field">
            <label>Teléfono</label>
            <input type="tel" />
          </div>

          <div className="grid-2">
            <button type="button" className="btn btn-teal">Cancelar</button>
            <button type="submit" className="btn btn-orange">Guardar cambios</button>
          </div>

          <p className="muted">*Demo UI — sin persistencia</p>
        </form>
      </div>
    </section>
  );
}
