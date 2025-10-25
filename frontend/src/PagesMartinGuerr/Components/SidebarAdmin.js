
import React from "react";
import { NavLink } from "react-router-dom";

export default function SidebarAdmin() {
  return (
    <aside className="sidebaradmin p-3 h-100 bg-dark text-white">

      <div className="brand-side mb-3">
        <div className="logo-mini">IT</div>
        <strong>Innovating Team</strong>
      </div>

      <nav className="menu">
        <NavLink end to="/admin" className="item">
          🏠 Menú principal
        </NavLink>
        <NavLink to="/admin/profile" className="item">
          👤 Editar perfil
        </NavLink>
        <NavLink to="/admin/stats" className="item">
          📊 Dashboard
        </NavLink>
        <a className="item" href="#logout" onClick={(e)=>e.preventDefault()}>
          ⏻ Cerrar sesión
        </a>
      </nav>
    </aside>
  );
}
