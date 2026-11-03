import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admin from "./components/admin/Admin";
import ExerciseCreator from "./components/admin/ExerciseCreator";
import AuthLayout from "./components/auth/AuthLayout";
import Home from "./components/common/Home";
import MobileNav from "./components/common/MobileNav";
import Profesores from "./components/common/Profesores";
import Profile from "./components/common/Profile";
import Sidebar from "./components/common/Sidebar";
import CreateRoutine from "./components/professor/CreateRoutine";
import Professor from "./components/professor/Professor";
import StudentsDirectory from "./components/professor/StudentsDirectory";
import PostularProfesor from "./components/student/PostularProfesor";
import Routine from "./components/student/Routine";
import Unauthorized from "./components/Unauthorized";
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
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profesorElegidoId, setProfesorElegidoId] = useState(null);

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

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
    }
  }

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
  console.log(user)
  return (
    <BrowserRouter>
      <Routes>
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
              <Navigate to="/" replace />
            )
          }
        />

        {!user ? (
          <Route path="*" element={<Navigate to="/login" replace />} />
        ) : (
          <Route
            path="*"
            element={
              <div className="app">
                <Sidebar user={user} />
                <main className="main-content">
                  <div className="content-container">
                    <Routes>
                      <Route path="/" element={<Home user={user} />} />
                      <Route
                        path="/profesores"
                        element={
                          <Profesores
                            user={user}
                            profesorElegidoId={profesorElegidoId}
                            onElegir={elegirProfesor}
                            onDejar={dejarProfesor}
                          />
                        }
                      />
                      <Route
                        path="/perfil"
                        element={
                          <Profile
                            user={user}
                            setUser={setUser}
                            onLogout={handleLogout}
                            profesorElegidoId={profesorElegidoId}
                          />
                        }
                      />
                      <Route
                        path="/rutina"
                        element={
                          user.rol === "student" ? (
                            <Routine profesorElegidoId={profesorElegidoId} />
                          ) : (
                            <Unauthorized />
                          )
                        }
                      />
                      <Route
                        path="/postular/profesor"
                        element={
                          user.rol === "student" ? (
                            <PostularProfesor user={user} />
                          ) : (
                            <Unauthorized />
                          )
                        }
                      />
                      <Route
                        path="/panel/profesor"
                        element={
                          user.rol === "coach" ? (
                            <Professor user={user} />
                          ) : (
                            <Unauthorized />
                          )
                        }
                      />
                      <Route
                        path="/create/routine"
                        element={
                          user.rol === "coach" ? (
                            <CreateRoutine />
                          ) : (
                            <Unauthorized />
                          )
                        }
                      />
                      <Route
                        path="/students/directory"
                        element={
                          user.rol === "coach" ? (
                            <StudentsDirectory />
                          ) : (
                            <Unauthorized />
                          )
                        }
                      />
                      <Route path="/admin" element={<Admin />} />
                      <Route
                        path="/create/exercise"
                        element={
                          user.rol === "admin" ? (
                            <ExerciseCreator />
                          ) : (
                            <Unauthorized />
                          )
                        }
                      />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </main>
                <MobileNav user={user} />
              </div>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}
