import React, { useState } from 'react';

/**
 * Componente para mostrar y manejar grupos de estudiantes
 * Reutilizable entre diferentes vistas del profesor
 */
const GroupsDisplay = ({ 
  grupos, 
  onUpdateGroupName,
  allowEdit = true,
  showEditInput = true,
  viewMode = 'waiting', // waiting, playing, finished
  showGroupIdentifiers = false,
  getGroupIdentifier
}) => {
    const buildGroupIdentifier = (grupo, index) => {
      if (typeof getGroupIdentifier === 'function') {
        return getGroupIdentifier(grupo, index);
      }
      return grupo?.id ?? 'SIN-ID';
    };

  const [editingGroup, setEditingGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');

  // Helper para obtener miembros de manera segura (compatibilidad con diferentes estructuras)
  const getMiembros = (grupo) => {
    return grupo.miembros || grupo.integrantes || grupo.alumnos || [];
  };

  const getMaxIntegrantes = (grupo) => {
    return grupo.maxIntegrantes || grupo.max_integrantes || 10;
  };

  // Helper para obtener 3 letras iniciales del nombre
  const getInitials = (nombre) => {
    if (!nombre) return '???';
    const words = nombre.trim().split(' ');
    if (words.length >= 2) {
      // Si tiene 2 o más palabras, toma primera letra de las 3 primeras palabras
      return words.slice(0, 3).map(w => w.charAt(0).toUpperCase()).join('');
    }
    // Si es una sola palabra, toma las primeras 3 letras
    return nombre.substring(0, 3).toUpperCase();
  };

  const handleStartEdit = (grupo) => {
    setEditingGroup(grupo.id);
    setNewGroupName(grupo.nombre);
  };

  const handleSaveEdit = (groupId) => {
    if (newGroupName.trim() && onUpdateGroupName) {
      onUpdateGroupName(groupId, newGroupName.trim());
    }
    setEditingGroup(null);
    setNewGroupName('');
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setNewGroupName('');
  };

  const getGroupStatusColor = (grupo) => {
    const miembros = getMiembros(grupo);
    const maxIntegrantes = getMaxIntegrantes(grupo);
    
    const percentage = miembros.length / maxIntegrantes;
    if (percentage === 1) return 'border-green-500 bg-green-50';
    if (percentage >= 0.5) return 'border-yellow-500 bg-yellow-50';
    return 'border-gray-300 bg-white';
  };

  const getViewModeStyles = () => {
    switch (viewMode) {
      case 'playing':
        return 'shadow-lg border-2';
      case 'finished':
        return 'opacity-75 shadow-sm';
      default:
        return 'shadow-md border';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {grupos.map((grupo, index) => (
        <div 
          key={grupo.id} 
          className={`rounded-lg p-4 transition-all duration-200 ${getGroupStatusColor(grupo)} ${getViewModeStyles()}`}
        >
          {/* Header del grupo */}
          <div className="flex items-start justify-between mb-3">
            {editingGroup === grupo.id && showEditInput ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(grupo.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del grupo"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(grupo.id)}
                  className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {grupo.nombre}
                    {allowEdit && showEditInput && viewMode === 'waiting' && (
                      <button
                        onClick={() => handleStartEdit(grupo)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>
                    )}
                  </h3>
                  {showGroupIdentifiers && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      ID acceso: {buildGroupIdentifier(grupo, index)}
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    getMiembros(grupo).length === getMaxIntegrantes(grupo) ? 'bg-green-500' :
                    getMiembros(grupo).length > 0 ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></span>
                  {getMiembros(grupo).length}/{getMaxIntegrantes(grupo)}
                </span>
              </>
            )}
          </div>

          {/* Contenido del grupo - Chips diminutos con iniciales */}
          <div className="min-h-[60px]">
            {getMiembros(grupo).length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {getMiembros(grupo).map((miembro, idx) => (
                  <div 
                    key={idx} 
                    className="group relative inline-flex items-center"
                    title={miembro.nombre || 'Estudiante'}
                  >
                    {/* Chip diminuto con iniciales de 3 letras */}
                    <div className={`
                      px-2 py-1 rounded-full text-[10px] font-bold
                      flex items-center gap-1 transition-all duration-200
                      ${
                        viewMode === 'playing' 
                          ? miembro.conectado 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                            : 'bg-gray-400 text-white opacity-60'
                          : 'bg-blue-500 text-white'
                      }
                      hover:scale-105 cursor-pointer shadow-sm
                    `}>
                      {/* Iniciales de 3 letras */}
                      <span>{getInitials(miembro.nombre)}</span>
                      
                      {/* Indicador de conexión (solo en modo playing) */}
                      {viewMode === 'playing' && (
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          miembro.conectado ? 'bg-green-300' : 'bg-red-300'
                        }`}></div>
                      )}
                    </div>
                    
                    {/* Tooltip con nombre completo al hacer hover */}
                    <div className="
                      absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                      bg-gray-900 text-white text-xs px-2 py-1 rounded
                      opacity-0 group-hover:opacity-100 pointer-events-none
                      transition-opacity duration-200 whitespace-nowrap z-10
                    ">
                      {miembro.nombre || 'Estudiante'}
                      {viewMode === 'playing' && (
                        <span className="ml-2">
                          {miembro.conectado ? '🟢' : '🔴'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-xs">
                    {viewMode === 'waiting' ? 'Esperando estudiantes...' : 'Grupo vacío'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer con información adicional */}
          {viewMode === 'playing' && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Actividad actual: Colaboración</span>
                <span>Progreso: En curso</span>
              </div>
            </div>
          )}

          {/* Input para cambio rápido de nombre (versión simplificada) */}
          {!showEditInput && allowEdit && viewMode === 'waiting' && editingGroup !== grupo.id && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <input
                type="text"
                placeholder="Cambiar nombre del grupo..."
                defaultValue={grupo.nombre}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const newName = e.target.value.trim();
                    if (newName && onUpdateGroupName) {
                      onUpdateGroupName(grupo.id, newName);
                    }
                  }
                }}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupsDisplay;