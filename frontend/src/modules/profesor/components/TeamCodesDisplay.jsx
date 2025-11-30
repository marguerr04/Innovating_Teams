// Componente para mostrar los códigos de equipo en la sala de espera del profesor
import React from 'react';

const TeamCodesDisplay = ({ grupos }) => {
  if (!grupos || grupos.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
      <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
        🔑 Códigos de Equipo
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Comparte estos códigos con tus estudiantes. Cada equipo debe ingresar su código de 7 dígitos.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grupos.map((grupo, index) => (
          <div 
            key={grupo.codigo_equipo || index}
            className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {grupo.nombre_equipo || grupo.nombre_grupo || `Equipo ${index + 1}`}
                </p>
                <p className="text-3xl font-mono font-bold text-blue-600 tracking-wider">
                  {grupo.codigo_equipo}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {grupo.usuarios?.length || grupo.alumnos_asignados?.length || 0} integrantes
                </p>
              </div>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(grupo.codigo_equipo);
                  // Opcional: mostrar toast de confirmación
                }}
                className="ml-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                title="Copiar código"
              >
                📋
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          💡 <strong>Tip:</strong> Los estudiantes deben ir a la pantalla de inicio e ingresar el código de su equipo.
        </p>
      </div>
    </div>
  );
};

export default TeamCodesDisplay;
