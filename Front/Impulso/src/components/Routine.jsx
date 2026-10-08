import { useState } from "react";
import Header from "../components/Header";
import Icon from "./icon";
function Routine() {
  const [completed, setCompleted] = useState(["01"]);

  const exercises = [
    {
      id: "01",
      name: "Sentadilla libre",
      sets: "4 x 10",
      weight: "40 kg",
    },
    {
      id: "02",
      name: "Peso muerto rumano",
      sets: "3 x 12",
      weight: "32 kg",
    },
    {
      id: "03",
      name: "Hip thrust",
      sets: "4 x 10",
      weight: "50 kg",
    },
    {
      id: "04",
      name: "Abducción en máquina",
      sets: "3 x 15",
      weight: "35 kg",
    },
    {
      id: "05",
      name: "Plancha",
      sets: "3 x 45 seg",
      weight: "—",
    },
  ];

  const toggle = (id) => {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <>
      <Header eyebrow="ENTRENAMIENTO" title="Mi rutina" />

      <section className="routine-top">
        <div>
          <div className="eyebrow">LUNES · PIERNAS & GLÚTEOS</div>
          <h2>Sesión A</h2>
          <p>Enfocada en fuerza y volumen. Descansá entre 60 y 90 segundos.</p>
        </div>

        <div className="routine-progress">
          <div className="progress-number">
            {completed.length}/{exercises.length}
          </div>
          <div className="progress-label">EJERCICIOS</div>
        </div>
      </section>

      <div className="exercise-list">
        {exercises.map((exercise) => {
          const done = completed.includes(exercise.id);

          return (
            <div
              className={`exercise-row ${done ? "completed" : ""}`}
              key={exercise.id}
            >
              <button
                className={`exercise-check ${done ? "checked" : ""}`}
                onClick={() => toggle(exercise.id)}
              >
                {done && <Icon name="check" size={16} />}
              </button>

              <div className="exercise-number">{exercise.id}</div>

              <div className="exercise-main">
                <h3>{exercise.name}</h3>
                <span>{exercise.sets}</span>
              </div>

              <div className="exercise-weight">
                <strong>{exercise.weight}</strong>
                <small>ÚLTIMA SESIÓN</small>
              </div>

              <button className="more-button">•••</button>
            </div>
          );
        })}
      </div>
    </>
  );
}
export default Routine;
