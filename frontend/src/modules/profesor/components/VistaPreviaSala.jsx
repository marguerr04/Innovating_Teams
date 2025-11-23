import React from 'react';
import DroppableTeamContainer from './DroppableTeamContainer';

const VistaPreviaSala = ({ 
  groups, 
  groupSettings, 
  students, 
  roomCode, 
  isGenerating,
  handleDragStart,
  handleDrop,
  handleDragOver,
  canDropInGroup
}) => {
  return (
    <div className="w-8/12 p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Vista Previa de Sala - Drag & Drop</h2>
          <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
            CÓDIGO: {roomCode}
          </div>
        </div>
        
        {/* Información de configuración */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="font-medium text-blue-800">
                📊 {students.length} estudiantes total
              </span>
              <span className="font-medium text-blue-800">
                🎯 {groupSettings.groupCount} grupos configurados
              </span>
              <span className="text-blue-600">
                👥 ~{Math.ceil(students.length / groupSettings.groupCount)} por grupo
              </span>
            </div>
            <div className="text-blue-600 text-xs">
              💡 Arrastra estudiantes entre grupos
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generando grupos...</p>
          </div>
        )}
        
        {/* Grid de equipos con Drag & Drop */}
        {!isGenerating && (
          <>
            {groups.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {groups.map((group) => (
                  <DroppableTeamContainer
                    key={group.id}
                    group={group}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                    canDrop={canDropInGroup ? canDropInGroup(group.id) : true}
                  />
                ))}
              </div>
              
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Array.from({ length: groupSettings.groupCount }, (_, index) => index + 1).map((num) => (
                  <div key={num} className="bg-gray-300 text-gray-600 rounded-lg min-h-[200px]">
                    <div className="bg-gray-400 px-4 py-3 rounded-t-lg">
                      <h3 className="font-semibold">Equipo {num}</h3>
                      <p className="text-sm">Sin asignar</p>
                    </div>
                    <div className="p-4 space-y-2 flex items-center justify-center h-32">
                      <div className="text-center">
                        <div className="text-sm mb-2">Esperando generación...</div>
                        <div className="text-xs opacity-75">
                          {num === 1 && `Total estudiantes: ${students.length}`}
                          {num === 2 && `Grupos configurados: ${groupSettings.groupCount}`}
                          {num === 3 && "Presiona 'Generar Vista Previa'"}
                          {num === 4 && "para distribuir estudiantes"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Estadísticas y acciones */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {groups.length > 0 ? (
                <div className="flex gap-4">
                  <span>✅ Estudiantes asignados: {groups.reduce((total, group) => total + group.students.length, 0)}</span>
                  <span>📋 Estudiantes sin asignar: {students.length - groups.reduce((total, group) => total + group.students.length, 0)}</span>
                </div>
              ) : (
                <span>⏳ Genera grupos para comenzar la asignación</span>
              )}
            </div>
            
            {groups.length > 0 && (
              <div className="text-xs text-blue-600">
                🔄 Reorganiza arrastrando chips entre grupos
              </div>
            )}
          </div>
        </div>
        
        {/* Botón Confirmar */}
        <div className="text-center">
          <button 
            disabled={groups.length === 0 || isGenerating}
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold px-8 py-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:text-gray-500 text-lg"
          >
            {groups.length === 0 ? 'GENERA GRUPOS PRIMERO' : 'CONFIRMAR Y LANZAR JUEGO'}
          </button>
          
          {groups.length > 0 && !isGenerating && (
            <p className="mt-2 text-sm text-gray-600">
              ✅ {groups.reduce((total, group) => total + group.students.length, 0)} estudiantes distribuidos en {groups.length} equipos
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VistaPreviaSala;