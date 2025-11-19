import React, { useState, useEffect } from 'react';
import PrototypeUpload from '../../modules/student/components/PrototypeUpload';
import useImageManager from '../useImageManager';
import './DevImageUpload.css';

const DevImageUpload = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [selectedEquipoId, setSelectedEquipoId] = useState(null);
    const [loadingEquipos, setLoadingEquipos] = useState(false);
    
    // Cargar equipos al montar el componente
    useEffect(() => {
        fetchEquipos();
    }, []);
    
    const fetchEquipos = async () => {
        try {
            setLoadingEquipos(true);
            const response = await fetch('/api/equipos/');
            if (response.ok) {
                const data = await response.json();
                setEquipos(data);
                // Seleccionar el primer equipo por defecto si hay equipos disponibles
                if (data.length > 0) {
                    setSelectedEquipoId(data[0].id);
                }
            } else {
                console.error('Error al cargar equipos');
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        } finally {
            setLoadingEquipos(false);
        }
    };
    
    // Usar el hook para gestionar imágenes existentes
    const {
        imageUrl: existingImageUrl,
        hasImage: hasExistingImage,
        loading: loadingExisting,
        error: loadingError,
        solucionId: existingSolucionId,
        updateImageData,
        refreshImage,
        clearError
    } = useImageManager(selectedEquipoId);

    const handleImageUploaded = (result) => {
        console.log('Imagen subida:', result);
        
        // Actualizar la lista de uploads
        setUploadedImages(prev => [...prev, {
            ...result,
            timestamp: new Date().toLocaleString()
        }]);
        
        // Actualizar el hook con la nueva imagen
        updateImageData(result.imageUrl, result.solucionId);
    };

    return (
        <div className="dev-image-upload">
            <div className="header">
                <h1>🔧 Herramienta de Desarrollo - Upload de Imágenes</h1>
                <p>Prueba el sistema: Frontend → Backend → Google Cloud → PostgreSQL</p>
            </div>

            {/* Sección de selección de equipo */}
            <div className="team-selection-section" style={{
                padding: '20px',
                backgroundColor: '#f0f8ff',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '2px solid #4CAF50'
            }}>
                <h2>👥 Seleccionar Equipo</h2>
                {loadingEquipos ? (
                    <p>🔄 Cargando equipos...</p>
                ) : equipos.length > 0 ? (
                    <>
                        <select 
                            value={selectedEquipoId || ''} 
                            onChange={(e) => {
                                const newTeamId = parseInt(e.target.value);
                                console.log('Equipo seleccionado:', newTeamId);
                                setSelectedEquipoId(newTeamId);
                            }}
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '16px',
                                border: '2px solid #ddd',
                                borderRadius: '6px',
                                marginBottom: '10px',
                                cursor: 'pointer'
                            }}
                        >
                            {equipos.map(equipo => (
                                <option key={equipo.id} value={equipo.id}>
                                    {equipo.nombre} (ID: {equipo.id}) - Tamaño: {equipo.tamanoequipo || 'N/A'}
                                </option>
                            ))}
                        </select>
                        <p style={{ 
                            color: '#2c5f2d', 
                            fontWeight: 'bold',
                            marginTop: '10px'
                        }}>
                            ✅ Equipo actual: {equipos.find(eq => eq.id === selectedEquipoId)?.nombre} (ID: {selectedEquipoId})
                        </p>
                    </>
                ) : (
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#fff3cd',
                        borderRadius: '6px',
                        border: '1px solid #ffc107'
                    }}>
                        <p style={{ color: '#856404', margin: 0 }}>
                            ⚠️ No hay equipos disponibles en la base de datos
                        </p>
                        <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                            Ejecuta el script SQL: <code>basedatos/Scripts/VerificarEquipos.sql</code>
                        </p>
                    </div>
                )}
            </div>

            {/* Sección de imagen existente */}
            {selectedEquipoId && (
                <div className="existing-image-section">
                    <h2>📷 Imagen Existente - {equipos.find(eq => eq.id === selectedEquipoId)?.nombre}</h2>
                
                {loadingError && (
                    <div className="error-message">
                        <p>❌ Error: {loadingError}</p>
                        <button onClick={clearError} className="clear-error-btn">
                            Limpiar Error
                        </button>
                    </div>
                )}
                
                {loadingExisting ? (
                    <p>🔄 Cargando imagen existente...</p>
                ) : hasExistingImage ? (
                    <div className="existing-image-container">
                        <div className="image-display">
                            <img 
                                src={existingImageUrl} 
                                alt={`Imagen del equipo ${selectedEquipoId}`}
                                className="existing-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div style={{display: 'none'}} className="image-error">
                                ❌ Error al cargar la imagen
                            </div>
                        </div>
                        <div className="existing-image-info">
                            <p><strong>Solución ID:</strong> {existingSolucionId}</p>
                            <p><strong>URL:</strong> 
                                <a href={existingImageUrl} target="_blank" rel="noopener noreferrer">
                                    Ver imagen completa
                                </a>
                            </p>
                            <button onClick={refreshImage} className="refresh-btn">
                                🔄 Recargar Imagen
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="no-existing-image">
                        <p>📭 No hay imagen existente para este equipo</p>
                        <p><small>Sube una imagen usando el formulario de abajo para verla aquí</small></p>
                    </div>
                )}
                </div>
            )}

            {/* Sección de upload */}
            {selectedEquipoId ? (
                <div className="upload-section">
                    <h2>📤 Subir Nueva Imagen</h2>
                    <PrototypeUpload 
                        equipoId={selectedEquipoId} 
                        onImageUploaded={handleImageUploaded}
                    />
                </div>
            ) : (
                <div className="upload-section" style={{
                    padding: '20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#666'
                }}>
                    <h3>⬆️ Selecciona un equipo primero</h3>
                    <p>Debes seleccionar un equipo antes de poder subir imágenes</p>
                </div>
            )}

            {uploadedImages.length > 0 && (
                <div className="results-section">
                    <h2>📊 Resultados de Uploads</h2>
                    
                    <div className="images-grid">
                        {uploadedImages.map((img, index) => (
                            <div key={index} className="image-result">
                                <div className="image-container">
                                    <img 
                                        src={img.imageUrl} 
                                        alt={`Upload ${index + 1}`}
                                        className="result-image"
                                    />
                                </div>
                                <div className="image-info">
                                    <p><strong>Solución ID:</strong> {img.solucionId}</p>
                                    <p><strong>Estado:</strong> {img.created ? 'Nueva' : 'Actualizada'}</p>
                                    <p><strong>Timestamp:</strong> {img.timestamp}</p>
                                    <p><strong>URL:</strong> 
                                        <a href={img.imageUrl} target="_blank" rel="noopener noreferrer">
                                            Ver imagen
                                        </a>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="technical-info">
                <h2>📋 Información Técnica</h2>
                <div className="tech-stack">
                    <div className="tech-item">
                        <h3>Frontend</h3>
                        <ul>
                            <li><code>React.js</code> - Interfaz de usuario</li>
                            <li><code>Fetch API</code> - HTTP requests</li>
                            <li><code>FileReader API</code> - Preview de imágenes</li>
                        </ul>
                    </div>
                    <div className="tech-item">
                        <h3>Backend</h3>
                        <ul>
                            <li><code>Django REST</code> - API endpoints</li>
                            <li><code>Google Cloud Storage</code> - Almacenamiento</li>
                            <li><code>PostgreSQL</code> - Base de datos</li>
                        </ul>
                    </div>
                    <div className="tech-item">
                        <h3>Endpoints</h3>
                        <ul>
                            <li><code>GET /api/signed-url/</code> - URL firmada</li>
                            <li><code>PUT [GCS URL]</code> - Upload a Cloud</li>
                            <li><code>POST /api/guardar-imagen/</code> - Guardar en BD</li>
                            <li><code>GET /api/obtener-imagen/</code> - Cargar imagen existente</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevImageUpload;