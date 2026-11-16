import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../common/Icon";
import Header from "../common/Header";
import { coachService } from "../../services/coach.service";
import { exerciseService } from "../../services/exercise.service";
import { routineService } from "../../services/routine.service";
import { asNumber, studentChangeLines } from "../../utils/routineChanges";
import StepperField, { parseStepperValue, stepperNumber } from "../common/StepperField";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function isoDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function snapshot(list) {
  return JSON.stringify(
    [...list]
      .map((exercise) => ({
        id: Number(exercise.id),
        day: exercise.day_of_week,
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
        weight: Number(exercise.weight),
      }))
      .sort((left, right) => `${left.day}-${left.id}`.localeCompare(`${right.day}-${right.id}`)),
  );
}

function mapRoutineExercises(routine) {
  return (routine?.exercises || []).map((exercise, index) => ({
    key: String(exercise.routine_exercise_id || `${exercise.exercise_id}-${exercise.day_of_week}-${index}`),
    id: exercise.exercise_id,
    name: exercise.name,
    muscle_group: exercise.muscle_group,
    sets: asNumber(exercise.target_sets) || 1,
    reps: asNumber(exercise.target_reps) || 1,
    weight: asNumber(exercise.target_weight) || 0,
    day_of_week: exercise.day_of_week,
    actual_sets: exercise.actual_sets,
    actual_reps: exercise.actual_reps,
    actual_weight: exercise.actual_weight,
    target_sets: exercise.target_sets,
    target_reps: exercise.target_reps,
    target_weight: exercise.target_weight,
  }));
}

