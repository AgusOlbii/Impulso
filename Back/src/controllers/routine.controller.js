import { RoutineModel } from "../models/routine.model.js";
import { RoutineExerciseModel } from "../models/routine_exercise.model.js";
import { ExerciseModel } from "../models/exercise.model.js";
import { CoachModel } from "../models/coach.model.js";
import { StudentModel } from "../models/student.model.js";
import pool from "../config/db.js";
import { logStudentProgressSchema } from "../schemas/routine_exercise.schema.js";

async function findOrCreateExercise({ name, muscle_group }) {
  const existing = await ExerciseModel.findByName(name);
  if (existing) return existing;
  return ExerciseModel.create({
    name,
    muscle_group: muscle_group || "General",
  });
}

function groupByDay(rows, title) {
  const byDay = {};
  for (const row of rows) {
    const key = row.day_of_week;
    if (!byDay[key]) {
      byDay[key] = {
        id: key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        nombre: key,
        titulo: title,
        ejercicios: [],
      };
    }
    const actualSets = row.actual_sets == null ? null : Number(row.actual_sets);
    const actualReps = row.actual_reps == null ? null : Number(row.actual_reps);
    const actualWeight = row.actual_weight == null ? null : Number(row.actual_weight);
    const adjusted =
      (actualSets != null && actualSets !== Number(row.target_sets)) ||
      (actualReps != null && actualReps !== Number(row.target_reps)) ||
      (actualWeight != null && actualWeight !== Number(row.target_weight));
    byDay[key].ejercicios.push({
      id: row.id,
      number: String(byDay[key].ejercicios.length + 1).padStart(2, "0"),
      name: row.exercise_name,
      detail: `${row.target_sets} x ${row.target_reps}`,
      weight: `${row.target_weight} kg`,
      muscle: row.muscle_group,
      sets: row.target_sets,
      reps: row.target_reps,
      target_weight: Number(row.target_weight) || 0,
      actual_sets: actualSets,
      actual_reps: actualReps,
      actual_weight: actualWeight,
      completed: Boolean(row.completed),
      adjusted,
      exercise_id: row.exercise_id,
      day_of_week: row.day_of_week,
    });
  }
  const order = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  return order.filter((day) => byDay[day]).map((day) => byDay[day]);
}

