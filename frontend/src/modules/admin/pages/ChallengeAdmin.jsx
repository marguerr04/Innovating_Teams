import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes, FaUser, FaBuilding } from 'react-icons/fa';

// --- MOCK DATA SIMULADA PARA TESTING DE FRONTEND ---
// Usamos 'let' para simular la mutabilidad que tendríamos con una base de datos real
let mockThemes = [
    { id: 1, nombretema: 'Educación', descripcion: 'Temas relacionados con el aprendizaje', estado: 'activo' },
    { id: 2, nombretema: 'Sustentabilidad', descripcion: 'Temas medioambientales', estado: 'activo' },
    { id: 3, nombretema: 'Salud', descripcion: 'Temas de bienestar', estado: 'activo' },
];

let mockPeople = [
    { id: 101, nombrepersona: 'Juanita Pérez', edad: 45, contextopersona: 'Madre soltera en busca de un trabajo flexible', imagenurl: '/avatars/juana.png' },
    { id: 102, nombrepersona: 'Roberto Gómez', edad: 22, contextopersona: 'Estudiante con problemas de motivación', imagenurl: '/avatars/osvaldo.png' },
];

let mockChallenges = [
    { id: 1001, titulo: 'Mejorar acceso a talleres online', descripcion: 'Problema de acceso a internet', contexto: 'El 80% de los estudiantes de zonas rurales tiene baja conectividad.', tema_desafio: 1, tema_desafio_nombre: 'Educación', persona: 101, persona_nombre: 'Juanita Pérez', edadpersona: 45 },
    { id: 1002, titulo: 'Reducir el desperdicio de agua', descripcion: 'El consumo promedio es alto.', contexto: 'Los habitantes no tienen conciencia del uso responsable del agua.', tema_desafio: 2, tema_desafio_nombre: 'Sustentabilidad', persona: 102, persona_nombre: 'Roberto Gómez', edadpersona: 22 },
];
// ----------------------------------------------------

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

    const fetchAllData = () => {
        setIsLoading(true);
        // Simula la latencia de red con un setTimeout
        setTimeout(() => {
            // Se usa [...mockX] para obtener una copia y forzar el re-renderizado
            setChallenges([...mockChallenges]); 
            setThemes([...mockThemes]);
            setPeople([...mockPeople]);
            setIsLoading(false);
        }, 300); 
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


    // --- LÓGICA DE CREACIÓN (MOCK) ---

    const handleCreatePersonaAndChallenge = (e) => {
        e.preventDefault();
        
        // Generar IDs y encontrar tema seleccionado
        const newPersonaId = Math.max(...mockPeople.map(p => p.id), 102) + 1;
        const newChallengeId = Math.max(...mockChallenges.map(c => c.id), 1002) + 1;
        const temaSeleccionado = mockThemes.find(t => t.id === parseInt(challengeFormData.tema_desafio));

        if (!temaSeleccionado) {
            Swal.fire('Error', 'Debe seleccionar un área de desafío.', 'error');
            return;
        }

        // Simular la creación de la Persona
        const newPersona = {
            id: newPersonaId,
            nombrepersona: challengeFormData.nombrepersona || 'Persona por defecto',
            edad: challengeFormData.edadpersona || 30,
            contextopersona: challengeFormData.contexto, 
            imagenurl: challengeFormData.avatar_url,
        };
        mockPeople.push(newPersona);

        // Simular la creación del Desafío
        const newChallenge = {
            id: newChallengeId,
            titulo: challengeFormData.titulo,
            descripcion: challengeFormData.descripcion,
            contexto: challengeFormData.contexto,
            tema_desafio: parseInt(challengeFormData.tema_desafio),
            tema_desafio_nombre: temaSeleccionado.nombretema,
            persona: newPersonaId,
            persona_nombre: newPersona.nombrepersona,
            edadpersona: newPersona.edad,
        };
        mockChallenges.push(newChallenge);
        
        Swal.fire('¡Éxito!', 'Desafío creado *SIMULADO* correctamente.', 'success');
        resetForm();
        fetchAllData(); 
    };

    // --- LÓGICA DE EDICIÓN (CARGAR DATOS) ---

    const handleEdit = (challenge) => {
        const personData = people.find(p => p.id === challenge.persona);

        // Cargar todos los datos al formulario
        setChallengeFormData({
            titulo: challenge.titulo,
            descripcion: challenge.descripcion,
            contexto: challenge.contexto,
            tema_desafio: challenge.tema_desafio,
            nombrepersona: challenge.persona_nombre,
            edadpersona: challenge.edadpersona,
            persona_id: challenge.persona,
            avatar_url: personData ? personData.imagenurl : '/avatars/default.png',
        });
        
        setIsCreatingChallenge(true); // Abrir el formulario
        setIsEditing(true);           // Activar modo edición
        setEditingChallengeId(challenge.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- LÓGICA DE ACTUALIZACIÓN (MOCK) ---

    const handleUpdateChallenge = (e) => {
        e.preventDefault();
        
        const challengeIndex = mockChallenges.findIndex(c => c.id === editingChallengeId);
        const personaIndex = mockPeople.findIndex(p => p.id === challengeFormData.persona_id);
        const temaSeleccionado = mockThemes.find(t => t.id === parseInt(challengeFormData.tema_desafio));
        
        if (challengeIndex === -1 || !temaSeleccionado) return;

        // 1. Simular actualización de la Persona
        if (personaIndex !== -1) {
            mockPeople[personaIndex] = {
                ...mockPeople[personaIndex],
                nombrepersona: challengeFormData.nombrepersona,
                edad: challengeFormData.edadpersona,
                imagenurl: challengeFormData.avatar_url,
                contextopersona: challengeFormData.contexto, // El contexto se usa en la persona para simplificar el mock
            };
        }
        
        // 2. Simular actualización del Desafío
        mockChallenges[challengeIndex] = {
            ...mockChallenges[challengeIndex],
            ...challengeFormData,
            tema_desafio: parseInt(challengeFormData.tema_desafio),
            tema_desafio_nombre: temaSeleccionado.nombretema,
            id: editingChallengeId,
            persona_nombre: challengeFormData.nombrepersona,
        };

        Swal.fire('¡Éxito!', 'Desafío actualizado *SIMULADO* correctamente.', 'success');
        resetForm();
        fetchAllData();
    };

    // --- DISPATCHER DE FORMULARIO ---
    const handleSubmit = isEditing ? handleUpdateChallenge : handleCreatePersonaAndChallenge;

    // --- LÓGICA DE ELIMINACIÓN (MOCK) ---
    
    const handleDelete = (id, type) => {
        Swal.fire({
            title: `¿Estás seguro de eliminar el ${type}?`,
            text: "Esta acción es solo SIMULADA en el frontend.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar (Simular)'
        }).then((result) => {
            if (result.isConfirmed) {
                if (type === 'Tema') {
                    mockThemes = mockThemes.filter(t => t.id !== id);
                } else if (type === 'Desafío') {
                    mockChallenges = mockChallenges.filter(c => c.id !== id);
                }
                
                Swal.fire('Eliminado!', `${type} ha sido eliminado (SIMULADO).`, 'success');
                fetchAllData(); 
            }
        });
    };

    // --- LÓGICA DE TEMAS (MOCK) ---

    const handleCreateTheme = () => {
        if (!newThemeName.trim()) {
            Swal.fire('Advertencia', 'El nombre del área no puede estar vacío.', 'warning');
            return;
        }
        const newThemeId = Math.max(...mockThemes.map(t => t.id), 3) + 1;
        const newTheme = {
            id: newThemeId,
            nombretema: newThemeName.trim(),
            descripcion: 'Nueva área creada por el administrador (SIMULADA)',
            estado: 'activo',
        };
        mockThemes.push(newTheme);
        
        Swal.fire('¡Éxito!', `Área "${newThemeName}" creada *SIMULADA*.`, 'success');
        setNewThemeName('');
        setIsCreatingTheme(false);
        fetchAllData(); 
    };
    
    // --- RENDERIZADO ---

    if (isLoading) return <div className="text-center p-8 text-xl font-semibold text-indigo-500">Cargando gestión de desafíos (Simulado)...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Gestión de Desafíos (CRUD MOCK)</h1>
            <p className="text-sm text-red-500 mb-4">⚠️ **AVISO:** Las operaciones CRUD (Crear, Editar, Eliminar) son simuladas en el Frontend. No hay persistencia en el Backend.</p>

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
                            <input type="text" name="nombrepersona" placeholder="Nombre de la Persona *" value={challengeFormData.nombrepersona} onChange={handleChallengeChange} className="w-full p-2 border rounded mb-3" required />
                            <input type="number" name="edadpersona" placeholder="Edad de la Persona *" value={challengeFormData.edadpersona} onChange={handleChallengeChange} className="w-full p-2 border rounded mb-3" required />
                            
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
                                <FaSave className="mr-2" /> {isEditing ? 'GUARDAR CAMBIOS (MOCK)' : 'FINALIZAR CREACIÓN (MOCK)'}
                            </button>
                            <p className="text-sm text-gray-500 mt-2">
                                {isEditing ? 'Modifica el desafío existente.' : 'Crea un nuevo perfil y desafío.'}
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{challenge.tema_desafio_nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{challenge.persona_nombre} ({challenge.edadpersona})</td>
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