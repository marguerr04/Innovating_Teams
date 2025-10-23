import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "../Admin.css";

export default function AdminLayout() {
  return (
    <Container fluid className="vh-100 p-0">
      <Row className="h-100 g-0">
        
        {/* Columna izquierda */}
        <Col md={3} lg={2} className="bg-dark p-0 h-100">
          <SidebarAdmin />
        </Col>

        {/* Columna derecha */}
        <Col md={9} lg={10} className="p-4 admin-workspace">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
