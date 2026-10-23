import { useState } from "react";
import Icon from "../common/Icon";

function RegisterForm({ onRegister }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // 1. Extraer automáticamente todos los valores de los inputs del formulario
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());

    // 2. Mapear y adaptar los datos para el Backend
    const payload = {
      name: formValues.name,
      lastname: formValues.surname,
      phone: formValues.phone,
      dni: formValues.dni,
      email: formValues.email,
      password: formValues.password,
      rol: "student",
    };

    console.log("📤 Enviando datos desde RegisterForm:", payload);

    // 3. Enviar el objeto compilado a la función handleRegister
    onRegister(payload);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field-row">
        <label>
          <span style={{fontSize:'12px'}}>Nombre</span>
          <div className="input-wrap">
            <input name="name" placeholder="Nombre" required />
          </div>
        </label>

        <label>
          <span style={{fontSize:'12px'}}>Apellido</span>
          <div className="input-wrap">
            <input name="surname" placeholder="Apellido" required />
          </div>
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
        <span style={{fontSize:'12px'}}>Correo electrónico</span>
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
        <span style={{fontSize:'12px'}}>Contraseña</span>
        <div className="input-wrap">
          <Icon name="shield" size={18} />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            required
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
      </label>

      <label className="terms">
        <input type="checkbox" required />
        <span>Acepto los términos de uso y la política de privacidad.</span>
      </label>

      <button className="auth-submit" type="submit">
        Crear mi cuenta
        <Icon name="arrow" size={18} />
      </button>
    </form>
  );
}

export default RegisterForm;
