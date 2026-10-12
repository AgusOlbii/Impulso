import { useState } from "react";
import Icon from "../icon";
import photo from "../../data/photo";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterPage";

function AuthLayout({  onEnter, onRegister, error, loading  }) {
const [mode, setMode] = useState("login");
const [message, setMessage] = useState("");


const handleModeChange = (newMode) => {
setMode(newMode);
setMessage("");
};

return ( 

<main className="auth-page"> 
    <section className="auth-visual"> 
        <img src={photo} alt="Atleta entrenando en Impulso" /> 
    <div className="auth-visual-overlay" />
    <div className="auth-brand brand">
      <div className="brand-mark">
        <Icon name="activity" size={24} />
      </div>
      <span>IMPULSO</span>
    </div>

    <div className="auth-quote">
      <span className="hero-kicker">
        <span /> TU ESPACIO. TU RITMO.
      </span>
      <h1>
        Entrená con
        <br />
        un propósito.
      </h1>
      <p>Todo lo que necesitás para avanzar, en un solo lugar.</p>
    </div>

    <div className="auth-proof">
      <div>
        <strong>482</strong>
        <span>socios activos</span>
      </div>
      <i />
      <div>
        <strong>18</strong>
        <span>profesionales</span>
      </div>
      <i />
      <div>
        <strong>32</strong>
        <span>clases semanales</span>
      </div>
    </div>
  </section>

  <section className="auth-form-side">
    <div className="auth-mobile-brand brand">
      <div className="brand-mark">
        <Icon name="activity" size={22} />
      </div>
      <span>IMPULSO</span>
    </div>

    <div className="auth-card">
      <span className="eyebrow">
        {mode === "login"
          ? "BIENVENIDO DE NUEVO"
          : "SUMATE A IMPULSO"}
      </span>

      <h2>
        {mode === "login"
          ? "Iniciá sesión"
          : "Creá tu cuenta"}
      </h2>

      <p>
        {mode === "login"
          ? "Ingresá tus datos para continuar entrenando."
          : "Completá tus datos y empezá a entrenar con nosotros."}
      </p>

      <div className="auth-tabs">
        <button
          type="button"
          className={mode === "login" ? "active" : ""}
          onClick={() => handleModeChange("login")}
        >
          Ingresar
        </button>

        <button
          type="button"
          className={mode === "register" ? "active" : ""}
          onClick={() => handleModeChange("register")}
        >
          Registrarme
        </button>
      </div>

      {(message || error) && (
        <div className="auth-message" role="status">
          <Icon name={error ? "shield" : "check"} size={16} />
          {error || message}
        </div>
      )}

      {mode === "login" ? (
        <LoginForm
          onEnter={onEnter}
          error={error}
          loading={loading}
        />
      ) : (
        <RegisterForm onRegister={onRegister} />
      )}

      <div className="demo-access">
        <span>ACCESO SEGURO</span>
        <p>Ingresá con tu cuenta para continuar.</p>
      </div>
    </div>

    <p className="auth-help">
      ¿Necesitás ayuda? <button type="button">Contactar a recepción</button>
    </p>
  </section>
</main>
);
}

export default AuthLayout;
