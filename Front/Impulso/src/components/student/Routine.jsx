import { useState } from "react";
import Header from "../common/Header";
import Icon from "../common/Icon";

const exercises = [
  { number: "01", name: "Sentadilla con barra", detail: "4 series · 10 repeticiones", weight: "35 kg", muscle: "Piernas" },
  { number: "02", name: "Peso muerto rumano", detail: "4 series · 12 repeticiones", weight: "30 kg", muscle: "Posterior" },
  { number: "03", name: "Prensa inclinada", detail: "3 series · 12 repeticiones", weight: "70 kg", muscle: "Piernas" },
  { number: "04", name: "Hip thrust", detail: "4 series · 10 repeticiones", weight: "45 kg", muscle: "Glúteos" },
];


function Routine() {
  const [completed, setCompleted] = useState(["01"]);
  return (
    <>
      <Header eyebrow="PLAN PERSONALIZADO" title="Mi rutina" />
      <div className="routine-banner">
        <div><span className="tag bright">DÍA 2 DE 4</span><h2>Fuerza de tren inferior</h2><p>Diseñada por Martín López · Actualizada hace 5 días</p></div>
        <div className="routine-progress"><strong>{completed.length}/4</strong><span>ejercicios</span></div>
      </div>
      <div className="routine-layout">
        <section>
          <div className="section-heading compact"><div><span className="eyebrow">ENTRENAMIENTO DE HOY</span><h2>Tu recorrido</h2></div><span className="duration"><Icon name="clock" size={17} /> 50–60 min</span></div>
          <div className="exercise-list">
            {exercises.map((exercise) => {
              const done = completed.includes(exercise.number);
              return (
                <button className={`exercise ${done ? "done" : ""}`} key={exercise.number} onClick={() => setCompleted(done ? completed.filter((id) => id !== exercise.number) : [...completed, exercise.number])}>
                  <span className="exercise-number">{done ? <Icon name="check" size={18} /> : exercise.number}</span>
                  <span className="exercise-name"><strong>{exercise.name}</strong><small>{exercise.detail}</small></span>
                  <span className="muscle">{exercise.muscle}</span>
                  <span className="weight"><strong>{exercise.weight}</strong><small>PESO</small></span>
                  <Icon name="arrow" size={18} />
                </button>
              );
            })}
          </div>
        </section>
        <aside className="coach-note">
          <div className="avatar coach">ML</div>
          <span className="eyebrow">NOTA DE TU ENTRENADOR</span>
          <p>“Priorizá la técnica. Si completás las repeticiones con comodidad, sumá 2,5 kg en la próxima serie.”</p>
          <strong>Martín López</strong><small>Entrenador de fuerza</small>
        </aside>
      </div>
    </>
  );
}

export default Routine;
