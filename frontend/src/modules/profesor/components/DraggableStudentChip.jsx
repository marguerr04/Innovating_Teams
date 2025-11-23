import React from 'react';

const DraggableStudentChip = ({ student, onDragStart, isDragging = false }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, student)}
      className={`
        flex items-center space-x-2 p-2 rounded-lg border-2 border-dashed border-transparent
        cursor-move transition-all duration-200 hover:shadow-md
        ${isDragging ? 'opacity-50 scale-95' : 'hover:border-gray-300'}
        bg-white shadow-sm hover:shadow-lg
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
      
      {/* Indicador de drag */}
      <div className="flex flex-col space-y-0.5">
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default DraggableStudentChip;