function CreateRoutine() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState([]);
  const [library, setLibrary] = useState([]);
  const [studentId, setStudentId] = useState(params.get("studentId") || "");
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("Lunes");
  const [assignedRoutine, setAssignedRoutine] = useState(null);
  const [baseline, setBaseline] = useState([]);

  const loadAssigned = (routine) => {
    const mapped = mapRoutineExercises(routine);
    setAssignedRoutine(routine);
    setSelected(mapped);
    setBaseline(mapped);
    setTitle(routine?.title || "");
  };

  useEffect(() => {
    coachService
      .myStudents()
      .then((data) => {
        const list = data.students || [];
        setStudents(list);
        setStudentId((actual) => {
          if (actual && list.some((item) => String(item.id) === String(actual))) return actual;
          return list[0] ? String(list[0].id) : "";
        });
      })
      .catch(() => setStudents([]));
    exerciseService
      .list()
      .then((data) => setLibrary(data.exercises || []))
      .catch(() => setLibrary([]));
  }, []);

  useEffect(() => {
    if (!studentId) {
      setAssignedRoutine(null);
      setSelected([]);
      setBaseline([]);
      return;
    }
    routineService
      .latestByStudent(studentId)
      .then((data) => loadAssigned(data.routine || null))
      .catch(() => {
        setAssignedRoutine(null);
        setSelected([]);
        setBaseline([]);
      });
  }, [studentId]);

  const filteredExercises = library.filter((exercise) =>
    `${exercise.name} ${exercise.muscle_group || ""}`.toLowerCase().includes(query.toLowerCase()),
  );

  const addExercise = (exercise) => {
    if (selected.some((item) => item.id === exercise.id && item.day_of_week === day)) return;
    setSelected([
      ...selected,
      {
        key: `${exercise.id}-${day}-${Date.now()}`,
        id: exercise.id,
        name: exercise.name,
        muscle_group: exercise.muscle_group,
        sets: 3,
        reps: 10,
        weight: 0,
        day_of_week: day,
      },
    ]);
    setSaved(false);
  };

  const dayExercises = selected.filter((exercise) => exercise.day_of_week === day);
  const isDirty = snapshot(selected) !== snapshot(baseline);

  const updateExercise = (key, field, amount) => {
    setSelected(selected.map((exercise) => (
      exercise.key === key
        ? { ...exercise, [field]: Math.max(0, stepperNumber(exercise[field]) + amount) }
        : exercise
    )));
    setSaved(false);
  };

  const setExerciseValue = (key, field, raw) => {
    const decimal = field === "weight";
    setSelected(selected.map((exercise) => (
      exercise.key === key
        ? { ...exercise, [field]: parseStepperValue(raw, { decimal }) }
        : exercise
    )));
    setSaved(false);
  };

  const removeExercise = (key) => {
    setSelected(selected.filter((exercise) => exercise.key !== key));
    setSaved(false);
  };

  const payloadExercises = () =>
    selected.map((exercise) => ({
      exercise_id: Number(exercise.id),
      day_of_week: exercise.day_of_week || day,
      target_sets: Math.max(1, Number(exercise.sets) || 1),
      target_reps: Math.max(1, Number(exercise.reps) || 1),
      target_weight: Number(exercise.weight) || 0,
    }));

  const saveRoutine = async () => {
    if (!studentId || selected.length === 0) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const student = students.find((item) => String(item.id) === String(studentId));
      const payload = {
        title: title.trim() || `Rutina de ${day}${student ? ` · ${student.name}` : ""}`,
        exercises: payloadExercises(),
      };
      if (assignedRoutine?.id) {
        await routineService.update(assignedRoutine.id, payload);
      } else {
        await routineService.save({
          ...payload,
          student_id: Number(studentId),
          start_date: isoDate(),
          end_date: isoDate(28),
        });
      }
      const latest = await routineService.latestByStudent(studentId);
      loadAssigned(latest.routine || null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "No se pudo guardar la rutina.");
    } finally {
      setSaving(false);
    }
  };

  const editing = Boolean(assignedRoutine?.id);

  return (
    <>
      <Header eyebrow="PLANIFICACIÓN DE ENTRENAMIENTO" title={editing ? "Editar rutina" : "Crear Rutina"} />
      <section className="creator-heading">
        <div>
          <span className="tag bright">{editing ? "PLAN ASIGNADO" : "NUEVO PLAN"}</span>
          <h2>{editing ? "Cambiá la rutina del alumno." : "Armá la rutina de un alumno."}</h2>
          <p>
            {editing
              ? "Podés ajustar series, repeticiones y peso, o sumar ejercicios. Si el alumno había cambiado algo, al guardar tu plan queda como el vigente."
              : "Elegí al alumno que te contrató, buscá ejercicios y definí el volumen de trabajo."}
          </p>
        </div>
        <div className="creator-summary">
          <span><strong>{dayExercises.length}</strong> ejercicios el {day}</span>
          <i />
          <span><strong>{dayExercises.reduce((total, exercise) => total + Number(exercise.sets || 0), 0)}</strong> series</span>
        </div>
      </section>

      <div className="builder-fields">
        <label>
          <span>Alumno</span>
          <select value={studentId} onChange={(event) => setStudentId(event.target.value)}>
            {students.length === 0 && <option value="">Todavía no tenés alumnos</option>}
            {students.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} {item.lastname || ""}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Nombre de la rutina</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Fuerza inicial"
          />
        </label>
        <label>
          <span>Día</span>
          <select value={day} onChange={(event) => setDay(event.target.value)}>
            {DAYS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      {saved && (
        <div className="success-message creator-notice">
          <Icon name="check" size={18} />
          <span>La rutina se guardó correctamente.</span>
        </div>
      )}
      {error && (
        <div className="success-message creator-notice">
          <span>{error}</span>
        </div>
      )}

      <div className="routine-creator-layout">
        <section className="exercise-library-panel">
          <div className="creator-panel-head">
            <div><span className="eyebrow">BIBLIOTECA</span><h2>Buscar ejercicios</h2></div>
            <span>{filteredExercises.length} resultados</span>
          </div>
          <label className="exercise-search">
            <Icon name="search" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por ejercicio o grupo muscular..." />
            {query && <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda">×</button>}
          </label>
          <div className="library-list">
            {filteredExercises.length === 0 && (
              <div className="library-empty"><Icon name="search" /><strong>No encontramos ejercicios</strong><span>Probá con otro nombre o grupo muscular.</span></div>
            )}
            {filteredExercises.map((exercise) => {
              const added = selected.some((item) => item.id === exercise.id && item.day_of_week === day);
              return (
                <article className="library-exercise" key={exercise.id}>
                  <span className="library-icon"><Icon name="dumbbell" size={18} /></span>
                  <div><strong>{exercise.name}</strong><small>{exercise.muscle_group}</small></div>
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
            <div><span className="eyebrow">{editing ? "RUTINA DEL ALUMNO" : "TU SELECCIÓN"}</span><h2>Ejercicios del {day}</h2></div>
            <span>{dayExercises.length}/20</span>
          </div>
          {dayExercises.length === 0 ? (
            <div className="routine-empty">
              <span><Icon name="clipboard" size={25} /></span>
              <strong>No hay ejercicios el {day}</strong>
              <p>Agregá ejercicios desde la biblioteca para este día, o elegí otro día para ver su plan.</p>
            </div>
          ) : (
            <div className="selected-exercise-list">
              {dayExercises.map((exercise, index) => {
                const changes = studentChangeLines(exercise);
                return (
                  <article className="selected-exercise" key={exercise.key}>
                    <div className="selected-exercise-title">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <strong>{exercise.name}</strong>
                        <small>{exercise.muscle_group} · {exercise.day_of_week}</small>
                      </div>
                      <button onClick={() => removeExercise(exercise.key)} aria-label={`Quitar ${exercise.name}`}><Icon name="trash" size={16} /></button>
                    </div>
                    {changes.length > 0 && (
                      <div className="student-change-list">
                        {changes.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    )}
                    <div className="exercise-config triple">
                      <div>
                        <label>SERIES</label>
                        <StepperField
                          label={`series de ${exercise.name}`}
                          value={exercise.sets}
                          onStep={(amount) => updateExercise(exercise.key, "sets", amount)}
                          onChange={(raw) => setExerciseValue(exercise.key, "sets", raw)}
                        />
                      </div>
                      <div>
                        <label>REPETICIONES</label>
                        <StepperField
                          label={`repeticiones de ${exercise.name}`}
                          value={exercise.reps}
                          onStep={(amount) => updateExercise(exercise.key, "reps", amount)}
                          onChange={(raw) => setExerciseValue(exercise.key, "reps", raw)}
                        />
                      </div>
                      <div>
                        <label>PESO</label>
                        <StepperField
                          label={`peso de ${exercise.name}`}
                          decimal
                          value={exercise.weight}
                          onStep={(amount) => updateExercise(exercise.key, "weight", amount)}
                          onChange={(raw) => setExerciseValue(exercise.key, "weight", raw)}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          <button
            className="primary-button creator-save"
            disabled={!isDirty || selected.length === 0 || !studentId || saving}
            onClick={saveRoutine}
          >
            <Icon name="check" size={17} /> {saving ? "Guardando..." : editing ? "Guardar cambios" : "Guardar rutina"}
          </button>
        </section>
      </div>
    </>
  );
}
export default CreateRoutine;
