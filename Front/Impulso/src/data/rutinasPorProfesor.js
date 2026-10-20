const diasNombre = [
  { id: "lunes", nombre: "Lunes" },
  { id: "martes", nombre: "Martes" },
  { id: "miercoles", nombre: "Miércoles" },
  { id: "jueves", nombre: "Jueves" },
  { id: "viernes", nombre: "Viernes" },
];

function armarSemana(profesorId, dias) {
  return diasNombre.map((dia, index) => {
    const data = dias[index];
    return {
      id: dia.id,
      nombre: dia.nombre,
      titulo: data.titulo,
      ejercicios: data.ejercicios.map((ejercicio, orden) => ({
        id: `${profesorId}-${dia.id}-${orden + 1}`,
        number: String(orden + 1).padStart(2, "0"),
        ...ejercicio,
      })),
    };
  });
}

const rutinasPorProfesor = {
  1: armarSemana(1, [
    {
      titulo: "Fuerza · tren inferior",
      ejercicios: [
        { name: "Sentadilla con barra", detail: "4 x 6", weight: "60 kg", muscle: "Piernas" },
        { name: "Peso muerto rumano", detail: "4 x 8", weight: "70 kg", muscle: "Posterior" },
      ],
    },
    {
      titulo: "Fuerza · tren superior",
      ejercicios: [
        { name: "Press banca", detail: "5 x 5", weight: "55 kg", muscle: "Pecho" },
        { name: "Remo con barra", detail: "4 x 8", weight: "50 kg", muscle: "Espalda" },
      ],
    },
    {
      titulo: "Fuerza · posterior",
      ejercicios: [
        { name: "Hip thrust", detail: "4 x 8", weight: "80 kg", muscle: "Glúteos" },
        { name: "Curl femoral", detail: "3 x 12", weight: "25 kg", muscle: "Isquios" },
      ],
    },
    {
      titulo: "Fuerza · empuje",
      ejercicios: [
        { name: "Press militar", detail: "4 x 6", weight: "30 kg", muscle: "Hombros" },
        { name: "Fondos", detail: "3 x 8", weight: "Cuerpo", muscle: "Tríceps" },
      ],
    },
    {
      titulo: "Fuerza · técnica liviana",
      ejercicios: [
        { name: "Sentadilla goblet", detail: "3 x 10", weight: "16 kg", muscle: "Piernas" },
        { name: "Face pull", detail: "3 x 15", weight: "12 kg", muscle: "Espalda" },
      ],
    },
  ]),
  2: armarSemana(2, [
    {
      titulo: "Cardio · intervalos",
      ejercicios: [
        { name: "Bici 40/20", detail: "12 rondas", weight: "—", muscle: "Cardio" },
        { name: "Mountain climbers", detail: "4 x 40 seg", weight: "—", muscle: "Core" },
      ],
    },
    {
      titulo: "Cardio · resistencia",
      ejercicios: [
        { name: "Cinta inclinada", detail: "30 min", weight: "—", muscle: "Cardio" },
        { name: "Step-ups", detail: "3 x 12", weight: "8 kg", muscle: "Piernas" },
      ],
    },
    {
      titulo: "Cardio · HIIT",
      ejercicios: [
        { name: "Burpees", detail: "5 x 10", weight: "—", muscle: "Full body" },
        { name: "Battle ropes", detail: "8 x 20 seg", weight: "—", muscle: "Cardio" },
      ],
    },
    {
      titulo: "Cardio · bajo impacto",
      ejercicios: [
        { name: "Elíptico", detail: "25 min", weight: "—", muscle: "Cardio" },
        { name: "Core hollow hold", detail: "4 x 30 seg", weight: "—", muscle: "Abdomen" },
      ],
    },
    {
      titulo: "Cardio · cierre de semana",
      ejercicios: [
        { name: "Remo máquina", detail: "20 min", weight: "—", muscle: "Cardio" },
        { name: "Jumping jacks", detail: "3 x 45 seg", weight: "—", muscle: "Cardio" },
      ],
    },
  ]),
  3: armarSemana(3, [
    {
      titulo: "Hipertrofia · piernas",
      ejercicios: [
        { name: "Prensa", detail: "4 x 10", weight: "120 kg", muscle: "Piernas" },
        { name: "Extensión de cuádriceps", detail: "3 x 12", weight: "35 kg", muscle: "Cuádriceps" },
      ],
    },
    {
      titulo: "Hipertrofia · pecho",
      ejercicios: [
        { name: "Press inclinado", detail: "4 x 10", weight: "28 kg", muscle: "Pecho" },
        { name: "Aperturas", detail: "3 x 12", weight: "12 kg", muscle: "Pecho" },
      ],
    },
    {
      titulo: "Hipertrofia · espalda",
      ejercicios: [
        { name: "Jalón al pecho", detail: "4 x 10", weight: "45 kg", muscle: "Espalda" },
        { name: "Remo mancuerna", detail: "3 x 10", weight: "22 kg", muscle: "Espalda" },
      ],
    },
    {
      titulo: "Hipertrofia · hombros",
      ejercicios: [
        { name: "Vuelos laterales", detail: "4 x 12", weight: "8 kg", muscle: "Hombros" },
        { name: "Press arnold", detail: "3 x 10", weight: "12 kg", muscle: "Hombros" },
      ],
    },
    {
      titulo: "Hipertrofia · brazos",
      ejercicios: [
        { name: "Curl barra", detail: "3 x 10", weight: "20 kg", muscle: "Bíceps" },
        { name: "Extensión de tríceps", detail: "3 x 12", weight: "18 kg", muscle: "Tríceps" },
      ],
    },
  ]),
  4: armarSemana(4, [
    {
      titulo: "Funcional · tren inferior",
      ejercicios: [
        { name: "Sentadilla a una pierna", detail: "3 x 8", weight: "Cuerpo", muscle: "Piernas" },
        { name: "Kettlebell swing", detail: "4 x 15", weight: "16 kg", muscle: "Posterior" },
      ],
    },
    {
      titulo: "Funcional · empuje",
      ejercicios: [
        { name: "Flexiones", detail: "4 x 12", weight: "Cuerpo", muscle: "Pecho" },
        { name: "Press con disco", detail: "3 x 10", weight: "10 kg", muscle: "Hombros" },
      ],
    },
    {
      titulo: "Funcional · core",
      ejercicios: [
        { name: "Plancha", detail: "4 x 40 seg", weight: "—", muscle: "Core" },
        { name: "Dead bug", detail: "3 x 10", weight: "—", muscle: "Abdomen" },
      ],
    },
    {
      titulo: "Funcional · full body",
      ejercicios: [
        { name: "Thruster", detail: "4 x 8", weight: "20 kg", muscle: "Full body" },
        { name: "Farmer walk", detail: "4 x 30 m", weight: "20 kg", muscle: "Core" },
      ],
    },
    {
      titulo: "Funcional · movilidad activa",
      ejercicios: [
        { name: "World's greatest stretch", detail: "3 x 6", weight: "—", muscle: "Movilidad" },
        { name: "Bird dog", detail: "3 x 8", weight: "—", muscle: "Core" },
      ],
    },
  ]),
  5: armarSemana(5, [
    {
      titulo: "WOD · squat bias",
      ejercicios: [
        { name: "Front squat", detail: "5 x 5", weight: "50 kg", muscle: "Piernas" },
        { name: "Box jump", detail: "4 x 8", weight: "—", muscle: "Potencia" },
      ],
    },
    {
      titulo: "WOD · pull",
      ejercicios: [
        { name: "Dominadas", detail: "5 x 5", weight: "Cuerpo", muscle: "Espalda" },
        { name: "Clean de potencia", detail: "4 x 3", weight: "40 kg", muscle: "Full body" },
      ],
    },
    {
      titulo: "WOD · metcon",
      ejercicios: [
        { name: "Wall ball", detail: "AMRAP 12 min", weight: "6 kg", muscle: "Full body" },
        { name: "Remo 500 m", detail: "4 series", weight: "—", muscle: "Cardio" },
      ],
    },
    {
      titulo: "WOD · push",
      ejercicios: [
        { name: "Push press", detail: "5 x 5", weight: "35 kg", muscle: "Hombros" },
        { name: "Burpee over bar", detail: "3 x 10", weight: "—", muscle: "Cardio" },
      ],
    },
    {
      titulo: "WOD · engine",
      ejercicios: [
        { name: "Assault bike", detail: "10 cal x 6", weight: "—", muscle: "Cardio" },
        { name: "Toes to bar", detail: "4 x 8", weight: "—", muscle: "Core" },
      ],
    },
  ]),
  6: armarSemana(6, [
    {
      titulo: "Movilidad · cadera",
      ejercicios: [
        { name: "90/90 hip switch", detail: "3 x 8", weight: "—", muscle: "Cadera" },
        { name: "Pigeon pose", detail: "2 x 45 seg", weight: "—", muscle: "Glúteos" },
      ],
    },
    {
      titulo: "Movilidad · hombros",
      ejercicios: [
        { name: "Circulos de hombro", detail: "3 x 12", weight: "—", muscle: "Hombros" },
        { name: "Wall angels", detail: "3 x 10", weight: "—", muscle: "Espalda" },
      ],
    },
    {
      titulo: "Movilidad · columna",
      ejercicios: [
        { name: "Gato-vaca", detail: "3 x 10", weight: "—", muscle: "Columna" },
        { name: "Rotación torácica", detail: "3 x 8", weight: "—", muscle: "Espalda" },
      ],
    },
    {
      titulo: "Movilidad · tobillos",
      ejercicios: [
        { name: "Dorsiflexión en pared", detail: "3 x 10", weight: "—", muscle: "Tobillos" },
        { name: "Sentadilla profunda sostenida", detail: "3 x 40 seg", weight: "—", muscle: "Cadera" },
      ],
    },
    {
      titulo: "Movilidad · flujo suave",
      ejercicios: [
        { name: "Saludo al sol adaptado", detail: "5 vueltas", weight: "—", muscle: "Full body" },
        { name: "Respiración diafragmática", detail: "5 min", weight: "—", muscle: "Core" },
      ],
    },
  ]),
};

export default rutinasPorProfesor;
