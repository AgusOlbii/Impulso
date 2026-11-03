
const API_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Ocurrió un error en el servidor");
  }

  return data;
}

export function login(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser() {
  return request("/auth/me");
}

export function logout() {
  return request("/auth/logout", {
    method: "POST",
  });
}


export async function register(userData) {
  const response = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al registrar el usuario");
  }

  return data;
}

export const updateProfile = async (user, formData) => {
  try {
    let endpoint = "";

    // Decidimos la ruta según el rol del usuario
    if (user.rol === "student") {
      console.log('peticion a student')
      endpoint = `/students/${user.id}/update`; 
    } else if (user.rol === "coach") {
      console.log('peticion a coach')
      endpoint = `/coaches/${user.id}/update`;
    } else {
      // Para admin u otros roles que solo actualizan la tabla users
      console.log('peticion a USER')
      endpoint = `/users/${user.id}/update`;
    }

    const response = await request(endpoint, {
      method: "PUT",
      body: JSON.stringify(formData),
    });

    return response;
  } catch (error) {
    console.error("Error al actualizar perfil:", error.message);
    throw error;
  }
}; 