export const getMyStudentRoutine = async (req, res) => {
  try {
    const student = await StudentModel.findByUserId(req.user.id);
    if (!student) {
      return res.status(404).json({ ok: false, message: "No se encontró el alumno" });
    }
    const routines = await RoutineModel.findByStudentId(student.id);
    const routine = routines[0];
    if (!routine) {
      return res.json({ ok: true, routine: null, days: [] });
    }
    const exercises = await RoutineExerciseModel.findByRoutineId(routine.id);
    return res.json({
      ok: true,
      routine,
      days: groupByDay(exercises, routine.title),
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const getStudentRoutineForCoach = async (req, res) => {
  try {
    const coach = await CoachModel.findByUserId(req.user.id);
    const studentId = Number(req.params.studentId);
    const [owned] = await pool.query(
      "SELECT id FROM students WHERE id = ? AND coach_id = ?",
      [studentId, coach.id]
    );
    if (!owned.length) {
      return res.status(403).json({ ok: false, message: "Ese alumno no está a tu cargo" });
    }
    const routines = await RoutineModel.findByStudentId(studentId);
    const routine = routines.find((item) => item.coach_id === coach.id) || routines[0];
    if (!routine) {
      return res.json({ ok: true, routine: null, days: [] });
    }
    const exercises = await RoutineExerciseModel.findByRoutineId(routine.id);
    return res.json({
      ok: true,
      routine,
      days: groupByDay(exercises, routine.title),
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const saveStudentRoutine = async (req, res) => {
  try {
    const coach = await CoachModel.findByUserId(req.user.id);
    if (!coach) {
      return res.status(404).json({ ok: false, message: "No se encontró el profesor" });
    }
    const { student_id, title, description, exercises } = req.body;
    if (!student_id || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ ok: false, message: "Faltan el alumno o los ejercicios" });
    }
    const [owned] = await pool.query(
      "SELECT id FROM students WHERE id = ? AND coach_id = ?",
      [student_id, coach.id]
    );
    if (!owned.length) {
      return res.status(403).json({ ok: false, message: "Ese alumno no está a tu cargo" });
    }

    const routines = await RoutineModel.findByStudentId(student_id);
    let routine = routines.find((item) => item.coach_id === coach.id);
    const today = new Date().toISOString().slice(0, 10);
    const later = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

    if (!routine) {
      routine = await RoutineModel.create({
        coach_id: coach.id,
        student_id,
        title: title || "Rutina semanal",
        description: description || "",
        start_date: today,
        end_date: later,
      });
    } else if (title) {
      await RoutineModel.update(routine.id, { title, description: description || null });
    }

    const previous = await RoutineExerciseModel.findByRoutineId(routine.id);
    const previousByKey = new Map(
      previous.map((row) => [`${row.exercise_name}-${row.day_of_week}`, row])
    );

    await pool.query("DELETE FROM routine_exercises WHERE routine_id = ?", [routine.id]);

    for (const item of exercises) {
      const catalog = await findOrCreateExercise({
        name: item.name,
        muscle_group: item.category || item.muscle_group || "General",
      });
      const dayOfWeek = item.day_of_week || "Lunes";
      const targetSets = Number(item.sets) || 3;
      const targetReps = Number(item.reps) || 10;
      const targetWeight = Number(item.weight) || 0;
      const prev = previousByKey.get(`${item.name}-${dayOfWeek}`);
      const hasActual =
        prev &&
        (prev.actual_sets != null || prev.actual_reps != null || prev.actual_weight != null);
      const adopted =
        hasActual &&
        Number(prev.actual_sets ?? targetSets) === targetSets &&
        Number(prev.actual_reps ?? targetReps) === targetReps &&
        Number(prev.actual_weight ?? targetWeight) === targetWeight;

      await RoutineExerciseModel.create({
        routine_id: routine.id,
        day_of_week: dayOfWeek,
        exercise_id: catalog.id,
        target_sets: targetSets,
        target_reps: targetReps,
        target_weight: targetWeight,
        actual_sets: hasActual && !adopted ? prev.actual_sets : null,
        actual_reps: hasActual && !adopted ? prev.actual_reps : null,
        actual_weight: hasActual && !adopted ? prev.actual_weight : null,
      });
    }

    const saved = await RoutineExerciseModel.findByRoutineId(routine.id);
    return res.json({
      ok: true,
      message: "Rutina guardada",
      routine,
      days: groupByDay(saved, title || routine.title),
    });
  } catch (error) {
    console.error("Error guardando rutina:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const logMyExerciseProgress = async (req, res) => {
  try {
    const parsed = logStudentProgressSchema.parse(req.body);
    const student = await StudentModel.findByUserId(req.user.id);
    if (!student) {
      return res.status(404).json({ ok: false, message: "No se encontró el alumno" });
    }
    const [owned] = await pool.query(
      `SELECT re.id
       FROM routine_exercises re
       JOIN routines r ON r.id = re.routine_id
       WHERE re.id = ? AND r.student_id = ?`,
      [Number(req.params.id), student.id]
    );
    if (!owned.length) {
      return res.status(403).json({ ok: false, message: "Ese ejercicio no es de tu rutina" });
    }
    await RoutineExerciseModel.logProgress(Number(req.params.id), parsed);
    const updated = await RoutineExerciseModel.findById(Number(req.params.id));
    return res.json({ ok: true, exercise: updated });
  } catch (error) {
    if (error.issues?.length) {
      return res.status(400).json({ ok: false, message: error.issues[0].message });
    }
    return res.status(500).json({ ok: false, message: error.message });
  }
};
