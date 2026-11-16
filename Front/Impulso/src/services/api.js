// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL;

export async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (data.errors && Array.isArray(data.errors)) {
    const mensajesZod = data.errors.map(err => err.message).join(". ");
    throw new Error(mensajesZod);
  }
    throw new Error(data.message || data.error || "Ocurrió un error en el servidor");
  }

  return data;
}