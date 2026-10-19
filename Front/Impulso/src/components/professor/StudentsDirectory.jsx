import { useState } from "react";
import Header from "../common/Header";
import Icon from "../common/Icon";
const allStudents = [
  { id: 1, initials: "AM", name: "Agustín Méndez", plan: "Plan completo", goal: "Hipertrofia", status: "Revisión hoy", tone: "sand", routine: "Volumen · Nivel 2", progress: 82, activity: "Hoy, 08:40" },
  { id: 2, initials: "VC", name: "Valentina Costa", plan: "Plan completo", goal: "Fuerza", status: "Sin rutina", tone: "rose", routine: "Sin asignar", progress: 0, activity: "Ayer, 19:15" },
  { id: 3, initials: "FR", name: "Facundo Ríos", plan: "Plan básico", goal: "Acondicionamiento", status: "En 3 días", tone: "blue", routine: "Base funcional", progress: 64, activity: "Hoy, 10:20" },
  { id: 4, initials: "MP", name: "Malena Paz", plan: "Plan completo", goal: "Movilidad", status: "Actualizada", tone: "green", routine: "Movilidad total", progress: 91, activity: "Ayer, 17:30" },
  { id: 5, initials: "LR", name: "Luciano Romero", plan: "Plan completo", goal: "Fuerza", status: "Actualizada", tone: "blue", routine: "Fuerza · Bloque 3", progress: 76, activity: "Hoy, 07:55" },
  { id: 6, initials: "JM", name: "Julieta Molina", plan: "Plan básico", goal: "Descenso de peso", status: "Revisión hoy", tone: "rose", routine: "Cardio progresivo", progress: 58, activity: "18 jun, 20:10" },
  { id: 7, initials: "TN", name: "Tomás Navarro", plan: "Plan completo", goal: "Hipertrofia", status: "En 5 días", tone: "sand", routine: "Torso y piernas", progress: 69, activity: "Ayer, 08:15" },
  { id: 8, initials: "CB", name: "Clara Bustos", plan: "Plan completo", goal: "Acondicionamiento", status: "Actualizada", tone: "green", routine: "Full body inicial", progress: 87, activity: "Hoy, 12:05" },
];

function StudentsDirectory() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const visibleStudents = allStudents.filter((student) => {
    const matchesQuery = `${student.name} ${student.goal} ${student.routine}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "Todos"
      || (filter === "Revisión" && student.status.includes("Revisión"))
      || (filter === "Sin rutina" && student.status === "Sin rutina")
      || (filter === "Al día" && !student.status.includes("Revisión") && student.status !== "Sin rutina");
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <Header eyebrow="SEGUIMIENTO DEL PROFESOR" title="Alumnos" />
      <section className="students-hero">
        <div>
          <span className="tag bright">EQUIPO ACTIVO</span>
          <h2>Acompañá cada proceso.</h2>
          <p>Revisá el avance, las rutinas y la actividad de todos tus alumnos en un solo lugar.</p>
        </div>
        <div className="students-hero-stats">
          <div><strong>{allStudents.length}</strong><span>ALUMNOS</span></div>
          <i />
          <div><strong>75%</strong><span>PROGRESO MEDIO</span></div>
          <i />
          <div><strong>2</strong><span>POR REVISAR</span></div>
        </div>
      </section>

      <section className="students-directory-panel">
        <div className="students-directory-head">
          <div><span className="eyebrow">LISTADO COMPLETO</span><h2>Todos mis alumnos</h2></div>
          <label className="students-search">
            <Icon name="search" size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar alumno, objetivo o rutina..." />
            {query && <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda">×</button>}
          </label>
        </div>

        <div className="students-filter-row">
          {["Todos", "Revisión", "Sin rutina", "Al día"].map((item) => (
            <button key={item} className={`filter ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>{item}</button>
          ))}
          <span>{visibleStudents.length} resultados</span>
        </div>

        <div className="students-table">
          <div className="students-table-head">
            <span>ALUMNO</span><span>OBJETIVO</span><span>RUTINA ACTUAL</span><span>PROGRESO</span><span>ÚLTIMA ACTIVIDAD</span><span />
          </div>
          {visibleStudents.length === 0 && (
            <div className="students-empty"><Icon name="search" /><strong>No encontramos alumnos</strong><span>Probá con otra búsqueda o filtro.</span></div>
          )}
          {visibleStudents.map((student) => (
            <article className="students-table-row" key={student.id}>
              <div className="directory-student-name">
                <span className={`student-avatar ${student.tone}`}>{student.initials}</span>
                <span><strong>{student.name}</strong><small>{student.plan}</small></span>
              </div>
              <span className="directory-goal">{student.goal}</span>
              <div className="directory-routine"><strong>{student.routine}</strong><small className={student.status === "Sin rutina" ? "urgent" : ""}>{student.status}</small></div>
              <div className="directory-progress"><strong>{student.progress}%</strong><span><i style={{ width: `${student.progress}%` }} /></span></div>
              <span className="directory-activity">{student.activity}</span>
              <button className="student-detail-button" onClick={() => setSelectedStudent(student)} aria-label={`Ver perfil de ${student.name}`}><Icon name="arrow" size={17} /></button>
            </article>
          ))}
        </div>
      </section>

      {selectedStudent && (
        <section className="student-detail-drawer">
          <button className="student-detail-close" onClick={() => setSelectedStudent(null)} aria-label="Cerrar detalle">×</button>
          <span className={`student-avatar ${selectedStudent.tone}`}>{selectedStudent.initials}</span>
          <div className="student-detail-name"><span className="eyebrow">PERFIL DEL ALUMNO</span><h2>{selectedStudent.name}</h2><p>{selectedStudent.plan}</p></div>
          <div><span>OBJETIVO</span><strong>{selectedStudent.goal}</strong></div>
          <div><span>RUTINA ACTUAL</span><strong>{selectedStudent.routine}</strong></div>
          <div><span>PROGRESO</span><strong>{selectedStudent.progress}% completado</strong></div>
          <button className="primary-button">Ver seguimiento completo <Icon name="arrow" size={16} /></button>
        </section>
      )}
    </>
  );
}
export default StudentsDirectory;