const nombresDia = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

function armarSemana(profesorId, dias) {
  return dias.map((data) => ({
    id: data.id,
    nombre: nombresDia[data.id],
    titulo: data.titulo,
    ejercicios: data.ejercicios.map((ejercicio, orden) => ({
      id: `${profesorId}-${data.id}-${orden + 1}`,
      number: String(orden + 1).padStart(2, "0"),
      ...ejercicio,
    })),
  }));
}

const rutinasPorProfesor = {
  1: armarSemana(1, [
    {
      id: "lunes",
      titulo: "Fuerza · tren inferior",
      ejercicios: [
        { name: "Sentadilla con barra", detail: "4 x 6", weight: "60 kg", muscle: "Piernas" },
        { name: "Peso muerto rumano", detail: "4 x 8", weight: "70 kg", muscle: "Posterior" },
      ],
    },
    {
      id: "martes",
      titulo: "Fuerza · tren superior",
      ejercicios: [
        { name: "Press banca", detail: "5 x 5", weight: "55 kg", muscle: "Pecho" },
        { name: "Remo con barra", detail: "4 x 8", weight: "50 kg", muscle: "Espalda" },
      ],
    },
    {
      id: "miercoles",
      titulo: "Fuerza · posterior",
      ejercicios: [
        { name: "Hip thrust", detail: "4 x 8", weight: "80 kg", muscle: "Glúteos" },
        { name: "Curl femoral", detail: "3 x 12", weight: "25 kg", muscle: "Isquios" },
      ],
    },
    {
      id: "jueves",
      titulo: "Fuerza · empuje",
      ejercicios: [
        { name: "Press militar", detail: "4 x 6", weight: "30 kg", muscle: "Hombros" },
        { name: "Fondos", detail: "3 x 8", weight: "Cuerpo", muscle: "Tríceps" },
      ],
    },
    {
      id: "viernes",
      titulo: "Fuerza · técnica liviana",
      ejercicios: [
        { name: "Sentadilla goblet", detail: "3 x 10", weight: "16 kg", muscle: "Piernas" },
        { name: "Face pull", detail: "3 x 15", weight: "12 kg", muscle: "Espalda" },
      ],
    },
  ]),
  2: armarSemana(2, [
    {
      id: "lunes",
      titulo: "Cardio · intervalos",
      ejercicios: [
        { name: "Bici 40/20", detail: "12 rondas", weight: "—", muscle: "Cardio" },
        { name: "Mountain climbers", detail: "4 x 40 seg", weight: "—", muscle: "Core" },
      ],
    },
    {
      id: "martes",
      titulo: "Cardio · resistencia",
      ejercicios: [
        { name: "Cinta inclinada", detail: "30 min", weight: "—", muscle: "Cardio" },
        { name: "Step-ups", detail: "3 x 12", weight: "8 kg", muscle: "Piernas" },
      ],
    },
    {
      id: "jueves",
      titulo: "Cardio · HIIT",
      ejercicios: [
        { name: "Burpees", detail: "5 x 10", weight: "—", muscle: "Full body" },
        { name: "Battle ropes", detail: "8 x 20 seg", weight: "—", muscle: "Cardio" },
      ],
    },
    {
      id: "viernes",
      titulo: "Cardio · bajo impacto",
      ejercicios: [
        { name: "Elíptico", detail: "25 min", weight: "—", muscle: "Cardio" },
        { name: "Core hollow hold", detail: "4 x 30 seg", weight: "—", muscle: "Abdomen" },
      ],
    },
    {
      id: "sabado",
      titulo: "Cardio · cierre de semana",
      ejercicios: [
        { name: "Remo máquina", detail: "20 min", weight: "—", muscle: "Cardio" },
        { name: "Jumping jacks", detail: "3 x 45 seg", weight: "—", muscle: "Cardio" },
      ],
    },
  ]),
  3: armarSemana(3, [
    {
      id: "lunes",
      titulo: "Hipertrofia · piernas",
      ejercicios: [
        { name: "Prensa", detail: "4 x 10", weight: "120 kg", muscle: "Piernas" },
        { name: "Extensión de cuádriceps", detail: "3 x 12", weight: "35 kg", muscle: "Cuádriceps" },
      ],
    },
    {
      id: "martes",
      titulo: "Hipertrofia · pecho",
      ejercicios: [
        { name: "Press inclinado", detail: "4 x 10", weight: "28 kg", muscle: "Pecho" },
        { name: "Aperturas", detail: "3 x 12", weight: "12 kg", muscle: "Pecho" },
      ],
    },
    {
      id: "miercoles",
      titulo: "Hipertrofia · espalda",
      ejercicios: [
        { name: "Jalón al pecho", detail: "4 x 10", weight: "45 kg", muscle: "Espalda" },
        { name: "Remo mancuerna", detail: "3 x 10", weight: "22 kg", muscle: "Espalda" },
      ],
    },
    {
      id: "jueves",
      titulo: "Hipertrofia · hombros",
      ejercicios: [
        { name: "Vuelos laterales", detail: "4 x 12", weight: "8 kg", muscle: "Hombros" },
        { name: "Press arnold", detail: "3 x 10", weight: "12 kg", muscle: "Hombros" },
      ],
    },
    {
      id: "viernes",
      titulo: "Hipertrofia · brazos",
      ejercicios: [
        { name: "Curl barra", detail: "3 x 10", weight: "20 kg", muscle: "Bíceps" },
        { name: "Extensión de tríceps", detail: "3 x 12", weight: "18 kg", muscle: "Tríceps" },
      ],
    },
    {
      id: "sabado",
      titulo: "Hipertrofia · full body liviano",
      ejercicios: [
        { name: "Sentadilla goblet", detail: "3 x 12", weight: "16 kg", muscle: "Piernas" },
        { name: "Remo sentado", detail: "3 x 12", weight: "35 kg", muscle: "Espalda" },
      ],
    },
  ]),
  4: armarSemana(4, [
    {
      id: "martes",
      titulo: "Funcional · tren inferior",
      ejercicios: [
        { name: "Sentadilla a una pierna", detail: "3 x 8", weight: "Cuerpo", muscle: "Piernas" },
        { name: "Kettlebell swing", detail: "4 x 15", weight: "16 kg", muscle: "Posterior" },
      ],
    },
    {
      id: "jueves",
      titulo: "Funcional · empuje",
      ejercicios: [
        { name: "Flexiones", detail: "4 x 12", weight: "Cuerpo", muscle: "Pecho" },
        { name: "Press con disco", detail: "3 x 10", weight: "10 kg", muscle: "Hombros" },
      ],
    },
    {
      id: "viernes",
      titulo: "Funcional · core",
      ejercicios: [
        { name: "Plancha", detail: "4 x 40 seg", weight: "—", muscle: "Core" },
        { name: "Dead bug", detail: "3 x 10", weight: "—", muscle: "Abdomen" },
      ],
    },
    {
      id: "sabado",
      titulo: "Funcional · full body",
      ejercicios: [
        { name: "Thruster", detail: "4 x 8", weight: "20 kg", muscle: "Full body" },
        { name: "Farmer walk", detail: "4 x 30 m", weight: "20 kg", muscle: "Core" },
      ],
    },
    {
      id: "domingo",
      titulo: "Funcional · movilidad activa",
      ejercicios: [
        { name: "World's greatest stretch", detail: "3 x 6", weight: "—", muscle: "Movilidad" },
        { name: "Bird dog", detail: "3 x 8", weight: "—", muscle: "Core" },
      ],
    },
  ]),
  5: armarSemana(5, [
    {
      id: "lunes",
      titulo: "WOD · squat bias",
      ejercicios: [
        { name: "Front squat", detail: "5 x 5", weight: "50 kg", muscle: "Piernas" },
        { name: "Box jump", detail: "4 x 8", weight: "—", muscle: "Potencia" },
      ],
    },
    {
      id: "miercoles",
      titulo: "WOD · pull",
      ejercicios: [
        { name: "Dominadas", detail: "5 x 5", weight: "Cuerpo", muscle: "Espalda" },
        { name: "Clean de potencia", detail: "4 x 3", weight: "40 kg", muscle: "Full body" },
      ],
    },
    {
      id: "viernes",
      titulo: "WOD · metcon",
      ejercicios: [
        { name: "Wall ball", detail: "AMRAP 12 min", weight: "6 kg", muscle: "Full body" },
        { name: "Remo 500 m", detail: "4 series", weight: "—", muscle: "Cardio" },
      ],
    },
    {
      id: "sabado",
      titulo: "WOD · engine",
      ejercicios: [
        { name: "Assault bike", detail: "10 cal x 6", weight: "—", muscle: "Cardio" },
        { name: "Toes to bar", detail: "4 x 8", weight: "—", muscle: "Core" },
      ],
    },
  ]),
  6: armarSemana(6, [
    {
      id: "lunes",
      titulo: "Movilidad · cadera",
      ejercicios: [
        { name: "90/90 hip switch", detail: "3 x 8", weight: "—", muscle: "Cadera" },
        { name: "Pigeon pose", detail: "2 x 45 seg", weight: "—", muscle: "Glúteos" },
      ],
    },
    {
      id: "miercoles",
      titulo: "Movilidad · hombros",
      ejercicios: [
        { name: "Circulos de hombro", detail: "3 x 12", weight: "—", muscle: "Hombros" },
        { name: "Wall angels", detail: "3 x 10", weight: "—", muscle: "Espalda" },
      ],
    },
    {
      id: "viernes",
      titulo: "Movilidad · columna",
      ejercicios: [
        { name: "Gato-vaca", detail: "3 x 10", weight: "—", muscle: "Columna" },
        { name: "Rotación torácica", detail: "3 x 8", weight: "—", muscle: "Espalda" },
      ],
    },
    {
      id: "domingo",
      titulo: "Movilidad · flujo suave",
      ejercicios: [
        { name: "Saludo al sol adaptado", detail: "5 vueltas", weight: "—", muscle: "Full body" },
        { name: "Respiración diafragmática", detail: "5 min", weight: "—", muscle: "Core" },
      ],
    },
  ]),
};

export default rutinasPorProfesor;
