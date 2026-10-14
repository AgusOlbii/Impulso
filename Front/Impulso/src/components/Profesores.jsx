import { useState } from "react";
import Header from "./Header";
import Icon from "./icon";
import professors from "../data/professors";
import estadoEleccion from "../config/reglasProfesor";

const filtros = [
  "Todos",
  "Fuerza",
  "Cardio",
  "Musculación",
  "Funcional",
  "Cross Training",
  "Movilidad",
];

function textoBoton(estado) {
  if (estado === "ya_elegido") return "Elegido";
  if (estado === "cambiar") return "Cambiar";
  if (estado === "no_disponible") return "No disponible";
  return "Contratar";
}

function Profesores({ user, profesorElegidoId, onElegir, onDejar }) {
  const [filtro, setFiltro] = useState("Todos");
  const socio = { id: user?.id, profesorId: profesorElegidoId };

  const disponibles = professors.filter(
    (item) => !item.status || item.status === "approved"
  );
  const lista =
    filtro === "Todos"
      ? professors
      : professors.filter((item) => item.specialty === filtro);

  return (
    <>
      <Header eyebrow="COMUNIDAD" title="Profesores" />

      <section className="coach-intro">
        <div>
          <span className="tag bright">ENTRENADORES</span>
          <h2>Elegí con quién entrenar.</h2>
          <p>
            Mirá especialidad, experiencia y estilo. Contratá al profesor que
            mejor se adapte a tu objetivo.
          </p>
        </div>
        <div className="coach-intro-proof">
          <strong>{disponibles.length}</strong>
          <span>profesores disponibles</span>
          <i />
          <strong>4.8</strong>
          <span>valoración media</span>
        </div>
      </section>

      <div className="coach-toolbar">
        <div className="coach-filters">
          {filtros.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter ${filtro === item ? "active" : ""}`}
              onClick={() => setFiltro(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="coach-count">
          {
            lista.filter((item) => !item.status || item.status === "approved")
              .length
          }{" "}
          profesores disponibles
        </span>
      </div>

      <div className="coach-grid">
        {lista.map((item) => {
          const estado = estadoEleccion(socio, item);
          const puedeClick =
            estado === "puede" ||
            estado === "cambiar" ||
            estado === "ya_elegido";

          return (
            <article className="coach-card" key={item.id}>
              <div className="coach-photo">
                <img
                  src={item.image || item.photo}
                  alt={item.name}
                  style={{ objectPosition: item.position || "center 20%" }}
                />
                {(!item.status || item.status === "approved") && (
                  <span className="coach-available">
                    <i /> Disponible
                  </span>
                )}
                <span className="coach-specialty">{item.specialty}</span>
              </div>

              <div className="coach-card-body">
                <div className="coach-name-row">
                  <div>
                    <h3>{item.name}</h3>
                    <span>{item.experience || `${item.experiencia} años de experiencia`}</span>
                  </div>
                  <div className="coach-rating">
                    <span>★</span>
                    <strong>{item.rating}</strong>
                    <small>({item.reviews})</small>
                  </div>
                </div>
                <p>{item.description || item.bio}</p>
                <div className="coach-card-footer">
                  <div>
                    <span>DESDE</span>
                    <strong>
                      {item.price ||
                        `$${item.precio?.toLocaleString("es-AR")}`}
                    </strong>
                    <small>/ mes</small>
                  </div>
                  <button
                    type="button"
                    disabled={!puedeClick}
                    className={`hire-button ${estado === "ya_elegido" ? "hired" : ""}`}
                    onClick={() =>
                      estado === "ya_elegido" ? onDejar() : onElegir(item.id)
                    }
                  >
                    {textoBoton(estado)}
                    <Icon name="arrow" size={14} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default Profesores;
