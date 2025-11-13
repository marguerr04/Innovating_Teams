import React from 'react';

const InformacionBasicaCard = ({ formData, handleInputChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E5E8C' }}>
        3. Información Básica
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Juego *
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            placeholder="Ej: Innovación Empresarial 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': '#00B8A9' }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => handleInputChange('descripcion', e.target.value)}
            placeholder="Describe el objetivo y contexto del juego..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 resize-none"
            style={{ '--tw-ring-color': '#00B8A9' }}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración (minutos) *
            </label>
            <input
              type="number"
              value={formData.duracion}
              onChange={(e) => handleInputChange('duracion', e.target.value)}
              min="15"
              max="300"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#00B8A9' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo de Participantes
            </label>
            <input
              type="number"
              value={formData.maxParticipantes}
              onChange={(e) => handleInputChange('maxParticipantes', e.target.value)}
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#00B8A9' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Juego *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.tipoJuego === 'colaborativo' 
                  ? 'border-2' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                borderColor: formData.tipoJuego === 'colaborativo' ? '#00B8A9' : undefined,
                backgroundColor: formData.tipoJuego === 'colaborativo' ? '#f0fdfa' : undefined
              }}
              onClick={() => handleInputChange('tipoJuego', 'colaborativo')}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🤝</div>
                <h4 className="font-semibold" style={{ color: '#2E5E8C' }}>Colaborativo</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Los estudiantes trabajan en equipo para resolver desafíos
                </p>
              </div>
            </div>

            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.tipoJuego === 'competitivo' 
                  ? 'border-2' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                borderColor: formData.tipoJuego === 'competitivo' ? '#00B8A9' : undefined,
                backgroundColor: formData.tipoJuego === 'competitivo' ? '#f0fdfa' : undefined
              }}
              onClick={() => handleInputChange('tipoJuego', 'competitivo')}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="font-semibold" style={{ color: '#2E5E8C' }}>Competitivo</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Los equipos compiten entre sí para obtener la mejor puntuación
                </p>
              </div>
            </div>

            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.tipoJuego === 'individual' 
                  ? 'border-2' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                borderColor: formData.tipoJuego === 'individual' ? '#00B8A9' : undefined,
                backgroundColor: formData.tipoJuego === 'individual' ? '#f0fdfa' : undefined
              }}
              onClick={() => handleInputChange('tipoJuego', 'individual')}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">👤</div>
                <h4 className="font-semibold" style={{ color: '#2E5E8C' }}>Individual</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Cada estudiante trabaja de forma independiente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformacionBasicaCard;