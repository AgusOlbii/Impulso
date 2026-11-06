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
import { ProtectedRoute } from "./ProtectedRoute";
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
import { coachService } from "./services/coach.service";

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
    if (!user?.id || user.rol === "coach" || user.rol === "admin") {
      if (user?.id) guardarProfesorElegido(user.id, null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfesorElegidoId(null);
      return;
    }
    if (user.coach_id) {
      setProfesorElegidoId(user.coach_id);
      guardarProfesorElegido(user.id, user.coach_id);
      return;
    }
    const guardado = leerProfesorElegido(user.id);
    if (guardado && Number(guardado) >= 9000) {
      setProfesorElegidoId(guardado);
      return;
    }
    setProfesorElegidoId(null);
    guardarProfesorElegido(user.id, null);
  }, [user?.id, user?.rol, user?.coach_id]);

  const elegirProfesor = async (profesorId) => {
    if (Number(profesorId) >= 9000) {
      if (user.coach_id && Number(user.coach_id) < 9000) {
        await coachService.leave();
        setUser((actual) => ({ ...actual, coach_id: null }));
      }
    } else {
      await coachService.hire(profesorId);
      setUser((actual) => ({ ...actual, coach_id: profesorId }));
    }
    setProfesorElegidoId(profesorId);
    guardarProfesorElegido(user.id, profesorId);
  };

  const dejarProfesor = async () => {
    if (user.coach_id && Number(user.coach_id) < 9000) {
      await coachService.leave();
      setUser((actual) => ({ ...actual, coach_id: null }));
    }
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
        {/* Ruta pública de Login */}
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

        {/* Rutas Protegidas que comparten el Layout principal */}
        <Route element={<ProtectedRoute user={user} />}>
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

                      {/* Rutas protegidas por rol */}
                      <Route element={<ProtectedRoute user={user} allowedRoles={["student"]} />}>
                        <Route path="/rutina" element={<Routine user={user} profesorElegidoId={profesorElegidoId} />} />
                        <Route path="/postular/profesor" element={<PostularProfesor user={user} />} />
                      </Route>

                      <Route element={<ProtectedRoute user={user} allowedRoles={["coach"]} />}>
                        <Route path="/panel/profesor" element={<Professor user={user} />} />
                        <Route path="/create/routine" element={<CreateRoutine />} />
                      </Route>

                      <Route element={<ProtectedRoute user={user} allowedRoles={["coach", "admin"]} />}>
                        <Route path="/create/exercise" element={<ExerciseCreator />} />
                      </Route>

                      <Route element={<ProtectedRoute user={user} allowedRoles={["admin"]} />}>
                        <Route path="/students/directory" element={<StudentsDirectory />} />
                        <Route path="/admin" element={<Admin />} />
                      </Route>

                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </main>
                <MobileNav user={user} />
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
    
  );
}
