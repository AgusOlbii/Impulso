import { useState } from "react";
import Header from "./Header";
import Icon from "./Icon";
import professors from "../../data/professors";
import estadoEleccion from "../../config/reglasProfesor";

const specialties = [
  "Todos",
  "Fuerza",
  "Cardio",
  "Musculación",
  "Funcional",
  "Cross Training",
  "Movilidad",
];

const contentByRol = {
  profesor: {
    eyebrow: "RED DE PROFESIONALES",
    title: "Comunidad de Profesores",
    heroTitle: "Conectá con colegas de Impulso.",
    heroDescription:
      "Explorá el equipo de profesionales, especialidades y referencias del staff.",
    showHireButton: false,
  },
  alumno: {
    eyebrow: "ENTRENAMIENTO PERSONAL",
    title: "Encontrá tu profesor",
    heroTitle: "Un plan pensado para vos.",
    heroDescription:
      "Elegí un especialista, coordiná tu primera sesión y empezá a trabajar en tus objetivos.",
    showHireButton: true,
  },
};

function textoBoton(estado) {
  if (estado === "ya_elegido") return "Elegido";
  if (estado === "cambiar") return "Cambiar";
  if (estado === "no_disponible") return "No disponible";
  return "Contratar";
}

function Profesores({ user, profesorElegidoId, onElegir, onDejar }) {
  const [filter, setFilter] = useState("Todos");
  const [notice, setNotice] = useState("");
  const copy = contentByRol[user?.rol] || contentByRol.alumno;
  const socio = { id: user?.id, profesorId: profesorElegidoId };
  const visibleCoaches =
    filter === "Todos"
      ? professors
      : professors.filter((coach) => coach.specialty === filter);

  return (
    <>
      <Header eyebrow={copy.eyebrow} title={copy.title} />
      <section className="coach-intro">
        <div>
          <span className="hero-kicker">
            <span /> PROFESIONALES DE IMPULSO
          </span>
          <h2>{copy.heroTitle}</h2>
          <p>{copy.heroDescription}</p>
        </div>
        <div className="coach-intro-proof">
          <strong>{professors.length}</strong>
          <span>
            profesionales
            <br />
            certificados
          </span>
          <i />
          <strong>4,9</strong>
          <span>
            valoración
            <br />
            promedio
          </span>
        </div>
      </section>

      <div className="coach-toolbar">
        <div>
          <span className="eyebrow">ELEGÍ TU ESPECIALIDAD</span>
          <div className="coach-filters">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                type="button"
                className={`filter ${filter === specialty ? "active" : ""}`}
                onClick={() => setFilter(specialty)}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>
        <span className="coach-count">
          {visibleCoaches.length} profesores disponibles
        </span>
      </div>

      {notice && (
        <div className="success-message coach-notice">
          <Icon name="check" size={18} />
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Cerrar notificación">
            ×
          </button>
        </div>
      )}

      <section className="coach-grid">
        {visibleCoaches.map((coach) => {
          const estado = estadoEleccion(socio, coach);
          const puedeClick =
            estado === "puede" ||
            estado === "cambiar" ||
            estado === "ya_elegido";

          return (
            <article className="coach-card" key={coach.id}>
              <div className="coach-photo">
                <img
                  src={coach.image}
                  alt={`${coach.name}, profesor de ${coach.specialty}`}
                  style={{ objectPosition: coach.position }}
                />
                {(!coach.status || coach.status === "approved") && (
                  <span className="coach-available">
                    <i /> Disponible
                  </span>
                )}
                <span className="coach-specialty">{coach.specialty}</span>
              </div>
              <div className="coach-card-body">
                <div className="coach-name-row">
                  <div>
                    <h3>{coach.name}</h3>
                    <span>{coach.experience}</span>
                  </div>
                  <span className="coach-rating">
                    <Icon name="star" size={14} />
                    <strong>{coach.rating}</strong>
                    <small>({coach.reviews})</small>
                  </span>
                </div>
                <p>{coach.description}</p>
                <div className="coach-card-footer">
                  <div>
                    <span>DESDE</span>
                    <strong>{coach.price}</strong>
                    <small>/ mes</small>
                  </div>
                  {copy.showHireButton && (
                    <button
                      type="button"
                      disabled={!puedeClick}
                      className={`hire-button ${estado === "ya_elegido" ? "hired" : ""}`}
                      onClick={() => {
                        if (estado === "ya_elegido") {
                          onDejar();
                          setNotice(`Dejaste de entrenar con ${coach.name}.`);
                          return;
                        }
                        onElegir(coach.id);
                        setNotice(`Contrataste a ${coach.name}. Tu rutina ya está en Mi rutina.`);
                      }}
                    >
                      {estado === "ya_elegido" ? (
                        <>
                          <Icon name="check" size={16} /> {textoBoton(estado)}
                        </>
                      ) : (
                        <>
                          {textoBoton(estado)} <Icon name="arrow" size={16} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

export default Profesores;
