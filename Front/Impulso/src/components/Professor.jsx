import { useState } from "react";
import Header from "../components/Header";

function Professor() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const enviarFormulario = (e) => {
    e.preventDefault();

    if (!nombre || !email || !especialidad || !experiencia || !descripcion) {
      setError("Completá todos los campos.");
      return;
    }

    const solicitud = {
      nombre,
      email,
      especialidad,
      experiencia,
      descripcion,
      estado: "pendiente",
    };

    console.log("Solicitud de profesor:", solicitud);
    setError("");
    setEnviado(true);
  };

  return (
    <>
      <Header eyebrow="COMUNIDAD" title="Soy profesor" />

      <section className="form-card">
        {enviado ? (
          <div>
            <h2>Solicitud enviada</h2>
            <p>
              Gracias {nombre}. Vamos a revisar tus datos y te avisamos por
              email.
            </p>
          </div>
        ) : (
          <form onSubmit={enviarFormulario}>
            <h2>Quiero ser profesor</h2>
            <p>Completá el formulario y el admin va a revisar tu perfil.</p>

            {error && <p>{error}</p>}

            <label>
              Nombre
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </label>

            <label>
              Especialidad
              <select
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
              >
                <option value="">Elegí una</option>
                <option value="Zona media">Zona media</option>
                <option value="Glúteos">Glúteos</option>
                <option value="Hipertrofia">Hipertrofia</option>
                <option value="Resistencia">Resistencia</option>
                <option value="Movilidad">Movilidad</option>
              </select>
            </label>

            <label>
              Años de experiencia
              <input
                type="number"
                min="0"
                value={experiencia}
                onChange={(e) => setExperiencia(e.target.value)}
                placeholder="Ej: 3"
              />
            </label>

            <label>
              Descripción
              <textarea
                rows="4"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Contá en qué entrenás y cómo laburás"
              />
            </label>

            <button className="primary-button" type="submit">
              Enviar solicitud
            </button>
          </form>
        )}
      </section>
    </>
  );
}

export default Professor;
