import { useEffect, useState } from "react";
import Header from "./Header";
import Icon from "./Icon";
import demoProfessors from "../../data/professors";
import estadoEleccion from "../../config/reglasProfesor";
import { coachService } from "../../services/coach.service";
import { mediaUrl } from "../../utils/media";
import { reviewService } from "../../services/review.service";
import RatingStars from "./RatingStars";

const PAGE_SIZE = 6;

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
  coach: {
    eyebrow: "RED DE PROFESIONALES",
    title: "Comunidad de Profesores",
    heroTitle: "Conectá con colegas de Impulso.",
    heroDescription:
      "Explorá el equipo de profesionales, especialidades y referencias del staff.",
    showHireButton: false,
  },
  admin: {
    eyebrow: "EQUIPO DE IMPULSO",
    title: "Profesores",
    heroTitle: "El staff activo de Impulso.",
    heroDescription:
      "Consultá el equipo de profesionales. Desde acá solo podés verlos; las altas y bajas se hacen en Administración.",
    showHireButton: false,
  },
  student: {
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
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");
  const [pendiente, setPendiente] = useState(null);
  const [approved, setApproved] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const copy = contentByRol[user?.rol] || contentByRol.student;
  const professors = [...approved, ...demoProfessors];
  const socio = { id: user?.id, profesorId: profesorElegidoId };
  const profesorActual = professors.find((item) => item.id === profesorElegidoId);
  const visibleCoaches =
    filter === "Todos"
      ? professors
      : professors.filter((coach) => coach.specialty === filter);
  const totalPages = Math.max(1, Math.ceil(visibleCoaches.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedCoaches = visibleCoaches.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const rated = professors.filter((coach) => Number(coach.reviews) > 0);
  const averageRating = rated.length
    ? (
        rated.reduce(
          (total, coach) => total + Number(String(coach.rating).replace(",", ".")),
          0
        ) / rated.length
      )
        .toFixed(1)
        .replace(".", ",")
    : "—";

  const loadCoaches = () =>
    coachService
      .list()
      .then((data) => setApproved(data.coaches || []))
      .catch(() => setApproved([]));

  useEffect(() => {
    loadCoaches();
  }, []);

  useEffect(() => {
    if (!profesorElegidoId || Number(profesorElegidoId) >= 9000) {
      setMyRating(0);
      return;
    }
    reviewService
      .mine(profesorElegidoId)
      .then((data) => setMyRating(Number(data.review?.rating) || 0))
      .catch(() => setMyRating(0));
  }, [profesorElegidoId]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const cerrarPendiente = () => setPendiente(null);

  const contratar = async (coach) => {
    try {
      await onElegir(coach.id);
      cerrarPendiente();
      setNotice(`Contrataste a ${coach.name}. Tu rutina ya está en Mi rutina.`);
    } catch (error) {
      setNotice(error.message || "No se pudo contratar al profesor.");
    }
  };

  const dejar = async (coach) => {
    try {
      await onDejar();
      cerrarPendiente();
      setNotice(`Dejaste de entrenar con ${coach.name}.`);
    } catch (error) {
      setNotice(error.message || "No se pudo dejar al profesor.");
    }
  };

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
          <strong>{averageRating}</strong>
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
                onClick={() => {
                  setFilter(specialty);
                  setPage(1);
                }}
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
        {pagedCoaches.map((coach) => {
          const estado = estadoEleccion(socio, coach);
          const puedeClick =
            estado === "puede" ||
            estado === "cambiar" ||
            estado === "ya_elegido";

          return (
            <article className="coach-card" key={coach.id}>
              <div className="coach-photo">
                <img
                  src={mediaUrl(coach.image) || coach.image}
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
                    <small>({Number(coach.reviews) || 0})</small>
                  </span>
                </div>
                {coach.description?.trim() ? <p>{coach.description}</p> : <p>Todavía no cargó una presentación.</p>}
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
                          setPendiente({ accion: "dejar", coach });
                          return;
                        }
                        setPendiente({ accion: "contratar", coach });
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
                {copy.showHireButton && estado === "ya_elegido" && Number(coach.id) < 9000 && (
                  <div className="coach-rate">
                    <span>Calificar</span>
                    <RatingStars
                      value={myRating}
                      onChange={async (rating) => {
                        const previous = myRating;
                        setMyRating(rating);
                        try {
                          await reviewService.save({ coachId: coach.id, rating });
                          await loadCoaches();
                        } catch (error) {
                          setMyRating(previous);
                          setNotice(error.message || "No se pudo guardar la calificación.");
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {totalPages > 1 && (
        <div className="coach-pagination">
          <button
            type="button"
            className="icon-button coach-page-prev"
            disabled={currentPage <= 1}
            onClick={() => setPage((actual) => Math.max(1, actual - 1))}
            aria-label="Página anterior"
          >
            <Icon name="arrow" size={18} />
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            className="icon-button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((actual) => Math.min(totalPages, actual + 1))}
            aria-label="Página siguiente"
          >
            <Icon name="arrow" size={18} />
          </button>
        </div>
      )}

      {pendiente && (
        <div className="confirm-overlay" onClick={cerrarPendiente}>
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-change-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="eyebrow">
              {pendiente.accion === "dejar"
                ? "DEJAR PROFESOR"
                : profesorActual
                  ? "CAMBIO DE PROFESOR"
                  : "CONTRATAR PROFESOR"}
            </span>
            <h3 id="confirm-change-title">
              {pendiente.accion === "dejar"
                ? `¿Dejar de entrenar con ${pendiente.coach.name}?`
                : profesorActual
                  ? "¿Cambiar de entrenador?"
                  : `¿Contratar a ${pendiente.coach.name}?`}
            </h3>
            <p>
              {pendiente.accion === "dejar" ? (
                <>
                  Vas a quedar sin profesor asignado. Tu rutina se mantiene
                  hasta que elijas otro entrenador.
                </>
              ) : profesorActual ? (
                <>
                  Hoy entrenás con <strong>{profesorActual.name}</strong>. Si
                  pasás a <strong>{pendiente.coach.name}</strong>, se reemplaza
                  tu rutina semanal por la de esa persona.
                </>
              ) : (
                <>
                  Vas a entrenar con <strong>{pendiente.coach.name}</strong>{" "}
                  ({pendiente.coach.specialty}). En Mi rutina vas a ver el plan
                  semanal que armó para vos.
                </>
              )}
            </p>
            <div className="confirm-actions">
              <button type="button" className="text-button" onClick={cerrarPendiente}>
                {pendiente.accion === "dejar"
                  ? "Seguir con este profesor"
                  : profesorActual
                    ? `Seguir con ${profesorActual.name.split(" ")[0]}`
                    : "Cancelar"}
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  pendiente.accion === "dejar"
                    ? dejar(pendiente.coach)
                    : contratar(pendiente.coach)
                }
              >
                {pendiente.accion === "dejar"
                  ? "Sí, dejar"
                  : profesorActual
                    ? "Sí, cambiar"
                    : "Sí, contratar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profesores;
