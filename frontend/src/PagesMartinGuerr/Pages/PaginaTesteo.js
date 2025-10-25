// frontend/src/PagesMartinGuerr/Pages/PaginaTesteo.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importamos el "mensajero"

function PaginaTesteo() {

    // 1. Preparamos "cajas" (estados) para guardar los datos
    const [estudiantes, setEstudiantes] = useState([]); // Una caja para la lista de estudiantes
    const [loading, setLoading] = useState(true);     // Una caja para saber si está "cargando"
    const [error, setError] = useState(null);         // Una caja para guardar errores

    // 2. useEffect: Esto se ejecuta 1 sola vez cuando el componente carga
    useEffect(() => {
        
        // 3. Definimos la función para ir a buscar los datos
        const fetchEstudiantes = async () => {
            try {
                // ¡AQUÍ ESTÁ LA LLAMADA!
                // Axios va a la URL de tu backend a pedir los datos
                const response = await axios.get('http://127.0.0.1:8000/api/estudiantes/');
                
                // 4. Guardamos los datos recibidos en nuestra "caja" (estado)
                setEstudiantes(response.data);
                
            } catch (err) {
                // 5. Si algo sale mal, guardamos el error
                setError(err.message);
            } finally {
                // 6. Pase lo que pase, dejamos de "cargar"
                setLoading(false);
            }
        };

        // 7. Llamamos a la función que acabamos de crear
        fetchEstudiantes();

    }, []); // El [] vacío asegura que esto solo se ejecute una vez

    
    // --- Renderizado (lo que se ve en la pantalla) ---

    // Si todavía está cargando, muestra un mensaje
    if (loading) {
        return <div>Cargando datos desde Django... ⏳</div>;
    }

    // Si hubo un error, muestra el error
    if (error) {
        return <div style={{color: 'red'}}>Error al conectar con la API: {error}</div>;
    }

    // Si todo salió bien, ¡muestra la tabla!
    return (
        <div style={{ padding: '20px' }}>
            <h1>Prueba de Conexión Backend (Estudiantes)</h1>
            <p>Datos consumidos desde: <code>http://127.0.0.1:8000/api/estudiantes/</code></p>
            
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID Estudiante</th>
                        <th>ID Usuario (del JSON)</th>
                        <th>Nombre Usuario (del JSON anidado)</th>
                        <th>Email (del JSON anidado)</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Hacemos un "map" (bucle) sobre la lista de estudiantes */}
                    {estudiantes.map(estudiante => (
                        <tr key={estudiante.id}>
                            <td>{estudiante.id}</td>
                            <td>{estudiante.usuario.id}</td> 
                            <td>{estudiante.usuario.nombre}</td>
                            <td>{estudiante.usuario.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p style={{marginTop: '20px', fontSize: '0.9em', color: 'gray'}}>
                <em>
                    Nota: Si los campos "Nombre" o "Email" aparecen vacíos o dan error, 
                    significa que no has implementado los <strong>Serializadores Anidados</strong> 
                    que te expliqué en el paso anterior (para que `usuario` no sea solo un ID).
                </em>
            </p>
        </div>
    );
}

export default PaginaTesteo;