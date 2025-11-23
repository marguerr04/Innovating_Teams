import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DraggableStudentChip = ({ id, student, compact = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
  } : {};

  // Generar nombre corto: primera letra nombre + punto + apellido
  const generateShortName = (nombre, apellido) => {
    const n = nombre ? nombre.charAt(0).toLowerCase() : '';
    const a = apellido ? apellido.toLowerCase() : '';
    return `${n}.${a}`;
  };

  const shortName = generateShortName(student.nombre, student.apellido_paterno);

  if (compact) {
    // Diseño compacto tipo sala de cine - 5 por fila
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`
          flex flex-col items-center p-2 rounded-lg border cursor-move transition-all duration-200
          ${isDragging 
            ? 'opacity-50 scale-95 shadow-2xl z-50 bg-white border-blue-400' 
            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
          }
          min-h-[60px] w-full
        `}
      >
        {/* Avatar circular */}
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold mb-1
          ${student.avatar || 'bg-blue-500'}
        `}>
          {student.initials}
        </div>
        
        {/* Nombre corto */}
        <div className="text-center w-full">
          <p className="text-xs font-medium text-gray-900 truncate">
            {shortName}
          </p>
          {student.correo && (
            <p className="text-[10px] text-gray-500 truncate">
              {student.correo}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Diseño completo tradicional
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center space-x-3 p-3 rounded-lg border cursor-move transition-all duration-200
        ${isDragging 
          ? 'opacity-50 scale-95 shadow-2xl z-50 bg-white border-blue-400' 
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
        }
      `}
    >
      {/* Avatar con iniciales */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold
        ${student.avatar || 'bg-blue-500'}
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
    </div>
  );
};

export default DraggableStudentChip;