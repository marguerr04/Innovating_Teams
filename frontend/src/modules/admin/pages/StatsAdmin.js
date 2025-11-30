// File: frontend/src/modules/admin/pages/StatsAdmin.js

import React, { useState, useEffect } from 'react';
// Eliminamos la dependencia de axios ya que usaremos mock data
import { FaPlay, FaTrophy, FaGraduationCap, FaStar, FaCamera } from 'react-icons/fa'; 

// --- MOCK DATA SIMULADA PARA TESTING DE FRONTEND ---
const mockStats = {
    total_partidas: 58,
    total_desafios: 12,
    evaluacion_promedio_juego: 4.35,
    carreras_participantes_count: 8,
    partidas_por_carrera: [
        { carrera_nombre: 'Ingeniería', count: 25 },
        { carrera_nombre: 'Diseño', count: 18 },
        { carrera_nombre: 'Comercial', count: 15 },
        { carrera_nombre: 'Humanidades', count: 9 },
    ],
    // Métrica adicional que se podría pedir:
    fotos_lego_url: [
        'https://via.placeholder.com/150/0000FF/808080?text=Lego+1',
        'https://via.placeholder.com/150/FF0000/FFFFFF?text=Lego+2',
        'https://via.placeholder.com/150/00FF00/000000?text=Lego+3',
    ]
};
// ----------------------------------------------------


// Componente auxiliar para las tarjetas de estadísticas
const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className={`p-4 rounded-lg shadow-md flex items-center ${color}`}>
        <div className="p-3 rounded-full bg-white bg-opacity-30 mr-4 text-white">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-white opacity-80">{subtitle}</p>}
        </div>
    </div>
);

// Componente para el gráfico (simulación de barras)
const CarreraChart = ({ data }) => {
    if (!data || data.length === 0) return <p className="text-center text-gray-500">No hay datos de carreras para mostrar.</p>;

    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">Distribución de Partidas por Carrera</h3>
            {data.map(item => (
                <div key={item.carrera_nombre} className="mb-4">
                    <div className="flex justify-between text-sm font-medium">
                        <p>{item.carrera_nombre}</p>
                        <p className="font-bold">{item.count} partidas</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                            className="bg-indigo-600 h-4 rounded-full transition-all duration-500" 
                            style={{ width: `${(item.count / total) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
};


const StatsAdmin = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulación de la carga de datos del backend (reemplaza el axios.get)
        setIsLoading(true);
        setTimeout(() => {
            setStats(mockStats);
            setIsLoading(false);
        }, 300);
    }, []);

    if (isLoading) return <div className="p-8 text-center text-indigo-500">Cargando estadísticas del sistema (Simulado)...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">Error simulado: No se pudieron cargar las estadísticas.</div>;

    const formattedAvg = stats.evaluacion_promedio_juego ? stats.evaluacion_promedio_juego.toFixed(2) : 'N/A';

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Dashboard de Administración (MOCK)</h1>
            <p className="text-gray-600 mb-8">Resumen de métricas clave del sistema.</p>
            
            {/* Tarjetas de Métricas Clave */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    icon={FaPlay}
                    title="Juegos Jugados (Total)"
                    value={stats.total_partidas}
                    color="bg-blue-600"
                />
                <StatCard 
                    icon={FaTrophy}
                    title="Desafíos Disponibles"
                    value={stats.total_desafios}
                    color="bg-green-600"
                />
                <StatCard 
                    icon={FaStar}
                    title="Evaluación Promedio"
                    value={formattedAvg}
                    subtitle="Encuesta de Satisfacción (1-5)"
                    color="bg-yellow-600"
                />
                <StatCard 
                    icon={FaGraduationCap}
                    title="Carreras Únicas"
                    value={stats.carreras_participantes_count}
                    color="bg-purple-600"
                />
            </div>

            {/* Gráfico de Distribución por Carrera y Galería de Soluciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow-xl col-span-1">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Métricas en Gráficos</h2>
                    <CarreraChart data={stats.partidas_por_carrera} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-xl col-span-1">
                    <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center">
                        <FaCamera className='mr-2' />
                        Galería de Soluciones Lego
                    </h2>
                    <p className="text-gray-500 mb-4">
                        Visualización de prototipos subidos por los equipos (Simulado).
                    </p>
                    <div className="flex space-x-4 overflow-x-auto">
                        {stats.fotos_lego_url.map((url, index) => (
                            <img 
                                key={index} 
                                src={url} 
                                alt={`Lego Solution ${index + 1}`} 
                                className="w-32 h-32 object-cover rounded shadow-lg border-2 border-gray-100"
                            />
                        ))}
                    </div>
                </div>
            </div>
           
        </div>
    );
};

export default StatsAdmin;