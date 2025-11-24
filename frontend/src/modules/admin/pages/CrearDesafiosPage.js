import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const CrearDesafiosPage = () => {
  // Las categorías se extraen del documento DESAFIOS.docx
  const areas = ['SALUD', 'EDUCACIÓN', 'SUSTENTABILIDAD'];

  const [challengeData, setChallengeData] = useState({
    area: '',
    titulo: '',
    descripcion: '',
    ejemploPersona: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallengeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica para asegurar que todos los campos estén llenos
    if (!challengeData.area || !challengeData.titulo || !challengeData.descripcion || !challengeData.ejemploPersona) {
      alert('Por favor, complete todos los campos para crear el desafío.');
      return;
    }

    // Aquí se manejaría la lógica para enviar los datos al backend (API)
    // console.log('Datos del nuevo Desafío a enviar:', challengeData);

    // Lógica de éxito: Resetear el formulario y mostrar un mensaje
    alert(`Desafío "${challengeData.titulo}" creado y listo para el juego!`);
    setChallengeData({
      area: '',
      titulo: '',
      descripcion: '',
      ejemploPersona: '',
    });
  };

  return (
    
    <AdminLayout>
      <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Crear Nuevo Desafío 🏆
      </h1>
      <p className="text-gray-600 mb-8">
        Utilice el siguiente formulario para definir un nuevo desafío. Asegúrese de seguir el formato de problema, contexto y persona.
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl">
        {/* Campo de Área (Categoría) */}
        <div className="mb-4">
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
            Área / Categoría del Desafío <span className="text-red-500">*</span>
          </label>
          <select
            id="area"
            name="area"
            value={challengeData.area}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            required
          >
            <option value="" disabled>Seleccione una área...</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Campo de Título del Desafío */}
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título del Desafío <span className="text-red-500">*</span> (Ej: Autogestión de tratamientos)
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={challengeData.titulo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            placeholder="Ingrese un título conciso y representativo"
            required
          />
        </div>

        {/* Campo de Descripción del Problema/Contexto */}
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Problema/Contexto <span className="text-red-500">*</span> (Ej: Muchos errores médicos y complicaciones...)
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="4"
            value={challengeData.descripcion}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            placeholder="Describa el problema social o de contexto en profundidad."
            required
          ></textarea>
        </div>

        {/* Campo de Ejemplo de Persona/Usuario */}
        <div className="mb-6">
          <label htmlFor="ejemploPersona" className="block text-sm font-medium text-gray-700 mb-1">
            Ejemplo de Persona/Usuario <span className="text-red-500">*</span> (Ej: Don Humberto de 50 años...)
          </label>
          <textarea
            id="ejemploPersona"
            name="ejemploPersona"
            rows="3"
            value={challengeData.ejemploPersona}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            placeholder="Presente un caso real de una persona que sufre el problema."
            required
          ></textarea>
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out shadow-md"
        >
          Crear Desafío y Subir al Juego
        </button>
      </form>
    </div>
    </AdminLayout>
  );
};

export default CrearDesafiosPage;