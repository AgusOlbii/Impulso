import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../common/Icon";
import Header from "../common/Header";
import { currentDay } from "../../utils/date.now";
import { coachService } from "../../services/coach.service";
import { mediaUrl } from "../../utils/media";

const tones = ["sand", "rose", "blue", "green"];

function Professor({ user }) {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [student, setStudent] = useState("");
  const [routineName, setRoutineName] = useState("Fuerza inicial");
  const [assigned, setAssigned] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [price, setPrice] = useState("");
  const [priceNotice, setPriceNotice] = useState("");

  useEffect(() => {
    coachService.me().then((data) => {
      setPerfil(data.coach);
      setPrice(data.coach?.price ?? "");
    }).catch(() => {});
    coachService.myStudents().then((data) => {
      const lista = (data.students || []).map((item, index) => ({
        ...item,
        displayName: `${item.name} ${item.lastname || ""}`.trim(),
        initials: `${item.name?.[0] || "A"}${item.lastname?.[0] || ""}`.toUpperCase(),
        tone: tones[index % tones.length],
        status: Number(item.adjusted_count) > 0 ? "Ajustó la rutina" : "Asignado",
        adjusted: Number(item.adjusted_count) > 0,
      }));
      setAlumnos(lista);
      if (lista[0]) setStudent(lista[0].displayName);
    }).catch(() => {});
  }, []);

  const assignRoutine = () => {
    if (!routineName.trim()) return;
    setAssigned([...assigned, `${routineName} · ${student}`]);
    setBuilderOpen(false);
  };
  const navigate = useNavigate();

  return (
    <>
      <Header eyebrow="PANEL DEL PROFESOR" title={`Hola, ${user.name}`} />

      <section className="professor-welcome">
        <div>
          <span className="tag bright">{currentDay().eyebrowText}</span>
          <h2>Acompañá cada progreso.</h2>
          <p>
            {perfil
              ? `${perfil.specialty} · ${perfil.experience}${
                  Number(perfil.reviews) > 0
                    ? ` · ${String(perfil.rating).replace(".", ",")} (${perfil.reviews})`
                    : " · todavía sin valoraciones"
                }`
              : "Tenés alumnos esperando seguimiento en sus rutinas."}
          </p>
          <form
            className="professor-price-form"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                const data = await coachService.updateMe({ price: Number(price) });
                setPerfil(data.coach);
                setPriceNotice("Tarifa actualizada. Los alumnos ya la ven en Profesores.");
              } catch (error) {
                setPriceNotice(error.message || "No se pudo guardar la tarifa.");
              }
            }}
          >
            <label>
              <span>Tu valor mensual</span>
              <input
                type="number"
                min="0"
                step="100"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </label>
            <button className="outline-button" type="submit">
              Guardar valor
            </button>
          </form>
          {priceNotice && <small>{priceNotice}</small>}
        </div>
        {(perfil?.image || user.image_url) && (
          <img
            className="professor-welcome-photo"
            src={mediaUrl(perfil?.image || user.image_url)}
            alt={user.name}
            style={{ objectPosition: perfil?.position || "center 20%" }}
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
                {alumnos.map((item) => (
                  <option key={item.id}>{item.displayName}</option>
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
            <strong>{alumnos.length}</strong>
            <p>seguimiento de la semana</p>
          </div>
        </article>
        <article>
          <span className="stat-icon">
            <Icon name="clipboard" />
          </span>
          <div>
            <small>TU TARIFA</small>
            <strong>
              {Number(perfil?.price) > 0
                ? `$${Number(perfil.price).toLocaleString("es-AR")}`
                : "A definir"}
            </strong>
            <p>lo que ven tus alumnos</p>
          </div>
        </article>
        <article>
          <span className="stat-icon alert">
            <Icon name="bell" />
          </span>
          <div>
            <small>POR REVISAR</small>
            <strong>{alumnos.filter((item) => item.adjusted).length}</strong>
            <p>alumnos que ajustaron la carga</p>
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
            <button
              onClick={() => navigate("/create/routine")}
              className="text-button"
            >
              Crear rutina <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="student-list">
            {alumnos.length === 0 && (
              <p className="apply-account">Todavía no te contrató ningún alumno.</p>
            )}
            {alumnos.map((item) => (
              <article className="student-row" key={item.id}>
                <span className={`student-avatar ${item.tone}`}>{item.initials}</span>
                <div className="student-name">
                  <strong>{item.displayName}</strong>
                  <small>Alumno asignado</small>
                </div>
                <div className="student-goal">
                  <span>OBJETIVO</span>
                  <strong>{item.goal || "Sin especificar"}</strong>
                </div>
                <span className={`student-status ${item.adjusted ? "urgent" : ""}`}>
                  {item.status}
                </span>
                <button
                  className="student-action"
                  onClick={() => navigate(`/create/routine?studentId=${item.id}`)}
                >
                  <Icon name="edit" size={17} />
                  <span>Rutina</span>
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
