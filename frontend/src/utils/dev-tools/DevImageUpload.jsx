import React, { useState } from 'react';
import PrototypeUpload from '../../modules/student/components/PrototypeUpload';
import './DevImageUpload.css';

const DevImageUpload = () => {
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleImageUploaded = (result) => {
        console.log('Imagen subida:', result);
        setUploadedImages(prev => [...prev, {
            ...result,
            timestamp: new Date().toLocaleString()
        }]);
    };

    return (
        <div className="dev-image-upload">
            <div className="header">
                <h1>🔧 Herramienta de Desarrollo - Upload de Imágenes</h1>
                <p>Prueba el sistema: Frontend → Backend → Google Cloud → PostgreSQL</p>
            </div>

            <div className="upload-section">
                <PrototypeUpload 
                    equipoId={1} 
                    onImageUploaded={handleImageUploaded}
                />
            </div>

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
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevImageUpload;