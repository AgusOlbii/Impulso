import Icon from "./icon";
import Header from "../components/Header";
import photo from "../data/photo";
import classes from "../data/classes";
import { currentDay } from "../utils/date.now";

function Home({ setPage, user }) {
  return (
    <>
      <Header eyebrow={currentDay().eyebrowText} title={`${user.name}`} />

        <section className="hero">
          <img src={photo} alt="Atleta entrenando fuerza en el gimnasio" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-kicker"><span /> ENERGÍA PARA SUPERARTE</span>
            <h2>Tu mejor versión<br />empieza hoy.</h2>
            <p>Continuá tu progreso. Cada entrenamiento cuenta.</p>
            <button className="primary-button" onClick={() => setPage("rutina")}>Ver entrenamiento <Icon name="arrow" size={18} /></button>
          </div>
          <div className="streak"><strong>8</strong><span>días de<br />constancia</span></div>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="calendar" size={20} />
          </div>
          <div>
            <div className="stat-value">3</div>
            <div className="stat-label">CLASES ESTA SEMANA</div>
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
            <div className="stat-label">PROFESORES SEGUIDOS</div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">PRÓXIMAS CLASES</div>
            <h2>Tu agenda</h2>
          </div>

          <button className="text-button" onClick={() => setPage("clases")}>
            Ver todas <Icon name="arrow" size={16} />
          </button>
        </div>

        <div className="classes-list">
          {classes.slice(0, 3).map((item) => (
            <div className="class-row" key={item.time}>
              <div className="class-time">{item.time}</div>

              <div className="class-main">
                <span className="tag">{item.type}</span>
                <h3>{item.name}</h3>
                <p>{item.coach}</p>
              </div>

              <div className="class-duration">
                <Icon name="clock" size={16} />
                {item.duration}
              </div>

              <div
                className={`class-status ${
                  item.booked ? "booked" : "available"
                }`}
              >
                {item.booked ? "RESERVADA" : `${item.spots} CUPOS`}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export default Home;
