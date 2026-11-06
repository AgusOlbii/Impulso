import { RoutineModel } from "../models/routine.model.js";
import { CoachModel } from "../models/coach.model.js";
import { StudentModel } from "../models/student.model.js";

// Crear una nueva rutina completa (generalmente realizado por el Coach)
export const createRoutine = async (req, res) => {
    try {
        // Obtenemos el coach_id del token del usuario autenticado (o req.user.coach_id según tu implementación)
        const coach = await CoachModel.findByUserId(req.user.id);
        if (!coach) {
            return res.status(404).json({
                ok: false,
                message: "No se encontró el perfil de profesor",
            });
        }
        await StudentModel.ensureCoachColumn();
        const { student_id, title, description, start_date, end_date, exercises } = req.body;
        const student = await StudentModel.findById(student_id);
        if (!student || Number(student.coach_id) !== Number(coach.id)) {
            return res.status(403).json({
                ok: false,
                message: "Ese alumno no está a tu cargo",
            });
        }

        const routineId = await RoutineModel.create({
            coach_id: coach.id,
            student_id,
            title,
            description,
            start_date,
            end_date,
            exercises,
        });

        return res.status(201).json({
            ok: true,
            message: "Rutina creada exitosamente con sus ejercicios",
            routineId,
        });
    } catch (error) {
        console.error("Error al crear la rutina: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};

// Obtener una rutina específica por su ID (con todos los ejercicios asociados)
export const getRoutineById = async (req, res) => {
    try {
        const { id } = req.params;

        const routine = await RoutineModel.findById(id);

        if (!routine) {
            return res.status(404).json({
                ok: false,
                message: "Rutina no encontrada",
            });
        }

        return res.status(200).json({
            ok: true,
            routine,
        });
    } catch (error) {
        console.error("Error al obtener la rutina: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};

async function canSeeStudentRoutine(req, studentId) {
    if (req.user.rol === "admin") return true;
    if (req.user.rol === "student") {
        const me = await StudentModel.findByUserId(req.user.id);
        return Boolean(me && Number(me.id) === Number(studentId));
    }
    if (req.user.rol === "coach") {
        await StudentModel.ensureCoachColumn();
        const coach = await CoachModel.findByUserId(req.user.id);
        const student = await StudentModel.findById(studentId);
        return Boolean(coach && student && Number(student.coach_id) === Number(coach.id));
    }
    return false;
}

export const getMyRoutine = async (req, res) => {
    try {
        const student = await StudentModel.findByUserId(req.user.id);
        if (!student) {
            return res.status(404).json({ ok: false, message: "No se encontró el alumno" });
        }
        const routine = await RoutineModel.findLatestByStudentId(student.id);
        return res.status(200).json({ ok: true, routine });
    } catch (error) {
        console.error("Error al obtener la rutina del alumno: ", error);
        return res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
};

export const getLatestStudentRoutine = async (req, res) => {
    try {
        const { studentId } = req.params;
        if (!(await canSeeStudentRoutine(req, studentId))) {
            return res.status(403).json({ ok: false, message: "No podés ver esa rutina" });
        }
        const routine = await RoutineModel.findLatestByStudentId(studentId);
        return res.status(200).json({ ok: true, routine });
    } catch (error) {
        console.error("Error al obtener la rutina del alumno: ", error);
        return res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
};

// Obtener todas las rutinas de un estudiante específico
export const getStudentRoutines = async (req, res) => {
    try {
        const { studentId } = req.params;
        if (!(await canSeeStudentRoutine(req, studentId))) {
            return res.status(403).json({ ok: false, message: "No podés ver esas rutinas" });
        }

        const routines = await RoutineModel.findByStudentId(studentId);

        return res.status(200).json({
            ok: true,
            routines,
        });
    } catch (error) {
        console.error("Error al obtener las rutinas del estudiante: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};

export const updateRoutine = async (req, res) => {
    try {
        const coach = await CoachModel.findByUserId(req.user.id);
        if (!coach) {
            return res.status(404).json({
                ok: false,
                message: "No se encontró el perfil de profesor",
            });
        }
        const routine = await RoutineModel.findById(req.params.id);
        if (!routine || Number(routine.coach_id) !== Number(coach.id)) {
            return res.status(403).json({
                ok: false,
                message: "No podés modificar esa rutina",
            });
        }
        const { title, description, start_date, end_date, exercises } = req.body;
        await RoutineModel.replace(routine.id, {
            title,
            description,
            start_date,
            end_date,
            exercises,
        });
        return res.status(200).json({
            ok: true,
            message: "Rutina actualizada correctamente",
        });
    } catch (error) {
        console.error("Error al actualizar la rutina: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};

// Registrar o actualizar el progreso del alumno (actualizar actual_* y completed)
export const logProgress = async (req, res) => {
    try {
        const { exerciseId } = req.params; // ID de la tabla routine_exercises
        const student = await StudentModel.findByUserId(req.user.id);
        const row = await RoutineModel.findExerciseWithRoutine(exerciseId);
        if (!student || !row || Number(row.student_id) !== Number(student.id)) {
            return res.status(403).json({
                ok: false,
                message: "No podés modificar esa rutina",
            });
        }
        const { actual_sets, actual_reps, actual_weight, completed } = req.body;

        const updated = await RoutineModel.updateProgress(exerciseId, {
            actual_sets: actual_sets == null ? null : Number(actual_sets),
            actual_reps: actual_reps == null ? null : Number(actual_reps),
            actual_weight: actual_weight == null ? null : Number(actual_weight),
            completed,
        });

        if (!updated) {
            return res.status(404).json({
                ok: false,
                message: "Ejercicio de rutina no encontrado",
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Progreso registrado correctamente",
        });
    } catch (error) {
        console.error("Error al registrar el progreso: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};

// Eliminar una rutina por ID
export const deleteRoutine = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await RoutineModel.delete(id);

        if (!deleted) {
            return res.status(404).json({
                ok: false,
                message: "Rutina no encontrada para eliminar",
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Rutina eliminada correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar la rutina: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};