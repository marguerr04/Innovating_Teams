import React, { useState } from 'react';
import { useProfesor } from '../components/ProfessorContext';

const PerfilView = () => {
  const { profesor, updateProfesor, setLoading } = useProfesor();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: profesor?.nombre || '',
    email: profesor?.email || '',
    telefono: profesor?.telefono || '',
    institucion: profesor?.institucion || '',
    especialidad: profesor?.especialidad || '',
    biografia: profesor?.biografia || '',
    configuracion: {
      notificacionesEmail: true,
      notificacionesApp: true,
      compartirEstadisticas: false,
      modoPrivado: false
    },
    ...profesor
  });
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  const especialidades = [
    'Emprendimiento',
    'Innovación',
    'Gestión Empresarial',
    'Marketing',
    'Tecnología',
    'Finanzas',
    'Recursos Humanos',
    'Otro'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleConfigChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      configuracion: {
        ...prev.configuracion,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    if (formData.telefono && !/^\+?[\d\s\-\(\)]+$/.test(formData.telefono)) {
      newErrors.telefono = 'El formato del teléfono no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateProfesor(formData);
      setIsEditing(false);
      setSaveMessage('Perfil actualizado correctamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error guardando perfil:', error);
      setSaveMessage('Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: profesor?.nombre || '',
      email: profesor?.email || '',
      telefono: profesor?.telefono || '',
      institucion: profesor?.institucion || '',
      especialidad: profesor?.especialidad || '',
      biografia: profesor?.biografia || '',
      configuracion: profesor?.configuracion || {
        notificacionesEmail: true,
        notificacionesApp: true,
        compartirEstadisticas: false,
        modoPrivado: false
      },
      ...profesor
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                {formData.nombre.charAt(0).toUpperCase() || 'P'}
              </div>
              <div className="ml-6 text-white">
                <h1 className="text-2xl font-bold">{formData.nombre || 'Profesor'}</h1>
                <p className="text-indigo-100">{formData.especialidad || 'Especialidad no definida'}</p>
                <p className="text-indigo-100">{formData.institucion || 'Institución no definida'}</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors"
              >
                Editar Perfil
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 transition-colors"
                >
                  Guardar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {saveMessage && (
          <div className={`px-8 py-3 ${
            saveMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            <p className="text-sm font-medium">{saveMessage}</p>
          </div>
        )}

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Personal */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Información Personal
              </h2>
              
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900">{formData.nombre || 'No especificado'}</p>
                )}
                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900">{formData.email || 'No especificado'}</p>
                )}
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+56 9 XXXX XXXX"
                  />
                ) : (
                  <p className="text-gray-900">{formData.telefono || 'No especificado'}</p>
                )}
                {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
              </div>

              <div>
                <label htmlFor="institucion" className="block text-sm font-medium text-gray-700 mb-2">
                  Institución
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="institucion"
                    value={formData.institucion}
                    onChange={(e) => handleInputChange('institucion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Universidad o institución"
                  />
                ) : (
                  <p className="text-gray-900">{formData.institucion || 'No especificado'}</p>
                )}
              </div>

              <div>
                <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidad
                </label>
                {isEditing ? (
                  <select
                    id="especialidad"
                    value={formData.especialidad}
                    onChange={(e) => handleInputChange('especialidad', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seleccionar especialidad</option>
                    {especialidades.map((esp) => (
                      <option key={esp} value={esp}>{esp}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{formData.especialidad || 'No especificado'}</p>
                )}
              </div>
            </div>

            {/* Información Adicional */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Información Adicional
              </h2>
              
              <div>
                <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-2">
                  Biografía
                </label>
                {isEditing ? (
                  <textarea
                    id="biografia"
                    rows={4}
                    value={formData.biografia}
                    onChange={(e) => handleInputChange('biografia', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Cuéntanos sobre tu experiencia y enfoque..."
                  />
                ) : (
                  <p className="text-gray-900">{formData.biografia || 'No especificado'}</p>
                )}
              </div>

              {/* Configuración de Notificaciones */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Notificaciones por Email</h4>
                      <p className="text-sm text-gray-500">Recibir actualizaciones por correo electrónico</p>
                    </div>
                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={() => handleConfigChange('notificacionesEmail', !formData.configuracion.notificacionesEmail)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.configuracion.notificacionesEmail ? 'bg-indigo-600' : 'bg-gray-200'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.configuracion.notificacionesEmail ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Notificaciones en App</h4>
                      <p className="text-sm text-gray-500">Recibir notificaciones push</p>
                    </div>
                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={() => handleConfigChange('notificacionesApp', !formData.configuracion.notificacionesApp)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.configuracion.notificacionesApp ? 'bg-indigo-600' : 'bg-gray-200'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.configuracion.notificacionesApp ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Compartir Estadísticas</h4>
                      <p className="text-sm text-gray-500">Permitir que otros vean estadísticas básicas</p>
                    </div>
                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={() => handleConfigChange('compartirEstadisticas', !formData.configuracion.compartirEstadisticas)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.configuracion.compartirEstadisticas ? 'bg-indigo-600' : 'bg-gray-200'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.configuracion.compartirEstadisticas ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Modo Privado</h4>
                      <p className="text-sm text-gray-500">Ocultar perfil de búsquedas públicas</p>
                    </div>
                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={() => handleConfigChange('modoPrivado', !formData.configuracion.modoPrivado)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.configuracion.modoPrivado ? 'bg-indigo-600' : 'bg-gray-200'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.configuracion.modoPrivado ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas del Profesor */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Estadísticas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">Juegos Creados</p>
                    <p className="text-2xl font-semibold text-blue-600">15</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">Estudiantes Impactados</p>
                    <p className="text-2xl font-semibold text-green-600">342</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-900">Horas de Juego</p>
                    <p className="text-2xl font-semibold text-purple-600">89</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilView;