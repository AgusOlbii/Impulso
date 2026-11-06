import { useState, useEffect } from "react";
import Header from "../common/Header";
import Icon from "../common/Icon";
import { coachService } from "../../services/coach.service";
import { applicationService } from "../../services/application.service";

function PostularProfesor({ user }) {
  const [especialidad, setEspecialidad] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [application, setApplication] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyApplication = async () => {
      try {
        const data = await applicationService.getMyApplication();
        setApplication(data?.status ? data : null);
      } catch {
        setApplication(null);
      } finally {
        setCheckingStatus(false);
      }
    };

    fetchMyApplication();
  }, []);

  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (application?.status === "pending" || application?.status === "approved") return;

    if (!especialidad || !experiencia || !descripcion) {
      setError("Completá especialidad, experiencia y descripción.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await coachService.sendApplication({
        specialty: especialidad,
        experience: Number(experiencia),
        description: descripcion,
      });
      const updatedApp = await applicationService.getMyApplication();
      setApplication(updatedApp?.status ? updatedApp : { status: "pending" });
    } catch (err) {
      setError(err.message || "Hubo un error al enviar la solicitud al servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <>
        <Header eyebrow="COMUNIDAD" title="Quiero ser profesor" />
        <section className="apply-card">
          <p>Verificando estado de la postulación...</p>
        </section>
      </>
    );
  }

  const waiting = application?.status === "pending" || application?.status === "approved";

  return (
    <>
      <Header eyebrow="COMUNIDAD" title="Quiero ser profesor" />

      <section className="creator-heading">
        <div>
          <span className="tag bright">POSTULACIÓN</span>
          <h2>Sumate al equipo, {user?.name || "socio"}.</h2>
          <p>
            {waiting
              ? "Tu solicitud ya está en curso. No hace falta volver a enviarla."
              : "Ya tenemos tu nombre y tu email de la cuenta. Completá tu perfil profesional para enviarlo a revisión del administrador."}
          </p>
        </div>
      </section>

      <section className="apply-card">
        {application?.status === "pending" && (
          <div className="success-message">
            <Icon name="check" size={18} />
            <span>Ya hiciste la solicitud. Esperá la respuesta del administrador.</span>
          </div>
        )}

        {application?.status === "approved" && (
          <div className="success-message">
            <Icon name="check" size={18} />
            <span>Tu solicitud fue aprobada y ya formas parte del staff de profesores.</span>
          </div>
        )}

        {application?.status === "rejected" && !waiting && (
          <div className="success-message">
            <Icon name="bell" size={18} />
            <span>Tu solicitud anterior fue rechazada. Podés corregir los datos y volver a enviarla.</span>
          </div>
        )}

        {!waiting && (
          <form className="apply-form" onSubmit={enviarFormulario}>
            <p className="apply-account">
              Postulándote como <strong>{user?.name}</strong> · {user?.email}
            </p>

            {error && <p className="apply-error">{error}</p>}

            <label>
              <span>Especialidad</span>
              <select
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
              >
                <option value="">Elegí una</option>
                <option value="Fuerza">Fuerza</option>
                <option value="Cardio">Cardio</option>
                <option value="Musculación">Musculación</option>
                <option value="Funcional">Funcional</option>
                <option value="Cross Training">Cross Training</option>
                <option value="Movilidad">Movilidad</option>
              </select>
            </label>

            <label>
              <span>Años de experiencia</span>
              <input
                type="number"
                min="0"
                value={experiencia}
                onChange={(e) => setExperiencia(e.target.value)}
                placeholder="Ej: 3"
              />
            </label>

            <label className="apply-full">
              <span>Breve descripción</span>
              <textarea
                rows="4"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Contá cómo entrenás y a quién te gusta acompañar"
              />
            </label>

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar solicitud"}
              <Icon name="arrow" size={16} />
            </button>
          </form>
        )}
      </section>
    </>
  );
}

export default PostularProfesor;
