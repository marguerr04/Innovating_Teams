// Ejemplo de componente React para subir imágenes usando Google Cloud Storage
// Archivo: frontend/src/components/ImageUploader.jsx

import React, { useState } from 'react';

const ImageUploader = ({ onImageUploaded, userToken }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido');
            return;
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('El archivo es demasiado grande. Máximo 5MB permitido.');
            return;
        }

        // Mostrar preview
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);

        // Subir archivo
        await uploadImage(file);
    };

    const uploadImage = async (file) => {
        setUploading(true);
        setUploadProgress(0);

        try {
            // Paso 1: Obtener URL firmada del backend
            const filename = `avatar-${Date.now()}-${file.name}`;
            const signedUrlResponse = await fetch('/api/storage/signed-url/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userToken}`
                },
                body: JSON.stringify({
                    filename: filename,
                    content_type: file.type
                })
            });

            if (!signedUrlResponse.ok) {
                throw new Error('Error al obtener URL firmada');
            }

            const { signed_url, public_url } = await signedUrlResponse.json();

            // Paso 2: Subir archivo a Google Cloud Storage
            const uploadResponse = await fetch(signed_url, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type
                },
                body: file
            });

            if (!uploadResponse.ok) {
                throw new Error('Error al subir la imagen');
            }

            setUploadProgress(100);

            // Paso 3: Notificar al componente padre
            onImageUploaded({
                filename: filename,
                public_url: public_url,
                size: file.size,
                type: file.type
            });

            alert('¡Imagen subida exitosamente!');

        } catch (error) {
            console.error('Error al subir imagen:', error);
            alert('Error al subir la imagen. Por favor intenta nuevamente.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="image-uploader">
            <div className="upload-area">
                {previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="preview-image"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                    />
                ) : (
                    <div className="placeholder">
                        <p>Selecciona una imagen</p>
                    </div>
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="file-input"
            />

            {uploading && (
                <div className="upload-progress">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <p>Subiendo imagen... {uploadProgress}%</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;

// Ejemplo de uso del componente:
/*
import ImageUploader from './components/ImageUploader';

function UserProfile() {
    const [userToken, setUserToken] = useState(localStorage.getItem('token'));
    const [profileImage, setProfileImage] = useState(null);

    const handleImageUploaded = (imageData) => {
        setProfileImage(imageData.public_url);
        
        // Opcional: Guardar la URL en la base de datos
        // updateUserProfile({ avatar_url: imageData.public_url });
    };

    return (
        <div>
            <h2>Perfil de Usuario</h2>
            <ImageUploader 
                onImageUploaded={handleImageUploaded}
                userToken={userToken}
            />
            {profileImage && (
                <img src={profileImage} alt="Perfil" />
            )}
        </div>
    );
}
*/