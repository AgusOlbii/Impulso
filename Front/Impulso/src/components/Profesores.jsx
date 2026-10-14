import { useState } from "react";
import Header from "../components/Header";
import Icon from "./icon";


const coaches = [
  {
    id: 1,
    name: "Martín López",
    specialty: "Fuerza",
    rating: "4,9",
    reviews: 87,
    price: "$18.000",
    description: "Entrenamiento de fuerza y técnica para ganar potencia de forma segura y progresiva.",
    experience: "8 años de experiencia",
    image: "https://images.unsplash.com/photo-1628935291759-bbaf33a66dc6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    position: "center 28%",
  },
  {
    id: 2,
    name: "Carla Ruiz",
    specialty: "Cardio",
    rating: "4,8",
    reviews: 64,
    price: "$15.500",
    description: "Sesiones dinámicas para mejorar tu resistencia, energía y rendimiento cardiovascular.",
    experience: "6 años de experiencia",
    image: "https://images.unsplash.com/photo-1679214894748-bcfdcb4dcaff?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    position: "center 35%",
  },
  {
    id: 3,
    name: "Diego Pérez",
    specialty: "Musculación",
    rating: "4,9",
    reviews: 112,
    price: "$20.000",
    description: "Planes de hipertrofia personalizados con seguimiento de cargas, técnica y nutrición.",
    experience: "10 años de experiencia",
    image: "https://images.unsplash.com/photo-1694712301331-1088f9dacb1a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    position: "center 22%",
  },
  {
    id: 4,
    name: "Sofía Díaz",
    specialty: "Funcional",
    rating: "4,7",
    reviews: 51,
    price: "$14.000",
    description: "Movimiento funcional, movilidad y coordinación para sentirte mejor en tu día a día.",
    experience: "5 años de experiencia",
    image: "https://images.unsplash.com/photo-1623605931891-d5b95ee98459?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    position: "center 30%",
  },
  {
    id: 5,
    name: "Joaquín Luna",
    specialty: "Cross Training",
    rating: "4,8",
    reviews: 73,
    price: "$17.500",
    description: "Desafíos de alta intensidad adaptados a tu nivel para superar tus propias marcas.",
    experience: "7 años de experiencia",
    image: "https://images.unsplash.com/photo-1693214099505-aadb39c60c90?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    position: "center 25%",
  },
  {
    id: 6,
    name: "Camila Benítez",
    specialty: "Movilidad",
    rating: "5,0",
    reviews: 46,
    price: "$16.000",
    description: "Movilidad, recuperación y prevención de lesiones para entrenar con mayor libertad.",
    experience: "6 años de experiencia",
    image: "https://images.unsplash.com/photo-1746559845100-0f5a36bfdbe6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    position: "center 32%",
  },
];

function Profesores() {
  const [filter, setFilter] = useState("Todos");
  const [hired, setHired] = useState([]);
  const [notice, setNotice] = useState("");
  const specialties = ["Todos", "Fuerza", "Cardio", "Musculación", "Funcional", "Cross Training", "Movilidad"];
  const visibleCoaches = filter === "Todos" ? coaches : coaches.filter((coach) => coach.specialty === filter);

  const toggleHire = (coach) => {
    const isHired = hired.includes(coach.id);
    setHired(isHired ? hired.filter((id) => id !== coach.id) : [...hired, coach.id]);
    setNotice(isHired ? `Cancelaste la solicitud con ${coach.name}.` : `¡Listo! ${coach.name} recibió tu solicitud y se contactará con vos.`);
  };

  return (
    <>
      <Header eyebrow="ENTRENAMIENTO PERSONAL" title="Encontrá tu profesor" />
      <section className="coach-intro">
        <div>
          <span className="hero-kicker"><span /> PROFESIONALES DE IMPULSO</span>
          <h2>Un plan pensado<br />para vos.</h2>
          <p>Elegí un especialista, coordiná tu primera sesión y empezá a trabajar en tus objetivos.</p>
        </div>
        <div className="coach-intro-proof">
          <strong>18</strong>
          <span>profesionales<br />certificados</span>
          <i />
          <strong>4,9</strong>
          <span>valoración<br />promedio</span>
        </div>
      </section>

      <div className="coach-toolbar">
        <div>
          <span className="eyebrow">ELEGÍ TU ESPECIALIDAD</span>
          <div className="coach-filters">
            {specialties.map((specialty) => (
              <button key={specialty} className={`filter ${filter === specialty ? "active" : ""}`} onClick={() => setFilter(specialty)}>
                {specialty}
              </button>
            ))}
          </div>
        </div>
        <span className="coach-count">{visibleCoaches.length} profesores disponibles</span>
      </div>

      {notice && <div className="success-message coach-notice"><Icon name="check" size={18} /><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Cerrar notificación">×</button></div>}

      <section className="coach-grid">
        {visibleCoaches.map((coach) => {
          const isHired = hired.includes(coach.id);
          return (
            <article className="coach-card" key={coach.id}>
              <div className="coach-photo">
                <img src={coach.image} alt={`${coach.name}, profesor de ${coach.specialty}`} style={{ objectPosition: coach.position }} />
                <span className="coach-available"><i /> Disponible</span>
                <span className="coach-specialty">{coach.specialty}</span>
              </div>
              <div className="coach-card-body">
                <div className="coach-name-row">
                  <div><h3>{coach.name}</h3><span>{coach.experience}</span></div>
                  <span className="coach-rating"><Icon name="star" size={14} /><strong>{coach.rating}</strong><small>({coach.reviews})</small></span>
                </div>
                <p>{coach.description}</p>
                <div className="coach-card-footer">
                  <div><span>DESDE</span><strong>{coach.price}</strong><small>/ sesión</small></div>
                  <button className={isHired ? "hire-button hired" : "hire-button"} onClick={() => toggleHire(coach)}>
                    {isHired ? <><Icon name="check" size={16} /> Solicitud enviada</> : <>Contratar <Icon name="arrow" size={16} /></>}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}


export default Profesores;
