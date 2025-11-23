import React from 'react';

const StudentChip = ({ student, onDragStart, isDragging = false }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, student)}
      className={`
        inline-flex items-center gap-2 px-3 py-2 m-1 bg-white rounded-full 
        border-2 border-gray-200 shadow-sm cursor-move transition-all duration-200
        hover:border-blue-300 hover:shadow-md
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}
    >
      {/* Avatar con iniciales */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
        ${student.avatar || 'bg-gray-400'}
      `}>
        {student.initials}
      </div>
      
      {/* Información del estudiante */}
      <div className="flex flex-col text-left">
        <span className="text-sm font-medium text-gray-800 leading-tight">
          {student.displayName}
        </span>
        {student.correo && (
          <span className="text-xs text-gray-500 leading-tight">
            {student.correo}
          </span>
        )}
      </div>
      
      {/* Indicador de arrastre */}
      <div className="text-gray-400">
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 9l4-4 4 4m0 6l-4 4-4-4" 
          />
        </svg>
      </div>
    </div>
  );
};

export default StudentChip;