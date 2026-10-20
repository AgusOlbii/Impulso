const estadoEleccion = (socio, profesor) => {
  if (profesor.status && profesor.status !== "approved") {
    return "no_disponible";
  }
  if (socio.profesorId === profesor.id) {
    return "ya_elegido";
  }
  if (socio.profesorId) {
    return "cambiar";
  }
  return "puede";
};

export default estadoEleccion;
