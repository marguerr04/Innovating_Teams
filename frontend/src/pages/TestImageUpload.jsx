import React, { useState } from 'react';
import ImageUploadComponent from '../components/ImageUploadComponent';
import './TestImageUpload.css';

const TestImageUpload = () => {
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleImageUploaded = (result) => {
        console.log('Imagen subida:', result);
        setUploadedImages(prev => [...prev, {
            ...result,
            timestamp: new Date().toLocaleString()
        }]);
    };

    return (
        <div className="test-image-upload">
            <div className="header">
                <h1>🚀 Prueba de Subida de Imágenes</h1>
                <p>Prueba el sistema completo: Frontend → Backend → Google Cloud → PostgreSQL</p>
            </div>

            <div className="upload-section">
                <ImageUploadComponent 
                    equipoId={1} 
                    onImageUploaded={handleImageUploaded}
                />
            </div>

            {uploadedImages.length > 0 && (
                <div className="results-section">
                    <h2>📸 Imágenes Subidas</h2>
                    <div className="images-grid">
                        {uploadedImages.map((image, index) => (
                            <div key={index} className="image-card">
                                <img 
                                    src={image.imageUrl} 
                                    alt={`Subida ${index + 1}`}
                                    className="uploaded-image"
                                />
                                <div className="image-info">
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
                    <li><strong>Selecciona una imagen:</strong> Haz clic en "Seleccionar imagen" y elige un archivo PNG, JPG o JPEG</li>
                    <li><strong>Añade descripción:</strong> Escribe una descripción opcional del prototipo</li>
                    <li><strong>Sube la imagen:</strong> Haz clic en "Subir Imagen"</li>
                    <li><strong>Verifica el resultado:</strong> La imagen aparecerá abajo si todo funciona correctamente</li>
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
                        <li><code>GET /api/signed-url/</code> - Obtener URL firmada</li>
                        <li><code>PUT [Google Cloud URL]</code> - Subir imagen</li>
                        <li><code>POST /api/guardar-imagen/</code> - Guardar en BD</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TestImageUpload;