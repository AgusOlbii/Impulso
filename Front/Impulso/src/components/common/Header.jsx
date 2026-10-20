import Icon from "./Icon";
import { useNavigate } from "react-router-dom";

function Header({ eyebrow, title }) {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/perfil')
  }
  return (
    <header className="topbar">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>
      <div className="top-actions">
        <button className="icon-button" aria-label="Notificaciones"><Icon name="bell" /><span className="notification-dot" /></button>
        <button onClick={handleClick} className="avatar mobile-avatar" aria-label="Abrir perfil">LM</button>
      </div>
    </header>
  );
}

export default Header;
