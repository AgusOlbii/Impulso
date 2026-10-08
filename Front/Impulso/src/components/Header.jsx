import Icon from "./icon";
function Header({ eyebrow, title }) {
  return (
    <header className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
      </div>

      <div className="header-actions">
        <button className="icon-button">
          <Icon name="bell" size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-user">
          <div className="avatar small">JP</div>
          <div>
            <div className="header-user-name">Juliana Pérez</div>
            <div className="header-user-role">Socio</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
