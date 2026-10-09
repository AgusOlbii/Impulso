import { useState } from "react";
import Header from "../components/Header";
import classes from "../data/classes";
import Icon from "./icon";
import socioActual from "../data/socioActual";
import estadoInscripto from "../config/reglasClase";

function Classes() {
  const [selectedDay, setSelectedDay] = useState("12");
  const [clase, setClase] = useState(classes);
  

  /* -- funcion para inscribirse a la clase -- */
  const inscribirse = (claseId) => {
  setClase((listaAnterior) =>
    listaAnterior.map((clase) => {
      if (clase.id !== claseId) {
        return clase;
      }
      if (clase.inscriptions.includes(socioActual.id)){
        return clase;
      }
      return {
        ...clase,
        inscriptions: [...clase.inscriptions, socioActual.id],
      };
    })
  );
  console.log(clase);
};

  const days = [
    { day: "LUN", date: "12" },
    { day: "MAR", date: "13" },
    { day: "MIÉ", date: "14" },
    { day: "JUE", date: "15" },
    { day: "VIE", date: "16" },
    { day: "SÁB", date: "17" },
  ];

  return (
    <>
      <Header eyebrow="AGENDA" title="Clases" />

      {/* -- SECCION DE DIAS -- */}
      <section className="section">
        <div className="days">
          {days.map((item) => (
            <button
              key={item.date}
              className={`day ${selectedDay === item.date ? "active" : ""}`}
              onClick={() => setSelectedDay(item.date)}
            >
              <span>{item.day}</span>
              <strong>{item.date}</strong>
            </button>
          ))}
        </div>

        {/* -- SECCION DE CLASES -- */}
        <div className="classes-list large">
          {clase.map((item) => {
            /* -- estado actual del socio -- */
            const estado = estadoInscripto(socioActual, item);
            return (
              <div className="class-row" key={item.id}>
                <div className="class-time">{item.time}</div>

                <div className="class-main">
                  <span className="tag">{item.type}</span>
                  <h3>{item.name}</h3>
                  <p>{item.coach}</p>
                </div>

                <div className="class-duration">
                  <Icon name="clock" size={16} />
                  {item.duration}
                </div>

                <div className="class-spots">
                  <span>{item.spots - item.inscriptions.length}</span>
                  <small>cupos</small>
                </div>

                <button
                  onClick={() => inscribirse(item.id)}
                  className={
                    item.booked
                      ? "secondary-button booked-button"
                      : "primary-button small"
                  }
                >
                  {estado}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
export default Classes;
