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

  // Generar display name estilo "m.guerrero"
  const generateDisplayName = (student) => {
    const firstName = student.nombre || student.name?.split(' ')[0] || '';
    const lastName = student.apellido_paterno || student.name?.split(' ')[1] || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0).toLowerCase()}.${lastName.toLowerCase()}`;
    }
    return student.displayName || student.name || 'usuario';
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
        
        {/* Display name estilo m.guerrero */}
        <div className="text-xs font-medium text-gray-900 leading-tight">
          {generateDisplayName(student)}
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

  // Versión normal (para grupos)
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center space-x-2 p-2 rounded-lg 
        cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95 shadow-lg' : 'hover:shadow-md'}
        bg-white border border-gray-200 hover:border-gray-300
      `}
    >
      {/* Avatar con iniciales */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold
        ${student.avatar || 'bg-gray-500'}
      `}>
        {student.initials}
      </div>
      
      {/* Información del estudiante */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {student.displayName || student.name}
        </p>
        {student.correo && (
          <p className="text-xs text-gray-500 truncate">
            {student.correo}
          </p>
        )}
      </div>
      
      {/* Indicador de drag más sutil */}
      <div className="flex flex-col space-y-0.5 opacity-50">
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default OptimizedStudentChip;