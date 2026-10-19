import Icon from "./Icon";
import Header from "./Header";
import photo from "../../data/photo";
import { currentDay } from "../../utils/date.now";
import { NavLink } from "react-router-dom";
import heroData from "../../data/heroData";

function Home({ user }) {
 
  const currentHero = heroData[user?.rol] || heroData.alumno;
  return (
    <>
      <Header eyebrow={currentDay().eyebrowText} title={`Bienvenido ${user.name}`} />

        <section className="hero">
          <img src={photo} alt="Atleta entrenando fuerza en el gimnasio" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-kicker"><span /> ENERGÍA PARA SUPERARTE</span>
            <h2>{currentHero.title}</h2>
            <p>{currentHero.subtitle}</p>
            <NavLink to={currentHero.path} className="primary-button">
              {currentHero.buttonText} <Icon name="arrow" size={18} />
            </NavLink>
          </div>
          {/* <div className="streak"><strong>8</strong><span>días de<br />constancia</span></div> */}
      </section>

      {/* <div className="stats-grid">
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
      </div> */}

    </>
  );
}
export default Home;
