import Icon from "./icon";
import Header from "../components/Header";
import photo from "../data/photo";
import professors from "../data/professors";
function Home({ setPage }) {
  return (
    <>
      <Header eyebrow="LUNES 12 DE AGOSTO" title="Buenos días, Juliana." />

      <section className="hero-card">
        <div className="hero-content">
          <div className="hero-eyebrow">TU PROGRESO</div>
          <h2>Entrená con intención.</h2>
          <p>
            Hoy tenés una sesión programada. Mantené la constancia y seguí
            construyendo tu mejor versión.
          </p>

          <button className="primary-button" onClick={() => setPage("rutina")}>
            Ver mi rutina
            <Icon name="arrow" size={17} />
          </button>
        </div>

        <div className="hero-image">
          <img src={photo} alt="Entrenamiento" />
        </div>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="calendar" size={20} />
          </div>
          <div>
            <div className="stat-value">—</div>
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

        <div className="classes-list">
          {professors
            .filter((item) => item.status === "approved")
            .slice(0, 3)
            .map((item) => (
              <div className="class-row" key={item.id}>
                <div className="class-time">
                  ${item.precio.toLocaleString("es-AR")}
                </div>

                <div className="class-main">
                  <span className="tag">{item.specialty}</span>
                  <h3>{item.name}</h3>
                  <p>{item.bio}</p>
                </div>

                <div className="class-status available">DISPONIBLE</div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
export default Home;
