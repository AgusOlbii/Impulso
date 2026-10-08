import { useState } from "react";
import Header from "../components/Header";
import classes from "../data/classes";
import Icon from "./icon";
function Classes() {
  const [selectedDay, setSelectedDay] = useState("12");

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

        <div className="classes-list large">
          {classes.map((item) => (
            <div className="class-row" key={item.time}>
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
                <span>{item.spots}</span>
                <small>cupos</small>
              </div>

              <button
                className={
                  item.booked
                    ? "secondary-button booked-button"
                    : "primary-button small"
                }
              >
                {item.booked ? "Reservada" : "Reservar"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export default Classes;
