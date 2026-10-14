import Icon from "./icon";
import Header from "../components/Header";

import professors from "../data/professors";

function Profile({ user, onLogout, profesorElegidoId }) {
  const profesor = professors.find((item) => item.id === profesorElegidoId);
  return (
    <>
      <Header eyebrow="TU CUENTA" title="Mi perfil" />
      <div className="profile-hero">
        <div className="avatar avatar-large">LM</div>
        <div>
          <h2>{user.name}</h2>
          <p>Socio desde {user.creado_en}</p>
          <span className="status-pill">
            <i /> Cuenta activa
          </span>
        </div>
        <button className="outline-button">Editar perfil</button>
      </div>
      <div className="profile-layout">
        <section className="profile-section">
          <span className="eyebrow">INFORMACIÓN PERSONAL</span>
          <div className="info-grid">
            <div>
              <span>Nombre completo</span>
              <strong>{user.name}</strong>
            </div>
            <div>
              <span>DNI</span>
              <strong>{user.dni}</strong>
            </div>
            <div>
              <span>Correo electrónico</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span>Teléfono</span>
              <strong>{user.phone}</strong>
            </div>
          </div>
        </section>
        <aside className="plan-panel">
          <div className="plan-icon">
            <Icon name="user" />
          </div>
          <span className="eyebrow">TU PROFESOR</span>
          <h3>{profesor ? profesor.name : "Sin profesor asignado"}</h3>
          <p>
            {profesor
              ? `${profesor.specialty} · ${profesor.price || `$${profesor.precio?.toLocaleString("es-AR")}`} / mes`
              : "Elegí un profesor desde el menú Profesores."}
          </p>
        </aside>
      </div>
      <div className="settings-list">
        <button>
          <span className="setting-icon">
            <Icon name="bell" />
          </span>
          <span>
            <strong>Notificaciones</strong>
            <small>Recordatorios y mensajes</small>
          </span>
          <Icon name="arrow" />
        </button>
        <button>
          <span className="setting-icon">
            <Icon name="settings" />
          </span>
          <span>
            <strong>Preferencias</strong>
            <small>Privacidad y configuración de la cuenta</small>
          </span>
          <Icon name="arrow" />
        </button>
        <button className="danger" onClick={onLogout}>
          <span className="setting-icon">
            <Icon name="logout" />
          </span>
          <span>
            <strong>Cerrar sesión</strong>
            <small>Salir de tu cuenta de Impulso</small>
          </span>
          <Icon name="arrow" />
        </button>
      </div>
    </>
  );
}

export default Profile;
