import { useState } from "react";
import professorApplicants from "../../data/applicants";
import Icon from "../icon";
import Header from "../common/Header";


const activeProfessors = [
  { id: 1, initials: "ML", name: "Martín López", specialty: "Cross Training", students: 24, classes: 12, tone: "sand" },
  { id: 2, initials: "CR", name: "Carla Ruiz", specialty: "Spinning", students: 19, classes: 10, tone: "rose" },
  { id: 3, initials: "SD", name: "Sofía Díaz", specialty: "GAP", students: 17, classes: 8, tone: "blue" },
  { id: 4, initials: "DP", name: "Diego Pérez", specialty: "Musculación", students: 14, classes: 9, tone: "green" },
];


function Admin() {
  const [applicants, setApplicants] = useState(professorApplicants);
  const [professors, setProfessors] = useState(activeProfessors);
  const [notice, setNotice] = useState("");

  const approveProfessor = (id) => {
    const applicant = applicants.find((item) => item.id === id);
    if (!applicant) return;
    setApplicants(applicants.filter((item) => item.id !== id));
    setProfessors([...professors, { ...applicant, students: 0, classes: 0 }]);
    setNotice(`${applicant.name} fue aceptada/o como profesor.`);
  };

  const rejectApplicant = (id) => {
    const applicant = applicants.find((item) => item.id === id);
    setApplicants(applicants.filter((item) => item.id !== id));
    if (applicant) setNotice(`La solicitud de ${applicant.name} fue rechazada.`);
  };

  const removeProfessor = (id) => {
    const professor = professors.find((item) => item.id === id);
    setProfessors(professors.filter((item) => item.id !== id));
    if (professor) setNotice(`${professor.name} fue eliminado del equipo.`);
  };

  return (
    <>
      <Header eyebrow="CENTRO DE CONTROL" title="Dashboard Admin" />
      <section className="admin-heading">
        <div><h2>Resumen del gimnasio</h2><p>Información actualizada al 18 de junio de 2025.</p></div>
        <button className="outline-button"><Icon name="calendar" size={16} /> Junio 2025</button>
      </section>

      {notice && <div className="success-message admin-notice"><Icon name="check" size={18} /><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Cerrar notificación">×</button></div>}

      <section className="admin-kpis">
        <article><div className="kpi-top"><span className="stat-icon lime"><Icon name="users" /></span><span className="kpi-trend positive">+8,4%</span></div><small>SOCIOS TOTALES</small><strong>482</strong><p>37 altas este mes</p></article>
        <article><div className="kpi-top"><span className="stat-icon"><Icon name="shield" /></span><span className="kpi-trend positive">+3,2%</span></div><small>MEMBRESÍAS ACTIVAS</small><strong>417</strong><p>86,5% del total</p></article>
        <article><div className="kpi-top"><span className="stat-icon warning"><Icon name="bell" /></span><span className="kpi-trend negative">+12</span></div><small>INACTIVAS / VENCIDAS</small><strong>65</strong><p>Requieren seguimiento</p></article>
        <article><div className="kpi-top"><span className="stat-icon dark"><Icon name="money" /></span><span className="kpi-trend positive">+11,8%</span></div><small>INGRESOS DEL MES</small><strong>$8,42 M</strong><p>Meta: $9,1 M</p></article>
      </section>

      <section className="admin-charts">
        <article className="revenue-panel">
          <div className="panel-head"><div><span className="eyebrow">FACTURACIÓN</span><h2>Suscripciones mensuales</h2></div><div className="chart-legend"><span><i className="current" /> 2025</span><span><i /> 2024</span></div></div>
          <div className="revenue-summary"><strong>$8.420.000</strong><span><b>+11,8%</b> respecto al mes anterior</span></div>
          <div className="bar-chart" aria-label="Gráfico de ingresos mensuales">
            {[["ENE", 46, 34], ["FEB", 55, 42], ["MAR", 50, 45], ["ABR", 67, 49], ["MAY", 62, 52], ["JUN", 84, 57]].map(([month, current, previous]) => (
              <div className="bar-group" key={month}><div className="bars"><i style={{ height: `${previous}%` }} /><i className="current" style={{ height: `${current}%` }} /></div><span>{month}</span></div>
            ))}
          </div>
        </article>

        <article className="membership-panel">
          <div className="panel-head"><div><span className="eyebrow">ESTADO ACTUAL</span><h2>Membresías</h2></div></div>
          <div className="membership-chart-wrap">
            <div className="membership-donut"><div><strong>482</strong><span>TOTALES</span></div></div>
            <div className="membership-breakdown">
              <div><i className="active" /><span>Activas<small>417 membresías</small></span><strong>86,5%</strong></div>
              <div><i className="expired" /><span>Vencidas<small>41 membresías</small></span><strong>8,5%</strong></div>
              <div><i className="paused" /><span>Pausadas<small>24 membresías</small></span><strong>5%</strong></div>
            </div>
          </div>
          <button className="text-button membership-link">Gestionar membresías <Icon name="arrow" size={16} /></button>
        </article>
      </section>

      <section className="admin-lists">
        <article className="applications-panel">
          <div className="panel-head"><div><span className="eyebrow">SOLICITUDES PENDIENTES</span><h2>Nuevos profesores</h2></div><span className="count-badge">{applicants.length}</span></div>
          <div className="application-list">
            {applicants.length === 0 && <div className="empty-state"><Icon name="check" /><strong>Todo al día</strong><span>No hay solicitudes pendientes.</span></div>}
            {applicants.map((applicant) => (
              <div className="application-row" key={applicant.id}>
                <span className={`student-avatar ${applicant.tone}`}>{applicant.initials}</span>
                <div><strong>{applicant.name}</strong><small>{applicant.specialty} · {applicant.date}</small></div>
                <button className="reject-button" onClick={() => rejectApplicant(applicant.id)} aria-label={`Rechazar a ${applicant.name}`}>×</button>
                <button className="approve-button" onClick={() => approveProfessor(applicant.id)}><Icon name="check" size={15} /> Aceptar</button>
              </div>
            ))}
          </div>
        </article>

        <article className="professors-panel">
          <div className="panel-head"><div><span className="eyebrow">EQUIPO ACTIVO</span><h2>Alumnos por profesor</h2></div><button className="text-button">Ver equipo <Icon name="arrow" size={16} /></button></div>
          <div className="professor-table">
            <div className="professor-table-head"><span>PROFESOR</span><span>ALUMNOS</span><span>CLASES</span><span /></div>
            {professors.map((professor) => (
              <div className="professor-table-row" key={`${professor.id}-${professor.name}`}>
                <div><span className={`student-avatar ${professor.tone}`}>{professor.initials}</span><span><strong>{professor.name}</strong><small>{professor.specialty}</small></span></div>
                <div className="student-count"><strong>{professor.students}</strong><span className="count-bar"><i style={{ width: `${Math.min(professor.students * 4, 100)}%` }} /></span></div>
                <span className="class-count">{professor.classes}</span>
                <button className="delete-button" onClick={() => removeProfessor(professor.id)} aria-label={`Eliminar a ${professor.name}`}><Icon name="trash" size={16} /></button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export default Admin;
