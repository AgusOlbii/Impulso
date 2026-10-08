import { useState } from "react";
import Icon from "./icon";
import Header from "../components/Header";
function Professor() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Header eyebrow="COMUNIDAD" title="Soy profesor" />

      <div className="professor-layout">
        <section className="form-card">
          {!submitted ? (
            <>
              <div className="eyebrow">SUMATE A FITLAB</div>
              <h2>Convertite en profesor</h2>
              <p>
                Completá tus datos y nuestro equipo revisará tu perfil antes de
                habilitarte.
              </p>

              <div className="form-grid">
                <label>
                  Nombre completo
                  <input placeholder="Ej. Martín López" />
                </label>

                <label>
                  Email
                  <input placeholder="martin@email.com" type="email" />
                </label>

                <label>
                  Especialidad
                  <select>
                    <option>Seleccionar</option>
                    <option>Musculación</option>
                    <option>Funcional</option>
                    <option>Spinning</option>
                    <option>Yoga</option>
                    <option>Cross Training</option>
                  </select>
                </label>

                <label>
                  Años de experiencia
                  <input placeholder="Ej. 4" type="number" />
                </label>

                <label className="full">
                  Breve descripción
                  <textarea
                    placeholder="Contanos sobre tu experiencia..."
                    rows="5"
                  ></textarea>
                </label>
              </div>

              <button
                className="primary-button"
                onClick={() => setSubmitted(true)}
              >
                Enviar solicitud
                <Icon name="arrow" size={17} />
              </button>
            </>
          ) : (
            <div className="success-state">
              <div className="success-icon">
                <Icon name="check" size={30} />
              </div>

              <div className="eyebrow">SOLICITUD ENVIADA</div>
              <h2>¡Gracias por postularte!</h2>
              <p>
                Revisaremos tus datos y te enviaremos una respuesta por email
                cuando finalice el proceso.
              </p>
            </div>
          )}
        </section>

        <aside className="info-card">
          <div className="eyebrow">¿CÓMO FUNCIONA?</div>
          <h3>Tu perfil, tus reglas.</h3>

          <div className="info-step">
            <div>01</div>
            <span>Completás tu perfil</span>
          </div>

          <div className="info-step">
            <div>02</div>
            <span>Revisamos tu solicitud</span>
          </div>

          <div className="info-step">
            <div>03</div>
            <span>Publicamos tus clases</span>
          </div>

          <div className="info-step">
            <div>04</div>
            <span>Empezás a entrenar</span>
          </div>
        </aside>
      </div>
    </>
  );
}
export default Professor;
