import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Importacion de carpeta ADMIN
import Admin from "./components/admin/Admin";
import ExerciseCreator from "./components/admin/ExerciseCreator";
// Importaciones de carpeta AUTH
import AuthLayout from "./components/auth/AuthLayout";
// Importaciones de carpeta COMMON
import Home from "./components/common/Home";
import MobileNav from "./components/common/MobileNav";
import Profesores from './components/common/Profesores';
import Profile from "./components/common/Profile";
import Sidebar from "./components/common/Sidebar";
// Importaciones de carpeta PROFESSOR
import CreateRoutine from "./components/professor/CreateRoutine";
import Professor from "./components/professor/Professor";
import StudentsDirectory from "./components/professor/StudentsDirectory";
// Importaciones de carpeta STUDENT
import PostularProfesor from './components/student/PostularProfesor';
import Routine from "./components/student/Routine";
//Importaciones de COMPONENTS
import Unauthorized from "./components/Unauthorized";
// Importaciones de la carpeta SERVICES
import {
  login,
  getCurrentUser,
  logout,
  register,
} from "./services/authServices";


export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  // Verificar si ya existe una sesión válida.
  useEffect(() => {
    async function checkSession() {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  // Iniciar sesión contra el backend.
  async function handleLogin(credentials) {
    setAuthError("");
    setLoading(true);

    try {
      const data = await login(credentials);
      setUser(data.user);
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Cerrar sesión en el backend.
  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
    }
  }

  // Registrar usuario en el backend.
  async function handleRegister(userData) {
    setAuthError("");
    setLoading(true);

    try {
      const response = await register(userData);

      if (response?.user) {
        setUser(response.user);
      }

      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }


  if (checkingSession) {
    return <div className="app-loading">Verificando sesión...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA: LOGIN */}
        <Route 
          path="/login" 
          element={
            !user ? (
              <AuthLayout
                onEnter={handleLogin}
                onRegister={handleRegister}
                error={authError}
                loading={loading}
              />
            ) : (
              <Navigate to="/" replace /> // Si ya está logueado, no lo dejamos ver el login, lo mandamos al inicio
            )
          } 
        />

        {/* RUTAS PROTEGIDAS: Si NO hay usuario, lo mandamos obligatoriamente a /login */}
        {!user ? (
          <Route path="*" element={<Navigate to="/login" replace />} />
        ) : (
          /* Si SÍ hay usuario, renderizamos la app completa con el Sidebar y las páginas */
          <Route
            path="*"
            element={
              <div className="app">
                <Sidebar user={user}/>
                <main className="main-content">
                  <div className="content-container">
                    <Routes>
                      {/* RUTAS PARA TODOS LOS ROLES */}
                      <Route path="/" element={<Home user={user} />} />
                      <Route path="/profesores" element={<Profesores user={user}/>} />
                      <Route path="/perfil" element={<Profile user={user} onLogout={handleLogout} />} />
                      {/* RUTAS PARA LOS ALUMNOS */}
                      <Route path="/rutina" element={user.rol === 'alumno' ? (<Routine />) : (<Unauthorized/>)} />
                      <Route path="/postular/profesor" element={user.rol === "alumno" ? (<PostularProfesor/>) : (<Unauthorized/>)}></Route>
                      {/* RUTAS PARA LOS PROFESORES */}
                      <Route path="/panel/profesor" element={user.rol === 'profesor' ? (<Professor user={user}/>) : (<Unauthorized/>)}></Route>
                      <Route path="/create/routine" element={user.rol === 'profesor' ? (<CreateRoutine/>) : (<Unauthorized/>)}/>
                      <Route path="/students/directory" element={user.rol === "profesor" ? (<StudentsDirectory/>) : (<Unauthorized/>)}></Route>
                      {/* RUTAS PARA EL ADMIN */}
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/create/exercise" element={user.rol === 'admin' ? (<ExerciseCreator/>) : (<Unauthorized/>)}></Route>
                      {/* Cualquier ruta interna no encontrada vuelve al inicio */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </main>
                <MobileNav user={user}/>
              </div>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}