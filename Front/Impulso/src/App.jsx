
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Admin from "./components/Admin";
import Profesores from "./components/Profesores";
import Home from "./components/Home";
import Professor from "./components/Professor";
import PostularProfesor from "./components/PostularProfesor";
import Profile from "./components/Profile";
import Routine from "./components/Routine";
import AuthLayout from "./components/auth/AuthLayout";

import {
  login,
  getCurrentUser,
  logout,
  register,
} from "./services/authServices";
import {
  leerProfesorElegido,
  guardarProfesorElegido,
} from "./data/eleccionProfesor";

export default function App() {
  const [page, setPage] = useState("inicio");
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profesorElegidoId, setProfesorElegidoId] = useState(null);

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

  useEffect(() => {
    if (!user?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfesorElegidoId(null);
      return;
    }
    setProfesorElegidoId(leerProfesorElegido(user.id));
  }, [user?.id]);

  const elegirProfesor = (profesorId) => {
    setProfesorElegidoId(profesorId);
    guardarProfesorElegido(user.id, profesorId);
  };

  const dejarProfesor = () => {
    setProfesorElegidoId(null);
    guardarProfesorElegido(user.id, null);
  };

  // Iniciar sesión contra el backend.
  async function handleLogin(credentials) {
    setAuthError("");
    setLoading(true);

    try {
      const data = await login(credentials);
      setUser(data.user);
      setPage("inicio");
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
      setPage("inicio");
    }
  }

// Registrar usuario en el backend.
  async function handleRegister(userData) {
    setAuthError("");
    setLoading(true);

    try {
      const response = await register(userData);

      // Si el registro inicia sesión automáticamente (devuelve el usuario)
      if (response?.user) {
        setUser(response.user);
        setPage("inicio");
      }

      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const renderPage = (user) => {
    switch (page) {
      case "inicio":
        return (
          <Home
            setPage={setPage}
            user={user}
            profesorElegidoId={profesorElegidoId}
          />
        );

      case "profesores":
        return (
          <Profesores
            user={user}
            profesorElegidoId={profesorElegidoId}
            onElegir={elegirProfesor}
            onDejar={dejarProfesor}
          />
        );

      case "rutina":
        return (
          <Routine
            setPage={setPage}
            profesorElegidoId={profesorElegidoId}
          />
        );

      case "profesor":
        return user.rol === "profesor" ? (
          <Professor user={user} />
        ) : (
          <PostularProfesor user={user} />
        );

      case "admin":
        return <Admin />;

      case "Profile":
        return (
          <Profile
            user={user}
            onLogout={handleLogout}
            profesorElegidoId={profesorElegidoId}
          />
        );

      default:
        return (
          <Home
            setPage={setPage}
            user={user}
            profesorElegidoId={profesorElegidoId}
          />
        );
    }
  }; 

  if (checkingSession) {
    return <div className="app-loading">Verificando sesión...</div>;
  }

  if (!user) {
    return (
      <AuthLayout
        onEnter={handleLogin}
        onRegister={handleRegister}
        error={authError}
        loading={loading}
      />
    );
  }

  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="content-wrap">
          {renderPage(user)}
        </div>
      </main>
    </div>
  );
}