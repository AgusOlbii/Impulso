import { useState } from "react";
import Header from "./Header";
import Icon from "./icon";

function PostularProfesor({ user }) {
  const [especialidad, setEspecialidad] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const enviarFormulario = (e) => {
    e.preventDefault();

    if (!especialidad || !experiencia || !descripcion) {
      setError("Completá especialidad, experiencia y descripción.");
      return;
    }

    const solicitud = {
      usuarioId: user?.id,
      nombre: user?.name,
      email: user?.email,
      especialidad,
      experiencia,
      descripcion,
      estado: "pendiente",
    };

    console.log("Solicitud de profesor (no se envía al servidor):", solicitud);
    setError("");
    setEnviado(true);
  };

  return (
    <>
      <Header eyebrow="COMUNIDAD" title="Quiero ser profesor" />

      <section className="creator-heading">
        <div>
          <span className="tag bright">POSTULACIÓN</span>
          <h2>Sumate al equipo, {user?.name || "socio"}.</h2>
          <p>
            Ya tenemos tu nombre y tu email de la cuenta. Completá tu perfil
            profesional. La solicitud queda registrada acá; no se manda a
            ningún servidor.
          </p>
        </div>
      </section>

      <section className="apply-card">
        {enviado ? (
          <div className="success-message">
            <Icon name="check" size={18} />
            <span>
              Solicitud lista. Revisamos tu perfil. Te vamos a avisar cuando el
              admin la vea.
            </span>
          </div>
        ) : (
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

            <button className="primary-button" type="submit">
              Enviar solicitud
              <Icon name="arrow" size={16} />
            </button>
          </form>
        )}
      </section>
    </>
  );
}

export default PostularProfesor;
