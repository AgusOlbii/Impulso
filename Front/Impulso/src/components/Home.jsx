import Icon from "./icon";
import Header from "../components/Header";
import photo from "../data/photo";
import professors from "../data/professors";
import { currentDay } from "../utils/date.now";

function Home({ setPage, user, profesorElegidoId }) {
  const profesor = professors.find((item) => item.id === profesorElegidoId);
  return (
    <>
      <Header
        eyebrow={currentDay().eyebrowText}
        title={`${user.name}`}
      />

      <section className="hero">
        <img src={photo} alt="Atleta entrenando fuerza en el gimnasio" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-kicker">
            <span /> ENERGÍA PARA SUPERARTE
          </span>
          <h2>
            Tu mejor versión
            <br />
            empieza hoy.
          </h2>
          <p>Continuá tu progreso. Cada entrenamiento cuenta.</p>
          <button className="primary-button" onClick={() => setPage("rutina")}>
            Ver entrenamiento <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="streak">
          <strong>8</strong>
          <span>
            días de
            <br />
            constancia
          </span>
        </div>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="calendar" size={20} />
          </div>
          <div>
            <div className="stat-value">
              {profesor ? profesor.name.split(" ")[0] : "—"}
            </div>
            <div className="stat-label">PROFESOR ASIGNADO</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="activity" size={20} />
          </div>
          <div>
            <div className="stat-value">12</div>
            <div className="stat-label">ENTRENAMIENTOS COMPLETADOS</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="clock" size={20} />
          </div>
          <div>
            <div className="stat-value">8.5 h</div>
            <div className="stat-label">TIEMPO ENTRENADO</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="users" size={20} />
          </div>
          <div>
            <div className="stat-value">4</div>
            <div className="stat-label">PROFESORES DISPONIBLES</div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">PROFESORES</div>
            <h2>Elegí con quién entrenar</h2>
          </div>

          <button className="text-button" onClick={() => setPage("profesores")}>
            Ver todos <Icon name="arrow" size={16} />
          </button>
        </div>

        <div className="coach-grid">
          {professors
            .filter((item) => !item.status || item.status === "approved")
            .slice(0, 3)
            .map((item) => (
              <article className="coach-card" key={item.id}>
                <div className="coach-photo">
                  <img
                    src={item.image || item.photo}
                    alt={item.name}
                    style={{ objectPosition: item.position || "center 20%" }}
                  />
                  <span className="coach-available">
                    <i /> Disponible
                  </span>
                  <span className="coach-specialty">{item.specialty}</span>
                </div>
                <div className="coach-card-body">
                  <h3>{item.name}</h3>
                  <p>{item.description || item.bio}</p>
                </div>
              </article>
            ))}
        </div>
      </section>
    </>
  );
}
export default Home;
