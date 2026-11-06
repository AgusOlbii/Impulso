import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../common/Icon";
import Header from "../common/Header";
import { coachService } from "../../services/coach.service";
import { routineService } from "../../services/routine.service";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function stillAdjusted(exercise) {
  const hasActual =
    exercise.actual_sets != null ||
    exercise.actual_reps != null ||
    exercise.actual_weight != null;
  if (!hasActual) return false;
  return (
    (exercise.actual_sets != null && Number(exercise.actual_sets) !== Number(exercise.sets)) ||
    (exercise.actual_reps != null && Number(exercise.actual_reps) !== Number(exercise.reps)) ||
    (exercise.actual_weight != null && Number(exercise.actual_weight) !== Number(exercise.weight))
  );
}
const exerciseLibrary = [
  { id: "sentadilla", name: "Sentadilla con barra", category: "Piernas", equipment: "Barra olímpica" },
  { id: "peso-muerto", name: "Peso muerto rumano", category: "Piernas", equipment: "Barra olímpica" },
  { id: "prensa", name: "Prensa inclinada", category: "Piernas", equipment: "Máquina" },
  { id: "hip-thrust", name: "Hip thrust", category: "Glúteos", equipment: "Barra y banco" },
  { id: "press-banca", name: "Press de banca", category: "Pecho", equipment: "Barra y banco" },
  { id: "remo", name: "Remo con mancuerna", category: "Espalda", equipment: "Mancuerna" },
  { id: "dominadas", name: "Dominadas asistidas", category: "Espalda", equipment: "Máquina" },
  { id: "press-militar", name: "Press militar", category: "Hombros", equipment: "Mancuernas" },
  { id: "curl-biceps", name: "Curl de bíceps", category: "Brazos", equipment: "Mancuernas" },
  { id: "plancha", name: "Plancha frontal", category: "Core", equipment: "Peso corporal" },
];


