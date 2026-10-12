import navigation from "../data/navigation";
import Icon from "./icon";
import adminNavigation from "../data/adminNavigation";


function Sidebar({ page, setPage, user, onLogout}) {

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

        <button className="nav-item" onClick={onLogout}>
          <Icon name="logout" size={19} />
          <span>Cerrar sesión</span>
        </button>

        <button className="profile-mini" onClick={()=> setPage('Profile')}>
          <div className="avatar">JP</div>
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-role">Socio activo</div>
          </div>
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
