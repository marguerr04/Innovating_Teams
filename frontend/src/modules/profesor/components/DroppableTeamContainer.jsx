import React, { useState } from 'react';
import DraggableStudentChip from './DraggableStudentChip';

const DroppableTeamContainer = ({ 
  group, 
  onDrop, 
  onDragOver, 
  onDragStart,
  canDrop = true 
}) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    if (canDrop) {
      setIsDraggedOver(true);
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggedOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggedOver(false);
    if (canDrop) {
      onDrop(e, group.id);
    }
  };

  const studentsCount = group.students.length;
  const maxSize = group.maxSize || 10;
  const isFull = studentsCount >= maxSize;
  
  return (
    <div 
      className={`
        relative rounded-lg border-2 transition-all duration-200 min-h-[200px]
        ${isDraggedOver && canDrop ? 'border-green-400 bg-green-50' : 
          isDraggedOver ? 'border-red-400 bg-red-50' :
          'border-gray-200 bg-white'}
        ${isFull ? 'bg-yellow-50' : ''}
      `}
      onDragOver={onDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header del equipo */}
      <div className={`
        px-4 py-3 rounded-t-lg border-b-2 
        ${group.color} text-white
      `}>
        <h3 className="font-semibold text-lg">{group.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm opacity-90">
            {studentsCount} integrante{studentsCount !== 1 ? 's' : ''}
          </span>
          <span className={`
            text-xs px-2 py-1 rounded-full
            ${isFull ? 'bg-yellow-200 text-yellow-800' : 'bg-white/20 text-white'}
          `}>
            {studentsCount}/{maxSize}
          </span>
        </div>
      </div>
      
      {/* Contenido del equipo */}
      <div className="p-4">
        {/* Lista de estudiantes */}
        <div className="space-y-2 mb-4">
          {group.students.map((student) => (
            <DraggableStudentChip
              key={student.id}
              student={student}
              onDragStart={onDragStart}
            />
          ))}
        </div>
        
        {/* Área de drop */}
        {studentsCount === 0 && (
          <div className={`
            border-2 border-dashed rounded-lg p-6 text-center
            ${isDraggedOver && canDrop ? 'border-green-400 bg-green-50' :
              isDraggedOver ? 'border-red-400 bg-red-50' :
              'border-gray-300 bg-gray-50'}
          `}>
            <div className="text-gray-500">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-sm">Arrastra estudiantes aquí</p>
            </div>
          </div>
        )}
        
        {/* Indicadores de estado - MENOS INVASIVO */}
        {isDraggedOver && (
          <div className={`
            absolute top-2 right-2 px-3 py-1 rounded-full shadow-md font-semibold text-sm
            ${canDrop ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
          `}>
            {canDrop ? '✓ Soltar' : '✗ Lleno'}
          </div>
        )}
        
        {isFull && !isDraggedOver && (
          <div className="absolute top-2 right-2">
            <span className="text-xs text-orange-700 bg-orange-200 px-2 py-1 rounded-full shadow-sm">
              ⚠ Completo
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DroppableTeamContainer;