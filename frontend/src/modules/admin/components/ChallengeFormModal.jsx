import React from 'react';
import { FaTimes, FaUser } from 'react-icons/fa';
import { default as FaSave } from 'react-icons/fa';

const defaultAvatars = [
    { name: 'Andres', url: '/avatars/andres.png' },
    { name: 'Camila', url: '/avatars/camila.png' },
    { name: 'Francisco', url: '/avatars/francisco.png' },
    { name: 'Martina', url: '/avatars/martina.png' }
];

const ChallengeFormModal = ({
    open,
    onClose,
    onSubmit,
    isEditing,
    challengeFormData,
    handleChallengeChange,
    handlePersonaSelect,
    handleAvatarSelect,
    themes,
    people
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-emerald-500 font-semibold">
                            {isEditing ? 'Actualizando' : 'Nuevo desafio'}
                        </p>
                        <h3 className="text-2xl font-bold text-slate-900">
                            {isEditing ? 'Editar desafio existente' : 'Registrar un nuevo desafio'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 rounded-full p-2 bg-slate-100"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <h4 className="text-sm font-semibold text-slate-600 mb-3">Contexto del desafio</h4>
                            <div className="space-y-3">
                                <select
                                    name="tema_desafio"
                                    value={challengeFormData.tema_desafio || ''}
                                    onChange={handleChallengeChange}
                                    className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                                    required
                                >
                                    <option value="">Seleccionar area o tema</option>
                                    {themes.map((theme) => (
                                        <option key={theme.id} value={theme.id}>
                                            {theme.nombretema}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={challengeFormData.titulo}
                                    onChange={handleChallengeChange}
                                    placeholder="Titulo del desafio"
                                    className="w-full p-3 border border-slate-200 rounded-xl"
                                    required
                                />
                                <textarea
                                    name="descripcion"
                                    value={challengeFormData.descripcion}
                                    onChange={handleChallengeChange}
                                    placeholder="Dolor principal o resumen"
                                    className="w-full p-3 border border-slate-200 rounded-xl h-20"
                                    required
                                />
                                <textarea
                                    name="contexto"
                                    value={challengeFormData.contexto}
                                    onChange={handleChallengeChange}
                                    placeholder="Contexto completo y datos relevantes"
                                    className="w-full p-3 border border-slate-200 rounded-xl h-28"
                                    required
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                                <FaUser /> Perfil asociado
                            </h4>
                            <div className="space-y-3">
                                <select
                                    name="persona_id"
                                    value={challengeFormData.persona_id || ''}
                                    onChange={(e) => handlePersonaSelect(e.target.value)}
                                    className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                                >
                                    <option value="">Registrar nueva persona</option>
                                    {people.map((person) => (
                                        <option key={person.id} value={person.id}>
                                            {person.nombre} ({person.edad} anos)
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    name="nombrepersona"
                                    value={challengeFormData.nombrepersona}
                                    onChange={handleChallengeChange}
                                    placeholder="Nombre de la persona"
                                    className="w-full p-3 border border-slate-200 rounded-xl"
                                    required
                                    disabled={challengeFormData.persona_id !== null}
                                />
                                <input
                                    type="number"
                                    name="edadpersona"
                                    value={challengeFormData.edadpersona}
                                    onChange={handleChallengeChange}
                                    placeholder="Edad"
                                    className="w-full p-3 border border-slate-200 rounded-xl"
                                    min="10"
                                    required
                                    disabled={challengeFormData.persona_id !== null}
                                />
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Avatares</p>
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {defaultAvatars.map((avatar) => (
                                            <button
                                                type="button"
                                                key={avatar.name}
                                                onClick={() => handleAvatarSelect(avatar.url)}
                                                className={`p-1 border-2 rounded-full transition ${
                                                    challengeFormData.avatar_url === avatar.url
                                                        ? 'border-emerald-500 ring-2 ring-emerald-200'
                                                        : 'border-transparent hover:border-slate-300'
                                                }`}
                                            >
                                                <img
                                                    src={avatar.url}
                                                    alt={avatar.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-3">
                                        Resumen del registro
                                    </p>
                                    <ul className="text-sm text-slate-600 space-y-2">
                                        <li>• Tema: {challengeFormData.tema_desafio ? 'Seleccionado' : 'Pendiente'}</li>
                                        <li>• Perfil: {challengeFormData.nombrepersona || 'Sin asignar'}</li>
                                        <li>• Avatar: {challengeFormData.avatar_url ? 'Definido' : 'Sin avatar'}</li>
                                    </ul>
                                </div>
                                <p className="text-xs text-slate-500 mt-4">
                                    Al guardar se asociara el desafio al area seleccionada y se creara/actualizara el perfil vinculado.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <p className="text-sm text-slate-500">
                            Completa todos los campos requeridos para mantener la calidad de los briefs entregados a los equipos.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
                            >
                                {isEditing ? 'Guardar cambios' : 'Crear desafio' }
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChallengeFormModal;
