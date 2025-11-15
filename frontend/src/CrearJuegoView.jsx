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

  const [grupos, setGrupos] = useState([]);
  const [csvRows, setCsvRows] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvError, setCsvError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setCsvRows([]);
    setCsvHeaders([]);
    setCsvError('');
    if (file && (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv'))) {
      setFormData(prev => ({ ...prev, archivoCSV: file }));
      parseCsvLocal(file, formData.tieneEncabezado);
    } else {
      alert('Por favor seleccione un archivo CSV válido');
    }
  };

  const parseCsvLocal = (file, hasHeader) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result.replace(/\r/g, '');
        if (!text.trim()) { setCsvError('Archivo vacío'); return; }
        const lines = text.split(/\n+/).filter(l => l.trim().length > 0);
        if (!lines.length) { setCsvError('Sin líneas válidas'); return; }
        const delimiter = ';';
        let headers = [];
        let startIndex = 0;
        if (hasHeader) {
          headers = lines[0].split(delimiter).map(h => h.trim().replace(/\s+/g, '_').toLowerCase());
          startIndex = 1;
        } else {
          headers = ['correo', 'rut', 'nombre', 'apellido_paterno', 'apellido_materno'];
        }
        const rows = [];
        for (let i = startIndex; i < lines.length; i++) {
          const cols = lines[i].split(delimiter).map(c => c.trim());
          if (cols.length < headers.length) continue;
          const obj = {};
          headers.forEach((h, idx) => { obj[h] = cols[idx] || ''; });
          rows.push(obj);
        }
        setCsvHeaders(headers);
        setCsvRows(rows);
        if (!rows.length) setCsvError('No se pudieron parsear filas válidas');
      } catch (err) {
        setCsvError('Error al parsear: ' + err.message);
      }
    };
    reader.onerror = () => setCsvError('No se pudo leer el archivo');
    reader.readAsText(file, 'UTF-8');
  };

  const crearRepartirGrupos = () => {
    if (!csvRows.length) {
      alert('Por favor cargue un archivo CSV válido antes de crear grupos.');
      return;
    }

    const estudiantes = csvRows.map(row => `${row.nombre} ${row.apellido_paterno}`);
    const gruposGenerados = [];
    const cantidadGrupos = formData.cantidadGrupos;
    const estudiantesPorGrupo = Math.ceil(estudiantes.length / cantidadGrupos);

    for (let i = 0; i < cantidadGrupos; i++) {
      gruposGenerados.push(estudiantes.slice(i * estudiantesPorGrupo, (i + 1) * estudiantesPorGrupo));
    }

    setGrupos(gruposGenerados);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#2E5E8C' }}>
          Crear Nuevo Juego
        </h1>
        <p className="text-gray-600">
          Configura un juego personalizado para tus estudiantes
        </p>
      </div>

      <ListaEquiposCard
        formData={formData}
        handleInputChange={handleInputChange}
        handleFileUpload={handleFileUpload}
        crearRepartirGrupos={crearRepartirGrupos}
      />

      <MetadatosJuegoCard
        formData={formData}
        handleInputChange={handleInputChange}
      />

      {grupos.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#2E5E8C' }}>Grupos Generados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grupos.map((grupo, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-bold text-blue-600 mb-2">Grupo {idx + 1}</h3>
                <ul className="list-disc pl-5">
                  {grupo.map((estudiante, i) => (
                    <li key={i} className="text-gray-700">{estudiante}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => navigate('/profesor/home')}
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