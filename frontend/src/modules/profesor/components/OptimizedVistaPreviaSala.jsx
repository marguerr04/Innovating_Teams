import React from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, useDroppable } from '@dnd-kit/core';
import OptimizedTeamContainer from './OptimizedTeamContainer';
import DraggableStudentChip from './DraggableStudentChip';

// Componente para zona de drop de estudiantes sin asignar
const UnassignedStudentsZone = ({ students }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
  });
  
  return (
    <div 
      ref={setNodeRef}
      className={`
        mb-6 transition-all duration-200
        ${isOver ? 'scale-102' : ''}
      `}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        📋 Estudiantes sin asignar ({students.length})
        {isOver && <span className="ml-2 text-blue-600 animate-pulse">← Soltar aquí</span>}
      </h3>
      
      {students.length === 0 ? (
        // Estado placeholder mejorado con líneas punteadas
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
          <div className="text-center text-gray-500">
            <div className="grid grid-cols-5 gap-3 mb-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200/50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 bg-gray-300/70 rounded-full mb-1"></div>
                  <div className="w-8 h-1 bg-gray-300/50 rounded"></div>
                </div>
              ))}
            </div>
            <div className="w-12 h-12 border-2 border-dashed border-gray-400 rounded-full mb-3 mx-auto flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <p className="text-sm font-medium">Lista de estudiantes en espera</p>
            <p className="text-xs mt-1">Carga un archivo CSV para comenzar</p>
          </div>
        </div>
      ) : (
        // Lista real de estudiantes - 5 por fila con chips compactos
        <div className={`
          bg-gray-50 rounded-lg p-4 border-2 border-dashed transition-all duration-200
          ${isOver ? 'border-blue-400 bg-blue-50 shadow-lg' : 'border-gray-300'}
        `}>
          <div className="grid grid-cols-5 gap-3">
            {students.map((student) => (
              <DraggableStudentChip
                key={student.id}
                id={student.id}
                student={student}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const OptimizedVistaPreviaSala = ({ 
  groups, 
  groupSettings, 
  students, 
  roomCode, 
  isGenerating,
  containers,
  handleDragEnd
}) => {
  // Configurar sensores para mejor UX
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requiere arrastrar 8px antes de activar
      },
    })
  );

  const [activeId, setActiveId] = React.useState(null);
  const activeStudent = React.useMemo(() => {
    if (!activeId) return null;
    
    // Buscar el estudiante activo en todos los contenedores
    for (const containerId in containers) {
      const found = containers[containerId].find(s => s.id === activeId);
      if (found) return found;
    }
    return null;
  }, [activeId, containers]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEndWrapper = (event) => {
    setActiveId(null);
    handleDragEnd(event);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndWrapper}
    >
      <div className="w-full lg:w-2/3 p-6">
        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Generando grupos optimizados...</p>
            <p className="text-gray-500 text-sm">Distribuyendo estudiantes inteligentemente</p>
          </div>
        )}
        
        {/* Lista de estudiantes sin asignar con zona de drop */}
        {!isGenerating && (
          <UnassignedStudentsZone 
            students={containers.unassigned || []}
          />
        )}
          
          {/* Grid de equipos optimizado */}
          {!isGenerating && (
            <>
              {groups.length > 0 ? (
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {groups.map((group) => (
                    <OptimizedTeamContainer
                      key={group.id}
                      group={group}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Array.from({ length: groupSettings.groupCount }, (_, index) => index + 1).map((num) => (
                    <div key={num} className="bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg min-h-[200px]">
                      <div className="bg-gray-200 px-4 py-3 rounded-t-lg">
                        <h3 className="font-semibold">Equipo {num}</h3>
                        <p className="text-sm">Esperando configuración...</p>
                      </div>
                      <div className="p-6 flex items-center justify-center h-32">
                        <div className="text-center">
                          <div className="text-3xl mb-2">🎯</div>
                          <div className="text-sm font-medium">Presiona 'Generar Vista Previa'</div>
                          <div className="text-xs text-gray-500 mt-1">para distribuir estudiantes</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          
          {/* Estadísticas avanzadas */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {groups.length > 0 ? (
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <span className="font-semibold text-green-600">✅ Asignados:</span>
                      <span className="ml-1">{groups.reduce((total, group) => total + group.students.length, 0)}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-orange-600">📋 Sin asignar:</span>
                      <span className="ml-1">{containers.unassigned?.length || 0}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-600">📊 Distribución:</span>
                      <span className="ml-1">{groups.map(g => g.students.length).join('-')}</span>
                    </div>
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    ⏳ <span className="font-medium">Genera grupos para comenzar la asignación optimizada</span>
                  </span>
                )}
              </div>
              
              {groups.length > 0 && (
                <div className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  🔄 Arrastra chips entre grupos fácilmente
                </div>
              )}
            </div>
          </div>
          
          {/* Botón Confirmar mejorado */}
          <div className="text-center">
            <button 
              disabled={groups.length === 0 || isGenerating}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 font-bold px-10 py-4 rounded-xl transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
            >
              {groups.length === 0 ? (
                <span className="flex items-center gap-2">
                  🎯 <span>GENERA GRUPOS PRIMERO</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🚀 <span>CONFIRMAR Y LANZAR JUEGO</span>
                </span>
              )}
            </button>
            
            {groups.length > 0 && !isGenerating && (
              <p className="mt-3 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-2">
                ✅ <span className="font-semibold">{groups.reduce((total, group) => total + group.students.length, 0)} estudiantes</span> distribuidos en <span className="font-semibold">{groups.length} equipos</span> usando tecnología optimizada
              </p>
            )}
          </div>
        </div>
        
        {/* DragOverlay para mejor UX visual */}
        <DragOverlay>
          {activeStudent ? (
            <div className="transform rotate-3 scale-105 opacity-90">
              <DraggableStudentChip 
                id={activeStudent.id}
                student={activeStudent} 
                compact={true}
              />
            </div>
          ) : null}
        </DragOverlay>
    </DndContext>
  );
};

export default OptimizedVistaPreviaSala;