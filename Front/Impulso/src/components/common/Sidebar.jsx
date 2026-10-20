import { NavLink } from "react-router-dom";
import adminNavigation from "../../data/adminNavigation";
import professorNavigation from '../../data/professorNavigation';
import studentNavigation from "../../data/studentNavigation";
import Icon from "./Icon";


function Sidebar({ user }) {
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
        {/* Navegación exclusiva para Alumnos */}
        {user.rol === 'alumno' && studentNavigation.map((item) => (
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

        {/* Navegación para Profesores */}
        {user.rol === 'profesor' && professorNavigation.map((item) => (
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