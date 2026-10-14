import { useState } from "react";
import Header from "../components/Header";
import Icon from "./icon";
import professors from "../data/professors";
import rutinasPorProfesor from "../data/rutinasPorProfesor";

function Routine({ setPage, profesorElegidoId }) {
  const [diaActivo, setDiaActivo] = useState("lunes");
  const [completed, setCompleted] = useState([]);

  const profesor = professors.find((item) => item.id === profesorElegidoId);
  const rutinaSemanal = profesor
    ? rutinasPorProfesor[profesor.id]
    : null;
  const dia = rutinaSemanal?.find((item) => item.id === diaActivo);
  const totalDia = dia ? dia.ejercicios.length : 0;
  const hechosDia = dia
    ? dia.ejercicios.filter((ejercicio) => completed.includes(ejercicio.id))
        .length
    : 0;

  const toggleDia = (id) => {
    setDiaActivo((actual) => (actual === id ? null : id));
  };

  const toggleEjercicio = (id) => {
    setCompleted((lista) =>
      lista.includes(id) ? lista.filter((item) => item !== id) : [...lista, id]
    );
  };

  if (!profesor || !rutinaSemanal) {
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
          <button className="primary-button" onClick={() => setPage("profesores")}>
            Ver profesores
            <Icon name="arrow" size={16} />
          </button>
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
        <div className="routine-progress">
          <strong>
            {hechosDia}/{totalDia || 0}
          </strong>
          <span>ejercicios</span>
        </div>
      </div>
      <div className="routine-layout">
        <section>
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">SEMANA</span>
              <h2>Lunes a viernes</h2>
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
                className={`routine-day ${diaActivo === item.id ? "active" : ""}`}
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
                return (
                  <button
                    className={`exercise ${done ? "done" : ""}`}
                    key={exercise.id}
                    type="button"
                    onClick={() => toggleEjercicio(exercise.id)}
                  >
                    <span className="exercise-number">
                      {done ? <Icon name="check" size={18} /> : exercise.number}
                    </span>
                    <span className="exercise-name">
                      <strong>{exercise.name}</strong>
                      <small>{exercise.detail}</small>
                    </span>
                    <span className="muscle">{exercise.muscle}</span>
                    <span className="weight">
                      <strong>{exercise.weight}</strong>
                      <small>PESO</small>
                    </span>
                    <Icon name="arrow" size={18} />
                  </button>
                );
              })}
            </div>
          )}
        </section>
        <aside className="coach-note">
          <img
            className="avatar coach"
            src={profesor.image || profesor.photo}
            alt={profesor.name}
            style={{ objectPosition: profesor.position || "center 20%" }}
          />
          <span className="eyebrow">NOTA DE TU ENTRENADOR</span>
          <p>
            “Esta semana priorizá la calidad del movimiento. Si cierra fácil,
            subí un poco la carga o el ritmo.”
          </p>
          <strong>{profesor.name}</strong>
          <small>{profesor.specialty}</small>
        </aside>
      </div>
    </>
  );
}

export default Routine;
