import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Icon from "../common/Icon";
import { coachService } from "../../services/coach.service";
import { routineService } from "../../services/routine.service";
import { mediaUrl } from "../../utils/media";
import { asNumber, assignedLabel } from "../../utils/routineChanges";
import StepperField, { parseStepperValue, stepperNumber } from "../common/StepperField";

function currentValue(exercise, actualKey, targetKey) {
  return asNumber(exercise[actualKey]) ?? asNumber(exercise[targetKey]) ?? 0;
}

function Routine({ user, profesorElegidoId }) {
  const navigate = useNavigate();
  const [routine, setRoutine] = useState(null);
  const [profesor, setProfesor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diaActivo, setDiaActivo] = useState(null);
  const [edits, setEdits] = useState({});
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      routineService.mine().catch(() => ({ routine: null })),
      coachService.list().catch(() => ({ coaches: [] })),
    ]).then(([routineData, coachData]) => {
      if (!active) return;
      setRoutine(routineData.routine || null);
      const coaches = coachData.coaches || [];
      setProfesor(
        coaches.find((item) => Number(item.id) === Number(profesorElegidoId || user?.coach_id)) || null,
      );
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [profesorElegidoId, user?.coach_id]);

  const days = useMemo(() => {
    const seen = [];
    (routine?.exercises || []).forEach((exercise) => {
      if (exercise.day_of_week && !seen.includes(exercise.day_of_week)) {
        seen.push(exercise.day_of_week);
      }
    });
    return seen;
  }, [routine]);

  const dia = diaActivo && days.includes(diaActivo) ? diaActivo : days[0] || null;
  const ejercicios = (routine?.exercises || []).filter((item) => item.day_of_week === dia);
  const baselineOf = (exercise) => ({
    sets: currentValue(exercise, "actual_sets", "target_sets"),
    reps: currentValue(exercise, "actual_reps", "target_reps"),
    weight: currentValue(exercise, "actual_weight", "target_weight"),
  });

  const updateEdit = (exercise, field, amount, raw) => {
    const key = String(exercise.routine_exercise_id);
    const decimal = field === "weight";
    setEdits((actual) => {
      const current = actual[key] || baselineOf(exercise);
      const next = raw !== undefined
        ? parseStepperValue(raw, { decimal })
        : Math.max(0, stepperNumber(current[field]) + amount);
      return {
        ...actual,
        [key]: {
          ...current,
          [field]: next,
        },
      };
    });
    setNotice("");
  };

  const valueOf = (exercise, field) => {
    const edited = edits[String(exercise.routine_exercise_id)];
    if (edited) return edited[field];
    return baselineOf(exercise)[field];
  };

  const dirtyExercises = ejercicios.filter((exercise) => {
    const edited = edits[String(exercise.routine_exercise_id)];
    if (!edited) return false;
    const baseline = baselineOf(exercise);
    return edited.sets !== baseline.sets || edited.reps !== baseline.reps || edited.weight !== baseline.weight;
  });

  const saveDay = async () => {
    if (dirtyExercises.length === 0) return;
    setSaving(true);
    setNotice("");
    try {
      await Promise.all(
        dirtyExercises.map((exercise) =>
          routineService.saveProgress(exercise.routine_exercise_id, {
            actual_sets: valueOf(exercise, "sets"),
            actual_reps: valueOf(exercise, "reps"),
            actual_weight: valueOf(exercise, "weight"),
          }),
        ),
      );
      const data = await routineService.mine();
      setRoutine(data.routine || null);
      setEdits({});
      setNotice("Guardamos tus cambios. Tu profesor va a ver el aviso, sin modificar lo que te asignó.");
    } catch (error) {
      setNotice(error.message || "No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header eyebrow="PLAN PERSONALIZADO" title="Mi rutina" />
        <section className="creator-heading">
          <div>
            <span className="tag bright">CARGANDO</span>
            <h2>Estamos trayendo tu plan.</h2>
          </div>
        </section>
      </>
    );
  }

  if (!routine) {
    return (
      <>
        <Header eyebrow="PLAN PERSONALIZADO" title="Mi rutina" />
        <section className="creator-heading">
          <div>
            <span className="tag bright">{profesorElegidoId ? "SIN RUTINA" : "SIN ENTRENADOR"}</span>
            <h2>
              {profesorElegidoId
                ? "Tu profesor todavía no te asignó una rutina."
                : "Todavía no elegiste profesor."}
            </h2>
            <p>
              {profesorElegidoId
                ? "Cuando arme tu plan, vas a poder bajar series, repeticiones o peso y avisarle."
                : "Contratá un entrenador en Profesores y acá vas a ver la rutina que armó para la semana."}
            </p>
          </div>
          {!profesorElegidoId && (
            <button className="primary-button" onClick={() => navigate("/profesores")}>
              Ver profesores
              <Icon name="arrow" size={16} />
            </button>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <Header eyebrow="PLAN PERSONALIZADO" title="Mi rutina" />
      <div className="routine-banner">
        <div>
          <span className="tag bright">{dia ? dia.toUpperCase() : "ELEGÍ UN DÍA"}</span>
          <h2>{routine.title || "Tu semana de entrenamiento"}</h2>
          <p>
            {profesor
              ? `Diseñada por ${profesor.name} ${profesor.lastname || ""} · ${profesor.specialty || ""}`
              : "Mantenés tu rutina. Ahora no tenés profesor asignado."}
          </p>
        </div>
      </div>
      <div className="routine-layout">
        <section>
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">SEMANA</span>
              <h2>Días de entrenamiento</h2>
            </div>
          </div>

          <div className="routine-days">
            {days.map((item) => (
              <button
                key={item}
                type="button"
                className={`routine-day ${dia === item ? "active" : ""}`}
                onClick={() => setDiaActivo(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {notice && (
            <div className="success-message creator-notice">
              <span>{notice}</span>
            </div>
          )}

          {dia && (
            <div className="exercise-list">
              {ejercicios.map((exercise, index) => (
                <article className="exercise editable" key={exercise.routine_exercise_id}>
                  <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="exercise-name">
                    <strong>{exercise.name}</strong>
                    <small>Asignado: {assignedLabel(exercise)}</small>
                  </span>
                  <span className="muscle">{exercise.muscle_group}</span>
                  <div className="exercise-config triple">
                    <div>
                      <label>SERIES</label>
                      <StepperField
                        label={`series de ${exercise.name}`}
                        value={valueOf(exercise, "sets")}
                        onStep={(amount) => updateEdit(exercise, "sets", amount)}
                        onChange={(raw) => updateEdit(exercise, "sets", 0, raw)}
                      />
                    </div>
                    <div>
                      <label>REPETICIONES</label>
                      <StepperField
                        label={`repeticiones de ${exercise.name}`}
                        value={valueOf(exercise, "reps")}
                        onStep={(amount) => updateEdit(exercise, "reps", amount)}
                        onChange={(raw) => updateEdit(exercise, "reps", 0, raw)}
                      />
                    </div>
                    <div>
                      <label>PESO</label>
                      <StepperField
                        label={`peso de ${exercise.name}`}
                        decimal
                        value={valueOf(exercise, "weight")}
                        onStep={(amount) => updateEdit(exercise, "weight", amount)}
                        onChange={(raw) => updateEdit(exercise, "weight", 0, raw)}
                      />
                    </div>
                  </div>
                </article>
              ))}
              <button className="primary-button creator-save" disabled={saving || dirtyExercises.length === 0} onClick={saveDay}>
                <Icon name="check" size={17} /> {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          )}
        </section>
        <aside className="coach-note">
          {profesor?.image && (
            <img
              className="avatar coach"
              src={mediaUrl(profesor.image)}
              alt={profesor.name}
            />
          )}
          <span className="eyebrow">{profesor ? "NOTA DE TU ENTRENADOR" : "SIN PROFESOR"}</span>
          <p>
            {user?.coach_note?.trim()
              ? `“${user.coach_note}”`
              : profesor
                ? "Tu profesor todavía no dejó una nota."
                : "Tu rutina se mantiene. Podés elegir un nuevo profesor en Profesores."}
          </p>
          {profesor ? (
            <>
              <strong>{profesor.name} {profesor.lastname || ""}</strong>
              <small>{profesor.specialty}</small>
            </>
          ) : (
            <button className="text-button" type="button" onClick={() => navigate("/profesores")}>
              Ver profesores
              <Icon name="arrow" size={16} />
            </button>
          )}
        </aside>
      </div>
    </>
  );
}

export default Routine;
