import Icon from "./Icon";
import Header from "./Header";


function Profile({ user, onLogout }) {


  return (
    <>
      <Header eyebrow="TU CUENTA" title="Mi perfil" />
      <div className="profile-hero">
        <div className="avatar avatar-large">LM</div>
        <div><h2>{user.name}</h2><p>Socia desde {user.creado_en}</p><span className="status-pill"><i /> Membresía activa</span></div>
        <button className="outline-button">Editar perfil</button>
      </div>
      <div className="profile-layout">
        <section className="profile-section">
          <span className="eyebrow">INFORMACIÓN PERSONAL</span>
          <div className="info-grid">
            <div><span>Nombre completo</span><strong>{user.name}</strong></div>
            <div><span>DNI</span><strong>{user.dni}</strong></div>
            <div><span>Correo electrónico</span><strong>{user.email}</strong></div>
            <div><span>Teléfono</span><strong>{user.phone}</strong></div>
          </div>
        </section>
        <aside className="plan-panel">
          <div className="plan-icon"><Icon name="shield" /></div>
          <span className="eyebrow">TU MEMBRESÍA</span>
          <h3>Plan completo</h3><p>Acceso libre a sala y todas las clases.</p>
          <div className="plan-dates"><div><span>Inicio</span><strong>06 JUN 2025</strong></div><div><span>Renovación</span><strong>06 JUL 2025</strong></div></div>
          <button className="primary-button full">Gestionar membresía</button>
        </aside>
      </div>
      <div className="settings-list">
        <button><span className="setting-icon"><Icon name="bell" /></span><span><strong>Notificaciones</strong><small>Recordatorios de clases y vencimientos</small></span><Icon name="arrow" /></button>
        <button><span className="setting-icon"><Icon name="settings" /></span><span><strong>Preferencias</strong><small>Privacidad y configuración de la cuenta</small></span><Icon name="arrow" /></button>
        <button className="danger" onClick={onLogout}><span className="setting-icon"><Icon name="logout" /></span><span><strong>Cerrar sesión</strong><small>Salir de tu cuenta de Impulso</small></span><Icon name="arrow" /></button>
      </div>
    </>
  );
}

export default Profile;
