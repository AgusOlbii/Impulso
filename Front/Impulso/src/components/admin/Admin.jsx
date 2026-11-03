import { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service"; 
import Icon from "../common/Icon";
import Header from "../common/Header";

const activeProfessors = [
  { id: 1, initials: "ML", name: "Martín López", specialty: "Cross Training", students: 24, classes: 12, tone: "sand" },
  { id: 2, initials: "CR", name: "Carla Ruiz", specialty: "Spinning", students: 19, classes: 10, tone: "rose" },
  { id: 3, initials: "SD", name: "Sofía Díaz", specialty: "GAP", students: 17, classes: 8, tone: "blue" },
  { id: 4, initials: "DP", name: "Diego Pérez", specialty: "Musculación", students: 14, classes: 9, tone: "green" },
];

function Admin() {
  const [applicants, setApplicants] = useState([]);
  const [professors, setProfessors] = useState(activeProfessors);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  // Cargar solicitudes pendientes al montar el componente
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await adminService.getPendingCoachApplications();
        setApplicants(data);
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error);
        setNotice("Error al cargar las solicitudes pendientes desde el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const approveProfessor = async (id) => {
    try {
      const applicant = applicants.find((item) => item.id === id);
      if (!applicant) return;

      // Llamada real al endpoint del backend que creamos
      await adminService.approveCoachApplication(id);

      // Actualizamos el estado local
      setApplicants(applicants.filter((item) => item.id !== id));
      
      // Agregamos opcionalmente a la lista visual de profesores activos
      setProfessors([
        ...professors, 
        { 
          id: applicant.user_id || id, 
          initials: applicant.name ? applicant.name.substring(0, 2).toUpperCase() : "PF", 
          name: applicant.name || "Profesor Nuevo", 
          specialty: applicant.specialty, 
          students: 0, 
          classes: 0,
          tone: "sand" 
        }
      ]);
      
      setNotice(`La solicitud fue aprobada con éxito. El usuario ahora es profesor.`);
    } catch (error) {
      console.error("Error al aprobar:", error);
      setNotice(error.message || "Error al aprobar la solicitud.");
    }
  };

  const rejectApplicant = async (id) => {
    try {
      // Si en el futuro creas un endpoint DELETE o PATCH para rechazar en backend, lo llamarías aquí.
      // Por ahora lo filtramos de forma local:
      const applicant = applicants.find((item) => item.id === id);
      setApplicants(applicants.filter((item) => item.id !== id));
      if (applicant) setNotice(`La solicitud fue rechazada.`);
    } catch (error) {
      console.error("Error al rechazar:", error);
    }
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
        <div>
          <h2>Resumen del gimnasio</h2>
          <p>Información actualizada en tiempo real.</p>
        </div>
        <button className="outline-button">
          <Icon name="calendar" size={16} /> Panel Activo
        </button>
      </section>

      {notice && (
        <div className="success-message admin-notice">
          <Icon name="check" size={18} />
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Cerrar notificación">×</button>
        </div>
      )}

      {/* KPIs de ejemplo (puedes conectarlos a una API de métricas más adelante) */}
      <section className="admin-kpis">
        <article><div className="kpi-top"><span className="stat-icon lime"><Icon name="users" /></span><span className="kpi-trend positive">+8,4%</span></div><small>SOCIOS TOTALES</small><strong>482</strong><p>37 altas este mes</p></article>
        <article><div className="kpi-top"><span className="stat-icon"><Icon name="shield" /></span><span className="kpi-trend positive">+3,2%</span></div><small>MEMBRESÍAS ACTIVAS</small><strong>417</strong><p>86,5% del total</p></article>
        <article><div className="kpi-top"><span className="stat-icon warning"><Icon name="bell" /></span><span className="kpi-trend negative">+12</span></div><small>INACTIVAS / VENCIDAS</small><strong>65</strong><p>Requieren seguimiento</p></article>
        <article><div className="kpi-top"><span className="stat-icon dark"><Icon name="money" /></span><span className="kpi-trend positive">+11,8%</span></div><small>INGRESOS DEL MES</small><strong>$8,42 M</strong><p>Meta: $9,1 M</p></article>
      </section>

      <section className="admin-lists">
        <article className="applications-panel">
          <div className="panel-head">
            <div><span className="eyebrow">SOLICITUDES PENDIENTES</span><h2>Nuevos profesores</h2></div>
            <span className="count-badge">{applicants.length}</span>
          </div>
          <div className="application-list">
            {loading && <div className="empty-state"><strong>Cargando solicitudes...</strong></div>}
            
            {!loading && applicants.length === 0 && (
              <div className="empty-state">
                <Icon name="check" />
                <strong>Todo al día</strong>
                <span>No hay solicitudes pendientes en la base de datos.</span>
              </div>
            )}

            {!loading && applicants.map((applicant) => (
              <div className="application-row" key={applicant.id}>
                <span className={`student-avatar sand`}>
                  {applicant.name ? applicant.name.substring(0, 2).toUpperCase() : "US"}
                </span>
                <div>
                  <strong>{applicant.name || `Usuario ID: ${applicant.user_id}`}</strong>
                  <small>{applicant.specialty} · {applicant.experience} años exp.</small>
                </div>
                <button className="reject-button" onClick={() => rejectApplicant(applicant.id)} aria-label="Rechazar">×</button>
                <button className="approve-button" onClick={() => approveProfessor(applicant.id)}>
                  <Icon name="check" size={15} /> Aceptar
                </button>
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