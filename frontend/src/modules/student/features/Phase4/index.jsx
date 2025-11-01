import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ButtonGroup, Stack } from 'react-bootstrap';

// Importa los helpers (ajusta la ruta según tu estructura)
import { load, save } from '../../../../utils/helpers.js';

// Importa el modal de la ruleta
import RouletteModal from './components/RouletteModal';

export default function Phase4({ role, onNext, onBack }) {
  // Lógica de estado de index.html
  const [members, setMembers] = useState(() => load('it_members', ['Ana', 'Bruno', 'Carla', 'Diego']));
  const [selected, setSelected] = useState(() => load('it_selected', []));
  
  // Guardar en localStorage cuando cambien
  useEffect(() => {
    save('it_members', members);
    save('it_selected', selected);
  }, [members, selected]);
  
  const remaining = members.filter(m => !selected.includes(m));
  const [mode, setMode] = useState('ruleta');
  const [showRoulette, setShowRoulette] = useState(false);
  const isProf = role === 'profesor';

  // Función para añadir miembro (de index.html)
  const handleAddMember = (e) => {
    if (e.key === 'Enter') {
      const v = e.currentTarget.value.trim();
      if (v && !members.includes(v)) {
        setMembers([...members, v]);
        e.currentTarget.value = '';
      }
    }
  };

  // Función que se llama cuando la ruleta termina
  const handleSelectWinner = (name) => {
    // Si la ruleta se cierra sin ganador, o el nombre no está en la lista
    if (!name || !remaining.includes(name)) {
      setShowRoulette(false);
      return;
    }
    // Añade al ganador a la lista de 'seleccionados'
    setSelected(s => [...s, name]);
    setShowRoulette(false);
    alert('🎤 Pitch por: ' + name);
  };

  return (
    <>
      <Container style={{ maxWidth: '56rem' }}> {/* max-w-5xl */}
        <h1 className="h3 fw-bold mb-1 text-white">Fase 4 · Pitch del equipo</h1>
        <p className="text-white-50 mb-4">El profesor elige o sortea quién presenta.</p>
        
        <Row>
          {/* Card 1: Miembros (traducida a Bootstrap) */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title as="h5" className="fw-bold">Miembros del grupo</Card.Title>
                <div className="mt-3 d-flex flex-wrap gap-2">
                  {members.map(m => (
                    <Badge 
                      key={m} 
                      pill
                      bg={selected.includes(m) ? 'secondary' : 'light'} 
                      text={selected.includes(m) ? 'white' : 'dark'}
                      className={`p-2 fs-6 ${selected.includes(m) ? 'text-decoration-line-through' : ''}`}
                    >
                      {m}
                    </Badge>
                  ))}
                </div>
                {isProf && (
                  <InputGroup className="mt-4">
                    <Form.Control 
                      placeholder="Agregar miembro" 
                      onKeyDown={handleAddMember} 
                    />
                    <Button variant="outline-secondary" onClick={() => setSelected([])}>
                      Reset elegidos
                    </Button>
                  </InputGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          {/* Card 2: Seleccionar (traducida a Bootstrap) */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title as="h5" className="fw-bold">Seleccionar aleatoriamente</Card.Title>
                <ButtonGroup className="mt-3 d-flex gap-2">
                  {['ruleta', 'palito', 'vasos'].map(k => (
                    <Button 
                      key={k} 
                      variant={mode === k ? 'primary' : 'light'}
                      // Asigna el color 'mint' de tu index.html
                      style={mode === k ? { backgroundColor: '#00B8A9', borderColor: '#00B8A9' } : {}}
                      onClick={() => setMode(k)}
                    >
                      {k === 'ruleta' ? 'Ruleta' : k === 'palito' ? 'Palito más corto' : 'Juego de vasos'}
                    </Button>
                  ))}
                </ButtonGroup>
                
                <p className="text-muted small mt-4">Método visual cambia, pero la selección es justa. No se repiten presentadores.</p>
                
                {isProf ? (
                  <Button 
                    variant="warning" // Asigna el color 'accent'
                    style={{ backgroundColor: '#FF7B39', color: 'white', borderColor: '#FF7B39' }} 
                    className="mt-4" 
                    onClick={() => setShowRoulette(true)}
                    disabled={remaining.length === 0}
                  >
                    {remaining.length === 0 ? 'Todos han presentado' : 'Elegir al azar'}
                  </Button>
                ) : (
                  <p className="text-muted small mt-4">Solo el profesor puede sortear.</p>
                )}
                
                <Stack direction="horizontal" gap={2} className="mt-5">
                  <Button variant="light" onClick={onBack}>← Volver</Button>
                  <Button 
                    variant="warning" 
                    style={{ backgroundColor: '#FF7B39', color: 'white', borderColor: '#FF7B39' }} 
                    onClick={onNext}
                  >
                    Continuar a Fase 5
                  </Button>
                </Stack>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* El Modal de la Ruleta (se renderiza aquí) */}
      <RouletteModal
        isOpen={showRoulette}
        onClose={() => setShowRoulette(false)}
        names={remaining} // Pasa solo los miembros restantes
        onSpinEnd={handleSelectWinner}
      />
    </>
  );
}