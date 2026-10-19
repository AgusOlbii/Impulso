import Icon from './Icon';
import studentNavigation from '../../data/studentNavigation';
import adminNavigation from '../../data/adminNavigation';
import professorNavigation from '../../data/professorNavigation';
import { NavLink } from 'react-router-dom';


function MobileNav({ user }) {
  return (
    <nav className="mobile-nav" aria-label="Navegación móvil">
      {/* Navegacion para Alumnos */}
      {user.rol === "alumno" && studentNavigation.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
          >
          <Icon name={item.icon} size={25}/>
        </NavLink>
      ))}

      {/*Navegacion exclusiva para Admin */}
      {user.rol === 'admin' && adminNavigation.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
        >
          <Icon name={item.icon} size={25} />
          
        </NavLink>
      ))}

      {/*Navegacion para Profesores*/}
      {user.rol === "profesor" && professorNavigation.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon name={item.icon} size={25} />
            
          </NavLink>
        ))}
    </nav>
  );
}

export default MobileNav;