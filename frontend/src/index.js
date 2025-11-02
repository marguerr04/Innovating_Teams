import React from 'react';
import ReactDOM from 'react-dom/client';


import './index.css';

import App from './App'; // <-- Importa tu componente App

// 2. ¡BORRA ESTA LÍNEA! Es la que causa el conflicto.
// import 'bootstrap/dist/css/bootstrap.min.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);