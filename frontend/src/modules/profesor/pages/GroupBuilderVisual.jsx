import React, { useState, useEffect } from 'react';
import { useProfesor } from '../components/ProfessorContext';

const GroupBuilderVisual = () => {
  const { juegos } = useProfesor();
  
  const [selectedGame, setSelectedGame] = useState('');
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupSettings, setGroupSettings] = useState({
    groupSize: 4,
    groupCount: 0,
    randomAssignment: true,
    balanceSkills: false
  });
  const [newStudentName, setNewStudentName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  // CSV related state
  const [csvFile, setCsvFile] = useState(null);
  const [parsedCsv, setParsedCsv] = useState([]);
  const [csvError, setCsvError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Datos de ejemplo de estudiantes
  const exampleStudents = [
    { id: 1, name: 'Ana García', skills: ['liderazgo', 'comunicación'], level: 'avanzado' },
    { id: 2, name: 'Luis Pérez', skills: ['técnico', 'análisis'], level: 'intermedio' },
    { id: 3, name: 'María López', skills: ['creatividad', 'diseño'], level: 'avanzado' },
    { id: 4, name: 'Carlos Ruiz', skills: ['organización', 'planificación'], level: 'básico' },
    { id: 5, name: 'Elena Torres', skills: ['comunicación', 'negociación'], level: 'intermedio' },
    { id: 6, name: 'Diego Morales', skills: ['técnico', 'innovación'], level: 'avanzado' },
    { id: 7, name: 'Sofia Hernández', skills: ['liderazgo', 'gestión'], level: 'intermedio' },
    { id: 8, name: 'Roberto Silva', skills: ['creatividad', 'presentación'], level: 'básico' },
    { id: 9, name: 'Valentina Castro', skills: ['análisis', 'investigación'], level: 'avanzado' },
    { id: 10, name: 'Andrés Vega', skills: ['comunicación', 'liderazgo'], level: 'intermedio' },
    { id: 11, name: 'Catalina Rojas', skills: ['creatividad', 'innovación'], level: 'básico' },
    { id: 12, name: 'Sebastián Muñoz', skills: ['técnico', 'organización'], level: 'avanzado' }
  ];

  useEffect(() => {
    setStudents(exampleStudents);
  }, []);

  const API_BASE = 'http://127.0.0.1:8000/api/';

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    for (let i = 0; i < 2; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    return segments.join('-');
  };

  const [roomCode] = useState(() => generateRoomCode());

  const handleCsvFileChange = (e) => {
    const file = e.target.files?.[0];
    setCsvFile(file);
    setCsvError('');
    setParsedCsv([]);
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          setCsvError('El archivo debe tener al menos 2 líneas (encabezados + datos)');
          return;
        }
        
        const delimiter = text.includes(';') ? ';' : ',';
        const headers = lines[0].split(delimiter).map(h => h.trim());
        
        const start = 1;
        const rows = [];
        for (let i = start; i < lines.length; i++) {
          const cols = lines[i].split(delimiter).map(c => c.trim());
          if (cols.length < headers.length) continue;
          const obj = {};
          headers.forEach((h, idx) => { obj[h] = cols[idx] || ''; });
          rows.push(obj);
        }
        if (!rows.length) {
          setCsvError('No se pudieron parsear filas');
        } else {
          setParsedCsv(rows);
        }
      } catch (err) {
        setCsvError('Error parseando CSV: ' + err.message);
      }
    };
    reader.onerror = () => setCsvError('No se pudo leer el archivo');
    reader.readAsText(file, 'UTF-8');
  };

  const sendCsvToBackend = async () => {
    if (!parsedCsv.length) return;
    setUploading(true);
    setCsvError('');
    try {
      const token = localStorage.getItem('token');
      const payload = {
        estudiantes: parsedCsv.map(e => ({
          correo: e.correo || e.email || '',
          rut: e.rut || '',
          nombre: e.nombre || '',
          apellido_paterno: e.apellido_paterno || e.apellido || '',
          apellido_materno: e.apellido_materno || ''
        }))
      };
      
      const resp = await fetch(API_BASE + 'estudiantes/bulk_create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Token ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || 'Error HTTP ' + resp.status);
      }
      
      const data = await resp.json();
      const mapped = data.estudiantes.map(est => ({
        id: est.id,
        name: `${est.nombre || ''} ${est.apellido || ''}`.trim(),
        skills: [],
        level: 'básico'
      }));
      
      setStudents(mapped);
      setGroups([]);
      setUploadResult({ total: data.total, nuevos: data.estudiantes.filter(e => e.nuevo).length });
    } catch (err) {
      setCsvError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const generatePreview = () => {
    if (students.length === 0) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
      const studentsPerGroup = Math.ceil(shuffledStudents.length / groupSettings.groupSize);
      const newGroups = [];
      const colors = [
        'bg-blue-500',
        'bg-green-500', 
        'bg-purple-500',
        'bg-red-500',
        'bg-yellow-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-orange-500'
      ];
      
      for (let i = 0; i < groupSettings.groupSize; i++) {
        const startIndex = i * studentsPerGroup;
        const endIndex = startIndex + studentsPerGroup;
        const groupStudents = shuffledStudents.slice(startIndex, endIndex);
        
        if (groupStudents.length > 0) {
          newGroups.push({
            id: i + 1,
            name: `Equipo ${i + 1}`,
            students: groupStudents,
            color: colors[i % colors.length]
          });
        }
      }
      
      setGroups(newGroups);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white mb-1">Constructor de Grupos - Nueva Interfaz</h1>
            <p className="text-blue-100">Organiza a los estudiantes en grupos para las actividades</p>
          </div>

          <div className="flex">
            {/* Left Panel - Configuration (4/12) */}
            <div className="w-4/12 bg-blue-50 p-6 border-r border-gray-200">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-4">Configuración de la Sesión</h2>
                
                {/* Contexto del Juego */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Contexto del Juego</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Año</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>2024</option>
                        <option>2025</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Campus</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Campus Principal</option>
                        <option>Campus Norte</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Carrera</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Ingeniería</option>
                        <option>Administración</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Carga de Datos */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Carga de Datos</h3>
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="text-gray-500 mb-2">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Seleccionar CSV</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvFileChange}
                      className="hidden"
                      id="csvUpload"
                    />
                    <label htmlFor="csvUpload" className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                      Examinar archivos
                    </label>
                    <div className="mt-2">
                      <label className="flex items-center text-xs text-gray-600">
                        <input type="checkbox" className="mr-2" />
                        Tiene encabezados?
                      </label>
                    </div>
                  </div>
                  {csvError && <p className="text-xs text-red-600 mt-2">{csvError}</p>}
                  {parsedCsv.length > 0 && (
                    <div className="text-xs text-gray-600 mt-2 flex items-center justify-between">
                      <span>{parsedCsv.length} filas parseadas</span>
                      <button
                        onClick={sendCsvToBackend}
                        disabled={uploading}
                        className="px-2 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 disabled:bg-gray-400"
                      >{uploading ? 'Enviando...' : 'Enviar'}</button>
                    </div>
                  )}
                </div>

                {/* Reglas de Agrupación */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Reglas de Agrupación</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-gray-600">Cant. Grupos</label>
                        <span className="text-sm font-medium text-gray-900">{groupSettings.groupSize}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        value={groupSettings.groupSize}
                        onChange={(e) => setGroupSettings(prev => ({...prev, groupSize: parseInt(e.target.value)}))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-gray-600">Tam. Grupo</label>
                        <span className="text-sm font-medium text-gray-900">{Math.ceil(students.length / groupSettings.groupSize)}</span>
                      </div>
                      <div className="text-xs text-gray-500">Calculado automáticamente</div>
                    </div>
                  </div>
                </div>

                {/* Botón Generar Vista Previa */}
                <button 
                  onClick={generatePreview}
                  disabled={isGenerating || students.length === 0}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400"
                >
                  {isGenerating ? 'Generando...' : 'Generar Vista Previa'}
                </button>
                
                {/* Estado de estudiantes */}
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>📊 Estudiantes cargados: {students.length}</p>
                  {groups.length > 0 && <p>👥 Grupos generados: {groups.length}</p>}
                  {uploadResult && (
                    <p className="text-green-600">✅ CSV cargado: {uploadResult.total} estudiantes</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Vista Previa de Sala (8/12) */}
            <div className="w-8/12 p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Vista Previa de Sala</h2>
                  <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                    CÓDIGO: {roomCode}
                  </div>
                </div>
                
                {/* Grid de equipos */}
                {groups.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {groups.map((group) => (
                      <div key={group.id} className={`${group.color} text-white rounded-lg shadow-md hover:shadow-lg transition-shadow`}>
                        <div className={`${group.color.replace('500', '600')} px-4 py-3 rounded-t-lg border-b border-opacity-20 border-white`}>
                          <h3 className="font-semibold text-lg">{group.name}</h3>
                          <p className="text-sm opacity-90">{group.students.length} integrantes</p>
                        </div>
                        <div className="p-4 space-y-2">
                          {group.students.map((student, index) => (
                            <div key={index} className="text-sm flex items-center">
                              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                              {student.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Equipos de ejemplo */}
                    {[1, 2, 3, 4].slice(0, groupSettings.groupSize).map((num) => (
                      <div key={num} className="bg-gray-300 text-gray-600 rounded-lg">
                        <div className="bg-gray-400 px-4 py-3 rounded-t-lg">
                          <h3 className="font-semibold">Equipo {num}</h3>
                          <p className="text-sm">Sin asignar</p>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="text-sm">Esperando generación...</div>
                          <div className="text-xs opacity-75">
                            {num === 1 && `Total estudiantes: ${students.length}`}
                            {num === 2 && `Grupos configurados: ${groupSettings.groupSize}`}
                            {num === 3 && "Presiona 'Generar Vista Previa'"}
                            {num === 4 && "para distribuir estudiantes"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Botón Confirmar */}
                <div className="text-center">
                  <button 
                    disabled={groups.length === 0}
                    className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold px-8 py-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:text-gray-500 text-lg"
                  >
                    {groups.length === 0 ? 'GENERA GRUPOS PRIMERO' : 'CONFIRMAR Y LANZAR JUEGO'}
                  </button>
                  
                  {groups.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      ✅ {groups.reduce((total, group) => total + group.students.length, 0)} estudiantes distribuidos en {groups.length} equipos
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupBuilderVisual;