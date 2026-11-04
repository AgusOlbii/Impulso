import { RoutineModel } from "../models/routine.model.js";

// Crear una nueva rutina completa (generalmente realizado por el Coach)
export const createRoutine = async (req, res) => {
    try {
        // Obtenemos el coach_id del token del usuario autenticado (o req.user.coach_id según tu implementación)
        const coach_id = req.user.coach_id || req.user.id; 
        const { student_id, title, description, start_date, end_date, exercises } = req.body;

        const routineId = await RoutineModel.create({
            coach_id,
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

// Obtener todas las rutinas de un estudiante específico
export const getStudentRoutines = async (req, res) => {
    try {
        const { studentId } = req.params;

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

// Registrar o actualizar el progreso del alumno (actualizar actual_* y completed)
export const logProgress = async (req, res) => {
    try {
        const { exerciseId } = req.params; // ID de la tabla routine_exercises
        const { actual_sets, actual_reps, actual_weight, completed } = req.body;

        const updated = await RoutineModel.updateProgress(exerciseId, {
            actual_sets,
            actual_reps,
            actual_weight,
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