import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/admin.service";
import { coachService } from "../../services/coach.service";
import Icon from "../common/Icon";
import Header from "../common/Header";

const tones = ["sand", "rose", "blue", "green"];

function initialsOf(name) {
  const parts = String(name || "").trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "PF";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function sameName(left, right) {
  const clean = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  return clean(left) === clean(right);
}

function Admin() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [confirmName, setConfirmName] = useState("");
  const [removing, setRemoving] = useState(false);

  const loadTeam = async () => {
    const data = await coachService.list();
    setProfessors(data.coaches || []);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await adminService.getPendingCoachApplications();
        setApplicants(data);
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error);
        setNotice("Error al cargar las solicitudes pendientes desde el servidor.");
      }
      try {
        await loadTeam();
      } catch (error) {
        console.error("Error al cargar el equipo:", error);
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

      await adminService.approveCoachApplication(id);

      setApplicants(applicants.filter((item) => item.id !== id));
      await loadTeam();
      setNotice(`La solicitud fue aprobada con éxito. El usuario ahora es profesor.`);
    } catch (error) {
      console.error("Error al aprobar:", error);
      setNotice(error.message || "Error al aprobar la solicitud.");
    }
  };

  const closeDeleteModal = () => {
    setPendingDelete(null);
    setConfirmName("");
  };

  const confirmRemoveProfessor = async () => {
    if (!pendingDelete || !sameName(confirmName, pendingDelete.name) || removing) return;
    setRemoving(true);
    try {
      await adminService.removeCoach(pendingDelete.id, confirmName.trim());
      await loadTeam();
      setNotice(`${pendingDelete.name} fue eliminado del equipo.`);
      closeDeleteModal();
    } catch (error) {
      setNotice(error.message || "No se pudo eliminar al profesor.");
    } finally {
      setRemoving(false);
    }
  };

  const rejectApplicant = async (id) => {
  try {
    await adminService.rejectCoachApplication(id);

    setApplicants(applicants.filter((item) => item.id !== id));
    setNotice("La solicitud fue rechazada.");
    
  } catch (error) {
    console.error("Error al rechazar la solicitud:", error);
    setNotice(error.message || "Error al rechazar la solicitud.");
  }
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
          <div className="panel-head"><div><span className="eyebrow">EQUIPO ACTIVO</span><h2>Alumnos por profesor</h2></div><button type="button" className="text-button" onClick={() => navigate("/profesores")}>Ver equipo <Icon name="arrow" size={16} /></button></div>
          <div className="professor-table">
            <div className="professor-table-head"><span>PROFESOR</span><span>ALUMNOS</span><span>VALORACIONES</span><span /></div>
            {professors.length === 0 && (
              <div className="empty-state">
                <strong>No hay profesores activos</strong>
                <span>Cuando apruebes solicitudes, van a aparecer acá.</span>
              </div>
            )}
            {professors.map((professor, index) => (
              <div className="professor-table-row" key={professor.id}>
                <div><span className={`student-avatar ${tones[index % tones.length]}`}>{initialsOf(professor.name)}</span><span><strong>{professor.name}</strong><small>{professor.specialty}</small></span></div>
                <div className="student-count"><strong>{professor.students || 0}</strong><span className="count-bar"><i style={{ width: `${Math.min((professor.students || 0) * 8, 100)}%` }} /></span></div>
                <span className="class-count">{professor.reviews || 0}</span>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => {
                    setPendingDelete(professor);
                    setConfirmName("");
                  }}
                  aria-label={`Eliminar a ${professor.name}`}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>

      {pendingDelete && (
        <div className="confirm-overlay" onClick={closeDeleteModal}>
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-coach"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="eyebrow">ELIMINAR PROFESOR</span>
            <h3 id="confirm-delete-coach">¿Eliminar a {pendingDelete.name}?</h3>
            <p>
              Va a salir del equipo. Sus alumnos mantienen la rutina, pero quedan sin profesor asignado.
              Para confirmar, escribí su nombre exactamente: <strong>{pendingDelete.name}</strong>
            </p>
            <label>
              <span>Nombre del profesor</span>
              <input
                value={confirmName}
                onChange={(event) => setConfirmName(event.target.value)}
                placeholder={pendingDelete.name}
                autoComplete="off"
              />
            </label>
            <div className="confirm-actions">
              <button type="button" className="text-button" onClick={closeDeleteModal}>
                Cancelar
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={!sameName(confirmName, pendingDelete.name) || removing}
                onClick={confirmRemoveProfessor}
              >
                {removing ? "Eliminando..." : "Eliminar profesor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;