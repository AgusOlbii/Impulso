import { useState } from "react";
import Header from "../components/Header";
import Icon from "./icon";
import professors from "../data/professors";
import socioActual from "../data/socioActual";
import estadoEleccion from "../config/reglasProfesor";

function textoBoton(estado) {
  if (estado === "ya_elegido") return "Dejar";
  if (estado === "cambiar") return "Cambiar a este";
  if (estado === "no_disponible") return "No disponible";
  return "Elegir";
}

function Profesores() {
  const [socio, setSocio] = useState(socioActual);

  const elegirProfesor = (profesorId) => {
    setSocio((anterior) => ({
      ...anterior,
      profesorId,
    }));
  };

  const dejarProfesor = () => {
    setSocio((anterior) => ({
      ...anterior,
      profesorId: null,
    }));
  };

  const profesorElegido = professors.find((item) => item.id === socio.profesorId);

  return (
    <>
      <Header eyebrow="COMUNIDAD" title="Profesores" />

      {profesorElegido && (
        <section className="section">
          <div className="eyebrow">TU PROFESOR</div>
          <h2>{profesorElegido.name}</h2>
          <p>
            {profesorElegido.specialty} · $
            {profesorElegido.precio.toLocaleString("es-AR")} / mes
          </p>
        </section>
      )}

      <section className="section">
        <div className="classes-list large">
          {professors.map((item) => {
            const estado = estadoEleccion(socio, item);
            const puedeClick =
              estado === "puede" ||
              estado === "cambiar" ||
              estado === "ya_elegido";

            return (
              <div className="class-row" key={item.id}>
                <div className="class-time">
                  ${item.precio.toLocaleString("es-AR")}
                </div>

                <div className="class-main">
                  <span className="tag">{item.specialty}</span>
                  <h3>{item.name}</h3>
                  <p>{item.bio}</p>
                </div>

                <div className="class-duration">
                  <Icon name="user" size={16} />
                  {item.status === "approved" ? "Disponible" : "Pendiente"}
                </div>

                <button
                  onClick={() =>
                    estado === "ya_elegido"
                      ? dejarProfesor()
                      : elegirProfesor(item.id)
                  }
                  disabled={!puedeClick}
                  className={
                    estado === "ya_elegido"
                      ? "secondary-button booked-button"
                      : "primary-button small"
                  }
                >
                  {textoBoton(estado)}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Profesores;
