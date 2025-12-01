import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes, FaUser, FaBuilding } from 'react-icons/fa';

// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api';

// Función helper para hacer peticiones HTTP
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

const defaultAvatars = [
    { name: 'Andrés', url: '/avatars/andres.png' },
    { name: 'Camila', url: '/avatars/camila.png' },
    { name: 'Francisco', url: '/avatars/francisco.png' },
    { name: 'Martina', url: '/avatars/martina.png' },
];

const ChallengeAdmin = () => {
    // Estados principales para la data de la tabla
    const [challenges, setChallenges] = useState([]);
    const [themes, setThemes] = useState([]);
    const [people, setPeople] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados para la gestión de formularios
    const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
    const [isCreatingTheme, setIsCreatingTheme] = useState(false);
    const [newThemeName, setNewThemeName] = useState('');
    
    // Estados para la funcionalidad de Edición
    const [isEditing, setIsEditing] = useState(false);
    const [editingChallengeId, setEditingChallengeId] = useState(null);

    // Estado para manejar los datos del formulario (creación y edición)
    const [challengeFormData, setChallengeFormData] = useState({
        titulo: '',
        descripcion: '',
        contexto: '',
        tema_desafio: '',
        nombrepersona: '',
        edadpersona: '',
        persona_id: null, 
        avatar_url: '/avatars/default.png', 
    });
    
    // --- LÓGICA DE CARGA Y ESTADO ---

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            // Cargar todas las datos en paralelo
            const [challengesResponse, themesResponse, peopleResponse] = await Promise.all([
                apiRequest('/admin/desafios/'),
                apiRequest('/admin/temas/'),
                apiRequest('/admin/personas/')
            ]);
            
            // Los desafíos vienen en data.desafios debido a la paginación
            setChallenges(challengesResponse.data.desafios || []);
            setThemes(themesResponse.data || []);
            setPeople(peopleResponse.data || []);
            
        } catch (error) {
            console.error('Error cargando datos:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos. Verifique la conexión con el servidor.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // --- LÓGICA DE FORMULARIO COMÚN ---

    const handleChallengeChange = (e) => {
        const { name, value } = e.target;
        setChallengeFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarSelect = (url) => {
        setChallengeFormData(p => ({ 
            ...p, 
            avatar_url: url, 
            persona_id: null, // Si se elige un avatar, asumimos que es una nueva persona
        }));
    };
    
    const resetForm = () => {
        setChallengeFormData({
            titulo: '',
            descripcion: '',
            contexto: '',
            tema_desafio: '',
            nombrepersona: '',
            edadpersona: '',
            persona_id: null, 
            avatar_url: '/avatars/default.png', 
        });
        setIsCreatingChallenge(false);
        setIsEditing(false);
        setEditingChallengeId(null);
    };


    // --- LÓGICA DE CREACIÓN ---

    const handleCreatePersonaAndChallenge = async (e) => {
        e.preventDefault();
        
        if (!challengeFormData.tema_desafio) {
            Swal.fire('Error', 'Debe seleccionar un área de desafío.', 'error');
            return;
        }

        try {
            // Buscar la persona seleccionada o usar datos del formulario
            const personaData = challengeFormData.persona_id 
                ? people.find(p => p.id === challengeFormData.persona_id)
                : null;

            const desafioData = {
                titulo: challengeFormData.titulo,
                descripcion: challengeFormData.descripcion,
                contexto: challengeFormData.contexto,
                tema_desafio_id: parseInt(challengeFormData.tema_desafio),
                persona_id: personaData ? personaData.id : null,
                nombrepersona: challengeFormData.nombrepersona,
                edadpersona: parseInt(challengeFormData.edadpersona)
            };

            const response = await apiRequest('/admin/desafios/', {
                method: 'POST',
                body: JSON.stringify(desafioData)
            });
            
            Swal.fire('¡Éxito!', 'Desafío creado correctamente.', 'success');
            resetForm();
            fetchAllData();
            
        } catch (error) {
            console.error('Error creando desafío:', error);
            Swal.fire('Error', `No se pudo crear el desafío: ${error.message}`, 'error');
        }
    };

    // --- LÓGICA DE EDICIÓN (CARGAR DATOS) ---

    const handleEdit = (challenge) => {
        const personData = people.find(p => p.id === challenge.persona_id);

        // Cargar todos los datos al formulario usando los nombres correctos del backend
        setChallengeFormData({
            titulo: challenge.titulo,
            descripcion: challenge.descripcion,
            contexto: challenge.contexto || '',
            tema_desafio: challenge.tema_desafio_id,
            nombrepersona: challenge.nombrepersona || challenge.persona_nombre || '',
            edadpersona: challenge.edadpersona || '',
            persona_id: challenge.persona_id,
            avatar_url: personData ? personData.imagenurl : '/avatars/default.png',
        });
        
        setIsCreatingChallenge(true); // Abrir el formulario
        setIsEditing(true);           // Activar modo edición
        setEditingChallengeId(challenge.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- LÓGICA DE ACTUALIZACIÓN ---

    const handleUpdateChallenge = async (e) => {
        e.preventDefault();
        
        if (!challengeFormData.tema_desafio) {
            Swal.fire('Error', 'Debe seleccionar un área de desafío.', 'error');
            return;
        }

        try {
            const personaData = challengeFormData.persona_id 
                ? people.find(p => p.id === challengeFormData.persona_id)
                : null;

            const desafioData = {
                titulo: challengeFormData.titulo,
                descripcion: challengeFormData.descripcion,
                contexto: challengeFormData.contexto,
                tema_desafio_id: parseInt(challengeFormData.tema_desafio),
                persona_id: personaData ? personaData.id : null,
                nombrepersona: challengeFormData.nombrepersona,
                edadpersona: parseInt(challengeFormData.edadpersona)
            };

            const response = await apiRequest(`/admin/desafios/${editingChallengeId}/`, {
                method: 'PUT',
                body: JSON.stringify(desafioData)
            });
            
            Swal.fire('¡Éxito!', 'Desafío actualizado correctamente.', 'success');
            resetForm();
            fetchAllData();
            
        } catch (error) {
            console.error('Error actualizando desafío:', error);
            Swal.fire('Error', `No se pudo actualizar el desafío: ${error.message}`, 'error');
        }
    };

    // --- DISPATCHER DE FORMULARIO ---
    const handleSubmit = isEditing ? handleUpdateChallenge : handleCreatePersonaAndChallenge;

    // --- LÓGICA DE ELIMINACIÓN ---
    
    const handleDelete = (id, type) => {
        Swal.fire({
            title: `¿Estás seguro de eliminar el ${type}?`,
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const endpoint = type === 'Tema' ? `/admin/temas/${id}/` : `/admin/desafios/${id}/`;
                    
                    await apiRequest(endpoint, {
                        method: 'DELETE'
                    });
                    
                    Swal.fire('Eliminado!', `${type} ha sido eliminado correctamente.`, 'success');
                    fetchAllData();
                    
                } catch (error) {
                    console.error(`Error eliminando ${type}:`, error);
                    Swal.fire('Error', `No se pudo eliminar el ${type}: ${error.message}`, 'error');
                }
            }
        });
    };

    // --- LÓGICA DE TEMAS ---

    const handleCreateTheme = async () => {
        if (!newThemeName.trim()) {
            Swal.fire('Advertencia', 'El nombre del área no puede estar vacío.', 'warning');
            return;
        }
        
        try {
            const temaData = {
                nombretema: newThemeName.trim(),
                descripcion: 'Nueva área creada por el administrador'
            };
            
            await apiRequest('/admin/temas/', {
                method: 'POST',
                body: JSON.stringify(temaData)
            });
            
            Swal.fire('¡Éxito!', `Área "${newThemeName}" creada correctamente.`, 'success');
            setNewThemeName('');
            setIsCreatingTheme(false);
            fetchAllData();
            
        } catch (error) {
            console.error('Error creando tema:', error);
            Swal.fire('Error', `No se pudo crear el área: ${error.message}`, 'error');
        }
    };
    
    // --- RENDERIZADO ---

    if (isLoading) return <div className="text-center p-8 text-xl font-semibold text-indigo-500">Cargando gestión de desafíos...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Gestión de Desafíos</h1>
            <p className="text-sm text-green-600 mb-4">✅ Sistema CRUD completo - Gestión de desafíos y temas conectada con la base de datos PostgreSQL.</p>

            {/* SECCIÓN DE CREACIÓN/EDICIÓN */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-green-200">
                <h2 className="text-xl font-semibold mb-3 flex items-center text-green-600">
                    <FaPlus className="mr-2" />
                    {isEditing ? `Editando Desafío ID: ${editingChallengeId}` : 'Crear Nuevo Desafío'}
                </h2>
                
                {/* Botón para alternar formulario */}
                <button 
                    onClick={() => {
                        if (isEditing) { resetForm(); }
                        setIsCreatingChallenge(!isCreatingChallenge);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-sm mb-4 transition duration-200"
                >
                    {isEditing ? 'Cancelar Edición' : (isCreatingChallenge ? 'Ocultar Formulario' : 'Mostrar Formulario de Creación')}
                </button>

                {isCreatingChallenge && (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg bg-gray-50">
                        {/* Columna 1: Desafío Básico */}
                        <div className="col-span-1 border-r pr-4">
                            <h3 className="font-bold mb-3">Detalle del Desafío</h3>
                            <select 
                                name="tema_desafio" 
                                onChange={handleChallengeChange} 
                                value={challengeFormData.tema_desafio || ''} 
                                className="w-full p-2 border rounded mb-3 bg-white" 
                                required
                            >
                                <option value="">Seleccionar Área/Tema *</option>
                                {themes.map(t => (
                                    <option key={t.id} value={t.id}>{t.nombretema}</option>
                                ))}
                            </select>
                            <input type="text" name="titulo" placeholder="Título del Desafío *" value={challengeFormData.titulo} onChange={handleChallengeChange} className="w-full p-2 border rounded mb-3" required />
                            <textarea name="descripcion" placeholder="Descripción del Problema (Breve) *" value={challengeFormData.descripcion} onChange={handleChallengeChange} className="w-full p-2 border rounded mb-3 h-20" required />
                            <textarea name="contexto" placeholder="Contexto (Detalle del Problema) *" value={challengeFormData.contexto} onChange={handleChallengeChange} className="w-full p-2 border rounded mb-3 h-24" required />
                        </div>
                        
                        {/* Columna 2: Perfil de la Persona */}
                        <div className="col-span-1 border-r pr-4">
                            <h3 className="font-bold mb-3 flex items-center"><FaUser className="mr-1" /> Perfil de Persona</h3>
                            
                            {/* Selector de persona existente */}
                            <select 
                                name="persona_id" 
                                onChange={(e) => {
                                    const personaId = parseInt(e.target.value) || null;
                                    const persona = people.find(p => p.id === personaId);
                                    if (persona) {
                                        setChallengeFormData(prev => ({
                                            ...prev,
                                            persona_id: persona.id,
                                            nombrepersona: persona.nombre,
                                            edadpersona: persona.edad,
                                            avatar_url: persona.imagenurl || '/avatars/default.png'
                                        }));
                                    } else {
                                        setChallengeFormData(prev => ({
                                            ...prev,
                                            persona_id: null,
                                            nombrepersona: '',
                                            edadpersona: '',
                                            avatar_url: '/avatars/default.png'
                                        }));
                                    }
                                }}
                                value={challengeFormData.persona_id || ''} 
                                className="w-full p-2 border rounded mb-3 bg-white"
                            >
                                <option value="">Crear nueva persona...</option>
                                {people.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre} ({p.edad} años)</option>
                                ))}
                            </select>
                            
                            <input 
                                type="text" 
                                name="nombrepersona" 
                                placeholder="Nombre de la Persona *" 
                                value={challengeFormData.nombrepersona} 
                                onChange={handleChallengeChange} 
                                className="w-full p-2 border rounded mb-3" 
                                required 
                                disabled={challengeFormData.persona_id !== null}
                            />
                            <input 
                                type="number" 
                                name="edadpersona" 
                                placeholder="Edad de la Persona *" 
                                value={challengeFormData.edadpersona} 
                                onChange={handleChallengeChange} 
                                className="w-full p-2 border rounded mb-3" 
                                required 
                                disabled={challengeFormData.persona_id !== null}
                            />
                            
                            <h4 className="font-semibold mt-4 mb-2">Seleccionar Avatar</h4>
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {defaultAvatars.map(avatar => (
                                    <div 
                                        key={avatar.name} 
                                        onClick={() => handleAvatarSelect(avatar.url)}
                                        className={`p-1 border-2 rounded-full cursor-pointer transition ${challengeFormData.avatar_url === avatar.url ? 'border-blue-500 ring-2 ring-blue-500' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={avatar.url} alt={avatar.name} className="w-12 h-12 rounded-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Columna 3: Acciones */}
                        <div className="col-span-1">
                            <button 
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition duration-200"
                            >
                                <FaSave className="mr-2" /> {isEditing ? 'GUARDAR CAMBIOS' : 'FINALIZAR CREACIÓN'}
                            </button>
                            <p className="text-sm text-gray-500 mt-2">
                                {isEditing ? 'Actualiza el desafío en la base de datos.' : 'Crea un nuevo desafío y persona en la base de datos.'}
                            </p>
                        </div>
                    </form>
                )}
            </div>

            {/* Listado de Desafíos Existentes */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Desafíos Activos ({challenges.length})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persona</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {challenges.map((challenge) => (
                                <tr key={challenge.id} className={challenge.id === editingChallengeId ? 'bg-yellow-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{challenge.titulo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{challenge.tema_nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {challenge.nombrepersona || challenge.persona_nombre} 
                                        {challenge.edadpersona ? ` (${challenge.edadpersona})` : ''}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => handleEdit(challenge)} 
                                            className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                                            title="Editar Desafío"
                                            disabled={isEditing} // Deshabilita si ya estamos editando otro
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(challenge.id, 'Desafío')} 
                                            className="text-red-600 hover:text-red-900"
                                            title="Eliminar Desafío"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sección de Gestión de Áreas/Temas */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-8 border border-indigo-200">
                <h2 className="text-xl font-semibold mb-3 flex items-center text-indigo-600">
                    <FaBuilding className="mr-2" />
                    Gestión de Áreas/Temas
                </h2>
                <button 
                    onClick={() => setIsCreatingTheme(!isCreatingTheme)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg text-sm mb-4 transition duration-200"
                >
                    {isCreatingTheme ? 'Cancelar' : 'Crear Nueva Área'}
                </button>
                {isCreatingTheme && (
                    <div className="flex space-x-2">
                        <input 
                            type="text" 
                            placeholder="Nombre del Área (ej: Energía)" 
                            value={newThemeName}
                            onChange={(e) => setNewThemeName(e.target.value)}
                            className="flex-grow p-2 border rounded"
                        />
                        <button 
                            onClick={handleCreateTheme}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                        >
                            <FaSave />
                        </button>
                    </div>
                )}
                
                <ul className="space-y-1 mt-4">
                    <li className="font-bold text-gray-700 border-b pb-1">Áreas Activas ({themes.length}):</li>
                    {themes.map((theme) => (
                        <li key={theme.id} className="flex justify-between items-center text-sm">
                            <span>{theme.nombretema}</span>
                            <button onClick={() => handleDelete(theme.id, 'Tema')} className="text-red-500 hover:text-red-700 ml-4">
                                <FaTimes />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChallengeAdmin;