import React from 'react';

const ListaEquiposCard = ({ 
  formData, 
  handleInputChange, 
  handleFileUpload, 
  crearRepartirGrupos, 
  reiniciarFormulario, 
  gruposCreados 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E5E8C' }}>
        1. Lista y Equipos (CSV)
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lado izquierdo - Upload CSV */}
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo CSV
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csvFile"
              />
              <label
                htmlFor="csvFile"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Elegir archivo
              </label>
              <span className="text-sm text-gray-500">
                {formData.archivoCSV ? formData.archivoCSV.name : 'No se eligió archivo'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Se toma la primera columna del archivo CSV.
            </p>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.tieneEncabezado}
                onChange={(e) => handleInputChange('tieneEncabezado', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Mi archivo tiene encabezado</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad de grupos
              </label>
              <input
                type="number"
                value={formData.cantidadGrupos}
                onChange={(e) => handleInputChange('cantidadGrupos', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#00B8A9' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamaño por grupo
              </label>
              <input
                type="text"
                value={formData.tamanoGrupo}
                onChange={(e) => handleInputChange('tamanoGrupo', e.target.value)}
                placeholder="opcional"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-gray-500"
                style={{ '--tw-ring-color': '#00B8A9' }}
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Si defines <strong>Tamaño por grupo</strong>, se ignorará "Cantidad de grupos".
          </p>
        </div>

        {/* Lado derecho - Configuración */}
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modo
            </label>
            <select
              value={formData.modo}
              onChange={(e) => handleInputChange('modo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#00B8A9' }}
            >
              <option value="aleatoria">Aleatoria (balanceada)</option>
              <option value="manual">Manual</option>
              <option value="habilidades">Por habilidades</option>
            </select>
          </div>

          <button
            onClick={crearRepartirGrupos}
            className="w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 mb-4"
            style={{ backgroundColor: '#00B8A9' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#00a396'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#00B8A9'}
          >
            Crear / Repartir
          </button>

          <button
            onClick={reiniciarFormulario}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Reiniciar
          </button>

          {/* Lista de estudiantes */}
          <div className="mt-6">
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Estudiantes sin asignar
              </h4>
              <div className="text-center text-gray-500">
                <span className="text-2xl font-bold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!gruposCreados && (
        <div className="mt-4 p-3 rounded-md" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
          <p className="text-sm">
            Aún no has creado los grupos.
          </p>
        </div>
      )}
    </div>
  );
};

export default ListaEquiposCard;