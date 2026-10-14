import { NavLink } from "react-router-dom";
import navigation from "../data/navigation";
import adminNavigation from "../data/adminNavigation";
import professorNavigation from '../data/professorNavigation';
import Icon from "./icon";

function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Icon name="activity" size={20} />
        </div>
        <div>
          <div className="brand-title">FITLAB</div>
          <div className="brand-subtitle">SPORT & FITNESS</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Navegación general (para todos) */}
        {navigation.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Navegación exclusiva para Admin */}
        {user.rol === 'admin' && adminNavigation.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Navegación para Profesores / Postulación según el rol */}
        {professorNavigation
          .filter((item) => {
            if (user.rol === 'profesor') return item.id === 'panel-profesor';
            if (user.rol === 'aumno') return item.id === 'postular-profesor'; // Si es alumno ve la postulación
            return false; // Si es admin no ve ninguna
          })
          .map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={onLogout}>
          <Icon name="logout" size={19} />
          <span>Cerrar sesión</span>
        </button>

        <NavLink 
          to="/perfil" 
          className={({ isActive }) => `profile-mini ${isActive ? "active" : ""}`}
        >
          <div className="avatar">JP</div>
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-role">
              {user.rol === 'admin' ? 'Administrador' : user.rol === 'profesor' ? 'Profesor' : 'Socio activo'}
            </div>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;