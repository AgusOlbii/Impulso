
import { useState } from "react";
import Icon from "../icon";

function LoginForm({ onEnter, loading }) {
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const credentials = {
      email: formData.get("email").trim(),
      password: formData.get("password"),
    };

    await onEnter(credentials);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        <span>Correo electrónico</span>

        <div className="input-wrap">
          <Icon name="user" size={18} />

          <input
            name="email"
            type="email"
            placeholder="nombre@email.com"
            autoComplete="username"
            required
          />
        </div>
      </label>

      <label>
        <span>Contraseña</span>

        <div className="input-wrap">
          <Icon name="shield" size={18} />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Ingresá tu contraseña"
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
      </label>

      <div className="auth-options">
        <label>
          <input type="checkbox" />
          <span>Recordarme</span>
        </label>

        <button type="button">
          Olvidé mi contraseña
        </button>
      </div>

      <button
        className="auth-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Ingresar a mi cuenta"}
        {!loading && <Icon name="arrow" size={18} />}
      </button>
    </form>
  );
}

export default LoginForm;