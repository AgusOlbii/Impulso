import { useState } from "react";
import Icon from "../common/Icon";
import Header from "../common/Header";
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
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [saved, setSaved] = useState(false);

  const filteredExercises = exerciseLibrary.filter((exercise) =>
    `${exercise.name} ${exercise.category} ${exercise.equipment}`.toLowerCase().includes(query.toLowerCase()),
  );

  const addExercise = (exercise) => {
    if (selected.some((item) => item.id === exercise.id)) return;
    setSelected([...selected, { ...exercise, sets: 3, reps: 10 }]);
    setSaved(false);
  };

  const updateExercise = (id, field, amount) => {
    setSelected(selected.map((exercise) => (
      exercise.id === id
        ? { ...exercise, [field]: Math.max(1, Math.min(field === "sets" ? 10 : 30, exercise[field] + amount)) }
        : exercise
    )));
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
          <p>Buscá ejercicios, agregalos al plan y definí el volumen de trabajo.</p>
        </div>
        <div className="creator-summary">
          <span><strong>{selected.length}</strong> ejercicios</span>
          <i />
          <span><strong>{selected.reduce((total, exercise) => total + exercise.sets, 0)}</strong> series totales</span>
        </div>
      </section>

      {saved && <div className="success-message creator-notice"><Icon name="check" size={18} /><span>La rutina fue guardada correctamente.</span></div>}

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
              const added = selected.some((item) => item.id === exercise.id);
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
                <article className="selected-exercise" key={exercise.id}>
                  <div className="selected-exercise-title">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><strong>{exercise.name}</strong><small>{exercise.category}</small></div>
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
                  </div>
                </article>
              ))}
            </div>
          )}
          <button className="primary-button creator-save" disabled={selected.length === 0} onClick={() => setSaved(true)}>
            <Icon name="check" size={17} /> Guardar rutina
          </button>
        </section>
      </div>
    </>
  );
}
export default CreateRoutine;