const estadoInscripto = (socio, clase) => {
  const hoy = new Date().toISOString().slice(0, 10);
  if (clase.inscriptions.includes(socio.id)) {
    return "ya_inscripto";
  }
  if (socio.vencimiento < hoy) {
    return "vencida";
  }
  if (socio.membresia === "basica" && clase.type !== "musculacion") {
    return "plan_no_cubre";
  }
  const ocupados = clase.inscriptions.length;
  if (ocupados >= clase.spots) {
    return "sin_cupo";
  }
  return "Puede";
};
export default estadoInscripto;
