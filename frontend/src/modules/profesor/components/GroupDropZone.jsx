import React, { useState } from 'react';
import StudentChip from './StudentChip';

const GroupDropZone = ({ 
  group, 
  onDrop, 
  onDragOver, 
  onDragStart,
  isGenerating = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, group.id);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={onDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`
        ${group.color} text-white rounded-lg shadow-md transition-all duration-200
        min-h-[200px] relative
        ${isDragOver ? 'ring-4 ring-white ring-opacity-50 scale-105' : ''}
        ${isGenerating ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {/* Header del grupo */}
      <div className={`
        ${group.color.replace('500', '600')} px-4 py-3 rounded-t-lg 
        border-b border-opacity-20 border-white
      `}>
        <h3 className="font-semibold text-lg">{group.name}</h3>
        <p className="text-sm opacity-90">
          {group.students.length} integrante{group.students.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Zona de contenido */}
      <div className="p-4 space-y-2 min-h-[150px]">
        {group.students.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {group.students.map((student) => (
              <StudentChip
                key={student.id}
                student={student}
                onDragStart={onDragStart}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-white opacity-75">
              <div className="mb-2">
                <svg 
                  className="w-12 h-12 mx-auto mb-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
              </div>
              <p className="text-sm">
                Arrastra estudiantes aquí
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Indicador visual de zona activa */}
      {isDragOver && (
        <div className="absolute inset-0 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <div className="text-white text-lg font-semibold">
            ¡Soltar aquí!
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDropZone;