import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Admin from "./components/Admin";
import Classes from "./components/Classes";
import Home from "./components/Home";
import Professor from "./components/Professor";
import Profile from "./components/Profile";
import Routine from "./components/Routine";
import AuthLayout from "./components/auth/AuthLayout";

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

<<<<<<< Updated upstream
  const renderPage = (user) => {
    switch (page) {
      case "inicio":
        return <Home setPage={setPage} user={user}/>;

      case "clases":
        return <Classes />;

      case "rutina":
        return <Routine />;

      case "profesor":
        return <Professor user={user} />;

      case "admin":
        return <Admin />;

      case "Profile":
        return <Profile user={user} onLogout={handleLogout}/>;

      default:
        return <Home setPage={setPage} user={user} />;
    }
  }; 

=======
>>>>>>> Stashed changes
  if (checkingSession) {
    return <div className="app-loading">Verificando sesión...</div>;
  }

  // Si no hay usuario, muestra las pantallas de Login / Registro
  // if (!user) {
  //   return (
  //     <AuthLayout
  //       onEnter={handleLogin}
  //       onRegister={handleRegister}
  //       error={authError}
  //       loading={loading}
  //     />
  //   );
  // }

  // Si hay usuario logueado, renderiza la estructura con React Router
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
                <Sidebar user={user} onLogout={handleLogout} />
                <main className="main-content">
                  <div className="content-container">
                    <Routes>
                      <Route path="/" element={<Home user={user} />} />
                      <Route path="/profesores" element={<Profesores />} />
                      <Route path="/rutina" element={<Routine />} />
                      <Route 
                        path="/profesor" 
                        element={
                          user.rol === "profesor" ? (
                            <Professor user={user} />
                          ) : (
                            <PostularProfesor />
                          )
                        } 
                      />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/perfil" element={<Profile user={user} onLogout={handleLogout} />} />
                      
                      {/* Cualquier ruta interna no encontrada vuelve al inicio */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}