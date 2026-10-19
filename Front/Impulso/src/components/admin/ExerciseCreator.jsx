import { useState } from "react";
import Header from "../common/Header";
import Icon from "../common/Icon";

// const CreatedExercise = {
//   name: "",
//   primaryMuscle: "",
//   antagonistMuscles: [],
//   videoUrl: "",
// };
const muscleOptions = ["Pecho", "Espalda", "Hombros", "Bíceps", "Tríceps", "Cuádriceps", "Isquiotibiales", "Glúteos", "Pantorrillas", "Core"];


function ExerciseCreator() {
  const [name, setName] = useState("");
  const [primaryMuscle, setPrimaryMuscle] = useState("");
  const [antagonistMuscles, setAntagonistMuscles] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [createdExercise, setCreatedExercise] = useState(null);

  const toggleAntagonist = (muscle) => {
    setAntagonistMuscles(
      antagonistMuscles.includes(muscle)
        ? antagonistMuscles.filter((item) => item !== muscle)
        : [...antagonistMuscles, muscle],
    );
  };

  const submitExercise = (event) => {
    event.preventDefault();
    setCreatedExercise({ name, primaryMuscle, antagonistMuscles, videoUrl });
  };

  const resetForm = () => {
    setName("");
    setPrimaryMuscle("");
    setAntagonistMuscles([]);
    setVideoUrl("");
    setCreatedExercise(null);
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

      <div className="exercise-creator-layout">
        <form className="exercise-create-form" onSubmit={submitExercise}>
          <div className="creator-panel-head">
            <div><span className="eyebrow">INFORMACIÓN DEL EJERCICIO</span><h2>Datos principales</h2></div>
            <span>Completá los campos obligatorios</span>
          </div>

          <label className="create-field">
            <span>Nombre del ejercicio</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Press de banca con barra" required />
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
              <input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} type="url" placeholder="https://servidor.com/videos/ejercicio.mp4" required />
            </div>
            <small>Ingresá la URL pública del video previamente cargado en el servidor.</small>
          </label>

          <button className="primary-button exercise-submit" type="submit">
            <Icon name="plus" size={17} /> Agregar ejercicio
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
              <a className="video-server-link" href={createdExercise.videoUrl} target="_blank" rel="noreferrer">
                <span><Icon name="arrow" size={18} /></span>
                <span><strong>Ver video en el servidor</strong><small>{createdExercise.videoUrl}</small></span>
                <Icon name="arrow" size={16} />
              </a>
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
    </>
  );
}
export default ExerciseCreator;