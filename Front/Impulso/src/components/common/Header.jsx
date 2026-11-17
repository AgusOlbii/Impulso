import Icon from "./Icon";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

function Header({ eyebrow, title }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const handleClick = () => {
    navigate("/perfil");
  };
  return (
    <header className="topbar">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>
      <div className="top-actions">
        <button
          className="icon-button"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} />
        </button>
        <button onClick={handleClick} className="avatar mobile-avatar" aria-label="Abrir perfil">LM</button>
      </div>
    </header>
  );
}

export default Header;