import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OptimizedVistaPreviaSala from '../components/OptimizedVistaPreviaSala';
import useOptimizedGroupBuilder from '../hooks/useOptimizedGroupBuilder';
import gameService from '../../../services/gameService';

const GroupBuilderOptimized = () => {
  const navigate = useNavigate();
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [gameError, setGameError] = useState(null);

  const {
    students,
    groups,
    groupSettings,
    isGenerating,
    parsedCsv,
    csvError,
    uploading,
    uploadResult,
    containers,
    
    setGroupSettings,
    
    handleCsvFileChange,
    sendCsvToBackend,
    generateAutoGroups,
    createEmptyGroups,
    handleDragEnd
  } = useOptimizedGroupBuilder();

  // Función para lanzar el juego y navegar a la sala de espera
  const handleLaunchGame = async () => {
    try {
      setIsCreatingGame(true);
      setGameError(null);
      
      console.log(' Iniciando proceso de creación del juego...');
      
      // Validar que haya grupos con estudiantes
      const gruposConEstudiantes = groups.filter(g => g.students && g.students.length > 0);
      
      if (gruposConEstudiantes.length === 0) {
        setGameError('Debes asignar al menos un estudiante a un grupo antes de crear el juego');
        setIsCreatingGame(false);
        return;
      }
      
      // Preparar los grupos en el formato correcto para el backend
      const gruposParaBackend = gruposConEstudiantes.map((grupo) => ({
        nombre: grupo.name,
        integrantes: grupo.students.map(estudiante => ({
          correo: estudiante.correo || estudiante.email,
          nombre: estudiante.nombre,
          apellido_paterno: estudiante.apellido_paterno || '',
          apellido_materno: estudiante.apellido_materno || '',
          rut: estudiante.rut || ''
        }))
      }));
      
      console.log(' Grupos preparados para backend:', gruposParaBackend);
      
      // Crear la partida con grupos en el backend
      const partidaCreada = await gameService.crearPartidaConGrupos(gruposParaBackend, {
        estado: 'CONFIGURACION'
      });
      
      console.log(' Partida creada exitosamente:', partidaCreada);
      
      // Navegar a la sala de espera con el PIN generado por el backend
      navigate(`/profesor/waiting-room/${partidaCreada.pin}`, {
        state: {
          partidaId: partidaCreada.id,
          pin: partidaCreada.pin,
          grupos: gruposParaBackend,
          totalEstudiantes: gruposParaBackend.reduce((sum, g) => sum + g.integrantes.length, 0)
        }
      });
      
    } catch (error) {
      console.error(' Error al crear el juego:', error);
      setGameError('Error al crear el juego: ' + error.message);
      setIsCreatingGame(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
          {/* Header compacto */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Constructor de Grupos
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row min-h-[500px]">
            {/* Panel de Configuración - 1/4 */}
            <div className="w-full lg:w-1/4 p-4 border-r border-gray-200 bg-gray-50">
              <div className="space-y-6">
                {/* Metadatos de la Sesión - PRIMERO */}
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                     Contexto del Juego
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>2024</option>
                        <option>2025</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Campus Santiago</option>
                        <option>Campus Concepción</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Ingeniería</option>
                        <option>Administración</option>
                        <option>Diseño</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Configuración de CSV - SEGUNDO */}
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                     Estudiantes
                  </h3>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Archivo CSV/Excel
                      </label>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleCsvFileChange}
                        className="w-full text-xs border border-gray-300 rounded p-1.5 focus:ring-1 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Correo, RUT, Nombre, Apellidos
                      </p>
                    </div>
                    
                    {csvError && (
                      <div className="bg-red-50 border border-red-200 rounded p-2">
                        <p className="text-xs text-red-600">{csvError}</p>
                      </div>
                    )}
                    
                    {uploadResult && (
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <p className="text-xs text-green-700">
                           {uploadResult.procesados || uploadResult.total} estudiantes
                          {uploadResult.backend && ` (${uploadResult.nuevos} nuevos)`}
                        </p>
                      </div>
                    )}
                    
                    {parsedCsv.length > 0 && (
                      <button
                        onClick={sendCsvToBackend}
                        disabled={uploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium disabled:bg-gray-400 transition-colors"
                      >
                        {uploading ? 'Enviando...' : 'Procesar'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Configuración de Grupos */}
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                     Agrupación
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Número de grupos */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-medium text-gray-700">Grupos</label>
                        <span className="text-xs font-medium text-gray-900">{groupSettings.groupCount}</span>
                      </div>
                      <select
                        value={groupSettings.groupCount}
                        onChange={(e) => {
                          const newCount = Math.min(4, parseInt(e.target.value));
                          // Solo crear grupos vacíos, NO redistribuir automáticamente
                          createEmptyGroups(newCount);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>1 grupo</option>
                        <option value={2}>2 grupos</option>
                        <option value={3}>3 grupos</option>
                        <option value={4}>4 grupos</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Máximo 4 grupos por sesión</p>
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
                    
                    {/* Botón redistribuir grupos */}
                    <button
                      onClick={generateAutoGroups}
                      disabled={isGenerating || students.length === 0}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 py-2 rounded text-xs font-medium disabled:bg-gray-400 transition-all duration-200"
                    >
                      {isGenerating ? (
                        <span className="flex items-center justify-center gap-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          Redistribuyendo...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1">
                           Redistribuir
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Estado de estudiantes */}
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                     Estado Actual
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Estudiantes cargados:</span>
                      <span className="font-medium text-gray-900">{students.length}</span>
                    </div>
                    
                    {uploadResult && (
                      <p className="text-green-600 text-xs"> CSV cargado: {uploadResult.total} estudiantes</p>
                    )}
                    
                    {/* Vista previa de estudiantes */}
                    {students.length > 0 && (
                      <div className="bg-gray-50 rounded-md p-3 border max-h-32 overflow-y-auto">
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
            </div>

            {/* Vista Previa Optimizada */}
            <div className="w-full lg:w-3/4 p-4 bg-white overflow-y-auto">
              {/* Mostrar mensaje de error si existe */}
              {gameError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3"></span>
                    <div>
                      <h3 className="text-red-800 font-semibold mb-1">Error al crear el juego</h3>
                      <p className="text-red-600 text-sm">{gameError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mostrar estado de carga si está creando el juego */}
              {isCreatingGame && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                    <div>
                      <h3 className="text-blue-800 font-semibold mb-1">Creando juego...</h3>
                      <p className="text-blue-600 text-sm">
                        Guardando grupos y estudiantes en la base de datos
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <OptimizedVistaPreviaSala 
                groups={groups}
                groupSettings={groupSettings}
                students={students}
                isGenerating={isGenerating}
                containers={containers}
                handleDragEnd={handleDragEnd}
                onLaunchGame={handleLaunchGame}
                isCreatingGame={isCreatingGame}
              />
            </div>
          </div>
          
          {/* Footer con información de optimización */}
          
        </div>
      </div>
    </div>
  );
};

export default GroupBuilderOptimized;