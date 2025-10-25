import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import Papa from 'papaparse';

// Importaciones de dnd-kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Generador de ID simple
const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();

// Componente 'Chip' (el item arrastrable)
function SortableChip({ id, name }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="badge bg-light text-dark border p-2"
    >
      {name}
    </div>
  );
}

// Componente 'DroppableArea' (el contenedor)
function DroppableArea({ id, title, items, badgeCount }) {
  // Nota: Dnd-kit hace que el área 'droppable' (SortableContext)
  // también sea 'sortable' para que pueda interactuar.
  const { setNodeRef } = useSortable({ id, data: { isContainer: true } });

  return (
    <SortableContext id={id} items={items.map(i => i.id)} strategy={rectSortingStrategy}>
      <Card ref={setNodeRef} className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          {title}
          <span className={`badge ${id === 'pool' ? 'bg-secondary' : 'bg-primary'}`}>{badgeCount}</span>
        </Card.Header>
        <Card.Body
          style={{ minHeight: '120px' }}
          className="d-flex flex-wrap align-content-start gap-2"
        >
          {items.map(item => (
            <SortableChip key={item.id} id={item.id} name={item.name} />
          ))}
        </Card.Body>
      </Card>
    </SortableContext>
  );
}


function GroupBuilder({ onGroupsChange }) {
  // --- ESTADO INICIAL COMPLETO ---
  const [controls, setControls] = useState({
    mode: 'random',
    nGroups: 4,
    groupSize: '',
    hasHeader: false,
  });
  
  const [names, setNames] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [groups, setGroups] = useState([]);

  // Notificar al padre (CrearJuegoView) cada vez que los grupos cambien
  useEffect(() => {
    if (onGroupsChange) {
      onGroupsChange({ groups, unassigned });
    }
  }, [groups, unassigned, onGroupsChange]);

  // --- FUNCIONES FALTANTES ---

  // Manejar cambios en los controles (modo, nGrupos, etc.)
  const handleControlChange = (e) => {
    const { id, value, type, checked } = e.target;
    setControls(prev => ({
      ...prev,
      [id.replace('gb_', '')]: type === 'checkbox' ? checked : value,
    }));
  };

  // Leer el archivo CSV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        let parsedNames = results.data
          .map(row => (row[0] || '').trim())
          .filter(Boolean);
        
        if (controls.hasHeader) {
          parsedNames = parsedNames.slice(1);
        }
        
        setNames(parsedNames);
        alert(`${parsedNames.length} nombres cargados desde CSV.`);
      },
      error: (err) => {
        console.error(err);
        alert('Error al leer el archivo CSV.');
      }
    });
  };

  // Construir/Repartir los grupos
  const handleBuild = () => {
    if (names.length === 0) {
      alert('Sube un archivo CSV primero.');
      return;
    }
    
    const persons = names.map(name => ({ id: uid(), name }));
    let gCount = parseInt(controls.nGroups, 10) || 1;
    const size = parseInt(controls.groupSize, 10);
    
    if (size > 0) {
      gCount = Math.ceil(persons.length / size);
    }
    
    let newGroups = Array.from({ length: gCount }, (_, i) => ({
      id: `group-${i + 1}`,
      name: `Grupo ${i + 1}`,
      members: [],
    }));
    
    if (controls.mode === 'random') {
      const arr = [...persons];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      arr.forEach((person, i) => {
        newGroups[i % gCount].members.push(person);
      });
      setGroups(newGroups);
      setUnassigned([]);
    } else {
      setGroups(newGroups);
      setUnassigned(persons);
    }
  };
  
  // Reiniciar
  const handleReset = () => {
    setGroups([]);
    setUnassigned([]);
    setNames([]);
    const fileInput = document.getElementById('gb_file');
    if(fileInput) fileInput.value = null;
  };

  // Sensores de dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Lógica de Drag-End (para mover entre listas)
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return; // Se soltó en un lugar no válido
    
    // Encuentra el contenedor del item activo (de dónde viene)
    let activeContainerId = 'pool';
    if(groups.some(g => g.members.some(m => m.id === active.id))) {
      activeContainerId = groups.find(g => g.members.some(m => m.id === active.id)).id;
    }

    // Encuentra el contenedor del item 'over' (a dónde va)
    // Puede ser el contenedor en sí (Card) o un item dentro de él
    let overContainerId = over.id;
    if(over.data.current?.isContainer !== true) {
      if(over.id === 'pool') {
        overContainerId = 'pool';
      } else if (unassigned.some(m => m.id === over.id)) {
        overContainerId = 'pool';
      } else {
        const group = groups.find(g => g.members.some(m => m.id === over.id));
        if (group) overContainerId = group.id;
      }
    }
    
    if (activeContainerId === overContainerId) {
      // Lógica de reordenar DENTRO de la misma lista
      if (activeContainerId === 'pool') {
        setUnassigned((items) => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else {
        setGroups((prevGroups) => prevGroups.map(group => {
          if (group.id === activeContainerId) {
            const oldIndex = group.members.findIndex(item => item.id === active.id);
            const newIndex = group.members.findIndex(item => item.id === over.id);
            return { ...group, members: arrayMove(group.members, oldIndex, newIndex) };
          }
          return group;
        }));
      }
    } else {
      // Lógica de mover ENTRE listas
      let item; // El item que se está moviendo
      let sourceList = activeContainerId === 'pool' ? unassigned : groups.find(g => g.id === activeContainerId)?.members;
      let activeIndex = sourceList.findIndex(i => i.id === active.id);
      item = sourceList[activeIndex];

      // 1. Quitar de la lista de origen
      if (activeContainerId === 'pool') {
        setUnassigned(prev => prev.filter(i => i.id !== active.id));
      } else {
        setGroups(prev => prev.map(g => g.id === activeContainerId ? { ...g, members: g.members.filter(m => m.id !== active.id) } : g));
      }

      // 2. Agregar a la lista de destino
      let destList = overContainerId === 'pool' ? unassigned : groups.find(g => g.id === overContainerId)?.members;
      let overIndex = destList.findIndex(i => i.id === over.id);
      if(overIndex < 0) overIndex = destList.length; // Si se suelta en el contenedor, va al final

      if (overContainerId === 'pool') {
        setUnassigned(prev => [...prev.slice(0, overIndex), item, ...prev.slice(overIndex)]);
      } else {
        setGroups(prev => prev.map(g => g.id === overContainerId ? { ...g, members: [...g.members.slice(0, overIndex), item, ...g.members.slice(overIndex)] } : g));
      }
    }
  };

  return (
    <Card className="my-4 border-primary">
      <Card.Header as="h3">1. Lista y Equipos (CSV)</Card.Header>
      <Card.Body>
        {/* --- TOOLBAR JSX FALTANTE --- */}
        <Row className="gy-3 align-items-end">
          <Col md={6}>
            <Form.Group controlId="gb_file">
              <Form.Label>Archivo CSV</Form.Label>
              <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
              <Form.Text>Se toma la <b>primera columna</b> del archivo CSV.</Form.Text>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Check id="gb_hasHeader" label="Mi archivo tiene encabezado" onChange={handleControlChange} checked={controls.hasHeader} />
          </Col>
          <Col md={3}>
            <Form.Label>Modo</Form.Label>
            <Form.Select id="gb_mode" value={controls.mode} onChange={handleControlChange}>
              <option value="random">Aleatoria (balanceada)</option>
              <option value="manual">Manual (arrastrar)</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Cantidad de grupos</Form.Label>
            <Form.Control type="number" id="gb_nGroups" value={controls.nGroups} onChange={handleControlChange} min="1" />
          </Col>
          <Col md={3}>
            <Form.Label>Tamaño por grupo</Form.Label>
            <Form.Control type="number" id="gb_groupSize" value={controls.groupSize} onChange={handleControlChange} placeholder="opcional" min="1" />
          </Col>
          <Col md={3}>
            <Button variant="primary" className="w-100" onClick={handleBuild}>Crear / Repartir</Button>
          </Col>
        </Row>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Form.Text>Si defines <b>Tamaño por grupo</b>, se ignorará “Cantidad de grupos”.</Form.Text>
          <Button variant="secondary" size="sm" onClick={handleReset}>Reiniciar</Button>
        </div>
        
        {/* --- FIN TOOLBAR --- */}
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {/* Pool (Piscina) */}
          <DroppableArea
            id="pool"
            title="Estudiantes sin asignar"
            badgeCount={unassigned.length}
            items={unassigned}
          />

          {/* Grupos */}
          <Row className="mt-3">
            {groups.map((group) => (
              <Col md={4} key={group.id}>
                <DroppableArea
                  id={group.id}
                  title={group.name}
                  badgeCount={group.members.length}
                  items={group.members}
                />
              </Col>
            ))}
          </Row>
        </DndContext>
      </Card.Body>
    </Card>
  );
}

export default GroupBuilder;