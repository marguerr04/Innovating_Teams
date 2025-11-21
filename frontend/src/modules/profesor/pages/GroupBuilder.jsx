import React, { useState, useEffect } from 'react';
import { useProfesor } from '../components/ProfessorContext';

const GroupBuilder = () => {
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
  const [parsedCsv, setParsedCsv] = useState([]); // raw parsed entries
  const [csvError, setCsvError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null); // resultado del backend
  const [backendStudentsRaw, setBackendStudentsRaw] = useState([]); // respuesta cruda del backend para verificación

  // Datos de ejemplo de estudiantes
  const exampleStudents = [
    { id: 1, name: 'Ana García', skills: ['liderazgo', 'comunicación'], level: 'avanzado' },
    { id: 2, name: 'Luis Pérez', skills: ['técnico', 'análisis'], level: 'intermedio' },
    { id: 3, name: 'María López', skills: ['creatividad', 'diseño'], level: 'avanzado' },
    { id: 4, name: 'Carlos Ruiz', skills: ['organización', 'planificación'], level: 'básico' },
    { id: 5, name: 'Elena Torres', skills: ['comunicación', 'negociación'], level: 'intermedio' },
    { id: 6, name: 'Diego Morales', skills: ['técnico', 'innovación'], level: 'avanzado' },
    { id: 7, name: 'Sofia Hernández', skills: ['liderazgo', 'gestión'], level: 'intermedio' },
    { id: 8, name: 'Roberto Silva', skills: ['creatividad', 'presentación'], level: 'básico' }
  ];

  useEffect(() => {
    setStudents(exampleStudents);
  }, []);

  const API_BASE = 'http://127.0.0.1:8000/api/';

  useEffect(() => {
    if (groupSettings.groupSize > 0 && students.length > 0) {
      const calculatedGroups = Math.ceil(students.length / groupSettings.groupSize);
      setGroupSettings(prev => ({ ...prev, groupCount: calculatedGroups }));
    }
  }, [groupSettings.groupSize, students.length]);

  const addStudent = () => {
    if (newStudentName.trim()) {
      const newStudent = {
        id: Date.now(),
        name: newStudentName.trim(),
        skills: [],
        level: 'básico'
      };
      setStudents(prev => [...prev, newStudent]);
      setNewStudentName('');
    }
  };

  // CSV Parsing (semicolon delimited to align backend expectation)
  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    setCsvError('');
    setParsedCsv([]);
    setCsvFile(file || null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvError('Seleccione un archivo .csv');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result.replace(/\r/g, '');
        const lines = text.split(/\n+/).filter(l => l.trim().length > 0);
        if (lines.length === 0) {
          setCsvError('Archivo vacío');
          return;
        }
        // Detect header if it contains typical column names
        const delimiter = ';';
        const firstCols = lines[0].split(delimiter).map(c => c.trim().toLowerCase());
        const expected = ['correo','rut','nombre','apellido paterno','apellido materno'];
        const headerPresent = expected.some(col => firstCols.some(fc => fc.includes(col.split(' ')[0])));
        let start = 0;
        let headers = ['correo','rut','nombre','apellido_paterno','apellido_materno'];
        if (headerPresent) {
          // Map header variations
          headers = firstCols.map(h => h
            .replace('apellido paterno','apellido_paterno')
            .replace('apellido materno','apellido_materno')
            .replace(/\s+/g,'_')
          );
          start = 1;
        }
        const rows = [];
        for (let i = start; i < lines.length; i++) {
          const cols = lines[i].split(delimiter).map(c => c.trim());
          if (cols.length < headers.length) continue; // skip malformed
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
      console.log('[CSV->Backend] Enviando payload', payload);
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
      console.log('[CSV->Backend] Respuesta', data);
      // Transform backend estudiantes to internal representation
      const mapped = data.estudiantes.map(est => ({
        id: est.id,
        name: `${est.nombre || ''} ${est.apellido || ''}`.trim(),
        skills: [],
        level: 'básico'
      }));
      setStudents(mapped);
      setGroups([]); // reset any existing groups
      setUploadResult({ total: data.total, nuevos: data.estudiantes.filter(e => e.nuevo).length });
      setBackendStudentsRaw(data.estudiantes || []);
    } catch (err) {
      setCsvError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeStudent = (studentId) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
    // Reorganizar grupos si ya están formados
    if (groups.length > 0) {
      generateGroups();
    }
  };

  const generateGroups = async () => {
    setIsGenerating(true);
    
    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let shuffledStudents = [...students];
    
    if (groupSettings.randomAssignment) {
      // Mezclar estudiantes aleatoriamente
      for (let i = shuffledStudents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledStudents[i], shuffledStudents[j]] = [shuffledStudents[j], shuffledStudents[i]];
      }
    } else if (groupSettings.balanceSkills) {
      // Algoritmo simple para balancear habilidades
      const beginners = shuffledStudents.filter(s => s.level === 'básico');
      const intermediate = shuffledStudents.filter(s => s.level === 'intermedio');
      const advanced = shuffledStudents.filter(s => s.level === 'avanzado');
      
      shuffledStudents = [];
      const maxLength = Math.max(beginners.length, intermediate.length, advanced.length);
      
      for (let i = 0; i < maxLength; i++) {
        if (beginners[i]) shuffledStudents.push(beginners[i]);
        if (intermediate[i]) shuffledStudents.push(intermediate[i]);
        if (advanced[i]) shuffledStudents.push(advanced[i]);
      }
    }

    // Formar grupos
    const newGroups = [];
    for (let i = 0; i < shuffledStudents.length; i += groupSettings.groupSize) {
      const groupMembers = shuffledStudents.slice(i, i + groupSettings.groupSize);
      newGroups.push({
        id: Math.floor(i / groupSettings.groupSize) + 1,
        name: `Grupo ${Math.floor(i / groupSettings.groupSize) + 1}`,
        members: groupMembers,
        color: getGroupColor(Math.floor(i / groupSettings.groupSize))
      });
    }
    
    setGroups(newGroups);
    setIsGenerating(false);
  };

  const getGroupColor = (index) => {
    const colors = [
      'bg-blue-100 border-blue-300',
      'bg-green-100 border-green-300',
      'bg-purple-100 border-purple-300',
      'bg-yellow-100 border-yellow-300',
      'bg-pink-100 border-pink-300',
      'bg-indigo-100 border-indigo-300',
      'bg-red-100 border-red-300',
      'bg-gray-100 border-gray-300'
    ];
    return colors[index % colors.length];
  };

  const exportGroups = () => {
    const groupData = groups.map(group => ({
      grupo: group.name,
      miembros: group.members.map(member => member.name).join(', ')
    }));
    
    const csvContent = [
      ['Grupo', 'Miembros'],
      ...groupData.map(row => [row.grupo, row.miembros])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grupos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetGroups = () => {
    setGroups([]);
  };

  return (
    <>
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Constructor de Grupos</h1>
          <p className="text-gray-600 mt-2">Organiza a tus estudiantes en grupos equilibrados para los juegos</p>
        </div>

        {/* Game Selection */}
        <div className="mb-8">
          <label htmlFor="game-select" className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Juego (Opcional)
          </label>
          <select
            id="game-select"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Configuración general</option>
            {juegos.map((juego) => (
              <option key={juego.id} value={juego.id}>
                {juego.nombre || `Juego ${juego.id}`}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Students Management */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Estudiantes</h2>

            {/* CSV Upload */}
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Importar desde CSV</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="w-full text-sm"
              />
              {csvError && <p className="text-xs text-red-600">{csvError}</p>}
              {parsedCsv.length > 0 && (
                <div className="text-xs text-gray-600 flex items-center justify-between">
                  <span>{parsedCsv.length} filas parseadas</span>
                  <button
                    onClick={sendCsvToBackend}
                    disabled={uploading}
                    className="px-2 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 disabled:bg-gray-400"
                  >{uploading ? 'Enviando...' : 'Enviar al backend'}</button>
                </div>
              )}
            </div>
            
            {/* Add Student */}
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                placeholder="Nombre del estudiante"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={addStudent}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Agregar
              </button>
            </div>

            {/* Students List */}
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-3">
                Estudiantes ({students.length})
              </h3>
              {uploadResult && (
                <p className="text-xs mb-2 text-green-700">
                  Backend recibió {uploadResult.total} registros (nuevos: {uploadResult.nuevos}).
                </p>
              )}
              {parsedCsv.length > 0 && students.length === exampleStudents.length && (
                <p className="text-xs text-orange-600 mb-2">CSV parseado listo, envíalo al backend para reemplazar la lista.</p>
              )}
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.level === 'avanzado' ? 'bg-green-100 text-green-800' :
                          student.level === 'intermedio' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {student.level}
                        </span>
                        {student.skills.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {student.skills.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeStudent(student.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Group Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de Grupos</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="group-size" className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño de Grupo
                </label>
                <input
                  type="number"
                  id="group-size"
                  min="2"
                  max="10"
                  value={groupSettings.groupSize}
                  onChange={(e) => setGroupSettings(prev => ({ ...prev, groupSize: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  Con {students.length} estudiantes y grupos de {groupSettings.groupSize}, 
                  se formarán <strong>{groupSettings.groupCount} grupos</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="random-assignment"
                    checked={groupSettings.randomAssignment}
                    onChange={(e) => setGroupSettings(prev => ({ 
                      ...prev, 
                      randomAssignment: e.target.checked,
                      balanceSkills: e.target.checked ? false : prev.balanceSkills
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="random-assignment" className="ml-2 text-sm text-gray-700">
                    Asignación aleatoria
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="balance-skills"
                    checked={groupSettings.balanceSkills}
                    onChange={(e) => setGroupSettings(prev => ({ 
                      ...prev, 
                      balanceSkills: e.target.checked,
                      randomAssignment: e.target.checked ? false : prev.randomAssignment
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="balance-skills" className="ml-2 text-sm text-gray-700">
                    Balancear habilidades
                  </label>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={generateGroups}
                  disabled={students.length === 0 || isGenerating}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? 'Generando...' : 'Generar Grupos'}
                </button>

                {groups.length > 0 && (
                  <>
                    <button
                      onClick={resetGroups}
                      className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Reiniciar Grupos
                    </button>
                    <button
                      onClick={exportGroups}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Exportar CSV
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Generated Groups */}
        {groups.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Grupos Generados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`border-2 rounded-lg p-4 ${group.color}`}
                >
                  <h3 className="font-semibold text-gray-900 mb-3">{group.name}</h3>
                  <div className="space-y-2">
                    {group.members.map((member, index) => (
                      <div key={member.id} className="flex items-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-medium mr-2">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-800">{member.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs text-gray-600">
                      {group.members.length} miembro{group.members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    {/* Sección de verificación backend */}
    {backendStudentsRaw.length > 0 && (
      <div className="max-w-6xl mx-auto mt-4 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verificación: Estudiantes recibidos del backend</h2>
        <p className="text-sm text-gray-600 mb-4">Esta tabla muestra exactamente lo que devolvió el endpoint <code>/api/estudiantes/bulk_create/</code>.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left border">#</th>
                <th className="px-3 py-2 text-left border">Correo</th>
                <th className="px-3 py-2 text-left border">Nombre</th>
                <th className="px-3 py-2 text-left border">Apellido</th>
                <th className="px-3 py-2 text-left border">RUT</th>
                <th className="px-3 py-2 text-left border">Nuevo?</th>
              </tr>
            </thead>
            <tbody>
              {backendStudentsRaw.map((est, idx) => (
                <tr key={est.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 border">{idx + 1}</td>
                  <td className="px-3 py-2 border whitespace-nowrap">{est.correo}</td>
                  <td className="px-3 py-2 border">{est.nombre}</td>
                  <td className="px-3 py-2 border">{est.apellido}</td>
                  <td className="px-3 py-2 border">{est.rut || '-'}</td>
                  <td className="px-3 py-2 border">{est.nuevo ? 'Sí' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">Total: {backendStudentsRaw.length} registros. Puedes reenviar otro CSV para actualizar esta vista.</p>
      </div>
    )}
    </>
  );
};

export default GroupBuilder;