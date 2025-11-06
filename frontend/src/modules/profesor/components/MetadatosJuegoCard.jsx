import React from 'react';

const MetadatosJuegoCard = ({ formData, handleInputChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E5E8C' }}>
        2. Metadatos del Juego
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año cursado
          </label>
          <select
            value={formData.anoCursado}
            onChange={(e) => handleInputChange('anoCursado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black"
            style={{ '--tw-ring-color': '#00B8A9' }}
          >
            <option value="" className="text-black">Selecciona (1-7)</option>
            <option value="1" className="text-black">1er Año</option>
            <option value="2" className="text-black">2do Año</option>
            <option value="3" className="text-black">3er Año</option>
            <option value="4" className="text-black">4to Año</option>
            <option value="5" className="text-black">5to Año</option>
            <option value="6" className="text-black">6to Año</option>
            <option value="7" className="text-black">7mo Año</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campus - Universidad
          </label>
          <select
            value={formData.universidad}
            onChange={(e) => handleInputChange('Campus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black"
            style={{ '--tw-ring-color': '#00B8A9' }}
          >
            <option value="sede-santiago" className="text-black">Campus santiago </option>
            <option value="sede-concepcion" className="text-black">Campus concepción</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carrera
          </label>
          <select
            value={formData.carrera}
            onChange={(e) => handleInputChange('carrera', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black"
            style={{ '--tw-ring-color': '#00B8A9' }}
          >
            <option value="" className="text-black">Selecciona carrera</option>
            <option value="ingenieria-civil" className="text-black">Ingeniería Civil</option>
            <option value="ingenieria-informatica" className="text-black">Ingeniería Informática</option>
            <option value="administracion" className="text-black">Administración de Empresas</option>
            <option value="psicologia" className="text-black">Psicología</option>
            <option value="medicina" className="text-black">Medicina</option>
            <option value="derecho" className="text-black">Derecho</option>
            <option value="arquitectura" className="text-black">Arquitectura</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MetadatosJuegoCard;