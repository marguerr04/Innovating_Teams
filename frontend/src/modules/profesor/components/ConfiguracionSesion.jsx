import React from 'react';

const ConfiguracionSesion = ({ 
  groupSettings, 
  setGroupSettings, 
  students, 
  csvFile,
  csvError,
  parsedCsv,
  uploading,
  isGenerating,
  onCsvFileChange,
  onSendCsvToBackend,
  onGeneratePreview,
  uploadResult 
}) => {
  return (
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
              onChange={onCsvFileChange}
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
                onClick={onSendCsvToBackend}
                disabled={uploading}
                className="px-2 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 disabled:bg-gray-400"
              >{uploading ? 'Enviando...' : 'Enviar'}</button>
            </div>
          )}
        </div>

        {/* Reglas de Agrupación */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Reglas de Agrupación</h3>
          <div className="space-y-4">
            {/* Selector de cantidad de grupos */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-600">Cantidad de Grupos</label>
                <span className="text-sm font-medium text-gray-900">{groupSettings.groupCount}</span>
              </div>
              <select
                value={groupSettings.groupCount}
                onChange={(e) => setGroupSettings(prev => ({
                  ...prev, 
                  groupCount: parseInt(e.target.value),
                  groupSize: students.length > 0 ? Math.ceil(students.length / parseInt(e.target.value)) : 0
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value={1}>1 grupo</option>
                <option value={2}>2 grupos</option>
                <option value={3}>3 grupos</option>
                <option value={4}>4 grupos</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Máximo 4 grupos por sesión</p>
            </div>
            
            {/* Tamaño calculado */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-700">Estudiantes por grupo:</span>
                <span className="font-semibold text-blue-900">
                  ~{students.length > 0 ? Math.ceil(students.length / groupSettings.groupCount) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-blue-600 mt-1">
                <span>Total estudiantes: {students.length}</span>
                <span>En {groupSettings.groupCount} grupo{groupSettings.groupCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            {/* Opciones de asignación */}
            <div className="space-y-2">
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="balance-skills" className="ml-2 text-sm text-gray-700">
                  Balancear habilidades
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Generar Vista Previa */}
        <button 
          onClick={onGeneratePreview}
          disabled={isGenerating || students.length === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400"
        >
          {isGenerating ? 'Generando...' : 'Generar Vista Previa'}
        </button>
        
        {/* Estado de estudiantes */}
        <div className="mt-4 text-sm text-gray-600 space-y-2">
          <div className="flex justify-between items-center">
            <p>📊 Estudiantes cargados: {students.length}</p>
          </div>
          {uploadResult && (
            <p className="text-green-600 text-xs">✅ CSV cargado: {uploadResult.total} estudiantes ({uploadResult.nuevos} nuevos)</p>
          )}
          
          {/* Vista previa de estudiantes */}
          {students.length > 0 && (
            <div className="bg-white rounded-md p-3 border border-gray-200 max-h-32 overflow-y-auto">
              <p className="text-xs font-medium text-gray-700 mb-2">Vista previa:</p>
              <div className="space-y-1">
                {students.slice(0, 4).map((student, index) => (
                  <div key={student.id || index} className="flex items-center text-xs">
                    <div className={`w-4 h-4 rounded-full ${student.avatar || 'bg-blue-400'} flex items-center justify-center text-white text-xs mr-2`}>
                      {student.initials || student.nombre?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="text-gray-800">
                      {student.displayName || `${student.nombre || ''} ${student.apellido_paterno || ''}`.trim() || student.name || 'Sin nombre'}
                    </span>
                  </div>
                ))}
                {students.length > 4 && (
                  <p className="text-xs text-gray-500 mt-1">... y {students.length - 4} más</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionSesion;