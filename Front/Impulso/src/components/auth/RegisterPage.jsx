import { useState } from "react";
import Icon from "../icon";

function RegisterForm({ onRegister }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // 1. Extraer automáticamente todos los valores de los inputs del formulario
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());

    // 2. Mapear y adaptar los datos para el Backend (incluyendo phone y dni)
    const payload = {
      name: `${formValues.name} ${formValues.surname}`.trim(),
      phone: formValues.phone,
      dni: formValues.dni,
      email: formValues.email,
      password: formValues.password,
      rol: formValues.rol || "alumno",
    };

    console.log("📤 Enviando datos desde RegisterForm:", payload);

    // 3. Enviar el objeto compilado a la función handleRegister
    onRegister(payload);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field-row">
        <label>
          <span>Nombre</span>
          <input name="name" placeholder="Lucía" required />
        </label>

        <label>
          <span>Apellido</span>
          <input name="surname" placeholder="Medina" required />
        </label>
      </div>

      <div className="auth-field-row">
        <label>
          <span>DNI</span>
          <input 
            name="dni" 
            type="number" 
            placeholder="35123456" 
            required 
          />
        </label>

        <label>
          <span>Teléfono / Celular</span>
          <input 
            name="phone" 
            type="tel" 
            placeholder="3511234567" 
            required 
          />
        </label>
      </div>

      <label>
        <span>Correo electrónico</span>
        <div className="input-wrap">
          <Icon name="user" size={18} />
          <input
            name="email"
            type="email"
            placeholder="nombre@email.com"
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
            placeholder="Mínimo 8 caracteres"
            minLength={8}
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

      <label className="terms">
        <input type="checkbox" required />
        <span>
          Acepto los términos de uso y la política de privacidad.
        </span>
      </label>

      <button className="auth-submit" type="submit">
        Crear mi cuenta
        <Icon name="arrow" size={18} />
      </button>
    </form>
  );
}

export default RegisterForm;