import { request } from "./api.js";

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

export function register(userData) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function uploadPhoto(file) {
  const body = new FormData();
  body.append("photo", file);
  return request("/users/me/photo", {
    method: "POST",
    body,
  });
}

export const updateProfile = async (user, formData) => {
  // Mapeamos el endpoint según el rol del usuario
  const endpoints = {
    student: `/students/${user.id}/update`,
    coach: `/coaches/${user.id}/update`,
  };

  // Si el rol no coincide con student ni coach, usa el por defecto (/users/:id/update)
  const endpoint = endpoints[user.rol] || `/users/${user.id}/update`;

  return request(endpoint, {
    method: "PUT",
    body: JSON.stringify(formData),
  });
};