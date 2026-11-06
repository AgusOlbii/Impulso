import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Icon from "../common/Icon";
import { coachService } from "../../services/coach.service";
import { routineService } from "../../services/routine.service";
import { reviewService } from "../../services/review.service";
import { mediaUrl } from "../../utils/media";
import RatingStars from "../common/RatingStars";

function Routine({ profesorElegidoId }) {
  const navigate = useNavigate();
  const [diaActivo, setDiaActivo] = useState();
  const [completed, setCompleted] = useState([]);
  const [profesor, setProfesor] = useState(null);
  const [rutinaSemanal, setRutinaSemanal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [nota, setNota] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingNotice, setRatingNotice] = useState("");

  useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        const [coachesData, routineData] = await Promise.all([
          coachService.list(),
          routineService.mine(),
        ]);
        if (cancel) return;
        const found = (coachesData.coaches || []).find(
          (item) => item.id === profesorElegidoId
        );
        setProfesor(found || (profesorElegidoId ? { name: "Tu profesor", specialty: "" } : null));
        const days = routineData.days?.length ? routineData.days : [];
        setRutinaSemanal(days);
        setCompleted(
          days.flatMap((item) =>
            item.ejercicios.filter((ejercicio) => ejercicio.completed).map((ejercicio) => ejercicio.id)
          )
        );
        setNota(routineData.routine?.description || "");
        if (profesorElegidoId) {
          try {
            const reviewData = await reviewService.mine();
            if (!cancel) setRating(reviewData.review?.rating || 0);
          } catch {
            if (!cancel) setRating(0);
          }
        }
        if (routineData.routine) {
          setProfesor((actual) => ({
            ...(actual || {}),
            name: routineData.routine.coach_name || actual?.name,
            specialty: routineData.routine.coach_specialty || actual?.specialty,
            image: routineData.routine.coach_image || actual?.image,
          }));
        }
      } catch {
        if (!cancel) {
          setProfesor(profesorElegidoId ? { name: "Tu profesor", specialty: "" } : null);
          setRutinaSemanal([]);
          setNota("");
        }
      } finally {
        if (!cancel) setCargando(false);
      }
    }
    load();
    return () => {
      cancel = true;
    };
  }, [profesorElegidoId]);
  const dia =
    diaActivo === null
      ? null
      : rutinaSemanal?.find((item) => item.id === diaActivo) ??
        rutinaSemanal?.[0] ??
        null;
  const totalDia = dia ? dia.ejercicios.length : 0;
  const hechosDia = dia
    ? dia.ejercicios.filter((ejercicio) => completed.includes(ejercicio.id))
        .length
    : 0;
  const progreso = totalDia ? (hechosDia / totalDia) * 100 : 0;

  const saveRating = async (score) => {
    setRating(score);
    try {
      await reviewService.save({ rating: score });
      setRatingNotice("Valoración enviada. Tu profesor la va a ver en su perfil.");
    } catch (err) {
      setRatingNotice(err.message || "No se pudo guardar la valoración.");
    }
  };

  const toggleDia = (id) => {
    setDiaActivo((actual) => (actual === id ? null : id));
  };

  const currentValue = (exercise, field) => {
    if (field === "sets") return exercise.actual_sets ?? exercise.sets;
    if (field === "reps") return exercise.actual_reps ?? exercise.reps;
    return exercise.actual_weight ?? exercise.target_weight ?? 0;
  };

  const patchExercise = (id, fields) => {
    setRutinaSemanal((days) =>
      (days || []).map((item) => ({
        ...item,
        ejercicios: item.ejercicios.map((ejercicio) =>
          ejercicio.id === id ? { ...ejercicio, ...fields } : ejercicio
        ),
      }))
    );
  };

  const toggleEjercicio = async (id) => {
    const done = !completed.includes(id);
    setCompleted((lista) =>
      done ? [...lista, id] : lista.filter((item) => item !== id)
    );
    try {
      await routineService.logProgress(id, { completed: done });
    } catch {
      setCompleted((lista) =>
        done ? lista.filter((item) => item !== id) : [...lista, id]
      );
    }
  };

  const adjustExercise = async (exercise, field, amount) => {
    const min = field === "weight" ? 0 : 1;
    const max = field === "sets" ? 10 : field === "weight" ? 200 : 30;
    const next = Math.max(min, Math.min(max, currentValue(exercise, field) + amount));
    const payload = {
      actual_sets: field === "sets" ? next : currentValue(exercise, "sets"),
      actual_reps: field === "reps" ? next : currentValue(exercise, "reps"),
      actual_weight: field === "weight" ? next : currentValue(exercise, "weight"),
    };
    const adjusted =
      payload.actual_sets !== Number(exercise.sets) ||
      payload.actual_reps !== Number(exercise.reps) ||
      payload.actual_weight !== Number(exercise.target_weight);
    patchExercise(exercise.id, { ...payload, adjusted });
    try {
      await routineService.logProgress(exercise.id, payload);
    } catch {
      patchExercise(exercise.id, {
        actual_sets: exercise.actual_sets,
        actual_reps: exercise.actual_reps,
        actual_weight: exercise.actual_weight,
        adjusted: exercise.adjusted,
      });
    }
  };

  if (cargando) {
    return <Header eyebrow="PLAN PERSONALIZADO" title="Mi rutina" />;
  }

  if (!profesorElegidoId) {
    return (
      <>
        <Header eyebrow="PLAN PERSONALIZADO" title="Mi rutina" />
        <section className="creator-heading">
          <div>
            <span className="tag bright">SIN ENTRENADOR</span>
            <h2>Todavía no elegiste profesor.</h2>
            <p>
              Contratá un entrenador en Profesores y acá vas a ver la rutina
              que armó para la semana.
            </p>
          </div>
          <button className="primary-button" onClick={() => navigate("/profesores")}>
            Ver profesores
            <Icon name="arrow" size={16} />
          </button>
        </section>
      </>
    );
  }

  if (!rutinaSemanal?.length) {
    return (
      <>
        <Header eyebrow="PLAN PERSONALIZADO" title="Mi rutina" />
        <section className="creator-heading">
          <div>
            <span className="tag bright">SIN RUTINA</span>
            <h2>Tu profesor todavía no cargó la semana.</h2>
            <p>
              Ya estás con {profesor?.name || "tu entrenador"}. Cuando arme el
              plan, los ejercicios aparecen acá.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Header eyebrow="PLAN PERSONALIZADO" title="Mi rutina" />
      <div className="routine-banner">
        <div>
          <span className="tag bright">
            {dia ? dia.nombre.toUpperCase() : "ELEGÍ UN DÍA"}
          </span>
          <h2>{dia ? dia.titulo : "Tu semana de entrenamiento"}</h2>
          <p>
            Diseñada por {profesor.name} · {profesor.specialty}
          </p>
        </div>
        <div
          className="routine-progress"
          style={{ "--progress": `${progreso}%` }}
        >
          <div className="routine-progress-inner">
            <strong>
              {hechosDia}/{totalDia || 0}
            </strong>
            <span>ejercicios</span>
          </div>
        </div>
      </div>
      <div className="routine-layout">
        <section>
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">SEMANA</span>
              <h2>Días de entrenamiento</h2>
            </div>
            <span className="duration">
              <Icon name="clock" size={17} /> 50–60 min
            </span>
          </div>

          <div className="routine-days">
            {rutinaSemanal.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`routine-day ${dia?.id === item.id ? "active" : ""}`}
                onClick={() => toggleDia(item.id)}
              >
                {item.nombre}
              </button>
            ))}
          </div>

          {dia && (
            <div className="exercise-list">
              {dia.ejercicios.map((exercise) => {
                const done = completed.includes(exercise.id);
                const sets = currentValue(exercise, "sets");
                const reps = currentValue(exercise, "reps");
                const weight = currentValue(exercise, "weight");
                return (
                  <article
                    className={`exercise ${done ? "done" : ""} ${exercise.adjusted ? "adjusted" : ""}`}
                    key={exercise.id}
                  >
                    <button
                      type="button"
                      className="exercise-number"
                      onClick={() => toggleEjercicio(exercise.id)}
                      aria-label={done ? `Desmarcar ${exercise.name}` : `Completar ${exercise.name}`}
                    >
                      {done ? <Icon name="check" size={18} /> : exercise.number}
                    </button>
                    <span className="exercise-name">
                      <strong>{exercise.name}</strong>
                      <small>
                        {sets} x {reps}
                        {exercise.adjusted
                          ? ` · asignado ${exercise.target_weight} kg`
                          : ""}
                      </small>
                    </span>
                    <span className="muscle">{exercise.muscle}</span>
                    <span className="weight">
                      <strong>{weight} kg</strong>
                      <small>{exercise.adjusted ? "TU PESO" : "PESO"}</small>
                    </span>
                    <div className="exercise-adjust">
                      <div>
                        <label>SERIES</label>
                        <span className="stepper">
                          <button type="button" onClick={() => adjustExercise(exercise, "sets", -1)}>−</button>
                          <strong>{sets}</strong>
                          <button type="button" onClick={() => adjustExercise(exercise, "sets", 1)}>+</button>
                        </span>
                      </div>
                      <div>
                        <label>REPS</label>
                        <span className="stepper">
                          <button type="button" onClick={() => adjustExercise(exercise, "reps", -1)}>−</button>
                          <strong>{reps}</strong>
                          <button type="button" onClick={() => adjustExercise(exercise, "reps", 1)}>+</button>
                        </span>
                      </div>
                      <div>
                        <label>PESO</label>
                        <span className="stepper">
                          <button type="button" onClick={() => adjustExercise(exercise, "weight", -1)}>−</button>
                          <strong>{weight}</strong>
                          <button type="button" onClick={() => adjustExercise(exercise, "weight", 1)}>+</button>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        <aside className="coach-note">
          <img
            className="avatar coach"
            src={mediaUrl(profesor.image || profesor.photo)}
            alt={profesor.name}
            style={{ objectPosition: profesor.position || "center 20%" }}
          />
          <span className="eyebrow">NOTA DE TU ENTRENADOR</span>
          <p>
            {nota
              ? `“${nota}”`
              : "Tu profesor todavía no dejó una nota para esta rutina."}
          </p>
          <strong>{profesor.name}</strong>
          <small>{profesor.specialty}</small>
          <div className="plan-rate">
            <span>Valorá esta rutina</span>
            <RatingStars value={rating} onChange={saveRating} />
            {ratingNotice && <small>{ratingNotice}</small>}
          </div>
        </aside>
      </div>
    </>
  );
}

export default Routine;
