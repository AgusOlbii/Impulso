import { ExerciseModel } from "../models/exercise.model.js";

// Crear un ejercicio
export const createExercise = async (req, res) => {
    try {
        const { name, description, muscle_group, video_url } = req.body;

        // Validación nombre y grupo muscular obligatorio
        if (!name || !muscle_group) {
            return res.status(400).json({
                ok: false,
                message: "El nombre y el grupo muscular son obligatorios",
            });
        }

        const newExerciseId = await ExerciseModel.create({
            name,
            description,
            muscle_group,
            video_url,
        });

        return res.status(201).json({
            ok: true,
            message: "Ejercicio creado correctamente",
            exerciseId: newExerciseId,
        });
    } catch (error) {
        console.error("Error al crear el ejercicio: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};

// Obtener todos los ejercicios (o filtrar por nombre / grupo muscular si vienen por query params)
export const getExercises = async (req, res) => {
    try {
        const { name, muscle_group } = req.query;

        let exercises;

        // Si pasan un query param 'name', usamos findByName
        if (name) {
            exercises = await ExerciseModel.findByName(name);
        } 
        // Si pasan un query param 'muscle_group', usamos findByMuscleGroup
        else if (muscle_group) {
            exercises = await ExerciseModel.findByMuscleGroup(muscle_group);
        } 
        // Si no hay filtros, traemos todos
        else {
            exercises = await ExerciseModel.findAll();
        }

        return res.status(200).json({
            ok: true,
            exercises,
        });
    } catch (error) {
        console.error("Error al obtener los ejercicios: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};

// Eliminar un ejercicio por ID
export const deleteExercise = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await ExerciseModel.delete(id);

        if (!deleted) {
            return res.status(404).json({
                ok: false,
                message: "Ejercicio no encontrado para eliminar",
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Ejercicio eliminado correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar el ejercicio: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};