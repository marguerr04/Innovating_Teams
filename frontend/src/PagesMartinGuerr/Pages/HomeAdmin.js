import React from "react";
// 1. Importa los componentes de React-Bootstrap que necesitas
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

// Asumo que este archivo se llama HomeAdmin.js como en tu explorador
export default function HomeAdmin() {
  return (
    <>
      <h1>
        Bienvenida <span className="highlight">Administrador</span>
      </h1>

      {/* 2. Reemplaza tu sección <section> por un <Row> de Bootstrap */}
      {/* "mt-4" añade un margen superior */}
      <Row className="mt-4">
        
        {/* 3. Cada "tile" ahora es una <Col> con una <Card> dentro */}
        <Col md={4} className="mb-3">
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="p-4">
              <Card.Title className="h5">🧑‍💻 Gestiona usuarios y juegos</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="p-4">
              <Card.Title className="h5">👤 Actualiza tu perfil</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="p-4">
              <Card.Title className="h5">📊 Explora estadísticas</Card.Title>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </>
  );
}
