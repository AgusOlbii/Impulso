import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../common/Icon";
import Header from "../common/Header";
import { currentDay } from "../../utils/date.now";
import professors from "../../data/professors";

const students = [
  { initials: "AM", name: "Agustín Méndez", goal: "Hipertrofia", status: "Revisión hoy", tone: "sand" },
  { initials: "VC", name: "Valentina Costa", goal: "Fuerza", status: "Sin rutina", tone: "rose" },
  { initials: "FR", name: "Facundo Ríos", goal: "Acondicionamiento", status: "En 3 días", tone: "blue" },
  { initials: "MP", name: "Malena Paz", goal: "Movilidad", status: "Actualizada", tone: "green" },
];

function Professor({ user }) {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [student, setStudent] = useState("Valentina Costa");
  const [routineName, setRoutineName] = useState("Fuerza inicial");
  const [assigned, setAssigned] = useState([]);

  const perfil = professors.find(
    (item) => item.name.toLowerCase() === user?.name?.toLowerCase()
  );

  const assignRoutine = () => {
    if (!routineName.trim()) return;
    setAssigned([...assigned, `${routineName} · ${student}`]);
    setBuilderOpen(false);
  };
  //Instancio el useNavigate y luego creo el handleClick para poder ir a la ruta /students/directory
  const navigate = useNavigate();
  const handleClick = () => {
    // Aquí pones exactamente el mismo path que definiste en App.jsx (por ejemplo, '/profesores' o '/detalle')
    navigate('/students/directory');
  };

  return (
    <>
      <Header eyebrow="PANEL DEL PROFESOR" title={`Hola, ${user.name}`} />

      <section className="professor-welcome">
        <div>
          <span className="tag bright">{currentDay().eyebrowText}</span>
          <h2>Acompañá cada progreso.</h2>
          <p>
            {perfil
              ? `${perfil.specialty} · ${perfil.experience}`
              : "Tenés alumnos esperando seguimiento en sus rutinas."}
          </p>
        </div>
        {perfil && (
          <img
            className="professor-welcome-photo"
            src={perfil.image}
            alt={perfil.name}
            style={{ objectPosition: perfil.position || "center 20%" }}
          />
        )}
        <button className="primary-button" onClick={() => setBuilderOpen(true)}>
          <Icon name="plus" size={18} /> Crear rutina
        </button>
      </section>

      {builderOpen && (
        <section className="routine-builder">
          <div className="builder-head">
            <div>
              <span className="eyebrow">NUEVA ASIGNACIÓN</span>
              <h2>Crear rutina para un alumno</h2>
            </div>
            <button
              className="icon-button close-button"
              onClick={() => setBuilderOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
          <div className="builder-fields">
            <label>
              <span>Alumno</span>
              <select value={student} onChange={(event) => setStudent(event.target.value)}>
                {students.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Nombre de la rutina</span>
              <input
                value={routineName}
                onChange={(event) => setRoutineName(event.target.value)}
              />
            </label>
            <label>
              <span>Objetivo</span>
              <select defaultValue="Fuerza">
                <option>Fuerza</option>
                <option>Hipertrofia</option>
                <option>Cardio</option>
                <option>Movilidad</option>
              </select>
            </label>
            <label>
              <span>Duración</span>
              <select defaultValue="4 semanas">
                <option>4 semanas</option>
                <option>6 semanas</option>
                <option>8 semanas</option>
              </select>
            </label>
          </div>
          <div className="builder-exercises">
            <div>
              <span className="exercise-order">01</span>
              <span>
                <strong>Sentadilla goblet</strong>
                <small>3 series · 12 repeticiones · 12 kg</small>
              </span>
            </div>
            <div>
              <span className="exercise-order">02</span>
              <span>
                <strong>Press de banca</strong>
                <small>3 series · 10 repeticiones · 20 kg</small>
              </span>
            </div>
          </div>
          <div className="builder-actions">
            <button className="text-button" onClick={() => setBuilderOpen(false)}>
              Cancelar
            </button>
            <button className="primary-button" onClick={assignRoutine}>
              <Icon name="check" size={17} /> Asignar rutina
            </button>
          </div>
        </section>
      )}

      {assigned.length > 0 && (
        <div className="success-message">
          <Icon name="check" size={18} />
          <span>
            Rutina asignada: <strong>{assigned.at(-1)}</strong>
          </span>
        </div>
      )}

      <section className="professor-stats">
        <article>
          <span className="stat-icon lime">
            <Icon name="users" />
          </span>
          <div>
            <small>ALUMNOS ACTIVOS</small>
            <strong>{students.length}</strong>
            <p>seguimiento de la semana</p>
          </div>
        </article>
        <article>
          <span className="stat-icon">
            <Icon name="clipboard" />
          </span>
          <div>
            <small>RUTINAS ACTIVAS</small>
            <strong>3</strong>
            <p>asignadas a tus alumnos</p>
          </div>
        </article>
        <article>
          <span className="stat-icon alert">
            <Icon name="bell" />
          </span>
          <div>
            <small>POR REVISAR</small>
            <strong>1</strong>
            <p>Valentina sin rutina</p>
          </div>
        </article>
      </section>

      <div className="professor-grid">
        <section className="students-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">SEGUIMIENTO</span>
              <h2>Mis alumnos</h2>
            </div>
            <button onClick={handleClick} className="text-button">
              Ver todos <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="student-list">
            {students.map((item) => (
              <article className="student-row" key={item.name}>
                <span className={`student-avatar ${item.tone}`}>{item.initials}</span>
                <div className="student-name">
                  <strong>{item.name}</strong>
                  <small>Alumno asignado</small>
                </div>
                <div className="student-goal">
                  <span>OBJETIVO</span>
                  <strong>{item.goal}</strong>
                </div>
                <span
                  className={`student-status ${item.status === "Sin rutina" ? "urgent" : ""}`}
                >
                  {item.status}
                </span>
                <button
                  className="student-action"
                  onClick={() => {
                    setStudent(item.name);
                    setRoutineName(`${item.goal} · Nivel 1`);
                    setBuilderOpen(true);
                  }}
                >
                  <Icon name={item.status === "Sin rutina" ? "plus" : "edit"} size={17} />
                  <span>{item.status === "Sin rutina" ? "Crear" : "Editar"}</span>
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Professor;
