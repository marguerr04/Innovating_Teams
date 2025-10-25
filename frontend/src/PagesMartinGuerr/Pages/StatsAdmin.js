import React from "react";
// Importa los componentes de layout de Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// 1. Importa tu nuevo componente de tarjeta
import DashboardCard from "../Components/DashboardCard";

// Este es el placeholder para tus gráficos, para que no se vea vacío
const GraphPlaceholder = () => (
  <div className="graph-placeholder">
    [Gráfico irá aquí]
  </div>
);

export default function StatsAdmin() {
  return (
    <>
      {/* --- FILA DE TÍTULO Y BOTONES --- */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h1 className="h3 mb-0">Dashboard de Estadísticas</h1>
          <p className="text-muted mb-0">Métricas simuladas de la plataforma.</p>
        </Col>
        <Col md={6} className="text-md-end mt-3 mt-md-0">
          {/* 2. Usamos las clases CSS personalizadas para los botones */}
          <Button variant="csv" size="sm" className="me-2 btn-csv">
            Exportar CSV
          </Button>
          <Button variant="pdf" size="sm" className="btn-pdf">
            Descargar PDF
          </Button>
        </Col>
      </Row>

      {/* --- FILA 1: 3 TARJETAS PEQUEÑAS --- */}
      <Row className="mb-4">
        <Col md={6} lg={4} className="mb-3">
          <DashboardCard title="Profesores totales">
            {/* Aquí iría tu componente de KPI o gráfico */}
            <GraphPlaceholder /> 
          </DashboardCard>
        </Col>
        <Col md={6} lg={4} className="mb-3">
          <DashboardCard title="Estudiantes Impactados">
            <GraphPlaceholder />
          </DashboardCard>
        </Col>
        <Col md={12} lg={4} className="mb-3">
          <DashboardCard title="Interés en ingresar a programas">
            <GraphPlaceholder />
          </DashboardCard>
        </Col>
      </Row>

      {/* --- FILA 2: 2 TARJETAS (GRÁFICO DE DONA Y BARRAS) --- */}
      <Row className="mb-4">
        <Col lg={5} className="mb-3">
          <DashboardCard title="Carreras participantes">
            <GraphPlaceholder />
          </DashboardCard>
        </Col>
        <Col lg={7} className="mb-3">
          <DashboardCard title="Frecuencia de Uso por Profesor Total">
            <GraphPlaceholder />
          </DashboardCard>
        </Col>
      </Row>
      
      {/* --- FILA 3: 2 TARJETAS (RADAR Y SATISFACCIÓN) --- */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <DashboardCard title="Desempeño Promedio por Habilidad">
            <GraphPlaceholder />
          </DashboardCard>
        </Col>
        <Col md={6} className="mb-3">
          <DashboardCard title="Nivel de Satisfacción Promedio">
            <GraphPlaceholder />
          </DashboardCard>
        </Col>
      </Row>
    </>
  );
}
