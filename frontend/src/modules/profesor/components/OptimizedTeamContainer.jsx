import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import OptimizedStudentChip from './OptimizedStudentChip';

const OptimizedTeamContainer = ({ group }) => {
  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id: group.id,
  });

  const studentsCount = group.students.length;
  const maxSize = group.maxSize || 10;
  const isFull = studentsCount >= maxSize;
  const canAcceptMore = !isFull;

  return (
    <div 
      ref={setNodeRef}
      className={`
        relative rounded-lg border-2 transition-all duration-300 min-h-[140px]
        ${isOver && canAcceptMore ? 'border-green-400 bg-green-50 shadow-lg scale-105' : 
          isOver && !canAcceptMore ? 'border-red-400 bg-red-50' :
          'border-gray-200 bg-white shadow-sm hover:shadow-md'}
      `}
    >
      {/* Header del equipo */}
      <div className={`
        px-3 py-2 rounded-t-lg border-b-2 
        ${group.color} text-white
      `}>
        <h3 className="font-semibold text-base">{group.name}</h3>
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-xs opacity-90">
            {studentsCount} integrante{studentsCount !== 1 ? 's' : ''}
          </span>
          <span className={`
            text-xs px-2 py-0.5 rounded-full font-medium
            ${isFull ? 'bg-yellow-200 text-yellow-800' : 'bg-white/20 text-white'}
          `}>
            {studentsCount}/{maxSize}
          </span>
        </div>
      </div>
      
      {/* Contenido del equipo */}
      <div className="p-2">
        {/* Grid de estudiantes horizontal - 2 columnas */}
        <div className="grid grid-cols-2 gap-1 mb-3">
          {group.students.map((student) => (
            <OptimizedStudentChip
              key={student.id}
              student={student}
            />
          ))}
        </div>
        
        {/* Área de drop cuando está vacío */}
        {studentsCount === 0 && (
          <div className={`
            border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200
            ${isOver ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'}
          `}>
            <div className="text-gray-500">
              <div className="text-xl mb-1">👥</div>
              <p className="text-xs font-medium">Arrastra estudiantes aquí</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Máximo {maxSize} estudiantes
              </p>
            </div>
          </div>
        )}
        

        
        {/* Indicador de equipo lleno */}
        {isFull && !isOver && (
          <div className="mt-2 text-center">
            <span className="text-xs text-yellow-700 bg-yellow-200 px-3 py-1 rounded-full font-medium">
              ⚠ Equipo completo ({studentsCount}/{maxSize})
            </span>
          </div>
        )}
      </div>
      
      {/* Mensaje discreto de drop abajo */}
      {isOver && (
        <div className="mt-2 text-center">
          <div className={`
            text-sm font-medium px-3 py-1 rounded-full transition-all duration-200
            ${canAcceptMore ? 
              'text-green-700 bg-green-100 border border-green-300' : 
              'text-red-700 bg-red-100 border border-red-300'
            }
          `}>
            {canAcceptMore ? '✓ Listo para recibir estudiante' : '✗ Equipo completo, no puede recibir más'}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedTeamContainer;