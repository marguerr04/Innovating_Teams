import React from 'react';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom'; // Outlet es donde se cargan las rutas anidadas

function ProfesorLayout() {
  return (
    <Container fluid>
      <Row>
        {/* Sidebar: usa Nav de react-bootstrap */}
        <Col md={3} lg={2} className="bg-primary text-white vh-100 p-3">
          <h3>Innovating Team</h3>
          <Nav className="flex-column">
            {/* Link de React Router reemplaza a <a> */}
            <Nav.Link as={Link} to="/profesor/home" className="text-white">🏠 Menú principal</Nav.Link>
            <Nav.Link as={Link} to="/profesor/crear" className="text-white">✏️ Crear juego</Nav.Link>
            <Nav.Link as={Link} to="/profesor/perfil" className="text-white">👤 Editar perfil</Nav.Link>
            <Nav.Link as={Link} to="/login" className="text-white">⏻ Cerrar sesión</Nav.Link>
          </Nav>
        </Col>

        {/* Workspace: El <Outlet> renderizará la vista activa */}
        <Col md={9} lg={10} className="p-4" style={{ backgroundColor: '#f5f7fb' }}>
          <h1>Bienvenido <span className="text-primary">Profesor</span></h1>
          {/* Aquí se renderizará HomeView, CrearJuegoView, o PerfilView */}
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default ProfesorLayout;