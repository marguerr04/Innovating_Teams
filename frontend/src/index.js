import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // <-- Importa tu archivo de estilos principal
import App from './App'; // <-- Importa tu componente App

// Importa Bootstrap CSS (¡lo necesitas para tu layout!)
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);