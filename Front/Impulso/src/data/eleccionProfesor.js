const clave = (userId) => `impulso-profesor-${userId}`;

export function leerProfesorElegido(userId) {
  if (!userId) return null;
  const valor = localStorage.getItem(clave(userId));
  return valor ? Number(valor) : null;
}

export function guardarProfesorElegido(userId, profesorId) {
  if (!userId) return;
  if (profesorId == null) {
    localStorage.removeItem(clave(userId));
    return;
  }
  localStorage.setItem(clave(userId), String(profesorId));
}
