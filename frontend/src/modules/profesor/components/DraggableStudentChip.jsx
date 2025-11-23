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

  // Generar nombre compacto: solo nombre + apellido paterno
  const generateCompactName = (nombre, apellido_paterno) => {
    const n = nombre ? nombre.split(' ')[0] : '';
    const a = apellido_paterno ? apellido_paterno : '';
    return `${n} ${a}`.trim() || 'Estudiante';
  };

  const compactName = generateCompactName(student.nombre, student.apellido_paterno);

  if (compact) {
    // Diseño ultra-compacto - altura muy reducida
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`
          flex flex-col items-center p-1 rounded border cursor-move transition-all duration-200
          ${isDragging 
            ? 'opacity-50 scale-95 shadow-2xl z-50 bg-white border-blue-400' 
            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
          }
          min-h-[36px] w-full max-w-[120px] mx-auto
        `}
      >
        {/* Avatar circular muy pequeño */}
        <div className={`
          w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-semibold mb-0.5
          ${student.avatar || 'bg-blue-500'}
        `}>
          {student.initials}
        </div>
        
        {/* Solo nombre y apellido paterno */}
        <div className="text-center w-full px-0.5">
          <p className="text-xs font-medium text-gray-900 truncate leading-tight" title={`${student.nombre || ''} ${student.apellido_paterno || ''} ${student.apellido_materno || ''}`}>
            {compactName}
          </p>
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