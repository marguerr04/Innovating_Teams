import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Asegúrate de que este sea el archivo CSS que tiene las 3 líneas de @tailwind
import './index.css'; // (o './styles.css', el que estés usando)

import App from './App'; // <-- Importa tu componente App

// 2. ¡BORRA ESTA LÍNEA! Es la que causa el conflicto.
// import 'bootstrap/dist/css/bootstrap.min.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);