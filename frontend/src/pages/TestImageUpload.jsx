import React, { useState, useEffect } from 'react';
import ImageUploadComponent from '../components/ImageUploadComponent';
import './TestImageUpload.css';

const TestImageUpload = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [selectedEquipoId, setSelectedEquipoId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEquipos();
    }, []);

    const fetchEquipos = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/equipos/');
            if (response.ok) {
                const data = await response.json();
                setEquipos(data);
                // Don't auto-select the first team, let user choose
                // if (data.length > 0) {
                //     setSelectedEquipoId(data[0].id);
                // }
            } else {
                console.error('Error al cargar equipos');
                // Add some mock data for testing if API fails
                setEquipos([
                    { id: 1, nombre: 'Equipo Alpha' },
                    { id: 2, nombre: 'Equipo Beta' },
                    { id: 3, nombre: 'Equipo Gamma' }
                ]);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
            // Add mock data for testing
            setEquipos([
                { id: 1, nombre: 'Equipo Alpha' },
                { id: 2, nombre: 'Equipo Beta' },
                { id: 3, nombre: 'Equipo Gamma' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUploaded = (result) => {
        console.log('Imagen subida:', result);
        const selectedEquipo = equipos.find(eq => eq.id === parseInt(selectedEquipoId));
        setUploadedImages(prev => [...prev, {
            ...result,
            timestamp: new Date().toLocaleString(),
            equipoNombre: selectedEquipo?.nombre || 'Equipo no encontrado'
        }]);
    };

    return (
        <div className="test-image-upload">
            <div className="header">
                <h1>🚀 Prueba de Subida de Imágenes por Equipo</h1>
                <p>Asocia imágenes a equipos específicos: Frontend → Backend → Google Cloud → PostgreSQL</p>
            </div>

            <div className="upload-section">
                <div className="team-selection" style={{ 
                    marginBottom: '20px', 
                    padding: '15px', 
                    border: '2px solid #4CAF50', 
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3>👥 Seleccionar Equipo</h3>
                    {loading ? (
                        <p>Cargando equipos...</p>
                    ) : (
                        <>
                            <select 
                                value={selectedEquipoId} 
                                onChange={(e) => {
                                    console.log('Equipo seleccionado:', e.target.value);
                                    setSelectedEquipoId(e.target.value);
                                }}
                                className="team-dropdown"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '16px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    marginBottom: '10px'
                                }}
                                disabled={equipos.length === 0}
                            >
                                <option value="">-- Selecciona un equipo --</option>
                                {equipos.map(equipo => (
                                    <option key={equipo.id} value={equipo.id}>
                                        {equipo.nombre}
                                    </option>
                                ))}
                            </select>
                            <p style={{ 
                                color: '#666', 
                                fontSize: '14px',
                                margin: '5px 0'
                            }}>
                                {selectedEquipoId ? 
                                    `✅ Equipo seleccionado: ${equipos.find(eq => eq.id === parseInt(selectedEquipoId))?.nombre}` : 
                                    '⚠️ Selecciona un equipo para continuar'
                                }
                            </p>
                        </>
                    )}
                    {equipos.length === 0 && !loading && (
                        <p className="no-teams" style={{ color: 'red' }}>
                            ❌ No hay equipos disponibles
                        </p>
                    )}
                </div>

                {selectedEquipoId ? (
                    <div style={{ 
                        border: '2px solid #2196F3', 
                        borderRadius: '8px', 
                        padding: '15px',
                        backgroundColor: '#f0f8ff'
                    }}>
                        <h4>📤 Subir Imagen para: {equipos.find(eq => eq.id === parseInt(selectedEquipoId))?.nombre}</h4>
                        <ImageUploadComponent 
                            equipoId={parseInt(selectedEquipoId)} 
                            onImageUploaded={handleImageUploaded}
                        />
                    </div>
                ) : (
                    <div style={{ 
                        padding: '20px', 
                        textAlign: 'center', 
                        color: '#666',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px'
                    }}>
                        <h4>⬆️ Primero selecciona un equipo</h4>
                        <p>Debes seleccionar un equipo antes de poder subir imágenes</p>
                    </div>
                )}
            </div>

            {uploadedImages.length > 0 && (
                <div className="results-section">
                    <h2>📸 Imágenes Subidas por Equipo</h2>
                    <div className="images-grid">
                        {uploadedImages.map((image, index) => (
                            <div key={index} className="image-card">
                                <img 
                                    src={image.imageUrl} 
                                    alt={`Subida ${index + 1}`}
                                    className="uploaded-image"
                                />
                                <div className="image-info">
                                    <p><strong>Equipo:</strong> {image.equipoNombre}</p>
                                    <p><strong>Solución ID:</strong> {image.solucionId}</p>
                                    <p><strong>Subido:</strong> {image.timestamp}</p>
                                    <p><strong>Estado:</strong> {image.created ? 'Nuevo' : 'Actualizado'}</p>
                                    <a 
                                        href={image.imageUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="view-link"
                                    >
                                        Ver imagen completa ↗
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="instructions-section">
                <h3>📋 Instrucciones de Prueba</h3>
                <ol>
                    <li><strong>Selecciona un equipo:</strong> Elige el equipo al que quieres asociar la imagen</li>
                    <li><strong>Selecciona una imagen:</strong> Haz clic en "Seleccionar imagen" y elige un archivo PNG, JPG o JPEG</li>
                    <li><strong>Añade descripción:</strong> Escribe una descripción opcional del prototipo</li>
                    <li><strong>Sube la imagen:</strong> Haz clic en "Subir Imagen"</li>
                    <li><strong>Verifica el resultado:</strong> La imagen aparecerá abajo asociada al equipo seleccionado</li>
                </ol>

                <div className="tech-stack">
                    <h4>🔧 Stack Tecnológico</h4>
                    <div className="stack-items">
                        <span className="stack-item frontend">React Frontend</span>
                        <span className="stack-item backend">Django Backend</span>
                        <span className="stack-item storage">Google Cloud Storage</span>
                        <span className="stack-item database">PostgreSQL</span>
                    </div>
                </div>

                <div className="endpoints-info">
                    <h4>🔗 Endpoints Utilizados</h4>
                    <ul>
                        <li><code>GET /api/equipos/</code> - Obtener lista de equipos</li>
                        <li><code>GET /api/signed-url/</code> - Obtener URL firmada</li>
                        <li><code>PUT [Google Cloud URL]</code> - Subir imagen</li>
                        <li><code>POST /api/guardar-imagen/</code> - Guardar en BD con equipo</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TestImageUpload;