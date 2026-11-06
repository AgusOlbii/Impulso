import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../common/Icon";
import Header from "../common/Header";
import { currentDay } from "../../utils/date.now";
import professors from "../../data/professors";
import { coachService } from "../../services/coach.service";
import { mediaUrl } from "../../utils/media";

const tones = ["sand", "rose", "blue", "green"];

function initialsOf(name, lastname) {
  return `${(name || "?")[0]}${(lastname || " ")[0]}`.toUpperCase();
}

function Professor({ user }) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [perfil, setPerfil] = useState(
    professors.find((item) => item.name.toLowerCase() === user?.name?.toLowerCase()) || null
  );
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [bioNotice, setBioNotice] = useState("");
  const [notes, setNotes] = useState({});
  const [noteNotice, setNoteNotice] = useState({});

  useEffect(() => {
    coachService
      .me()
      .then((data) => {
        setPerfil((actual) => ({ ...(actual || {}), ...data.coach }));
        setDescription(data.coach?.description || "");
        setPrice(data.coach?.price ? String(data.coach.price) : "");
      })
      .catch(() => {});
    coachService
      .myStudents()
      .then((data) => {
        const list = data.students || [];
        setStudents(list);
        setNotes(
          Object.fromEntries(list.map((item) => [item.id, item.coach_note || ""])),
        );
      })
      .catch(() => setStudents([]));
  }, []);

  const withoutRoutine = students.filter((item) => Number(item.routine_count) === 0).length;
  const routineTotal = students.reduce((total, item) => total + Number(item.routine_count || 0), 0);

  return (
    <>
      <Header eyebrow="PANEL DEL PROFESOR" title={`Hola, ${user.name}`} />

      <section className="professor-welcome">
        <div>
          <span className="tag bright">{currentDay().eyebrowText}</span>
          <h2>Acompañá cada progreso.</h2>
          <p>
            {perfil
              ? `${perfil.specialty || ""} · ${perfil.experience || ""}`.replace(/^ · | · $/g, "") ||
                "Tenés alumnos esperando seguimiento en sus rutinas."
              : "Tenés alumnos esperando seguimiento en sus rutinas."}
          </p>
          <form
            className="professor-bio-form"
            onSubmit={async (event) => {
              event.preventDefault();
              setBioNotice("");
              try {
                const monto = Number(String(price).replace(",", "."));
                if (!Number.isFinite(monto) || monto <= 0) {
                  setBioNotice("Indicá un monto mensual mayor a 0.");
                  return;
                }
                const data = await coachService.updateMe({
                  description: description.trim(),
                  price: monto,
                });
                setPerfil((actual) => ({ ...(actual || {}), ...data.coach }));
                setPrice(data.coach?.price ? String(data.coach.price) : String(monto));
                setBioNotice("Perfil público actualizado. Ya se ve en Profesores.");
              } catch (error) {
                setBioNotice(error.message || "No se pudo guardar el perfil.");
              }
            }}
          >
            <label>
              <span>Tu descripción pública</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Este texto es el que ven los alumnos en Profesores."
                required
                minLength={10}
              />
            </label>
            <label>
              <span>Monto mensual</span>
              <input
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Ej: 18000"
                required
              />
            </label>
            <button className="outline-button" type="submit">
              Guardar perfil
            </button>
          </form>
          {bioNotice && <small>{bioNotice}</small>}
        </div>
        {(perfil?.image || user.image_url) && (
          <img
            className="professor-welcome-photo"
            src={mediaUrl(perfil?.image || user.image_url)}
            alt={user.name}
            style={{ objectPosition: perfil?.position || "center 20%" }}
          />
        )}
        <button className="primary-button" onClick={() => navigate("/create/routine")}>
          <Icon name="plus" size={18} /> Crear rutina
        </button>
      </section>

      <section className="professor-stats">
        <article>
          <span className="stat-icon lime">
            <Icon name="users" />
          </span>
          <div>
            <small>ALUMNOS ACTIVOS</small>
            <strong>{students.length}</strong>
            <p>te eligieron como profesor</p>
          </div>
        </article>
        <article>
          <span className="stat-icon">
            <Icon name="clipboard" />
          </span>
          <div>
            <small>RUTINAS ACTIVAS</small>
            <strong>{routineTotal}</strong>
            <p>asignadas a tus alumnos</p>
          </div>
        </article>
        <article>
          <span className="stat-icon alert">
            <Icon name="bell" />
          </span>
          <div>
            <small>POR REVISAR</small>
            <strong>{withoutRoutine}</strong>
            <p>{withoutRoutine === 1 ? "alumno sin rutina" : "alumnos sin rutina"}</p>
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
          </div>
          <div className="student-list">
            {students.length === 0 && (
              <div className="library-empty">
                <Icon name="users" />
                <strong>Todavía no tenés alumnos</strong>
                <span>Van a aparecer acá cuando te elijan en Profesores.</span>
              </div>
            )}
            {students.map((item, index) => {
              const fullName = `${item.name} ${item.lastname || ""}`.trim();
              const withoutPlan = Number(item.routine_count) === 0;
              return (
                <div className="student-block" key={item.id}>
                  <article className="student-row">
                    <span className={`student-avatar ${tones[index % tones.length]}`}>
                      {initialsOf(item.name, item.lastname)}
                    </span>
                    <div className="student-name">
                      <strong>{fullName}</strong>
                      <small>{item.email}</small>
                    </div>
                    <div className="student-goal">
                      <span>OBJETIVO</span>
                      <strong>{item.goal || "Sin definir"}</strong>
                    </div>
                    <span className={`student-status ${withoutPlan ? "urgent" : ""}`}>
                      {withoutPlan ? "Sin rutina" : `${item.routine_count} rutina${Number(item.routine_count) === 1 ? "" : "s"}`}
                    </span>
                    <button
                      className="student-action"
                      onClick={() => navigate(`/create/routine?studentId=${item.id}`)}
                    >
                      <Icon name={withoutPlan ? "plus" : "edit"} size={17} />
                      <span>{withoutPlan ? "Crear" : "Ver"}</span>
                    </button>
                  </article>
                  <form
                    className="student-note-form"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      try {
                        await coachService.saveStudentNote(item.id, notes[item.id] || "");
                        setNoteNotice((actual) => ({ ...actual, [item.id]: "Nota guardada. Solo la ve este alumno." }));
                      } catch (error) {
                        setNoteNotice((actual) => ({
                          ...actual,
                          [item.id]: error.message || "No se pudo guardar la nota.",
                        }));
                      }
                    }}
                  >
                    <label>
                      <span>Nota para {item.name}</span>
                      <textarea
                        value={notes[item.id] || ""}
                        onChange={(event) =>
                          setNotes((actual) => ({ ...actual, [item.id]: event.target.value }))
                        }
                        placeholder="Este texto aparece en Mi rutina, solo para este alumno."
                      />
                    </label>
                    <button className="outline-button" type="submit">
                      Guardar nota
                    </button>
                    {noteNotice[item.id] && <small>{noteNotice[item.id]}</small>}
                  </form>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

export default Professor;
