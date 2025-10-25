import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importaciones de Martin Olivares (Profesor)
import ProfessorLayout from './PagesMartinOlivares/Components/ProfessorLayout.jsx';
import HomeView from './PagesMartinOlivares/Pages/HomeView.jsx';
import CrearJuegoView from './PagesMartinOlivares/Pages/CrearJuegoView.jsx';
import PerfilView from './PagesMartinOlivares/Pages/PerfilView.jsx';
import { ProfesorProvider } from './PagesMartinOlivares/Components/ProfessorContext.jsx';

// Importaciones de Martin Guerr (Admin)
import AdminLayout from "./PagesMartinGuerr/Components/AdminLayout";
import HomeAdmin from "./PagesMartinGuerr/Pages/HomeAdmin";
import ProfileAdmin from "./PagesMartinGuerr/Pages/ProfileAdmin";
import StatsAdmin from "./PagesMartinGuerr/Pages/StatsAdmin";
import AboutPage from "./PagesMartinGuerr/Pages/AboutPage";
import PaginaTesteo from './PagesMartinGuerr/Pages/PaginaTesteo';

function App() {
  return (
    <BrowserRouter>
      {/* Proveedor de contexto para Profesor (si es necesario para Admin también, ajustar) */}
      <ProfesorProvider>
        <Routes>
          
          {/* --- RUTAS DE PROFESOR (Martin Olivares) --- */}
          <Route path="/profesor" element={<ProfessorLayout />}>
            <Route path="home" element={<HomeView />} />
            <Route path="crear" element={<CrearJuegoView />} />
            <Route path="perfil" element={<PerfilView />} />
            {/* Ruta por defecto para /profesor */}
            <Route index element={<Navigate to="home" replace />} />
          </Route>
          
          {/* --- RUTAS DE ADMINISTRACIÓN (Martin Guerr) --- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<HomeAdmin />} /> 
            <Route path="profile" element={<ProfileAdmin />} /> 
            <Route path="stats" element={<StatsAdmin />} /> 
          </Route>

          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/about" element={<AboutPage />} />
          
          {/* --- RUTAS PARA TESTEO --- */}
          <Route path="/testeo-api" element={<PaginaTesteo />} />

          {/* --- REDIRECCIONES PRINCIPALES --- */}
          {/* Puedes elegir a dónde redirigir por defecto */}
          <Route path="/" element={<Navigate to="/profesor/home" replace />} />
          {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/profesor/home" replace />} />
        </Routes>
      </ProfesorProvider>
    </BrowserRouter>
  );
}

export default App;