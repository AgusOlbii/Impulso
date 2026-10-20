import { NavLink } from "react-router-dom";
import Icon from "./common/Icon";

function Unauthorized() {
  return (
    <div className="unauthorized-page" style={{ display: "grid", placeItems: "center", minHeight: "75vh", padding: "20px" }}>
      <div className="unauthorized-card" style={{ maxWidth: "480px", width: "100%", textAlign: "center", padding: "40px 30px", background: "var(--card-bg, #ffffff)", borderRadius: "24px", boxShadow: "0 10px 30px rgba(10,27,22,0.06)" }}>
      
        <div className="unauthorized-icon-wrap" style={{ width: "64px", height: "64px", background: "var(--green, #0A1B16)", color: "var(--lime, #bcf000)", borderRadius: "18px", display: "grid", placeItems: "center", margin: "0 auto 24px" }}>
          <Icon name="lock" size={28} />
        </div>

        <span className="hero-kicker" style={{ display: "block", fontSize: "11px", fontWeight: "700", letterSpacing: "1.2px", color: "#666", marginBottom: "8px" }}>
          ACCESO RESTRINGIDO
        </span>

        <h2 style={{ fontSize: "26px", color: "var(--green, #0A1B16)", fontWeight: "700", marginBottom: "12px" }}>
          No tenés permisos para ingresar
        </h2>

        <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", marginBottom: "32px" }}>
          La sección a la que intentas acceder requiere un rol específico que tu cuenta actual no posee. Si crees que se trata de un error, comunícate con el administrador.
        </p>

        <NavLink to="/" className="primary-button" style={{ width: "100%", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <Icon name="home" size={18} /> Volver al inicio
        </NavLink>
        
      </div>
    </div>
  );
}

export default Unauthorized;