import { useState } from "react";
import Icon from "./icon";
import Header from "../components/Header";
import { currentDay } from "../utils/date.now";

const students = [
  { initials: "AM", name: "Agustín Méndez", plan: "Plan completo", goal: "Hipertrofia", status: "Revisión hoy", tone: "sand" },
  { initials: "VC", name: "Valentina Costa", plan: "Plan completo", goal: "Fuerza", status: "Sin rutina", tone: "rose" },
  { initials: "FR", name: "Facundo Ríos", plan: "Plan básico", goal: "Acondicionamiento", status: "En 3 días", tone: "blue" },
  { initials: "MP", name: "Malena Paz", plan: "Plan completo", goal: "Movilidad", status: "Actualizada", tone: "green" },
];

function Professor( { user } ) {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [student, setStudent] = useState("Valentina Costa");
  const [routineName, setRoutineName] = useState("Fuerza inicial");
  const [assigned, setAssigned] = useState([]);

  const assignRoutine = () => {
    if (!routineName.trim()) return;
    setAssigned([...assigned, `${routineName} · ${student}`]);
    setBuilderOpen(false);
  };

  return (
    <>
      <Header eyebrow="PANEL DEL PROFESOR" title= {`Hola, ${user.name}!`}/>
      <section className="professor-welcome">
        <div>
          <span className="tag bright">{currentDay().eyebrowText}</span>
          <h2>Acompañá cada progreso.</h2>
          <p>Tenés 2 rutinas para revisar y 3 clases programadas para hoy.</p>
        </div>
        <button className="primary-button" onClick={() => setBuilderOpen(true)}><Icon name="plus" size={18} /> Crear rutina</button>
      </section>

      {builderOpen && (
        <section className="routine-builder">
          <div className="builder-head">
            <div><span className="eyebrow">NUEVA ASIGNACIÓN</span><h2>Crear rutina para un alumno</h2></div>
            <button className="icon-button close-button" onClick={() => setBuilderOpen(false)} aria-label="Cerrar">×</button>
          </div>
          <div className="builder-fields">
            <label><span>Alumno</span><select value={student} onChange={(event) => setStudent(event.target.value)}>{students.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
            <label><span>Nombre de la rutina</span><input value={routineName} onChange={(event) => setRoutineName(event.target.value)} /></label>
            <label><span>Objetivo</span><select defaultValue="Fuerza"><option>Fuerza</option><option>Hipertrofia</option><option>Acondicionamiento</option><option>Movilidad</option></select></label>
            <label><span>Duración</span><select defaultValue="4 semanas"><option>4 semanas</option><option>6 semanas</option><option>8 semanas</option></select></label>
          </div>
          <div className="builder-exercises">
            <div><span className="exercise-order">01</span><span><strong>Sentadilla goblet</strong><small>3 series · 12 repeticiones · 12 kg</small></span><button aria-label="Editar ejercicio"><Icon name="edit" size={17} /></button></div>
            <div><span className="exercise-order">02</span><span><strong>Press de banca</strong><small>3 series · 10 repeticiones · 20 kg</small></span><button aria-label="Editar ejercicio"><Icon name="edit" size={17} /></button></div>
            <button className="add-exercise"><Icon name="plus" size={16} /> Agregar ejercicio</button>
          </div>
          <div className="builder-actions"><button className="text-button" onClick={() => setBuilderOpen(false)}>Cancelar</button><button className="primary-button" onClick={assignRoutine}><Icon name="check" size={17} /> Asignar rutina</button></div>
        </section>
      )}

      {assigned.length > 0 && <div className="success-message"><Icon name="check" size={18} /><span>Rutina asignada correctamente: <strong>{assigned.at(-1)}</strong></span></div>}

      <section className="professor-stats">
        <article><span className="stat-icon lime"><Icon name="users" /></span><div><small>ALUMNOS ACTIVOS</small><strong>24</strong><p>4 con seguimiento hoy</p></div></article>
        <article><span className="stat-icon"><Icon name="clipboard" /></span><div><small>RUTINAS ACTIVAS</small><strong>18</strong><p>75% de tus alumnos</p></div></article>
        <article><span className="stat-icon"><Icon name="calendar" /></span><div><small>CLASES DE HOY</small><strong>3</strong><p>Próxima a las 18:30</p></div></article>
        <article><span className="stat-icon alert"><Icon name="bell" /></span><div><small>POR REVISAR</small><strong>2</strong><p>Requieren actualización</p></div></article>
      </section>

      <div className="professor-grid">
        <section className="students-panel">
          <div className="panel-head"><div><span className="eyebrow">SEGUIMIENTO</span><h2>Mis alumnos</h2></div><button className="text-button">Ver todos <Icon name="arrow" size={16} /></button></div>
          <div className="student-list">
            {students.map((item) => (
              <article className="student-row" key={item.name}>
                <span className={`student-avatar ${item.tone}`}>{item.initials}</span>
                <div className="student-name"><strong>{item.name}</strong><small>{item.plan}</small></div>
                <div className="student-goal"><span>OBJETIVO</span><strong>{item.goal}</strong></div>
                <span className={`student-status ${item.status === "Sin rutina" ? "urgent" : ""}`}>{item.status}</span>
                <button className="student-action" onClick={() => { setStudent(item.name); setRoutineName(`${item.goal} · Nivel 1`); setBuilderOpen(true); }}><Icon name={item.status === "Sin rutina" ? "plus" : "edit"} size={17} /><span>{item.status === "Sin rutina" ? "Crear" : "Editar"}</span></button>
              </article>
            ))}
          </div>
        </section>

        <aside className="today-panel">
          <div className="panel-head"><div><span className="eyebrow">AGENDA</span><h2>Clases de hoy</h2></div></div>
          <div className="timeline">
            <div><span>09:00</span><i /><section><strong>Musculación guiada</strong><small>8 alumnos · Sala principal</small></section></div>
            <div className="next"><span>18:30</span><i /><section><em>PRÓXIMA</em><strong>Cross Training</strong><small>10 alumnos · Sala funcional</small></section></div>
            <div><span>20:00</span><i /><section><strong>Musculación guiada</strong><small>6 alumnos · Sala principal</small></section></div>
          </div>
          <button className="outline-button schedule-button">Ver agenda completa</button>
        </aside>
      </div>
    </>
  );
}

export default Professor;
