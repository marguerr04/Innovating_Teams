import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useProfesor } from '../Components/ProfessorContext.jsx'; // Asumo que este contexto existe
import GroupBuilder from './GroupBuilder';// Importamos el componente hijo

// Constantes movidas de profesor.js
const UNIVERSIDADES_CL = [
  "Universidad de Chile","Pontificia Universidad Católica de Chile","Universidad de Santiago de Chile",
  "Universidad de Concepción","Universidad Técnica Federico Santa María","Pontificia Universidad Católica de Valparaíso",
  "Universidad de Valparaíso","Universidad Austral de Chile","Universidad de Talca","Universidad de La Serena",
  "Universidad Católica del Norte","Universidad de Antofagasta","Universidad de Tarapacá","Universidad de Atacama",
  "Universidad de Magallanes","Universidad del Bío‑Bío","Universidad de La Frontera","Universidad de O’Higgins",
  "Universidad de Aysén","Universidad Diego Portales","Universidad Adolfo Ibáñez","Universidad Alberto Hurtado",
  "Universidad Andrés Bello","Universidad del Desarrollo","Universidad Mayor","Universidad Finis Terrae",
  "Universidad San Sebastián","Universidad Católica Silva Henríquez","Universidad Santo Tomás","Universidad de Las Américas"
].sort();
const CARRERAS_BASE = [
  "Ingeniería Civil Informática","Ingeniería Comercial","Ingeniería Industrial","Medicina","Enfermería","Odontología",
  "Kinesiología","Nutrición y Dietética","Psicología","Derecho","Arquitectura","Diseño","Periodismo","Publicidad",
  "Administración Pública","Trabajo Social","Pedagogía en Educación Básica","Pedagogía en Educación Parvularia",
  "Fonoaudiología","Tecnología Médica","Bioquímica","Química y Farmacia","Construcción Civil","Ingeniería Mecánica",
  "Ingeniería Electrónica","Ingeniería Civil","Data Science","Matemática","Física","Otra (especificar)"
].sort();
const MAX_ANIO = 7;

