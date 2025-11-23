import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const OptimizedStudentChip = ({ student, compact = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: student.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
  } : undefined;

  // Generar nombre compacto: solo nombre + apellido paterno
  const generateCompactName = (student) => {
    const firstName = student.nombre || student.name?.split(' ')[0] || '';
    const lastName = student.apellido_paterno || student.name?.split(' ')[1] || '';
    
    return `${firstName} ${lastName}`.trim() || student.displayName || student.name || 'Estudiante';
  };

  if (compact) {
    // Versión compacta estilo "sala de cine" - 5 por fila
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`
          flex flex-col items-center p-2 rounded-lg text-center
          cursor-grab active:cursor-grabbing
          transition-all duration-200
          ${isDragging ? 'opacity-50 scale-95 shadow-lg' : 'hover:shadow-md hover:scale-105'}
          bg-white border border-gray-200 hover:border-blue-300
          min-h-[64px]
        `}
      >
        {/* Avatar más pequeño */}
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1
          ${student.avatar || 'bg-gray-500'}
        `}>
          {student.initials}
        </div>
        
        {/* Nombre compacto */}
        <div className="text-xs font-medium text-gray-900 leading-tight">
          {generateCompactName(student)}
        </div>
        
        {/* Email truncado */}
        {student.correo && (
          <div className="text-xs text-gray-500 truncate w-full mt-0.5">
            {student.correo.length > 12 ? `${student.correo.substring(0, 12)}...` : student.correo}
          </div>
        )}
      </div>
    );
  }

  // Versión normal compacta horizontal (para grupos)
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center space-x-2 p-1.5 rounded border 
        cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95 shadow-lg' : 'hover:shadow-sm hover:border-blue-300'}
        bg-white border-gray-200
        min-h-[32px]
      `}
    >
      {/* Avatar pequeño */}
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0
        ${student.avatar || 'bg-blue-500'}
      `}>
        {student.initials}
      </div>
      
      {/* Solo nombre y apellido paterno */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-900 truncate" title={`${student.nombre || ''} ${student.apellido_paterno || ''} ${student.apellido_materno || ''}`}>
          {generateCompactName(student)}
        </p>
      </div>
      
      {/* Indicador de drag más pequeño */}
      <div className="flex flex-col space-y-0.5 opacity-40 flex-shrink-0">
        <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
        <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
        <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default OptimizedStudentChip;