function CreateRoutine() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState(searchParams.get("studentId") || "");
  const [day, setDay] = useState("Lunes");
  const [title, setTitle] = useState("Rutina semanal");
  const [note, setNote] = useState("");
  const savedTimer = useRef(null);
  const isFreshBatch = useRef(false);

  useEffect(() => {
    coachService.myStudents().then((data) => {
      const lista = data.students || [];
      setStudents(lista);
      if (!studentId && lista[0]) setStudentId(String(lista[0].id));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!studentId) return;
    routineService.byStudent(studentId).then((data) => {
      setTitle(data.routine?.title || "Rutina semanal");
      setNote(data.routine?.description || "");
      if (!data.days?.length) {
        setSelected([]);
        isFreshBatch.current = false;
        return;
      }
      const loaded = data.days.flatMap((dia) =>
        dia.ejercicios.map((ejercicio) => ({
          id: `${ejercicio.exercise_id}-${ejercicio.day_of_week}`,
          name: ejercicio.name,
          category: ejercicio.muscle,
          sets: ejercicio.sets,
          reps: ejercicio.reps,
          weight: Number(ejercicio.target_weight) || 0,
          day_of_week: ejercicio.day_of_week,
          actual_sets: ejercicio.actual_sets,
          actual_reps: ejercicio.actual_reps,
          actual_weight: ejercicio.actual_weight,
          adjusted: ejercicio.adjusted,
        }))
      );
      setSelected(loaded);
      isFreshBatch.current = false;
    }).catch(() => {});
  }, [studentId]);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  const filteredExercises = exerciseLibrary.filter((exercise) =>
    `${exercise.name} ${exercise.category} ${exercise.equipment}`.toLowerCase().includes(query.toLowerCase()),
  );

  const addExercise = (exercise) => {
    const uid = `${exercise.name}-${day}`;
    if (selected.some((item) => item.id === uid)) return;
    setSelected([
      ...selected,
      { ...exercise, id: uid, sets: 3, reps: 10, weight: 0, day_of_week: day },
    ]);
    setSaved(false);
  };

  const updateExercise = (id, field, amount) => {
    setSelected(selected.map((exercise) => {
      if (exercise.id !== id) return exercise;
      const next = {
        ...exercise,
        [field]: Math.max(
          field === "weight" ? 0 : 1,
          Math.min(field === "sets" ? 10 : field === "weight" ? 200 : 30, exercise[field] + amount)
        ),
      };
      return { ...next, adjusted: stillAdjusted(next) };
    }));
    setSaved(false);
  };

  const removeExercise = (id) => {
    setSelected(selected.filter((exercise) => exercise.id !== id));
    setSaved(false);
  };

  return (
    <>
      <Header eyebrow="PLANIFICACIÓN DE ENTRENAMIENTO" title="Crear Rutina" />
      <section className="creator-heading">
        <div>
          <span className="tag bright">NUEVO PLAN</span>
          <h2>Construí una rutina a tu medida.</h2>
          <p>Elegí el alumno, el día, agregá ejercicios y definí series, reps y peso.</p>
        </div>
        <div className="creator-summary">
          <span><strong>{selected.length}</strong> ejercicios</span>
          <i />
          <span><strong>{selected.reduce((total, exercise) => total + exercise.sets, 0)}</strong> series totales</span>
        </div>
      </section>

      {error && <p className="apply-error">{error}</p>}
      {saved && <div className="success-message creator-notice"><Icon name="check" size={18} /><span>La rutina fue guardada correctamente.</span></div>}

      <div className="builder-fields" style={{ margin: "0 0 16px" }}>
        <label>
          <span>Alumno</span>
          <select value={studentId} onChange={(event) => setStudentId(event.target.value)}>
            <option value="">Elegí un alumno</option>
            {students.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} {item.lastname}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Día para los ejercicios nuevos</span>
          <select value={day} onChange={(event) => setDay(event.target.value)}>
            {daysOfWeek.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Nombre de la rutina</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="builder-note">
          <span>Nota para el alumno</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Este texto aparece en Mi rutina, al lado de los ejercicios."
          />
        </label>
      </div>

      <div className="routine-creator-layout">
        <section className="exercise-library-panel">
          <div className="creator-panel-head">
            <div><span className="eyebrow">BIBLIOTECA</span><h2>Buscar ejercicios</h2></div>
            <span>{filteredExercises.length} resultados</span>
          </div>
          <label className="exercise-search">
            <Icon name="search" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por ejercicio, grupo muscular o equipo..." />
            {query && <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda">×</button>}
          </label>
          <div className="library-list">
            {filteredExercises.length === 0 && (
              <div className="library-empty"><Icon name="search" /><strong>No encontramos ejercicios</strong><span>Probá con otro nombre o grupo muscular.</span></div>
            )}
            {filteredExercises.map((exercise) => {
              const added = selected.some((item) => item.id === `${exercise.name}-${day}`);
              return (
                <article className="library-exercise" key={exercise.id}>
                  <span className="library-icon"><Icon name="dumbbell" size={18} /></span>
                  <div><strong>{exercise.name}</strong><small>{exercise.category} · {exercise.equipment}</small></div>
                  <button className={added ? "add-library-button added" : "add-library-button"} onClick={() => addExercise(exercise)} disabled={added}>
                    {added ? <><Icon name="check" size={15} /> Agregado</> : <><Icon name="plus" size={15} /> Agregar</>}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="selected-exercises-panel">
          <div className="creator-panel-head">
            <div><span className="eyebrow">TU SELECCIÓN</span><h2>Ejercicios de la rutina</h2></div>
            <span>{selected.length}/10</span>
          </div>
          {selected.length === 0 ? (
            <div className="routine-empty">
              <span><Icon name="clipboard" size={25} /></span>
              <strong>Tu rutina está vacía</strong>
              <p>Agregá ejercicios desde la biblioteca para configurar sus series y repeticiones.</p>
            </div>
          ) : (
            <div className="selected-exercise-list">
              {selected.map((exercise, index) => (
                <article className={`selected-exercise ${exercise.adjusted ? "adjusted" : ""}`} key={exercise.id}>
                  <div className="selected-exercise-title">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{exercise.name}</strong>
                      <small>
                        {exercise.category} · {exercise.day_of_week || day}
                        {exercise.adjusted
                          ? ` · el alumno usó ${exercise.actual_sets ?? exercise.sets} x ${exercise.actual_reps ?? exercise.reps} · ${exercise.actual_weight ?? exercise.weight} kg`
                          : ""}
                      </small>
                    </div>
                    <button onClick={() => removeExercise(exercise.id)} aria-label={`Quitar ${exercise.name}`}><Icon name="trash" size={16} /></button>
                  </div>
                  <div className="exercise-config">
                    <div>
                      <label>SERIES</label>
                      <span className="stepper">
                        <button onClick={() => updateExercise(exercise.id, "sets", -1)} aria-label={`Reducir series de ${exercise.name}`}>−</button>
                        <strong>{exercise.sets}</strong>
                        <button onClick={() => updateExercise(exercise.id, "sets", 1)} aria-label={`Aumentar series de ${exercise.name}`}>+</button>
                      </span>
                    </div>
                    <div>
                      <label>REPETICIONES</label>
                      <span className="stepper">
                        <button onClick={() => updateExercise(exercise.id, "reps", -1)} aria-label={`Reducir repeticiones de ${exercise.name}`}>−</button>
                        <strong>{exercise.reps}</strong>
                        <button onClick={() => updateExercise(exercise.id, "reps", 1)} aria-label={`Aumentar repeticiones de ${exercise.name}`}>+</button>
                      </span>
                    </div>
                    <div>
                      <label>PESO (KG)</label>
                      <span className="stepper">
                        <button onClick={() => updateExercise(exercise.id, "weight", -1)} aria-label={`Reducir peso de ${exercise.name}`}>−</button>
                        <strong>{exercise.weight}</strong>
                        <button onClick={() => updateExercise(exercise.id, "weight", 1)} aria-label={`Aumentar peso de ${exercise.name}`}>+</button>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <button
            className="primary-button creator-save"
            disabled={selected.length === 0 || !studentId}
            onClick={async () => {
              setError("");
              try {
                const draft = selected.map((item) => ({
                  name: item.name,
                  category: item.category,
                  sets: item.sets,
                  reps: item.reps,
                  weight: item.weight,
                  day_of_week: item.day_of_week || day,
                }));
                let exercises = draft;
                if (isFreshBatch.current) {
                  const keyOf = (item) => `${item.name}-${item.day_of_week}`;
                  let previous = [];
                  try {
                    const data = await routineService.byStudent(studentId);
                    previous = (data.days || []).flatMap((dia) =>
                      dia.ejercicios.map((ejercicio) => ({
                        name: ejercicio.name,
                        category: ejercicio.muscle,
                        sets: ejercicio.sets,
                        reps: ejercicio.reps,
                        weight: Number(ejercicio.target_weight) || 0,
                        day_of_week: ejercicio.day_of_week,
                      }))
                    );
                  } catch {
                    previous = [];
                  }
                  const overwritten = new Set(draft.map(keyOf));
                  exercises = [
                    ...previous.filter((item) => !overwritten.has(keyOf(item))),
                    ...draft,
                  ];
                }
                await routineService.save({
                  student_id: Number(studentId),
                  title,
                  description: note.trim(),
                  exercises,
                });
                isFreshBatch.current = true;
                setSelected([]);
                setSaved(true);
                if (savedTimer.current) clearTimeout(savedTimer.current);
                savedTimer.current = setTimeout(() => setSaved(false), 3000);
              } catch (err) {
                setError(err.message || "No se pudo guardar la rutina.");
              }
            }}
          >
            <Icon name="check" size={17} /> Guardar rutina
          </button>
        </section>
      </div>
    </>
  );
}
export default CreateRoutine;