function CrearJuegoView() {
  // Asumo que tu contexto se llama 'useProfesor' y tiene 'addJuego' y 'primeAudioOnce'
  const { addJuego, primeAudioOnce } = useProfesor(); 
  
  // 1. Estado para el formulario de METADATOS
  const [formData, setFormData] = useState({
    anio: '',
    universidad: '',
    carrera: '',
    carreraOtra: ''
  });
  
  // 2. Estado para los DATOS DE GRUPOS (viene del hijo)
  const [groupData, setGroupData] = useState({ groups: [], unassigned: [] });

  // 3. Manejador para el formulario de METADATOS
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  // 4. Validación del formulario principal
  const isFormValid = formData.anio && formData.universidad && formData.carrera &&
                      (formData.carrera !== 'Otra (especificar)' || formData.carreraOtra.trim().length > 1);

  // 5. Validación de los grupos (del hijo)
  const areGroupsValid = groupData.groups.length > 0 && groupData.unassigned.length === 0;

  // 6. Manejador de SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!areGroupsValid) {
      if (groupData.groups.length === 0) {
        alert('Debes crear los grupos usando el constructor de equipos.');
      } else if (groupData.unassigned.length > 0) {
        alert(`Aún tienes ${groupData.unassigned.length} estudiantes sin asignar a un grupo.`);
      }
      return;
    }
    
    primeAudioOnce(); //

    // Combinar metadatos del formulario con los grupos del GroupBuilder
    const payload = {
      anio: parseInt(formData.anio, 10),
      universidad: formData.universidad,
      carrera: formData.carrera === 'Otra (especificar)' ? formData.carreraOtra.trim() : formData.carrera,
    };
    
    // Generar PIN y crear el objeto 'game'
    // Esta lógica viene del script en línea de profesor.html, que es más completo
    const pin = String(Math.floor(100000 + Math.random() * 900000));
    const game = { 
      id: Date.now(), 
      pin, 
      ...payload, // anio, universidad, carrera
      groups: groupData.groups, // Los grupos del GroupBuilder
      meta: { createdAt: Date.now(), source: 'profesor-react' },
      started: false
    };
    
    // Guardar el juego (usando el Contexto)
    // El script original guardaba en 'ME_ROOM_[pin]'
    // El script de profesor.js guardaba en 'juegos'
    // Usaremos la lógica de 'juegos' del contexto.
    addJuego(game); 
    
    // Lógica para abrir la sala de espera
    // (El script original redirigía a waiting-room.html)
    // (El script de profesor.js abría una nueva pestaña)
    alert('Juego creado con éxito.\nPIN: ' + pin);
    window.open('waiting-room.html?role=profesor&pin=' + pin, '_blank');
    
    // Opcional: resetear todo (si se queda en esta vista)
    setFormData({ anio: '', universidad: '', carrera: '', carreraOtra: '' });
    // (El GroupBuilder necesitaría una prop de 'reset' para limpiarse,
    // pero por ahora lo dejamos así, ya que la página podría navegar a 'home')
  };
  
  return (
    <Card style={{ maxWidth: '880px' }}>
      <Card.Body>
        <Card.Title>Crear juego</Card.Title>
        <Form id="crear-juego" onSubmit={handleSubmit}>
          
          {/* --- PASO 1: GroupBuilder --- */}
          {/* El 'onGroupsChange' es la clave: actualiza el estado 'groupData' del padre */}
          <GroupBuilder onGroupsChange={setGroupData} />
          
          <h3 className="mt-4">2. Metadatos del Juego</h3>
          
          {/* --- PASO 2: Metadatos --- */}
          <Row className="mb-3">
            <Form.Group as={Col} controlId="anio">
              <Form.Label>Año cursado</Form.Label>
              <Form.Select value={formData.anio} onChange={handleChange}>
                <option value="" disabled>Selecciona (1–7)</option>
                {[...Array(MAX_ANIO).keys()].map(n => 
                  <option key={n + 1} value={n + 1}>{n + 1}</option>
                )}
              </Form.Select>
            </Form.Group>
            
            <Form.Group as={Col} controlId="universidad">
              <Form.Label>Universidad</Form.Label>
              <Form.Select value={formData.universidad} onChange={handleChange}>
                <option value="" disabled>Selecciona universidad (Chile)</option>
                {UNIVERSIDADES_CL.map(u => <option key={u} value={u}>{u}</option>)}
              </Form.Select>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="carrera">
            <Form.Label>Carrera</Form.Label>
            <Form.Select value={formData.carrera} onChange={handleChange}>
              <option value="" disabled>Selecciona carrera</option>
              {CARRERAS_BASE.map(c => <option key={c} value={c}>{c}</option>)}
            </Form.Select>
          </Form.Group>
          
          {formData.carrera === 'Otra (especificar)' && (
            <Form.Group className="mb-3" controlId="carreraOtra">
              <Form.Control 
                value={formData.carreraOtra} 
                onChange={handleChange} 
                placeholder="Especifica la carrera" 
              />
            </Form.Group>
          )}

          {!areGroupsValid && (
            <Alert variant="warning">
              {groupData.groups.length === 0 
                ? "Aún no has creado los grupos." 
                : `Aún tienes ${groupData.unassigned.length} estudiantes sin asignar.`}
            </Alert>
          )}

          {/* --- PASO 3: Submit --- */}
          <Row className="mt-4">
            <Col>
              <Button variant="secondary" type="button" onClick={() => {/* Lógica de cancelar */}}>
                Cancelar
              </Button>
            </Col>
            <Col>
              <Button variant="warning" type="submit" disabled={!isFormValid || !areGroupsValid}>
                Crear juego
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default CrearJuegoView;