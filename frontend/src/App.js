import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProfessorLayout from './PagesMartinOlivares/Components/ProfessorLayout.jsx'; // <-- CORREGIDO (dos 's')
import HomeView from './PagesMartinOlivares/Pages/HomeView.jsx';
import CrearJuegoView from './PagesMartinOlivares/Pages/CrearJuegoView.jsx';
import PerfilView from './PagesMartinOlivares/Pages/PerfilView.jsx';
import { ProfesorProvider } from './PagesMartinOlivares/Components/ProfessorContext.jsx'; // <-- CORREGIDO (dos 's')
// Importa también tus otras páginas (Login, Student, etc.)

function App() {
  return (
    <BrowserRouter>
      <ProfesorProvider> {/* <-- Envolver aquí */}
        <Routes>
          <Route path="/profesor" element={<ProfessorLayout />}> {/* <-- CORREGIDO (dos 's') */}
            <Route path="home" element={<HomeView />} />
            <Route path="crear" element={<CrearJuegoView />} />
            <Route path="perfil" element={<PerfilView />} />
            {/* Ruta por defecto para /profesor */}
            <Route index element={<Navigate to="home" replace />} />
          </Route>
          
          {/* Aquí irían tus otras rutas principales */}
          {/* <Route path="/login" element={<LoginView />} /> */}

          <Route path="/" element={<Navigate to="/profesor/home" replace />} />
        </Routes>
      </ProfesorProvider>
    </BrowserRouter>
  )
}
export default App;