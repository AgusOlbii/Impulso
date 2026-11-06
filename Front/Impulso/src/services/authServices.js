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

export const updateProfile = async (_user, formData) => {
  return request("/users/me", {
    method: "PUT",
    body: JSON.stringify(formData),
  });
};