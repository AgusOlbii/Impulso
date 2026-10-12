import Icon from "./icon";
function Header({ eyebrow, title }) {
  return (
    <header className="topbar">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>
      <div className="top-actions">
        <button className="icon-button" aria-label="Notificaciones"><Icon name="bell" /><span className="notification-dot" /></button>
        <button className="avatar mobile-avatar" aria-label="Abrir perfil">LM</button>
      </div>
    </header>
  );
}

export default Header;
