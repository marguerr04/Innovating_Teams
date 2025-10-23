import React from 'react';
import Card from 'react-bootstrap/Card';

// Este es tu componente de tarjeta reutilizable.
// Acepta un 'title' y 'children' (el contenido) como props.
export default function DashboardCard({ title, children }) {
  return (
    // Usamos la Card de Bootstrap como base.
    // 'h-100' asegura que todas las tarjetas en una fila tengan la misma altura.
    <Card className="shadow-sm border-0 rounded-3 h-100">
      <Card.Body className="p-4">
        
        {/* Encabezado de la tarjeta */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title as="h6" className="fw-bold text-secondary mb-0">
            {title}
          </Card.Title>
          {/* Este es el placeholder para tu icono de filtro '▼' */}
          <span className="filter-icon" title="Aplicar filtro">▼</span>
        </div>

        {/* Aquí es donde irá el contenido (tu placeholder del gráfico) */}
        <div>
          {children}
        </div>
      </Card.Body>
    </Card>
  );
}
