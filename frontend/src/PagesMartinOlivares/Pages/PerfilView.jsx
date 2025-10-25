import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useProfesor } from '../Components/ProfessorContext.jsx';

function PerfilView() {
  const { perfil, savePerfil } = useProfesor();
  
  // Estado local para el formulario
  const [formData, setFormData] = useState(perfil);

  // Sincroniza el form si el perfil del contexto cambia
  useEffect(() => {
    setFormData(perfil);
  }, [perfil]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('perfil-', '')]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar email (lógica de profesor.js)
    if(formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){
      alert('Correo inválido'); 
      return; 
    }
    savePerfil({
      institucion: formData.institucion?.trim() || '',
      carrera: formData.carrera?.trim() || '',
      nombre: formData.nombre?.trim() || '',
      email: formData.email?.trim() || '',
      telefono: formData.telefono?.trim() || '',
    });
    alert('Perfil guardado');
    // (Opcional) Navegar a home
    // navigate('/profesor/home');
  };

  const handleCancel = () => {
    setFormData(perfil); // Resetea el form al estado guardado
  };

  return (
    <Card style={{ maxWidth: '880px' }}>
      <Card.Body>
        <Card.Title>Editar perfil</Card.Title>
        <Form id="perfil-form" onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="perfil-institucion">
              <Form.Label>Institución</Form.Label>
              <Form.Control value={formData.institucion || ''} onChange={handleChange} placeholder="Ej: UDD" />
            </Form.Group>
            <Form.Group as={Col} controlId="perfil-carrera">
              <Form.Label>Carrera</Form.Label>
              <Form.Control value={formData.carrera || ''} onChange={handleChange} placeholder="Ej: Ingeniería Comercial" />
            </Form.Group>
          </Row>
          {/* ... Repetir para Nombre, Email y Teléfono ... */}
          <Row>
            <Col>
              <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
            </Col>
            <Col>
              <Button variant="warning" type="submit">Guardar cambios</Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PerfilView;