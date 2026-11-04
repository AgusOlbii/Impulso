import {RoutineExerciseModel} from "../models/routineExercise.model.js";

// Agregar un ejercicio individual a una rutina existente (Coach)
export const addExerciseToRoutine = async (req, res) => {
    try {
        const { routineId } = req.params;
        const { day_of_week, exercise_id, target_sets, target_reps, target_weight } = req.body;

        const newRoutineExercise = await RoutineExerciseModel.create({
            routine_id: routineId,
            day_of_week,
            exercise_id,
            target_sets,
            target_reps,
            target_weight
        });

        return res.status(201).json({
            ok: true,
            message: "Ejercicio agregado a la rutina exitosamente",
            data: newRoutineExercise
        });
    } catch (error) {
        console.error("Error al agregar ejercicio a la rutina:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Obtener todos los ejercicios de una rutina
export const getRoutineExercises = async (req, res) => {
    try {
        const { routineId } = req.params;
        const { day } = req.query; 

        let exercises;
        if (day) {
            exercises = await RoutineExerciseModel.findByRoutineAndDay(routineId, day);
        } else {
            exercises = await RoutineExerciseModel.findByRoutineId(routineId);
        }

        return res.status(200).json({
            ok: true,
            exercises
        });
    } catch (error) {
        console.error("Error al obtener los ejercicios de la rutina:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Registrar el progreso del alumno (Alumno o Coach)
export const updateExerciseProgress = async (req, res) => {
    try {
        const { id } = req.params; // ID de routine_exercises
        const { actual_sets, actual_reps, actual_weight, completed } = req.body;

        const updated = await RoutineExerciseModel.logProgress(id, {
            actual_sets,
            actual_reps,
            actual_weight,
            completed
        });

        if (!updated) {
            return res.status(404).json({
                ok: false,
                message: "Registro de ejercicio no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Progreso actualizado correctamente"
        });
    } catch (error) {
        console.error("Error al actualizar el progreso:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Actualizar metas asignadas por el profesor (Coach)
export const updateRoutineExerciseTarget = async (req, res) => {
    try {
        const { id } = req.params;
        const fieldsToUpdate = req.body; // Puede incluir target_sets, target_reps, target_weight, day_of_week

        const updated = await RoutineExerciseModel.update(id, fieldsToUpdate);

        if (!updated) {
            return res.status(404).json({
                ok: false,
                message: "Registro no encontrado o sin cambios"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Meta del ejercicio actualizada correctamente"
        });
    } catch (error) {
        console.error("Error al actualizar la meta del ejercicio:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Eliminar un ejercicio específico de la rutina (Coach)
export const removeExerciseFromRoutine = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await RoutineExerciseModel.delete(id);

        if (!deleted) {
            return res.status(404).json({
                ok: false,
                message: "Ejercicio en rutina no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Ejercicio eliminado de la rutina correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar el ejercicio de la rutina:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};