import navigation from "../data/navigation";
import Icon from "./icon";
import adminNavigation from "../data/adminNavigation";

function Sidebar({ page, setPage }) {
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
        <div className="nav-section">MENÚ</div>

        {navigation.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </button>
        ))}

        <div className="nav-section admin-label">GESTIÓN</div>

        {adminNavigation.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item">
          <Icon name="settings" size={19} />
          <span>Configuración</span>
        </button>

        <button className="nav-item">
          <Icon name="logout" size={19} />
          <span>Cerrar sesión</span>
        </button>

        <div className="profile-mini">
          <div className="avatar">JP</div>
          <div>
            <div className="profile-name">Juliana Pérez</div>
            <div className="profile-role">Socio activo</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;
