import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { useProfesor } from '../Components/ProfessorContext.jsx'; // Importamos el hook
import { Link } from 'react-router-dom';

function HomeView() {
  const { juegos } = useProfesor(); // Obtenemos los juegos del contexto
  
  const juegosRecientes = [...juegos].slice(-5).reverse();

  return (
    <>
      <div className="my-3">
        <Button as={Link} to="/profesor/crear" variant="warning" className="me-2">➕ Crear juego</Button>
        {/* La lógica de "Iniciar votación" se manejaría aquí */}
      </div>
      
      <Card>
        <Card.Body>
          <Card.Title>Juegos recientes</Card.Title>
          {juegosRecientes.length > 0 ? (
            <ListGroup variant="flush">
              {juegosRecientes.map(j => (
                <ListGroup.Item key={j.id}>
                  PIN <b>{j.pin}</b> · {j.grupos} grupos · max {j.integrantesMax} / grupo
                  <a href={`waiting-room.html?pin=${j.pin}`} target="_blank" rel="noreferrer" className="ms-2">
                    Ver sala
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted">Aún no has creado juegos.</p>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default HomeView;