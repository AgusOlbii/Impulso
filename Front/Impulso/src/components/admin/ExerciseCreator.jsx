import { useEffect, useState } from "react";
import Header from "../common/Header";
import Icon from "../common/Icon";
import { exerciseService } from "../../services/exercise.service";

const muscleOptions = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Bíceps",
  "Antebrazos",
  "Tríceps",
  "Abdominales",
  "Cuadricep",
  "Isquiotibiales",
  "Gluteos",
  "Gemelos",
  "Abductores / Aductores",
  "Cardio",
  "Fullbody",
];

function sameName(left, right) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function ExerciseCreator() {
  const [name, setName] = useState("");
  const [primaryMuscle, setPrimaryMuscle] = useState("");
  const [antagonistMuscles, setAntagonistMuscles] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [createdExercise, setCreatedExercise] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadExercises = async () => {
    const data = await exerciseService.list();
    setExercises(data.exercises || []);
  };

  useEffect(() => {
    loadExercises().catch(() => setError("No se pudieron cargar los ejercicios."));
  }, []);

  const existingMatch = exercises.find((item) => sameName(item.name, name));

  const toggleAntagonist = (muscle) => {
    setAntagonistMuscles(
      antagonistMuscles.includes(muscle)
        ? antagonistMuscles.filter((item) => item !== muscle)
        : [...antagonistMuscles, muscle],
    );
  };

  const submitExercise = async (event) => {
    event.preventDefault();
    if (existingMatch) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: name.trim(),
        muscle_group: primaryMuscle,
      };
      if (videoUrl.trim()) payload.video_url = videoUrl.trim();
      if (antagonistMuscles.length) {
        payload.description = `Antagonistas: ${antagonistMuscles.join(", ")}`;
      }
      await exerciseService.create(payload);
      setCreatedExercise({ name, primaryMuscle, antagonistMuscles, videoUrl });
      await loadExercises();
    } catch (err) {
      setError(err.message || "No se pudo crear el ejercicio.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setError("");
    try {
      await exerciseService.remove(pendingDelete.id);
      setPendingDelete(null);
      await loadExercises();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el ejercicio.");
      setPendingDelete(null);
    }
  };

  const resetForm = () => {
    setName("");
    setPrimaryMuscle("");
    setAntagonistMuscles([]);
    setVideoUrl("");
    setCreatedExercise(null);
    setError("");
  };

  return (
    <>
      <Header eyebrow="BIBLIOTECA DE MOVIMIENTOS" title="Agregar Ejercicio" />
      <section className="exercise-creator-hero">
        <div>
          <span className="tag bright">NUEVO EJERCICIO</span>
          <h2>Ampliá la biblioteca<br />de entrenamiento.</h2>
          <p>Registrá los datos técnicos y vinculá el video alojado en tu servidor.</p>
        </div>
        <span className="exercise-hero-icon"><Icon name="dumbbell" size={30} /></span>
      </section>

      {error && <p className="apply-error">{error}</p>}

      <div className="exercise-creator-layout">
        <form className="exercise-create-form" onSubmit={submitExercise}>
          <div className="creator-panel-head">
            <div><span className="eyebrow">INFORMACIÓN DEL EJERCICIO</span><h2>Datos principales</h2></div>
            <span>Completá los campos obligatorios</span>
          </div>

          <label className="create-field">
            <span>Nombre del ejercicio</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Press de banca con barra" required />
            {existingMatch && (
              <small className="exercise-exists">Ese ejercicio ya se creó: {existingMatch.name}.</small>
            )}
          </label>

          <label className="create-field">
            <span>Músculo principal</span>
            <select value={primaryMuscle} onChange={(event) => {
              setPrimaryMuscle(event.target.value);
              setAntagonistMuscles(antagonistMuscles.filter((muscle) => muscle !== event.target.value));
            }} required>
              <option value="" disabled>Seleccionar grupo muscular</option>
              {muscleOptions.map((muscle) => <option key={muscle}>{muscle}</option>)}
            </select>
          </label>

          <fieldset className="antagonist-field">
            <legend>Músculos antagonistas</legend>
            <p>Seleccioná uno o más grupos musculares.</p>
            <div className="muscle-options">
              {muscleOptions.filter((muscle) => muscle !== primaryMuscle).map((muscle) => {
                const selected = antagonistMuscles.includes(muscle);
                return (
                  <button type="button" key={muscle} className={selected ? "selected" : ""} onClick={() => toggleAntagonist(muscle)}>
                    {selected && <Icon name="check" size={13} />}{muscle}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="create-field video-url-field">
            <span>URL del video</span>
            <div>
              <Icon name="arrow" size={17} />
              <input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} type="url" placeholder="https://servidor.com/videos/ejercicio.mp4" />
            </div>
            <small>Ingresá la URL pública del video previamente cargado en el servidor.</small>
          </label>

          <button className="primary-button exercise-submit" type="submit" disabled={saving || Boolean(existingMatch)}>
            <Icon name="plus" size={17} /> {saving ? "Guardando..." : "Agregar ejercicio"}
          </button>
        </form>

        <aside className="exercise-preview-panel">
          <div className="creator-panel-head">
            <div><span className="eyebrow">VISTA PREVIA</span><h2>Ejercicio registrado</h2></div>
          </div>
          {createdExercise ? (
            <div className="created-exercise-card">
              <span className="created-check"><Icon name="check" size={22} /></span>
              <span className="tag dark">{createdExercise.primaryMuscle}</span>
              <h3>{createdExercise.name}</h3>
              <div className="created-detail">
                <span>MÚSCULO PRINCIPAL</span>
                <strong>{createdExercise.primaryMuscle}</strong>
              </div>
              <div className="created-detail">
                <span>ANTAGONISTAS</span>
                <strong>{createdExercise.antagonistMuscles.length > 0 ? createdExercise.antagonistMuscles.join(" · ") : "Sin especificar"}</strong>
              </div>
              {createdExercise.videoUrl && (
                <a className="video-server-link" href={createdExercise.videoUrl} target="_blank" rel="noreferrer">
                  <span><Icon name="arrow" size={18} /></span>
                  <span><strong>Ver video en el servidor</strong><small>{createdExercise.videoUrl}</small></span>
                  <Icon name="arrow" size={16} />
                </a>
              )}
              <button className="outline-button new-exercise-button" onClick={resetForm}>Agregar otro ejercicio</button>
            </div>
          ) : (
            <div className="exercise-preview-empty">
              <span><Icon name="dumbbell" size={27} /></span>
              <strong>Completá el formulario</strong>
              <p>Cuando agregues el ejercicio vas a poder revisar sus datos y abrir el video alojado en el servidor.</p>
            </div>
          )}
        </aside>
      </div>

      <section className="exercise-catalog">
        <div className="creator-panel-head">
          <div>
            <span className="eyebrow">BIBLIOTECA</span>
            <h2>Ejercicios creados</h2>
          </div>
          <span>{exercises.length} ejercicios</span>
        </div>
        {exercises.length === 0 ? (
          <p className="apply-account">Todavía no hay ejercicios cargados.</p>
        ) : (
          <div className="exercise-catalog-list">
            {exercises.map((item) => (
              <article className="exercise-catalog-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.muscle_group}{Number(item.routine_count) > 0 ? ` · en ${item.routine_count} rutina${Number(item.routine_count) === 1 ? "" : "s"}` : ""}</small>
                </div>
                <button
                  type="button"
                  className="student-action"
                  onClick={() => setPendingDelete(item)}
                  aria-label={`Eliminar ${item.name}`}
                >
                  <Icon name="trash" size={16} />
                  <span>Eliminar</span>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {pendingDelete && (
        <div className="confirm-overlay" onClick={() => setPendingDelete(null)}>
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-exercise"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="eyebrow">ELIMINAR EJERCICIO</span>
            <h3 id="confirm-delete-exercise">¿Eliminar {pendingDelete.name}?</h3>
            <p>
              Se va a sacar de todas las rutinas donde esté cargado
              {Number(pendingDelete.routine_count) > 0
                ? ` (hoy está en ${pendingDelete.routine_count}).`
                : "."}{" "}
              Esta acción no se puede deshacer.
            </p>
            <div className="confirm-actions">
              <button type="button" className="text-button" onClick={() => setPendingDelete(null)}>
                Cancelar
              </button>
              <button type="button" className="primary-button" onClick={confirmDelete}>
                Eliminar de todas las rutinas
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ExerciseCreator;
