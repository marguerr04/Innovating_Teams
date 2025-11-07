import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfesor } from '../components/ProfessorContext';
import ListaEquiposCard from '../components/ListaEquiposCard';
import MetadatosJuegoCard from '../components/MetadatosJuegoCard';
import InformacionBasicaCard from '../components/InformacionBasicaCard';






const CrearJuegoView = () => {
  const navigate = useNavigate();
  const { addJuego } = useProfesor();
  
  const [formData, setFormData] = useState({
    // Información básica
    nombre: '',
    descripcion: '',
    duracion: '',
    maxParticipantes: '',
    tipoJuego: 'colaborativo',
    
    // Configuración CSV
    archivoCSV: null,
    tieneEncabezado: true,
    modo: 'aleatoria',
    cantidadGrupos: 4,
    tamanoGrupo: '',
    
    // Metadatos del juego
    anoCursado: '',
    universidad: '',
    carrera: ''
  });

  const [gruposCreados, setGruposCreados] = useState(false);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setFormData(prev => ({
        ...prev,
        archivoCSV: file
      }));
    } else {
      alert('Por favor seleccione un archivo CSV válido');
    }
  };

  const crearRepartirGrupos = async () => {
  if (!formData.archivoCSV) {
    alert('Por favor, selecciona un archivo primero.');
    return;
  }

  // Prepara el FormData
  const dataToSend = new FormData();
  dataToSend.append('archivo_lista', formData.archivoCSV);
  dataToSend.append('cantidad_grupos', formData.cantidadGrupos);
  dataToSend.append('tiene_encabezado', formData.tieneEncabezado);
  dataToSend.append('modo', formData.modo);

  try {
    const response = await fetch('http://localhost:8000/api/groups/assign', {
      method: 'POST',
      body: dataToSend,
    });

    const result = await response.json();

    if (response.ok) {
      console.log(' Grupos creados:', result);
      alert(`Grupos creados exitosamente (${result.grupos.length} equipos)`);
      setGruposCreados(result.grupos);
    } else {
      alert(` Error: ${result.error || 'Error desconocido'}`);
      console.error('Detalles del error:', result);
    }
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
    alert(' Error al conectar con el backend. Revisa consola.');
  }
};


  const reiniciarFormulario = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      duracion: '',
      maxParticipantes: '',
      tipoJuego: 'colaborativo',
      archivoCSV: null,
      tieneEncabezado: false,
      modo: 'aleatoria',
      cantidadGrupos: 4,
      tamanoGrupo: '',
      anoCursado: '',
      universidad: '',
      carrera: ''
    });
    setGruposCreados(false);
  };

  const guardarJuego = () => {
    if (!formData.nombre || !formData.descripcion) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const nuevoJuego = {
      id: Date.now(),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      duracion: formData.duracion,
      maxParticipantes: formData.maxParticipantes,
      tipo: formData.tipoJuego,
      estado: 'pendiente',
      fechaCreacion: new Date().toLocaleDateString(),
      participantes: 0,
      metadatos: {
        anoCursado: formData.anoCursado,
        universidad: formData.universidad,
        carrera: formData.carrera
      }
    };

    addJuego(nuevoJuego);
    alert('Juego creado exitosamente');
    navigate('/profesor/home');
  };

  const cancelarCreacion = () => {
    navigate('/profesor/home');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#2E5E8C' }}>
          Crear Nuevo Juego
        </h1>
        <p className="text-gray-600">
          Configura un juego personalizado para tus estudiantes
        </p>
      </div>

      {/* Sección 1: Lista y Equipos (CSV) */}
      <ListaEquiposCard
        formData={formData}
        handleInputChange={handleInputChange}
        handleFileUpload={handleFileUpload}
        crearRepartirGrupos={crearRepartirGrupos}
        reiniciarFormulario={reiniciarFormulario}
        gruposCreados={gruposCreados}
      />

      {/* Sección 2: Metadatos del Juego */}
      <MetadatosJuegoCard
        formData={formData}
        handleInputChange={handleInputChange}
      />

      {/* Botones de acción */}
      <div className="flex justify-between">
        <button
          onClick={cancelarCreacion}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          Cancelar
        </button>

        <button
          onClick={guardarJuego}
          className="px-6 py-2 rounded-md text-black font-medium transition-colors duration-200"
          style={{ backgroundColor: '#FDC328' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e6b023'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#FDC328'}
        >
          Crear juego
        </button>
      </div>
    </div>
  );
};

export default CrearJuegoView;