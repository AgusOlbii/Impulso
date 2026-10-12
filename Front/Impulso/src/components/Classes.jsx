import { useState } from "react";
import Header from "../components/Header";
import classes from "../data/classes";
import Icon from "./icon";


function Classes() {
  const [booked, setBooked] = useState(["Cross Training"]);
  return (
    <>
      <Header eyebrow="RESERVÁ TU LUGAR" title="Clases" />
      <div className="page-intro"><div><h2>Encontrá tu próxima clase</h2><p>Elegí una actividad y seguí sumando movimiento.</p></div><button className="search-button"><Icon name="search" /> Buscar clase</button></div>
      <div className="date-strip">
        {["LUN|17", "MAR|18", "MIÉ|19", "JUE|20", "VIE|21", "SÁB|22", "DOM|23"].map((date) => {
          const [day, number] = date.split("|");
          return <button key={date} className={number === "18" ? "selected" : ""}><span>{day}</span><strong>{number}</strong>{number === "18" && <i />}</button>;
        })}
      </div>
      <div className="filter-row"><button className="filter active">Todas</button><button className="filter">Fuerza</button><button className="filter">Cardio</button><button className="filter">Funcional</button></div>
      <div className="class-list">
        {classes.map((item) => {
          const isBooked = booked.includes(item.name);
          return (
            <article className="class-row" key={item.name}>
              <div className="class-time"><strong>{item.time}</strong><span>{item.duration}</span></div>
              <div className="class-line" />
              <div className="class-main"><span className="tag">{item.type}</span><h3>{item.name}</h3><p>{item.coach}</p></div>
              <div className="spots"><Icon name="users" size={18} /><span><strong>{item.spots}</strong> cupos</span></div>
              <button className={isBooked ? "book-button booked" : "book-button"} onClick={() => setBooked(isBooked ? booked.filter((name) => name !== item.name) : [...booked, item.name])}>
                {isBooked ? <><Icon name="check" size={17} /> Reservada</> : "Reservar"}
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default Classes;
